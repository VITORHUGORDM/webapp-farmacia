import { Router } from 'express';
import { Low, JSONFile } from 'lowdb';
import path from 'path';
import { nanoid } from 'nanoid';

type Item = {
  id: string;
  [key: string]: any;
};

type Schema = {
  items: Item[];
};

const file = path.resolve(__dirname, '../../data/db.json');
const adapter = new JSONFile<Schema>(file);
const db = new Low<Schema>(adapter);

// Inicializa DB se necessário
async function initDB() {
  await db.read();
  db.data ||= { items: [] };
  await db.write();
}
initDB();

const router = Router();

// GET /api/items
router.get('/', async (_req, res) => {
  await db.read();
  res.json(db.data?.items || []);
});

// GET /api/items/:id
router.get('/:id', async (req, res) => {
  await db.read();
  const item = db.data?.items.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
});

// POST /api/items
router.post('/', async (req, res) => {
  await db.read();
  const newItem: Item = { id: nanoid(), ...req.body };
  db.data!.items.push(newItem);
  await db.write();
  res.status(201).json(newItem);
});

// PUT /api/items/:id
router.put('/:id', async (req, res) => {
  await db.read();
  const idx = db.data!.items.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Item not found' });
  const updated = { ...db.data!.items[idx], ...req.body };
  db.data!.items[idx] = updated;
  await db.write();
  res.json(updated);
});

// DELETE /api/items/:id
router.delete('/:id', async (req, res) => {
  await db.read();
  const idx = db.data!.items.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Item not found' });
  const [deleted] = db.data!.items.splice(idx, 1);
  await db.write();
  res.json(deleted);
});

export default router;