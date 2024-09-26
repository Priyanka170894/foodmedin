import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import organRoutes from './routes/organRoutes.js';
import diseaseRoutes from './routes/diseaseRoutes.js';
import groceryRoutes from './routes/groceryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Initialize environment variables
dotenv.config();

// Initialize the Express application
const app = express();

// Middleware
app.use(express.json()); // For parsing JSON bodies

// CORS Configuration based on environment
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL_PROD  // Production Frontend URL
    : process.env.FRONTEND_URL_DEV,  // Development Frontend URL
  credentials: true // To allow cookies
};
app.use(cors(corsOptions));

// Helmet Security Headers
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "https://*.paypal.com", "https://*.paypalobjects.com", "data:"],
        frameSrc: ["'self'", "https://*.paypal.com", "https://*.paypalobjects.com"],
        scriptSrc: ["'self'", "https://*.paypal.com", "https://*.paypalobjects.com", "'unsafe-inline'"],
        connectSrc: ["'self'", "https://*.paypal.com", "https://*.paypalobjects.com"]
      }
    })
  );
} else {
  console.log('Helmet security headers not applied in development mode');
}

// Connect to MongoDB based on environment
const MONGO_URI = process.env.NODE_ENV === 'production'
  ? process.env.MONGO_URI_PROD  // Production MongoDB URI
  : process.env.MONGO_URI_DEV;  // Development MongoDB URI

mongoose.connect(MONGO_URI || 'mongodb://localhost:27017/foodmedin')
  
  .then(() => console.log(`MongoDB connected to ${MONGO_URI}`))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/users', userRoutes); // User management routes
app.use('/api/organs', organRoutes); // Organ management routes
app.use('/api/diseases', diseaseRoutes); // Disease management routes
app.use('/api/groceries', groceryRoutes); // Grocery management routes
app.use('/api/cart', cartRoutes); // Cart management routes
app.use('/api/wishlist', wishlistRoutes); // Wishlist routes
app.use('/api/orders', orderRoutes); // Order management routes
app.use('/api/payments', paymentRoutes); // Payment handling routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
