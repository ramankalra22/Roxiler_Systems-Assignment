const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken, requireRole(['admin']));

router.get('/', usersController.findAll);
router.get('/stats', usersController.getStats);
router.get('/:id', usersController.findOne);
router.post('/', usersController.create);

module.exports = router;
