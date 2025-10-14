import { VercelRequest, VercelResponse } from '@vercel/node';

interface FrameRequest {
  untrustedData: {
    fid: number;
    url: string;
    messageHash: string;
    timestamp: number;
    network: number;
    buttonIndex: number;
    castId: {
      fid: number;
      hash: string;
    };
  };
  trustedData: {
    messageBytes: string;
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const frameRequest = req.body as FrameRequest;
    const buttonIndex = frameRequest.untrustedData?.buttonIndex || 1;
    const fid = frameRequest.untrustedData?.fid;

    // Base URL for your app
    const baseUrl = 'https://moneypaiger-mini-app-4be2.vercel.app';

    // Handle different button interactions
    let imageUrl = `${baseUrl}/og-image.png`;
    let buttons = [];
    let postUrl = `${baseUrl}/api/frame`;

    switch (buttonIndex) {
      case 1:
        // Track Money button clicked
        imageUrl = `${baseUrl}/frame-track.png`;
        buttons = [
          { label: '💰 Add Income', action: 'post', target: `${baseUrl}/api/frame` },
          { label: '💸 Add Expense', action: 'post', target: `${baseUrl}/api/frame` },
          { label: '📊 View Dashboard', action: 'link', target: baseUrl },
        ];
        break;
      
      case 2:
        // Add Income
        imageUrl = `${baseUrl}/frame-income.png`;
        buttons = [
          { label: '← Back', action: 'post', target: `${baseUrl}/api/frame` },
          { label: '💰 Open App', action: 'link', target: `${baseUrl}?action=income` },
        ];
        break;
      
      case 3:
        // Add Expense
        imageUrl = `${baseUrl}/frame-expense.png`;
        buttons = [
          { label: '← Back', action: 'post', target: `${baseUrl}/api/frame` },
          { label: '💸 Open App', action: 'link', target: `${baseUrl}?action=expense` },
        ];
        break;
      
      default:
        buttons = [
          { label: 'Track Your Money', action: 'post', target: `${baseUrl}/api/frame` },
          { label: 'View Demo', action: 'link', target: baseUrl },
        ];
    }

    // Generate Frame HTML response
    const frameHtml = generateFrameHtml(imageUrl, buttons, postUrl);
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(frameHtml);
  } catch (error) {
    console.error('Frame handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function generateFrameHtml(imageUrl: string, buttons: any[], postUrl: string): string {
  const buttonTags = buttons.map((btn, index) => {
    const i = index + 1;
    if (btn.action === 'link') {
      return `
    <meta property="fc:frame:button:${i}" content="${btn.label}" />
    <meta property="fc:frame:button:${i}:action" content="link" />
    <meta property="fc:frame:button:${i}:target" content="${btn.target}" />`;
    }
    return `
    <meta property="fc:frame:button:${i}" content="${btn.label}" />`;
  }).join('');

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MoneyPaiger - Track Your Finances</title>
    
    <!-- Frame Meta Tags -->
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imageUrl}" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:post_url" content="${postUrl}" />
    ${buttonTags}
    
    <!-- Open Graph -->
    <meta property="og:title" content="MoneyPaiger - Track Your Finances" />
    <meta property="og:description" content="Track income, expenses, and manage your budget directly in Farcaster" />
    <meta property="og:image" content="${imageUrl}" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="MoneyPaiger" />
    <meta name="twitter:description" content="Track your finances in Farcaster" />
    <meta name="twitter:image" content="${imageUrl}" />
  </head>
  <body>
    <h1>MoneyPaiger - Track Your Money</h1>
    <p>A financial tracking app for Farcaster</p>
  </body>
</html>`;
}
