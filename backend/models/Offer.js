import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  image: {
    type: String
  },
  validUntil: {
    type: Date,
    default: null
  },
  isPromotion: {
    type: Boolean,
    default: false
  },
  promotionPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['entretien', 'reparation', 'pneu', 'vidange', 'autre'],
    default: 'autre'
  }
}, {
  timestamps: true
});

// Calculate promotion percentage if originalPrice is set
offerSchema.pre('save', function(next) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.isPromotion = true;
    this.promotionPercentage = Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  next();
});

export default mongoose.model('Offer', offerSchema);



