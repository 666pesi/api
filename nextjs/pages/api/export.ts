import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const filePath = path.join(process.cwd(), 'data', 'inventory.json');
    const newData = req.body;

    // Save the new data to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));

    res.status(200).json({ message: 'Data exported successfully!' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}