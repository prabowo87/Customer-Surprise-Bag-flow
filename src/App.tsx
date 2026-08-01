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
    originalPrice: 150000,
    discountPrice: 45000,
    description: 'A delicious assortment of leftover croissants, danishes, and sourdough breads baked fresh today.',
    subtitle: '4–6 assorted pastries from today\'s batch',
    tags: ['Pastries', 'Halal'],
    dietary: ['Halal'],
    category: 'Bakery',
    whatToExpect: ['3–4 fresh croissants or danishes', '2 slices of sourdough bread', 'Small treat from today\'s batch'],
    mapPos: { top: 32, left: 26 }
  },
  {
    id: '2',
    name: 'SaladStop!',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60',
    distance: '1.2 km',
    pickupTime: '19:30 - 20:30 Today',
    originalPrice: 120000,
    discountPrice: 40000,
    description: 'Fresh surplus salads and wraps. Might contain chicken or fish.',
    subtitle: '1–2 salads or wraps from today\'s selection',
    tags: ['Healthy', 'Halal'],
    dietary: ['Halal', 'Vegetarian', 'Vegan'],
    category: 'Salad',
    whatToExpect: ['1 fresh salad bowl', '1 wrap or side', 'Your choice of dressing'],
    mapPos: { top: 58, left: 62 }
  },
  {
    id: '3',
    name: 'Starbucks',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60',
    distance: '2.5 km',
    pickupTime: '21:00 - 22:00 Today',
    originalPrice: 80000,
    discountPrice: 25000,
    description: 'Assorted cakes, sandwiches, or pastries from our daily display.',
    subtitle: '2–3 items from today\'s display case',
    tags: ['Cafe', 'Halal'],
    dietary: ['Halal'],
    category: 'Cafe',
    whatToExpect: ['1 slice of cake or pastry', '1 sandwich or snack', 'A drink of the day'],
    mapPos: { top: 22, left: 74 }
  }
];

const DIETARY_FILTERS = ['Halal', 'Vegetarian', 'Vegan'];

