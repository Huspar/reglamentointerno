import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://reglamentointernoCL.cl"),
  title: {
    default:
      "Generador de Reglamento Interno para PYMES en Chile | Documento en 10 minutos",
    template: "%s | Reglamento Interno CL",
  },
  description:
    "Crea tu Reglamento Interno de Orden, Higiene y Seguridad para tu empresa en Chile. Documento claro, editable y listo para descargar. Pago único.",
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Reglamento Interno CL",
    title:
      "Generador de Reglamento Interno para PYMES en Chile | Documento en 10 minutos",
    description:
      "Crea tu Reglamento Interno de Orden, Higiene y Seguridad para tu empresa en Chile. Documento claro, editable y listo para descargar. Pago único.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
