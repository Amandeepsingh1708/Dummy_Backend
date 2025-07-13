const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    partNo: String,
    partDesc: String,
    manufacturer: String,
    msl: String,
    description: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
