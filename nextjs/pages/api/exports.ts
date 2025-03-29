import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const exportsFilePath = path.join(process.cwd(), 'data', 'exports.json');

interface InventoryItem {
  code: string;
  name: string;
  room: string;
  checked: boolean;
}

interface ExportData {
  id: string;
  data: InventoryItem[];
  receivedAt: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const exports: ExportData[] = fs.existsSync(exportsFilePath)
        ? JSON.parse(fs.readFileSync(exportsFilePath, 'utf8'))
        : [];
      res.status(200).json(exports);
    } catch (error) {
      console.error('Error loading exports:', error);
      res.status(500).json({ message: 'Failed to load exports' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}