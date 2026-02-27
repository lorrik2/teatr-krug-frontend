/**
 * Скрипт обновления метаданных полей Content Manager на русские названия.
 * Запуск: node scripts/ru-labels.js (из папки strapi)
 *
 * Использует встроенный sqlite3 (без native modules).
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', '.tmp', 'data.db');

const CONTENT_TYPE_LABELS = {
  'api::actor.actor': {
    name: 'Имя',
    slug: 'URL (слаг)',
    photo: 'Фото',
    role: 'Роль',
    rank: 'Должность',
    bio: 'О себе',
    roles: 'Роли',
    gallery: 'Галерея',
    theaterPage: 'Страница театра ТЕОС',
  },
  'api::contact.contact': {
    address: 'Адрес',
    boxOffice: 'Касса',
    admin: 'Администрация',
    press: 'Пресс-служба',
    emailBoxOffice: 'Email кассы',
    emailAdmin: 'Email администрации',
    emailPress: 'Email пресс-службы',
    socialVk: 'ВКонтакте',
    socialTelegram: 'Telegram',
    socialInstagram: 'Instagram',
    workingHoursBoxOffice: 'Часы работы кассы',
    workingHoursAdmin: 'Часы работы администрации',
    mapEmbed: 'Код карты',
    howToGetThere: 'Как добраться',
  },
  'api::hero-slide.hero-slide': {
    title: 'Заголовок',
    subtitle: 'Подзаголовок',
    image: 'Изображение',
    cta: 'Текст кнопки',
    ctaHref: 'Ссылка кнопки',
    order: 'Порядок',
  },
  'api::news-item.news-item': {
    slug: 'URL (слаг)',
    title: 'Заголовок',
    excerpt: 'Краткое описание',
    image: 'Изображение',
    date: 'Дата',
    category: 'Категория',
    content: 'Полный текст',
  },
  'api::performance.performance': {
    title: 'Название',
    slug: 'URL (слаг)',
    poster: 'Постер',
    gallery: 'Галерея',
    subtitle: 'Подзаголовок',
    author: 'Автор',
    director: 'Режиссёр',
    directorQuote: 'Цитата режиссёра',
    designer: 'Художник',
    lightingDesigner: 'Художник по свету',
    soundDesigner: 'Звукорежиссёр',
    lightSoundOperator: 'Свето-звукооператор',
    cast: 'Актёрский состав',
    reviews: 'Отзывы',
    teaserUrl: 'Ссылка на трейлер',
    date: 'Дата',
    time: 'Время',
    ageRating: 'Возрастной рейтинг',
    genre: 'Жанр',
    description: 'Описание',
    duration: 'Продолжительность',
    intermissions: 'Количество антрактов',
    isPremiere: 'Премьера',
    inAfisha: 'В афише',
    schedule: 'Расписание',
    awards: 'Награды',
    festivals: 'Фестивали',
    ticketsUrl: 'Ссылка на билеты',
  },
  'api::theater-gallery.theater-gallery': {
    image: 'Изображение',
    alt: 'Подпись (для доступности)',
    order: 'Порядок',
  },
  'api::theater-review.theater-review': {
    quote: 'Цитата',
    author: 'Автор',
    vkUrl: 'Ссылка ВКонтакте',
    order: 'Порядок',
  },
};

const COMPONENT_LABELS = {
  'shared.role-item': { text: 'Текст роли' },
  'shared.cast-member': { name: 'Имя', role: 'Роль', actor: 'Ссылка на актёра' },
  'shared.schedule-item': { date: 'Дата', time: 'Время' },
  'shared.review': { quote: 'Цитата', author: 'Автор', vkUrl: 'Ссылка ВКонтакте' },
  'shared.award': { title: 'Название', year: 'Год' },
  'shared.festival': { title: 'Название', year: 'Год', place: 'Место' },
};

function applyLabels(metadatas, labels) {
  const result = JSON.parse(JSON.stringify(metadatas));
  for (const [attr, ruLabel] of Object.entries(labels)) {
    if (result[attr]) {
      if (result[attr].edit) result[attr].edit.label = ruLabel;
      if (result[attr].list) result[attr].list.label = ruLabel;
    }
  }
  return result;
}

function sqlEscape(s) {
  return s.replace(/'/g, "''");
}

function runSql(dbPath, sql) {
  const tmpFile = path.join(__dirname, '..', '.tmp', `ru-labels-${Date.now()}.sql`);
  fs.mkdirSync(path.dirname(tmpFile), { recursive: true });
  fs.writeFileSync(tmpFile, sql, 'utf8');
  try {
    execSync(`sqlite3 "${dbPath}" < "${tmpFile}"`, { encoding: 'utf8' });
  } finally {
    fs.unlinkSync(tmpFile);
  }
}

function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error('База данных не найдена:', DB_PATH);
    console.error('Сначала запустите Strapi (yarn develop).');
    process.exit(1);
  }

  const keys = execSync(
    `sqlite3 "${DB_PATH}" "SELECT key FROM strapi_core_store_settings WHERE key LIKE 'plugin_content_manager_configuration%'"`,
    { encoding: 'utf8' }
  )
    .trim()
    .split('\n')
    .filter(Boolean);

  let updated = 0;

  for (const key of keys) {
    let labels = null;
    if (key.startsWith('plugin_content_manager_configuration_content_types::api::')) {
      const uid = key.replace('plugin_content_manager_configuration_content_types::', '');
      labels = CONTENT_TYPE_LABELS[uid];
    } else if (key.startsWith('plugin_content_manager_configuration_components::shared.')) {
      const uid = key.replace('plugin_content_manager_configuration_components::', '');
      labels = COMPONENT_LABELS[uid];
    }

    if (!labels) continue;

    const value = execSync(
      `sqlite3 "${DB_PATH}" "SELECT value FROM strapi_core_store_settings WHERE key='${sqlEscape(key)}'"`,
      { encoding: 'utf8' }
    ).trim();

    let config;
    try {
      config = JSON.parse(value);
    } catch {
      continue;
    }

    if (config.metadatas) {
      config.metadatas = applyLabels(config.metadatas, labels);
      const newValue = sqlEscape(JSON.stringify(config));
      const escapedKey = sqlEscape(key);
      const sql = `UPDATE strapi_core_store_settings SET value='${newValue}' WHERE key='${escapedKey}';\n`;
      runSql(DB_PATH, sql);
      updated++;
      console.log('Обновлено:', key.replace('plugin_content_manager_configuration_content_types::', '').replace('plugin_content_manager_configuration_components::', ''));
    }
  }

  console.log(`\nГотово. Обновлено записей: ${updated}`);
  console.log('Перезапустите Strapi (yarn develop), чтобы увидеть изменения.');
}

main();
