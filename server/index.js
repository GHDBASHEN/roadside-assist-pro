const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for now, restrict in production
        methods: ["GET", "POST"]
    }
});

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/mechanics', require('./routes/mechanics'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/messages', require('./routes/messages'));
const Message = require('./models/Message');

// Socket.io connection
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join', ({ userId }) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    socket.on('sendMessage', async ({ senderId, receiverId, text }) => {
        // Save to DB
        try {
            const newMessage = new Message({
                sender: senderId,
                receiver: receiverId,
                text
            });
            await newMessage.save();
        } catch (err) {
            console.error("Error saving message:", err);
        }

        io.to(receiverId).emit('message', { senderId, text });
        console.log(`Message sent from ${senderId} to ${receiverId}`);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
