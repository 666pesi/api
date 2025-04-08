import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const exportsDir = path.join(process.cwd(), 'data');
const pendingExportsFile = path.join(exportsDir, 'pending-exports.json');

interface InventoryItem {
  code: string;
  name: string;
  room: string;
  checked: boolean;
}

interface ExportRecord {
  id: string;
  data: InventoryItem[];
  receivedAt: string;
  synced: boolean;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    const exportData: InventoryItem[] = req.body;
    const newExport: ExportRecord = {
      id: Date.now().toString(),
      data: exportData,
      receivedAt: new Date().toISOString(),
      synced: false
    };

    let pendingExports: ExportRecord[] = [];
    if (fs.existsSync(pendingExportsFile)) {
      pendingExports = JSON.parse(fs.readFileSync(pendingExportsFile, 'utf-8'));
    }

    pendingExports.push(newExport);
    fs.writeFileSync(pendingExportsFile, JSON.stringify(pendingExports, null, 2));

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving export:', error);
    res.status(500).json({ message: 'Failed to save export' });
  }
}