import express from 'express';
import Cart from '../models/Cart.js';
import mongoose from 'mongoose';

const router = express.Router();

// Add or update a product in the user's cart
router.post('/', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    // Check if product already exists in user's cart
    let cartItem = await Cart.findOne({ userId, productId });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
      return res.json({ message: 'Cart updated', cartItem });
    } else {
      cartItem = new Cart({ userId, productId, quantity });
      await cartItem.save();
      return res.status(201).json({ message: 'Added to cart', cartItem });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart', detail: err.message });
  }
});

// Get all cart items for a user (with product details)
router.get('/user/:userId', async (req, res) => {
  try {
    const carts = await Cart.find({ userId: req.params.userId }).populate('productId');
    if (carts && carts.length > 0) {
      res.json({ carts });
    }
    res.json({ message: "Cart is empty" })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart', detail: err.message });
  }
});

// DELETE /api/cart/user/:userId
router.delete("/user/:userId", async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.params.userId });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear cart", error: err });
  }
});


// Remove a product from the user's cart
router.delete('/:cartItemId', async (req, res) => {
  try {
    const delcart = await Cart.findByIdAndDelete(req.params.cartItemId);
    if (delcart) {
      return res.status(200).json({ message: 'Item removed from cart', success: true });
    }
    res.status(404).json({ message: "Deletion Failed!", success: false });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item', detail: err.message });
  }
});

export default router;