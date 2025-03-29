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
      
      // If you want to generate rooms from inventory automatically:
      // const inventory = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'inventory.json'), 'utf8'));
      // const uniqueRooms = [...new Set(inventory.map(item => item.room))];
      // const rooms = uniqueRooms.map(room => ({ code: room, name: `Room ${room}` }));
      
      res.status(200).json(rooms);
    } catch (error) {
      console.error('Error loading rooms:', error);
      res.status(500).json({ message: 'Failed to load rooms' });
    }
  } else if (req.method === 'POST') {
    try {
      const newRoom: Room = req.body;
      const rooms: Room[] = JSON.parse(fs.readFileSync(roomsFilePath, 'utf8'));
      
      // Check if room already exists
      if (rooms.some(room => room.code === newRoom.code)) {
        return res.status(400).json({ message: 'Room already exists' });
      }
      
      rooms.push(newRoom);
      fs.writeFileSync(roomsFilePath, JSON.stringify(rooms, null, 2));
      res.status(201).json({ message: 'Room created successfully' });
    } catch (error) {
      console.error('Error creating room:', error);
      res.status(500).json({ message: 'Failed to create room' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}