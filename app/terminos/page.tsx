import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Términos y Condiciones",
    description:
        "Términos y condiciones de uso de Reglamento Interno CL. Conoce los alcances y responsabilidades del servicio.",
};

export default function TerminosPage() {
    return (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                Términos y Condiciones
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
                Última actualización: febrero 2026
            </p>

            <div className="mt-10 space-y-8 text-neutral-600 leading-relaxed text-sm">
                <div>
                    <h2 className="font-semibold text-primary text-base mb-2">
                        1. Aceptación de los términos
                    </h2>
                    <p>
                        Al utilizar el sitio web reglamentointernoCL.cl y sus servicios,
                        usted acepta quedar vinculado por estos términos y condiciones. Si no
                        está de acuerdo, le solicitamos no hacer uso del servicio.
                    </p>
                </div>

                <div>
                    <h2 className="font-semibold text-primary text-base mb-2">
                        2. Descripción del servicio
                    </h2>
                    <p>
                        Reglamento Interno CL ofrece una herramienta automatizada para la
                        generación de documentos de Reglamento Interno de Orden, Higiene y
                        Seguridad orientados a PYMES en Chile. El documento generado es una
                        referencia y debe ser revisado y adaptado por el usuario según la
                        realidad de su empresa.
                    </p>
                </div>

                <div>
                    <h2 className="font-semibold text-primary text-base mb-2">
                        3. Uso adecuado
                    </h2>
                    <p>
                        El usuario se compromete a utilizar el servicio de manera legal y
                        conforme a estos términos. Queda prohibido el uso del servicio para
                        fines ilícitos o que vulneren derechos de terceros.
                    </p>
                </div>

                <div>
                    <h2 className="font-semibold text-primary text-base mb-2">
                        4. Propiedad intelectual
                    </h2>
                    <p>
                        El contenido del sitio, incluyendo diseño, textos, gráficos y
                        logotipos, es propiedad de Reglamento Interno CL y está protegido
                        por la legislación chilena de propiedad intelectual. El documento
                        generado para el usuario pasa a ser de uso exclusivo del comprador.
                    </p>
                </div>

                <div>
                    <h2 className="font-semibold text-primary text-base mb-2">
                        5. Limitación de responsabilidad
                    </h2>
                    <p>
                        El servicio no constituye asesoría legal. El documento generado es
                        una guía orientativa. Reglamento Interno CL no se hace responsable
                        por el uso inadecuado del documento ni por consecuencias derivadas de
                        su aplicación sin revisión profesional.
                    </p>
                </div>

                <div>
                    <h2 className="font-semibold text-primary text-base mb-2">
                        6. Política de pagos
                    </h2>
                    <p>
                        El servicio tiene un costo único que se informa previo a la compra.
                        Una vez realizado el pago y descargado el documento, no se aceptan
                        devoluciones salvo en casos justificados evaluados individualmente.
                    </p>
                </div>

                <div>
                    <h2 className="font-semibold text-primary text-base mb-2">
                        7. Modificaciones
                    </h2>
                    <p>
                        Nos reservamos el derecho de modificar estos términos en cualquier
                        momento. Los cambios serán publicados en esta página con la fecha de
                        la última actualización.
                    </p>
                </div>
            </div>
        </section>
    );
}
