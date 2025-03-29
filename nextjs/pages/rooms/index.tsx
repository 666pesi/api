import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Room {
  name: string;
  assignedUser: string;
}

interface User {
  username: string;
  password: string;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [roomsRes, usersRes] = await Promise.all([
        fetch('/api/rooms'),
        fetch('/api/users'),
      ]);
      
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

  const handleUserAssignment = async (roomName: string, username: string) => {
    const updatedRooms = rooms.map(room => 
      room.name === roomName ? { ...room, assignedUser: username } : room
    );
    
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRooms.find(r => r.name === roomName)),
      });
      
      if (response.ok) {
        setRooms(updatedRooms);
        setDropdownOpen(null);
      }
    } catch (error) {
      console.error('Error updating room:', error);
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
      }
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  if (isLoading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Room Management</h1>
        <Link href="/" className="btn btn-primary">
          ← Back to Main Menu
        </Link>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Assigned User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.name}>
                <td>{room.name}</td>
                <td>
                  <div className="dropdown">
                    <div 
                      className="btn btn-primary"
                      onClick={() => setDropdownOpen(dropdownOpen === room.name ? null : room.name)}
                    >
                      {room.assignedUser || 'Select user'}
                    </div>
                    {dropdownOpen === room.name && (
                      <div className="dropdown-menu">
                        {users.map((user) => (
                          <div
                            key={user.username}
                            className="dropdown-item"
                            onClick={() => handleUserAssignment(room.name, user.username)}
                          >
                            {user.username}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteRoom(room.name)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}