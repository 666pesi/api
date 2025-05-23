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
      try {
        const [inventoryRes, roomsRes] = await Promise.all([
          fetch('/api/load'),
          fetch('/api/rooms')
        ]);
        setInventoryData(await inventoryRes.json());
        setRooms(await roomsRes.json());
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/save-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventoryData),
      });
      if (response.ok) {
        alert('Data saved successfully!');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data');
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
      <h1>Majetok</h1>
      <Link href="/">Späť na hlavné menu</Link>
      
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <th>Kód</th>
              <th>Názov</th>
              <th>Miestnosť</th>
              <th>Checked</th>
              <th>Akcie</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item, index) => (
              <tr key={index}>
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
                    <option value="">Vyber miesnosť</option>
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
                <td>
                  <button type="button" onClick={() => removeItem(index)}>
                  Odstrániť
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button type="button" onClick={addNewItem}>
          Pridať novú položku
          </button>
          <button type="submit">Uložiť zmeny</button>
        </div>
      </form>
    </main>
  );
}