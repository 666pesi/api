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
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  // Load exports data
  const fetchExports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/exports');
      if (!response.ok) throw new Error('Failed to fetch exports');
      const data = await response.json();
      setExports(data);
    } catch (error) {
      console.error('Error:', error);
      setSyncStatus('Error loading exports');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchExports();
  }, []);

  // Handle sync action
  const handleSync = async () => {
    setIsLoading(true);
    setSyncStatus('Syncing...');
    try {
      const response = await fetch('/api/sync-now', { method: 'POST' });
      if (!response.ok) throw new Error('Sync failed');
      
      // Give server a moment to process before refetching
      setTimeout(() => {
        fetchExports();
        setSyncStatus('Sync completed successfully!');
      }, 500);
      
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('Sync failed');
      setIsLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Inventory Sync</h1>
      <Link href="/" style={{ display: 'block', marginBottom: '20px' }}>
        ← Back to Main Menu
      </Link>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleSync}
          disabled={isLoading}
          style={{
            padding: '10px 15px',
            background: isLoading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isLoading ? 'Processing...' : 'Sync Now'}
        </button>
        {syncStatus && <p style={{ color: syncStatus.includes('failed') ? 'red' : 'green' }}>{syncStatus}</p>}
      </div>

      <h2>Recent Exports</h2>
      {isLoading && exports.length === 0 ? (
        <p>Loading...</p>
      ) : exports.length === 0 ? (
        <p>No exports found</p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {exports.map((exp) => (
            <div key={exp.id} style={{ 
              marginBottom: '20px', 
              padding: '15px', 
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}>
              <p><strong>Received:</strong> {new Date(exp.receivedAt).toLocaleString()}</p>
              <pre style={{ 
                background: '#f5f5f5',
                padding: '10px',
                overflowX: 'auto',
                maxHeight: '400px',
                borderRadius: '4px'
              }}>
                {JSON.stringify(exp.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}