import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Reveal } from "./Reveal";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="bg-surface py-12 sm:py-16">
      <div className="container-page text-center">
        <Reveal>
        <h1 className="text-3xl font-bold text-primary-dark sm:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">{subtitle}</p>
        )}
        </Reveal>
      </div>
    </section>
  );
}
