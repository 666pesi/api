import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

interface User {
  username: string;
  password: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const users: User[] = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
      res.status(200).json(users);
    } catch (error) {
      console.error('Error loading users:', error);
      res.status(500).json({ message: 'Failed to load users' });
    }
  } else if (req.method === 'POST') {
    try {
      const newUser: User = req.body;
      const users: User[] = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
      
      // Check if user already exists
      if (users.some(user => user.username === newUser.username)) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      users.push(newUser);
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Failed to create user' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}