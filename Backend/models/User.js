import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  phone: {
    type: String,
    required: true,
  },
  address: String,
  city: String,
  country: {
    type: String,
    default: 'Pakistan',
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
