import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Define the schema
const testimonalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

// Create the model
const Testimonal = mongoose.model('Testimonal', testimonalSchema);

// GET all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonals = await Testimonal.find().sort({ createdAt: -1 });
    res.json(testimonals);
  } catch (err) {
    console.error('❌ Error fetching testimonials:', err);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// POST a new testimonial
router.post('/', async (req, res) => {
  try {
    const { name, city, message } = req.body;

    if (!name || !city || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newTestimonal = new Testimonal({ name, city, message });
    await newTestimonal.save();

    res.status(201).json(newTestimonal);
  } catch (err) {
    console.error('❌ Error saving testimonial:', err);
    res.status(500).json({ error: 'Failed to save testimonial' });
  }
});

// DELETE a testimonial by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Testimonal.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting testimonial:', err);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});


export default router;
