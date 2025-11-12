import express from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer upload setup (removes spaces & unsafe chars)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
    cb(null, `${Date.now()}-${safeName}`);
  },
});
const upload = multer({ storage });

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST create product
router.post('/', upload.array('images'), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      sale,
      salePercent,
      featured,
      topSelling,
    } = req.body;

    const numericPrice = parseFloat(price);
    const numericSalePercent = parseFloat(salePercent) || 0;

    const salePrice =
      sale === 'true'
        ? numericPrice - (numericPrice * numericSalePercent) / 100
        : numericPrice;

    const images = req.files.map(file =>
      `${req.protocol}://${req.get('host')}/uploads/${encodeURIComponent(file.filename)}`
    );

    const product = new Product({
      title,
      description,
      price: numericPrice,
      sale: sale === 'true',
      salePercent: numericSalePercent,
      salePrice,
      featured: featured === 'true',
      topSelling: topSelling === 'true',
      images,
    });

    await product.save();
    res.status(201).json({ message: 'Product added', product });
  } catch (err) {
    res.status(500).json({ error: 'Add product failed', detail: err.message });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discount,
      featured,
      topSelling,
      images,
    } = req.body;

    const numericPrice = parseFloat(price);
    const numericDiscount = parseFloat(discount) || 0;

    const salePrice = Math.round(numericPrice * (100 - numericDiscount) / 100);

    const updatedFields = {
      title,
      description,
      price: numericPrice,
      discount: numericDiscount,
      sale: numericDiscount > 0,
      salePercent: numericDiscount,
      salePrice,
      featured,
      topSelling,
      images,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product', detail: err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Remove uploaded images from disk
    product.images.forEach(imgUrl => {
      const filename = decodeURIComponent(imgUrl.split('/uploads/')[1]);
      const filePath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', detail: err.message });
  }
});

// POST add to cart
router.post('/cart', async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      await Cart.create({ userId, productId, quantity });
    }

    res.status(200).json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

export default router;
