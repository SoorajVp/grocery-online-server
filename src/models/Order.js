const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: Number,
    paymentMethod: { type: String, enum: ['COD', 'ONLINE'], default: 'COD' },
    status: { type: String, enum: ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], default: 'PLACED' },
    address: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
