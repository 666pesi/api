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

  const handleUserAssignment = async (roomName: string, username: string) => {
    const updatedRooms = rooms.map(room => 
      room.name === roomName ? { ...room, assignedUser: username } : room
    );
    
    try {
      const roomToUpdate = updatedRooms.find(r => r.name === roomName);
      if (!roomToUpdate) return;
      
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomToUpdate),
      });
      
      if (response.ok) {
        setRooms(updatedRooms);
        setDropdownOpen(null);
      } else {
        alert('Failed to update room assignment');
      }
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Failed to update room assignment');
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

  const toggleDropdown = (roomName: string) => {
    setDropdownOpen(dropdownOpen === roomName ? null : roomName);
  };

  if (isLoading) return <p className="p-4">Loading...</p>;

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl mb-4">Room Management</h1>
      <Link href="/" className="text-blue-400 hover:underline mb-6 inline-block">
        ← Back to Main Menu
      </Link>
      
      <h2 className="text-xl mb-4">Room Assignments</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Room</th>
            <th className="p-3 text-left">Assigned User</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.name} className="border-b">
              <td className="p-3">{room.name}</td>
              <td className="p-3 relative">
                <div 
                  className="px-3 py-2 border border-gray-600 rounded cursor-pointer inline-block min-w-[150px] bg-gray-800 hover:bg-gray-700"
                  onClick={() => toggleDropdown(room.name)}
                >
                  {room.assignedUser || 'Select user'}
                  {dropdownOpen === room.name && (
                    <div className="absolute top-full left-0 z-10 bg-gray-800 border border-gray-600 rounded shadow-lg w-full mt-1">
                      {users.map((user) => (
                        <div 
                          key={user.username}
                          className={`px-3 py-2 cursor-pointer hover:bg-gray-700 ${
                            room.assignedUser === user.username ? 'bg-gray-600' : ''
                          }`}
                          onClick={() => handleUserAssignment(room.name, user.username)}
                        >
                          {user.username}
                        </div>
                      ))}
                      <div 
                        className="px-3 py-2 cursor-pointer text-gray-400 border-t border-gray-600 hover:bg-gray-700"
                        onClick={() => handleUserAssignment(room.name, '')}
                      >
                        Clear assignment
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td className="p-3">
                <button 
                  onClick={() => handleDeleteRoom(room.name)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}