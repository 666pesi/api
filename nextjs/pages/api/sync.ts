// pages/api/sync.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'inventory.json');

interface InventoryItem {
  code: string;
  name: string;
  room: string;
  checked: boolean;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const incomingData: InventoryItem[] = req.body;
      const existingData: InventoryItem[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Merge incoming data with existing data
      const mergedData = mergeData(existingData, incomingData);

      // Write the merged data back to the file
      fs.writeFileSync(filePath, JSON.stringify(mergedData, null, 2));

      res.status(200).json({ message: 'Data synchronized successfully!' });
    } catch (error) {
      console.error('Error synchronizing data:', error);
      res.status(500).json({ message: 'Failed to synchronize data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

function mergeData(existingData: InventoryItem[], incomingData: InventoryItem[]): InventoryItem[] {
  const mergedData = [...existingData];

  incomingData.forEach((incomingItem) => {
    const existingItemIndex = mergedData.findIndex((item) => item.code === incomingItem.code);

    if (existingItemIndex !== -1) {
      // Update existing item
      mergedData[existingItemIndex] = { ...mergedData[existingItemIndex], ...incomingItem };
    } else {
      // Add new item
      mergedData.push(incomingItem);
    }
  });

  return mergedData;
}