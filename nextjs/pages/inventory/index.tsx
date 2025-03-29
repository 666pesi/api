import { useState, useEffect } from 'react';
import Link from 'next/link';

interface InventoryItem {
  code: string;
  name: string;
  room: string;
  checked: boolean;
}

interface Room {
  code: string;
  name: string;
}

export default function Inventory() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [inventoryRes, roomsRes] = await Promise.all([
        fetch('/api/load'),
        fetch('/api/rooms')
      ]);
      setInventoryData(await inventoryRes.json());
      setRooms(await roomsRes.json());
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inventoryData),
    });
    if (response.ok) {
      alert('Data saved successfully!');
    }
  };

  const handleChange = (index: number, field: keyof InventoryItem, value: string | boolean) => {
    const updatedData = [...inventoryData];
    updatedData[index][field] = value as never;
    setInventoryData(updatedData);
  };

  const addNewItem = () => {
    const newItem: InventoryItem = {
      code: `A${String(inventoryData.length + 1).padStart(3, '0')}`,
      name: '',
      room: '',
      checked: false,
    };
    setInventoryData([...inventoryData, newItem]);
  };

  const removeItem = (index: number) => {
    const updatedData = inventoryData.filter((_, i) => i !== index);
    setInventoryData(updatedData);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <main>
      <h1>Inventory Editor</h1>
      <Link href="/">Back to Main Menu</Link>
      
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Room</th>
              <th>Checked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item, index) => (
              <tr key={item.code}>
                <td>
                  <input
                    type="text"
                    value={item.code}
                    onChange={(e) => handleChange(index, 'code', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <select
                    value={item.room}
                    onChange={(e) => handleChange(index, 'room', e.target.value)}
                  >
                    <option value="">Select Room</option>
                    {rooms.map(room => (
                      <option key={room.code} value={room.code}>
                        {room.name} ({room.code})
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => handleChange(index, 'checked', e.target.checked)}
                  />
                </td>
                <td