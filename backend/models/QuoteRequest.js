import mongoose from 'mongoose';

const quoteRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  licensePlate: {
    type: String,
    trim: true,
    uppercase: true
  },
  // Prestation demandée (devis libre, hors offre)
  service: {
    type: String,
    trim: true
  },
  vehicleType: {
    type: String,
    enum: ['voiture', 'moto'],
    default: 'voiture'
  },
  vehicle: {
    type: String,
    trim: true
  },
  tireSize: {
    type: String,
    trim: true
  },
  tireQuantity: {
    type: Number,
    min: 1,
    max: 8
  },
  message: {
    type: String,
    required: true
  },
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer'
  },
  offerTitle: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('QuoteRequest', quoteRequestSchema);

