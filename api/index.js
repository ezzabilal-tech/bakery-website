const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// In-Memory Database Store
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

let REVIEWS = [
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

let ORDERS = [];

// 1. Health Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'L\'Étoile Bakery Backend API is running smoothly',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 2. GET Products Endpoint
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  if (category && category !== 'all') {
    const filtered = PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase());
    return res.status(200).json({ success: true, count: filtered.length, data: filtered });
  }
  res.status(200).json({ success: true, count: PRODUCTS.length, data: PRODUCTS });
});

// 3. GET Reviews Endpoint
app.get('/api/reviews', (req, res) => {
  res.status(200).json({ success: true, count: REVIEWS.length, data: REVIEWS });
});

// 4. POST Review Endpoint with Data Validation
app.post('/api/reviews', (req, res) => {
  const { name, rating, comment } = req.body;

  // Input Validation
  const errors = [];
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }
  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    errors.push('Rating must be a number between 1 and 5');
  }
  if (!comment || typeof comment !== 'string' || comment.trim().length < 3) {
    errors.push('Comment must be at least 3 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const newReview = {
    id: Date.now(),
    name: name.trim(),
    role: 'Verified Customer',
    rating: Math.round(numericRating),
    comment: comment.trim(),
    date: 'Just now',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  };

  REVIEWS.unshift(newReview);
  res.status(201).json({
    success: true,
    message: 'Review submitted successfully!',
    data: newReview
  });
});

// 5. POST Orders Endpoint with Data Validation
app.post('/api/orders', (req, res) => {
  const { name, phone, address, items, notes } = req.body;

  // Input Validation
  const errors = [];
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Customer name is required');
  }
  if (!phone || typeof phone !== 'string' || phone.trim().length < 6) {
    errors.push('Valid phone number is required');
  }
  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    errors.push('Delivery address or pickup instructions are required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const orderObj = {
    orderId,
    customer: { name: name.trim(), phone: phone.trim(), address: address.trim(), notes: notes ? notes.trim() : '' },
    items: items || [],
    createdAt: new Date().toISOString(),
    status: 'RECEIVED'
  };

  ORDERS.push(orderObj);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully!',
    orderId,
    data: orderObj
  });
});

// Port configuration for standalone execution
const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Bakery API Server running on port ${PORT}`);
  });
}

module.exports = app;
