import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const roomsFilePath = path.join(process.cwd(), 'data', 'rooms.json');

interface Room {
  code: string;
  name: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const rooms: Room[] = JSON.parse(fs.readFileSync(roomsFilePath, 'utf8'));
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ message: 'Failed to load rooms' });
    }
  } else if (req.method === 'POST') {
    try {
      const newRoom: Room = req.body;
      const rooms: Room[] = JSON.parse(fs.readFileSync(roomsFilePath, 'utf8'));
      
      if (rooms.some(room => room.code === newRoom.code)) {
        return res.status(400).json({ message: 'Room already exists' });
      }
      
      rooms.push(newRoom);
      fs.writeFileSync(roomsFilePath, JSON.stringify(rooms, null, 2));
      res.status(201).json({ message: 'Room created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create room' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { code } = req.query;
      const rooms: Room[] = JSON.parse(fs.readFileSync(roomsFilePath, 'utf8'));
      const filteredRooms = rooms.filter(room => room.code !== code);
      fs.writeFileSync(roomsFilePath, JSON.stringify(filteredRooms, null, 2));
      res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete room' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}