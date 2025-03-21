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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Read existing inventory and exports
      const inventory: InventoryItem[] = fs.existsSync(inventoryFilePath)
        ? JSON.parse(fs.readFileSync(inventoryFilePath, 'utf8'))
        : [];
      const exports: ExportData[] = fs.existsSync(exportsFilePath)
        ? JSON.parse(fs.readFileSync(exportsFilePath, 'utf8'))
        : [];

      // Merge exports into inventory
      exports.forEach((exp) => {
        exp.data.forEach((item) => {
          const existingItemIndex = inventory.findIndex((i) => i.code === item.code);

          if (existingItemIndex !== -1) {
            // If the item exists, update it only if the room matches
            const existingItem = inventory[existingItemIndex];
            if (existingItem.room === item.room) {
              // Update the item's room and checked status
              inventory[existingItemIndex] = {
                ...existingItem,
                room: item.room,
                checked: item.checked,
              };
            }
          } else {
            // If the item doesn't exist, add it to the inventory
            inventory.push(item);
          }
        });
      });

      // Save updated inventory
      fs.writeFileSync(inventoryFilePath, JSON.stringify(inventory, null, 2));

      // Clear exports
      fs.writeFileSync(exportsFilePath, JSON.stringify([], null, 2));

      res.status(200).json({ message: 'Data synchronized successfully!' });
    } catch (error) {
      console.error('Error synchronizing data:', error);
      res.status(500).json({ message: 'Failed to synchronize data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}