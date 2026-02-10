import mongoose from 'mongoose';

const categoryOrderSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
    enum: ['entretien', 'reparation', 'pneu', 'vidange', 'autre']
  },
  order: {
    type: Number,
    required: true,
    default: 0
  },
  label: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('CategoryOrder', categoryOrderSchema);



