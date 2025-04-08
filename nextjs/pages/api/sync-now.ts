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
      // Read existing inventory
      const inventory: InventoryItem[] = fs.existsSync(inventoryFilePath)
        ? JSON.parse(fs.readFileSync(inventoryFilePath, 'utf8'))
        : [];

      // Read all exports
      const allExports: ExportData[] = fs.existsSync(exportsFilePath)
        ? JSON.parse(fs.readFileSync(exportsFilePath, 'utf8'))
        : [];

      // Create a map to track checked items and their rooms
      const checkedItemsMap = new Map<string, string>();

      // First pass: Identify all checked items and their rooms
      allExports.forEach(exp => {
        exp.data.forEach(item => {
          if (item.checked) {
            checkedItemsMap.set(item.code, item.room);
          }
        });
      });

      // Create updated inventory
      const updatedInventory = [...inventory];

      // Process all exports
      allExports.forEach(exp => {
        exp.data.forEach(item => {
          const existingIndex = updatedInventory.findIndex(i => i.code === item.code);
          
          // If item was checked in any export, use that room
          const checkedRoom = checkedItemsMap.get(item.code);
          const finalRoom = checkedRoom || item.room;

          if (existingIndex !== -1) {
            // Update existing item
            updatedInventory[existingIndex] = {
              ...updatedInventory[existingIndex],
              ...item,
              room: finalRoom, // Use room from checked item if available
              checked: updatedInventory[existingIndex].checked || item.checked // Preserve checked status
            };
          } else {
            // Add new item
            updatedInventory.push({
              ...item,
              room: finalRoom // Use room from checked item if available
            });
          }
        });
      });

      // Save updated inventory
      fs.writeFileSync(inventoryFilePath, JSON.stringify(updatedInventory, null, 2));

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