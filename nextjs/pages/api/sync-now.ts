import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const inventoryFilePath = path.join(process.cwd(), 'data', 'inventory.json');
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 1. Load current data
    const [currentInventory, pendingExports] = await Promise.all([
      fs.existsSync(inventoryFilePath)
        ? JSON.parse(fs.readFileSync(inventoryFilePath, 'utf8'))
        : [],
      fs.existsSync(exportsFilePath)
        ? JSON.parse(fs.readFileSync(exportsFilePath, 'utf8'))
        : []
    ]);

    if (pendingExports.length === 0) {
      return res.status(200).json({ 
        message: 'No exports to sync', 
        inventory: currentInventory 
      });
    }

    // 2. Process all pending exports
    const updatedInventory = [...currentInventory];
    
    pendingExports.forEach((exportData: ExportData) => {
      exportData.data.forEach((item) => {
        const existingIndex = updatedInventory.findIndex(i => i.code === item.code);
        
        if (existingIndex >= 0) {
          // Update existing item
          updatedInventory[existingIndex] = { 
            ...updatedInventory[existingIndex], 
            ...item 
          };
        } else {
          // Add new item
          updatedInventory.push(item);
        }
      });
    });

    // 3. Save changes
    fs.writeFileSync(inventoryFilePath, JSON.stringify(updatedInventory, null, 2));
    fs.writeFileSync(exportsFilePath, JSON.stringify([], null, 2)); // Clear exports

    res.status(200).json({ 
      message: `Synced ${pendingExports.length} export(s) successfully`,
      updatedItems: updatedInventory.length - currentInventory.length,
      totalItems: updatedInventory.length
    });

  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ 
      message: 'Sync failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}