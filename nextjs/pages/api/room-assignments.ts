import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'room_assignments.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '{}';
      res.status(200).json(JSON.parse(data));
    } catch (err) {
      console.error('Error loading room assignments:', err);
      res.status(500).json({ message: 'Failed to load room assignments' });
    }
  } else if (req.method === 'POST') {
    try {
      const { username, rooms } = req.body;
      const assignments = fs.existsSync(filePath)
        ? JSON.parse(fs.readFileSync(filePath, 'utf8'))
        : {};
      
      assignments[username] = rooms;
      fs.writeFileSync(filePath, JSON.stringify(assignments, null, 2));
      res.status(200).json({ message: 'Assignments updated successfully!' });
    } catch (err) {
      console.error('Error updating assignments:', err);
      res.status(500).json({ message: 'Failed to update assignments' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}