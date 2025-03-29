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

  const fetchData = async () => {
    try {
      const [inventoryRes, roomsRes] = await Promise.all([
        fetch('/api/inventory'),
        fetch('/api/rooms')
      ]);
      setInventoryData(await inventoryRes.json());
      setRooms(await roomsRes.json());
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventoryData)
      });
      if (response.ok) {
        alert('Inventory saved successfully!');
      }
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  };

  const handleChange = (index: number, field: keyof InventoryItem, value: string | boolean) => {
    const updatedData = [...inventoryData];
    if (field === 'checked') {
      updatedData[index][field] = value as boolean;
    } else {
      updatedData[index][field] = value as string;
    }
    setInventoryData(updatedData);
  };

  const addNewItem = () => {
    setInventoryData([...inventoryData, {
      code: `A${String(inventoryData.length + 1).padStart(3, '0')}`,
      name: '',
      room: '',
      checked: false
    }]);
  };

  const removeItem = (index: number) => {
    const updatedData = inventoryData.filter((_, i) => i !== index);
    setInventoryData(updatedData);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Inventory Management</h1>
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
                <td>
                  <button type="button" onClick={() => removeItem(index)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button type="button" onClick={addNewItem}>Add New Item</button>
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
}