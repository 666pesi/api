import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Sync() {
  const [exports, setExports] = useState<any[]>([]);

  // 1. Load exports when page loads
  useEffect(() => {
    fetch('/api/exports')
      .then(res => res.json())
      .then(data => {
        console.log('Loaded exports:', data); // DEBUG
        setExports(data);
      })
      .catch(err => console.error('Failed to load:', err));
  }, []);

  // 2. Sync button handler
  const handleSync = async () => {
    const res = await fetch('/api/sync-now', { method: 'POST' });
    if (res.ok) {
      // 3. Reload exports after sync
      const newExports = await fetch('/api/exports').then(r => r.json());
      setExports(newExports);
      console.log('After sync:', newExports); // DEBUG
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Sync</h1>
      <Link href="/">← Back</Link>

      <button 
        onClick={handleSync}
        style={{ 
          padding: '10px', 
          background: '#4CAF50', 
          color: 'white',
          margin: '20px 0'
        }}
      >
        Sync Now
      </button>

      <h2>Exports ({exports.length})</h2>
      
      {/* 4. RAW DATA DUMP - will show EVERYTHING */}
      <pre style={{ 
        background: '#f0f0f0', 
        padding: '10px', 
        overflowX: 'auto'
      }}>
        {JSON.stringify(exports, null, 2)}
      </pre>
    </div>
  );
}