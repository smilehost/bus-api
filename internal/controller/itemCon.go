import { Request, Response } from 'express';
import { Item } from '../models/Item';

const itemController = {
  // GET /items
  getAll: async (req: Request, res: Response): Promise<void> => {
    const items: Item[] = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' }
    ];
    res.json(items);
  },

  // GET /items/:id
  getById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const item: Item = { id, name: 'Mocked Item' };
    res.json(item);
  },

  // POST /items
  create: async (req: Request, res: Response): Promise<void> => {
    const item = req.body as Item;
    if (!item.name) {
      res.status(400).json({ error: 'Invalid body' });
      return;
    }

    item.id = 'new-id'; // mock ID
    res.status(201).json(item);
  },

  // PUT /items/:id
  update: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const item = req.body as Item;
    if (!item.name) {
      res.status(400).json({ error: 'Invalid body' });
      return;
    }

    item.id = id;
    res.json(item);
  },

  // DELETE /items/:id
  delete: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    res.json({ message: `Deleted ${id}` });
  }
};

export default itemController;