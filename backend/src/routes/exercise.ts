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