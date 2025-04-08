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
  // GET - List all exports
  if (req.method === 'GET') {
    try {
      if (!fs.existsSync(exportsFilePath)) {
        return res.status(200).json([]);
      }

      const fileData = fs.readFileSync(exportsFilePath, 'utf8');
      const exports: ExportData[] = JSON.parse(fileData);
      
      // Validate data structure
      const validExports = exports.filter(exp => 
        exp.id && exp.data && Array.isArray(exp.data) && exp.receivedAt
      );

      res.status(200).json(validExports);
    } catch (error) {
      console.error('Error loading exports:', error);
      res.status(500).json({ message: 'Failed to load exports' });
    }
  }
  // POST - Create new export
  else if (req.method === 'POST') {
    try {
      const newExport: ExportData = {
        id: Date.now().toString(),
        data: req.body,
        receivedAt: new Date().toISOString()
      };

      // Validate data
      if (!Array.isArray(newExport.data)) {
        return res.status(400).json({ message: 'Invalid data format' });
      }

      const existingExports = fs.existsSync(exportsFilePath)
        ? JSON.parse(fs.readFileSync(exportsFilePath, 'utf8'))
        : [];

      const updatedExports = [...existingExports, newExport];
      fs.writeFileSync(exportsFilePath, JSON.stringify(updatedExports, null, 2));

      res.status(201).json(newExport);
    } catch (error) {
      console.error('Error saving export:', error);
      res.status(500).json({ message: 'Failed to save export' });
    }
  }
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}