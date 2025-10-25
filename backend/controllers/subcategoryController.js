const Subcategory = require('../models/subcategoryModel');

// GET all subcategories
const getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('category_id', 'category_name');
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET subcategories by category_id
const getSubcategoriesByCategory = async (req, res) => {
  try {
    console.log('Getting subcategories for categoryId:', req.params.categoryId);
    const subcategories = await Subcategory.find({ category_id: req.params.categoryId });
    console.log('Found subcategories:', subcategories);
    res.json(subcategories);
  } catch (error) {
    console.error('Error in getSubcategoriesByCategory:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET single subcategory
const getSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id).populate('category_id', 'category_name');
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.json(subcategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE subcategory
const createSubcategory = async (req, res) => {
  try {
    const subcategory = new Subcategory(req.body);
    const savedSubcategory = await subcategory.save();
    res.status(201).json(savedSubcategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE subcategory
const updateSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.json(subcategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE subcategory
const deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSubcategories,
  getSubcategoriesByCategory,
  getSubcategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
};