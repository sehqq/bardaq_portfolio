import type { CSSProperties } from 'react';

export interface CaseGalleryImage {
  src: string;
  nodeId: string;
  alt: string;
  aspectRatio: number;
  crop?: CSSProperties;
  featured?: boolean;
}

export interface CasePresentation {
  figmaNodeId: string;
  title: string;
  meta: string;
  description: string | null;
  layout: 'posters' | 'logos' | 'magazine' | 'label' | 'brand';
  images: CaseGalleryImage[];
}

// Original Figma assets and crop geometry; thumbnails and enlarged views share sources.
export const casePresentations: Record<string, CasePresentation> = {
  "posters": {
    "figmaNodeId": "122:46",
    "title": "“ПОСТЕРЫ\nи ПЛАКАТЫ”",
    "meta": "Графический дизайн / 2025–2026",
    "description": null,
    "layout": "posters",
    "images": [
      {
        "src": "/cases/posters/f21cb.png",
        "nodeId": "124:57",
        "aspectRatio": 0.720149,
        "crop": {
          "position": "absolute",
          "width": "100.03%",
          "height": "102.06%",
          "left": "-0.02%",
          "top": "0",
          "maxWidth": "none"
        },
        "alt": "Плакат 1"
      },
      {
        "src": "/cases/posters/6910f.png",
        "nodeId": "124:58",
        "aspectRatio": 0.723881,
        "crop": {
          "position": "absolute",
          "width": "100.03%",
          "height": "102.06%",
          "left": "-0.02%",
          "top": "-0.99%",
          "maxWidth": "none"
        },
        "alt": "Плакат 2"
      },
      {
        "src": "/cases/posters/e1ebb.png",
        "nodeId": "124:63",
        "aspectRatio": 0.722846,
        "crop": {
          "position": "absolute",
          "width": "100%",
          "height": "101.93%",
          "left": "0",
          "top": "-0.93%",
          "maxWidth": "none"
        },
        "alt": "Плакат 3"
      },
      {
        "src": "/cases/posters/dc1f1.png",
        "nodeId": "124:64",
        "aspectRatio": 0.764925,
        "alt": "Плакат 4"
      },
      {
        "src": "/cases/posters/975b9.png",
        "nodeId": "124:61",
        "aspectRatio": 0.876866,
        "alt": "Плакат 5"
      },
      {
        "src": "/cases/posters/cbd2b.png",
        "nodeId": "124:60",
        "aspectRatio": 0.720149,
        "crop": {
          "position": "absolute",
          "width": "100.03%",
          "height": "102.06%",
          "left": "-0.02%",
          "top": "-0.99%",
          "maxWidth": "none"
        },
        "alt": "Плакат 6"
      },
      {
        "src": "/cases/posters/683d3.png",
        "nodeId": "124:65",
        "aspectRatio": 0.723881,
        "alt": "Плакат 7"
      },
      {
        "src": "/cases/posters/1dde7.png",
        "nodeId": "124:59",
        "aspectRatio": 0.720149,
        "crop": {
          "position": "absolute",
          "width": "100.03%",
          "height": "102.06%",
          "left": "-0.02%",
          "top": "-0.99%",
          "maxWidth": "none"
        },
        "alt": "Плакат 8"
      },
      {
        "src": "/cases/posters/a5451.png",
        "nodeId": "124:62",
        "aspectRatio": 0.666667,
        "alt": "Плакат 9"
      }
    ]
  },
  "logos": {
    "figmaNodeId": "121:6",
    "title": "“ЛОГОТИПЫ”",
    "meta": "Графический дизайн / 2025–2026",
    "description": null,
    "layout": "logos",
    "images": [
      {
        "src": "/cases/logos/7d45f.png",
        "nodeId": "122:39",
        "aspectRatio": 1.043333,
        "alt": "Логотип 1"
      },
      {
        "src": "/cases/logos/af1ce.png",
        "nodeId": "122:41",
        "aspectRatio": 1,
        "alt": "Логотип 2"
      },
      {
        "src": "/cases/logos/f725c.png",
        "nodeId": "178:9",
        "aspectRatio": 1.09205,
        "alt": "Логотип 3"
      },
      {
        "src": "/cases/logos/60cba.png",
        "nodeId": "122:43",
        "aspectRatio": 1.294118,
        "crop": {
          "position": "absolute",
          "width": "167.21%",
          "height": "305.9%",
          "left": "-2.89%",
          "top": "-3.58%",
          "maxWidth": "none"
        },
        "alt": "Логотип 4"
      },
      {
        "src": "/cases/logos/f6cbd.png",
        "nodeId": "122:44",
        "aspectRatio": 1.313364,
        "crop": {
          "position": "absolute",
          "width": "165.3%",
          "height": "307.28%",
          "left": "-3.48%",
          "top": "-4.5%",
          "maxWidth": "none"
        },
        "alt": "Логотип 5"
      },
      {
        "src": "/cases/logos/d8f93.png",
        "nodeId": "122:40",
        "aspectRatio": 1.071698,
        "crop": {
          "position": "absolute",
          "width": "135.89%",
          "height": "133.56%",
          "left": "0",
          "top": "-20.29%",
          "maxWidth": "none"
        },
        "alt": "Логотип 6"
      }
    ]
  },
  "stud-vibe-1": {
    "figmaNodeId": "111:5",
    "title": "“СТУД.ВАЙБ”",
    "meta": "Полиграфия / 2026",
    "description": "СТУД.ВАЙБ — Студенческий журнал. Комплексный дизайн и верстка периодического издания для студенческого комьюнити. Визуальный стиль построен на динамичной журнальной сетке, смелой акцидентной типографике и живом фотоконтенте, отражающем ритм и культуру молодежи.",
    "layout": "magazine",
    "images": [
      {
        "src": "/cases/stud-vibe-1/d077f.png",
        "nodeId": "111:69",
        "aspectRatio": 0.70614,
        "alt": "СТУД.ВАЙБ 1 — страница 1"
      },
      {
        "src": "/cases/stud-vibe-1/d46f3.png",
        "nodeId": "111:70",
        "aspectRatio": 0.70614,
        "alt": "СТУД.ВАЙБ 1 — страница 2"
      },
      {
        "src": "/cases/stud-vibe-1/28f44.png",
        "nodeId": "111:71",
        "aspectRatio": 0.70614,
        "alt": "СТУД.ВАЙБ 1 — страница 3"
      },
      {
        "src": "/cases/stud-vibe-1/91a6f.png",
        "nodeId": "111:72",
        "aspectRatio": 0.70614,
        "alt": "СТУД.ВАЙБ 1 — страница 4"
      },
      {
        "src": "/cases/stud-vibe-1/156be.png",
        "nodeId": "111:73",
        "aspectRatio": 0.70614,
        "alt": "СТУД.ВАЙБ 1 — страница 5"
      },
      {
        "src": "/cases/stud-vibe-1/ab53e.png",
        "nodeId": "111:74",
        "aspectRatio": 0.70614,
        "alt": "СТУД.ВАЙБ 1 — страница 6"
      },
      {
        "src": "/cases/stud-vibe-1/1c7ff.png",
        "nodeId": "111:75",
        "aspectRatio": 0.70614,
        "alt": "СТУД.ВАЙБ 1 — страница 7"
      },
      {
        "src": "/cases/stud-vibe-1/b24f3.png",
        "nodeId": "111:76",
        "aspectRatio": 0.70614,
        "alt": "СТУД.ВАЙБ 1 — страница 8"
      },
      {
        "src": "/cases/stud-vibe-1/42efc.png",
        "nodeId": "111:77",
        "aspectRatio": 0.70614,
        "alt": "СТУД.ВАЙБ 1 — страница 9"
      },
      {
        "src": "/cases/stud-vibe-1/4f2b7.png",
        "nodeId": "111:78",
        "aspectRatio": 0.70614,
        "alt": "СТУД.ВАЙБ 1 — страница 10"
      },
      {
        "src": "/cases/stud-vibe-1/ce734.png",
        "nodeId": "111:79",
        "aspectRatio": 0.703057,
        "alt": "СТУД.ВАЙБ 1 — страница 11"
      }
    ]
  },
  "stud-vibe-2": {
    "figmaNodeId": "112:83",
    "title": "“СТУД.ВАЙБ”",
    "meta": "Полиграфия / 2026",
    "description": "СТУД.ВАЙБ — Студенческий журнал. Комплексный дизайн и верстка периодического издания для студенческого комьюнити. Визуальный стиль построен на динамичной журнальной сетке, смелой акцидентной типографике и живом фотоконтенте, отражающем ритм и культуру молодежи.",
    "layout": "magazine",
    "images": [
      {
        "src": "/cases/stud-vibe-2/48f71.png",
        "nodeId": "343:2",
        "aspectRatio": 0.707032,
        "alt": "СТУД.ВАЙБ 2 — страница 1"
      },
      {
        "src": "/cases/stud-vibe-2/4667e.png",
        "nodeId": "112:117",
        "aspectRatio": 0.707032,
        "alt": "СТУД.ВАЙБ 2 — страница 2"
      },
      {
        "src": "/cases/stud-vibe-2/cfe1e.png",
        "nodeId": "112:118",
        "aspectRatio": 0.707032,
        "alt": "СТУД.ВАЙБ 2 — страница 3"
      },
      {
        "src": "/cases/stud-vibe-2/354a0.png",
        "nodeId": "112:119",
        "aspectRatio": 0.707032,
        "alt": "СТУД.ВАЙБ 2 — страница 4"
      },
      {
        "src": "/cases/stud-vibe-2/25dce.png",
        "nodeId": "112:120",
        "aspectRatio": 0.707032,
        "alt": "СТУД.ВАЙБ 2 — страница 5"
      },
      {
        "src": "/cases/stud-vibe-2/90a6f.png",
        "nodeId": "112:121",
        "aspectRatio": 0.707032,
        "alt": "СТУД.ВАЙБ 2 — страница 6"
      },
      {
        "src": "/cases/stud-vibe-2/bc5ad.png",
        "nodeId": "112:122",
        "aspectRatio": 0.707032,
        "alt": "СТУД.ВАЙБ 2 — страница 7"
      },
      {
        "src": "/cases/stud-vibe-2/f35d6.png",
        "nodeId": "112:112",
        "aspectRatio": 0.707032,
        "alt": "СТУД.ВАЙБ 2 — страница 8"
      },
      {
        "src": "/cases/stud-vibe-2/10370.png",
        "nodeId": "112:113",
        "aspectRatio": 0.707032,
        "alt": "СТУД.ВАЙБ 2 — страница 9"
      },
      {
        "src": "/cases/stud-vibe-2/5aecd.png",
        "nodeId": "112:114",
        "aspectRatio": 0.707032,
        "alt": "СТУД.ВАЙБ 2 — страница 10"
      },
      {
        "src": "/cases/stud-vibe-2/537b0.png",
        "nodeId": "112:115",
        "aspectRatio": 0.707032,
        "alt": "СТУД.ВАЙБ 2 — страница 11"
      }
    ]
  },
  "404-concept": {
    "figmaNodeId": "107:8",
    "title": "“404”",
    "meta": "Брендинг / 2026",
    "description": "404 RECORDS — Комплексная айдентика и оформление виниловых релизов для независимого электронного лейбла. Концепция вдохновлена эстетикой цифровой ошибки «404 Not Found», переосмысленной через монохромный брутализм, сырую типографику и тёмный минимализм.",
    "layout": "label",
    "images": [
      {
        "src": "/cases/404-concept/303a0.png",
        "nodeId": "178:4",
        "aspectRatio": 1.776977,
        "alt": "Материал айдентики 1"
      },
      {
        "src": "/cases/404-concept/718f4.png",
        "nodeId": "178:5",
        "aspectRatio": 1.780822,
        "alt": "Материал айдентики 2"
      },
      {
        "src": "/cases/404-concept/993af.png",
        "nodeId": "178:8",
        "aspectRatio": 0.704174,
        "featured": true,
        "alt": "Материал айдентики 3"
      },
      {
        "src": "/cases/404-concept/7a67a.png",
        "nodeId": "178:2",
        "aspectRatio": 1.780822,
        "alt": "Материал айдентики 4"
      },
      {
        "src": "/cases/404-concept/8a42b.png",
        "nodeId": "178:6",
        "aspectRatio": 1.780822,
        "alt": "Материал айдентики 5"
      },
      {
        "src": "/cases/404-concept/98c7f.png",
        "nodeId": "178:3",
        "aspectRatio": 1.780822,
        "alt": "Материал айдентики 6"
      },
      {
        "src": "/cases/404-concept/285c1.png",
        "nodeId": "178:7",
        "aspectRatio": 1.776977,
        "alt": "Материал айдентики 7"
      }
    ]
  },
  "pixult": {
    "figmaNodeId": "101:230",
    "title": "PIXULT",
    "meta": "Брендинг / 2025",
    "description": "PIXULT — Комплексный брендинг и оформление пространства для современного киберспортивного лаунжа. Айдентика построена на эстетике пиксельной графики нового поколения, неоновом контрасте и минималистичной технологичной типографике.",
    "layout": "brand",
    "images": [
      {
        "src": "/cases/pixult/64a9b.png",
        "nodeId": "101:302",
        "aspectRatio": 0.706714,
        "alt": "Материал айдентики 1"
      },
      {
        "src": "/cases/pixult/fdb4e.png",
        "nodeId": "101:312",
        "aspectRatio": 0.706714,
        "crop": {
          "position": "absolute",
          "width": "102.56%",
          "height": "103.7%",
          "left": "-2.56%",
          "top": "-0.03%",
          "maxWidth": "none"
        },
        "alt": "Материал айдентики 2"
      },
      {
        "src": "/cases/pixult/7ba2f.png",
        "nodeId": "101:314",
        "aspectRatio": 0.706714,
        "alt": "Материал айдентики 3"
      },
      {
        "src": "/cases/pixult/4f904.png",
        "nodeId": "101:324",
        "aspectRatio": 0.706714,
        "alt": "Материал айдентики 4"
      },
      {
        "src": "/cases/pixult/e915e.png",
        "nodeId": "107:2",
        "aspectRatio": 0.706714,
        "alt": "Материал айдентики 5"
      },
      {
        "src": "/cases/pixult/f7365.png",
        "nodeId": "101:327",
        "aspectRatio": 0.792829,
        "alt": "Материал айдентики 6"
      },
      {
        "src": "/cases/pixult/a9ef7.png",
        "nodeId": "101:329",
        "aspectRatio": 0.796813,
        "alt": "Материал айдентики 7"
      },
      {
        "src": "/cases/pixult/fcd86.png",
        "nodeId": "101:331",
        "aspectRatio": 0.8,
        "crop": {
          "position": "absolute",
          "width": "144.53%",
          "height": "100%",
          "left": "-21.67%",
          "top": "0",
          "maxWidth": "none"
        },
        "alt": "Материал айдентики 8"
      },
      {
        "src": "/cases/pixult/0f9a5.png",
        "nodeId": "101:333",
        "aspectRatio": 0.799073,
        "crop": {
          "position": "absolute",
          "width": "145.61%",
          "height": "103.07%",
          "left": "-21.76%",
          "top": "-3.07%",
          "maxWidth": "none"
        },
        "alt": "Материал айдентики 9"
      },
      {
        "src": "/cases/pixult/41c13.png",
        "nodeId": "107:5",
        "aspectRatio": 0.708,
        "crop": {
          "position": "absolute",
          "width": "115.67%",
          "height": "122.4%",
          "left": "-6.49%",
          "top": "-4.78%",
          "maxWidth": "none"
        },
        "alt": "Материал айдентики 10"
      }
    ]
  },
};
