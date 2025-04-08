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
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const fetchExports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/exports');
      if (!response.ok) throw new Error('Failed to fetch');
      const data: ExportData[] = await response.json();
      setExports(data);
    } catch (error) {
      console.error('Error:', error);
      setSyncStatus('Failed to load exports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExports();
  }, []);

  const handleSync = async () => {
    if (exports.length === 0) return;
    
    setSyncStatus('Syncing...');
    try {
      const response = await fetch('/api/sync-now', { method: 'POST' });
      const result = await response.json();
      
      if (response.ok) {
        setSyncStatus(result.message);
        await fetchExports(); // Refresh the list after sync
      } else {
        throw new Error(result.message || 'Sync failed');
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus(error instanceof Error ? error.message : 'Sync failed');
    }
  };

  if (isLoading) return <p>Loading exports...</p>;

  return (
    <main style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Inventory Sync</h1>
      <Link href="/">← Back to Main Menu</Link>
      
      <div style={{ margin: '20px 0' }}>
        <h2>Pending Exports ({exports.length})</h2>
        {syncStatus && (
          <div style={{
            padding: '10px',
            background: syncStatus.includes('success') ? '#d4edda' : '#f8d7da',
            margin: '10px 0'
          }}>
            {syncStatus}
          </div>
        )}

        {exports.length === 0 ? (
          <p>No exports waiting for sync</p>
        ) : (
          <div style={{ marginTop: '15px' }}>
            {exports.map((exp) => (
              <div 
                key={exp.id} 
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '5px'
                }}
              >
                <h3>Export #{exp.id}</h3>
                <p>
                  <strong>Received:</strong> {new Date(exp.receivedAt).toLocaleString()}
                </p>
                <p>
                  <strong>Items:</strong> {exp.data.length}
                </p>
                <details>
                  <summary>View Details</summary>
                  <pre style={{
                    background: '#f5f5f5',
                    padding: '10px',
                    overflowX: 'auto'
                  }}>
                    {JSON.stringify(exp.data, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSync}
        disabled={exports.length === 0}
        style={{
          padding: '10px 20px',
          background: exports.length ? '#007bff' : '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: exports.length ? 'pointer' : 'not-allowed'
        }}
      >
        {exports.length ? `Sync ${exports.length} Export(s)` : 'Nothing to Sync'}
      </button>
    </main>
  );
}