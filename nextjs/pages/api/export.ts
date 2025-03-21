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
  if (req.method === 'POST') {
    try {
      const newData: InventoryItem[] = req.body;
      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
      res.status(200).json({ message: 'Data exported successfully!' });
    } catch (error) {
      console.error('Error exporting data:', error);
      res.status(500).json({ message: 'Failed to export data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}