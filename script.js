// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC0rcr...SSLCs_fmvT4_dhuMbrIUB84s",
  authDomain: "solvexchart.firebaseapp.com",
  projectId: "solvexchart",
  storageBucket: "solvexchart.appspot.com",
  messagingSenderId: "80975419718",
  appId: "1:80975419718:web:f951f228285e963cb2687",
  measurementId: "G-SMNCKBCHRG"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Chart.js Setup
const ctx = document.getElementById('svxChart')?.getContext('2d');
if (!ctx) {
  console.error('Canvas element #svxChart not found');
} else {
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'SVX Price (USD)',
        data: [],
        borderColor: '#00ffcc',
        backgroundColor: 'rgba(0, 255, 204, 0.2)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { display: true },
        y: { beginAtZero: false }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Fetch and Update Token Stats
async function fetchTokenStats() {
  console.log('Fetching token stats...');
  const holders = document.getElementById('holders');
  const transfers = document.getElementById('transfers');
  const price = document.getElementById('price');
  const marketCap = document.getElementById('market-cap');
  const totalSupply = document.getElementById('total-supply');

  if (!holders || !transfers || !price || !marketCap || !totalSupply) {
    console.error('One or more DOM elements not found:', { holders, transfers, price, marketCap, totalSupply });
    return;
  }

  try {
    const response = await fetch('https://devnet-api.multiversx.com/tokens/SVX-cc81e1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Response status:', response.status);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    console.log('Fetched data:', data);

    holders.textContent = data.accounts || 'N/A';
    transfers.textContent = data.transfers || 'N/A';
    price.textContent = data.price ? `$${data.price.toFixed(2)}` : 'N/A';
    const supply = data.supply ? parseFloat(data.supply) : 9524;
    const marketCapValue = data.price && supply ? (data.price * supply).toFixed(0) : 'N/A';
    marketCap.textContent = marketCapValue !== 'N/A' ? `$${marketCapValue}` : 'N/A';
    totalSupply.textContent = data.supply || '9524';

    // Update Chart with New Price
    if (chart) {
      const now = new Date().toLocaleTimeString();
      chart.data.labels.push(now);
      chart.data.datasets[0].data.push(data.price || 0);
      if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }
      chart.update();

      // Save Chart State to Firebase
      const state = { labels: chart.data.labels, data: chart.data.datasets[0].data };
      console.log('Saving state:', state);
      db.collection('chartStates').doc('userState').set({ state })
        .then(() => console.log('Chart state saved successfully'))
        .catch(error => console.error('Error saving state:', error));
    } else {
      console.error('Chart is not initialized');
    }
  } catch (error) {
    console.error('Error fetching token stats:', error.message);
    holders.textContent = 'N/A';
    transfers.textContent = 'N/A';
    price.textContent = 'N/A';
    marketCap.textContent = 'N/A';
    totalSupply.textContent = '9524';
  }
}

// Restore Chart State from Firebase on Load
window.addEventListener('load', () => {
  console.log('Loading chart state...');
  db.collection('chartStates').doc('userState').get()
    .then(doc => {
      if (doc.exists) {
        const state = doc.data().state;
        console.log('Loaded state:', state);
        if (chart) {
          chart.data.labels = state.labels || [];
          chart.data.datasets[0].data = state.data || [];
          chart.update();
        } else {
          console.error('Chart not available to restore state');
        }
      } else {
        console.log('No saved state found');
      }
    })
    .catch(error => console.error('Error loading state:', error));

  // Fetch token stats on load and every 10 seconds
  fetchTokenStats();
  setInterval(fetchTokenStats, 10000);

  // Hamburger Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  } else {
    console.error('Menu toggle or nav menu not found');
  }

  // Smooth Scroll for Navigation Links
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    if (anchor) {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          if (window.innerWidth <= 768 && menuToggle) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
          }
        }
      });
    }
  });

  // Timeframe Button Event Listeners
  document.querySelectorAll('.timeframe-btn').forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    }
  });
  const defaultBtn = document.querySelector('.timeframe-btn[data-timeframe="1h"]');
  if (defaultBtn) defaultBtn.classList.add('active');
});
