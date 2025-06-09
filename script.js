// Chart Data and Configuration
let chartData = {
    labels: [],
    datasets: [{
        label: 'SVX Price (USD)',
        data: [],
        borderColor: '#00ffcc',
        backgroundColor: 'rgba(0, 255, 204, 0.2)',
        tension: 0.4,
        fill: true
    }]
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permite control manual al dimensiunii
    scales: {
        x: { display: false },
        y: { beginAtZero: false, ticks: { color: '#ffffff' } }
    },
    plugins: {
        legend: { labels: { color: '#ffffff' } },
        tooltip: { backgroundColor: '#1a1a3a', titleColor: '#00ffcc', bodyColor: '#ffffff' }
    }
};

let svxChart;

// Fetch token statistics and update chart
async function fetchTokenStats(timeframe = '1h') {
    try {
        const response = await fetch('https://devnet-api.multiversx.com/tokens/SVX-cc81e1');
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();

        // Update stats
        document.getElementById('holders').textContent = data.accounts || 'N/A';
        document.getElementById('transfers').textContent = data.transfers || 'N/A';
        document.getElementById('price').textContent = data.price ? `$${data.price.toFixed(2)}` : 'N/A';
        const supply = data.supply ? parseFloat(data.supply) : 9524;
        const marketCap = data.price && supply ? (data.price * supply).toFixed(0) : 'N/A';
        document.getElementById('market-cap').textContent = marketCap !== 'N/A' ? `$${marketCap}` : 'N/A';
        document.getElementById('total-supply').textContent = data.supply || '9524';

        // Update chart with price
        const price = data.price || 0;
        const time = new Date().toLocaleTimeString();
        if (!svxChart) {
            const ctx = document.getElementById('svxChart').getContext('2d');
            svxChart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: chartOptions
            });
        }
        chartData.labels.push(time);
        chartData.datasets[0].data.push(price);

        // Limit data points based on timeframe
        const maxPoints = getMaxPoints(timeframe);
        if (chartData.labels.length > maxPoints) {
            chartData.labels.shift();
            chartData.datasets[0].data.shift();
        }
        svxChart.update();
    } catch (error) {
        console.error('Error fetching token stats:', error);
        document.getElementById('holders').textContent = 'N/A';
        document.getElementById('transfers').textContent = 'N/A';
        document.getElementById('price').textContent = 'N/A';
        document.getElementById('market-cap').textContent = 'N/A';
        document.getElementById('total-supply').textContent = '9524';
    }
}

// Update Chart Data Based on Timeframe
function getMaxPoints(timeframe) {
    switch (timeframe) {
        case '1h': return 360; // ~10s intervals for 1 hour
        case '24h': return 8640; // ~10s intervals for 24 hours
        case '7d': return 60480; // ~10s intervals for 7 days
        default: return 360;
    }
}

// Timeframe Controls
function setTimeframe(timeframe) {
    document.querySelectorAll('.timeframe-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.timeframe-btn[data-timeframe="${timeframe}"]`).classList.add('active');
    chartData.labels = [];
    chartData.datasets[0].data = [];
    fetchTokenStats(timeframe);
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchTokenStats('1h');
    setInterval(() => fetchTokenStats(document.querySelector('.timeframe-btn.active')?.dataset.timeframe || '1h'), 10000);

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
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Timeframe Button Event Listeners
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.addEventListener('click', () => setTimeframe(btn.dataset.timeframe));
    });
    document.querySelector('.timeframe-btn[data-timeframe="1h"]').classList.add('active');
});
