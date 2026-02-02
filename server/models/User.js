const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'mechanic', 'admin'],
        default: 'user'
    },
    // Mechanic specific fields
    specialties: [{
        type: String
    }],
    certifications: [{
        type: String
    }],
    isAvailable: {
        type: Boolean,
        default: false
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Create geospatial index for location
UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);
