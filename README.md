# Another Knowledge Base – backend

Backend-тестовое на NestJS + PostgreSQL.

## Быстрый старт

```bash
git clone <repo> && cd backend
cp .env.example .env
docker compose up --build    # API на http://localhost:3000

## Environment variables

Создайте файл `.env` (или используйте готовый `.env.example`) со значениями по умолчанию:

```env
NODE_ENV=development
PORT=3000

# PostgreSQL (из docker-compose)
DB_HOST=db
DB_PORT=5432
DB_USER=user
DB_PASS=pass
DB_NAME=mydb

# JWT
JWT_SECRET=supersecret
JWT_ACCESS_SECRET=superaccesssecret
JWT_REFRESH_SECRET=superrefreshsecret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d