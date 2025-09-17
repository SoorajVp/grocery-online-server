const Product = require('../models/Product');

const createProduct = async (req, res, next) => {
    try {
        const images = (req.files || []).map(file => file.path); // Cloudinary URLs
        const { name, sku, price, quantity, unit, categories, description } = req.body;
        const categoryIds = categories ? JSON.parse(categories) : [];

        const product = new Product({
            name,
            sku,
            price: Number(price),
            quantity: Number(quantity || 0),
            unit,
            description,
            categories: categoryIds,
            images,
            createdBy: req.admin._id, // admin from auth middleware
            updatedBy: req.admin._id
        });

        await product.save();
        res.json({ ok: true, product });
    } catch (err) { next(err); }
};

const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ ok: false, message: 'Not found' });

        if (req.files && req.files.length) {
            const newImgs = req.files.map(file => file.path); // Cloudinary URLs
            product.images = product.images.concat(newImgs);
        }

        const fields = ['name', 'sku', 'price', 'quantity', 'unit', 'description'];
        fields.forEach(f => { if (req.body[f] !== undefined) product[f] = req.body[f]; });
        if (req.body.categories) product.categories = JSON.parse(req.body.categories);

        product.updatedBy = req.admin._id;

        await product.save();
        res.json({ ok: true, product });
    } catch (err) { next(err); }
};

module.exports = { createProduct, updateProduct };
