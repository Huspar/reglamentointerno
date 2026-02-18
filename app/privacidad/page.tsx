import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Política de Privacidad",
    description:
        "Política de privacidad de Reglamento Interno CL. Conoce cómo protegemos tus datos personales.",
};

export default function PrivacidadPage() {
    return (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                Política de Privacidad
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
                Última actualización: febrero 2026
            </p>

            <div className="mt-10 space-y-8 text-neutral-600 leading-relaxed text-sm">
                <div>
                    <h2 className="font-semibold text-primary text-base mb-2">
                        1. Responsable del tratamiento
                    </h2>
                    <p>
                        El responsable del tratamiento de datos personales es Reglamento
                        Interno CL, con domicilio en Chile. Puedes contactarnos a través de{" "}
                        <a
                            href="mailto:contacto@reglamentointernoCL.cl"
                            className="text-accent hover:underline"
                        >
                            contacto@reglamentointernoCL.cl
                        </a>
                        .
                    </p>
                </div>

                <div>
                    <h2 className="font-semibold text-primary text-base mb-2">
                        2. Datos que recopilamos
                    </h2>
                    <p>
                        Recopilamos únicamente los datos necesarios para la generación del
                        documento: nombre de la empresa, RUT, dirección, rubro y datos de
                        contacto del representante legal. También recopilamos datos de
                        navegación con fines analíticos.
                    </p>
                </div>

                <div>
                    <h2 className="font-semibold text-primary text-base mb-2">
                        3. Finalidad del tratamiento
                    </h2>
                    <p>
                        Los datos se utilizan exclusivamente para generar el documento de
                        Reglamento Interno solicitado por el usuario, procesar el pago y
                        enviar la confirmación correspondiente.
                    </p>
                </div>

                <div>
                    <h2 className="font-semibold text-primary text-base mb-2">
                        4. Base legal
                    </h2>
                    <p>
                        El tratamiento se basa en la ejecución de un contrato (la compra del
                        servicio) y el consentimiento del usuario al aceptar estos términos.
                        El tratamiento cumple con la Ley 19.628 sobre Protección de la Vida
                        Privada.
                    </p>
                </div>

                <div>
                    <h2 className="font-semibold text-primary text-base mb-2">
                        5. Almacenamiento y seguridad
                    </h2>
                    <p>
                        Los datos se almacenan de forma segura utilizando cifrado y medidas
                        técnicas apropiadas. Los datos se conservan por el tiempo necesario
                        para cumplir con la finalidad del tratamiento y las obligaciones
                        legales vigentes.
                    </p>
                </div>

                <div>
                    <h2 className="font-semibold text-primary text-base mb-2">
                        6. Derechos del usuario
                    </h2>
                    <p>
                        El usuario tiene derecho a acceder, rectificar, cancelar y oponerse
                        al tratamiento de sus datos personales, de conformidad con la
                        legislación chilena vigente. Para ejercer estos derechos, puede
                        contactarnos por correo electrónico.
                    </p>
                </div>

                <div>
                    <h2 className="font-semibold text-primary text-base mb-2">
                        7. Cookies
                    </h2>
                    <p>
                        Este sitio utiliza cookies esenciales para el funcionamiento del
                        servicio y cookies analíticas para mejorar la experiencia del
                        usuario. Puede desactivar las cookies desde la configuración de su
                        navegador.
                    </p>
                </div>
            </div>
        </section>
    );
}
