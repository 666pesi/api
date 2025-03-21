import { useState, useEffect } from 'react';
import Link from 'next/link';

interface InventoryItem {
  code: string;
  name: string;
  room: string;
  checked: boolean;
}

export default function Inventory() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch inventory data
  const fetchInventoryData = async () => {
    try {
      const response = await fetch('/api/load');
      const data: InventoryItem[] = await response.json();
      setInventoryData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inventoryData),
      });

      if (response.ok) {
        alert('Data saved successfully!');
      } else {
        alert('Failed to save data.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data.');
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

  // Function to handle sync
  const handleSync = async () => {
    try {
      const response = await fetch('/api/sync-now', {
        method: 'POST',
      });

      if (response.ok) {
        alert('Data synchronized successfully!');
        // Refetch inventory data after sync
        fetchInventoryData();
      } else {
        alert('Failed to synchronize data.');
      }
    } catch (error) {
      console.error('Error synchronizing data:', error);
      alert('Failed to synchronize data.');
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <h1>Inventory Editor</h1>
      <Link href="/">Back to Main Menu</Link>
      <button onClick={handleSync} style={{ marginBottom: '16px' }}>
        Sync Now
      </button>
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
                  <input
                    type="text"
                    value={item.room}
                    onChange={(e) => handleChange(index, 'room', e.target.value)}
                  />
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
        <div style={{ marginTop: '16px' }}>
          <button type="button" onClick={addNewItem} style={{ marginRight: '8px' }}>
            Add New Item
          </button>
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </main>
  );
}