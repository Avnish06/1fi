const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  variantId: { type: String, required: true },
  storage: String,
  color: { type: String, required: true },
  colorHex: { type: String, required: true },
  mrp: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

const emiPlanSchema = new mongoose.Schema({
  tenure: { type: Number, required: true },       // months
  monthlyAmount: { type: Number, required: true },
  interestRate: { type: Number, required: true },  // 0 = 0%, 10.5 = 10.5%
  cashback: { type: Number, default: 0 },
  isDefault: { type: Boolean, default: false },
});

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    badge: { type: String, default: '' },
    description: String,
    variants: [variantSchema],
    emiPlans: [emiPlanSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
