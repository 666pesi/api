import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Room {
  code: string;
  name: string;
}

export default function CreateRoom() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error('Error loading rooms:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, name }),
      });
      
      if (response.ok) {
        const updatedRooms = await fetch('/api/rooms').then(res => res.json());
        setRooms(updatedRooms);
        setCode('');
        setName('');
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleDelete = async (code: string) => {
    if (confirm(`Delete room ${code}?`)) {
      try {
        await fetch(`/api/rooms?code=${code}`, { method: 'DELETE' });
        setRooms(rooms.filter(room => room.code !== code));
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  return (
    <div>
      <h1>Miestnosti</h1>
      <Link href="/">Späť na hlavnú stránku</Link>

      <h2>Vytvoriť novú miestnosť</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Kód miestnosti: </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Názov miestnosti: </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Vytvoriť miestnosť</button>
      </form>

      <h2>Existujúce miestnosti</h2>
      <ul>
        {rooms.map(room => (
          <li key={room.code}>
            {room.name} ({room.code})
            <button onClick={() => handleDelete(room.code)}>Odstrániť</button>
          </li>
        ))}
      </ul>
    </div>
  );
}