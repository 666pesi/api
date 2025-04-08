import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const exportsDir = path.join(process.cwd(), 'data');
const pendingExportsFile = path.join(exportsDir, 'pending-exports.json');
const inventoryFile = path.join(exportsDir, 'inventory.json');

interface InventoryItem {
  code: string;
  name: string;
  room: string;
  checked: boolean;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Create directory if needed
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Get the export data from mobile app
    const exportData: InventoryItem[] = req.body;

    // Create new export record
    const newExport = {
      id: Date.now().toString(),
      data: exportData,
      receivedAt: new Date().toISOString(),
      synced: false
    };

    // Read existing pending exports or initialize empty array
    let pendingExports = [];
    if (fs.existsSync(pendingExportsFile)) {
      pendingExports = JSON.parse(fs.readFileSync(pendingExportsFile, 'utf-8'));
    }

    // Add new export
    pendingExports.push(newExport);

    // Save updated pending exports
    fs.writeFileSync(pendingExportsFile, JSON.stringify(pendingExports, null, 2));

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving export:', error);
    res.status(500).json({ message: 'Failed to save export' });
  }
}