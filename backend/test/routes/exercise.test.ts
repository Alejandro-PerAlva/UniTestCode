/**
 * @module ExerciseRoutesTests
 * @description Unit tests for exercise management routes, including evaluation and test case endpoints.
 */

import request from 'supertest';
import express from 'express';
import exerciseRoutes from '../../src/routes/exercise.js';
import * as exerciseControllers from '../../src/controllers/exercise.js';

// Mock all controllers in the module
jest.mock('../../src/controllers/exercise.js', () => ({
  getExercises: jest.fn((req, res) => res.json([])),
  createExercise: jest.fn((req, res) => res.status(201).json({})),
  importExercises: jest.fn((req, res) => res.json({})),
  updateExercise: jest.fn((req, res) => res.json({})),
  deleteExercise: jest.fn((req, res) => res.json({})),
  createTestCase: jest.fn((req, res) => res.status(201).json({})),
  deleteTestCase: jest.fn((req, res) => res.json({})),
  evaluateExercise: jest.fn((req, res) => res.json({}))
}));

const app = express();
app.use(express.json());
app.use('/exercises', exerciseRoutes);

describe('Exercise Routes', () => {
  it('should map GET / to getExercises', async () => {
    await request(app).get('/exercises');
    expect(exerciseControllers.getExercises).toHaveBeenCalled();
  });

  it('should map POST / to createExercise', async () => {
    await request(app).post('/exercises');
    expect(exerciseControllers.createExercise).toHaveBeenCalled();
  });

  it('should map POST /import to importExercises', async () => {
    await request(app).post('/exercises/import');
    expect(exerciseControllers.importExercises).toHaveBeenCalled();
  });

  it('should map PUT /:id to updateExercise', async () => {
    await request(app).put('/exercises/1');
    expect(exerciseControllers.updateExercise).toHaveBeenCalled();
  });

  it('should map DELETE /:id to deleteExercise', async () => {
    await request(app).delete('/exercises/1');
    expect(exerciseControllers.deleteExercise).toHaveBeenCalled();
  });

  it('should map POST /:id/tests to createTestCase', async () => {
    await request(app).post('/exercises/1/tests');
    expect(exerciseControllers.createTestCase).toHaveBeenCalled();
  });

  it('should map DELETE /:id/tests/:testId to deleteTestCase', async () => {
    await request(app).delete('/exercises/1/tests/100');
    expect(exerciseControllers.deleteTestCase).toHaveBeenCalled();
  });

  it('should map POST /:id/evaluate to evaluateExercise', async () => {
    await request(app).post('/exercises/1/evaluate');
    expect(exerciseControllers.evaluateExercise).toHaveBeenCalled();
  });
});