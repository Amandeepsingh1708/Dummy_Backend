// controllers/notificationController.js
const Notification = require('../models/notification');

// Create notification for socket
exports.createNotification = async (data) => {
    try {
        const newNotification = new Notification(data);
        return await newNotification.save();
    } catch (err) {
        console.error('Error:', err);
        return null;
    }
};

// API handler
exports.getNotifications = async (req, res) => {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
};

exports.updateNotificationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Notification.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updated);
};


