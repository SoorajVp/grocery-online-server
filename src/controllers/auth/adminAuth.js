const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin');

const admiLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log('req.body', req.body)
        if (process.env.SUPER_ADMIN_EMAIL === email ) {
            if (process.env.SUPER_ADMIN_PASSWORD !== password) {
                return res.status(401).json({ ok: false, message: 'Invalid credentials' });
            }
            const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
        }
        
        const admin = await Admin.findOne({ email });

        if (!admin) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

        const match = await admin.comparePassword(password);
        
        if (!match) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

        if (admin.blocked) return res.status(403).json({ ok: false, message: 'Admin blocked' });

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

        res.json({ ok: true, token, admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role } });
    } catch (err) { next(err); }
};

module.exports = { admiLogin };
