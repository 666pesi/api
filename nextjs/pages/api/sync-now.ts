import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

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

const exportsDir = path.join(process.cwd(), 'data');
const exportsFile = path.join(exportsDir, 'exports.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // In a real app, you would get this data from your sync source
    // For now, we'll use dummy data
    const newExportData: InventoryItem[] = [
      { code: '001', name: 'Item 1', room: 'Room A', checked: true },
      { code: '002', name: 'Item 2', room: 'Room B', checked: false },
      // Add more items as needed
    ];

    // Create directory if it doesn't exist
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Read existing exports or initialize empty array
    let existingExports: ExportData[] = [];
    if (fs.existsSync(exportsFile)) {
      const fileContent = fs.readFileSync(exportsFile, 'utf-8');
      existingExports = JSON.parse(fileContent);
    }

    // Create new export record
    const newExport: ExportData = {
      id: Date.now().toString(), // Simple ID generation
      data: newExportData,
      receivedAt: new Date().toISOString(),
    };

    // Add new export to beginning of array (most recent first)
    const updatedExports = [newExport, ...existingExports];

    // Save updated exports
    fs.writeFileSync(exportsFile, JSON.stringify(updatedExports, null, 2));

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ message: 'Sync failed' });
  }
}