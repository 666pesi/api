import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  username: string;
  password: string;
}

export default function CreateUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Error loading users:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const updatedUsers = await fetch('/api/users').then(res => res.json());
        setUsers(updatedUsers);
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDelete = async (username: string) => {
    if (confirm(`Delete user ${username}?`)) {
      try {
        await fetch(`/api/users?username=${username}`, { method: 'DELETE' });
        setUsers(users.filter(user => user.username !== username));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div>
      <h1>Users Management</h1>
      <Link href="/">Back to Main</Link>

      <h2>Create New User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create User</button>
      </form>

      <h2>Existing Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.username}>
            {user.username}
            <button onClick={() => handleDelete(user.username)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}