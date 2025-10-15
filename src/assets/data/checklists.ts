import type { Checklist } from "@/types/checklist";

export const checklists: Checklist[] = [
  {
    id: "morning-shift",
    title: "Ранкова зміна",
    description: "Підготовка точки перед відкриттям",
    lastCompletedAt: "2024-07-08T07:15:00+03:00",
    reminderMinutes: 720,
    nextDueAt: "2024-07-09T07:00:00+03:00",
    items: [
      { id: "uniform", text: "Перевірити форму та бейдж" },
      {
        id: "fridge",
        text: "Провести експрес-інвентаризацію вітрини",
        helperLink: "/kb/welcome-flow"
      },
      {
        id: "degustation",
        text: "Підготувати дегустаційний сет",
        helperLink: "/sales-now#scripts"
      },
      { id: "cash", text: "Звірити касу та дрібні купюри" }
    ],
  },
  {
    id: "closing",
    title: "Закриття точки",
    description: "Процедури завершення робочого дня",
    lastCompletedAt: "2024-07-07T22:05:00+03:00",
    reminderMinutes: 720,
    nextDueAt: "2024-07-08T21:45:00+03:00",
    items: [
      { id: "clean", text: "Прибрати стіл та обладнання" },
      {
        id: "report",
        text: "Надіслати звіт у чат зміни",
        helperLink: "https://t.me/+perfect-seller-report"
      },
      { id: "writeoff", text: "Зробити фото списань" },
      {
        id: "security",
        text: "Замкнути холодильники та сигналізацію",
        helperLink: "/kb/emergency-power-outage"
      }
    ],
  },
  {
    id: "tasting-bar",
    title: "Бар дегустацій",
    description: "Швидка підготовка до дегустаційної активності",
    lastCompletedAt: "2024-07-08T14:20:00+03:00",
    reminderMinutes: 240,
    nextDueAt: "2024-07-08T17:00:00+03:00",
    items: [
      { id: "setup", text: "Зібрати дегустаційну стійку" },
      { id: "pitch", text: "Вивчити сьогоднішній скрипт з Sales Now", helperLink: "/sales-now" },
      { id: "leads", text: "Зібрати контакти зацікавлених гостей" },
      { id: "followup", text: "Передати заявки у CRM" }
    ],
  },
];
