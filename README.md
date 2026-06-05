# Noroff EP Marketplace — Full-Stack Exam Project
 
A full-stack e-commerce marketplace built for the Noroff EP exam. It consists of a **REST API backend** (Node.js, Express, Sequelize, MySQL) and a **React admin panel frontend** (React, Vite). Both live in a single repository under `BackendExm/` and `FrontendExm/`.
 
**Live frontend:** https://marketplace-exm-26.vercel.app
**Backend API:** https://marketplace-exmprj-2026.onrender.com
**Swagger docs:** https://marketplace-exmprj-2026.onrender.com/doc
 
```bash
git clone https://github.com/NoroffMax12/Marketplace-ExmPrj_2026.git
```
 
---
 
## Tech Stack
 
### Backend (`BackendExm/`)
- Node.js v22
- Express v5
- Sequelize v6 (ORM)
- MySQL (hosted on Railway)
- JWT authentication + bcrypt
- Swagger UI at `/doc`
- Hosted on Render.com

### Frontend (`FrontendExm/`)
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP requests to backend API |
| Tailwind CSS v3 | Utility-first styling |
| Lucide React | Icon library |
| Recharts | Dashboard charts |
| Vercel | Hosting |
 
---
 
## Getting Started
 
### Prerequisites
- Node.js v22+
- A MySQL database (local or Railway)
### 1. Backend setup
 
```bash
cd Marketplace-ExmPrj_2026/BackendExm
npm install
```
 
Create a `.env` file in `BackendExm/`:
```
PORT=3001
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
```
 
Run it:
```bash
npm run dev      # Development
npm start        # Production
npm test         # Run Jest/Supertest integration tests
```
 
**Initialize the database** (once): send `POST http://localhost:3001/init`. This seeds roles, an admin user, membership tiers, and products from the Noroff API.
 
### 2. Frontend setup
 
```bash
cd Marketplace-ExmPrj_2026/FrontendExm
npm install
```
 
Create a `.env` file in `FrontendExm/`:
```
VITE_API_URL=http://localhost:3001
```
 
Run it:
```bash
npm run dev       # Development → http://localhost:5173
npm run build     # Production build
npm run preview   # Preview the production build locally
```
 
---
 
## Admin Credentials (for testing)
```
Email:    admin@noroff.no
Password: P@ssword2023
```
 
---
 
## API Documentation
 
Swagger UI is available at:
- Local: `http://localhost:3001/doc`
- Production: `https://marketplace-exmprj-2026.onrender.com/doc`
---
 
## Frontend Routes
 
| Path | Page | Access |
|---|---|---|
| `/login` | Login | Public |
| `/` | Dashboard | Admin only |
| `/products` | Products | Admin only |
| `/categories` | Categories | Admin only |
| `/brands` | Brands | Admin only |
| `/orders` | Orders | Admin only |
| `/users` | Users | Admin only |
| `/membership` | Membership | Admin only |
| `/search` | Search | Admin only |
 
---
 
## Backend Response Notes (frontend integration)
 
The frontend must account for these exact backend field shapes:
 
- `Products.date_added` — date field from backend, **not** `createdAt`
- `Orders.User.username` — nested object in backend response
- `Orders.Membership.name` — nested object in backend response
- `Orders.totalPrice` — **not** `total`
- `Users.RoleId` — `1 = Admin`, `2 = User` (sent as integer on PUT)
- `Membership.minQuantity` / `maxQuantity` — **not** `minPurchases`
---
 
## Project Structure
 
