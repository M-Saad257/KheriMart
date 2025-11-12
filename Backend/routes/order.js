import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

const router = express.Router();

// Prefill checkout form
router.get("/checkout/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("name email address phone");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create Order
router.post("/", async (req, res) => {
  try {
    const { userId, items, total, name, email, address, phone, date, paymentMethod } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing Order Details" });
    }

    // Generate unique order ID
    const shortId = `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Ensure price exists for each item
    const orderItems = await Promise.all(items.map(async (item) => {
      let price = item.price;
      if (!price) {
        const product = await Product.findById(item.productId);
        price = product.sale ? product.salePrice : product.price;
      }
      return {
        productId: item.productId?._id || item.productId,
        quantity: item.quantity,
        price
      };
    }));

    const newOrder = new Order({
      orderId: shortId,
      userId,
      name,
      email,
      address,
      phone,
      date,
      items: orderItems,
      total,
      paymentMethod: "Cash on Delivery", // ✅ Always set COD
      status: "Pending",
    });


    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });

  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// Update order status
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete order
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin – get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.productId", "title images price salePrice")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching all orders: ", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get orders for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("items.productId", "title images price salePrice")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
