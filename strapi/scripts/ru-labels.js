/**
 * Скрипт обновления метаданных полей Content Manager на русские названия.
 * Запуск: node scripts/ru-labels.js (из папки strapi)
 *
 * Использует better-sqlite3 (уже в зависимостях Strapi), без внешнего sqlite3.
 */

const Database = require('better-sqlite3');
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
    footerTagline: 'Слоган в подвале',
    footerContactsTitle: 'Заголовок контактов в подвале',
    footerCopyright: 'Авторские права (без года)',
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
    heroSlider: 'Слайдер наверху',
    gallery: 'Фотогалерея',
    subtitle: 'Подзаголовок',
    author: 'Автор',
    director: 'Режиссёр',
    directorQuote: 'Цитата режиссёра',
    designer: 'Художник',
    lightingDesigner: 'Художник по свету',
    soundDesigner: 'Звукорежиссёр',
    lightSoundOperator: 'Свето-звукооператор',
    invitedCast: 'Внешний состав (приглашённые)',
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
  'api::teatr-teos.teatr-teos': {
    title: 'Заголовок',
    lead: 'Подзаголовок',
    aboutText: 'О театре',
    logo: 'Логотип театра',
    address: 'Адрес',
    howToGetThere: 'Как добраться',
    phone: 'Телефон',
    socialVk: 'ВКонтакте',
    socialTelegram: 'Telegram',
    partnerBlockText: 'Текст блока «Спектакли и билеты»',
    partnerBlockLink: 'Ссылка на сайт партнёра',
    partnerBlockButtonLabel: 'Текст кнопки перехода',
  },
  'api::arenda-zala.arenda-zala': {
    title: 'Заголовок',
    lead: 'Подзаголовок',
    conditionsText: 'Условия аренды',
    gallery: 'Фотогалерея',
    howToBookText: 'Как забронировать',
  },
  'api::pomoch-teatru.pomoch-teatru': {
    title: 'Заголовок',
    lead: 'Подзаголовок',
    requisitesText: 'Реквизиты',
    qrCodeImage: 'QR-код',
  },
  'api::partners.partners': {
    title: 'Заголовок',
    introText: 'Вступительный текст',
    partners: 'Партнёры',
  },
  'api::o-teatre.o-teatre': {
    title: 'Заголовок',
    lead: 'Подзаголовок',
    historyText: 'История',
    missionText: 'Миссия',
    gallery: 'Галерея',
  },
};

const COMPONENT_LABELS = {
  'shared.role-item': { text: 'Текст роли', performance: 'Спектакль' },
  'shared.cast-member': { name: 'Имя', role: 'Роль', photo: 'Фото' },
  'shared.schedule-item': { date: 'Дата', time: 'Время' },
  'shared.review': { quote: 'Цитата', author: 'Автор', vkUrl: 'Ссылка ВКонтакте' },
  'shared.award': { title: 'Название', year: 'Год' },
  'shared.festival': { title: 'Название', year: 'Год', place: 'Место' },
  'shared.partner-item': { name: 'Название', logo: 'Логотип', url: 'Ссылка' },
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

function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error('База данных не найдена:', DB_PATH);
    console.error('Сначала запустите Strapi (yarn develop).');
    process.exit(1);
  }

  const db = new Database(DB_PATH, { readonly: false });
  const selectKeys = db.prepare(
    "SELECT key FROM strapi_core_store_settings WHERE key LIKE 'plugin_content_manager_configuration%'"
  );
  const selectValue = db.prepare('SELECT value FROM strapi_core_store_settings WHERE key = ?');
  const updateValue = db.prepare('UPDATE strapi_core_store_settings SET value = ? WHERE key = ?');

  const rows = selectKeys.all();
  const keys = rows.map((r) => r.key);
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

    const row = selectValue.get(key);
    if (!row) continue;

    let config;
    try {
      config = JSON.parse(row.value);
    } catch {
      continue;
    }

    if (config.metadatas) {
      config.metadatas = applyLabels(config.metadatas, labels);
      const newValue = JSON.stringify(config);
      updateValue.run(newValue, key);
      updated++;
      console.log('Обновлено:', key.replace('plugin_content_manager_configuration_content_types::', '').replace('plugin_content_manager_configuration_components::', ''));
    }
  }

  db.close();
  console.log(`\nГотово. Обновлено записей: ${updated}`);
  console.log('Перезапустите Strapi (yarn develop), чтобы увидеть изменения.');
}

main();
