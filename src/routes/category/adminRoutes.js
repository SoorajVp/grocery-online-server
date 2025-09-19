const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/category/adminController');

// Create a new category
router.post('/', categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getCategories);

// Get a specific category by ID
router.get('/:id', categoryController.getCategoryById);

// Update a category by ID
router.put('/:id', categoryController.updateCategory);

// Delete a category by ID
router.delete('/:id', categoryController.deleteCategory);

router.patch('/:id/active', categoryController.setCategoryActiveStatus);

module.exports = router;
