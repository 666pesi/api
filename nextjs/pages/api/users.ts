import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

interface User {
  username: string;
  password: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const users: User[] = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
      return res.status(200).json(users);
    }

    if (req.method === 'POST') {
      const newUser: User = req.body;
      const users: User[] = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
      
      if (users.some(user => user.username === newUser.username)) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      users.push(newUser);
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
      return res.status(201).json({ message: 'User created successfully' });
    }

    if (req.method === 'DELETE') {
      const { username } = req.query;
      const users: User[] = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
      const filteredUsers = users.filter(user => user.username !== username);
      fs.writeFileSync(usersFilePath, JSON.stringify(filteredUsers, null, 2));
      return res.status(200).json({ message: 'User deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}