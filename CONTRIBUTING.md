# Contributing to Urban Cart

Thank you for contributing to Urban Cart.

## Before You Start

- Review the current project structure in `frontend/` and `backend/`
- Prefer incremental pull requests with one clear purpose
- Keep behavior aligned with the existing ecommerce workflows

## Setup

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create the backend environment file from `backend/src/config/.env.sample` before testing features that depend on MongoDB, Gemini, Razorpay, or SMTP.

## Development Guidelines

- Reuse existing folders and patterns before creating new ones
- Keep API responses clean and predictable
- Preserve responsive behavior across small, medium, and large screens
- Use professional, restrained UI styling that fits an ecommerce product
- Update documentation when features or setup steps change

## Validation Checklist

Before opening a pull request, run:

```bash
cd frontend
npm run lint
npm run build

cd ../backend
npm run check
```

## Pull Requests

Please include:

- A short summary of the change
- Screenshots for visible UI updates when relevant
- Notes about any required environment variables
- Testing steps used to verify the change

## Communication

For major changes, open an issue or discuss the approach before starting work.
