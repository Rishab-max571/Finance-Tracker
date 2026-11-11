# Personal Finance Tracker

A full-stack finance tracker: React + Tailwind frontend, Flask + SQLAlchemy backend.

```
project/
├── backend/     Flask API (SQLite locally, PostgreSQL in prod)
└── frontend/    React (Vite) + Tailwind CSS
```

## 1. Run the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Runs on **http://localhost:5000**. A `finance.db` SQLite file is created automatically on first run — nothing to configure.

## 2. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Runs on **http://localhost:5173** and proxies `/api/*` calls to the Flask server.

## 3. Try it

1. Open http://localhost:5173, click **Register**, create an account.
2. Add a few income/expense transactions.
3. Check the **Dashboard** for balance, income, expenses and a pie chart.
4. Set category limits on the **Budget** page.

## API endpoints

```
POST   /api/register
POST   /api/login
GET    /api/me

GET    /api/dashboard

GET    /api/transactions        ?category=&type=&start=&end=&search=
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id

GET    /api/budgets             ?month=YYYY-MM
POST   /api/budgets
DELETE /api/budgets/:id
```

All routes except `/register` and `/login` require `Authorization: Bearer <token>`.

## Switching to PostgreSQL for deployment

Set an environment variable before starting the backend:

```bash
export DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

## Deploying

- **Frontend** → Vercel or Netlify (`npm run build`, publish `frontend/dist`)
- **Backend** → Render or Railway (`gunicorn app:app`), set `DATABASE_URL`, `SECRET_KEY`, `JWT_SECRET_KEY`, `CORS_ORIGINS` env vars
- **Database** → Managed PostgreSQL (Render, Railway, Neon, Supabase, etc.)

## What's implemented

- Register / login with hashed passwords and JWT auth
- Dashboard: balance, income, expenses, savings, expense-by-category pie chart
- Transactions: add, edit, delete, search by description
- Budgets: monthly per-category limits with spend progress bars
- Responsive layout, clean Tailwind styling

## Ideas for phase 5+ (not yet built)

- Date-range filtering UI, CSV export, recurring expenses, dark mode toggle — the API already supports `start`/`end` query params for transactions, so the filtering UI is the main remaining piece.
