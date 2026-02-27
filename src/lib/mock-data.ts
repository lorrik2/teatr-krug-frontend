export interface CastMember {
  name: string;
  role: string;
  /** slug актёра из команды — для фото */
  actorSlug?: string;
}

export interface Performance {
  id: string;
  title: string;
  slug: string;
  poster: string;
  /** Галерея фото для карусели на странице спектакля (если не задано — используется poster) */
  gallery?: string[];
  /** Подзаголовок: «спектакль X по пьесе Y. редакция Z | 18+» */
  subtitle?: string;
  /** Драматург / автор пьесы */
  author?: string;
  /** Режиссёр-постановщик */
  director?: string;
  /** Цитата режиссёра о спектакле */
  directorQuote?: string;
  /** Художник-постановщик */
  designer?: string;
  /** Художник по свету */
  lightingDesigner?: string;
  /** Звукорежиссёр */
  soundDesigner?: string;
  /** Свето-звуко оператор */
  lightSoundOperator?: string;
  /** Актёры и роли */
  cast?: CastMember[];
  /** Отзывы о спектакле */
  reviews?: Review[];
  /** URL тизера/трейлера (youtube, vimeo и т.п.) */
  teaserUrl?: string;
  date: string;
  time: string;
  ageRating: string;
  genre: string;
  description: string;
  duration?: string;
  /** Количество антрактов */
  intermissions?: number;
  isPremiere?: boolean;
  /** Есть ли спектакль в афише (продажа билетов) */
  inAfisha?: boolean;
  /** Даты и время показов в сезоне (если несколько — одна строка на каждую) */
  schedule?: { date: string; time: string }[];
  /** Награды и дипломы спектакля */
  awards?: { title: string; year?: string }[];
  /** Участие в конкурсах и фестивалях */
  festivals?: { title: string; year?: string; place?: string }[];
  /** Ссылка на покупку билетов (настраивается в CMS для каждого спектакля) */
  ticketsUrl?: string;
}

/** URL по умолчанию для покупки билетов (афиша на quicktickets.ru) */
export const DEFAULT_TICKETS_URL = "https://quicktickets.ru/spb-teatr-krug/s44";

export interface Premiere {
  id: string;
  title: string;
  slug: string;
  poster: string;
  videoUrl?: string;
  description: string;
  director: string;
  cast: string[];
  date: string;
  time: string;
}

export interface Actor {
  id: string;
  name: string;
  slug: string;
  photo: string;
  role: string;
  rank?: string;
  bio: string;
  roles: string[];
  /** Галерея фото — при отсутствии используется [photo] */
  gallery?: string[];
  /** Ссылка на страницу «Ещё один театр» (для Маргариты Вафиной) */
  theaterPage?: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Полный текст (из Strapi) */
  content?: string;
  image: string;
  date: string;
  category: string;
}

export interface Review {
  id: string;
  quote: string;
  author: string;
  /** Ссылка на отзыв во ВКонтакте */
  vkUrl?: string;
}

/** Пункт меню — ссылка или группа с подпунктами */
export type NavItem =
  | { href: string; label: string }
  | { label: string; items: { href: string; label: string }[] };

/** Меню с группами и выпадающими списками */
export const navItems: NavItem[] = [
  {
    label: "Спектакли",
    items: [
      { href: "/afisha", label: "Афиша" },
      { href: "/repertuar", label: "Репертуар" },
    ],
  },
  {
    label: "О нас",
    items: [
      { href: "/o-teatre", label: "О театре: история, ценности" },
      { href: "/team", label: "Команда" },
      { href: "/o-teatre/fotogalereya", label: "Фотогалерея" },
      { href: "/sobytiya", label: "События" },
      { href: "/kontakty", label: "Контакты" },
    ],
  },
  {
    label: "Сотрудничество",
    items: [
      { href: "/arenda-zala", label: "Аренда зала" },
      { href: "/pomoch-teatru", label: "Помочь театру" },
    ],
  },
  {
    href: "/teatr-teos",
    label: "Театр ТеОс",
  },
];

