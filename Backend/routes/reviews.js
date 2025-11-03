import express from 'express';
const router = express.Router();
import Product from '../models/Product.js'; // adjust path if needed

// GET all reviews with product title & image
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({}, 'title images reviews');

        const allReviews = [];

        products.forEach((product) => {
            product.reviews.forEach((review) => {
                allReviews.push({
                    productId: product._id,
                    productTitle: product.title,
                    productImage: product.images?.[0],
                    user: review.user,
                    review: review.review,
                });
            });
        });

        res.json(allReviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// POST /api/reviews/:productId
router.post('/:productId', async (req, res) => {
  const { productId } = req.params;
  const { user, review } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.reviews.push({ user, review });
    await product.save();

    res.json({ success: true, message: 'Review added successfully', product });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});


router.delete('/:productId/:reviewIndex', async (req, res) => {
    const { productId, reviewIndex } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        product.reviews.splice(reviewIndex, 1);
        await product.save();

        res.json({ success: true, message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

export default router;
