"use client";

import React from "react";
import { AppDataProvider } from "../context/AppDataContext";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
  <div className="flex min-h-screen flex-col bg-stone-50 text-gray-900 antialiased dark:bg-black-400 dark:text-silver-500">
    <AppDataProvider>
      <Header />
      <main className="flex flex-1">
        <section className="container mx-auto flex flex-col md:flex-row lg:max-w-6xl">
          <Sidebar />
          {children}
        </section>
      </main>
    </AppDataProvider>
  </div>
);