/** Плоский список ссылок (для Footer, breadcrumbs и т.д.) */
export const navLinks = navItems.flatMap((item) =>
  "items" in item ? item.items : [{ href: item.href, label: item.label }]
);

export const performances: Performance[] = [
  {
    id: "1",
    title: "Вишнёвый сад",
    slug: "vishnevyj-sad",
    poster: "/spect/bese.jpg",
    gallery: [
      "/spect/bese.jpg",
      "/fon/6.jpg",
      "/fon/7.jpg",
      "/fon/1.jpg",
      "/fon/2.jpg",
      "/fon/3.jpg",
      "/fon/4.jpg",
      "/fon/8.jpg",
      "/fon/12.jpg",
      "/fon/13.jpg",
    ],
    subtitle:
      "спектакль андрея волкова по пьесе антона чехова. новая редакция 2025 года | 12+",
    author: "Антон Чехов",
    director: "Андрей Волков",
    designer: "Мария Иванова",
    lightingDesigner: "Олег Светлов",
    soundDesigner: "Ирина Звукова",
    lightSoundOperator: "Алексей Петров",
    cast: [
      {
        name: "Мария Светлова",
        role: "Раневская",
        actorSlug: "mariya-svetlova",
      },
      { name: "Дмитрий Козлов", role: "Лопахин", actorSlug: "dmitrij-kozlov" },
      { name: "Елена Новикова", role: "Варя", actorSlug: "elena-novikova" },
      { name: "Игорь Белов", role: "Гаев" },
      { name: "Ольга Морозова", role: "Аня" },
    ],
    reviews: [
      {
        id: "p1",
        quote:
          "Спектакль «Вишнёвый сад» — это что-то потрясающее! Какие красивые актрисы, это первое, что покоряет с первых минут! Далее, необычность самой постановки, трогательность чувств просто… В самое сердце!! Сегодня я, кажется, по-настоящему полюбила ТЕАТР!",
        author: "Л. Зотикова",
        vkUrl: "https://vk.com/wall123456789_123",
      },
      {
        id: "p2",
        quote:
          "Ощущение, будто искупалась в океане загадочных и ранимых женских душ. Молчание — в нём столько смысла, молчание — это порой единственный выход. В этих женщинах я узнаю себя.",
        author: "О. Обойшева",
        vkUrl: "https://vk.com/wall123456789_456",
      },
    ],
    teaserUrl:
      "https://vk.com/video_ext.php?oid=-20088533&id=456239156&hash=94f0bbe1c794819d",
    date: "15 февраля 2025",
    time: "19:00",
    ageRating: "12+",
    genre: "Драма",
    description:
      "Классическая постановка Чехова о уходящей эпохе. Символ уходящего мира и надежда на новый. Без париков и бутафории — с живыми эмоциями и актуальными смыслами.",
    directorQuote:
      "В «Вишнёвом саду» очень важно показать грань между уходящим миром и надеждой. Без париков и бутафории — с живыми эмоциями и актуальными смыслами.",
    duration: "2 ч 40 мин",
    intermissions: 1,
    isPremiere: true,
    inAfisha: true,
    schedule: [
      { date: "15 февраля 2025", time: "19:00" },
      { date: "22 февраля 2025", time: "19:00" },
      { date: "8 марта 2025", time: "18:00" },
    ],
    awards: [
      {
        title:
          "Лауреат премии «Золотая маска» в номинации «Лучший спектакль малой формы»",
        year: "2024",
      },
      { title: "Гран-при фестиваля «Реальный театр»", year: "2023" },
      {
        title:
          "Диплом «Лучшая режиссёрская работа» на фестивале «Мартовские коты»",
        year: "2023",
      },
    ],
    festivals: [
      {
        title: "Международный театральный фестиваль «Реальный театр»",
        year: "2023",
        place: "Екатеринбург",
      },
      { title: "Фестиваль «Чеховская осень»", year: "2023", place: "Ялта" },
      {
        title: "Фестиваль «Мартовские коты»",
        year: "2023",
        place: "Санкт-Петербург",
      },
      { title: "Конкурс «Золотая маска»", year: "2024", place: "Москва" },
    ],
  },
  {
    id: "2",
    title: "Ревизор",
    slug: "revizor",
    poster: "/spect/hamlt.jpg",
    gallery: ["/spect/hamlt.jpg", "/fon/4.jpg", "/fon/1.jpg"],
    subtitle:
      "спектакль андрея волкова по пьесе николая гоголя. современное прочтение | 12+",
    author: "Николай Гоголь",
    director: "Андрей Волков",
    designer: "Мария Иванова",
    cast: [
      {
        name: "Дмитрий Козлов",
        role: "Хлестаков",
        actorSlug: "dmitrij-kozlov",
      },
      {
        name: "Елена Новикова",
        role: "Анна Андреевна",
        actorSlug: "elena-novikova",
      },
      { name: "Игорь Белов", role: "Городничий" },
      {
        name: "Мария Светлова",
        role: "Марья Антоновна",
        actorSlug: "mariya-svetlova",
      },
    ],
    date: "22 февраля 2025",
    time: "18:30",
    ageRating: "12+",
    genre: "Комедия",
    description:
      "Гоголь в современном прочтении. Острые характеры, актуальные темы взяточничества и самообмана. Классика звучит по-новому.",
    duration: "2 ч 20 мин",
    intermissions: 1,
    lightSoundOperator: "Алексей Петров",
    isPremiere: true,
    inAfisha: true,
    schedule: [
      { date: "22 февраля 2025", time: "18:30" },
      { date: "15 марта 2025", time: "19:00" },
    ],
    awards: [
      {
        title: "Приз зрительских симпатий фестиваля «Гоголь в городе»",
        year: "2024",
      },
    ],
    festivals: [
      { title: "Фестиваль «Гоголь в городе»", year: "2024", place: "Москва" },
      {
        title: "Фестиваль «Современная комедия»",
        year: "2023",
        place: "Краснодар",
      },
    ],
  },
  {
    id: "3",
    title: "Чайка",
    slug: "chajka",
    poster: "/spect/idiot.jpg",
    gallery: ["/spect/idiot.jpg", "/fon/2.jpg", "/fon/3.jpg"],
    subtitle: "спектакль андрея волкова по пьесе антона чехова | 16+",
    author: "Антон Чехов",
    director: "Андрей Волков",
    cast: [
      {
        name: "Мария Светлова",
        role: "Аркадина",
        actorSlug: "mariya-svetlova",
      },
      { name: "Дмитрий Козлов", role: "Треплёв", actorSlug: "dmitrij-kozlov" },
      { name: "Елена Новикова", role: "Маша", actorSlug: "elena-novikova" },
      { name: "Ольга Морозова", role: "Нина" },
    ],
    date: "1 марта 2025",
    time: "19:00",
    ageRating: "16+",
    genre: "Драма",
    description:
      "Вечная пьеса о любви и творчестве. Премьера сезона с новым актёрским составом и обновлённой сценографией.",
    duration: "3 ч",
    intermissions: 2,
    lightSoundOperator: "Алексей Петров",
    isPremiere: true,
    inAfisha: true,
    schedule: [{ date: "1 марта 2025", time: "19:00" }],
  },
  {
    id: "4",
    title: "Три сестры",
    slug: "tri-sestry",
    poster: "/spect/kazn.jpg",
    gallery: ["/spect/kazn.jpg", "/fon/8.jpg", "/fon/67.jpg"],
    subtitle: "спектакль андрея волкова по пьесе антона чехова | 12+",
    author: "Антон Чехов",
    director: "Андрей Волков",
    cast: [
      { name: "Мария Светлова", role: "Маша", actorSlug: "mariya-svetlova" },
      { name: "Елена Новикова", role: "Ольга", actorSlug: "elena-novikova" },
      { name: "Ольга Морозова", role: "Ирина" },
    ],
    date: "8 марта 2025",
    time: "19:00",
    ageRating: "12+",
    genre: "Драма",
    description:
      "Чехов. Мечты о Москве. Три сестры — три судьбы, связанные общей надеждой.",
    duration: "2 ч 50 мин",
    intermissions: 1,
    lightSoundOperator: "Алексей Петров",
    inAfisha: true,
    schedule: [
      { date: "8 марта 2025", time: "19:00" },
      { date: "22 марта 2025", time: "18:30" },
    ],
  },
];

