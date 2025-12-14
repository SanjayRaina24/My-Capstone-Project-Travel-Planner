const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  // 🔴 THIS IS THE FIX: explicitly define the structure 🔴
  activities: [{
    text: { type: String },
    id: { type: Number }   // We use this for Drag & Drop tracking
  }]
});

module.exports = mongoose.model('Trip', TripSchema);