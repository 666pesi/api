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

interface ExportData {
  id: string;
  data: InventoryItem[];
  receivedAt: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Read existing exports
      if (!fs.existsSync(inventoryFilePath)) {
        return res.status(200).json([]);
      }
      
      const fileContent = fs.readFileSync(inventoryFilePath, 'utf-8');
      const data = JSON.parse(fileContent);
      
      // Format as ExportData array
      const exportData: ExportData = {
        id: '1', // You might want to generate a proper ID
        data: data,
        receivedAt: new Date().toISOString()
      };
      
      res.status(200).json([exportData]);
    } 
    else if (req.method === 'POST') {
      const newData: InventoryItem[] = req.body;
      fs.writeFileSync(inventoryFilePath, JSON.stringify(newData, null, 2));
      res.status(200).json({ message: 'Data exported successfully!' });
    } 
    else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}