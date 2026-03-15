const express = require('express');
const router = express.Router();
const Stop = require('../models/Stop');
const { cloudinary, upload } = require('../config/cloudinary');

// GET all stops (sorted by order)
router.get('/', async (req, res) => {
  try {
    const stops = await Stop.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: stops });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single stop
router.get('/:id', async (req, res) => {
  try {
    const stop = await Stop.findById(req.params.id);
    if (!stop) return res.status(404).json({ success: false, message: 'Stop not found' });
    res.json({ success: true, data: stop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create stop
router.post('/', async (req, res) => {
  try {
    const count = await Stop.countDocuments();
    const stop = new Stop({ ...req.body, order: count });
    await stop.save();
    res.status(201).json({ success: true, data: stop });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update stop
router.put('/:id', async (req, res) => {
  try {
    const stop = await Stop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!stop) return res.status(404).json({ success: false, message: 'Stop not found' });
    res.json({ success: true, data: stop });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE stop
router.delete('/:id', async (req, res) => {
  try {
    const stop = await Stop.findById(req.params.id);
    if (!stop) return res.status(404).json({ success: false, message: 'Stop not found' });

    // Delete images from Cloudinary
    for (const img of stop.images) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId);
      }
    }

    await stop.deleteOne();
    res.json({ success: true, message: 'Stop deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST upload images to a stop
router.post('/:id/images', upload.array('images', 10), async (req, res) => {
  try {
    const stop = await Stop.findById(req.params.id);
    if (!stop) return res.status(404).json({ success: false, message: 'Stop not found' });

    const newImages = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      caption: ''
    }));

    stop.images.push(...newImages);
    await stop.save();

    res.json({ success: true, data: stop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE image from stop
router.delete('/:id/images/:imageId', async (req, res) => {
  try {
    const stop = await Stop.findById(req.params.id);
    if (!stop) return res.status(404).json({ success: false, message: 'Stop not found' });

    const image = stop.images.id(req.params.imageId);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });

    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    image.deleteOne();
    await stop.save();

    res.json({ success: true, data: stop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH reorder stops
router.patch('/reorder', async (req, res) => {
  try {
    const { orderedIds } = req.body; // array of stop IDs in new order
    const updates = orderedIds.map((id, index) =>
      Stop.findByIdAndUpdate(id, { order: index })
    );
    await Promise.all(updates);
    res.json({ success: true, message: 'Reordered successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
