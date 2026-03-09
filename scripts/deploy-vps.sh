#!/bin/bash
# Деплой на VPS — запускать на сервере в /var/www/teatr-krug-frontend
set -e

cd /var/www/teatr-krug-frontend

echo "=== 1. Бэкап важных файлов ==="
mkdir -p /tmp/teatr-backup
cp -a strapi/.tmp/data.db /tmp/teatr-backup/ 2>/dev/null || true
cp -a strapi/.env /tmp/teatr-backup/strapi.env 2>/dev/null || true
echo "OK: data.db и .env в /tmp/teatr-backup/"

echo ""
echo "=== 2. Git pull ==="
# Сбрасываем локальные изменения в файлах Strapi, чтобы pull не конфликтовал
git checkout -- strapi/.strapi-updater.json strapi/.tmp/data.db 2>/dev/null || true
git pull
# Восстанавливаем production-базу после pull
mkdir -p strapi/.tmp
cp -a /tmp/teatr-backup/data.db strapi/.tmp/data.db 2>/dev/null || true

echo ""
echo "=== 2b. Русские метки Content Manager ==="
if [ -f strapi/.tmp/data.db ]; then
  cd strapi && yarn ru-labels && cd ..
else
  echo "Пропуск (нет data.db)"
fi

echo ""
echo "=== 3. Очистка кэша ==="
rm -rf .next strapi/.cache strapi/build
echo "OK"

echo ""
echo "=== 4. Установка зависимостей ==="
yarn install
cd strapi && yarn install && cd ..

echo ""
echo "=== 5. Сборка Strapi (с лимитом памяти) ==="
if [ "$SKIP_STRAPI_BUILD" = "1" ]; then
  echo "SKIP_STRAPI_BUILD=1 — пропуск (используйте предсобранный strapi/build)"
else
  # Проверка swap: при OOM (exit 137) на VPS с 1–2 GB RAM нужен swap
  SWAP_MB=$(free -m 2>/dev/null | awk '/Swap:/ {print $2}' || echo "0")
  if [ "$SWAP_MB" -lt 1024 ] 2>/dev/null; then
    echo "Внимание: swap < 1 GB. Сборка Strapi может упасть с OOM (137)."
    echo "Создать swap: sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile"
    echo "Или собрать локально и деплоить с SKIP_STRAPI_BUILD=1"
    echo ""
  fi
  cd strapi
  NODE_OPTIONS="--max-old-space-size=2048" yarn build
  cd ..
fi

echo ""
echo "=== 6. Сборка Next.js ==="
yarn build

echo ""
echo "=== 7. Перезапуск PM2 ==="
pm2 restart all

echo ""
echo "=== Deploy complete ==="
pm2 status
