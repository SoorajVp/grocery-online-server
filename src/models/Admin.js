const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    mobile: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['admin', 'super-admin'], 
        default: 'admin' 
    },
    blocked: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

// hash password
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

adminSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

adminSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        return ret;
    }
});

module.exports = mongoose.model('Admin', adminSchema);
