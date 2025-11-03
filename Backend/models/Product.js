import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  sale: Boolean,
  salePercent: Number,
  discount: Number,     
  salePrice: Number,
  featured: Boolean,
  topSelling: Boolean,
  images: [String],
  reviews: [
    {
      user: String,
      review: String,
    },
  ],
}, { timestamps: true });


export default mongoose.model('Product', productSchema);
