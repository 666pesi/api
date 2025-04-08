import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Define types that match your frontend
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

// Path to store our export history
const exportsDir = path.join(process.cwd(), 'data');
const exportsFile = path.join(exportsDir, 'exports.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Create file with empty array if it doesn't exist
    if (!fs.existsSync(exportsFile)) {
      fs.writeFileSync(exportsFile, JSON.stringify([], null, 2));
      return res.status(200).json([]);
    }

    // Read and return existing exports
    const fileContent = fs.readFileSync(exportsFile, 'utf-8');
    const exportsData: ExportData[] = JSON.parse(fileContent);
    
    res.status(200).json(exportsData);
  } catch (error) {
    console.error('Error reading exports:', error);
    res.status(500).json({ message: 'Failed to load exports' });
  }
}