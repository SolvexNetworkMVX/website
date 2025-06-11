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
const ctx = document.getElementById('svxChart').getContext('2d');
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
      x: { display: false },
      y: { beginAtZero: false }
    },
    plugins: {
      legend: { display: false }
    }
  }
});

// Fetch and Update Token Stats
async function fetchTokenStats() {
  try {
    const response = await fetch('https://devnet-api.multiversx.com/tokens/SVX-cc81e1');
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();

    document.getElementById('holders').textContent = data.accounts || 'N/A';
    document.getElementById('transfers').textContent = data.transfers || 'N/A';
    document.getElementById('price').textContent = data.price ? `$${data.price.toFixed(2)}` : 'N/A';
    const supply = data.supply ? parseFloat(data.supply) : 9524;
    const marketCap = data.price && supply ? (data.price * supply).toFixed(0) : 'N/A';
    document.getElementById('market-cap').textContent = marketCap !== 'N/A' ? `$${marketCap}` : 'N/A';
    document.getElementById('total-supply').textContent = data.supply || '9524';

    // Update Chart with New Price
    const now = new Date().toLocaleTimeString();
    chart.data.labels.push(now);
    chart.data.datasets[0].data.push(data.price || 0);
    if (chart.data.labels.length > 10) { // Limit to 10 data points
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }
    chart.update();

    // Save Chart State to Firebase
    const state = { labels: chart.data.labels, data: chart.data.datasets[0].data };
    db.collection('chartStates').doc('userState').set({ state })
      .then(() => console.log('Chart state saved'))
      .catch(error => console.error('Error saving state:', error));
  } catch (error) {
    console.error('Error fetching token stats:', error);
    document.getElementById('holders').textContent = 'N/A';
    document.getElementById('transfers').textContent = 'N/A';
    document.getElementById('price').textContent = 'N/A';
    document.getElementById('market-cap').textContent = 'N/A';
    document.getElementById('total-supply').textContent = '9524';
  }
}

// Restore Chart State from Firebase on Load
window.addEventListener('load', () => {
  db.collection('chartStates').doc('userState').get()
    .then(doc => {
      if (doc.exists) {
        const state = doc.data().state;
        chart.data.labels = state.labels || [];
        chart.data.datasets[0].data = state.data || [];
        chart.update();
      }
    })
    .catch(error => console.error('Error loading state:', error));

  // Fetch token stats on load and every 10 seconds
  fetchTokenStats();
  setInterval(fetchTokenStats, 10000);

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

  // Timeframe Button Event Listeners (Estetic, fără funcționalitate completă)
  document.querySelectorAll('.timeframe-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  document.querySelector('.timeframe-btn[data-timeframe="1h"]').classList.add('active');
});
