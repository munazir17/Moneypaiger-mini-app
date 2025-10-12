import { useEffect, useState } from 'react';
import { MiniappKit, useFid } from '@farcaster/miniapp-kit';

function App() {
  const { fid, isAuthenticated } = useFid();
  const [message, setMessage] = useState('Welcome to Moneypaiger! Track your money pings.');

  useEffect(() => {
    const kit = new MiniappKit();
    if (!isAuthenticated) {
      kit.authenticate().catch((err) => console.error('Auth error:', err));
    }
  }, [isAuthenticated]);

  const handlePing = () => {
    setMessage('Pinging your latest money update! 💰');
    // Add your custom money tracking/paging logic here
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-primary mb-4">Moneypaiger</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">{message}</p>
      {isAuthenticated && fid ? (
        <p className="text-sm text-secondary">Connected FID: {fid}</p>
      ) : (
        <p className="text-sm text-red-500">Not authenticated. Please connect via Warpcast.</p>
      )}
      <button
        className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
        onClick={handlePing}
      >
        Ping Money Update
      </button>
    </div>
  );
}

export default App;
