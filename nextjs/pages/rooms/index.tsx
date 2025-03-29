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
    const response = await fetch('/api/rooms');
    setRooms(await response.json());
    setIsLoading(false);
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRoom)
    });
    setNewRoom({ code: '', name: '' });
    fetchRooms();
  };

  const handleDeleteRoom = async (code: string) => {
    await fetch('/api/rooms', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    fetchRooms();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Room Management</h1>
      <Link href="/">Back to Main Menu</Link>
      
      <form onSubmit={handleAddRoom}>
        <input
          type="text"
          placeholder="Room Code"
          value={newRoom.code}
          onChange={(e) => setNewRoom({...newRoom, code: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Room Name"
          value={newRoom.name}
          onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
          required
        />
        <button type="submit">Add Room</button>
      </form>
      
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
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