import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-neutral-50 border-t border-neutral-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <p className="text-primary font-bold text-sm tracking-tight">
                            Reglamento Interno CL
                        </p>
                        <p className="text-neutral-500 text-xs mt-1">
                            Documentos laborales para PYMES en Chile.
                        </p>
                    </div>

                    {/* Links */}
                    <nav className="flex items-center gap-6 text-sm" aria-label="Pie de página">
                        <Link
                            href="/terminos"
                            className="text-neutral-600 hover:text-primary transition-colors"
                        >
                            Términos
                        </Link>
                        <Link
                            href="/privacidad"
                            className="text-neutral-600 hover:text-primary transition-colors"
                        >
                            Privacidad
                        </Link>
                        <Link
                            href="/contacto"
                            className="text-neutral-600 hover:text-primary transition-colors"
                        >
                            Contacto
                        </Link>
                    </nav>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
                    <p className="text-neutral-400 text-xs">
                        © {new Date().getFullYear()} Reglamento Interno CL. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
