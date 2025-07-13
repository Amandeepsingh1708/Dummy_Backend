const express = require('express');
const router = express.Router();
const {
    getNotifications,
    updateNotificationStatus
} = require('../controllers/notificationController');

// Only REST-based routes
router.get('/', getNotifications);
router.put('/:id/status', updateNotificationStatus);

module.exports = router;
