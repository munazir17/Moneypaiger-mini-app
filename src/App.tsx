import { useEffect, useState } from 'react'
import './App.css'

// Declare Farcaster SDK types
declare global {
  interface Window {
    FarcasterFrameSDK?: {
      init: () => Promise<any>;
      actions?: {
        ready: () => void;
      };
      context?: any;
    };
  }
}

function App() {
  const [farcasterUser, setFarcasterUser] = useState<string | null>(null);
  const [isInFarcaster, setIsInFarcaster] = useState(false);

  // Initialize Farcaster SDK
  useEffect(() => {
    const initFarcaster = async () => {
      if (window.FarcasterFrameSDK) {
        try {
          const context = await window.FarcasterFrameSDK.init();
          console.log('✅ Farcaster SDK initialized:', context);
          setIsInFarcaster(true);
          
          if (context?.user) {
            setFarcasterUser(context.user.username || context.user.fid);
          }
          
          // Notify Farcaster that app is ready
          if (window.FarcasterFrameSDK.actions) {
            window.FarcasterFrameSDK.actions.ready();
            console.log('✅ App ready signal sent to Farcaster');
          }
        } catch (err) {
          console.log('ℹ️ Not in Farcaster context:', err);
          setIsInFarcaster(false);
        }
      }
    };

    initFarcaster();

    // Fallback ready call on window load
    const handleLoad = () => {
      if (window.FarcasterFrameSDK?.actions) {
        window.FarcasterFrameSDK.actions.ready();
        console.log('✅ App ready (fallback)');
      }
    };

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img 
          src="/images/nft3.png" 
          alt="MONEYPAIGER Logo" 
          className="logo"
          style={{ maxWidth: '400px', marginBottom: '2rem' }}
        />
        <h1>MONEYPAIGER</h1>
        <p className="tagline">Timeline of Digital Finance - Since 2017</p>
        
        {isInFarcaster && farcasterUser && (
          <div style={{ 
            background: 'rgba(138, 99, 210, 0.1)', 
            border: '1px solid #8a63d2',
            borderRadius: '10px',
            padding: '10px 20px',
            marginTop: '1rem',
            color: '#8a63d2'
          }}>
            👋 Welcome @{farcasterUser}!
          </div>
        )}

        <div className="nft-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginTop: '3rem',
          width: '100%',
          maxWidth: '1200px'
        }}>
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '15px',
              padding: '1rem',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <img 
                src={`/images/nft${num}.png`} 
                alt={`NFT ${num}`}
                style={{ width: '100%', borderRadius: '10px' }}
              />
              <h3 style={{ marginTop: '1rem', fontSize: '1.2rem' }}>NFT #{num}</h3>
              <p style={{ color: '#888', fontSize: '0.9rem' }}>
                Digital Finance History
              </p>
              <button style={{
                width: '100%',
                padding: '12px',
                marginTop: '1rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                Mint NFT
              </button>
            </div>
          ))}
        </div>

        <footer style={{ marginTop: '4rem', color: '#666' }}>
          <p>Built by @munazir on Farcaster</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Contract: 0x995d1e3471c06f27ad145cc7d0d0bb48f38ad938
          </p>
        </footer>
      </header>
    </div>
  )
}

export default App
