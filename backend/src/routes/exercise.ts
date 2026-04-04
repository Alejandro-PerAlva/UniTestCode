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
router.post('/import', importExercises as any);
router.put('/:id', updateExercise as any);
router.delete('/:id', deleteExercise as any);

router.post('/:id/tests', createTestCase as any);
router.delete('/:id/tests/:testId', deleteTestCase as any);

router.post('/:id/evaluate', evaluateExercise as any);

export default router;