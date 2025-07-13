const express = require("express");
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const notificationRoutes = require('./routes/notificationRoutes');
const { Server } = require('socket.io');
const { createNotification } = require('./controllers/notificationController');
const Userlogin = require("./routes/login/User");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Routes
app.use('/notifications', notificationRoutes);
app.use('/auth', Userlogin);

// ✅ Socket.IO Logic (inline instead of socket.js)
io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    socket.on('send_notification', async (data) => {
        const savedNotification = await createNotification(data);
        if (savedNotification) {
            io.emit('receive_notification', savedNotification);
        }
    });

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
