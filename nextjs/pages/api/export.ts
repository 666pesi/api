// pages/api/export.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const exportsFilePath = path.join(process.cwd(), 'data', 'exports.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const newData = req.body;

      // Read existing exports
      const existingExports = fs.existsSync(exportsFilePath)
        ? JSON.parse(fs.readFileSync(exportsFilePath, 'utf8'))
        : [];

      // Add new export
      const newExport = {
        id: `export-${Date.now()}`,
        data: newData,
        receivedAt: new Date().toISOString(),
      };
      existingExports.push(newExport);

      // Save updated exports
      fs.writeFileSync(exportsFilePath, JSON.stringify(existingExports, null, 2));

      res.status(200).json({ message: 'Data exported successfully!' });
    } catch (error) {
      console.error('Error exporting data:', error);
      res.status(500).json({ message: 'Failed to export data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}