const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products — list all products (summary)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find(
      {},
      { slug: 1, name: 1, brand: 1, badge: 1, category: 1, variants: 1, emiPlans: 1 }
    );

    // Map to summary format
    const summary = products.map((p) => {
      const defaultVariant = p.variants[0];
      const lowestEmi = p.emiPlans.reduce(
        (min, plan) => (plan.monthlyAmount < min.monthlyAmount ? plan : min),
        p.emiPlans[0]
      );
      return {
        _id: p._id,
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        badge: p.badge,
        category: p.category,
        price: defaultVariant?.price,
        mrp: defaultVariant?.mrp,
        image: defaultVariant?.image,
        colorCount: p.variants.length,
        lowestEmiAmount: lowestEmi?.monthlyAmount,
        lowestEmiTenure: lowestEmi?.tenure,
      };
    });

    res.json({ success: true, count: summary.length, data: summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/products/:slug — full product detail with all variants and EMI plans
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/products/:slug/variants — only variants for a product
router.get('/:slug/variants', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }, { variants: 1, slug: 1, name: 1 });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: { slug: product.slug, name: product.name, variants: product.variants } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
