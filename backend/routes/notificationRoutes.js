const express = require('express');
const router = express.Router();
const {
    createNotification,
    getNotifications,
    getUserNotifications,
    updateNotificationSeenStatus,
    deleteNotifications,addBanner,getBanner
} = require('../controllers/notificationController');

// Route to create a new notification
router.post('/', createNotification);

// Route to get all notifications
router.get('/', getNotifications);
router.get('/user/:userId', getUserNotifications);
router.post('/banner', addBanner);
router.get('/banner', getBanner);
router.delete('/delete/:id', deleteNotifications);

// Update seen status for a specific notification for a user
router.put('/:userId/:notificationId/read', updateNotificationSeenStatus);

module.exports = router;
