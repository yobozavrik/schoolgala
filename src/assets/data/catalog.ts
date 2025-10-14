import type { CatalogItem } from "@/types/catalog";

const arModel = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

export const catalogItems: CatalogItem[] = [
  {
    id: "vareniki-syrom",
    name: "Вареники з сиром",
    description: "Ніжні вареники ручної ліпки з домашнім сиром та ваніллю.",
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fgalya-baluwana.lviv.ua%2Fwp-content%2Fuploads%2F2025%2F06%2Fframe-58.png&w=600&h=400&fit=cover&output=webp",
    url: "https://galya-baluwana.lviv.ua/product/vareniki-iz-tvorogom/",
    videoUrl: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    availability: [
      { location: "Львів — ТРЦ Forum", stock: 18 },
      { location: "Київ — Троєщина", stock: 12, replenishmentEta: "сьогодні 16:00" },
      { location: "Одеса — Аркадія", stock: 4, replenishmentEta: "завтра 10:30" },
    ],
    crossSellIds: ["sous-chili", "pasha-domashniy"],
    instructions: [
      {
        id: "vareniki-video",
        title: "Вареники з сиром: відео-приготування",
        type: "video",
        description: "Покроковий гайд для демонстрації клієнту просто біля вітрини.",
        source: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
        thumbnail:
          "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        id: "vareniki-ar",
        title: "AR-сервірування",
        type: "ar",
        description: "Доповнена реальність показує готову страву на столі клієнта.",
        source: arModel,
      },
    ],
  },
  {
    id: "pelmeni-tri-myasa",
    name: "Пельмені \"Три м'яса\"",
    description: "Щільна фаршева начинка зі свинини, яловичини та індички.",
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fgalya-baluwana.lviv.ua%2Fwp-content%2Fuploads%2F2025%2F06%2Fdsc_0156-min.jpg.webp&w=600&h=400&fit=cover&output=webp",
    url: "https://galya-baluwana.lviv.ua/product/pelmeni-try-myasa/",
    availability: [
      { location: "Львів — King Cross", stock: 22 },
      { location: "Київ — Лівобережна", stock: 5, replenishmentEta: "завтра 09:00" },
      { location: "Дніпро — Слобожанський", stock: 17 },
    ],
    crossSellIds: ["sous-chili", "borshch-zabiyaka"],
    instructions: [
      {
        id: "pelmeni-video",
        title: "Техніка варіння пельменів",
        type: "video",
        source: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
      },
      {
        id: "pelmeni-ar",
        title: "AR-викладка на тарілці",
        type: "ar",
        description: "Покажіть клієнту ідеальну подачу з соусами.",
        source: arModel,
      },
    ],
  },
  {
    id: "syrnyky-rodzynky",
    name: "Сирники з родзинками",
    description: "Класичні сирники з карамелізованими родзинками та сметанковим соусом.",
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fgalya-baluwana.lviv.ua%2Fwp-content%2Fuploads%2F2025%2F06%2Fframe-80.png&w=600&h=400&fit=cover&output=webp",
    url: "https://galya-baluwana.lviv.ua/product/syrnyky-z-rodzynkamy/",
    availability: [
      { location: "Львів — Ринок Південний", stock: 9, replenishmentEta: "завтра 12:00" },
      { location: "Київ — Dream Town", stock: 14 },
      { location: "Чернівці — Центр", stock: 7 },
    ],
    crossSellIds: ["mlyntsi-banan", "sous-chili"],
    instructions: [
      {
        id: "syrnyky-video",
        title: "Сирники: карамелізація родзинок",
        type: "video",
        description: "Пояснення технік, щоб клієнт оцінив гастрономію бренду.",
        source: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
      },
      {
        id: "syrnyky-ar",
        title: "AR-тарілка десерту",
        type: "ar",
        source: arModel,
      },
    ],
  },
  {
    id: "hachapuri",
    name: "Хачапурі з сиром",
    description: "Грузинська класика з розтопленим сиром сулугуні, подається гарячою.",
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fgalya-baluwana.lviv.ua%2Fwp-content%2Fuploads%2F2025%2F06%2Fkhachapuri-g8e3df0f8.jpg.webp&w=600&h=400&fit=cover&output=webp",
    url: "https://galya-baluwana.lviv.ua/product/hachapuri-z-syrom/",
    availability: [
      { location: "Львів — ТЦ Victoria Gardens", stock: 2, replenishmentEta: "сьогодні 18:30" },
      { location: "Київ — Ocean Plaza", stock: 6 },
      { location: "Івано-Франківськ — Центр", stock: 10 },
    ],
    crossSellIds: ["sous-chili", "pasha-domashniy"],
    instructions: [
      {
        id: "hachapuri-video",
        title: "Хачапурі: розтягування тіста",
        type: "video",
        source: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
      },
      {
        id: "hachapuri-ar",
        title: "AR-подача з соусами",
        type: "ar",
        source: arModel,
      },
    ],
  },
  {
    id: "mlyntsi-banan",
    name: "Млинці з бананом",
    description: "Тонкі млинці з карамелізованим бананом та вершковим соусом.",
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fgalya-baluwana.lviv.ua%2Fwp-content%2Fuploads%2F2025%2F07%2F1-1.png&w=600&h=400&fit=cover&output=webp",
    url: "https://galya-baluwana.lviv.ua/product/mlynci-z-bananom-ta-zgushhenym-molokom/",
    availability: [
      { location: "Львів — Привокзальний", stock: 8 },
      { location: "Київ — River Mall", stock: 11 },
      { location: "Харків — French Blvd", stock: 5, replenishmentEta: "післязавтра 09:30" },
    ],
    crossSellIds: ["syrnyky-rodzynky", "sous-chili"],
    instructions: [
      {
        id: "mlyntsi-video",
        title: "Млинці: карамелізація банану",
        type: "video",
        source: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
      },
      {
        id: "mlyntsi-ar",
        title: "AR-десерт",
        type: "ar",
        description: "Демонстрація десерту в натуральну величину.",
        source: arModel,
      },
    ],
  },
  {
    id: "borshch-zabiyaka",
    name: "Борщ \"Забіяка\"",
    description: "Домашній борщ з яловичиною, квасолею та запашною зеленню.",
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fgalya-baluwana.lviv.ua%2Fwp-content%2Fuploads%2F2025%2F07%2F67506892-1.jpg&w=600&h=400&fit=cover&output=webp",
    url: "https://galya-baluwana.lviv.ua/product/borshh-zabiyaka-460g/",
    availability: [
      { location: "Львів — Привокзальний", stock: 15 },
      { location: "Київ — Оболонь", stock: 3, replenishmentEta: "сьогодні 20:00" },
      { location: "Одеса — Таїрова", stock: 6 },
    ],
    crossSellIds: ["sous-chili", "pasha-domashniy"],
    instructions: [
      {
        id: "borshch-video",
        title: "Борщ: сервірування",
        type: "video",
        source: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
      },
      {
        id: "borshch-ar",
        title: "AR-подання",
        type: "ar",
        source: arModel,
      },
    ],
  },
  {
    id: "sous-chili",
    name: "Соус Солодкий Чилі",
    description: "Гастрономічний соус до м'яса та овочів, збалансований за гостротою.",
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fgalya-baluwana.lviv.ua%2Fwp-content%2Fuploads%2F2025%2F07%2F14373507.png&w=600&h=400&fit=cover&output=webp",
    url: "https://galya-baluwana.lviv.ua/product/sous-do-shashlyka-solodkyj-chyli-zabiyaka-200g/",
    availability: [
      { location: "Львів — King Cross", stock: 30 },
      { location: "Київ — River Mall", stock: 26 },
      { location: "Харків — French Blvd", stock: 19 },
    ],
    crossSellIds: ["pelmeni-tri-myasa", "hachapuri"],
    instructions: [
      {
        id: "sous-video",
        title: "Соус: дегустаційна подача",
        type: "video",
        source: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
      },
      {
        id: "sous-ar",
        title: "AR-презентація",
        type: "ar",
        source: arModel,
      },
    ],
  },
  {
    id: "pasha-domashniy",
    name: "Паштет по-домашньому",
    description: "Ніжний курячий паштет з вершковим маслом та пряними спеціями.",
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fgalya-baluwana.lviv.ua%2Fwp-content%2Fuploads%2F2025%2F07%2F15281596.png&w=600&h=400&fit=cover&output=webp",
    url: "https://galya-baluwana.lviv.ua/product/pashtet-po-domashnomu-zabiyaka-300g/",
    availability: [
      { location: "Львів — ТРЦ Forum", stock: 11 },
      { location: "Київ — Ocean Plaza", stock: 9, replenishmentEta: "завтра 11:00" },
      { location: "Дніпро — Слобожанський", stock: 13 },
    ],
    crossSellIds: ["sous-chili", "vareniki-syrom"],
    instructions: [
      {
        id: "pasha-video",
        title: "Паштет: сервірування на дегустацію",
        type: "video",
        source: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
      },
      {
        id: "pasha-ar",
        title: "AR-бутерброд",
        type: "ar",
        source: arModel,
      },
    ],
  },
];
