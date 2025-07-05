import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function TestConnection() {
  const testConnection = async () => {
    if (!isSupabaseConfigured()) {
      alert('❌ Supabase not configured yet. Please check your .env.local file.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('count(*)')
        .single();

      if (error) {
        console.error('Connection error:', error);
        alert('❌ Connection failed: ' + error.message);
      } else {
        alert('✅ Connected successfully! Found products in database.');
        console.log('Database connection successful:', data);
      }
    } catch (err) {
      console.error('Test failed:', err);
      alert('❌ Test failed: ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">🔌 Database Connection Test</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
        <p className="mb-4">
          Supabase Configured: {isSupabaseConfigured() ? '✅ Yes' : '❌ No'}
        </p>
        
        <button
          onClick={testConnection}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Test Database Connection
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 text-left">
        <h3 className="font-semibold mb-3">Setup Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Update your <code>.env.local</code> file with real Supabase credentials</li>
          <li>Run the SQL schema in your Supabase SQL Editor</li>
          <li>Restart your development server: <code>npm run dev</code></li>
          <li>Click "Test Database Connection" above</li>
        </ol>
      </div>
    </div>
  );
}
