import type { TestModule } from "@/types/tests";

export const testModules: TestModule[] = [
  {
    id: "product-knowledge",
    title: "Знання продукції",
    duration: "10 хв",
    questionsCount: 12,
    description: "Перевірка базових знань про асортимент та цінності бренду.",
  },
  {
    id: "objections",
    title: "Опрацювання заперечень",
    duration: "8 хв",
    questionsCount: 9,
    description: "Сценарії комунікації з різними типами клієнтів.",
  },
  {
    id: "merchandising",
    title: "Вітрина та мерчандайзинг",
    duration: "6 хв",
    questionsCount: 7,
    description: "Правила викладки та збереження продукції.",
  },
];
