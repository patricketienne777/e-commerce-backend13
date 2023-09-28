const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => { // Added "async"
  try {
    // Find all products and include their associated Category and Tag data
    const products = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => { // Added "async"
  try {
    // Find one product by its `id` value and include its associated Category and Tag data
    const productId = req.params.id;
    const product = await Product.findByPk(productId, {
      include: [{ model: Category }, { model: Tag }],
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.status(200).json(product);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => { // Added "async"
  try {
    // Create a new product
    const newProduct = await Product.create(req.body);

    // if there are associated tags, create pairings in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

// update product
router.put('/:id', async (req, res) => { // Added "async"
  try {
    // update product data
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // Rest of the code for updating associated tags

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(400).json(err);
  }
});

// delete one product by its `id` value
router.delete('/:id', async (req, res) => { // Added "async"
  try {
    // Delete a product by its `id` value
    const productId = req.params.id;
    const deletedProduct = await Product.destroy({
      where: { id: productId },
    });

    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.status(200).json({ message: 'Product deleted successfully' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
