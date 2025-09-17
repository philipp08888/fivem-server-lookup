---
applyTo: "**/*.ts,**/*.tsx"
---

# Project Overview

This project is a web application that allows users to see information about specific FiveM gameservers (e.g. players, resources).
It is built using Next.js, Prisma, TailwindCSS. The data is stored in a PostgreSQL database.

## Folder Structure

- `app/` – Contains Next.js application routes, API endpoints, and UI pages
- `prisma/` – Contains the prisma schema and database configuration
- `public/` – Contains static assets (e.g., images, SVGs)
- `src/` – Contains most of the source code for the backend and reusable frontend components.
- `tests/` - Contains all playwright e2e & jest unit tests

## Used Technologies
- Next.js – React framework for server-side rendering and routing
- React – UI library for component development
- Prisma – ORM for database access
- Tailwind CSS – Utility-first CSS framework
- Jest – Testing framework for unit and integration tests
- Playwright – End-to-end testing framework
- ESLint – Linter for code quality

## Coding Standards

- For backend functions, use the Result monad pattern from the `@philipp08888/utils` library for error handling
- Ensure that every core functionality is tested by a unit test.
- Use arrow functions for react components
- Use tailwindcss classes
- Leverage TypeScript's type system to prevent runtime errors through compile-time type checking
- Use meaningful variable and function names
- Prefer async/await over Promise chains
- Use TypeScript strict mode

## UI guidelines

- Use mobile-first approach when creating new components and layout structure
- Prefer semantic HTML elements
- Ensure accessibility with proper ARIA labels and keyboard navigation
