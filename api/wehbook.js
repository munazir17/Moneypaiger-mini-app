// api/webhook.js
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const event = req.body;

    console.log("Received Farcaster webhook event:", event);

    // Example: handle different types of Farcaster events
    if (event.type === "user:follow") {
      console.log(`New follow from ${event.userHandle}`);
    }

    if (event.type === "post:create") {
      console.log(`New post by ${event.userHandle}: ${event.postText}`);
    }

    if (event.type === "nft:mint") {
      console.log(`NFT minted by ${event.userHandle}: ${event.nftId}`);
      // TODO: Add your custom logic here, e.g., update database
    }

    // Respond to Farcaster
    res.status(200).json({ message: "Webhook received successfully" });
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
