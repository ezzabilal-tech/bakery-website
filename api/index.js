const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// 1. Database Health Monitor Endpoint
app.get('/api/health', (req, res) => {
  const products = db.getProducts();
  const reviews = db.getReviews();
  const orders = db.getOrders();

  res.status(200).json({
    status: 'ok',
    databaseConnected: true,
    storageType: 'Persistent File-Backed JSON Database',
    timestamp: new Date().toISOString(),
    stats: {
      totalProducts: products.length,
      totalReviews: reviews.length,
      totalOrders: orders.length
    }
  });
});

// --- CRUD FOR PRODUCTS ---

// READ Products (GET)
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  const products = db.getProducts(category);
  res.status(200).json({ success: true, count: products.length, data: products });
});

// CREATE Product (POST)
app.post('/api/products', (req, res) => {
  const { name, category, price, description, tag, image } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ success: false, errors: ['Name, price, and category are required'] });
  }

  const newProduct = db.createProduct({
    name: name.trim(),
    category: category.trim(),
    price: Number(price),
    description: description ? description.trim() : '',
    tag: tag ? tag.trim() : 'New',
    image: image || '/images/hero.jpg'
  });

  res.status(201).json({ success: true, message: 'Product created in database', data: newProduct });
});

// --- CRUD FOR REVIEWS ---

// READ Reviews (GET)
app.get('/api/reviews', (req, res) => {
  const reviews = db.getReviews();
  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

// CREATE Review (POST)
app.post('/api/reviews', (req, res) => {
  const { name, rating, comment } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required');
  }
  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    errors.push('Rating must be between 1 and 5');
  }
  if (!comment || typeof comment !== 'string' || comment.trim().length < 3) {
    errors.push('Comment must be at least 3 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const newReview = db.createReview({ name: name.trim(), rating: numericRating, comment: comment.trim() });
  res.status(201).json({ success: true, message: 'Review persisted in database', data: newReview });
});

// DELETE Review (DELETE)
app.delete('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  const deleted = db.deleteReview(id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Review not found in database' });
  }
  res.status(200).json({ success: true, message: `Review ${id} deleted from database` });
});

// --- CRUD FOR ORDERS ---

// READ Orders (GET)
app.get('/api/orders', (req, res) => {
  const orders = db.getOrders();
  res.status(200).json({ success: true, count: orders.length, data: orders });
});

// CREATE Order (POST)
app.post('/api/orders', (req, res) => {
  const { name, phone, address, items, notes } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Customer name is required');
  }
  if (!phone || typeof phone !== 'string' || phone.trim().length < 6) {
    errors.push('Valid phone number is required');
  }
  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    errors.push('Delivery address is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const newOrder = db.createOrder({ name: name.trim(), phone: phone.trim(), address: address.trim(), items: items || [], notes });
  res.status(201).json({
    success: true,
    message: 'Order created in database',
    orderId: newOrder.orderId,
    data: newOrder
  });
});

// UPDATE Order Status (PUT)
app.put('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, error: 'Status is required' });
  }

  const updated = db.updateOrderStatus(id, status);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Order not found in database' });
  }
  res.status(200).json({ success: true, message: `Order ${id} status updated to ${status}`, data: updated });
});

// DELETE Order (DELETE)
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const deleted = db.deleteOrder(id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Order not found in database' });
  }
  res.status(200).json({ success: true, message: `Order ${id} deleted from database` });
});

// Port configuration for standalone execution
const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Bakery API & Database Server running on port ${PORT}`);
  });
}

module.exports = app;
