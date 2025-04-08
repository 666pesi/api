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

// Helper function for syntax highlighting
const syntaxHighlight = (json: string) => {
  if (!json) return '';
  
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
};

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
        // Refresh the exports after sync
        const updatedExports = await fetch('/api/exports').then(res => res.json());
        setExports(updatedExports);
      } else {
        alert('Failed to synchronize data.');
      }
    } catch (error) {
      console.error('Error synchronizing data:', error);
      alert('Failed to synchronize data.');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <main>
      <h1>Sync Page</h1>
      <Link href="/">Back to Main Menu</Link>
      
      <div className="sync-container">
        <h2>Received Exports</h2>
        
        {exports.length === 0 ? (
          <p>No exports available</p>
        ) : (
          <div className="exports-list">
            {exports.map((exp) => (
              <div key={exp.id} className="export-item">
                <p>Received at: {new Date(exp.receivedAt).toLocaleString()}</p>
                <div className="export-data">
                  <pre 
                    dangerouslySetInnerHTML={{
                      __html: syntaxHighlight(JSON.stringify(exp.data, null, 2))
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="export-actions">
          <button onClick={handleSync}>Sync Now</button>
          {exports.length > 0 && (
            <button 
              onClick={() => setExports([])}
              className="clear-btn"
            >
              Clear List
            </button>
          )}
        </div>
      </div>
    </main>
  );
}