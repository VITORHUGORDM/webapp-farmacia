import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// Serve o dados.json que já existe na raiz do repositório
router.get('/', async (_req, res, next) => {
  try {
    const dadosPath = path.resolve(__dirname, '../../dados.json');
    const raw = await fs.promises.readFile(dadosPath, 'utf-8');
    const json = JSON.parse(raw);
    res.json(json);
  } catch (err) {
    next(err);
  }
});

export default router;