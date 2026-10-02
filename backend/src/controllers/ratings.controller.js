const ratingsService = require('../services/ratings.service');

exports.upsertRating = async (req, res) => {
    try {
        const result = await ratingsService.upsertRating(req.user.sub, req.params.storeId, req.body);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.getMyRating = async (req, res) => {
    try {
        const result = await ratingsService.getUserRatingForStore(req.user.sub, req.params.storeId);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};
