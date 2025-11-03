import mongoose from 'mongoose';

const testimonalSchema = new mongoose.Schema({
  name: String,
  city: String,
  message: String,
}, { timestamps: true });

export default mongoose.model('Testimonal', testimonalSchema);
