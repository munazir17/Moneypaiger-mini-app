export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { untrustedData, trustedData } = req.body; // Farcaster frame payload
    const { fid, buttonIndex, inputText } = untrustedData;

    // Example: Fetch finance timeline data (replace with your logic)
    const timelineData = inputText
      ? `Queried finance event: ${inputText}`
      : 'Loaded Moneypaiger timeline!';

    // Return frame response
    res.status(200).json({
      type: 'frame',
      frame: {
        version: 'vNext',
        image: 'https://moneypaiger-mini-app-4be2.vercel.app/images/nft2.png', // Dynamic image if needed
        buttons: [{ label: 'Next Event', action: 'post' }],
        post_url: 'https://moneypaiger-mini-app-4be2.vercel.app/images/nft3.png',
        input: { text: 'Enter finance query...' }
      },
      message: timelineData
    });
  } catch (error) {
    console.error('Frame error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
