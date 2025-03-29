import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const roomsFilePath = path.join(process.cwd(), 'data', 'rooms.json');

interface Room {
  code: string;
  name: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const rooms: Room[] = JSON.parse(fs.readFileSync(roomsFilePath, 'utf8'));
      return res.status(200).json(rooms);
    }

    if (req.method === 'POST') {
      const newRoom: Room = req.body;
      const rooms: Room[] = JSON.parse(fs.readFileSync(roomsFilePath, 'utf8'));
      
      if (rooms.some(room => room.code === newRoom.code)) {
        return res.status(400).json({ message: 'Room already exists' });
      }
      
      rooms.push(newRoom);
      fs.writeFileSync(roomsFilePath, JSON.stringify(rooms, null, 2));
      return res.status(201).json({ message: 'Room created successfully' });
    }

    if (req.method === 'DELETE') {
      const { code } = req.query;
      const rooms: Room[] = JSON.parse(fs.readFileSync(roomsFilePath, 'utf8'));
      const filteredRooms = rooms.filter(room => room.code !== code);
      fs.writeFileSync(roomsFilePath, JSON.stringify(filteredRooms, null, 2));
      return res.status(200).json({ message: 'Room deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}