import mongoose from 'mongoose';

const openingHoursSchema = new mongoose.Schema({
  monday: {
    open: { type: String, required: true, default: '08:00' },
    close: { type: String, required: true, default: '18:00' },
    isClosed: { type: Boolean, default: false }
  },
  tuesday: {
    open: { type: String, required: true, default: '08:00' },
    close: { type: String, required: true, default: '18:00' },
    isClosed: { type: Boolean, default: false }
  },
  wednesday: {
    open: { type: String, required: true, default: '08:00' },
    close: { type: String, required: true, default: '18:00' },
    isClosed: { type: Boolean, default: false }
  },
  thursday: {
    open: { type: String, required: true, default: '08:00' },
    close: { type: String, required: true, default: '18:00' },
    isClosed: { type: Boolean, default: false }
  },
  friday: {
    open: { type: String, required: true, default: '08:00' },
    close: { type: String, required: true, default: '18:00' },
    isClosed: { type: Boolean, default: false }
  },
  saturday: {
    open: { type: String, required: true, default: '08:00' },
    close: { type: String, required: true, default: '12:00' },
    isClosed: { type: Boolean, default: false }
  },
  sunday: {
    open: { type: String, required: true, default: '08:00' },
    close: { type: String, required: true, default: '18:00' },
    isClosed: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// S'assurer qu'il n'y a qu'un seul document
openingHoursSchema.statics.getOrCreate = async function() {
  let hours = await this.findOne();
  if (!hours) {
    hours = await this.create({});
  }
  return hours;
};

export default mongoose.model('OpeningHours', openingHoursSchema);



