import { Request, Response } from 'express';
import { prisma } from '../services/db.js';
import { buildExecutionCodes, evaluateMips } from '../services/evaluator.js';
import { normalizeSpimToMars } from '../services/parser.js';
import { appError, catchAsync } from '../utils/AppError.js';

export const getExercises = catchAsync(async (req: Request, res: Response) => {
  const exercises = await prisma.exercise.findMany({
    include: { tests: true }
  });
  res.json(exercises);
});

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

export const updateExercise = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, teacherCode, language, isVisible } = req.body;

  const updateData: any = {};
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

export const deleteExercise = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.exercise.delete({
    where: { id: Number(id) }
  });
  res.json({ success: true });
});

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
    
    const cleanResult = execution.resultado.replace(/\r/g, '').trim();
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

export const deleteTestCase = catchAsync(async (req: Request, res: Response) => {
  const { testId } = req.params;
  await prisma.testCase.delete({
    where: { id: Number(testId) }
  });
  res.json({ success: true });
});

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