const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const ratingsRoutes = require('./routes/ratings.routes');
const storesRoutes = require('./routes/stores.routes');
const usersRoutes = require('./routes/users.routes');

const app = express();

app.use(cors({
	origin(origin, callback) {
		const configuredOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
		if (!origin || origin === configuredOrigin) return callback(null, true);

		if (process.env.NODE_ENV !== 'production') {
			try {
				const { protocol, hostname } = new URL(origin);
				if (protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(hostname)) {
					return callback(null, true);
				}
			} catch (error) {
				return callback(error);
			}
		}

		return callback(new Error('Origin not allowed by CORS'));
	},
	credentials: true,
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/users', usersRoutes);

const port = Number(process.env.PORT || 3001);

if (require.main === module) {
	app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));
}

module.exports = app;
