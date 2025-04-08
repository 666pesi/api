import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const exportsDir = path.join(process.cwd(), 'data');
const pendingExportsFile = path.join(exportsDir, 'pending-exports.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Return empty array if no exports exist
    if (!fs.existsSync(pendingExportsFile)) {
      return res.status(200).json([]);
    }

    // Read and return only unsynced exports
    const allExports = JSON.parse(fs.readFileSync(pendingExportsFile, 'utf-8'));
    const pendingExports = allExports.filter((exp: any) => !exp.synced);

    res.status(200).json(pendingExports);
  } catch (error) {
    console.error('Error loading exports:', error);
    res.status(500).json({ message: 'Failed to load exports' });
  }
}