# **App Name**: DAppfolio

## Core Features:

- Landing Page: Attractive landing page with blockchain-inspired animation and 'Connect to Explore' button.
- Simulated Wallet Connection: Simulates a MetaMask-like 'Connect Wallet' experience to transition to the main dashboard.
- Main Dashboard with 'Unmined Blocks': Presents portfolio sections as 'Unmined Blocks' (About Me, Projects, Skills, Contact) with a 'Mint Block' interaction.
- Simulated Minting: Allows users to 'Mint' blocks, deducting pETH and triggering a 'mining' animation before unlocking content. The amount of pETH to deduct should be decided using a tool, since some blocks should cost more to mine than others.
- Faucet Feature: Allows users to claim 1.0 pETH from a Faucet.
- Content Reveal Modal: Presents portfolio information within a modal styled like a block explorer, triggered by 'View Content'.
- Persistent State Transitions: A global state machine determines which components on each screen should appear or not, given user interactions such as claiming from the Faucet, or Minting and viewing Blocks.
- Dynamic Gas Fees (Your pETH Tool): A 'Live Gas Oracle' Widget with a fluctuating 'Gas Price' indicator in the dashboard header. The cost to mint a block is now (Base Fee) * (Current Gas Price).
- Faucet Cooldown: After a user claims from the Faucet, the button becomes disabled for a 'cooldown' period (e.g., 60 seconds), with a timer counting down.
- Session Persistence: Use the browser's `localStorage` to save the user's state. If they mint the 'Projects' block and then refresh the page, it should remain 'Mined.'
- Richer Content Modals: Enhance the 'Tech Stack' for projects by using actual small logos/icons for each technology (e.g., React, Solidity, AWS logos).

## Style Guidelines:

- Color Palette: Dark background (#0D1117), vibrant electric green (#10B981) as the primary color for glowing effects and buttons. The green communicates the modern, techy aspects of blockchains.
- Background Color: Desaturated green (#1A2622) to ensure contrast with other elements in a dark scheme.
- Accent Color: A light-blue (#3B82F6) will add contrast to buttons and notifications.
- Font: 'Space Grotesk' (sans-serif) for headlines and shorter pieces of text. This sans-serif complements the computer/tech feel of blockchain and related topics.
- Note: currently only Google Fonts are supported.
- Complementary Body Font: Consider pairing 'Space Grotesk' with a highly readable body font like 'Inter' or 'Roboto' for longer paragraphs of text inside the modals.
- Use minimalistic, line-based icons related to blockchain and web3 concepts.
- Specific Icon Library: Specify a library like `Tabler Icons` or `Feather Icons`. They are minimalist, line-based, and will perfectly match your aesthetic.
- Dashboard Layout: A grid-based layout with clear sections for 'Unmined Blocks' and wallet information.
- Subtle Animations: Use smooth transitions, zoom effects, and a 'mining' animation to enhance the DApp experience.
- Actionable Feedback & Notifications: Use 'toast' notifications for feedback. When a user claims from the faucet, a small pop-up should appear saying '+1.0 pETH added to your wallet.' When a mint is successful, a 'Block #X successfully mined!' notification should appear.