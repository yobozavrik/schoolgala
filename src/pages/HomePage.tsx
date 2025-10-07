import { Tile } from "@/components/Tile";
import {
  Bot,
  BookOpenCheck,
  Boxes,
  ClipboardCheck,
  GraduationCap,
  MessageSquareShare,
} from "lucide-react";
import { motion } from "framer-motion";

const tiles = [
  {
    title: "ШІ-помічник",
    description: "Миттєві відповіді на складні запитання",
    icon: <Bot className="h-6 w-6" aria-hidden />,
    to: "/assistant",
  },
  {
    title: "База знань",
    description: "Покрокові інструкції та корисні матеріали",
    icon: <BookOpenCheck className="h-6 w-6" aria-hidden />,
    to: "/kb",
  },
  {
    title: "Чек-листи",
    description: "Контроль щоденних рутин та стандартів",
    icon: <ClipboardCheck className="h-6 w-6" aria-hidden />,
    to: "/checklists",
  },
  {
    title: "Наша продукція",
    description: "Каталог «Галя Балувана» під рукою",
    icon: <Boxes className="h-6 w-6" aria-hidden />,
    to: "/catalog",
  },
  {
    title: "Перевірка знань",
    description: "Тести та тренажери для розвитку",
    icon: <GraduationCap className="h-6 w-6" aria-hidden />,
    to: "/tests",
  },
  {
    title: "Корисні контакти",
    description: "Миттєвий зв’язок з наставниками",
    icon: <MessageSquareShare className="h-6 w-6" aria-hidden />,
    to: "/contacts",
  },
];

const HomePage = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl bg-skin-base/80 p-6 text-center shadow-lg"
      >
        <div className="text-2xl font-semibold text-skin-text">Вітаємо, колего!</div>
        <div className="mt-2 text-sm text-skin-muted">
          Обирайте розділ, щоб отримати інструменти для ідеального сервісу та продажів.
        </div>
      </motion.div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tiles.map((tile) => (
          <Tile key={tile.title} {...tile} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
