# Пошаговый деплой: чистка кэша → пересборка → загрузка на VPS

## Шаг 1. Остановить процессы (если запущены)

```bash
# Остановите Next.js (Ctrl+C) и Strapi, если они работают локально
# На VPS — остановите через PM2/systemd/docker:
# pm2 stop all
# или systemctl stop teatr
```

---

## Шаг 2. Очистка кэша и артефактов

### 2.1. Next.js

```bash
# Удалить папку .next (полный кэш билда)
rm -rf .next

# Опционально: очистить кэш yarn/npm
yarn cache clean
```

### 2.2. Strapi

```bash
cd strapi
rm -rf .cache build
cd ..
```

### 2.3. node_modules (опционально, если есть странные баги)

```bash
# Полная переустановка зависимостей
rm -rf node_modules strapi/node_modules
yarn install
cd strapi && yarn install && cd ..
```

---

## Шаг 3. Проверить .env для production

### Next.js (в корне проекта)

```env
NEXT_PUBLIC_SITE_URL=https://teatr-krug-spb.ru
NEXT_PUBLIC_STRAPI_URL=https://api.teatr-krug-spb.ru
STRAPI_URL=https://api.teatr-krug-spb.ru
```

### Strapi (в strapi/)

- Убедитесь, что `strapi/.env` или `strapi/.env.production` содержит корректные URL, ключи и настройки базы для production.

---

## Шаг 4. Сборка

### 4.1. Strapi (сначала)

```bash
cd strapi
yarn build
cd ..
```

### 4.2. Next.js

```bash
yarn build
```

После сборки должны появиться:
- `strapi/build/` — собранный Strapi
- `.next/` — собранный Next.js
- `public/` — остаётся как есть (логотипы, шрифты и т.д.)

---

## Шаг 5. Проверка перед загрузкой

Убедитесь, что на сервере будут доступны:

| Путь | Описание |
|------|----------|
| `public/logo/logoNoLayout.png` | Логотип в шапке |
| `public/logo/logoLayout.png` | Логотип в футере и favicon |
| `public/fonts/` | Шрифты (если есть) |
| `.next/` | Собранное Next.js-приложение |
| `node_modules/` | Зависимости (или только production) |

---

## Шаг 6. Загрузка на VPS

Способ зависит от вашего деплоя. Основные варианты:

### A) Git push + билд на сервере

```bash
git add -A
git commit -m "Чистый билд, исправлены пути к логотипам"
git push origin main
```

На VPS:

```bash
cd /path/to/theater
git pull
yarn install --frozen-lockfile
yarn build
cd strapi && yarn build && cd ..
pm2 restart all   # или systemctl restart teatr
```

### B) Ручная загрузка (rsync / scp)

```bash
# Пример rsync (подставьте свой user@host и путь)
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ user@your-vps:/path/to/theater/
```

На VPS затем:

```bash
cd /path/to/theater
yarn install --production
yarn build
cd strapi && yarn build && cd ..
pm2 restart all
```

### C) Только артефакты (уже собранные локально)

```bash
# Загрузить .next, public, package.json и т.д.
rsync -avz .next public package.json next.config.js \
  user@your-vps:/path/to/theater/
# + node_modules на сервере или yarn install --production
```

---

## Шаг 7. Очистка кэша на VPS

### Nginx (если используете)

```bash
# Очистить кэш Nginx
sudo nginx -s reload
# или
sudo systemctl reload nginx
```

### PM2

```bash
pm2 restart all
pm2 flush   # очистить логи (опционально)
```

---

## Шаг 8. Очистка кэша в браузере

- Жёсткое обновление: `Ctrl+Shift+R` (Windows/Linux) или `Cmd+Shift+R` (macOS)
- Или DevTools → Network → "Disable cache" → обновить страницу
- Для проверки можно открыть сайт в режиме инкогнито

---

## Быстрые команды (всё в одном)

```bash
# Полная пересборка (из корня проекта)
rm -rf .next strapi/.cache strapi/build
cd strapi && yarn build && cd ..
yarn build
```

После этого — загрузка на VPS и перезапуск сервисов по вашему сценарию.
