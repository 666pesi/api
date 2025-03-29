import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Room {
  code: string;
  name: string;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState<Room>({ code: '', name: '' });
  const [isLoading, setIsLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      const data = await response.json();
      setRooms(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading rooms:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom),
      });
      
      if (response.ok) {
        setNewRoom({ code: '', name: '' });
        await fetchRooms();
      }
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const handleDeleteRoom = async (code: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    
    try {
      const response = await fetch('/api/rooms', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      
      if (response.ok) {
        await fetchRooms();
      }
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Room Management</h1>
      <Link href="/">Back to Main Menu</Link>
      
      <h2>Add New Room</h2>
      <form onSubmit={handleAddRoom}>
        <div>
          <label>Room Code:</label>
          <input
            type="text"
            value={newRoom.code}
            onChange={(e) => setNewRoom({ ...newRoom, code: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Room Name:</label>
          <input
            type="text"
            value={newRoom.name}
            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
            required
          />
        </div>
        <button type="submit">Add Room</button>
      </form>
      
      <h2>Existing Rooms</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.code}>
              <td>{room.code}</td>
              <td>{room.name}</td>
              <td>
                <button onClick={() => handleDeleteRoom(room.code)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}