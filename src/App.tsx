import { useEffect, useState } from 'react';
import { MiniappKit, useFid } from '@farcaster/miniapp-kit';

function App() {
  const { fid, isAuthenticated } = useFid();
  const [message, setMessage] = useState('Loading supply...');
  const [isFarcaster, setIsFarcaster] = useState(false);

  useEffect(() => {
    const kit = new MiniappKit();
    // Check if running in Farcaster's in-app view
    const isFarcasterEnv = typeof window !== 'undefined' && window.location.ancestorOrigins?.includes('https://warpcast.com');
    setIsFarcaster(isFarcasterEnv);

    if (!isAuthenticated) {
      kit.authenticate().then(() => {
        setMessage('🎭 Opened from Farcaster');
      }).catch((err) => {
        console.error('Auth error:', err);
        setMessage('⚠️ Authentication failed. Please connect via Warpcast.');
      });
    } else {
      // Fetch Base Mainnet data (replace with your API call)
      fetchTimelineData().then((data) => {
        setMessage(`Timeline loaded: ${data.summary || 'Since 2017'}`);
      }).catch(() => {
        setMessage('⚡ Base Mainnet Required');
      });
    }
  }, [isAuthenticated]);

  // Placeholder for your data fetch
  const fetchTimelineData = async () => {
    // Replace with your Base Mainnet API call
    return { summary: 'Digital Finance Timeline - Since 2017' };
  };

  const handlePing = () => {
    setMessage('Pinging latest finance update! 💰');
    // Add your Base Mainnet or API logic here
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-primary mb-4"># MONEYPAIGER</h1>
      <p className="text-lg text-gray-600 mb-2 text-center">Timeline of Digital Finance - Since 2017</p>
      <p className="text-sm text-gray-500 mb-4">Built by <a href="https://warpcast.com/munazir" className="text-secondary">[@munazir]</a> on Farcaster</p>
      <p className="text-md text-gray-600 mb-6 text-center">{message}</p>
      {isAuthenticated && fid ? (
        <p className="text-sm text-secondary mb-4">Connected FID: {fid}</p>
      ) : (
        <p className="text-sm text-red-500 mb-4">Not authenticated. Please connect via Warpcast.</p>
      )}
      {isFarcaster ? (
        <p className="text-sm text-green-500 mb-4">🎭 Running in Farcaster</p>
      ) : (
        <p className="text-sm text-orange-500 mb-4">⚠️ Running in external browser</p>
      )}
      <button
        className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
        onClick={handlePing}
      >
        Ping Money Update
      </button>
      <hr className="w-1/2 my-6 border-gray-300" />
    </div>
  );
}

export default App;
