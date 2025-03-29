import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const roomsFilePath = path.join(process.cwd(), 'data', 'rooms.json');
const inventoryFilePath = path.join(process.cwd(), 'data', 'inventory.json');

interface Room {
  name: string;
  assignedUser: string;
}

interface InventoryItem {
  code: string;
  name: string;
  room: string;
  checked: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const inventory: InventoryItem[] = JSON.parse(fs.readFileSync(inventoryFilePath, 'utf8'));
      const uniqueRooms = [...new Set(inventory.map(item => item.room))];
      
      const existingRooms: Room[] = fs.existsSync(roomsFilePath)
        ? JSON.parse(fs.readFileSync(roomsFilePath, 'utf8'))
        : [];
      
      const rooms: Room[] = uniqueRooms.map(roomName => {
        const existingRoom = existingRooms.find(r => r.name === roomName);
        return existingRoom || { name: roomName, assignedUser: '' };
      });

      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ message: 'Failed to load rooms' });
    }
  } else if (req.method === 'POST') {
    try {
      const updatedRoom: Room = req.body;
      const rooms: Room[] = JSON.parse(fs.readFileSync(roomsFilePath, 'utf8'));
      
      const index = rooms.findIndex(r => r.name === updatedRoom.name);
      if (index !== -1) {
        rooms[index] = updatedRoom;
      } else {
        rooms.push(updatedRoom);
      }
      
      fs.writeFileSync(roomsFilePath, JSON.stringify(rooms, null, 2));
      res.status(200).json({ message: 'Room updated successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update room' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { roomName } = req.body;
      const rooms: Room[] = JSON.parse(fs.readFileSync(roomsFilePath, 'utf8'));
      
      const updatedRooms = rooms.filter(room => room.name !== roomName);
      fs.writeFileSync(roomsFilePath, JSON.stringify(updatedRooms, null, 2));
      res.status(200).json({ message: 'Room deleted successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete room' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}