/** Полный репертуар театра — все спектакли (включая те, что сейчас не идут) */
export const repertoirePerformances: Performance[] = [
  ...performances,
  {
    id: "5",
    title: "Идиот",
    slug: "idiot",
    poster: "/spect/idiot.jpg",
    gallery: ["/spect/idiot.jpg", "/fon/2.jpg"],
    subtitle: "спектакль андрея волкова по роману фёдора достоевского | 16+",
    author: "Фёдор Достоевский",
    director: "Андрей Волков",
    date: "—",
    time: "—",
    ageRating: "16+",
    genre: "Драма",
    description:
      "Достоевский. История князя Мышкина — «идиота», чья доброта и честность сталкиваются с жестоким миром.",
    duration: "3 ч 10 мин",
    intermissions: 2,
    lightSoundOperator: "Алексей Петров",
    inAfisha: false,
  },
  {
    id: "6",
    title: "Бесы",
    slug: "besy",
    poster: "/spect/bese.jpg",
    gallery: ["/spect/bese.jpg", "/fon/14.jpg", "/fon/13.jpg"],
    subtitle: "спектакль андрея волкова по роману фёдора достоевского | 18+",
    author: "Фёдор Достоевский",
    director: "Андрей Волков",
    date: "—",
    time: "—",
    ageRating: "18+",
    genre: "Драма",
    description:
      "Достоевский. Роман о революционных идеях и человеческой природе.",
    duration: "2 ч 55 мин",
    intermissions: 1,
    lightSoundOperator: "Алексей Петров",
    inAfisha: false,
  },
];