### Backend (`BackendExm/`)
```
├── 📁 config
│   └── 📄 database.js
├── 📁 controllers
│   ├── 📄 auth.controller.js
│   ├── 📄 brand.controller.js
│   ├── 📄 cart.controller.js
│   ├── 📄 category.controller.js
│   ├── 📄 init.controller.js
│   ├── 📄 membership.controller.js
│   ├── 📄 order.controller.js
│   ├── 📄 product.controller.js
│   ├── 📄 recentlyviewed.controller.js
│   ├── 📄 search.controller.js
│   └── 📄 user.controller.js
├── 📁 middleware
│   ├── 📄 admin.middleware.js
│   └── 📄 auth.middleware.js
├── 📁 models
│   ├── 📄 Brand.js
│   ├── 📄 Cart.js
│   ├── 📄 CartItem.js
│   ├── 📄 Category.js
│   ├── 📄 Membership.js
│   ├── 📄 Order.js
│   ├── 📄 OrderItem.js
│   ├── 📄 Product.js
│   ├── 📄 RecentlyViewed.js
│   ├── 📄 Role.js
│   ├── 📄 User.js
│   └── 📄 index.js
├── 📁 public/stylesheets
│   └── 🎨 style.css
├── 📁 resources
│   └── 🖼️ EER_Diagram-exmPRJ.png
├── 📁 routes
│   ├── 📄 auth.routes.js
│   ├── 📄 brand.routes.js
│   ├── 📄 cart.routes.js
│   ├── 📄 category.routes.js
│   ├── 📄 index.js
│   ├── 📄 init.routes.js
│   ├── 📄 membership.routes.js
│   ├── 📄 order.routes.js
│   ├── 📄 product.routes.js
│   ├── 📄 recentlyviewed.routes.js
│   ├── 📄 search.routes.js
│   ├── 📄 user.routes.js
│   └── 📄 users.js
├── 📁 swagger
│   └── 📄 swagger.js
├── 📁 tests
│   └── 📄 api.test.js
├── 📁 views
│   ├── 📄 error.ejs
│   └── 📄 index.ejs
├── 📄 app.js
└── ⚙️ package.json
```
 
### Frontend (`FrontendExm/`)
```
├── 📁 public
│   ├── 🖼️ favicon.svg
│   └── 🖼️ icons.svg
├── 📁 src
│   ├── 📁 api
│   │   ├── 📄 auth.api.js
│   │   ├── 📄 axiosInstance.js
│   │   ├── 📄 brands.api.js
│   │   ├── 📄 categories.api.js
│   │   ├── 📄 membership.api.js
│   │   ├── 📄 orders.api.js
│   │   ├── 📄 products.api.js
│   │   ├── 📄 search.api.js
│   │   └── 📄 users.api.js
│   ├── 📁 components
│   │   ├── 📄 Badge.jsx
│   │   ├── 📄 Layout.jsx
│   │   ├── 📄 Modal.jsx
│   │   ├── 📄 ProtectedRoute.jsx
│   │   ├── 📄 Sidebar.jsx
│   │   └── 📄 StatCard.jsx
│   ├── 📁 context
│   │   ├── 📄 AuthContext.jsx
│   │   └── 📄 ToastContext.jsx
│   ├── 📁 pages
│   │   ├── 📄 Brands.jsx
│   │   ├── 📄 Categories.jsx
│   │   ├── 📄 Dashboard.jsx
│   │   ├── 📄 Login.jsx
│   │   ├── 📄 Membership.jsx
│   │   ├── 📄 Orders.jsx
│   │   ├── 📄 Products.jsx
│   │   ├── 📄 Search.jsx
│   │   └── 📄 Users.jsx
│   ├── 📄 App.jsx
│   ├── 🎨 index.css
│   └── 📄 main.jsx
├── 📝 README.md
├── 🌐 index.html
├── 📄 eslint.config.js
├── 📄 postcss.config.js
├── 📄 tailwind.config.js
├── ⚙️ vercel.json
└── 📄 vite.config.js
```
 
---
 
## Deployment
 
### Backend → Render
Deployed on Render.com with the MySQL database hosted on Railway. CORS is configured in `app.js` to allow both the local dev server and the Vercel production URL.
 
### Frontend → Vercel
1. Push to GitHub
2. Import the repo in Vercel and set **Root Directory** to `FrontendExm`
3. Deploy — `vercel.json` handles SPA routing automatically
---
 
## AI Assistance
**Claude AI (Anthropic)** — used as a development assistant for code guidance, debugging, and explanations throughout parts of the project.
---

## Reflection repport nested in /REFS folder

![Reflection Repport](/REFS/Reflections_Repport_MG.pdf)
