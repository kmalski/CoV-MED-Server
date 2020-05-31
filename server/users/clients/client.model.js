const mongoose = require('mongoose');
const User = require('../user.model');
const Schema = mongoose.Schema;

const medicineSchema = new Schema({
  name: { type: String, required: true },
  size: { type: String, required: true },
});

const prescriptionSchema = new Schema({
  validityDate: { type: Date, required: true },
  medicines: [{ type: medicineSchema, required: true }],
});

const refferalSchema = new Schema({
  createdDate: { type: Date, default: Date.now },
  medicalTreatment: { type: String, required: true },
});

const visitSchema = new Schema({
  date: { type: Date, required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  clinic: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true },
  prescription: { type: prescriptionSchema, required: false },
  refferal: { type: refferalSchema, required: false },
});

const examinationSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now() },
  result: { type: String, required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
});

const clientSchema = User.discriminator(
  'Client',
  new Schema({
    pesel: { type: String, required: true },
    active: { type: Boolean, default: true },
    visits: [visitSchema],
    examinations: [examinationSchema],
  })
);

module.exports = mongoose.model('Client');
