import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  username: string;
  password: string;
}

interface Room {
  code: string;
  name: string;
}

interface InventoryCheck {
  [username: string]: string[];
}

export default function InventoryCheck() {
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [inventoryCheck, setInventoryCheck] = useState<InventoryCheck>({});
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, roomsRes, checkRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/rooms'),
          fetch('/api/inventory-check')
        ]);
        
        setUsers(await usersRes.json());
        setRooms(await roomsRes.json());
        setInventoryCheck(await checkRes.json());
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedUser || !selectedRoom) return;
    
    try {
      const response = await fetch('/api/inventory-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: selectedUser,
          roomCode: selectedRoom
        }),
      });
      
      if (response.ok) {
        // Refresh the assignments
        const checkRes = await fetch('/api/inventory-check');
        setInventoryCheck(await checkRes.json());
      }
    } catch (error) {
      console.error('Error assigning room:', error);
    }
  };

  const handleRemoveAssignment = async (username: string, roomCode: string) => {
    try {
      const response = await fetch('/api/inventory-check', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          roomCode
        }),
      });
      
      if (response.ok) {
        // Refresh the assignments
        const checkRes = await fetch('/api/inventory-check');
        setInventoryCheck(await checkRes.json());
      }
    } catch (error) {
      console.error('Error removing assignment:', error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <h1>Inventory Check Assignments</h1>
      <Link href="/">Back to Main Menu</Link>
      
      <div style={{ margin: '20px 0' }}>
        <h2>Assign Room to User</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <select 
            value={selectedUser} 
            onChange={(e) => setSelectedUser(e.target.value)}
            style={{ padding: '8px' }}
          >
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user.username} value={user.username}>
                {user.username}
              </option>
            ))}
          </select>
          
          <select 
            value={selectedRoom} 
            onChange={(e) => setSelectedRoom(e.target.value)}
            style={{ padding: '8px' }}
          >
            <option value="">Select Room</option>
            {rooms.map(room => (
              <option key={room.code} value={room.code}>
                {room.name} ({room.code})
              </option>
            ))}
          </select>
          
          <button 
            onClick={handleAssign}
            disabled={!selectedUser || !selectedRoom}
          >
            Assign
          </button>
        </div>
      </div>
      
      <div>
        <h2>Current Assignments</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>User</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Assigned Rooms</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(inventoryCheck).map(([username, roomCodes]) => (
              <tr key={username}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{username}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {roomCodes.map(roomCode => {
                    const room = rooms.find(r => r.code === roomCode);
                    return (
                      <div key={roomCode} style={{ margin: '5px 0' }}>
                        {room ? `${room.name} (${room.code})` : roomCode}
                        <button 
                          onClick={() => handleRemoveAssignment(username, roomCode)}
                          style={{ marginLeft: '10px', padding: '2px 5px' }}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button 
                    onClick={() => {
                      if (confirm(`Remove all assignments for ${username}?`)) {
                        roomCodes.forEach(roomCode => {
                          handleRemoveAssignment(username, roomCode);
                        });
                      }
                    }}
                  >
                    Remove All
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}