# Urban Cart

Urban Cart is a full-stack ecommerce application with a React frontend and an Express plus MongoDB backend. The project includes account sessions, product catalog browsing, cart and wishlist flows, order placement with Razorpay, AI-assisted about and contact experiences through Gemini, and smart catalog search.

## Highlights

- Backend-driven storefront with MongoDB persistence
- Account sign in and sign up with one-day local session persistence
- Cart, wishlist, profile, orders, and contact flows connected to the API
- Razorpay checkout integration
- Gemini-powered About assistant, Contact drafting, and product search understanding
- Responsive storefront layout built with React and Tailwind CSS

## Repository Structure

```text
📦 (project-root)
├── backend/
│   ├── .gitignore
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   ├── startup.out.log
│   ├── startup.err.log
│   └── src/
│       ├── app.js
│       ├── config/
│       │   ├── .env.sample
│       │   ├── database.js
│       │   └── env.js
│       ├── constants/
│       │   └── site-content.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── cart.controller.js
│       │   ├── contact.controller.js
│       │   ├── content.controller.js
│       │   ├── order.controller.js
│       │   ├── product.controller.js
│       │   ├── profile.controller.js
│       │   ├── storefront.controller.js
│       │   └── wishlist.controller.js
│       ├── data/
│       │   └── product-seed.js
│       ├── middleware/
│       │   ├── async-handler.js
│       │   ├── auth.js
│       │   ├── error-handler.js
│       │   └── not-found.js
│       ├── models/
│       │   ├── Cart.js
│       │   ├── ContactMessage.js
│       │   ├── Order.js
│       │   ├── Product.js
│       │   ├── Session.js
│       │   ├── User.js
│       │   └── Wishlist.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── cart.routes.js
│       │   ├── contact.routes.js
│       │   ├── content.routes.js
│       │   ├── order.routes.js
│       │   ├── product.routes.js
│       │   ├── profile.routes.js
│       │   ├── storefront.routes.js
│       │   └── wishlist.routes.js
│       ├── services/
│       │   ├── account.service.js
│       │   ├── auth.service.js
│       │   ├── gemini.service.js
│       │   ├── mail.service.js
│       │   ├── payment.service.js
│       │   ├── product-search.service.js
│       │   └── seed.service.js
│       └── utils/
│           ├── serializers.js
│           └── session-token.js
├── frontend/
│   ├── .gitignore
│   ├── index.html
│   ├── eslint.config.js
│   ├── vite.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── public/
│   │   ├── shopping-cart.png
│   │   └── vite.svg
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── assets/
│       │   └── react.svg
│       ├── components/
│       │   ├── AuthPrompt.jsx
│       │   └── ProductCard.jsx
│       ├── contexts/
│       │   ├── ProductContext.jsx
│       │   └── product-context.js
│       ├── layout/
│       │   └── app-layout.jsx
│       ├── lib/
│       │   ├── api.js
│       │   └── session.js
│       └── pages/
│           ├── Home.jsx
│           ├── Header.jsx
│           ├── Footer.jsx
│           ├── AuthPage.jsx
│           ├── DisplayProducts.jsx
│           ├── Cart.jsx
│           ├── Wishlist.jsx
│           ├── Orders.jsx
│           ├── Profile.jsx
│           ├── Contact.jsx
│           └── InfoPage.jsx
├── README.md
├── LICENSE.md
├── COPYRIGHT.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── SECURITY.md

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, Vite
- Backend: Express, Mongoose, MongoDB
- Payments: Razorpay
- AI: Gemini API
- Email: Nodemailer

## Getting Started

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Copy the backend sample file and fill in your values:

```bash
copy backend\\src\\config\\.env.sample backend\\src\\config\\.env
```

Important backend variables:

- `MONGODB_URI`
- `CLIENT_URL`
- `GEMINI_API_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_NOTIFICATION_TO`

### 3. Start the backend

```bash
cd backend
npm run dev
```

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

Frontend default URL:

- `http://localhost:5173`

Backend default URL:

- `http://localhost:3000`

## Available Scripts

Backend:

- `npm run dev`
- `npm run start`
- `npm run check`

Frontend:

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

## Core Features

- Product catalog with AI-assisted search
- Account dropdown and footer-based sign out
- Contact form with AI drafting
- About page smart FAQ assistant
- MongoDB-backed order history and customer profile
- Payment verification flow after Razorpay checkout

## Project Documentation

- [Contributing Guide](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Security Policy](./SECURITY.md)
- [Copyright Notice](./COPYRIGHT.md)
- [License](./LICENSE.md)

## Ownership

Urban Cart is developed and maintained by Satyajit Samal.
