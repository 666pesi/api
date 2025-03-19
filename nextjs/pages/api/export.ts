import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'inventory.json');

// In-memory store for inventory data
let inventoryData: any[] = [];

// Load initial data from inventory.json
try {
  const data = fs.readFileSync(filePath, 'utf8');
  inventoryData = JSON.parse(data);
} catch (error) {
  console.error('Error loading initial data:', error);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const newData = req.body;

      // Validate the incoming data
      if (!Array.isArray(newData)) {
        return res.status(400).json({ message: 'Invalid data format. Expected an array.' });
      }

      // Update the in-memory store
      inventoryData = newData;

      // Simulate writing to a file (not actually written to disk on Vercel)
      console.log('Simulating write to inventory.json:', newData);

      res.status(200).json({ message: 'Data updated in memory successfully!' });
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).json({ message: 'Failed to update data.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}