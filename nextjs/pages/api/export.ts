import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const exportsFilePath = path.join(process.cwd(), 'data', 'exports.json');
const inventoryFilePath = path.join(process.cwd(), 'data', 'inventory.json');

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
      
      // Create export record
      const exportRecord: ExportData = {
        id: Date.now().toString(),
        data: newData,
        receivedAt: new Date().toISOString(),
      };

      // Read existing exports
      const existingExports: ExportData[] = fs.existsSync(exportsFilePath)
        ? JSON.parse(fs.readFileSync(exportsFilePath, 'utf8'))
        : [];

      // Add new export record
      existingExports.push(exportRecord);

      // Save to exports.json
      fs.writeFileSync(exportsFilePath, JSON.stringify(existingExports, null, 2));
      
      res.status(200).json({ message: 'Export received successfully!' });
    } catch (error) {
      console.error('Error processing export:', error);
      res.status(500).json({ message: 'Failed to process export' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}