import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'inventory.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const newData = req.body;

      // Validate the incoming data
      if (!Array.isArray(newData)) {
        return res.status(400).json({ message: 'Invalid data format. Expected an array.' });
      }

      // Ensure the data directory exists
      const dataDir = path.dirname(filePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Write the data to the file
      await fs.promises.writeFile(filePath, JSON.stringify(newData, null, 2));

      res.status(200).json({ message: 'Data exported successfully!' });
    } catch (error) {
      console.error('Error exporting data:', error);
      res.status(500).json({ message: 'Failed to export data. Check server logs for details.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}