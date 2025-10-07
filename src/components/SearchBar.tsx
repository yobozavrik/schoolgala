import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import type { ChangeEventHandler } from "react";

interface SearchBarProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder }: SearchBarProps) => (
  <label className="flex items-center gap-2 rounded-2xl border border-skin-ring/60 bg-skin-card px-4 py-2 shadow-md">
    <Search className="h-4 w-4 text-skin-muted" aria-hidden />
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border-none px-0 py-0 focus:ring-0"
      aria-label="Пошук"
    />
  </label>
);
