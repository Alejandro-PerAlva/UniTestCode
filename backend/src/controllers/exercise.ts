/**
 * @module ExerciseControllers
 * Handles all HTTP requests related to the creation, modification, evaluation, 
 * and bulk-import of programming exercises and their associated test cases.
 */

import { Request, Response } from 'express';
import { prisma } from '../services/db.js';
import { buildExecutionCodes, evaluateMips } from '../services/evaluator.js';
import { normalizeSpimToMars } from '../services/parser.js';
import { appError, catchAsync } from '../utils/appError.js';

/**
 * Retrieves all available exercises along with their associated test cases.
 * * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns A JSON array of all exercises.
 */
export const getExercises = catchAsync(async (req: Request, res: Response) => {
  const exercises = await prisma.exercise.findMany({
    include: { tests: true }
  });
  res.json(exercises);
});

/**
 * Creates a new programming exercise in the database.
 * If the selected language is MIPS, it automatically parses the teacher's code
 * into strict MARS syntax for future evaluations.
 * * @param req - The Express request object containing exercise metadata and optional tests.
 * @param res - The Express response object.
 * @returns A JSON representation of the newly created exercise.
 */
export const createExercise = catchAsync(async (req: Request, res: Response) => {
  const { title, description, teacherCode, tests, language = "mips", isVisible = true } = req.body;
  
  const teacherCodeMars = language === "mips" ? normalizeSpimToMars(teacherCode || "") : (teacherCode || "");

  const exercise = await prisma.exercise.create({
    data: {
      title,
      description,
      language,
      isVisible,
      teacherCode: teacherCode || "",
      teacherCodeMars,
      tests: tests ? { create: tests } : undefined
    },
    include: { tests: true }
  });
  res.status(201).json(exercise);
});

/**
 * Updates an existing exercise.
 * Conditionally updates the MARS parsed code only if the raw teacher code is modified.
 * * @param req - The Express request object containing the exercise ID and fields to update.
 * @param res - The Express response object.
 * @returns A JSON representation of the updated exercise.
 */
export const updateExercise = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, teacherCode, language, isVisible } = req.body;

  const updateData: Record<string, any> = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (isVisible !== undefined) updateData.isVisible = isVisible;
  if (language !== undefined) updateData.language = language;

  if (teacherCode !== undefined) {
    updateData.teacherCode = teacherCode;
    updateData.teacherCodeMars = (updateData.language || "mips") === "mips" 
      ? normalizeSpimToMars(teacherCode) 
      : teacherCode;
  }

  const exercise = await prisma.exercise.update({
    where: { id: Number(id) },
    data: updateData,
    include: { tests: true }
  });
  
  res.json(exercise);
});

/**
 * Deletes a specific exercise by its ID.
 * * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns A JSON success flag.
 */
export const deleteExercise = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.exercise.delete({
    where: { id: Number(id) }
  });
  res.json({ success: true });
});

/**
 * Evaluates a student's code submission against all defined test cases for a specific exercise.
 * Leverages the evaluator service to spawn isolated simulator processes.
 * * @param req - The Express request object containing the student's code and target function.
 * @param res - The Express response object.
 * @throws {appError} 404 - If the requested exercise does not exist.
 * @throws {appError} 400 - If there is an error building the execution context (e.g., missing labels).
 * @returns A JSON payload detailing the success status and individual test results.
 */
export const evaluateExercise = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { studentCode, targetFunction } = req.body;

  const exercise = await prisma.exercise.findUnique({
    where: { id: Number(id) },
    include: { tests: true }
  });

  if (!exercise) throw new appError("Ejercicio no encontrado", 404);

  let codeToExecute = "";
  
  try {
    const codeToUse = exercise.teacherCodeMars || exercise.teacherCode || "";
    const codes = buildExecutionCodes(studentCode, codeToUse, targetFunction);
    codeToExecute = codes.finalStudentCode;
  } catch (err: any) {
    throw new appError(err.message, 400);
  }

  const testPromises = exercise.tests.map(async (test) => {
    const inputsArray = test.inputs ? test.inputs.split('\n') : [];
    const execution = await evaluateMips(codeToExecute, inputsArray);
    
    // Normalizing carriage returns to ensure accurate cross-platform string comparison
    const cleanResult = execution.output.replace(/\r/g, '').trim();
    const cleanExpected = test.expected.replace(/\r/g, '').trim();
    const isPassed = cleanResult === cleanExpected;

    return {
      testId: test.id,
      passed: isPassed,
      output: cleanResult,
      expected: cleanExpected,
      error: execution.error,
      timeout: execution.timeout
    };
  });

  const results = await Promise.all(testPromises);
  const allPassed = results.every(r => r.passed);
  res.json({ success: true, allPassed, results });
});

/**
 * Appends a new test case (inputs and expected output) to an existing exercise.
 * * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns A JSON representation of the newly created test case.
 */
export const createTestCase = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { inputs, expected } = req.body;
  
  const testCase = await prisma.testCase.create({
    data: {
      exerciseId: Number(id),
      inputs,
      expected
    }
  });
  
  res.status(201).json(testCase);
});

/**
 * Deletes a specific test case from an exercise.
 * * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns A JSON success flag.
 */
export const deleteTestCase = catchAsync(async (req: Request, res: Response) => {
  const { testId } = req.params;
  await prisma.testCase.delete({
    where: { id: Number(testId) }
  });
  res.json({ success: true });
});

/**
 * Bulk imports an array of exercises into the database.
 * Skips processing for exercises that already exist (matched by title) to prevent duplicates.
 * * @param req - The Express request object containing an array of exercise definitions.
 * @param res - The Express response object.
 * @returns A JSON payload indicating the number of successfully imported and skipped exercises.
 */
export const importExercises = catchAsync(async (req: Request, res: Response) => {
  const exercises = req.body;
  let imported = 0;
  let skipped = 0;

  for (const ex of exercises) {
    const existing = await prisma.exercise.findFirst({
      where: { title: ex.title }
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.exercise.create({
      data: {
        title: ex.title,
        description: ex.description,
        language: ex.language || 'mips',
        isVisible: ex.isVisible ?? true,
        teacherCode: ex.teacherCode,
        teacherCodeMars: ex.teacherCodeMars,
        tests: {
          create: ex.tests?.map((t: any) => ({
            inputs: t.inputs,
            expected: t.expected
          })) || []
        }
      }
    });
    imported++;
  }
  res.json({ success: true, imported, skipped });
});