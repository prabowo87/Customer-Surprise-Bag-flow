import { useState } from 'react';
import './index.css';

// Mock Data
const MOCK_MERCHANTS = [
  {
    id: '1',
    name: 'Monsieur Spoon',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60',
    distance: '0.8 km',
    pickupTime: '20:00 - 21:00 Today',
    originalPrice: 'Rp 150.000',
    discountPrice: 'Rp 45.000',
    description: 'A delicious assortment of leftover croissants, danishes, and sourdough breads baked fresh today.',
    tags: ['Pastries', 'Halal']
  },
  {
    id: '2',
    name: 'SaladStop!',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60',
    distance: '1.2 km',
    pickupTime: '19:30 - 20:30 Today',
    originalPrice: 'Rp 120.000',
    discountPrice: 'Rp 40.000',
    description: 'Fresh surplus salads and wraps. Might contain chicken or fish.',
    tags: ['Healthy', 'Halal']
  },
  {
    id: '3',
    name: 'Starbucks',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60',
    distance: '2.5 km',
    pickupTime: '21:00 - 22:00 Today',
    originalPrice: 'Rp 80.000',
    discountPrice: 'Rp 25.000',
    description: 'Assorted cakes, sandwiches, or pastries from our daily display.',
    tags: ['Cafe', 'Halal']
  }
];

function App() {
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'checkout' | 'success'>('list');
  const [selectedMerchant, setSelectedMerchant] = useState<typeof MOCK_MERCHANTS[0] | null>(null);

  const navigateTo = (view: 'list' | 'detail' | 'checkout' | 'success', merchant: typeof MOCK_MERCHANTS[0] | null = null) => {
    if (merchant) setSelectedMerchant(merchant);
    setCurrentView(view);
  };

  return (
    <div className="app-container">
      {/* Dynamic Header */}
      <header className="app-header">
        {currentView !== 'list' && currentView !== 'success' ? (
          <button className="back-btn" onClick={() => {
            if (currentView === 'detail') navigateTo('list');
            if (currentView === 'checkout') navigateTo('detail', selectedMerchant);
          }}>
            ←
          </button>
        ) : (
          <div aria-hidden="true"></div>
        )}
        <h1>Good Again</h1>
        <div aria-hidden="true"></div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {currentView === 'list' && (
          <MerchantList onSelect={(m) => navigateTo('detail', m)} />
        )}
        {currentView === 'detail' && selectedMerchant && (
          <SurpriseBagDetails merchant={selectedMerchant} onReserve={() => navigateTo('checkout', selectedMerchant)} />
        )}
        {currentView === 'checkout' && selectedMerchant && (
          <Checkout merchant={selectedMerchant} onComplete={() => navigateTo('success')} />
        )}
        {currentView === 'success' && (
          <SuccessScreen onHome={() => navigateTo('list')} />
        )}
      </main>
    </div>
  );
}

// --- Components ---

function MerchantList({ onSelect }: { onSelect: (m: any) => void }) {
  return (
    <div className="merchant-list-container">
      <h2 className="section-title">Rescue Food Near You</h2>
      {MOCK_MERCHANTS.map((merchant) => (
        <div key={merchant.id} className="merchant-card" onClick={() => onSelect(merchant)}>
          <img src={merchant.image} alt={merchant.name} className="merchant-image" />
          <div className="merchant-info">
            <div className="merchant-header">
              <h3 className="merchant-name">{merchant.name}</h3>
              <span className="merchant-distance">📍 {merchant.distance}</span>
            </div>
            <div className="bag-info">
              <span className="pickup-time">⏰ {merchant.pickupTime}</span>
              <div className="price-container">
                <span className="original-price">{merchant.originalPrice}</span>
                <span className="discount-price">{merchant.discountPrice}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SurpriseBagDetails({ merchant, onReserve }: { merchant: any, onReserve: () => void }) {
  return (
    <>
      <div className="detail-hero">
        <img src={merchant.image} alt={merchant.name} />
        <div className="detail-hero-overlay">
          <h2>{merchant.name}</h2>
          <p>Surprise Bag</p>
        </div>
      </div>
      
      <div className="detail-content">
        <div className="info-card">
          <div className="info-row">
            <span className="info-label">Pickup Time</span>
            <span className="info-value highlight">{merchant.pickupTime}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Distance</span>
            <span className="info-value">{merchant.distance}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Price</span>
            <span className="info-value highlight">{merchant.discountPrice}</span>
          </div>
        </div>

        <div className="what-you-get">
          <h3>What you might get</h3>
          <p>{merchant.description}</p>
          <div className="tags">
            {merchant.tags.map((tag: string) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="action-bar">
        <button className="btn-primary" onClick={onReserve}>Reserve Now</button>
      </div>
    </>
  );
}

function Checkout({ merchant, onComplete }: { merchant: any, onComplete: () => void }) {
  const [selectedPayment, setSelectedPayment] = useState('gopay');

  return (
    <>
      <div className="checkout-container">
        <h2 className="section-title">Checkout</h2>
        
        <div className="summary-card">
          <div className="summary-item">
            <span>{merchant.name} - Surprise Bag</span>
            <span>{merchant.discountPrice}</span>
          </div>
          <div className="summary-item">
            <span>Platform Fee</span>
            <span>Rp 2.000</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>Rp 47.000</span>
          </div>
        </div>

        <h3 className="section-title" style={{ marginTop: '2rem', fontSize: '1rem' }}>Payment Method</h3>
        <div className="payment-methods">
          <div 
            className={`payment-method ${selectedPayment === 'gopay' ? 'selected' : ''}`}
            onClick={() => setSelectedPayment('gopay')}
          >
            <span>🟢</span>
            <span className="payment-method-name">GoPay</span>
          </div>
          <div 
            className={`payment-method ${selectedPayment === 'ovo' ? 'selected' : ''}`}
            onClick={() => setSelectedPayment('ovo')}
          >
            <span>🟣</span>
            <span className="payment-method-name">OVO</span>
          </div>
          <div 
            className={`payment-method ${selectedPayment === 'qris' ? 'selected' : ''}`}
            onClick={() => setSelectedPayment('qris')}
          >
            <span>📱</span>
            <span className="payment-method-name">QRIS</span>
          </div>
        </div>
      </div>

      <div className="action-bar">
        <button className="btn-primary" onClick={onComplete}>
          Pay Rp 47.000
        </button>
      </div>
    </>
  );
}

function SuccessScreen({ onHome }: { onHome: () => void }) {
  return (
    <div className="success-screen">
      <div className="success-icon">🎉</div>
      <h2>Bag Reserved!</h2>
      <p>Your surprise bag is ready for pickup later today. Don't forget your pickup window!</p>
      <button className="btn-primary" onClick={onHome} style={{ width: '80%' }}>
        Back to Home
      </button>
    </div>
  );
}

export default App;
