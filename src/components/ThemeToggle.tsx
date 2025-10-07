import { MoonStar, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/providers/ThemeProvider";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Увімкнути темну тему" : "Увімкнути світлу тему"}
      className="h-10 w-10 rounded-full p-0"
    >
      {theme === "light" ? <MoonStar className="h-5 w-5" /> : <SunMedium className="h-5 w-5" />}
    </Button>
  );
};
