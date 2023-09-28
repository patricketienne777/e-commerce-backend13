const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    // Find all categories and include their associated Products
    const categories = await Category.findAll({
      include: [Product],
    });

    // Handle the response or do something with 'categories'
    res.json(categories);
  } catch (error) {
    // Handle errors here, e.g., send an error response
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    // Find one category by its `id` value and include its associated Products
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId, {
      include: [Product],
    });
  
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
    } else {
      res.status(200).json(category);
    }
  } catch (err) {
    // Handle other potential errors
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});  

router.post('/', async (req, res) => {
  // Implement logic to create a new category and respond accordingly
  try {
    // Create a new category
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // Implement logic to update a category by its `id` value and respond accordingly
  try {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId);

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
    } else {
      // Update the category
      await category.update(req.body);
      res.status(200).json({ message: 'Category updated successfully' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // Implement logic to delete a category by its `id` value and respond accordingly
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.destroy({
      where: { id: categoryId },
    });

    if (!deletedCategory) {
      res.status(404).json({ message: 'Category not found' });
    } else {
      res.status(200).json({ message: 'Category deleted successfully' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

