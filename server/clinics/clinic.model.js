const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const arrayUniquePlugin = require('mongoose-unique-array');

const medicalServiceSchema = new Schema({
  name: { type: String, required: true, unique: true },
  doctors: [{ type: Schema.Types.ObjectId, ref: 'Doctor', unique: true }],
});

const clinicSchema = new Schema({
  city: { type: String, required: true },
  street: { type: String, required: true },
  medicalServices: [{ type: medicalServiceSchema, unique: true }],
});
clinicSchema.plugin(arrayUniquePlugin);
clinicSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Clinic', clinicSchema);
