import { PropsWithChildren } from "react";
import { Header } from "@/components/Header";

export const Layout = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col bg-skin-card shadow-lg">
      <Header />
      <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
};
