import mongoose from 'mongoose';
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
  quantity: { type: Number, default: 1 },
});

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);