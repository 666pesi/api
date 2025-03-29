import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'users.json');

interface User {
  username: string;
  password: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      res.status(200).json(JSON.parse(data));
    } catch (error) {
      console.error('Error loading users:', error);
      res.status(500).json({ message: 'Failed to load users' });
    }
  } else if (req.method === 'POST') {
    try {
      const newUser: User = req.body;
      const users: User[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (users.some(u => u.username === newUser.username)) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      users.push(newUser);
      fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
      res.status(200).json({ message: 'User added successfully!' });
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).json({ message: 'Failed to add user' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { username } = req.body;
      const users: User[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const updatedUsers = users.filter(user => user.username !== username);
      fs.writeFileSync(filePath, JSON.stringify(updatedUsers, null, 2));
      res.status(200).json({ message: 'User deleted successfully!' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}