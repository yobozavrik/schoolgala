import { PropsWithChildren, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/Header";

export const Layout = ({ children }: PropsWithChildren): JSX.Element => {
  const location = useLocation();
  const segment = useMemo(() => location.pathname.split("/")[1] ?? "home", [location.pathname]);
  const backgroundClass = useMemo(() => {
    switch (segment) {
      case "assistant":
        return "from-sky-100 via-white to-indigo-100";
      case "kb":
        return "from-emerald-100 via-white to-slate-100";
      case "catalog":
        return "from-amber-100 via-white to-rose-100";
      case "sales-now":
        return "from-rose-100 via-white to-orange-100";
      default:
        return "from-amber-100 via-white to-sky-100";
    }
  }, [segment]);
  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${backgroundClass} py-6`}> 
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),transparent_55%)]" aria-hidden />
      <div className="relative z-[1] mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-white/60 bg-skin-card/95 shadow-2xl backdrop-blur-xl">
        <Header />
        <main className="flex-1 px-4 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
};
