import { useState, useEffect } from 'react';

// Define the type for an inventory item
interface InventoryItem {
  code: string;
  name: string;
  room: string;
  checked: boolean;
}

export default function Home() {
  // Explicitly type the state as an array of InventoryItem
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from the server
  useEffect(() => {
    fetch('/api/load')
      .then((response) => response.json())
      .then((data: InventoryItem[]) => {
        setInventoryData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        setIsLoading(false);
      });
  }, []);

  // Handle form submission
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

  // Handle input changes
  const handleChange = (index: number, field: keyof InventoryItem, value: string | boolean) => {
    const updatedData = [...inventoryData];
    updatedData[index][field] = value as never; // Use type assertion to avoid type errors
    setInventoryData(updatedData);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <h1>Inventory Editor</h1>
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Room</th>
              <th>Checked</th>
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
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit">Save Changes</button>
      </form>
    </main>
  );
}