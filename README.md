# Moneypaiger Mini App

A Farcaster Mini App for tracking money pings and notifications.

## Setup

1. Clone this repo: `git clone https://github.com/munazir17/Moneypaiger-mini-app`
2. Install dependencies: `npm install`
3. Run locally: `npm run dev`

## Deployment

1. Build: `npm run build`
2. Deploy to a static host (e.g., Vercel, Netlify).
3. Configure in Warpcast:
   - Set the app URL in your Farcaster frame settings.
   - Ensure the app supports Farcaster's frame protocol (POST requests, FID auth).
4. Test in Warpcast's Mini App environment.

## Notes

- Add your custom logic in `src/App.tsx` (e.g., API calls for money tracking).
- Ensure `@farcaster/miniapp-kit` is properly configured for FID authentication.
- For Farcaster docs, see [Farcaster Mini Apps](https://miniapps.farcaster.xyz).

## Troubleshooting

- **Build fails**: Check `node_modules`, run `npm install` again.
- **Auth fails**: Verify Warpcast integration and FID fetching.
- **Frame errors**: Ensure your host supports HTTPS and CORS.
