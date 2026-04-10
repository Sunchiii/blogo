import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
