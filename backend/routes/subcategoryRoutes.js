const express = require('express');
const router = express.Router();
const {
  getSubcategories,
  getSubcategoriesByCategory,
  getSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} = require('../controllers/subcategoryController');

// GET all subcategories
router.get('/', getSubcategories);

// GET subcategories by category
router.get('/category/:categoryId', getSubcategoriesByCategory);

// GET single subcategory
router.get('/:id', getSubcategory);

// CREATE subcategory
router.post('/', createSubcategory);

// UPDATE subcategory
router.put('/:id', updateSubcategory);

// DELETE subcategory
router.delete('/:id', deleteSubcategory);

module.exports = router;