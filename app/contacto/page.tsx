import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contacto",
    description:
        "¿Tienes dudas sobre la generación de tu Reglamento Interno? Contáctanos y te ayudamos.",
};

export default function ContactoPage() {
    return (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                Contacto
            </h1>
            <p className="mt-4 text-neutral-600 leading-relaxed">
                Si tienes dudas o necesitas ayuda con la generación de tu Reglamento
                Interno, puedes contactarnos por los siguientes medios:
            </p>

            <div className="mt-10 space-y-6">
                <div className="bg-neutral-50 rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-primary text-base">
                        Correo electrónico
                    </h2>
                    <p className="mt-2 text-neutral-600 text-sm">
                        <a
                            href="mailto:contacto@reglamentointernoCL.cl"
                            className="text-accent hover:underline"
                        >
                            contacto@reglamentointernoCL.cl
                        </a>
                    </p>
                </div>

                <div className="bg-neutral-50 rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-primary text-base">
                        Horario de atención
                    </h2>
                    <p className="mt-2 text-neutral-600 text-sm">
                        Lunes a viernes, de 9:00 a 18:00 hrs (hora Chile continental).
                    </p>
                </div>

                <div className="bg-neutral-50 rounded-xl border border-neutral-100 p-6">
                    <h2 className="font-semibold text-primary text-base">
                        Respuesta esperada
                    </h2>
                    <p className="mt-2 text-neutral-600 text-sm">
                        Respondemos en un plazo máximo de 24 horas hábiles.
                    </p>
                </div>
            </div>
        </section>
    );
}
