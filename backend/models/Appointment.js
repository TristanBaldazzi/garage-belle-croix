import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
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
  licensePlate: {
    type: String,
    trim: true,
    uppercase: true
  },
  service: {
    type: String,
    required: true,
    trim: true
  },
  // Format YYYY-MM-DD, stocké en chaîne pour éviter tout décalage de fuseau horaire
  preferredDate: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  preferredSlot: {
    type: String,
    enum: ['matin', 'apres-midi'],
    required: true
  },
  message: {
    type: String
  },
  status: {
    type: String,
    enum: ['en_attente', 'confirme', 'annule'],
    default: 'en_attente'
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

export default mongoose.model('Appointment', appointmentSchema);
