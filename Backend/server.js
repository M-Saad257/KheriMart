import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import 'dotenv/config';
// Routes
import authRoutes from './routes/rejister.js';
import usersRoutes from './routes/users.js';
import productsRoutes from './routes/products.js';
import reviewsRoutes from './routes/reviews.js';
import testimonalRoutes from './routes/testimonals.js';
import cartRoutes from './routes/cart.js';
import checkoutRoutes from './routes/checkout.js';
import orderRoutes from './routes/order.js';

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// CORS setup
app.use(cors({
  origin: 'http://localhost:5173', // React dev URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// JSON parsing
app.use(express.json());

// Server boot ID endpoint
let serverBootId = Date.now();
app.get("/server-boot", (req, res) => {
  res.json({ bootId: serverBootId });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/testimonals', testimonalRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);

const MONGO_URI = process.env.CONNECTION_STRING;

// MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ DB Connected'))
  .catch(err => console.error('❌ DB Connection Failed:', err));

app.listen(5000, () => console.log('🚀 Server running on port 5000'));
