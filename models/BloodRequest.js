const mongoose = require('mongoose');

const BloodRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  hospital: String,
  contactNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'fulfilled', 'expired'],
    default: 'active',
  },
  senderSocketId: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 3600, // Auto-expire after 1 hour
  },
});

module.exports = mongoose.model('BloodRequest', BloodRequestSchema);
