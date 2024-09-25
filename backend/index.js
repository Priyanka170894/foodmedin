// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';


// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import organRoutes from './routes/organRoutes.js'; // Import Organ routes
import diseaseRoutes from './routes/diseaseRoutes.js'; // Import Disease routes
import groceryRoutes from './routes/groceryRoutes.js'; // Import Grocery routes
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js'; // Import Order routes

import paymentRoutes from './routes/paymentRoutes.js'; // Import payment routes
import helmet from 'helmet';


// Initialize environment variables
dotenv.config();

// Initialize the Express application
const app = express();

// Middleware
app.use(express.json()); // For parsing JSON bodies
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true // To allow cookies
}));; // Enable CORS for all routes

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "https://*.paypal.com", "https://*.paypalobjects.com", "data:"],
    frameSrc: ["'self'", "https://*.paypal.com", "https://*.paypalobjects.com"],
    scriptSrc: ["'self'", "https://*.paypal.com", "https://*.paypalobjects.com", "'unsafe-inline'"],
    connectSrc: ["'self'", "https://*.paypal.com", "https://*.paypalobjects.com"]
  }
}));
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/foodmedin').then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/users', userRoutes); // User management routes
app.use('/api/organs', organRoutes); // Organ management routes
app.use('/api/diseases', diseaseRoutes); // Disease management routes
app.use('/api/groceries', groceryRoutes); // Grocery management routes
app.use('/api/cart', cartRoutes); // Cart management routes
app.use('/api/wishlist', wishlistRoutes);//wishlist routes
app.use('/api/orders', orderRoutes); // Order management routes
app.use('/api/payments', paymentRoutes); // Payment handling routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>   console.log(`Server running in  mode on port ${PORT}`));
