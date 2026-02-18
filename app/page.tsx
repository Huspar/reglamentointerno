import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Generador de Reglamento Interno para PYMES en Chile | Documento en 10 minutos",
  description:
    "Crea tu Reglamento Interno de Orden, Higiene y Seguridad para tu empresa en Chile. Documento claro, editable y listo para descargar. Pago único.",
  openGraph: {
    title:
      "Generador de Reglamento Interno para PYMES en Chile | Documento en 10 minutos",
    description:
      "Crea tu Reglamento Interno de Orden, Higiene y Seguridad para tu empresa en Chile. Documento claro, editable y listo para descargar. Pago único.",
  },
};

const steps = [
  {
    number: "1",
    title: "Ingresa los datos básicos de tu empresa",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    number: "2",
    title: "Generamos el documento estructurado automáticamente",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: "3",
    title: "Descárgalo y aplícalo en tu empresa",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
];

const includes = [
  { text: "Portada personalizada", icon: "📄" },
  { text: "Normas de orden y conducta", icon: "📋" },
  { text: "Jornada y asistencia", icon: "🕐" },
  { text: "Higiene y seguridad", icon: "🛡️" },
  { text: "Procedimiento disciplinario", icon: "⚖️" },
  { text: "Formato editable", icon: "✏️" },
];

const faqs = [
  {
    q: "¿Para qué tipo de empresas es?",
    a: "Para cualquier PYME en Chile con 10 o más trabajadores que necesite cumplir con la obligación legal de contar con un Reglamento Interno de Orden, Higiene y Seguridad.",
  },
  {
    q: "¿Cuánto demora?",
    a: "Todo el proceso toma aproximadamente 10 minutos. Ingresas los datos de tu empresa y el documento se genera de forma automática, listo para descargar.",
  },
  {
    q: "¿Es editable?",
    a: "Sí. El documento se entrega en formato editable para que puedas ajustarlo según las necesidades específicas de tu empresa.",
  },
  {
    q: "¿Qué pasa después de descargarlo?",
    a: "Puedes revisarlo, imprimirlo y aplicarlo en tu empresa. Lo ideal es que lo firmes y lo pongas en conocimiento de tus trabajadores según la normativa vigente.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "Reglamento Interno CL",
                url: "https://reglamentointernoCL.cl",
                description:
                  "Generador de Reglamento Interno para PYMES en Chile.",
              },
              {
                "@type": "Product",
                name: "Reglamento Interno para PYMES en Chile",
                description:
                  "Documento de Reglamento Interno de Orden, Higiene y Seguridad generado automáticamente para tu empresa en Chile. Claro, editable y listo para descargar.",
                offers: {
                  "@type": "Offer",
                  price: "39990",
                  priceCurrency: "CLP",
                  availability: "https://schema.org/InStock",
                },
              },
            ],
          }),
        }}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight tracking-tight">
            Genera tu Reglamento Interno para PYMES en Chile en 10 minutos
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Documento listo para descargar, claro y ordenado, diseñado para
            ayudarte a cumplir y estar tranquilo.
          </p>
          <div className="mt-10">
            <Link
              href="/generar"
              className="inline-flex items-center px-8 py-4 bg-accent text-white text-lg font-semibold rounded-xl hover:bg-accent-dark transition-colors shadow-lg shadow-accent/20"
            >
              Generar ahora
            </Link>
          </div>
          <p className="mt-4 text-sm text-neutral-500">
            Pago único. Sin suscripción. Descarga inmediata.
          </p>
        </div>
      </section>

      {/* ===== SECCIÓN PROBLEMA ===== */}
      <section className="bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">
            ¿Tu empresa ya necesita Reglamento Interno?
          </h2>
          <p className="mt-6 text-neutral-600 max-w-2xl mx-auto leading-relaxed text-base sm:text-lg">
            Si tienes 10 o más trabajadores, debes contar con un Reglamento
            Interno de Orden, Higiene y Seguridad. No tenerlo puede generarte
            problemas en una fiscalización.
          </p>
          <div className="mt-8">
            <Link
              href="/generar"
              className="inline-flex items-center px-6 py-3 border-2 border-accent text-accent font-semibold rounded-xl hover:bg-accent hover:text-white transition-colors"
            >
              Crear el mío ahora
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SECCIÓN CÓMO FUNCIONA ===== */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center">
            ¿Cómo funciona?
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="text-center p-6 rounded-2xl bg-neutral-50 border border-neutral-100"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-accent uppercase tracking-widest mb-2">
                  Paso {step.number}
                </div>
                <p className="text-neutral-700 font-medium leading-snug">
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECCIÓN QUÉ INCLUYE ===== */}
      <section className="bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center">
            ¿Qué incluye tu reglamento?
          </h2>
          <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {includes.map((item) => (
              <li
                key={item.text}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-100"
              >
                <span className="text-xl" role="img" aria-hidden>
                  {item.icon}
                </span>
                <span className="text-neutral-700 font-medium text-sm">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== SECCIÓN PRECIO ===== */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">
            Precio
          </h2>
          <div className="mt-8 inline-block bg-neutral-50 border-2 border-accent/20 rounded-2xl px-12 py-10">
            <p className="text-5xl sm:text-6xl font-extrabold text-primary tracking-tight">
              $39.990
              <span className="text-lg font-medium text-neutral-500 ml-2">
                CLP
              </span>
            </p>
            <p className="mt-3 text-neutral-500 text-sm">
              Pago único. Sin mensualidades.
            </p>
            <div className="mt-8">
              <Link
                href="/generar"
                className="inline-flex items-center px-8 py-4 bg-accent text-white text-lg font-semibold rounded-xl hover:bg-accent-dark transition-colors shadow-lg shadow-accent/20"
              >
                Generar mi Reglamento
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECCIÓN FAQ ===== */}
      <section className="bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center">
            Preguntas frecuentes
          </h2>
          <div className="mt-10 space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-white rounded-xl border border-neutral-100 p-6"
              >
                <h3 className="font-semibold text-primary text-base">
                  {faq.q}
                </h3>
                <p className="mt-2 text-neutral-600 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Resuelve este requisito hoy mismo.
          </h2>
          <div className="mt-8">
            <Link
              href="/generar"
              className="inline-flex items-center px-10 py-4 bg-white text-primary text-lg font-bold rounded-xl hover:bg-neutral-100 transition-colors shadow-lg"
            >
              Generar ahora
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
