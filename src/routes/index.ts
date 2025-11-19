import { Router } from 'express';
import dadosRouter from './dados';
import itemsRouter from './items';

const router = Router();

router.use('/dados', dadosRouter);
router.use('/items', itemsRouter);

export default router;