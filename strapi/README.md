# Strapi CMS для театра «Круг»

Headless CMS для управления контентом сайта театра.

## Требования

- Node.js 20+ (Strapi 5 не поддерживает Node 19 и ниже)
- Yarn

## Запуск

Strapi требует **Node.js 20**. Если используете nvm:

```bash
cd strapi && nvm use && yarn develop
```

Или из корня проекта:

```bash
yarn strapi
```

Если появится ошибка `better-sqlite3 was compiled against a different Node.js version` — переустановите зависимости под текущую Node:

```bash
cd strapi && rm -rf node_modules && yarn install
```

Админ-панель: http://localhost:1337/admin

При первом запуске создайте учётную запись администратора.

## Content Types

| Тип | API | Описание |
|-----|-----|----------|
| Спектакль | `/api/performances` | Спектакли с афишей, составом, расписанием |
| Актёр | `/api/actors` | Актеры и сотрудники театра |
| Новость / Событие | `/api/news-items` | Анонсы, рецензии, события |
| Слайд героя | `/api/hero-slides` | Слайды главного баннера |
| Контакты | `/api/contact` | Единая запись контактной информации |
| Доступная среда | `/api/dostupnaya-sreda` | Текст страницы для зрителей с ОВЗ (ФЗ № 181-ФЗ) |
| Отзыв о театре | `/api/theater-reviews` | Отзывы зрителей |

## Настройка прав доступа

Чтобы данные отображались на сайте, нужен доступ к API:

**Вариант A — Public (без токена):**
1. **Settings** → **Users & Permissions** → **Roles**
2. Выберите **Public**
3. В блоке **Actor** (Актёры) отметьте **find** и **findOne**
4. Аналогично для **Performance**, **News-item**, **Dostupnaya-sreda** (Доступная среда) и других типов
5. **Save**

**Вариант B — API Token (с STRAPI_API_TOKEN в .env):**
1. **Settings** → **API Tokens** → создайте или отредактируйте токен
2. В **Permissions** выберите **Content API** для нужных content types (Actor, Performance и т.д.)
3. Включите **find** и **findOne** для каждого типа

## Загрузка медиа

Медиафайлы хранятся в `strapi/public/uploads`. При использовании изображений из Strapi в Next.js они отдаются по URL `http://localhost:1337/uploads/...`. В `next.config.js` добавлен домен `localhost` для `next/image`.

## Подключение к Next.js

Next.js автоматически подключается к Strapi, когда он доступен на `http://localhost:1337`. Если Strapi не запущен или недоступен, сайт отображает пустые данные (пустые списки спектаклей, актёров и т.д.).

Переменные окружения (опционально):

- `STRAPI_URL` / `NEXT_PUBLIC_STRAPI_URL` — URL Strapi (по умолчанию `http://localhost:1337`)
- `STRAPI_API_TOKEN` — токен для защищённых API