export const premieres: Premiere[] = [
  {
    id: "prem1",
    title: "Вишнёвый сад",
    slug: "vishnevyj-sad",
    poster: "/spect/bese.jpg",
    description:
      "Премьера сезона — «Вишнёвый сад» в постановке главного режиссёра театра. Современный взгляд на классику: без париков и бутафории, с живыми эмоциями и актуальными смыслами. Символ уходящего мира и надежда на новый.",
    director: "Андрей Волков",
    cast: [
      "Мария Светлова",
      "Дмитрий Козлов",
      "Елена Новикова",
      "Игорь Белов",
      "Ольга Морозова",
    ],
    date: "15 февраля 2025",
    time: "19:00",
  },
  {
    id: "prem2",
    title: "Ревизор",
    slug: "revizor",
    poster: "/spect/hamlt.jpg",
    description:
      "Премьера — «Ревизор» в современном прочтении. Острые характеры, актуальные темы взяточничества и самообмана. Классика Гоголя звучит по-новому.",
    director: "Андрей Волков",
    cast: ["Дмитрий Козлов", "Елена Новикова", "Игорь Белов", "Мария Светлова"],
    date: "22 февраля 2025",
    time: "18:30",
  },
  {
    id: "prem3",
    title: "Чайка",
    slug: "chajka",
    poster: "/spect/idiot.jpg",
    description:
      "Вечная пьеса о любви и творчестве. Премьера сезона — «Чайка» с новым актёрским составом и обновлённой сценографией.",
    director: "Андрей Волков",
    cast: [
      "Мария Светлова",
      "Дмитрий Козлов",
      "Елена Новикова",
      "Ольга Морозова",
    ],
    date: "1 марта 2025",
    time: "19:00",
  },
];

