const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const baseOptions = {
  discriminatorKey: 'userType',
};

const userSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
  },
  baseOptions
);
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
