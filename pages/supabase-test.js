import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';

export default function SupabaseTest() {
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [configInfo, setConfigInfo] = useState({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
    keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length : 'Not set'
  });

  useEffect(() => {
    async function checkConnection() {
      try {
        // Check connection by attempting to create a simple session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setStatus('Connection failed');
          setError(error.message);
          return;
        }
        
        setStatus('Connected to Supabase!');
        
        // Now try to get tables
        try {
          // This is a special endpoint that returns table info
          const { data: tablesData, error: tablesError } = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/?apikey=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
          ).then(res => res.json());
          
          if (tablesError) {
            setTables(['Error fetching tables']);
          } else {
            setTables(tablesData || []);
          }
        } catch (tablesErr) {
          setTables(['Error: ' + tablesErr.message]);
        }
      } catch (err) {
        setStatus('Error checking connection');
        setError(err.message);
      }
    }
    
    checkConnection();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Configuration</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="font-medium">Supabase URL:</div>
          <div>{configInfo.url}</div>
          <div className="font-medium">API Key Length:</div>
          <div>{configInfo.keyLength} characters</div>
        </div>
      </div>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
        <div className={`text-lg font-bold ${status === 'Connected to Supabase!' ? 'text-green-600' : 'text-red-600'}`}>
          {status}
        </div>
        {error && (
          <div className="mt-2 p-3 bg-red-100 text-red-800 rounded">
            <div className="font-medium">Error:</div>
            <div className="font-mono text-sm whitespace-pre-wrap">{error}</div>
          </div>
        )}
      </div>
      
      <div className="p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Available Tables</h2>
        {tables.length > 0 ? (
          <ul className="list-disc list-inside">
            {tables.map((table, i) => (
              <li key={i} className="font-mono">{typeof table === 'string' ? table : JSON.stringify(table)}</li>
            ))}
          </ul>
        ) : (
          <div className="italic text-gray-500">No tables found or still loading...</div>
        )}
      </div>
    </div>
  );
} 