export const actors: Actor[] = [
  {
    id: "1",
    name: "Мария Светлова",
    slug: "mariya-svetlova",
    photo: "/acter/margo.jpg",
    role: "Актриса",
    rank: "Заслуженная артистка России",
    bio: `Окончила Российский институт театрального искусства (ГИТИС), мастерская народного артиста России Олега Кудряшова. В театре «Круг» с 2010 года.

Мария пришла в театр после успешных студенческих спектаклей и сразу заняла ведущее место в труппе. Её Раневская в «Вишнёвом саде» была отмечена критиками как «одна из самых пронзительных интерпретаций последнего десятилетия» — без пафоса и бутафории, с живыми эмоциями и острым ощущением уходящего времени.

Специализация — чеховские персонажи и роли «с характером»: от Аркадиной в «Чайке» до Маши в «Трёх сёстрах». Работает с режиссёрами Андреем Волковым и приглашёнными постановщиками. Участвовала в гастролях театра в Санкт-Петербурге, Казани и Екатеринбурге.

Лауреат премии «Золотая маска» в номинации «Лучшая женская роль» (2018), обладательница приза «Звезда театрала» за роль Раневской. Ведёт мастер-классы по актёрскому мастерству для студентов театральных вузов.`,
    roles: [
      "Раневская — «Вишнёвый сад»",
      "Маша — «Три сестры»",
      "Аркадина — «Чайка»",
    ],
    gallery: ["/acter/margo.jpg", "/fon/1.jpg", "/fon/2.jpg"],
  },
  {
    id: "2",
    name: "Дмитрий Козлов",
    slug: "dmitrij-kozlov",
    photo: "/acter/jora.jpg",
    role: "Актер",
    rank: "Народный артист России",
    bio: "Выпускник Щукинского училища. На сцене более 25 лет.",
    roles: [
      "Лопахин — «Вишнёвый сад»",
      "Хлестаков — «Ревизор»",
      "Треплёв — «Чайка»",
    ],
    gallery: ["/acter/jora.jpg", "/fon/3.jpg", "/fon/4.jpg"],
  },
  {
    id: "3",
    name: "Елена Новикова",
    slug: "elena-novikova",
    photo: "/acter/kata.jpg",
    role: "Актриса",
    bio: "В труппе с 2015 года. Специализация — комедийные и характерные роли.",
    roles: ["Варя — «Вишнёвый сад»", "Анна Андреевна — «Ревизор»"],
  },
  {
    id: "4",
    name: "Андрей Волков",
    slug: "andrey-volkov",
    photo: "/acter/nika.jpg",
    role: "Режиссёр-постановщик",
    rank: "Художественный руководитель",
    bio: "Главный режиссёр театра с 2012 года. Постановки в России и за рубежом.",
    roles: ["«Вишнёвый сад»", "«Ревизор»", "«Чайка»"],
  },
  {
    id: "5",
    name: "Маргарита Вафина",
    slug: "margarita-vafina",
    photo: "/acter/margo.jpg",
    role: "Актриса, режиссёр",
    bio: "Маргарита Вафина — актриса и режиссёр. Основательница театрального проекта «Театр ТЕОС».",
    roles: [],
    theaterPage: "/teatr-teos",
  },
];

/** Отзывы о спектаклях (для страниц спектаклей) */
export const performanceReviews: Review[] = [
  {
    id: "p1",
    quote:
      "Спектакль «Вишнёвый сад» — это что-то потрясающее! Какие красивые актрисы, это первое, что покоряет с первых минут! Далее, необычность самой постановки, трогательность чувств просто… В самое сердце!! Сегодня я, кажется, по-настоящему полюбила ТЕАТР!",
    author: "Л. Зотикова",
    vkUrl: "https://vk.com/wall123456789_123",
  },
  {
    id: "p2",
    quote:
      "Ощущение, будто искупалась в океане загадочных и ранимых женских душ. Молчание — в нём столько смысла, молчание — это порой единственный выход. В этих женщинах я узнаю себя.",
    author: "О. Обойшева",
    vkUrl: "https://vk.com/wall123456789_456",
  },
];

