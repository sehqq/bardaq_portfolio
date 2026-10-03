import pixultImg from '../assets/images/figma-pixult.png';
import logosImg from '../assets/images/figma-logotypes.png';
import postersImg from '../assets/images/figma-posters.png';
import error404Img from '../assets/images/figma-404.png';
import studVibe1Img from '../assets/images/figma-stud-vibe-1.png';
import studVibe2Img from '../assets/images/figma-stud-vibe-2.png';

export interface CaseItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  image: string;
  description: string;
  tags: string[];
  deliverables: string[];
}

export const casesData: CaseItem[] = [
  {
    id: 'pixult',
    title: 'PIXULT',
    subtitle: 'Айдентика и цифровая дизайн-система',
    category: 'Brand Identity / Web System',
    year: '2024',
    image: pixultImg,
    description:
      'Комплексная разработка визуальной идентичности для цифровой платформы. Акцент на строгую модульную сетку, контрастную типографику и технологичный характер графики, работающей как в диджитал-среде, так и в мерче.',
    tags: ['Айдентика', 'Веб-дизайн', 'UI Kit', 'Типографика'],
    deliverables: ['Логотип и знак', 'Гайдлайн по стилю', 'UI Компоненты', 'Мерч'],
  },
  {
    id: 'logos',
    title: 'Logotypes',
    subtitle: 'Исследование формы и метафоры',
    category: 'Logotypes / Monograms',
    year: '2024',
    image: logosImg,
    description:
      'Серия авторских логотипов и знаков для технологических стартапов, медиа и культурных инициатив. Каждый знак построен на чистой геометрии и глубокой ассоциативной связи с продуктом.',
    tags: ['Логотипы', 'Геометрия', 'Символика', 'Вектор'],
    deliverables: ['12 уникальных знаков', 'Векторные сетки', 'Правила охранного поля'],
  },
  {
    id: 'posters',
    title: 'POSTERS EXPLORATION',
    subtitle: 'Серия типографических плакатов',
    category: 'Print / Typography',
    year: '2023-2024',
    image: postersImg,
    description:
      'Экспериментальная серия швейцарской и бруталистской типографики. Исследование пределов читаемости, акциденции, текстур и ритма крупных текстовых массивов.',
    tags: ['Постеры', 'Швейцарский стиль', 'Акциденция', 'Print'],
    deliverables: ['Серия 8 плакатов', 'Макеты для печати', 'Мокапы оформления'],
  },
  {
    id: '404-concept',
    title: 'Music label "404"',
    subtitle: 'Интерактивный опыт страницы ошибки',
    category: 'Creative Web / UX',
    year: '2024',
    image: error404Img,
    description:
      'Креативная концепция страницы 404 с кинетической типографикой и игровым микро-интерактивом, превращающая тупиковый сценарий пользователя в запоминающийся контакт с брендом.',
    tags: ['UX/UI', 'Микро-анимации', '3D графика', 'Креатив'],
    deliverables: ['Интерактивный прототип', 'Анимационные ассеты', 'Код страницы'],
  },
  {
    id: 'stud-vibe-1',
    title: 'СТУД.ВАЙБ 1 Выпуск',
    subtitle: 'Айдентика фестиваля и мерч',
    category: 'Event Identity / Merch',
    year: '2024',
    image: studVibe1Img,
    description:
      'Визуальная концепция масштабного молодежного и студенческого события. Смелый визуальный язык, динамичные паттерны и гибкая модульная система для digital-промо и физических носителей.',
    tags: ['Фестиваль', 'Мерч', 'Брендинг', 'Полиграфия'],
    deliverables: ['Кейвижуал', 'Мерч (худи, стикерпаки)', 'Наружная реклама'],
  },
  {
    id: 'stud-vibe-2',
    title: 'СТУД.ВАЙБ 2 Выпуск',
    subtitle: 'Digital-кампания и медиа-кит',
    category: 'Social Media / Campaign',
    year: '2024',
    image: studVibe2Img,
    description:
      'Вторая итерация коммуникационного языка: шаблоны для соцсетей, анимированные сторис, баннеры для соцсетей и промо-страницы регистрации участников фестиваля.',
    tags: ['SMM', 'Motion', 'Digital Ads', 'Design System'],
    deliverables: ['Шаблоны соцсетей', 'Motion-баннеры', 'Лендинг мероприятия'],
  },
];
