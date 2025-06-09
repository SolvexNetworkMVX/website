// Fetch token statistics from MultiversX API
async function fetchTokenStats() {
    try {
        const response = await fetch('https://devnet-api.multiversx.com/tokens/SVX-cc81e1');
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        
        // Update dashboard with fetched data
        document.getElementById('holders').textContent = data.accounts ? data.accounts : 'N/A';
        document.getElementById('transactions').textContent = data.transactions ? data.transactions : 'N/A';
        document.getElementById('price').textContent = data.price ? `$${data.price.toFixed(4)}` : 'N/A';
        
        // Calculate market cap: price * supply
        const supply = data.supply ? parseFloat(data.supply) : 9524; // Fallback to static 9524 if API doesn't provide
        const marketCap = data.price && supply ? (data.price * supply).toFixed(2) : 'N/A';
        document.getElementById('market-cap').textContent = marketCap !== 'N/A' ? `$${marketCap}` : 'N/A';
        
        // Total supply from API or static fallback
        document.getElementById('total-supply').textContent = data.supply ? data.supply : '9524';
    } catch (error) {
        console.error('Error fetching token stats:', error);
        document.getElementById('holders').textContent = 'N/A';
        document.getElementById('transactions').textContent = 'N/A';
        document.getElementById('price').textContent = 'N/A';
        document.getElementById('market-cap').textContent = 'N/A';
        document.getElementById('total-supply').textContent = '9524';
    }
}

// Run fetch on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchTokenStats();
    // Refresh stats every 30 seconds for real-time updates
    setInterval(fetchTokenStats, 30000);
});
