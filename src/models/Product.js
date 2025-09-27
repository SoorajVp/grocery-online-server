const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        unique: true
    }, // unique stock keeping unit
    description: String,
    
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    images: [{
        type: String
    }], // Cloudinary URLs instead of local file paths
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }, 
    discount: {
        type: Number,
        default: 0
    }, 
    // stock
    unit: { type: String }, // e.g., "1 kg"
    active: { 
        type: Boolean, 
        default: true 
    },

    // admin references
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin', 
        required: true 
    },
    updatedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin' 
    }
}, { timestamps: true });

// Ensure min 4 images at the model layer (validation)
productSchema.pre('validate', function (next) {
    if (!this.images || this.images.length < 4) {
        const err = new Error('Product must contain at least 4 images.');
        err.status = 400;
        return next(err);
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);
