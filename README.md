## Introduction

FiveM Server Lookup is an open-source project that enriches publicly available FiveM server data with additional information. The platform provides details about servers, resources, and player counts, designed for server-interested players and server administrators. Our tool makes it easier to discover and explore FiveM servers with enhanced data presentation. Contributions are welcome to help improve the platform.

## Project Structure

- `app/` – Next.js application routes, API endpoints, and UI pages
    - `api/` – API route handlers (e.g., image proxy, search)
    - `lookup/` – Dynamic server lookup pages and actions
- `prisma/` – Prisma schema and database configuration
- `public/` – Static assets (e.g., images, SVGs)
- `src/` – Source code
    - `clients/` – API clients
    - `components/` – Reusable React components
        - `layout/` – Layout-related components (e.g., Container, Footer)
        - `search/` – Search UI components
        - `sections/` – Page sections (e.g., PlayerSection)
    - `constants/` – Constant values and configuration
    - `functions/` – Utility functions
    - `hooks/` – Custom React hooks
    - `types/` – TypeScript type definitions
- `tests/` – End-to-end and integration tests

## Used Technologies

- **Next.js** – React framework for server-side rendering and routing
- **React** – UI library for component development
- **Prisma** – ORM for database access
- **Tailwind CSS** – Utility-first CSS framework
- **Jest** – Testing framework for unit and integration tests
- **Playwright** – End-to-end testing framework
- **ESLint** – Linter for code quality

## Local Setup

### Requirements:
- NodeJS
- Docker

1. **Clone the repository**

```bash
git clone https://github.com/philipp08888/fivem-server-lookup.git
cd fivem-server-lookup
```

2. **Install dependencies**

```bash
npm install --legacy-peer-deps
```

3. **Set up environment variables & postgres db**

```bash
cp .env.example .env
docker compose up -d
```

4. **Generate Prisma Types**

```bash
npm run prisma:generate
```

5. **Push schema to db**

```bash
npm run prisma:db:push
```

6. **Start development server**

```bash
npm run dev
```

If everything worked, the app is available under http://localhost:3000