import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const inventoryFilePath = path.join(process.cwd(), 'data', 'inventory.json');

interface InventoryItem {
  code: string;
  name: string;
  room: string;
  checked: boolean;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = fs.readFileSync(inventoryFilePath, 'utf8');
    res.status(200).json(JSON.parse(data));
  } catch (error) {
    console.error('Error loading data:', error);
    res.status(500).json({ message: 'Failed to load data' });
  }
}