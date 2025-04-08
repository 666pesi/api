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

  const loadExports = async () => {
    try {
      const response = await fetch('/api/exports');
      const data = await response.json();
      setExports(data);
    } catch (error) {
      console.error('Error loading exports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExports();
  }, []);

  const handleSync = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/sync-now', { method: 'POST' });
      
      if (response.ok) {
        alert('Data synchronized successfully!');
        // Reload the exports after sync
        await loadExports();
      } else {
        alert('Failed to synchronize data.');
      }
    } catch (error) {
      console.error('Error synchronizing data:', error);
      alert('Failed to synchronize data.');
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <main>
      <h1>Sync Page</h1>
      <Link href="/">Back to Main Menu</Link>
      
      <div>
        <h2>Received Exports</h2>
        {exports.length === 0 ? (
          <p>No exports received yet</p>
        ) : (
          <div>
            {exports.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
                <p><strong>Received at:</strong> {new Date(exp.receivedAt).toLocaleString()}</p>
                <pre style={{ 
                  background: '#f5f5f5', 
                  padding: '10px', 
                  overflowX: 'auto',
                  maxHeight: '300px'
                }}>
                  {JSON.stringify(exp.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <button 
        onClick={handleSync}
        style={{
          marginTop: '20px',
          padding: '10px 15px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Sync Noww
      </button>
    </main>
  );
}