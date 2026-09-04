# 1Fi EMI Product Web Application

This is a full-stack web application built for the 1Fi SDE1 Assignment. It displays products with multiple EMI plans backed by mutual funds, fetching all data dynamically from a backend API connected to a MongoDB database.

## 🚀 Tech Stack Used
* **Frontend:** React.js, Vanilla CSS (Clueso-inspired premium design)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (NoSQL)

## ✨ Core Functionality Implemented
* **Dynamic Product Pages:** Displays product name, variant (storage/color), MRP, price, and dynamically updating images based on variant selection.
* **EMI Plans:** A list of EMI plans displaying monthly amount, tenure, interest rate, and cashback.
* **Selection:** Clickable variants and selectable EMI plans that dynamically update the "Proceed" button.
* **API Driven:** 100% data is loaded via backend APIs (no hardcoded frontend data).
* **Unique Routing:** `/:slug` routes for SEO and direct product linking (e.g., `/products/iphone-17-pro`).
* **Products:** 3 products (iPhone 17 Pro, Samsung S25 Ultra, OnePlus 13), each with 2-3 color variants.

## 📦 Database Schema

**Product Schema (`backend/models/Product.js`):**
```javascript
{
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String },
  badge: { type: String },
  description: { type: String },
  variants: [{
    variantId: String,
    storage: String,
    color: String,
    colorHex: String,
    mrp: Number,
    price: Number,
    image: String
  }],
  emiPlans: [{
    tenure: Number,
    monthlyAmount: Number,
    interestRate: Number,
    cashback: Number,
    isDefault: Boolean
  }]
}
```

## 🔌 API Endpoints
* `GET /api/products` - Returns a summary of all products (used for homepage cards).
* `GET /api/products/:slug` - Returns detailed information, variants, and EMI plans for a specific product.

**Example Response (`GET /api/products/iphone-17-pro`):**
```json
{
  "success": true,
  "data": {
    "slug": "iphone-17-pro",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "variants": [
      {
        "color": "Silver",
        "price": 127400,
        "image": "http://localhost:5000/brain/..."
      }
    ],
    "emiPlans": [
      {
        "tenure": 12,
        "monthlyAmount": 11242,
        "interestRate": 0
      }
    ]
  }
}
```

## 🛠️ Setup & Run Instructions

### 1. Database Setup
The app connects to a live MongoDB Atlas cluster. The connection string is provided in the `.env` file in the backend.

### 2. Start the Backend
```bash
cd backend
npm install
npm run seed  # (Optional) Seed the database with products
npm run dev
```
*Backend runs on `http://localhost:5000`*

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*
