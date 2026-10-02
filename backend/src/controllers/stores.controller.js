const storesService = require('../services/stores.service');

exports.findAll = async (req, res) => {
    try {
        const userId = req.user ? req.user.sub : null;
        const result = await storesService.findAll(req.query, userId);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.findOne = async (req, res) => {
    try {
        const userId = req.user ? req.user.sub : null;
        const result = await storesService.findOne(req.params.id, userId);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const result = await storesService.create(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.ownerDashboard = async (req, res) => {
    try {
        const result = await storesService.findByOwner(req.user.sub);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};
