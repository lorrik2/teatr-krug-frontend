# Деплой на VPS (шаблон)

> Полная инструкция с путями и переменными хранится локально в `DEPLOY.md` (не в репо).  
> Здесь — общая схема для ориентира.

## Стек

- **Next.js** (порт 3000)
- **Strapi** (порт 1337)
- **Nginx** (reverse proxy + SSL)
- **PM2** (процессы)
- **SQLite** (база Strapi)

## Структура

| Что | Пример |
|-----|--------|
| Путь проекта | `/var/www/your-project` |
| Домен сайта | `your-domain.ru`, `www.your-domain.ru` |
| Домен API | `api.your-domain.ru` |
| PM2: Next.js | `nextjs` |
| PM2: Strapi | `strapi` |

## Переменные окружения

### Next.js (`.env.production`)

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.ru
NEXT_PUBLIC_STRAPI_URL=https://api.your-domain.ru
STRAPI_URL=https://api.your-domain.ru
```

### Strapi (`strapi/.env`)

```env
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
APP_KEYS=...
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
ENCRYPTION_KEY=...
```

Секреты генерировать:  
`node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

## Сборка Strapi (при нехватке RAM)

```bash
NODE_OPTIONS="--max-old-space-size=1536" yarn build
```

## Обновление (деплой)

```bash
git pull
yarn install
cd strapi && yarn install && NODE_OPTIONS="--max-old-space-size=1536" yarn build && cd ..
yarn build
pm2 restart all
```

## Сохранять при деплое

- `strapi/.tmp/data.db`
- `strapi/public/uploads/`
- `strapi/.env`
