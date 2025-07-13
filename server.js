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
const server = http.createServer(app); // ✅ Needed for Socket.IO
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

// ✅ Default route to test server is live
app.get('/', (req, res) => {
    res.send('✅ Server is Live!');
});

// ✅ Socket.IO logic
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

// ✅ Use server.listen (not app.listen)
const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
