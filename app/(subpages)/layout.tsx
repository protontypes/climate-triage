import { Header } from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-gray-900 antialiased dark:bg-black-400 dark:text-silver-500">
      <Header />
      <main className="flex flex-1">
        <section className="container mx-auto p-6 lg:max-w-6xl">{children}</section>
      </main>
    </div>
  );
}
