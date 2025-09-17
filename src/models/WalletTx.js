const mongoose = require('mongoose');

const walletTxSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['CREDIT', 'DEBIT', 'REWARD'], required: true },
    amount: { type: Number, required: true },
    note: String
}, { timestamps: true });

module.exports = mongoose.model('WalletTx', walletTxSchema);
