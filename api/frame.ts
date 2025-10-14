import { VercelRequest, VercelResponse } from '@vercel/node';

interface FrameRequest {
  untrustedData: {
    fid: number;
    buttonIndex: number;
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const frameRequest = req.body as FrameRequest;
    const buttonIndex = frameRequest.untrustedData?.buttonIndex || 1;
    
    const baseUrl = 'https://moneypaiger-mini-app-4be2.vercel.app';
    
    let imageUrl = `${baseUrl}/og-image.png`;
    let buttons = [];

    switch (buttonIndex) {
      case 1:
        imageUrl = `${baseUrl}/frame-track.png`;
        buttons = [
          { label: '💰 Add Income', action: 'post' },
          { label: '💸 Add Expense', action: 'post' },
          { label: '📊 Open App', action: 'link', target: baseUrl },
        ];
        break;
      case 2:
        imageUrl = `${baseUrl}/frame-income.png`;
        buttons = [
          { label: '← Back', action: 'post' },
          { label: '💰 Open App', action: 'link', target: `${baseUrl}?action=income` },
        ];
        break;
      case 3:
        imageUrl = `${baseUrl}/frame-expense.png`;
        buttons = [
          { label: '← Back', action: 'post' },
          { label: '💸 Open App', action: 'link', target: `${baseUrl}?action=expense` },
        ];
        break;
      default:
        buttons = [
          { label: '💰 Track Money', action: 'post' },
          { label: '📊 Open App', action: 'link', target: baseUrl },
        ];
    }

    const buttonTags = buttons.map((btn, i) => {
      const idx = i + 1;
      if (btn.action === 'link') {
        return `<meta property="fc:frame:button:${idx}" content="${btn.label}" />
    <meta property="fc:frame:button:${idx}:action" content="link" />
    <meta property="fc:frame:button:${idx}:target" content="${btn.target}" />`;
      }
      return `<meta property="fc:frame:button:${idx}" content="${btn.label}" />`;
    }).join('\n    ');

    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imageUrl}" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
    ${buttonTags}
  </head>
  <body><h1>MoneyPaiger Frame</h1></body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Frame error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

**Save the file.**

---

### **STEP 2: Update index.html**

1. Open `index.html` in your root folder
2. Find the `<head>` section
3. Add these meta tags **after** the viewport meta tag:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- ADD THESE FARCASTER FRAME META TAGS -->
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="https://moneypaiger-mini-app-4be2.vercel.app/og-image.png" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:post_url" content="https://moneypaiger-mini-app-4be2.vercel.app/api/frame" />
    <meta property="fc:frame:button:1" content="💰 Track Money" />
    <meta property="fc:frame:button:2" content="📊 Open App" />
    <meta property="fc:frame:button:2:action" content="link" />
    <meta property="fc:frame:button:2:target" content="https://moneypaiger-mini-app-4be2.vercel.app" />
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="MoneyPaiger - Track Your Finances" />
    <meta property="og:description" content="Track income, expenses, and budgets on Farcaster. Built by @munazir" />
    <meta property="og:image" content="https://moneypaiger-mini-app-4be2.vercel.app/og-image.png" />
    <meta property="og:url" content="https://moneypaiger-mini-app-4be2.vercel.app" />
    
    <title>MoneyPaiger - Timeline of Digital Finance</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
