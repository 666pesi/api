import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Rooms.module.css';

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

  if (isLoading) return <p>Loading...</p>;

  return (
    <main className={styles.container}>
      <h1>Room Management</h1>
      <Link href="/" className={styles.backLink}>
        ← Back to Main Menu
      </Link>
      
      <h2>Room Assignments</h2>
      <table className={styles.table}>
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
              <td className={styles.dropdownCell}>
                <div 
                  className={styles.dropdownTrigger}
                  onClick={() => toggleDropdown(room.name)}
                >
                  {room.assignedUser || 'Select user'}
                  {dropdownOpen === room.name && (
                    <div className={styles.dropdownMenu}>
                      {users.map((user) => (
                        <div 
                          key={user.username}
                          className={`${styles.dropdownItem} ${
                            room.assignedUser === user.username ? styles.selectedItem : ''
                          }`}
                          onClick={() => handleUserAssignment(room.name, user.username)}
                        >
                          {user.username}
                        </div>
                      ))}
                      <div 
                        className={styles.clearAssignment}
                        onClick={() => handleUserAssignment(room.name, '')}
                      >
                        Clear assignment
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <button 
                  onClick={() => handleDeleteRoom(room.name)}
                  className={styles.deleteButton}
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