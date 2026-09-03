# EasyEMI — Smartphone EMI Product Page

A full-stack web application displaying smartphones with multiple EMI plans backed by mutual funds, similar to Snapmint.

## 🚀 Live Demo
> Deploy to Render/Vercel and add link here

---

## 🛠️ Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Frontend   | React 18 + Vite + CSS (Custom)     |
| Backend    | Node.js + Express.js               |
| Database   | MongoDB Atlas + Mongoose           |
| Routing    | React Router DOM v6                |

---

## 📁 Project Structure

```
emi-product-app/
├── backend/
│   ├── models/
│   │   └── Product.js          # Mongoose schema
│   ├── routes/
│   │   └── products.js         # API routes
│   ├── server.js               # Express app entry
│   ├── seed.js                 # DB seed script
│   ├── .env                    # MONGO_URI, PORT
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx        # Product listing
    │   │   └── ProductDetail.jsx # EMI detail page
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── package.json
```

---

## ⚙️ Setup & Run Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone / Open the project

```bash
cd emi-product-app
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.ypyqd9o.mongodb.net/emi-db
PORT=5000
```

Seed the database:
```bash
npm run seed
```

Start the backend:
```bash
npm run dev
```
> Server runs at: http://localhost:5000

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```
> App runs at: http://localhost:5173

---

## 🗄️ Database Schema

### Product (MongoDB Collection)

```json
{
  "slug": "iphone-17-pro",
  "name": "iPhone 17 Pro",
  "brand": "Apple",
  "category": "smartphones",
  "badge": "NEW",
  "description": "...",
  "variants": [
    {
      "variantId": "iphone-17-pro-silver-256gb",
      "storage": "256GB",
      "color": "Silver",
      "colorHex": "#C0C0C0",
      "mrp": 134900,
      "price": 127400,
      "image": "https://..."
    }
  ],
  "emiPlans": [
    {
      "tenure": 3,
      "monthlyAmount": 44967,
      "interestRate": 0,
      "cashback": 7500,
      "isDefault": false
    },
    {
      "tenure": 12,
      "monthlyAmount": 11242,
      "interestRate": 0,
      "cashback": 7500,
      "isDefault": true
    }
  ]
}
```

---

## 📡 API Endpoints

### `GET /api/products`
Returns a list of all products (summary view).

**Example Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "slug": "iphone-17-pro",
      "name": "iPhone 17 Pro",
      "brand": "Apple",
      "badge": "NEW",
      "price": 127400,
      "mrp": 134900,
      "image": "https://...",
      "colorCount": 3,
      "lowestEmiAmount": 2842,
      "lowestEmiTenure": 60
    }
  ]
}
```

---

### `GET /api/products/:slug`
Returns full product detail including all variants and EMI plans.

**Example:** `GET /api/products/iphone-17-pro`

```json
{
  "success": true,
  "data": {
    "slug": "iphone-17-pro",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "badge": "NEW",
    "variants": [
      {
        "variantId": "iphone-17-pro-silver-256gb",
        "color": "Silver",
        "storage": "256GB",
        "colorHex": "#C0C0C0",
        "mrp": 134900,
        "price": 127400,
        "image": "https://..."
      }
    ],
    "emiPlans": [
      { "tenure": 3,  "monthlyAmount": 44967, "interestRate": 0,    "cashback": 7500, "isDefault": false },
      { "tenure": 6,  "monthlyAmount": 22483, "interestRate": 0,    "cashback": 7500, "isDefault": false },
      { "tenure": 12, "monthlyAmount": 11242, "interestRate": 0,    "cashback": 7500, "isDefault": true  },
      { "tenure": 24, "monthlyAmount": 5621,  "interestRate": 0,    "cashback": 7500, "isDefault": false },
      { "tenure": 36, "monthlyAmount": 4297,  "interestRate": 10.5, "cashback": 7500, "isDefault": false },
      { "tenure": 48, "monthlyAmount": 3385,  "interestRate": 10.5, "cashback": 7500, "isDefault": false },
      { "tenure": 60, "monthlyAmount": 2842,  "interestRate": 10.5, "cashback": 7500, "isDefault": false }
    ]
  }
}
```

---

### `GET /api/products/:slug/variants`
Returns only the variants for a product.

**Example:** `GET /api/products/samsung-galaxy-s25-ultra/variants`

```json
{
  "success": true,
  "data": {
    "slug": "samsung-galaxy-s25-ultra",
    "name": "Samsung Galaxy S25 Ultra",
    "variants": [
      { "color": "Titanium Black", "storage": "256GB", "colorHex": "#1C1C1E", "mrp": 129999, "price": 119999 },
      { "color": "Titanium Silver Blue", "storage": "256GB", "colorHex": "#8BA7B8", "mrp": 129999, "price": 119999 }
    ]
  }
}
```

---

### `GET /api/health`
Health check endpoint.
```json
{ "success": true, "message": "EMI Product API is running", "timestamp": "..." }
```

---

## 📱 Products Included

| Product                    | Variants        | EMI Plans |
|----------------------------|-----------------|-----------|
| Apple iPhone 17 Pro        | 3 (color+storage)| 7 plans   |
| Samsung Galaxy S25 Ultra   | 3 (color+storage)| 7 plans   |
| OnePlus 13                 | 2 (color+storage)| 6 plans   |

---

## 🌐 Unique Product URLs

- `/products/iphone-17-pro`
- `/products/samsung-galaxy-s25-ultra`
- `/products/oneplus-13`
