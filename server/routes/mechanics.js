const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/mechanics
// @desc    Get all available mechanics (can add geo-filter later)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { lat, lng, dist } = req.query;

        let query = { role: 'mechanic', isAvailable: true };

        if (lat && lng) {
            // Default distance 10km if not specified
            const distanceInMeters = (dist || 10) * 1000;

            query.location = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: distanceInMeters
                }
            };
        }

        const mechanics = await User.find(query).select('-password');
        res.json(mechanics);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/mechanics/availability
// @desc    Toggle mechanic availability
// @access  Private (Mechanic only)
router.put('/availability', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.role !== 'mechanic') {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        user.isAvailable = !user.isAvailable;
        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/mechanics/location
// @desc    Update mechanic location (GPS)
// @access  Private
router.put('/location', auth, async (req, res) => {
    const { latitude, longitude } = req.body;

    // Basic validation
    if (!latitude || !longitude) {
        return res.status(400).json({ msg: 'Latitude and Longitude are required' });
    }

    try {
        const user = await User.findById(req.user.id);

        user.location = {
            type: 'Point',
            coordinates: [longitude, latitude] // Note: MongoDB uses [long, lat]
        };

        await user.save();
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
