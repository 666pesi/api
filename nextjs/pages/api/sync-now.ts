import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const exportsDir = path.join(process.cwd(), 'data');
const pendingExportsFile = path.join(exportsDir, 'pending-exports.json');
const inventoryFile = path.join(exportsDir, 'inventory.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if there are pending exports
    if (!fs.existsSync(pendingExportsFile)) {
      return res.status(200).json({ message: 'No pending exports to sync' });
    }

    // Read pending exports
    let pendingExports = JSON.parse(fs.readFileSync(pendingExportsFile, 'utf-8'));
    
    // Filter only unsynced exports
    const exportsToSync = pendingExports.filter((exp: any) => !exp.synced);
    
    if (exportsToSync.length === 0) {
      return res.status(200).json({ message: 'No new exports to sync' });
    }

    // Process each export (merge into inventory)
    let inventory: any[] = [];
    if (fs.existsSync(inventoryFile)) {
      inventory = JSON.parse(fs.readFileSync(inventoryFile, 'utf-8'));
    }

    exportsToSync.forEach((exportData: any) => {
      // Your merging logic here - this is a simple example
      inventory = [...inventory, ...exportData.data];
      
      // Mark as synced
      exportData.synced = true;
    });

    // Save updated inventory
    fs.writeFileSync(inventoryFile, JSON.stringify(inventory, null, 2));

    // Save updated exports (marked as synced)
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