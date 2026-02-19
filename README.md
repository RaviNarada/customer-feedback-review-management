# 📌 Feedback & Review Management System

A full-stack web application for managing product/service reviews, analytics, reporting, and admin responses.

---

# 🚀 Tech Stack

## 🔹 Frontend
- React (TypeScript)
- Axios (API calls)
- React Router
- Chart.js / Recharts
- Tailwind CSS / Bootstrap
- shadcn UI

## 🔹 Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt (Password hashing)
- Prisma ORM

## 🔹 Database
- MySQL (Structured relational database optimized for reporting)

---

# 👥 Team Work Distribution (6 Members)

---

## 👤 1️⃣ Auth Module (Workload: Medium)

### 🔧 Tech Used
- Backend: Node.js + Express + JWT + bcrypt
- Frontend: React Forms
- Database: `users` table

### 🎯 Responsibilities

#### Backend APIs
    - POST /api/auth/register
    - POST /api/auth/login


- JWT token generation
- Role-based middleware (admin/customer)

#### Frontend
- Login Page
- Register Page
- Auth Context / Redux store
- Protected Routes

### 📦 Deliverable
- Working authentication flow
- Role-based access control

---

## 👤 2️⃣ Feedback Management Module (Workload: High)

### 🔧 Tech Used
- Express Routes
- MySQL (reviews, ratings)
- React Forms
- Axios

### 🎯 Responsibilities

#### Backend APIs
 - POST /api/reviews
 - GET /api/reviews
 - PUT /api/reviews/:id
 - DELETE /api/reviews/:id



#### Frontend
- Submit Feedback Form
- Star Rating Component
- Edit/Delete UI

#### Database Tables
- `reviews`
- `products` / `services`

---

## 👤 3️⃣ Admin Dashboard Module (Workload: Medium)

### 🔧 Tech Used
- Express Aggregation APIs
- React Dashboard Layout
- Chart Library

### 🎯 Responsibilities

#### Backend APIs
- GET /api/admin/stats
- GET /api/admin/reviews


#### Frontend
- Admin Dashboard Layout
- Overview Cards:
  - Total Reviews
  - Average Rating
  - Pending Responses

---

## 👤 4️⃣ Reports Module (Workload: Medium-High)

### 🔧 Tech Used
- Node Aggregation Queries
- Chart.js / Recharts
- json2csv (CSV export)
- pdfkit (PDF export)

### 🎯 Responsibilities

#### Backend APIs
 - GET /api/reports/monthly
 - GET /api/reports/product
 - GET /api/reports/download


#### Frontend
- Filter by Date
- Generate Report Button
- Download Report

---

## 👤 5️⃣ Response Module (Workload: Medium)

### 🔧 Tech Used
- Express Routes
- DB Relationship (review → response)
- React Reply UI

### 🎯 Responsibilities

#### Backend APIs
 - POST /api/reviews/:id/respond
 - PUT /api/reviews/:id/status


#### Frontend
- Admin Reply Box
- Mark as Resolved
- Show Response Under Review

#### Database
- `responses` table
- `review.status` field

---

## 👤 6️⃣ Analytics Module (Workload: Medium)

### 🔧 Tech Used
- SQL Aggregation Queries
- Chart Library in React


#### Frontend
- Pie Chart (Rating Distribution)
- Line Chart (Monthly Growth)
- Bar Chart (Product Comparison)

---

# 📁 Project Structure

## 📦 Root
```my-app/
    client/                 # Frontend - React + TS + shadcn UI
    server/                 # Backend - Node + Express + Prisma + MySQL
    docs/                   # Documentation (API, DB, Architecture)

    .env            # Sample environment variables
    README.md               # Project overview
```

```client/
│
├── public/
│
├── src/
│ ├── app/
│ │ ├── App.tsx
│ │ ├── router.tsx
│ │ └── providers.tsx
│ │
│ ├── assets/
│ ├── components/
│ │ ├── ui/
│ │ ├── shared/
│ │ └── forms/
│ │
│ ├── features/
│ │ ├── auth/
│ │ ├── admin/
│ │ ├── reviews/
│ │ └── dashboard/
│ │
│ ├── hooks/
│ ├── lib/
│ ├── routes/
│ ├── store/
│ ├── styles/
│ ├── types/
│ └── main.tsx
│
├── components.json
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

```
server/
│
├── prisma/
│ ├── schema.prisma
│ └── migrations/
│
├── src/
│ ├── config/
│ ├── controllers/
│ ├── services/
│ ├── repositories/
│ ├── routes/
│ ├── middlewares/
│ ├── utils/
│ ├── types/
│ ├── app.ts
│ └── server.ts
│
├── .env
├── tsconfig.json
└── package.json
```




