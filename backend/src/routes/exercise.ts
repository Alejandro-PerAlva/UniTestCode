/**
 * @module ExerciseRoutes
 * Defines the Express router for exercise-related endpoints.
 * * Endpoints:
 * - GET    /                  : Fetch all exercises
 * - POST   /                  : Create a new exercise
 * - POST   /import            : Bulk import exercises
 * - PUT    /:id               : Update a specific exercise
 * - DELETE /:id               : Remove a specific exercise
 * - POST   /:id/tests         : Add a test case to an exercise
 * - DELETE /:id/tests/:testId : Remove a test case from an exercise
 * - POST   /:id/evaluate      : Run student code against an exercise's tests
 */

import { Router } from 'express';
import { 
    getExercises, 
    createExercise, 
    updateExercise, 
    deleteExercise, 
    evaluateExercise, 
    createTestCase, 
    deleteTestCase,
    importExercises
} from '../controllers/exercise.js';

const router = Router();

router.get('/', getExercises);
router.post('/', createExercise);
router.post('/import', importExercises);
router.put('/:id', updateExercise);
router.delete('/:id', deleteExercise);

router.post('/:id/tests', createTestCase);
router.delete('/:id/tests/:testId', deleteTestCase);

router.post('/:id/evaluate', evaluateExercise);

export default router;