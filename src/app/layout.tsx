import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trava Aqui",
  description: "Atividades curtas com uma IA que ajuda o aluno sem entregar a resposta.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="topbar">
          <Link href="/" className="brand">
            Trava <span>Aqui</span>
          </Link>
          <nav className="nav" aria-label="Principal">
            <Link href="/professor">Professor</Link>
            <Link href="/aluno">Aluno</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
