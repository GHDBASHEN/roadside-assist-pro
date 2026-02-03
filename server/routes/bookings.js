const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @route   POST api/bookings
// @desc    Create a service request
// @access  Private
router.post('/', auth, async (req, res) => {
    const { serviceType, location, description, mechanicId } = req.body;

    try {
        // Check for existing pending/recent requests
        const lastBooking = await Booking.findOne({ user: req.user.id })
            .sort({ date: -1 });

        if (lastBooking) {
            const timeDiff = Date.now() - new Date(lastBooking.date).getTime();
            const minutesDiff = timeDiff / (1000 * 60);

            if (minutesDiff < 15) {
                return res.status(429).json({
                    msg: `Please wait ${Math.ceil(15 - minutesDiff)} minutes before making another request`
                });
            }
        }
        const bookingData = {
            user: req.user.id,
            serviceType,
            location: {
                type: 'Point',
                coordinates: location && location.longitude && location.latitude
                    ? [location.longitude, location.latitude]
                    : [0, 0]
            },
            status: 'pending'
        };

        if (mechanicId) {
            bookingData.mechanic = mechanicId;
        }

        const newBooking = new Booking(bookingData);

        const booking = await newBooking.save();
        res.json(booking);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/bookings
// @desc    Get bookings for current user or mechanic
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        let bookings;
        if (user.role === 'mechanic') {
            // Mechanics see:
            // 1. Requests assigned to them (any status)
            // 2. Unassigned pending requests (broadcast)
            bookings = await Booking.find({
                $or: [
                    { mechanic: req.user.id },
                    { status: 'pending', mechanic: null }
                ]
            }).populate('user', ['name', 'email', 'location']).sort({ date: -1 });

        } else {
            // Users see their own bookings
            bookings = await Booking.find({ user: req.user.id })
                .populate('mechanic', ['name', 'email', 'location'])
                .sort({ date: -1 });
        }
        res.json(bookings);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/bookings/:id/accept
// @desc    Mechanic accepts a booking
// @access  Private
router.put('/:id/accept', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'mechanic') {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        let booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ msg: 'Booking already taken or completed' });
        }

        booking.mechanic = req.user.id;
        booking.status = 'accepted';

        await booking.save();
        res.json(booking);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/bookings/:id/status
// @desc    Update booking status (completed, cancelled)
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
    const { status } = req.body; // 'completed', 'cancelled'

    try {
        let booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        // Verify ownership/assignment
        if (booking.mechanic.toString() !== req.user.id && booking.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();
        res.json(booking);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
