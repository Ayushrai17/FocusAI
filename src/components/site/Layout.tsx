import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="pt-24">{children}</main>
      <Footer />
    </div>
  );
}
