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
  if (req.method === 'POST') {
    try {
      const newData: InventoryItem[] = req.body;
      fs.writeFileSync(inventoryFilePath, JSON.stringify(newData, null, 2));
      res.status(200).json({ message: 'Inventory saved successfully!' });
    } catch (error) {
      console.error('Error saving inventory:', error);
      res.status(500).json({ message: 'Failed to save inventory' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}