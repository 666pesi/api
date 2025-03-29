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
  if (req.method === 'POST') {
    try {
      const newData: InventoryItem[] = req.body;

      // Read existing exports
      const existingExports: ExportData[] = fs.existsSync(exportsFilePath)
        ? JSON.parse(fs.readFileSync(exportsFilePath, 'utf8'))
        : [];

      // Add new export
      const newExport: ExportData = {
        id: `export-${Date.now()}`,
        data: newData,
        receivedAt: new Date().toISOString(),
      };
      existingExports.push(newExport);

      // Save updated exports
      fs.writeFileSync(exportsFilePath, JSON.stringify(existingExports, null, 2));

      res.status(200).json({ message: 'Data received and preserved for sync!' });
    } catch (error) {
      console.error('Error receiving data:', error);
      res.status(500).json({ message: 'Failed to receive data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}