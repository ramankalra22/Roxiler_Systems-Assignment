const express = require('express');
const router = express.Router();
const storesController = require('../controllers/stores.controller');
const { verifyToken, requireRole } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production');
        } catch (e) {}
    }
    next();
};

router.get('/', optionalAuth, storesController.findAll);
router.get('/owner/dashboard', verifyToken, requireRole(['owner']), storesController.ownerDashboard);
router.get('/:id', optionalAuth, storesController.findOne);
router.post('/', verifyToken, requireRole(['admin']), storesController.create);

module.exports = router;
