import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InventoryCheck() {
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});
  const [users, setUsers] = useState<{username: string}[]>([]);
  const [rooms, setRooms] = useState<{code: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [assignmentsRes, usersRes, roomsRes] = await Promise.all([
        fetch('/api/room-assignments'),
        fetch('/api/users'),
        fetch('/api/rooms')
      ]);
      
      setAssignments(await assignmentsRes.json());
      setUsers(await usersRes.json());
      setRooms(await roomsRes.json());
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignmentChange = async (username: string, selectedRooms: string[]) => {
    try {
      await fetch('/api/room-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, rooms: selectedRooms }),
      });
      await fetchData();
    } catch (error) {
      console.error('Error updating assignments:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Inventory Check Assignments</h1>
      <Link href="/">Back to Main Menu</Link>
      
      <h2>User Room Assignments</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Assigned Rooms</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.username}>
              <td>{user.username}</td>
              <td>
                <select
                  multiple
                  value={assignments[user.username] || []}
                  onChange={(e) => {
                    const options = Array.from(e.target.selectedOptions, option => option.value);
                    handleAssignmentChange(user.username, options);
                  }}
                >
                  {rooms.map((room) => (
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