const pool = require('../db');
const bcrypt = require('bcrypt');

exports.findAll = async (filters) => {
    const conditions = [];
    const params = [];

    if (filters.name) { conditions.push('name LIKE ?'); params.push(`%${filters.name}%`); }
    if (filters.email) { conditions.push('email LIKE ?'); params.push(`%${filters.email}%`); }
    if (filters.address) { conditions.push('address LIKE ?'); params.push(`%${filters.address}%`); }
    if (filters.role) { conditions.push('role = ?'); params.push(filters.role); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const sortBy = ['name', 'email', 'address', 'role', 'created_at'].includes(filters.sortBy) ? filters.sortBy : 'name';
    const sortOrder = filters.sortOrder === 'DESC' ? 'DESC' : 'ASC';

    const [rows] = await pool.query(
        `SELECT id, name, email, address, role, created_at FROM users ${where} ORDER BY ${sortBy} ${sortOrder}`,
        params
    );
    return rows;
};

exports.findOne = async (id) => {
    const [rows] = await pool.query(
        `SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
                s.average_rating AS store_rating, s.name AS store_name
         FROM users u
         LEFT JOIN stores s ON s.owner_id = u.id
         WHERE u.id = ?`,
        [id]
    );
    if (rows.length === 0) throw { status: 404, message: 'User not found' };
    return rows[0];
};

exports.create = async (dto) => {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [dto.email]);
    if (existing.length > 0) throw { status: 409, message: 'Email already registered' };

    const hash = await bcrypt.hash(dto.password, 10);
    const [result] = await pool.query(
        'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
        [dto.name, dto.email, hash, dto.address, dto.role]
    );
    return this.findOne(result.insertId);
};

exports.getStats = async () => {
    const [[userCount]] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [[storeCount]] = await pool.query('SELECT COUNT(*) as count FROM stores');
    const [[ratingCount]] = await pool.query('SELECT COUNT(*) as count FROM ratings');
    return {
        totalUsers: userCount.count,
        totalStores: storeCount.count,
        totalRatings: ratingCount.count,
    };
};
