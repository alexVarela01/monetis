# MONETIS

MONETIS is a dedicated testing playground for QA engineers and automation enthusiasts. It provides a safe and controlled environment to experiment with various testing tools, frameworks, and methodologies.

## Purpose

MONETIS is a purpose-built testing environment designed to help QA engineers and developers learn and practice automated testing techniques. The platform simulates a real-world banking system in a risk-free space for testing experiments.

All data within the application is fictional and created specifically for testing purposes. This allows users to freely experiment with different testing approaches without the risk of affecting real financial data.

## Features

- **API endpoints** for various testing scenarios.
- **Predictable test data** that resets periodically.
- **Common banking operations** for end-to-end testing.
- **Edge cases and error scenarios** for robust test coverage.
- **Prisma ORM** for database management.

## Getting Started

Follow these steps to set up MONETIS:

1. Clone the repository:
   ```sh
   git clone https://github.com/alexVarela01/monetis.git
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up your environment variables (see [Configuration](#configuration)).
4. Run database migrations:
   ```sh
   npx prisma migrate dev --name init
   ```
5. Start the application:
   ```sh
   npm run dev
   ```
6. Access the application in your browser at `http://localhost:3000`

## Configuration

To configure the application, create a `.env` file with the following variables:

### Database Configuration

- `DATABASE_URL` – Primary connection string for the database.
- `DATABASE_URL_UNPOOLED` – Non-pooled version of the database connection.
- `PGHOST` – Hostname or IP address of the PostgreSQL server.
- `PGHOST_UNPOOLED` – Non-pooled PostgreSQL host.
- `PGUSER` – Username for PostgreSQL authentication.
- `PGDATABASE` – Name of the PostgreSQL database.
- `PGPASSWORD` – Password for the PostgreSQL user.

### PostgreSQL Connection Variants

- `POSTGRES_URL` – Full PostgreSQL connection URL.
- `POSTGRES_URL_NON_POOLING` – Non-pooled PostgreSQL connection URL.
- `POSTGRES_USER` – PostgreSQL database username.
- `POSTGRES_HOST` – Hostname of the PostgreSQL server.
- `POSTGRES_PASSWORD` – PostgreSQL database password.
- `POSTGRES_DATABASE` – Name of the PostgreSQL database.
- `POSTGRES_URL_NO_SSL` – PostgreSQL connection URL without SSL.
- `POSTGRES_PRISMA_URL` – PostgreSQL connection string optimized for Prisma ORM.

### Security & API Configuration

- `JWT_SECRET` – Secret key for signing JSON Web Tokens (JWTs).
- `CRON_SECRET` – CRON key for authentication in vercel cron (used only for the cleanup process).

## Prisma

This project uses [Prisma](https://www.prisma.io/) as the ORM for database management.

## Contribution

We welcome contributions! Feel free to fork this repository, submit issues, or create pull requests to improve MONETIS.

## License

This project is open source and licensed under the MIT License.

You are free to use, modify, distribute, and sublicense this project under the terms of the MIT License.

For more details, see the [LICENSE](./LICENSE) file.

---

For more details or inquiries, please reach out to our team or check the official documentation.

