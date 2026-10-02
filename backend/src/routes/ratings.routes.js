const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratings.controller');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken, requireRole(['user']));

router.post('/stores/:storeId', ratingsController.upsertRating);
router.get('/stores/:storeId', ratingsController.getMyRating);

module.exports = router;
