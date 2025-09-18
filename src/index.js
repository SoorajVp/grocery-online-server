require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { connectDB } = require('./config/database');

const app = express();

app.use(cors())
app.use(express.json());

// static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_PATH || 'uploads')));

connectDB();

// Routes
app.use('/api/admin/auth', require('./routes/auth/adminAuthRoutes'));
// app.use('/api/admin/categories', require('./routes/categories'));
// app.use('/api/admin/products', require('./routes/products'));
// app.use('/api/admin/users', require('./routes/users'));
// app.use('/api/admin/orders', require('./routes/orders'));
// app.use('/api/admin/wallets', require('./routes/wallets'));

// error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ ok: false, message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
