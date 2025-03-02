import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), 'data', 'inventory.json');
  const data = fs.readFileSync(filePath, 'utf8');
  res.status(200).json(JSON.parse(data));
}