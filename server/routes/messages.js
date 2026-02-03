const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// @route   GET api/messages/:otherUserId
// @desc    Get conversation with a specific user
// @access  Private
router.get('/:otherUserId', auth, async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const otherUserId = req.params.otherUserId;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        }).sort({ timestamp: 1 });

        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
