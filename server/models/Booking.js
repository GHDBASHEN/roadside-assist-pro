const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mechanic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    serviceType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed', 'cancelled'],
        default: 'pending'
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number]
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