const formatPrice = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

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
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedPin, setSelectedPin] = useState<typeof MOCK_MERCHANTS[0] | null>(null);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const filteredMerchants =
    activeFilters.length === 0
      ? MOCK_MERCHANTS
      : MOCK_MERCHANTS.filter((m) => activeFilters.every((f) => m.dietary.includes(f)));

  return (
    <div className="merchant-list-container">
      <div className="list-map-toggle" role="group" aria-label="View mode">
        <button
          className={`list-map-option ${viewMode === 'list' ? 'selected' : ''}`}
          onClick={() => { setViewMode('list'); setSelectedPin(null); }}
        >
          ☰ List
        </button>
        <button
          className={`list-map-option ${viewMode === 'map' ? 'selected' : ''}`}
          onClick={() => setViewMode('map')}
        >
          🗺 Map
        </button>
      </div>

      <h2 className="section-title">Rescue Food Near You</h2>

      <div className="filter-pills" role="group" aria-label="Dietary filters">
        {DIETARY_FILTERS.map((filter) => (
          <button
            key={filter}
            className={`filter-pill ${activeFilters.includes(filter) ? 'active' : ''}`}
            onClick={() => toggleFilter(filter)}
            aria-pressed={activeFilters.includes(filter)}
          >
            {filter === 'Halal' ? 'Halal ✓' : filter}
          </button>
        ))}
      </div>

      {filteredMerchants.length === 0 ? (
        <div className="empty-results">
          <p>No surprise bags match your dietary filters.</p>
          <button className="btn-secondary" onClick={() => setActiveFilters([])}>
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'map' ? (
        <div className="static-map">
          <span className="map-road map-road-h1" aria-hidden="true"></span>
          <span className="map-road map-road-h2" aria-hidden="true"></span>
          <span className="map-road map-road-v1" aria-hidden="true"></span>
          <span className="map-road map-road-v2" aria-hidden="true"></span>
          <span className="map-label map-label-user">📍 You</span>
          {filteredMerchants.map((merchant) => (
            <button
              key={merchant.id}
              className="map-pin"
              style={{ top: `${merchant.mapPos.top}%`, left: `${merchant.mapPos.left}%` }}
              onClick={() => setSelectedPin(merchant)}
              aria-label={merchant.name}
            >
              <span className="map-pin-dot">🟢</span>
            </button>
          ))}
          {selectedPin && (
            <div className="map-card">
              <div className="map-card-header">
                <h3>{selectedPin.name}</h3>
                <button className="map-card-close" onClick={() => setSelectedPin(null)}>✕</button>
              </div>
              <p className="map-card-sub">{selectedPin.subtitle}</p>
              <div className="map-card-row">
                <span>📍 {selectedPin.distance}</span>
                <span>⏰ {selectedPin.pickupTime}</span>
              </div>
              <div className="map-card-price">
                <span className="discount-price">{formatPrice(selectedPin.discountPrice)}</span>
                <span className="save-badge">Save 70%</span>
              </div>
              <button className="btn-primary" onClick={() => onSelect(selectedPin)}>
                View Bag
              </button>
            </div>
          )}
        </div>
      ) : (
        filteredMerchants.map((merchant) => (
          <div key={merchant.id} className="merchant-card" onClick={() => onSelect(merchant)}>
            <img src={merchant.image} alt={merchant.name} className="merchant-image" />
            <div className="merchant-info">
              <div className="merchant-header">
                <h3 className="merchant-name">{merchant.name}</h3>
                <span className="merchant-distance">📍 {merchant.distance}</span>
              </div>
              <p className="merchant-subtitle">{merchant.subtitle}</p>
              <div className="bag-info">
                <span className="pickup-time">⏰ {merchant.pickupTime}</span>
                <div className="price-container">
                  <span className="original-price">{formatPrice(merchant.originalPrice)}</span>
                  <span className="discount-price">{formatPrice(merchant.discountPrice)}</span>
                  <span className="save-badge">Save 70%</span>
                </div>
              </div>
              <div className="tags">
                {merchant.tags.map((tag: string) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <div className="card-actions">
                <button
                  className="btn-location"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPin(merchant);
                    setViewMode('map');
                  }}
                >
                  📍 View Location
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function SurpriseBagDetails({ merchant, onReserve }: { merchant: any, onReserve: () => void }) {
  const [showInfo, setShowInfo] = useState(false);

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
            <span className="info-value highlight">
              {formatPrice(merchant.discountPrice)}
              <span className="strike-inline">{formatPrice(merchant.originalPrice)}</span>
            </span>
          </div>
        </div>

        <div className="what-you-get">
          <h3>
            What you might get
            <button className="info-btn" onClick={() => setShowInfo((s) => !s)} aria-expanded={showInfo}>?</button>
          </h3>
          {showInfo && (
            <div className="info-popover">
              <strong>What is a Surprise Bag?</strong>
              <p>Merchants pack leftover food from today's batch into a surprise bag at a big discount — you only know exactly what's inside when you pick it up. It's a great deal for you and saves food from going to waste.</p>
            </div>
          )}
          <p className="bag-subtitle">{merchant.subtitle}</p>
          <p>{merchant.description}</p>
          <ul className="expect-list">
            {merchant.whatToExpect.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <div className="tags">
            {merchant.tags.map((tag: string) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="action-bar">
        <button className="btn-primary" onClick={onReserve}>Reserve Now — {formatPrice(merchant.discountPrice)}</button>
      </div>
    </>
  );
}

function Checkout({ merchant, onComplete }: { merchant: any, onComplete: () => void }) {
  const [selectedPayment, setSelectedPayment] = useState('gopay');
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup');
  const [showOptional, setShowOptional] = useState(false);
  const [note, setNote] = useState('');
  const [promo, setPromo] = useState('');
  const [confirmPickup, setConfirmPickup] = useState(false);

  const platformFee = 2000;
  const total = merchant.discountPrice + platformFee;

  return (
    <>
      <div className="checkout-container">
        <h2 className="section-title">Checkout</h2>

        <div className="fulfillment-toggle" role="group" aria-label="Order method">
          <button
            className={`fulfillment-option ${fulfillment === 'pickup' ? 'selected' : ''}`}
            onClick={() => setFulfillment('pickup')}
          >
            📦 Pickup
          </button>
          <button
            className={`fulfillment-option ${fulfillment === 'delivery' ? 'selected' : ''}`}
            onClick={() => setFulfillment('delivery')}
          >
            🛵 Delivery
          </button>
        </div>

        <div className="summary-card">
          <div className="summary-item">
            <span>{merchant.name} - Surprise Bag</span>
            <span>{formatPrice(merchant.discountPrice)}</span>
          </div>
          <div className="summary-item">
            <span>Platform Fee</span>
            <span>{formatPrice(platformFee)}</span>
          </div>
          <div className="summary-item">
            <span>You save</span>
            <span className="you-save">-{formatPrice(merchant.originalPrice - merchant.discountPrice)}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {fulfillment === 'pickup' && (
          <div className="pickup-confirm">
            <label className="confirm-label">
              <input
                type="checkbox"
                checked={confirmPickup}
                onChange={(e) => setConfirmPickup(e.target.checked)}
              />
              <span>I understand pickup is <strong>{merchant.pickupTime}</strong></span>
            </label>
          </div>
        )}

        <h3 className="section-title" style={{ marginTop: '2rem', fontSize: '1rem' }}>Payment Method</h3>
        <div className="payment-methods">
          <div 
            className={`payment-method ${selectedPayment === 'gopay' ? 'selected' : ''}`}
            onClick={() => setSelectedPayment('gopay')}
          >
            <span>🟢</span>
            <span className="payment-method-name">GoPay</span>
            {selectedPayment === 'gopay' && <span className="last-used">Last used</span>}
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

        <button className="optional-toggle" onClick={() => setShowOptional((s) => !s)}>
          Optional details {showOptional ? '▾' : '▸'}
        </button>
        {showOptional && (
          <div className="optional-section">
            <label className="field-label" htmlFor="note">Order Notes</label>
            <textarea
              id="note"
              className="field-input"
              placeholder="e.g. no cutlery, allergies..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <label className="field-label" htmlFor="promo">Promo Code</label>
            <input
              id="promo"
              className="field-input"
              placeholder="Enter code"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="action-bar">
        <div className="sticky-summary">
          <span className="sticky-total">{formatPrice(total)}</span>
          <button
            className="btn-primary"
            disabled={fulfillment === 'pickup' && !confirmPickup}
            onClick={onComplete}
          >
            {fulfillment === 'pickup' ? `Pay ${formatPrice(total)}` : 'Confirm Order'}
          </button>
        </div>
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
