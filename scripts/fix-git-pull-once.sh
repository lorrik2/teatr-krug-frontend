#!/bin/bash
# Однократный фикс — если git pull падает из-за strapi/.tmp/data.db
# Выполнить на VPS перед deploy-vps.sh. После успешного pull — можно удалить.

set -e
cd /var/www/teatr-krug-frontend

mkdir -p /tmp/teatr-backup
cp -a strapi/.tmp/data.db /tmp/teatr-backup/ 2>/dev/null || true

git checkout -- strapi/.strapi-updater.json strapi/.tmp/data.db
git pull

mkdir -p strapi/.tmp
cp -a /tmp/teatr-backup/data.db strapi/.tmp/data.db 2>/dev/null || true

echo "OK. Запустите: ./scripts/deploy-vps.sh"
