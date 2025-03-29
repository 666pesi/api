import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InventoryCheck() {
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});
  const [users, setUsers] = useState<{username: string}[]>([]);
  const [rooms, setRooms] = useState<{code: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const [assignmentsRes, usersRes, roomsRes] = await Promise.all([
      fetch('/api/inventory-check'),
      fetch('/api/users'),
      fetch('/api/rooms')
    ]);
    setAssignments(await assignmentsRes.json());
    setUsers(await usersRes.json());
    setRooms(await roomsRes.json());
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAssignmentChange = async (username: string, selectedRooms: string[]) => {
    await fetch('/api/inventory-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, rooms: selectedRooms })
    });
    fetchData();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Inventory Check Assignments</h1>
      <Link href="/">Back to Main Menu</Link>
      
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Assigned Rooms</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.username}>
              <td>{user.username}</td>
              <td>
                <select
                  multiple
                  value={assignments[user.username] || []}
                  onChange={(e) => {
                    const selected = Array.from(e.target.options)
                      .filter(opt => opt.selected)
                      .map(opt => opt.value);
                    handleAssignmentChange(user.username, selected);
                  }}
                >
                  {rooms.map(room => (
                    <option key={room.code} value={room.code}>
                      {room.name} ({room.code})
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}