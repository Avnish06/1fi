// Force Google DNS to fix ISP SRV lookup blocks
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

// ─────────────────────────────────────────────────────────────────────────────
// SEED DATA — 3 Products × 2-3 variants × 7 EMI plans each
// Images sourced from official manufacturer CDNs
// ─────────────────────────────────────────────────────────────────────────────

const products = [
  // ── 1. iPhone 17 Pro ─────────────────────────────────────────────────────
  {
    slug: 'iphone-17-pro',
    name: 'iPhone 17 Pro',
    brand: 'Apple',
    category: 'smartphones',
    badge: 'NEW',
    description:
      'The iPhone 17 Pro features a titanium design, A19 Pro chip, and a 48MP Fusion camera with 5x optical zoom.',
    variants: [
      {
        variantId: 'iphone-17-pro-silver-256gb',
        storage: '256GB',
        color: 'Silver',
        colorHex: '#C0C0C0',
        mrp: 134900,
        price: 127400,
        image: 'http://localhost:5000/images/iphone_silver.jpg',
      },
      {
        variantId: 'iphone-17-pro-desert-titanium-256gb',
        storage: '256GB',
        color: 'Desert Titanium',
        colorHex: '#C2A882',
        mrp: 134900,
        price: 127400,
        image: 'http://localhost:5000/images/iphone_desert.jpg',
      },
      {
        variantId: 'iphone-17-pro-black-512gb',
        storage: '512GB',
        color: 'Black Titanium',
        colorHex: '#2C2C2C',
        mrp: 154900,
        price: 147400,
        image: 'http://localhost:5000/images/iphone_black.jpg',
      },
    ],
    emiPlans: [
      { tenure: 3,  monthlyAmount: 44967, interestRate: 0,    cashback: 7500, isDefault: false },
      { tenure: 6,  monthlyAmount: 22483, interestRate: 0,    cashback: 7500, isDefault: false },
      { tenure: 12, monthlyAmount: 11242, interestRate: 0,    cashback: 7500, isDefault: true  },
      { tenure: 24, monthlyAmount: 5621,  interestRate: 0,    cashback: 7500, isDefault: false },
      { tenure: 36, monthlyAmount: 4297,  interestRate: 10.5, cashback: 7500, isDefault: false },
      { tenure: 48, monthlyAmount: 3385,  interestRate: 10.5, cashback: 7500, isDefault: false },
      { tenure: 60, monthlyAmount: 2842,  interestRate: 10.5, cashback: 7500, isDefault: false },
    ],
  },

  // ── 2. Samsung Galaxy S25 Ultra ──────────────────────────────────────────
  {
    slug: 'samsung-galaxy-s25-ultra',
    name: 'Samsung Galaxy S25 Ultra',
    brand: 'Samsung',
    category: 'smartphones',
    badge: 'BESTSELLER',
    description:
      'The Galaxy S25 Ultra with built-in S Pen, 200MP camera, Snapdragon 8 Elite chip, and Galaxy AI features.',
    variants: [
      {
        variantId: 'samsung-s25-ultra-titanium-black-256gb',
        storage: '256GB',
        color: 'Titanium Black',
        colorHex: '#1C1C1E',
        mrp: 129999,
        price: 119999,
        image: 'http://localhost:5000/images/samsung.jpg',
      },
      {
        variantId: 'samsung-s25-ultra-titanium-silver-blue-256gb',
        storage: '256GB',
        color: 'Titanium Silver Blue',
        colorHex: '#8BA7B8',
        mrp: 129999,
        price: 119999,
        image: 'http://localhost:5000/images/samsung.jpg',
      },
      {
        variantId: 'samsung-s25-ultra-titanium-gray-512gb',
        storage: '512GB',
        color: 'Titanium Gray',
        colorHex: '#6B6B6B',
        mrp: 149999,
        price: 139999,
        image: 'http://localhost:5000/images/samsung.jpg',
      },
    ],
    emiPlans: [
      { tenure: 3,  monthlyAmount: 39999, interestRate: 0,    cashback: 5000, isDefault: false },
      { tenure: 6,  monthlyAmount: 20000, interestRate: 0,    cashback: 5000, isDefault: false },
      { tenure: 12, monthlyAmount: 10000, interestRate: 0,    cashback: 5000, isDefault: true  },
      { tenure: 24, monthlyAmount: 5384,  interestRate: 0,    cashback: 5000, isDefault: false },
      { tenure: 36, monthlyAmount: 4120,  interestRate: 10.5, cashback: 5000, isDefault: false },
      { tenure: 48, monthlyAmount: 3247,  interestRate: 10.5, cashback: 5000, isDefault: false },
      { tenure: 60, monthlyAmount: 2726,  interestRate: 10.5, cashback: 5000, isDefault: false },
    ],
  },

  // ── 3. OnePlus 13 ────────────────────────────────────────────────────────
  {
    slug: 'oneplus-13',
    name: 'OnePlus 13',
    brand: 'OnePlus',
    category: 'smartphones',
    badge: 'HOT DEAL',
    description:
      'The OnePlus 13 features Snapdragon 8 Elite, 50MP Hasselblad triple camera, 6000mAh battery, and 100W SUPERVOOC charging.',
    variants: [
      {
        variantId: 'oneplus-13-midnight-ocean-256gb',
        storage: '256GB',
        color: 'Midnight Ocean',
        colorHex: '#1B3A4B',
        mrp: 74999,
        price: 69999,
        image: 'http://localhost:5000/images/oneplus.jpg',
      },
      {
        variantId: 'oneplus-13-arctic-dawn-256gb',
        storage: '256GB',
        color: 'Arctic Dawn',
        colorHex: '#E8E4DC',
        mrp: 74999,
        price: 69999,
        image: 'http://localhost:5000/images/oneplus.jpg',
      },
    ],
    emiPlans: [
      { tenure: 3,  monthlyAmount: 23333, interestRate: 0,    cashback: 3000, isDefault: false },
      { tenure: 6,  monthlyAmount: 11667, interestRate: 0,    cashback: 3000, isDefault: false },
      { tenure: 12, monthlyAmount: 5833,  interestRate: 0,    cashback: 3000, isDefault: true  },
      { tenure: 24, monthlyAmount: 3235,  interestRate: 0,    cashback: 3000, isDefault: false },
      { tenure: 36, monthlyAmount: 2474,  interestRate: 10.5, cashback: 3000, isDefault: false },
      { tenure: 48, monthlyAmount: 1948,  interestRate: 10.5, cashback: 3000, isDefault: false },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected!');

    // Clear existing data
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert new data
    const inserted = await Product.insertMany(products);
    console.log(`✅ Seeded ${inserted.length} products:`);
    inserted.forEach((p) => console.log(`   → [${p.brand}] ${p.name}  (slug: ${p.slug})`));

    console.log('\n🎉 Seed complete! You can now start the server with: npm run dev');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();
