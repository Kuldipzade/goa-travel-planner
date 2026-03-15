const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String }, // Cloudinary public_id for deletion
  caption: { type: String, default: '' }
});

const stopSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  visitDate: { type: Date },
  duration: { type: String, default: '' }, // e.g. "2 hours", "half day"
  category: {
    type: String,
    enum: ['beach', 'food', 'culture', 'adventure', 'nightlife', 'nature', 'shopping', 'other'],
    default: 'other'
  },
  images: [imageSchema],
  order: { type: Number, default: 0 }, // for roadmap ordering
  status: {
    type: String,
    enum: ['planned', 'visited', 'skipped'],
    default: 'planned'
  },
  rating: { type: Number, min: 1, max: 5 },
  tips: { type: String, default: '' }, // personal tips/notes
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Stop', stopSchema);
