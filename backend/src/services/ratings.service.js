const pool = require('../db');

exports.upsertRating = async (userId, storeId, dto) => {
    const [storeRows] = await pool.query('SELECT id FROM stores WHERE id = ?', [storeId]);
    if (storeRows.length === 0) throw { status: 404, message: 'Store not found' };

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        await conn.query(
            `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = NOW()`,
            [userId, storeId, dto.rating]
        );
        const [aggRows] = await conn.query('SELECT COUNT(*) AS cnt, AVG(rating) AS avg FROM ratings WHERE store_id = ?', [storeId]);
        const { cnt, avg } = aggRows[0];
        await conn.query('UPDATE stores SET rating_count = ?, average_rating = ? WHERE id = ?', [cnt, parseFloat(avg).toFixed(2), storeId]);
        await conn.commit();
        const [updated] = await conn.query('SELECT * FROM ratings WHERE user_id = ? AND store_id = ?', [userId, storeId]);
        return updated[0];
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

exports.getUserRatingForStore = async (userId, storeId) => {
    const [rows] = await pool.query('SELECT * FROM ratings WHERE user_id = ? AND store_id = ?', [userId, storeId]);
    return rows[0] || null;
};
