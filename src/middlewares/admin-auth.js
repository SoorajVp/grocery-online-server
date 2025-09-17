const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const authAdmin = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header) return res.status(401).json({ ok: false, message: 'No token' });
        const token = header.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(payload.id);
        if (!admin || admin.blocked) return res.status(403).json({ ok: false, message: 'Forbidden' });
        req.admin = admin;
        next();
    } catch (err) {
        next(err);
    }
};

const requireSuperAdmin = (req, res, next) => {
    if (req.admin.role !== 'superadmin') return res.status(403).json({ ok: false, message: 'Requires superadmin' });
    next();
};

module.exports = { authAdmin, requireSuperAdmin };
