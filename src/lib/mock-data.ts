export interface Performance {
  id: string;
  title: string;
  slug: string;
  poster: string;
  date: string;
  time: string;
  ageRating: string;
  genre: string;
  description: string;
  duration?: string;
}

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
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
}

export const navLinks = [
  { href: "/afisha", label: "Афиша" },
  { href: "/o-teatre", label: "О театре" },
  { href: "/truppa", label: "Труппа" },
  { href: "/novosti", label: "Новости" },
  { href: "/kontakty", label: "Контакты" },
];

export const performances: Performance[] = [
  {
    id: "1",
    title: "Вишнёвый сад",
    slug: "vishnevyj-sad",
    poster: "/spect/bese.jpg",
    date: "15 февраля 2025",
    time: "19:00",
    ageRating: "12+",
    genre: "Драма",
    description: "Классическая постановка Чехова о уходящей эпохе.",
    duration: "2 ч 40 мин",
  },
  {
    id: "2",
    title: "Ревизор",
    slug: "revizor",
    poster: "/spect/hamlt.jpg",
    date: "22 февраля 2025",
    time: "18:30",
    ageRating: "12+",
    genre: "Комедия",
    description: "Гоголь в современном прочтении.",
    duration: "2 ч 20 мин",
  },
  {
    id: "3",
    title: "Чайка",
    slug: "chajka",
    poster: "/spect/idiot.jpg",
    date: "1 марта 2025",
    time: "19:00",
    ageRating: "16+",
    genre: "Драма",
    description: "Вечная пьеса о любви и творчестве.",
    duration: "3 ч",
  },
  {
    id: "4",
    title: "Три сестры",
    slug: "tri-sestry",
    poster: "/spect/kazn.jpg",
    date: "8 марта 2025",
    time: "19:00",
    ageRating: "12+",
    genre: "Драма",
    description: "Чехов. Мечты о Москве.",
    duration: "2 ч 50 мин",
  },
];

export const mainPremiere: Premiere = {
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
};

export const actors: Actor[] = [
  {
    id: "1",
    name: "Мария Светлова",
    slug: "mariya-svetlova",
    photo: "/acter/margo.jpg",
    role: "Актриса",
    rank: "Заслуженная артистка России",
    bio: "Окончила ГИТИС. В театре с 2010 года. Лауреат театральных премий.",
    roles: [
      "Раневская — «Вишнёвый сад»",
      "Маша — «Три сестры»",
      "Аркадина — «Чайка»",
    ],
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
    vk: "https://vk.com/theater",
    telegram: "https://t.me/theater",
    instagram: "https://instagram.com/theater",
  },
  workingHours: {
    boxOffice: "Ежедневно 11:00 — 19:00, в день спектакля до начала",
    admin: "Пн–Пт 10:00 — 18:00",
  },
  mapEmbed:
    "https://yandex.ru/map-widget/v1/?um=constructor%2Fplaceholder&lang=ru_RU",
};

export const heroSlides = [
  {
    id: "1",
    title: "Новый сезон",
    subtitle: "Премьеры и легендарные постановки",
    image: "/fon/4.jpg",
    cta: "Смотреть афишу",
  },
  {
    id: "2",
    title: "Премьера месяца",
    subtitle: "«Вишнёвый сад» — 15 февраля",
    image: "/fon/6.jpg",
    cta: "Купить билет",
  },
  {
    id: "3",
    title: "Легендарная постановка",
    subtitle: "«Ревизор» в новом прочтении",
    image: "/fon/7.jpg",
    cta: "Подробнее",
  },
];
