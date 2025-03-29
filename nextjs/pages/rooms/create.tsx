import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function CreateRoom() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, name }),
      });

      if (response.ok) {
        router.push('/inventory-check');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create room');
      }
    } catch (err) {
      setError('An error occurred while creating the room');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>Create New Room</h1>
      <Link href="/">Back to Main Menu</Link>
      
      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Room Code:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
            placeholder="e.g., B01, R101"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Room Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
            placeholder="e.g., Main Office, Storage Room"
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#0070f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isSubmitting ? 'Creating...' : 'Create Room'}
        </button>
      </form>
    </div>
  );
}