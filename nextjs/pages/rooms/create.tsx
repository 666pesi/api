import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CreateRoom() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, name }),
    });

    router.push('/');
  };

  return (
    <div>
      <h1>Create Room</h1>
      <a href="/">Back</a>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Room Code:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Room Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <button type="submit">Create</button>
      </form>
    </div>
  );
}