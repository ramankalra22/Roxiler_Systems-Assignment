const pool = require('../db');

exports.findAll = async (filters, userId) => {
    const conditions = [];
    const params = [];

    if (filters.name) { conditions.push('s.name LIKE ?'); params.push(`%${filters.name}%`); }
    if (filters.address) { conditions.push('s.address LIKE ?'); params.push(`%${filters.address}%`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const sortBy = ['name', 'email', 'address', 'average_rating', 'rating_count', 'created_at'].includes(filters.sortBy) ? filters.sortBy : 's.name';
    const sortOrder = filters.sortOrder === 'DESC' ? 'DESC' : 'ASC';

    const userRatingJoin = userId ? `LEFT JOIN ratings r ON r.store_id = s.id AND r.user_id = ${pool.escape(userId)}` : '';
    const userRatingSelect = userId ? ', r.rating AS user_rating' : '';

    const [rows] = await pool.query(
        `SELECT s.id, s.name, s.email, s.address, s.average_rating, s.rating_count,
                s.owner_id, u.name AS owner_name ${userRatingSelect}
         FROM stores s
         LEFT JOIN users u ON u.id = s.owner_id
         ${userRatingJoin}
         ${where}
         ORDER BY ${sortBy} ${sortOrder}`,
        params
    );
    return rows;
};

exports.findOne = async (id, userId) => {
    const userRatingJoin = userId ? `LEFT JOIN ratings r ON r.store_id = s.id AND r.user_id = ${pool.escape(userId)}` : '';
    const userRatingSelect = userId ? ', r.rating AS user_rating' : '';

    const [rows] = await pool.query(
        `SELECT s.id, s.name, s.email, s.address, s.average_rating, s.rating_count,
                s.owner_id, u.name AS owner_name ${userRatingSelect}
         FROM stores s
         LEFT JOIN users u ON u.id = s.owner_id
         ${userRatingJoin}
         WHERE s.id = ?`,
        [id]
    );
    if (rows.length === 0) throw { status: 404, message: 'Store not found' };
    return rows[0];
};

exports.create = async (dto) => {
    const [existing] = await pool.query('SELECT id FROM stores WHERE email = ?', [dto.email]);
    if (existing.length > 0) throw { status: 409, message: 'Store email already exists' };

    const [result] = await pool.query(
        'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
        [dto.name, dto.email, dto.address, dto.owner_id || null]
    );
    return this.findOne(result.insertId);
};

exports.findByOwner = async (ownerId) => {
    const [rows] = await pool.query(
        `SELECT s.id, s.name, s.email, s.address, s.average_rating, s.rating_count,
                r.rating, r.user_id,
                u.name AS rater_name, u.email AS rater_email
         FROM stores s
         LEFT JOIN ratings r ON r.store_id = s.id
         LEFT JOIN users u ON u.id = r.user_id
         WHERE s.owner_id = ?
         ORDER BY s.id, u.name ASC`,
        [ownerId]
    );
    return rows;
};
