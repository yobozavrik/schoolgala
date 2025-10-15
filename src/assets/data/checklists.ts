import type { Checklist } from "@/types/checklist";

export const checklists: Checklist[] = [
  {
    id: "morning-shift",
    title: "Ранкова зміна",
    description: "Підготовка точки перед відкриттям",
    items: [
      { id: "uniform", text: "Перевірити форму та бейдж" },
      { id: "fridge", text: "Провести експрес-інвентаризацію вітрини" },
      { id: "degustation", text: "Підготувати дегустаційний сет" },
      { id: "cash", text: "Звірити касу та дрібні купюри" },
    ],
  },
  {
    id: "closing",
    title: "Закриття точки",
    description: "Процедури завершення робочого дня",
    items: [
      { id: "clean", text: "Прибрати стіл та обладнання" },
      { id: "report", text: "Надіслати звіт у чат зміни" },
      { id: "writeoff", text: "Зробити фото списань" },
      { id: "security", text: "Замкнути холодильники та сигналізацію" },
    ],
  },
];
