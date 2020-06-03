const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicalServiceSchema = new Schema({
  name: { type: String, required: true },
  doctors: [{ type: Schema.Types.ObjectId, ref: 'Doctor' }],
});

const clinicSchema = new Schema({
  city: { type: String, required: true },
  street: { type: String, required: true },
  medicalServices: [medicalServiceSchema],
});
clinicSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Clinic', clinicSchema);
