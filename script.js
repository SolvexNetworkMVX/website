// Firebase Config (Replace with your Firebase config from Console)
const firebaseConfig = {
apiKey: "AIzaSyCQrct-S5LCs_fTmvT4-d4huMbRrIU8B4s",
  authDomain: "solvexchart.firebaseapp.com",
  projectId: "solvexchart",
  storageBucket: "solvexchart.firebasestorage.app",
  messagingSenderId: "809750419718",
  appId: "1:809750419718:web:f95f12282885e963cb2687",
  measurementId: "G-SMNCKBCHRG"

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Fetch token statistics and update stats
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
  } catch (error) {
    console.error('Error fetching token stats:', error);
    document.getElementById('holders').textContent = 'N/A';
    document.getElementById('transfers').textContent = 'N/A';
    document.getElementById('price').textContent = 'N/A';
    document.getElementById('market-cap').textContent = 'N/A';
    document.getElementById('total-supply').textContent = '9524';
  }
}

// Initialize TradingView Chart with Firebase state management
const chart = new TradingView.widget({
  symbol: 'SVX-cc81e1',
  datafeed: {
    onReady: (callback) => {
      setTimeout(() => callback({
        supports_search: false,
        supports_group_request: false,
        supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"]
      }), 0);
    },
    resolveSymbol: async (symbolName, onSymbolResolvedCallback) => {
      const data = await (await fetch('https://devnet-api.multiversx.com/tokens/SVX-cc81e1')).json();
      onSymbolResolvedCallback({
        name: symbolName,
        description: 'SVX Token on MultiversX',
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
        ticker: symbolName,
        exchange: 'xExchange',
        minmov: 1,
        pricescale: 1000000,
        has_intraday: true,
        intraday_multipliers: ['1', '5', '15', '30', '60'],
        supported_resolution: ['1', '5', '15', '30', '60', '1D', '1W', '1M']
      });
    },
    getBars: async (symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback) => {
      const data = await (await fetch('https://devnet-api.multiversx.com/tokens/SVX-cc81e1')).json();
      const bars = [{
        time: Math.floor(Date.now() / 1000),
        open: data.price || 0,
        high: data.price || 0,
        low: data.price || 0,
        close: data.price || 0,
        volume: data.transfers || 0
      }];
      onDataCallback(bars, { noData: !bars.length });
    }
  },
  interval: 'D',
  container_id: 'tradingview_chart',
  library_path: '/path/to/charting_library/',
  locale: 'en',
  theme: 'dark',
  height: 150,
  width: '100%',
  disabled_features: ['header_saveload'],
  enable_publishing: false,
  allow_symbol_change: false
});

// Save chart state to Firebase when price fluctuates
chart.onChartReady(() => {
  chart.subscribe('onVisibleRangeChanged', () => {
    const state = chart.getState(); // Captures price and range
    db.collection('chartStates').doc('userState').set({ state })
      .then(() => console.log('Chart state saved'))
      .catch(error => console.error('Error saving state:', error));
  });
});

// Restore chart state from Firebase on load
window.addEventListener('load', () => {
  db.collection('chartStates').doc('userState').get()
    .then(doc => {
      if (doc.exists) {
        chart.setState(doc.data().state);
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

  // Timeframe Button Event Listeners
  document.querySelectorAll('.timeframe-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  document.querySelector('.timeframe-btn[data-timeframe="1h"]').classList.add('active');
});
