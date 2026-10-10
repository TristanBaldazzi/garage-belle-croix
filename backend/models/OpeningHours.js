import mongoose from 'mongoose';

// Une plage horaire (ex. 08:00 → 12:00)
const slotSchema = new mongoose.Schema({
  open: { type: String, required: true },
  close: { type: String, required: true }
}, { _id: false });

// Un jour : une ou plusieurs plages (horaires coupés possibles).
// open/close restent renseignés (début de la 1re plage, fin de la dernière) pour la compatibilité.
const dayDefinition = (open, close, isClosed = false) => ({
  open: { type: String, required: true, default: open },
  close: { type: String, required: true, default: close },
  isClosed: { type: Boolean, default: isClosed },
  slots: { type: [slotSchema], default: undefined }
});

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const openingHoursSchema = new mongoose.Schema({
  monday: dayDefinition('08:00', '18:00'),
  tuesday: dayDefinition('08:00', '18:00'),
  wednesday: dayDefinition('08:00', '18:00'),
  thursday: dayDefinition('08:00', '18:00'),
  friday: dayDefinition('08:00', '18:00'),
  saturday: dayDefinition('08:00', '12:00'),
  sunday: dayDefinition('08:00', '18:00', true)
}, {
  timestamps: true
});

// Synchronise open/close avec les plages avant enregistrement
openingHoursSchema.pre('save', function (next) {
  for (const day of DAYS) {
    const slots = this[day]?.slots;
    if (slots && slots.length) {
      this[day].open = slots[0].open;
      this[day].close = slots[slots.length - 1].close;
    }
  }
  next();
});

// Réponse publique : chaque jour expose toujours au moins une plage
openingHoursSchema.methods.toPublicJSON = function () {
  const json = this.toObject();
  for (const day of DAYS) {
    const d = json[day];
    if (!d) continue;
    if (!d.slots || d.slots.length === 0) d.slots = [{ open: d.open, close: d.close }];
  }
  return json;
};

// S'assurer qu'il n'y a qu'un seul document
openingHoursSchema.statics.getOrCreate = async function() {
  let hours = await this.findOne();
  if (!hours) {
    hours = await this.create({});
  }
  return hours;
};

export const OPENING_DAYS = DAYS;
export default mongoose.model('OpeningHours', openingHoursSchema);
