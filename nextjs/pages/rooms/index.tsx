import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Room {
  name: string;
  assignedUsers: string[];
}

interface User {
  username: string;
  password: string;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [roomsRes, usersRes] = await Promise.all([
        fetch('/api/rooms'),
        fetch('/api/users'),
      ]);
      
      if (!roomsRes.ok || !usersRes.ok) throw new Error('Failed to load data');
      
      const roomsData = await roomsRes.json();
      const usersData = await usersRes.json();
      
      setRooms(roomsData);
      setUsers(usersData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUserAssignment = async (roomName: string, username: string, isAssigned: boolean) => {
    const roomIndex = rooms.findIndex(r => r.name === roomName);
    if (roomIndex === -1) return;
    
    const updatedRooms = [...rooms];
    if (isAssigned) {
      // Add user if not already assigned
      if (!updatedRooms[roomIndex].assignedUsers.includes(username)) {
        updatedRooms[roomIndex].assignedUsers.push(username);
      }
    } else {
      // Remove user
      updatedRooms[roomIndex].assignedUsers = updatedRooms[roomIndex].assignedUsers.filter(
        u => u !== username
      );
    }
    
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRooms[roomIndex]),
      });
      
      if (response.ok) {
        setRooms(updatedRooms);
      } else {
        alert('Failed to update room assignments');
      }
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Failed to update room assignments');
    }
  };

  const handleDeleteRoom = async (roomName: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    
    try {
      const response = await fetch('/api/rooms', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName }),
      });
      
      if (response.ok) {
        await fetchData();
      } else {
        alert('Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Failed to delete room');
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <main>
      <h1>Room Management</h1>
      <Link href="/">Back to Main Menu</Link>
      
      <h2>Room Assignments</h2>
      <table>
        <thead>
          <tr>
            <th>Room</th>
            <th>Assigned Users</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.name}>
              <td>{room.name}</td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {users.map((user) => (
                    <div key={`${room.name}-${user.username}`}>
                      <label>
                        <input
                          type="checkbox"
                          checked={room.assignedUsers.includes(user.username)}
                          onChange={(e) => 
                            handleUserAssignment(room.name, user.username, e.target.checked)
                          }
                        />
                        {user.username}
                      </label>
                    </div>
                  ))}
                </div>
              </td>
              <td>
                <button onClick={() => handleDeleteRoom(room.name)}>
                  Delete Room
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}