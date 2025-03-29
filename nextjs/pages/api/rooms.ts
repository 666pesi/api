import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'rooms.json');

interface Room {
  code: string;
  name: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '[]';
      res.status(200).json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ message: 'Failed to load rooms' });
    }
  } else if (req.method === 'POST') {
    try {
      const newRoom: Room = req.body;
      const rooms: Room[] = fs.existsSync(filePath) 
        ? JSON.parse(fs.readFileSync(filePath, 'utf8')) 
        : [];
      
      if (rooms.some(r => r.code === newRoom.code)) {
        return res.status(400).json({ message: 'Room code already exists' });
      }
      
      rooms.push(newRoom);
      fs.writeFileSync(filePath, JSON.stringify(rooms, null, 2));
      res.status(200).json({ message: 'Room added successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add room' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { code } = req.body;
      const rooms: Room[] = fs.existsSync(filePath)
        ? JSON.parse(fs.readFileSync(filePath, 'utf8'))
        : [];
      
      const updatedRooms = rooms.filter(room => room.code !== code);
      fs.writeFileSync(filePath, JSON.stringify(updatedRooms, null, 2));
      res.status(200).json({ message: 'Room deleted successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete room' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}