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
    if (!fs.existsSync(pendingExportsFile)) {
      return res.status(200).json({ message: 'No pending exports to sync' });
    }

    const pendingExports: ExportRecord[] = JSON.parse(fs.readFileSync(pendingExportsFile, 'utf-8'));
    const exportsToSync = pendingExports.filter(exp => !exp.synced);
    
    if (exportsToSync.length === 0) {
      return res.status(200).json({ message: 'No new exports to sync' });
    }

    let inventory: InventoryItem[] = [];
    if (fs.existsSync(inventoryFile)) {
      inventory = JSON.parse(fs.readFileSync(inventoryFile, 'utf-8'));
    }

    exportsToSync.forEach(exportData => {
      inventory = [...inventory, ...exportData.data];
      exportData.synced = true;
    });

    fs.writeFileSync(inventoryFile, JSON.stringify(inventory, null, 2));
    fs.writeFileSync(pendingExportsFile, JSON.stringify(pendingExports, null, 2));

    res.status(200).json({ 
      success: true,
      syncedCount: exportsToSync.length 
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ message: 'Sync failed' });
  }
}