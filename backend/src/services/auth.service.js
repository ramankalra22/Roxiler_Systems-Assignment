const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (dto) => {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [dto.email]);
    if (existing.length > 0) throw { status: 409, message: 'Email already registered' };

    const hash = await bcrypt.hash(dto.password, 10);
    const [result] = await pool.query(
        'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
        [dto.name, dto.email, hash, dto.address, 'user']
    );
    const [rows] = await pool.query('SELECT id, name, email, address, role FROM users WHERE id = ?', [result.insertId]);
    const user = rows[0];
    const access_token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production', { expiresIn: '7d' });
    return { access_token, user };
};

exports.login = async (dto) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [dto.email]);
    if (rows.length === 0) throw { status: 401, message: 'Invalid credentials' };

    const user = rows[0];
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw { status: 401, message: 'Invalid credentials' };

    delete user.password;
    const access_token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production', { expiresIn: '7d' });
    return { access_token, user };
};

exports.updatePassword = async (userId, dto) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) throw { status: 404, message: 'User not found' };

    const user = rows[0];
    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) throw { status: 401, message: 'Current password is incorrect' };

    const hash = await bcrypt.hash(dto.newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hash, userId]);
    return { message: 'Password updated successfully' };
};
