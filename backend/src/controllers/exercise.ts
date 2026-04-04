import { Request, Response } from 'express';
import { prisma } from '../services/db.js';
import { buildExecutionCodes, evaluateMips } from '../services/evaluator.js';
import { normalizeSpimToMars } from '../services/parser.js';

export const getExercises = async (req: Request, res: Response) => {
  try {
    const exercises = await prisma.exercise.findMany({
      include: { tests: true }
    });
    res.json(exercises);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createExercise = async (req: Request, res: Response) => {
  try {
    const { title, description, teacherCode, tests, language = "mips", isVisible = true } = req.body;
    
    let teacherCodeMars = teacherCode || "";
    if (language === "mips") {
      teacherCodeMars = normalizeSpimToMars(teacherCode || "");
    }

    const exercise = await prisma.exercise.create({
      data: {
        title,
        description,
        language,
        isVisible,
        teacherCode: teacherCode || "",
        teacherCodeMars,
        tests: tests ? {
          create: tests
        } : undefined
      },
      include: { tests: true }
    });
    res.json(exercise);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, teacherCode, language, isVisible } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (isVisible !== undefined) updateData.isVisible = isVisible;
    if (language !== undefined) updateData.language = language;

    // Si el profesor actualiza el código, lo volvemos a purificar
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.exercise.delete({
      where: { id: Number(id) }
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const evaluateExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { studentCode, targetFunction } = req.body;

    const exercise = await prisma.exercise.findUnique({
      where: { id: Number(id) },
      include: { tests: true }
    });

    if (!exercise) return res.status(404).json({ error: "Ejercicio no encontrado" });

    let codeToExecute = "";
    
    try {
      const codeToUse = exercise.teacherCodeMars || exercise.teacherCode || "";
      const codes = buildExecutionCodes(studentCode, codeToUse, targetFunction);
      codeToExecute = codes.finalStudentCode;
    } catch (err: any) {
      return res.status(400).json({ error: err.message, results: [] });
    }

    const results = [];

    for (const test of exercise.tests) {
      const inputsArray = test.inputs ? test.inputs.split('\n') : [];
      const execution = await evaluateMips(codeToExecute, inputsArray);
      
      const cleanResult = execution.resultado.replace(/\r/g, '').trim();
      const cleanExpected = test.expected.replace(/\r/g, '').trim();
      const isPassed = cleanResult === cleanExpected;

      results.push({
        testId: test.id,
        passed: isPassed,
        output: cleanResult,
        expected: cleanExpected,
        error: execution.error,
        timeout: execution.timeout
      });
    }

    const allPassed = results.every(r => r.passed);
    res.json({ success: true, allPassed, results });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createTestCase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { inputs, expected } = req.body;
    
    const testCase = await prisma.testCase.create({
      data: {
        exerciseId: Number(id),
        inputs,
        expected
      }
    });
    
    res.json(testCase);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTestCase = async (req: Request, res: Response) => {
  try {
    const { testId } = req.params;
    await prisma.testCase.delete({
      where: { id: Number(testId) }
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const importExercises = async (req: Request, res: Response) => {
  try {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};