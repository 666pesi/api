// pages/api/sync.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const inventoryFilePath = path.join(process.cwd(), 'data', 'inventory.json');
const exportsFilePath = path.join(process.cwd(), 'data', 'exports.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Read existing inventory and exports
      const inventory = fs.existsSync(inventoryFilePath)
        ? JSON.parse(fs.readFileSync(inventoryFilePath, 'utf8'))
        : [];
      const exports = fs.existsSync(exportsFilePath)
        ? JSON.parse(fs.readFileSync(exportsFilePath, 'utf8'))
        : [];

      // Merge all exports into inventory
      exports.forEach((exp: any) => {
        exp.data.forEach((item: any) => {
          const existingItemIndex = inventory.findIndex((i: any) => i.code === item.code);
          if (existingItemIndex !== -1) {
            inventory[existingItemIndex] = { ...inventory[existingItemIndex], ...item };
          } else {
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