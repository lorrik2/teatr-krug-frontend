# Чистый деплой (полная пересборка)

Пошаговая инструкция для полной очистки кэша, пересборки и деплоя.

---

## Локально (на вашем Mac)

### 0. Проверить Node.js

```bash
node -v   # Нужно 18.18+, 19.8+ или 20+
# Если старее: nvm use 20 (или установите Node 20)
```

### 1. Очистить кэш

```bash
cd /Users/matthewkorolev/Desktop/theater
rm -rf .next strapi/.cache strapi/build
```

### 2. Переустановить зависимости (опционально, при странных багах)

```bash
rm -rf node_modules strapi/node_modules
yarn install
cd strapi && yarn install && cd ..
```

### 3. Собрать Strapi

```bash
cd strapi
yarn build
cd ..
```

### 4. Собрать Next.js

```bash
yarn build
```

### 5. Закоммитить и отправить

```bash
git add -A
git status
git commit -m "Clean rebuild"
git push
```

---

## На VPS

### 1. Подключиться по SSH

```bash
ssh root@ВАШ_IP
```

### 2. Бэкап (на всякий случай)

```bash
cp strapi/.tmp/data.db /root/backup-data.db 2>/dev/null
cp strapi/.env /root/backup-strapi.env 2>/dev/null
```

### 3. Выполнить деплой

```bash
cd /var/www/teatr-krug-frontend
chmod +x scripts/deploy-vps.sh
./scripts/deploy-vps.sh
```

Или вручную:

```bash
cd /var/www/teatr-krug-frontend
git pull
rm -rf .next strapi/.cache strapi/build
yarn install
cd strapi && yarn install && NODE_OPTIONS="--max-old-space-size=1536" yarn build && cd ..
yarn build
pm2 restart all
```

### 4. Проверить

```bash
pm2 status
pm2 logs nextjs --lines 10
pm2 logs strapi --lines 10
```

Открыть в браузере:
- https://teatr-krug-spb.ru
- https://api.teatr-krug-spb.ru/admin

### 5. Проверка после деплоя (лого, стили)

1. **Жёсткое обновление страницы**: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac) — сброс кэша.
2. **Логотип**: Должны отображаться логотипы в Header и Footer (`public/logo/logoNoLayout.png`, `logoLayout.png`).
3. **Стили**: Блоки с обводкой, кнопки, сетки — если сжаты или без стилей, проверить:
   - `git status` — нет ли незакоммиченных изменений?
   - `ls -la public/logo/` — файлы на месте?
   - `pm2 logs nextjs` — нет ли ошибок?

---

## Одной командой (локально)

```bash
./scripts/full-deploy.sh
```

## Одной командой (на VPS)

```bash
./scripts/deploy-vps.sh
```
