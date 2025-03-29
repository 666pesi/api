import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const inventoryCheckPath = path.join(process.cwd(), 'data', 'inventory_check.json');

interface InventoryCheck {
  [username: string]: string[];
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const inventoryCheck: InventoryCheck = JSON.parse(fs.readFileSync(inventoryCheckPath, 'utf8'));
      res.status(200).json(inventoryCheck);
    } catch (error) {
      console.error('Error loading inventory check:', error);
      res.status(500).json({ message: 'Failed to load inventory check' });
    }
  } else if (req.method === 'POST') {
    try {
      const newAssignment: { username: string; roomCode: string } = req.body;
      const inventoryCheck: InventoryCheck = JSON.parse(fs.readFileSync(inventoryCheckPath, 'utf8'));
      
      if (!inventoryCheck[newAssignment.username]) {
        inventoryCheck[newAssignment.username] = [];
      }
      
      if (!inventoryCheck[newAssignment.username].includes(newAssignment.roomCode)) {
        inventoryCheck[newAssignment.username].push(newAssignment.roomCode);
      }
      
      fs.writeFileSync(inventoryCheckPath, JSON.stringify(inventoryCheck, null, 2));
      res.status(200).json({ message: 'Assignment added successfully' });
    } catch (error) {
      console.error('Error updating inventory check:', error);
      res.status(500).json({ message: 'Failed to update inventory check' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { username, roomCode } = req.body;
      const inventoryCheck: InventoryCheck = JSON.parse(fs.readFileSync(inventoryCheckPath, 'utf8'));
      
      if (inventoryCheck[username]) {
        inventoryCheck[username] = inventoryCheck[username].filter(code => code !== roomCode);
        
        if (inventoryCheck[username].length === 0) {
          delete inventoryCheck[username];
        }
      }
      
      fs.writeFileSync(inventoryCheckPath, JSON.stringify(inventoryCheck, null, 2));
      res.status(200).json({ message: 'Assignment removed successfully' });
    } catch (error) {
      console.error('Error updating inventory check:', error);
      res.status(500).json({ message: 'Failed to update inventory check' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}