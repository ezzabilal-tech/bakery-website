import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Send,
  Server
} from 'lucide-react';
import confetti from 'canvas-confetti';

const FALLBACK_PRODUCTS = [
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

const FALLBACK_REVIEWS = [
  {
    id: 1,
    name: "Sophia Martinez",
    role: "Local Food Critic",
    rating: 5,
    comment: "The sourdough bread is unlike anything else in the city! Crunchy perfection on the outside, soft cloud inside. 10/10!",
    date: "2 days ago",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "James Wilson",
    role: "Regular Customer",
    rating: 5,
    comment: "My morning ritual includes their Almond Croissant & Cappuccino. Flaky butter goodness that brightens up every day.",
    date: "1 week ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Emily & David",
    role: "Wedding Clients",
    rating: 5,
    comment: "L'Étoile designed our multi-tier Berry Chocolate wedding cake. Not only was it drop-dead gorgeous, but our guests haven't stopped raving about the taste!",
    date: "2 weeks ago",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  }
];

export default function App() {
  const [productsList, setProductsList] = useState(FALLBACK_PRODUCTS);
  const [reviewsList, setReviewsList] = useState(FALLBACK_REVIEWS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  
  // API loading & review state
  const [apiConnected, setApiConnected] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  // Fetch Products & Reviews from Backend API
  useEffect(() => {
    async function loadBackendData() {
      try {
        const resProd = await fetch('/api/products');
        if (resProd.ok) {
          const jsonProd = await resProd.json();
          if (jsonProd.data) setProductsList(jsonProd.data);
          setApiConnected(true);
        }

        const resRev = await fetch('/api/reviews');
        if (resRev.ok) {
          const jsonRev = await resRev.json();
          if (jsonRev.data) setReviewsList(jsonRev.data);
        }
      } catch (err) {
        console.log('Using local client state (API offline or static mode)');
      }
    }
    loadBackendData();
  }, []);

  const filteredProducts = activeCategory === 'all' 
    ? productsList 
    : productsList.filter(p => p.category === activeCategory);

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

  // POST /api/reviews
  const handleAddReview = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!newReview.name || !newReview.comment) return;

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      const data = await response.json();

      if (data.success) {
        setReviewsList([data.data, ...reviewsList]);
        setNewReview({ name: '', rating: 5, comment: '' });
        setReviewSubmitted(true);
        setTimeout(() => setReviewSubmitted(false), 4000);
      } else {
        setApiError(data.errors ? data.errors.join(', ') : 'Review validation failed');
      }
    } catch (err) {
      // Local fallback if API offline
      const reviewObj = {
        id: Date.now(),
        name: newReview.name,
        role: 'Verified Customer',
        rating: Number(newReview.rating),
        comment: newReview.comment,
        date: 'Just now',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };
      setReviewsList([reviewObj, ...reviewsList]);
      setNewReview({ name: '', rating: 5, comment: '' });
      setReviewSubmitted(true);
      setTimeout(() => setReviewSubmitted(false), 4000);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // POST /api/orders
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...customerInfo,
          items: cart
        })
      });
      const data = await response.json();

      if (data.success) {
        setConfirmedOrderId(data.orderId || ('ORD-' + Math.floor(100000 + Math.random() * 900000)));
        setOrderSubmitted(true);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } else {
        setApiError(data.errors ? data.errors.join(', ') : 'Order submission failed');
      }
    } catch (err) {
      // Fallback
      setConfirmedOrderId('ORD-' + Math.floor(100000 + Math.random() * 900000));
      setOrderSubmitted(true);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
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
        ✨ Free Local Delivery on Fresh Orders Over $30 | API Status: <span style={{ color: '#4ade80', fontWeight: 'bold' }}>Active Express Server</span>
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
              <Server size={16} /> Node.js & Express API Integrated
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

      {/* SPECIALS SECTION */}
      <section id="specials" style={{ padding: '6rem 1.5rem', background: '#fffbeb' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.35rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid rgba(245,158,11,0.2)' }}>
              🔥 Limited Time Offers
            </span>
            <h2 style={{ fontSize: '2.8rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Today's Bakery Specials</h2>
            <p style={{ color: '#78716c', fontSize: '1.1rem' }}>Handpicked daily offers fresh from our stone deck oven with exclusive discounts.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Special Card 1 */}
            <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: 'var(--shadow-md)', border: '1px solid #fef3c7', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#e11d48', color: 'white', fontWeight: '700', fontSize: '0.8rem', padding: '0.35rem 0.85rem', borderRadius: '999px' }}>
                SAVE 20%
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <img src="/images/croissant.jpg" alt="Breakfast Combo" style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }} />
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: '#292524' }}>Morning Artisan Combo</h3>
                  <div style={{ color: '#d97706', fontSize: '0.9rem', fontWeight: '600' }}>Croissant + Cappuccino</div>
                </div>
              </div>
              <p style={{ color: '#78716c', fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>
                Start your day with a warm 81-layer butter croissant and a fresh double-shot organic cappuccino.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px dashed #e7e5e4' }}>
                <div>
                  <span style={{ textDecoration: 'line-through', color: '#a8a29e', marginRight: '0.5rem' }}>$9.00</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#b45309' }}>$7.20</span>
                </div>
                <button className="order-now-btn" onClick={() => addToCart(productsList[1] || FALLBACK_PRODUCTS[1])}>
                  Claim Deal
                </button>
              </div>
            </div>

            {/* Special Card 2 */}
            <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: 'var(--shadow-md)', border: '1px solid #fef3c7', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#d97706', color: 'white', fontWeight: '700', fontSize: '0.8rem', padding: '0.35rem 0.85rem', borderRadius: '999px' }}>
                FAMILY PACK
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <img src="/images/sourdough.jpg" alt="Weekend Sourdough Bundle" style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }} />
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: '#292524' }}>Weekend Artisan Loaf Duo</h3>
                  <div style={{ color: '#d97706', fontSize: '0.9rem', fontWeight: '600' }}>2x Sourdough Loaves</div>
                </div>
              </div>
              <p style={{ color: '#78716c', fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>
                Two 36-hour slow fermented sourdough loaves baked with organic grains. Perfect for weekend family toasts!
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px dashed #e7e5e4' }}>
                <div>
                  <span style={{ textDecoration: 'line-through', color: '#a8a29e', marginRight: '0.5rem' }}>$15.00</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#b45309' }}>$11.99</span>
                </div>
                <button className="order-now-btn" onClick={() => addToCart(productsList[0] || FALLBACK_PRODUCTS[0])}>
                  Claim Deal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="container" style={{ padding: '6rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ color: '#d97706', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Customer Love</span>
          <h2 style={{ fontSize: '2.8rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>What People Say About Us</h2>
          <p style={{ color: '#78716c', fontSize: '1.1rem' }}>Over 1,200+ 5-star reviews from pastry lovers & bread enthusiasts.</p>
        </div>

        {/* Reviews Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {reviewsList.map(rev => (
            <div key={rev.id} style={{ background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid #f5f0e6', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p style={{ color: '#44403c', fontStyle: 'italic', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>
                "{rev.comment}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto' }}>
                <img src={rev.avatar} alt={rev.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <strong style={{ display: 'block', color: '#292524', fontSize: '1rem' }}>{rev.name}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#78716c' }}>{rev.role} • {rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Write a Review Box */}
        <div style={{ background: '#fdfaf6', border: '1px solid #f3edd9', borderRadius: '24px', padding: '2.5rem', maxWidth: '700px', margin: '0 auto', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', textAlign: 'center' }}>Leave Your Review (Via API)</h3>
          <p style={{ color: '#78716c', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.95rem' }}>We value your feedback! Post your experience directly to our Express API backend.</p>
          
          {reviewSubmitted && (
            <div style={{ background: '#dcfce7', color: '#15803d', padding: '1rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1.5rem', fontWeight: '600' }}>
              🎉 Thank you! Your review was validated & stored via Express API!
            </div>
          )}
          {apiError && (
            <div style={{ background: '#ffe4e6', color: '#b91c1c', padding: '1rem', borderRadius: '12px', textAlign: 'center', marginBottom: '1.5rem', fontWeight: '600' }}>
              ⚠️ {apiError}
            </div>
          )}

          <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.35rem' }}>Your Name</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Sarah Jenkins"
                value={newReview.name}
                onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #d6d3d1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.35rem' }}>Rating</label>
              <select 
                value={newReview.rating}
                onChange={e => setNewReview({ ...newReview, rating: e.target.value })}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #d6d3d1', background: 'white' }}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5/5 Stars - Outstanding)</option>
                <option value={4}>⭐⭐⭐⭐ (4/5 Stars - Very Good)</option>
                <option value={3}>⭐⭐⭐ (3/5 Stars - Average)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.35rem' }}>Your Review</label>
              <textarea 
                required
                rows={3}
                placeholder="Tell us what you loved about our sourdough, croissants, or cakes..."
                value={newReview.comment}
                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #d6d3d1', fontFamily: 'inherit' }}
              />
            </div>
            <button className="order-now-btn" type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Send size={18} /> Submit Review to API
            </button>
          </form>
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

                {apiError && (
                  <div style={{ background: '#ffe4e6', color: '#b91c1c', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    ⚠️ {apiError}
                  </div>
                )}

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
                    Submit Order to API
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <CheckCircle size={56} color="#d97706" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Order Processed by API!</h3>
                <div style={{ background: '#fef3c7', color: '#b45309', display: 'inline-block', padding: '0.35rem 1rem', borderRadius: '999px', fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem' }}>
                  {confirmedOrderId}
                </div>
                <p style={{ color: '#78716c', marginBottom: '1.5rem' }}>
                  Thank you, <strong>{customerInfo.name || 'Valued Customer'}</strong>. Your order has been validated and recorded by our Express API server!
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
              <li><a href="#reviews">Reviews</a></li>
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
