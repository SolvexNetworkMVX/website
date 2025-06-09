# SolveX Network Website

Welcome to the official website for **SolveX Network**, a cutting-edge project on the MultiversX blockchain (devnet) focused on sustainable growth and robust tokenomics. This modern, sleek, and responsive site showcases the SVX token, its real-time statistics, and key links for interaction with the ecosystem.

## Features
- **Modern Design**: Sleek, 2025-style interface with gradients, neon accents, and smooth transitions.
- **Real-Time Dashboard**: Displays SVX token stats (holders, transactions, price, market cap, total supply) fetched from the MultiversX API (`https://devnet-api.multiversx.com/tokens/SVX-cc81e1`).
- **Key Links**: Buttons for buying SVX, exploring the SVX/USDC pool, viewing the token on the explorer, and connecting via Twitter and GitHub.
- **Responsive**: Fully optimized for desktop, tablet, and mobile devices.
- **GitHub Pages Ready**: Static HTML, CSS, and JavaScript for easy deployment.

## Installation
1. **Clone or Download**:
   - Clone this repository: `git clone https://github.com/SolvexNetworkMVX/website.git`
   - Or download the ZIP and extract it.
2. **File Structure**:
   - `index.html`: Main page structure.
   - `styles.css`: Styling for a modern, professional look.
   - `script.js`: Fetches and updates token stats from the API.
3. **Deploy to GitHub Pages**:
   - Create a GitHub repository (e.g., `solvex-website`).
   - Upload `index.html`, `styles.css`, and `script.js` to the root of the repository.
   - Go to **Settings > Pages** in your repo.
   - Set the source to "Deploy from a branch", select the `main` branch, and choose the `/ (root)` folder.
   - Save and wait for deployment. Access your site at `https://yourusername.github.io/solvex-website`.

## Usage
- Open the site in a browser to explore SolveX Network.
- The dashboard updates every 30 seconds with real-time SVX token stats from the MultiversX devnet API.
- Click buttons to:
  - **Buy SVX**: Trade on devnet.xexchange.com.
  - **Explore Pool**: View the SVX/USDC pool (APR 20%-100%).
  - **Explorer**: Check token details.
  - **Twitter**: Follow @SolvexMVX.
  - **GitHub**: Visit the SolveXNetworkMVX repo.

## Customization
- **Content**: Edit text in `index.html` for About, Tokenomics, or Liquidity sections.
- **Style**: Modify colors, fonts, or animations in `styles.css`.
- **API**: Adjust `script.js` if the MultiversX API format changes.

## Notes
- Built with HTML, CSS, and JavaScript—no additional dependencies required.
- Tested for responsiveness and cross-browser compatibility.
- API data may be unavailable if the devnet API is down; fallback values display "N/A" or the static total supply (9524).

## License
© 2025 SolveX Network. All rights reserved.
