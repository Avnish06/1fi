# 1Fi EMI Product Web Application

This is a full-stack web application built for the 1Fi SDE1 Assignment. It displays products with multiple EMI plans, fetching all data dynamically from a backend API connected to a MongoDB database. All product images are securely hosted on Cloudinary.

## 🚀 Live Links
* **Frontend Application (Vercel):** [https://1fi-one.vercel.app/](https://1fi-one.vercel.app/)
* **Backend API:** [https://voice.colvo.co.in/api/products](https://voice.colvo.co.in/api/products)

## 🛠 Tech Stack Used
* **Frontend:** React.js, Vite, **Tailwind CSS** (Utility-first CSS framework for rapid UI development and premium design)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (NoSQL)
* **Image Hosting:** Cloudinary

## ✨ Core Functionality Implemented
* **Dynamic Product Pages:** Displays product name, variant (storage/color), MRP, price, and dynamically updating images based on variant selection.
* **EMI Plans:** A list of EMI plans displaying monthly amount, tenure, interest rate, and cashback.
* **Selection:** Clickable variants and selectable EMI plans that dynamically update the "Proceed" button.
* **API Driven:** 100% of the data is loaded via backend APIs (no hardcoded frontend data).
* **Unique Routing:** `/:slug` routes for SEO and direct product linking (e.g., `/products/iphone-17-pro`).
* **Cloudinary Integration:** Images are uploaded and served via Cloudinary CDN for optimal performance.

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
    image: String // Cloudinary URL
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
        "image": "https://res.cloudinary.com/dy1flnpei/image/upload/v1788516297/emi-products/iphone_silver.jpg"
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

## 💻 Local Setup & Run Instructions

### 1. Backend Setup
The app connects to a live MongoDB Atlas cluster and uses Cloudinary. Make sure your `.env` is configured correctly.
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5050` (or as defined in PORT)*

### 2. Frontend Setup
Make sure the `VITE_API_URL` inside `frontend/.env` points to the correct backend API.
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*
