import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const inventoryFilePath = path.join(process.cwd(), 'data', 'inventory.json');

interface InventoryItem {
  code: string;
  name: string;
  room: string;
  checked: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const inventoryData: InventoryItem[] = req.body;

      // Validate data
      if (!Array.isArray(inventoryData)) {
        return res.status(400).json({ message: 'Inventory data must be an array' });
      }

      // Save to inventory file
      fs.writeFileSync(inventoryFilePath, JSON.stringify(inventoryData, null, 2));

      // Also save as a new export
      const exportResponse = await fetch('http://localhost:3000/api/exports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventoryData)
      });

      if (!exportResponse.ok) {
        throw new Error('Failed to create export record');
      }

      res.status(200).json({ 
        message: 'Inventory saved and export created',
        itemCount: inventoryData.length
      });

    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({ 
        message: 'Export failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method not allowed' });
  }
}