import { useState, useEffect } from 'react';
import Link from 'next/link';

interface InventoryItem {
  code: string;
  name: string;
  room: string;
  checked: boolean;
}

interface ExportData {
  id: string;
  data: InventoryItem[];
  receivedAt: string;
}

export default function Sync() {
  const [exports, setExports] = useState<ExportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/exports')
      .then((response) => response.json())
      .then((data: ExportData[]) => {
        setExports(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading exports:', error);
        setIsLoading(false);
      });
  }, []);

  const handleSync = async () => {
    try {
      const response = await fetch('/api/sync-now', {
        method: 'POST',
      });

      if (response.ok) {
        alert('Data synchronized successfully!');
        setExports([]); // Vymazanie zoznamu po synchronizácii
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
      <h1>Stránka Synchronizácia</h1>
      <Link href="/">Späť na hlavné menu</Link>
      <div>
        <h2>Prijaté exporty</h2>
        <ul>
          {exports.map((exp) => (
            <li key={exp.id}>
              <p>Prijaté: {exp.receivedAt}</p>
              <pre>{JSON.stringify(exp.data, null, 2)}</pre>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleSync}>Synchronizovať</button>
    </main>
  );
}