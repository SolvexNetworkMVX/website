// Fetch token statistics from MultiversX API
async function fetchTokenStats() {
    try {
        const response = await fetch('https://devnet-api.multiversx.com/tokens/SVX-cc81e1');
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        
        // Update dashboard with fetched data
        document.getElementById('holders').textContent = data.accounts ? data.accounts : 'N/A';
        document.getElementById('transactions').textContent = data.transactions ? data.transactions : 'N/A'; // Still using transactions as a proxy for transfers
        
        // Price with 2 decimals
        document.getElementById('price').textContent = data.price ? `$${data.price.toFixed(2)}` : 'N/A';
        
        // Calculate market cap: price * supply
        const supply = data.supply ? parseFloat(data.supply) : 9524; // Fallback to static 9524
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
    setInterval(fetchTokenStats, 30000);

    // Hamburger Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            // Close menu on mobile after click
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
});
