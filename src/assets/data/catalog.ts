import type { CatalogItem } from "@/types/catalog";

export const catalogItems: CatalogItem[] = [
  {
    id: "vareniki-syrom",
    name: "Вареники з сиром",
    description: "Ніжні вареники ручної ліпки з домашнім сиром та ваніллю.",
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fgalya-baluwana.lviv.ua%2Fwp-content%2Fuploads%2F2025%2F06%2Fframe-58.png&w=600&h=400&fit=cover&output=webp",
    url: "https://galya-baluwana.lviv.ua/product/vareniki-iz-tvorogom/",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    segment: "Заморожені напівфабрикати",
    availability: "in-stock",
    badge: "топ продаж",
    highlights: [
      "Ручна ліпка",
      "Сир від локального фермерського господарства",
      "Готові за 6 хвилин"
    ],
    servingTips: [
      "Подавайте зі сметаною або ягідним соусом",
      "Порадьте додати свіжу м'яту для аромату"
    ],
    pairingIdeas: ["Сметана", "Домашнє варення", "Лимонад"],
    objections: [
      {
        id: "price",
        question: "Чому така ціна?",
        answer: "Це ручна робота та фермерський сир. До того ж, вони дуже ситні — вистачить на 3 порції."
      },
      {
        id: "cooking",
        question: "Довго готувати?",
        answer: "Ні, просто закиньте у киплячу воду на 6 хвилин — і все готово."
      }
    ],
    allergens: ["молоко", "глютен"],
    storageNotes: "Зберігати при температурі -18°C до 6 місяців."
  },
  {
    id: "pelmeni-tri-myasa",
    name: "Пельмені \"Три м'яса\"",
    description: "Щільна фаршева начинка зі свинини, яловичини та індички.",
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fgalya-baluwana.lviv.ua%2Fwp-content%2Fuploads%2F2025%2F06%2Fdsc_0156-min.jpg.webp&w=600&h=400&fit=cover&output=webp",
    url: "https://galya-baluwana.lviv.ua/product/pelmeni-try-myasa/",
    segment: "Заморожені напівфабрикати",
    availability: "in-stock",
    badge: "міцна класика",
    highlights: [
      "М'ясо трьох видів",
      "Вакуумне пакування",
      "Без підсилювачів смаку"
    ],
    servingTips: [
      "Рекомендуйте підсмажити на вершковому маслі",
      "Подайте з соусом Солодкий Чилі для контрасту"
    ],
    pairingIdeas: ["Сметана", "Соус Солодкий Чилі"],
    objections: [
      {
        id: "fat",
        question: "Чи не занадто жирні?",
        answer: "Баланс трьох видів м'яса робить смак насиченим, але без надлишку жиру."
      },
      {
        id: "storage",
        question: "Скільки можна зберігати після відкриття?",
        answer: "У щільно закритому пакеті в морозильній камері — до 1 місяця."
      }
    ],
    allergens: ["глютен"],
    storageNotes: "Повторно запаюйте пакет або використовуйте кліпсу після відкриття."
  },
  {
    id: "syrnyky-rodzynky",
    name: "Сирники з родзинками",
    description: "Класичні сирники з карамелізованими родзинками та сметанковим соусом.",
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fgalya-baluwana.lviv.ua%2Fwp-content%2Fuploads%2F2025%2F06%2Fframe-80.png&w=600&h=400&fit=cover&output=webp",
    url: "https://galya-baluwana.lviv.ua/product/syrnyky-z-rodzynkamy/",
    segment: "Десерти",
    availability: "backorder",
    badge: "новинка",
    highlights: [
      "Родзинки у карамельній глазурі",
      "Запікаються у духовці або на сковороді",
      "Складаються лише з 6 інгредієнтів"
    ],
    servingTips: [
      "Порадьте підігріти у духовці 5 хвилин",
      "Додайте ягідний кюлі або згущене молоко"
    ],
    pairingIdeas: ["Американо", "Йогуртовий соус"],
    objections: [
      {
        id: "availability",
        question: "Чому не відразу?",
        answer: "Нова партія приїде сьогодні ввечері, можемо зарезервувати і нагадати у Telegram."
      }
    ],
    allergens: ["молоко", "яйця", "глютен"],
    storageNotes: "Зберігати охолодженими при +2…+6°C, спожити протягом 72 годин."
  },
  {
    id: "hachapuri",
    name: "Хачапурі з сиром",
    description: "Грузинська класика з розтопленим сиром сулугуні, подається гарячою.",
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fgalya-baluwana.lviv.ua%2Fwp-content%2Fuploads%2F2025%2F06%2Fkhachapuri-g8e3df0f8.jpg.webp&w=600&h=400&fit=cover&output=webp",
    url: "https://galya-baluwana.lviv.ua/product/hachapuri-z-syrom/",
    segment: "Випічка",
    availability: "in-stock",
    badge: "затишок",
    highlights: ["Сир сулугуні", "Вершкове тісто", "Ідеальна вага для перекусу"],
    servingTips: [
      "Порадьте прогріти 3 хв у аерогрилі",
      "Розкажіть про лайфхак з додаванням яйця зверху"
    ],
    pairingIdeas: ["Томатний суп", "Чай зі спеціями"],
    objections: [
      {
        id: "heating",
        question: "Як підігріти, щоб не пересушити?",
        answer: "Найкраще — 3 хвилини в аерогрилі або духовці при 180°C, тісто лишається м'яким."
      }
    ],
    allergens: ["молоко", "глютен"],
    storageNotes: "Зберігайте у холодильнику до 48 годин, перед вживанням підігрійте."
  },
  {
    id: "mlyntsi-banan",
    name: "Млинці з бананом",
    description: "Тонкі млинці з карамелізованим бананом та вершковим соусом.",
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fgalya-baluwana.lviv.ua%2Fwp-content%2Fuploads%2F2025%2F07%2F1-1.png&w=600&h=400&fit=cover&output=webp",
    url: "https://galya-baluwana.lviv.ua/product/mlynci-z-bananom-ta-zgushhenym-molokom/",
    segment: "Десерти",
    availability: "in-stock",
    badge: "солодкий хіт",
    highlights: ["Карамелізовані банани", "Зручна вага порції", "Без консервантів"],
    servingTips: [
      "Порадьте підсмажити на сухій сковороді 1 хвилину",
      "Додайте кульку морозива як апселл"
    ],
    pairingIdeas: ["Лате", "Морозиво ванільне"],
    objections: [
      {
        id: "sweet",
        question: "Чи не занадто солодкі?",
        answer: "Баланс банана і вершкового соусу, без доданого цукру — можна регулювати топінгом."
      }
    ],
    allergens: ["молоко", "яйця", "глютен"],
    storageNotes: "Зберігайте у холодильнику та спожийте протягом 48 годин."
  },
  {
    id: "borshch-zabiyaka",
    name: "Борщ \"Забіяка\"",
    description: "Домашній борщ з яловичиною, квасолею та запашною зеленню.",
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fgalya-baluwana.lviv.ua%2Fwp-content%2Fuploads%2F2025%2F07%2F67506892-1.jpg&w=600&h=400&fit=cover&output=webp",
    url: "https://galya-baluwana.lviv.ua/product/borshh-zabiyaka-460g/",
    segment: "Гарячі страви",
    availability: "in-stock",
    badge: "тепло",
    highlights: ["Великі шматочки м'яса", "Готується 5 хв на плиті", "Є вегетаріанська альтернатива"],
    servingTips: [
      "Рекомендуйте додати ложку сметани",
      "Запропонуйте пампушки з часником як допродаж"
    ],
    pairingIdeas: ["Пампушки", "Сметана"],
    objections: [
      {
        id: "portion",
        question: "Чи вистачить на сім'ю?",
        answer: "Порція 460 г — це щільний обід для однієї людини, для двох краще взяти 2 упаковки."
      }
    ],
    storageNotes: "Зберігати при +2…+6°C та спожити протягом 72 годин."
  },
  {
    id: "sous-chili",
    name: "Соус Солодкий Чилі",
    description: "Гастрономічний соус до м'яса та овочів, збалансований за гостротою.",
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fgalya-baluwana.lviv.ua%2Fwp-content%2Fuploads%2F2025%2F07%2F14373507.png&w=600&h=400&fit=cover&output=webp",
    url: "https://galya-baluwana.lviv.ua/product/sous-do-shashlyka-solodkyj-chyli-zabiyaka-200g/",
    segment: "Соуси",
    availability: "in-stock",
    badge: "соус дня",
    highlights: ["Баланс солодкого та гострого", "Зручна пляшка з дозатором", "Пасує до м'яса та сирів"],
    servingTips: [
      "Рекомендуйте як маринад до курки",
      "Порада: змішайте з соєвим соусом для азійського смаку"
    ],
    pairingIdeas: ["Пельмені", "Овочеві ролли"],
    objections: [
      {
        id: "spicy",
        question: "Наскільки гострий?",
        answer: "Легкий рівень гостроти — 3 з 10. Підійде навіть тим, хто не любить дуже гостре."
      }
    ],
    storageNotes: "Після відкриття зберігати у холодильнику та спожити за 30 днів."
  },
  {
    id: "pasha-domashniy",
    name: "Паштет по-домашньому",
    description: "Ніжний курячий паштет з вершковим маслом та пряними спеціями.",
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fgalya-baluwana.lviv.ua%2Fwp-content%2Fuploads%2F2025%2F07%2F15281596.png&w=600&h=400&fit=cover&output=webp",
    url: "https://galya-baluwana.lviv.ua/product/pashtet-po-domashnomu-zabiyaka-300g/",
    segment: "Делікатеси",
    availability: "backorder",
    badge: "обмежена партія",
    highlights: ["Готується малими партіями", "Без консервантів", "Високий вміст білка"],
    servingTips: [
      "Рекомендуйте подавати з багетом",
      "Запропонуйте як подарунковий набір з нашими соусами"
    ],
    pairingIdeas: ["Багет", "Мариновані огірочки"],
    objections: [
      {
        id: "availability",
        question: "Чому немає у наявності?",
        answer: "Це реміснича партія, наступна поставка — у п'ятницю. Можу оформити передзамовлення."
      }
    ],
    allergens: ["молоко"],
    storageNotes: "Зберігайте при +2…+6°C та спожийте протягом 5 днів після відкриття."
  }
];
