const usersService = require('../services/users.service');

exports.findAll = async (req, res) => {
    try {
        const result = await usersService.findAll(req.query);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const result = await usersService.getStats();
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.findOne = async (req, res) => {
    try {
        const result = await usersService.findOne(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const result = await usersService.create(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};
