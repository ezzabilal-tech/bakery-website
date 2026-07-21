import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  Plus, 
  Minus, 
  X, 
  CheckCircle, 
  ArrowRight,
  Heart,
  Coffee,
  Award,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PRODUCTS = [
  {
    id: 1,
    name: "Artisanal Sourdough Loaf",
    category: "breads",
    price: 7.50,
    tag: "Bestseller",
    rating: 4.9,
    description: "Slow-fermented for 36 hours with naturally cultured sourdough starter and crunchy golden crust.",
    image: "/images/sourdough.jpg"
  },
  {
    id: 2,
    name: "Golden Butter Croissant",
    category: "pastries",
    price: 4.25,
    tag: "Fresh Daily",
    rating: 5.0,
    description: "Authentic 81-layer French butter croissant baked fresh every morning at 6 AM.",
    image: "/images/croissant.jpg"
  },
  {
    id: 3,
    name: "Berry Chocolate Truffle Cake",
    category: "cakes",
    price: 38.00,
    tag: "Chef Special",
    rating: 4.9,
    description: "70% Valrhona dark chocolate sponge filled with fresh raspberries and cocoa glaze.",
    image: "/images/chocolate_cake.jpg"
  },
  {
    id: 4,
    name: "French Strawberry Tart",
    category: "pastries",
    price: 8.50,
    tag: "Seasonal",
    rating: 4.8,
    description: "Crisp almond pastry crust loaded with vanilla bean diplomatic cream and glazed fresh strawberries.",
    image: "/images/strawberry_tart.jpg"
  },
  {
    id: 5,
    name: "Almond Pain Au Chocolat",
    category: "pastries",
    price: 5.25,
    tag: "Popular",
    rating: 4.8,
    description: "Flaky puff pastry filled with Belgian dark chocolate and toasted almond frangipane.",
    image: "/images/croissant.jpg"
  },
  {
    id: 6,
    name: "Artisan Cappuccino",
    category: "coffee",
    price: 4.75,
    tag: "Organic Coffee",
    rating: 4.9,
    description: "Double shot of single-origin espresso blended with silky micro-foam steam milk.",
    image: "/images/hero.jpg"
  }
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  const filteredProducts = activeCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setOrderSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setOrderSubmitted(false);
    setCart([]);
  };

  return (
    <div className="bakery-app">
      {/* Top Announcement Bar */}
      <div style={{ background: '#292524', color: '#fef3c7', padding: '0.5rem 0', textAlign: 'center', fontSize: '0.85rem', fontWeight: '500' }}>
        ✨ Free Local Delivery on Fresh Orders Over $30 | Use Code <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>BAKEFRESH</span>
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="container nav-inner">
          <a href="#" className="brand-logo">
            <div className="brand-icon">
              <Sparkles size={22} />
            </div>
            <span>L'Étoile Bakery</span>
          </a>

          <ul className="nav-links">
            <li><a href="#menu">Menu</a></li>
            <li><a href="#about">Our Story</a></li>
            <li><a href="#specials">Specials</a></li>
            <li><a href="#reviews">Reviews</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>

          <div className="nav-actions">
            <button className="cart-btn" onClick={() => setIsCartOpen(true)} title="View Cart">
              <ShoppingBag size={20} />
              {totalCartCount > 0 && <span className="cart-badge">{totalCartCount}</span>}
            </button>
            <button className="order-now-btn" onClick={() => setIsOrderModalOpen(true)}>
              Order Online
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <div className="hero-tag">
              <Sparkles size={16} /> Baked Fresh Every Single Morning
            </div>
            <h1 className="hero-title">
              Crafting Pure <span>Happiness</span> In Every Bite.
            </h1>
            <p className="hero-desc">
              From our 36-hour slow-fermented sourdough to delicate hand-laminated French croissants, experience artisanal bakery perfection made with organic local ingredients.
            </p>
            <div className="hero-cta-group">
              <button className="order-now-btn" onClick={() => {
                document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Explore Menu <ArrowRight size={18} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
              </button>
              <button className="secondary-btn" onClick={() => setIsOrderModalOpen(true)}>
                Quick Order
              </button>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img src="/images/hero.jpg" alt="Artisan Bakery Counter" className="hero-img" />
            <div className="hero-badge-float">
              <div className="float-icon">
                <Award size={24} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '1rem', color: '#292524' }}>Best Bakery 2026</strong>
                <span style={{ fontSize: '0.85rem', color: '#78716c' }}>Golden Spoon Award Winner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu & Category Section */}
      <section id="menu" className="container" style={{ padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Our Bakery Delights</h2>
          <p style={{ color: '#78716c', fontSize: '1.05rem' }}>Handcrafted with love, premium European butter, and organic stone-ground flour</p>
        </div>

        {/* Category Filters */}
        <div className="category-bar">
          {['all', 'breads', 'pastries', 'cakes', 'coffee'].map(cat => (
            <button 
              key={cat}
              className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="card-img-box">
                <img src={product.image} alt={product.name} className="card-img" />
                <span className="card-tag">{product.tag}</span>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#d97706', fontWeight: '600' }}>
                    <Star size={14} fill="#d97706" /> {product.rating}
                  </span>
                </div>
                <h3 className="card-title">{product.name}</h3>
                <p className="card-desc">{product.description}</p>
                <div className="card-footer">
                  <span className="card-price">${product.price.toFixed(2)}</span>
                  <button className="add-btn" onClick={() => addToCart(product)}>
                    <Plus size={16} /> Add to Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bakery Story / Features */}
      <section id="about" className="story-section">
        <div className="container story-grid">
          <div>
            <img src="/images/sourdough.jpg" alt="Baker shaping dough" style={{ width: '100%', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }} />
          </div>
          <div>
            <span style={{ color: '#d97706', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Our Passion</span>
            <h2 style={{ fontSize: '2.6rem', marginTop: '0.5rem', marginBottom: '1.25rem', lineHeight: '1.2' }}>
              Traditional European Baking Techniques Meets Modern Flavors
            </h2>
            <p style={{ color: '#78716c', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              Founded in 2018, L'Étoile Bakery brings authentic French pastries and artisan sourdough breads to your table. We source organic heirloom grains, Normandy butter, and seasonal fruits to create unforgettable moments.
            </p>
            <ul className="feature-list">
              <li className="feature-item">
                <ShieldCheck className="feature-icon" size={20} /> 100% Organic Flours
              </li>
              <li className="feature-item">
                <Clock className="feature-icon" size={20} /> 36-Hour Fermentation
              </li>
              <li className="feature-item">
                <Heart className="feature-icon" size={20} /> No Preservatives
              </li>
              <li className="feature-item">
                <Coffee className="feature-icon" size={20} /> Fresh Specialty Coffee
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Cart Slide-out Drawer */}
      <div className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h3 style={{ fontSize: '1.4rem' }}>Your Basket ({totalCartCount})</h3>
            <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>

          <div className="cart-items-list">
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#a8a29e', marginTop: '3rem' }}>
                <ShoppingBag size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>Your basket is currently empty.</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.name}</h4>
                    <span className="cart-item-price">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                  <div className="qty-controls">
                    <button className="qty-btn" onClick={() => updateQty(item.id, -1)}><Minus size={14} /></button>
                    <span style={{ fontWeight: '600' }}>{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, 1)}><Plus size={14} /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total-row">
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <button className="checkout-btn" onClick={() => {
                setIsCartOpen(false);
                setIsOrderModalOpen(true);
              }}>
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Checkout / Order Modal */}
      {isOrderModalOpen && (
        <div className="modal-overlay" onClick={closeOrderModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={closeOrderModal}>
              <X size={20} />
            </button>

            {!orderSubmitted ? (
              <div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Complete Your Order</h3>
                <p style={{ color: '#78716c', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  {cart.length > 0 ? `Subtotal: $${cartSubtotal.toFixed(2)}` : 'Order Fresh Pickup or Delivery'}
                </p>

                <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.35rem' }}>Your Full Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Eleanor Vance" 
                      value={customerInfo.name}
                      onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #d6d3d1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.35rem' }}>Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="+1 (555) 000-0000" 
                      value={customerInfo.phone}
                      onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #d6d3d1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.35rem' }}>Delivery / Pickup Address</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Street address or Pickup time" 
                      value={customerInfo.address}
                      onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #d6d3d1' }}
                    />
                  </div>

                  <button className="checkout-btn" type="submit" style={{ marginTop: '0.5rem' }}>
                    Confirm & Place Order
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <CheckCircle size={56} color="#d97706" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Order Confirmed!</h3>
                <p style={{ color: '#78716c', marginBottom: '1.5rem' }}>
                  Thank you, <strong>{customerInfo.name || 'Valued Customer'}</strong>. Your delicious baked goods are being prepared fresh!
                </p>
                <button className="order-now-btn" onClick={closeOrderModal}>
                  Back to Bakery
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="container footer-grid">
          <div>
            <a href="#" className="brand-logo" style={{ color: 'white', marginBottom: '1rem' }}>
              <div className="brand-icon">
                <Sparkles size={22} />
              </div>
              <span>L'Étoile Bakery</span>
            </a>
            <p style={{ color: '#a8a29e', fontSize: '0.95rem', maxWidth: '320px' }}>
              Bringing artisanal baking tradition, warmth, and fresh sourdough breads to your neighborhood daily.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#menu">Our Menu</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#specials">Daily Specials</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Opening Hours</h4>
            <ul className="footer-links" style={{ color: '#a8a29e', fontSize: '0.9rem' }}>
              <li>Mon - Fri: 6:00 AM - 7:00 PM</li>
              <li>Saturday: 7:00 AM - 8:00 PM</li>
              <li>Sunday: 7:00 AM - 5:00 PM</li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Contact & Location</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#a8a29e', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="#fbbf24" /> 742 Evergreen Artisan Way
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="#fbbf24" /> (555) 234-BAKE
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            © 2026 L'Étoile Bakery & Artisan Cafe. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
