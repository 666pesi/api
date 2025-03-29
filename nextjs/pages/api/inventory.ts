import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'inventory.json');

interface InventoryItem {
  code: string;
  name: string;
  room: string;
  checked: boolean;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      res.status(200).json(JSON.parse(data));
    } catch (error) {
      console.error('Error loading inventory:', error);
      res.status(500).json({ message: 'Failed to load inventory' });
    }
  } else if (req.method === 'POST') {
    try {
      const inventoryData: InventoryItem[] = req.body;
      fs.writeFileSync(filePath, JSON.stringify(inventoryData, null, 2));
      res.status(200).json({ message: 'Inventory updated successfully' });
    } catch (error) {
      console.error('Error saving inventory:', error);
      res.status(500).json({ message: 'Failed to update inventory' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}