/** Отзывы о театре (для главной страницы) */
export const theaterReviews: Review[] = [
  {
    id: "t1",
    quote:
      "Уютный камерный театр с особой атмосферой. Каждый раз прихожу сюда с радостью — здесь чувствуется живой театр, искренность и профессионализм. Очень приятная касса и зал.",
    author: "Л. Зотикова",
    vkUrl: "https://vk.com/wall123456789_111",
  },
  {
    id: "t2",
    quote:
      "Театр «Круг» — моё любимое место в городе. Небольшой зал, близость к сцене, настоящие эмоции. После спектаклей всегда хочется вернуться.",
    author: "О. Обойшева",
    vkUrl: "https://vk.com/wall123456789_222",
  },
  {
    id: "t3",
    quote:
      "Открыла для себя этот театр недавно и уже успела побывать на нескольких постановках. Атмосфера душевная, труппа сильная, репертуар интересный. Рекомендую всем любителям драматического театра.",
    author: "Е. Сууронен",
    vkUrl: "https://vk.com/wall123456789_333",
  },
  {
    id: "t4",
    quote:
      "Небольшой, но очень душевный театр. Чувствуется, что здесь работают люди, влюблённые в своё дело. Удобное расположение, всегда приветливый персонал.",
    author: "С. Рошиор",
    vkUrl: "https://vk.com/wall123456789_444",
  },
];

export const newsItems: NewsItem[] = [
  {
    id: "1",
    slug: "creative-evening",
    title: "Творческий вечер: встреча с труппой «Вишнёвого сада»",
    excerpt:
      "25 февраля приглашаем на встречу с актёрами и режиссёром после спектакля.",
    image: "/fon/1.jpg",
    date: "10 февраля 2025",
    category: "Анонс",
  },
  {
    id: "2",
    slug: "review-vishnevyj-sad",
    title: "Рецензия: «Вишнёвый сад» — грусть и надежда",
    excerpt: "Критики о премьере сезона: современный Чехов без потери глубины.",
    image: "/fon/2.jpg",
    date: "8 февраля 2025",
    category: "Рецензия",
  },
  {
    id: "3",
    slug: "excursion-theater",
    title: "Экскурсия по театру: закулисье и история здания",
    excerpt: "Каждую субботу — экскурсии по зданию театра и гримёрным.",
    image: "/fon/3.jpg",
    date: "5 февраля 2025",
    category: "Анонс",
  },
];

export const contactInfo = {
  address: "Санкт-Петербург, метро Волковская, Касимовская, 5",
  boxOffice: "+7 921 64 59 200",
  admin: "+7 921 64 59 200",
  press: "+7 921 64 59 200",
  emailBoxOffice: "kassa@theater.ru",
  emailAdmin: "info@theater.ru",
  emailPress: "press@theater.ru",
  social: {
    vk: "https://vk.com/teatr_krug",
    telegram: "https://t.me/teatr_krug",
    instagram: "https://instagram.com/theater",
  },
  workingHours: {
    boxOffice: "Ежедневно 11:00 — 19:00, в день спектакля до начала",
    admin: "Пн–Пт 10:00 — 18:00",
  },
  mapEmbed:
    "https://yandex.ru/map-widget/v1/?um=constructor%2Fplaceholder&lang=ru_RU",
  howToGetThere:
    "Метро «Волковская». Театр находится в 5 минутах от метро Волковская, в бизнес-центре. Вход — с торца здания, большая стеклянная дверь. За ней пункт охраны. Поднимитесь на лифте на 4 этаж, пройдите по коридору направо.",
};

export const heroSlides = [
  {
    id: "1",
    title: "Новый сезон",
    subtitle: "Премьеры и легендарные постановки",
    image: "/fon/4.jpg",
    cta: "Смотреть афишу",
    ctaHref: "/afisha",
  },
  {
    id: "2",
    title: "Премьера месяца",
    subtitle: "«Вишнёвый сад» — 15 февраля",
    image: "/fon/6.jpg",
    cta: "Купить билет",
    ctaHref: DEFAULT_TICKETS_URL,
  },
  {
    id: "3",
    title: "Легендарная постановка",
    subtitle: "«Ревизор» в новом прочтении",
    image: "/fon/7.jpg",
    cta: "Подробнее",
    ctaHref: "/afisha",
  },
];
