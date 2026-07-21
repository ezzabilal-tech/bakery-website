const fs = require('fs');
const path = require('path');

// Persistent Database storage path
const DB_PATH = process.env.VERCEL ? '/tmp/bakery_db.json' : path.join(__dirname, 'bakery_db.json');

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: "Artisanal Sourdough Loaf",
    category: "breads",
    price: 7.50,
    tag: "Bestseller",
    rating: 4.9,
    description: "Slow-fermented for 36 hours with naturally cultured sourdough starter and crunchy golden crust.",
    image: "/images/sourdough.jpg"
  },
  {
    id: 'prod-2',
    name: "Golden Butter Croissant",
    category: "pastries",
    price: 4.25,
    tag: "Fresh Daily",
    rating: 5.0,
    description: "Authentic 81-layer French butter croissant baked fresh every morning at 6 AM.",
    image: "/images/croissant.jpg"
  },
  {
    id: 'prod-3',
    name: "Berry Chocolate Truffle Cake",
    category: "cakes",
    price: 38.00,
    tag: "Chef Special",
    rating: 4.9,
    description: "70% Valrhona dark chocolate sponge filled with fresh raspberries and cocoa glaze.",
    image: "/images/chocolate_cake.jpg"
  },
  {
    id: 'prod-4',
    name: "French Strawberry Tart",
    category: "pastries",
    price: 8.50,
    tag: "Seasonal",
    rating: 4.8,
    description: "Crisp almond pastry crust loaded with vanilla bean diplomatic cream and glazed fresh strawberries.",
    image: "/images/strawberry_tart.jpg"
  },
  {
    id: 'prod-5',
    name: "Almond Pain Au Chocolat",
    category: "pastries",
    price: 5.25,
    tag: "Popular",
    rating: 4.8,
    description: "Flaky puff pastry filled with Belgian dark chocolate and toasted almond frangipane.",
    image: "/images/croissant.jpg"
  },
  {
    id: 'prod-6',
    name: "Artisan Cappuccino",
    category: "coffee",
    price: 4.75,
    tag: "Organic Coffee",
    rating: 4.9,
    description: "Double shot of single-origin espresso blended with silky micro-foam steam milk.",
    image: "/images/hero.jpg"
  }
];

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    name: "Sophia Martinez",
    role: "Local Food Critic",
    rating: 5,
    comment: "The sourdough bread is unlike anything else in the city! Crunchy perfection on the outside, soft cloud inside. 10/10!",
    date: "2 days ago",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 'rev-2',
    name: "James Wilson",
    role: "Regular Customer",
    rating: 5,
    comment: "My morning ritual includes their Almond Croissant & Cappuccino. Flaky butter goodness that brightens up every day.",
    date: "1 week ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 'rev-3',
    name: "Emily & David",
    role: "Wedding Clients",
    rating: 5,
    comment: "L'Étoile designed our multi-tier Berry Chocolate wedding cake. Not only was it drop-dead gorgeous, but our guests haven't stopped raving about the taste!",
    date: "2 weeks ago",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  }
];

// Initialize Database Schema & File
function initDB() {
  if (!fs.existsSync(DB_PATH)) {
    const dbData = {
      schemaVersion: '1.0',
      products: INITIAL_PRODUCTS,
      reviews: INITIAL_REVIEWS,
      orders: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), 'utf8');
  }
}

function readDB() {
  initDB();
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { schemaVersion: '1.0', products: INITIAL_PRODUCTS, reviews: INITIAL_REVIEWS, orders: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write to database file:', e);
  }
}

// Database CRUD Interface
const db = {
  // --- PRODUCTS ---
  getProducts: (category) => {
    const data = readDB();
    if (category && category !== 'all') {
      return data.products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    return data.products;
  },

  createProduct: (productData) => {
    const data = readDB();
    const newProduct = {
      id: 'prod-' + Date.now(),
      ...productData,
      rating: productData.rating || 5.0
    };
    data.products.push(newProduct);
    writeDB(data);
    return newProduct;
  },

  // --- REVIEWS ---
  getReviews: () => {
    const data = readDB();
    return data.reviews;
  },

  createReview: (reviewData) => {
    const data = readDB();
    const newReview = {
      id: 'rev-' + Date.now(),
      name: reviewData.name,
      role: reviewData.role || 'Verified Customer',
      rating: Number(reviewData.rating),
      comment: reviewData.comment,
      date: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
    data.reviews.unshift(newReview);
    writeDB(data);
    return newReview;
  },

  deleteReview: (id) => {
    const data = readDB();
    const initialLen = data.reviews.length;
    data.reviews = data.reviews.filter(r => String(r.id) !== String(id));
    writeDB(data);
    return data.reviews.length < initialLen;
  },

  // --- ORDERS ---
  getOrders: () => {
    const data = readDB();
    return data.orders;
  },

  createOrder: (orderData) => {
    const data = readDB();
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      id: 'ord-' + Date.now(),
      orderId,
      customer: {
        name: orderData.name,
        phone: orderData.phone,
        address: orderData.address,
        notes: orderData.notes || ''
      },
      items: orderData.items || [],
      status: 'RECEIVED',
      createdAt: new Date().toISOString()
    };
    data.orders.unshift(newOrder);
    writeDB(data);
    return newOrder;
  },

  updateOrderStatus: (id, status) => {
    const data = readDB();
    let updatedOrder = null;
    data.orders = data.orders.map(o => {
      if (String(o.id) === String(id) || String(o.orderId) === String(id)) {
        updatedOrder = { ...o, status };
        return updatedOrder;
      }
      return o;
    });
    if (updatedOrder) writeDB(data);
    return updatedOrder;
  },

  deleteOrder: (id) => {
    const data = readDB();
    const initialLen = data.orders.length;
    data.orders = data.orders.filter(o => String(o.id) !== String(id) && String(o.orderId) !== String(id));
    writeDB(data);
    return data.orders.length < initialLen;
  }
};

module.exports = db;
