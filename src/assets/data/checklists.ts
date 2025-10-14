import type { Locale } from "@/i18n/dictionary";
import type { Checklist, ChecklistCopy } from "@/types/checklist";

export const checklists: Checklist[] = [
  {
    id: "morning-shift",
    translations: {
      uk: {
        title: "Ранкова зміна",
        description: "Підготовка точки перед відкриттям",
        items: [
          { id: "uniform", text: "Перевірити форму та бейдж" },
          { id: "fridge", text: "Провести експрес-інвентаризацію вітрини" },
          { id: "degustation", text: "Підготувати дегустаційний сет" },
          { id: "cash", text: "Звірити касу та дрібні купюри" },
        ],
      },
      ru: {
        title: "Утренняя смена",
        description: "Подготовка точки перед открытием",
        items: [
          { id: "uniform", text: "Проверить форму и бейдж" },
          { id: "fridge", text: "Провести экспресс-инвентаризацию витрины" },
          { id: "degustation", text: "Подготовить дегустационный сет" },
          { id: "cash", text: "Сверить кассу и размен" },
        ],
      },
      en: {
        title: "Morning shift",
        description: "Prepare the counter before opening",
        items: [
          { id: "uniform", text: "Check uniform and name badge" },
          { id: "fridge", text: "Run a quick showcase inventory" },
          { id: "degustation", text: "Set up the tasting tray" },
          { id: "cash", text: "Count the till and petty cash" },
        ],
      },
    },
  },
  {
    id: "closing",
    translations: {
      uk: {
        title: "Закриття точки",
        description: "Процедури завершення робочого дня",
        items: [
          { id: "clean", text: "Прибрати стіл та обладнання" },
          { id: "report", text: "Надіслати звіт у чат зміни" },
          { id: "writeoff", text: "Зробити фото списань" },
          { id: "security", text: "Замкнути холодильники та сигналізацію" },
        ],
      },
      ru: {
        title: "Закрытие точки",
        description: "Процедуры завершения рабочего дня",
        items: [
          { id: "clean", text: "Убрать стол и оборудование" },
          { id: "report", text: "Отправить отчет в чат смены" },
          { id: "writeoff", text: "Сделать фото списаний" },
          { id: "security", text: "Закрыть холодильники и сигнализацию" },
        ],
      },
      en: {
        title: "Closing routine",
        description: "Wrap-up tasks for the end of day",
        items: [
          { id: "clean", text: "Clean the counter and equipment" },
          { id: "report", text: "Send shift report to the chat" },
          { id: "writeoff", text: "Capture photos of write-offs" },
          { id: "security", text: "Lock fridges and arm the alarm" },
        ],
      },
    },
  },
];

export const getChecklistCopy = (checklist: Checklist, locale: Locale): ChecklistCopy =>
  checklist.translations[locale] ?? checklist.translations.uk;
