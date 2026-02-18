/* ═══════════════════════════════════════════════════════════════
   lib/reglamentoBuilder.ts
   Generador modular de Reglamento Interno — v3 (pulido profesional)
   ═══════════════════════════════════════════════════════════════ */

/* ─── Tipos exportados ─── */
export type ContentItem =
    | { type: "article"; text: string }
    | { type: "plain"; text: string };

export interface ReglamentoSection {
    title: string;
    content: ContentItem[];
}

export interface ReglamentoData {
    razonSocial: string;
    rutEmpresa: string;
    giro: string;
    domicilio: string;
    comuna: string;
    region: string;
    nombreCompleto: string;
    rutRepresentante: string;
    cargo: string;
    email: string;
    numTrabajadores: string;
    categoriaRiesgo: string;
    rubro: string; // Deprecado, mantener por compatibilidad
    jornadaGeneral: string;
    trabajoRemoto: string;
    controlAsistencia: string;
    usoEPP: string;
    comiteParitario: string;
    mutualidad: string;
    prohibiciones: string[];
    tipoProcedimiento: string;
    procedimientoDisciplinario: string;
    flexibleLegalWording?: boolean;
}

/* ─── Helpers de contenido ─── */
function art(text: string): ContentItem {
    return { type: "article", text };
}
function plain(text: string): ContentItem {
    return { type: "plain", text };
}

/* ─── Utilidades de datos ─── */
function safe(val: string | undefined | null): string {
    return val && val.trim() ? val.trim() : "";
}

function domicilioCompleto(d: ReglamentoData): string {
    return [d.domicilio, d.comuna, d.region].filter((v) => safe(v)).join(", ");
}

/* ─── Normalización de Rubro ─── */
function normalizarRubro(d: ReglamentoData): string {
    const cat = d.categoriaRiesgo;
    if (cat === "servicios_oficina") return "servicios profesionales u oficina";
    if (cat === "construccion") return "construcción";
    if (cat === "industrial") return "actividades industriales";
    if (cat === "comercio") return "comercio";
    if (cat === "otro") return safe(d.giro) || "actividades comerciales";
    return "servicios generales"; // Fallback seguro
}

/* ═══════════════════════════════════════════
   ADAPTACIÓN POR RUBRO
   ═══════════════════════════════════════════ */
interface RubroContext {
    riesgosEjemplo: string;
    medidasPreventivas: string;
    eppContexto: string;
    ambienteLaboral: string;
}

function adaptarSegunRubro(categoriaRiesgo: string): RubroContext {
    switch (categoriaRiesgo) {
        case "construccion":
            return {
                riesgosEjemplo:
                    "caídas de altura, atrapamientos, contacto con sustancias peligrosas, exposición a ruido y vibraciones, riesgos eléctricos y proyección de partículas propios de la actividad constructiva",
                medidasPreventivas:
                    "la señalización de zonas de riesgo, la instalación de barandas y redes de protección, la delimitación de áreas de tránsito seguro y la supervisión permanente de las condiciones de trabajo en obra",
                eppContexto:
                    "cascos de seguridad, arneses para trabajos en altura, guantes industriales, calzado de seguridad con puntera reforzada, protección auditiva y respiratoria, según la naturaleza de las tareas asignadas",
                ambienteLaboral:
                    "las faenas constructivas y los frentes de trabajo",
            };
        case "industrial":
            return {
                riesgosEjemplo:
                    "atrapamiento por maquinaria, exposición a agentes químicos, ruido industrial, riesgos ergonómicos derivados de la manipulación de cargas y riesgos eléctricos asociados a procesos productivos",
                medidasPreventivas:
                    "el mantenimiento preventivo de equipos y maquinaria, la ventilación adecuada de los espacios de trabajo, la señalización de zonas peligrosas y la capacitación continua en procedimientos seguros de operación",
                eppContexto:
                    "protección auditiva, respiratoria y visual, guantes especializados, calzado de seguridad y vestimenta adecuada al tipo de proceso industrial en que se desempeñen",
                ambienteLaboral:
                    "las instalaciones productivas y áreas de operación industrial",
            };
        case "comercio":
            return {
                riesgosEjemplo:
                    "caídas al mismo nivel, sobreesfuerzos por manipulación manual de mercadería, riesgos ergonómicos derivados de posturas prolongadas y exposición a riesgos de seguridad en la atención al público",
                medidasPreventivas:
                    "la mantención de pisos limpios y sin obstáculos, la correcta organización de bodegas y estanterías, el uso de escaleras y elementos auxiliares apropiados, y la capacitación en técnicas de levantamiento seguro",
                eppContexto:
                    "calzado antideslizante, guantes para manipulación de carga y los elementos que correspondan según la evaluación de riesgos del puesto de trabajo",
                ambienteLaboral:
                    "los locales comerciales, bodegas y dependencias de atención al público",
            };
        case "servicios_oficina":
        default:
            return {
                riesgosEjemplo:
                    "riesgos ergonómicos derivados del uso prolongado de equipos de escritorio, fatiga visual, estrés laboral y riesgos psicosociales asociados a la carga de trabajo",
                medidasPreventivas:
                    "la adecuación ergonómica de los puestos de trabajo, pausas activas, iluminación apropiada, ventilación adecuada y la promoción de hábitos saludables en el entorno laboral",
                eppContexto:
                    "los elementos ergonómicos y de protección que resulten pertinentes conforme a la evaluación de riesgos de cada puesto de trabajo",
                ambienteLaboral:
                    "las oficinas, dependencias administrativas y lugares donde se presten los servicios",
            };
    }
}

/* ─── Textos formales por prohibición ─── */
const prohibicionTextos: Record<string, string> = {
    consumo_alcohol:
        "Se prohíbe estrictamente el consumo, posesión o distribución de bebidas alcohólicas dentro de las dependencias de la empresa, así como presentarse al lugar de trabajo bajo la influencia del alcohol. La infracción a esta norma será considerada falta grave y dará lugar a la aplicación inmediata de las sanciones disciplinarias contempladas en este Reglamento.",
    consumo_drogas:
        "Queda terminantemente prohibido el consumo, tenencia o tráfico de sustancias estupefacientes o psicotrópicas en horario laboral o dentro de las instalaciones de la empresa. Asimismo, se prohíbe presentarse a trabajar bajo los efectos de dichas sustancias. La organización se reserva el derecho de solicitar exámenes médicos cuando existan indicios fundados de transgresión.",
    violencia:
        "Queda prohibido ejercer cualquier forma de violencia física o verbal contra compañeros de trabajo, superiores jerárquicos, subordinados, clientes, proveedores o cualquier persona que se encuentre en las instalaciones de la empresa. Toda conducta agresiva, amenazante o intimidatoria será sancionada con la máxima rigurosidad conforme al procedimiento disciplinario establecido.",
    acoso:
        "Quedan prohibidas todas las conductas constitutivas de acoso laboral, acoso sexual y violencia en el trabajo, en cualquiera de sus manifestaciones, conforme a la legislación vigente sobre prevención, investigación y sanción del acoso laboral, sexual y la violencia en el trabajo. La organización mantiene un protocolo de prevención y un procedimiento de investigación interno para atender las denuncias, garantizando la confidencialidad, la protección del denunciante y la adopción oportuna de medidas correctivas.",
    discriminacion:
        "Se prohíbe toda forma de discriminación arbitraria fundada en raza, color, sexo, edad, estado civil, religión, opinión política, nacionalidad, ascendencia nacional, situación socioeconómica, orientación sexual, identidad de género, discapacidad u origen social, conforme a la normativa antidiscriminación vigente. La organización promueve un ambiente laboral basado en el respeto a la diversidad y la igualdad de trato.",
    llegadas_reiteradas:
        "Se prohíben las llegadas tardías reiteradas e injustificadas al lugar de trabajo. El incumplimiento sistemático de los horarios establecidos constituye una falta que afecta la organización productiva y podrá dar lugar a las sanciones disciplinarias correspondientes, incluyendo descuentos de remuneración conforme a la ley.",
    no_uso_epp:
        "Queda prohibido el desempeño de funciones sin la utilización de los Equipos de Protección Personal asignados cuando las condiciones de trabajo así lo requieran. La negativa a utilizar los EPP proporcionados será considerada falta grave que pone en riesgo la integridad del trabajador y de terceros, y facultará al empleador para impedir el ingreso del trabajador a la zona de riesgo.",
    manipulacion_maquinaria:
        "Queda prohibida la manipulación, operación o intervención de maquinaria, equipos o herramientas para los cuales el trabajador no haya sido debidamente capacitado o autorizado. Asimismo, se prohíbe alterar, desactivar o retirar los dispositivos de seguridad de cualquier equipo o instalación, conducta que será considerada falta gravísima.",
    incumplimiento_protocolos:
        "Se prohíbe el incumplimiento de los protocolos internos de seguridad, incluyendo procedimientos de evacuación, protocolos de emergencia, normas de manipulación de sustancias peligrosas y cualquier otra instrucción impartida en materia de prevención de riesgos. La inobservancia de estos protocolos compromete la seguridad colectiva.",
    ingreso_no_autorizado:
        "Queda prohibido permitir o facilitar el ingreso de personas ajenas a la organización a las dependencias de trabajo sin la debida autorización del personal encargado. Todo visitante deberá ser debidamente identificado y registrado conforme a los procedimientos internos, y deberá permanecer acompañado durante su estadía en las instalaciones.",
    uso_indebido_equipos:
        "Queda prohibido el uso de equipos computacionales, dispositivos electrónicos y recursos tecnológicos para fines ajenos al desempeño de las funciones laborales asignadas. Esto incluye el acceso a sitios web no relacionados con el trabajo, la descarga de contenido personal y el uso recreativo durante la jornada laboral.",
    software_no_autorizado:
        "Se prohíbe la instalación de software, aplicaciones o programas no autorizados en los equipos de la organización. Toda necesidad de software adicional deberá ser canalizada a través del área de tecnología o quien haga sus veces, para su evaluación, aprobación e instalación controlada.",
    correo_fines_personales:
        "Queda prohibido el uso del correo electrónico corporativo y las cuentas institucionales para fines personales, incluyendo el envío de cadenas, contenido no laboral, suscripciones a servicios personales o cualquier comunicación ajena a las funciones del cargo.",
    filtracion_info:
        "Se prohíbe estrictamente la divulgación, reproducción, distribución o uso indebido de información confidencial, secretos comerciales, datos de clientes, estrategias corporativas o cualquier antecedente reservado al que el trabajador tenga acceso en razón de su cargo. Esta obligación se mantiene vigente incluso después de terminada la relación laboral y su infracción dará lugar a las acciones civiles y penales que correspondan.",
};

/* ═══════════════════════════════════════════
   CAPÍTULO 1 — IDENTIFICACIÓN
   ═══════════════════════════════════════════ */
function moduloIdentificacion(d: ReglamentoData): ReglamentoSection {
    const dom = domicilioCompleto(d);

    // Normalización de rubro y giro para redacción natural
    const rubroNormalizado = normalizarRubro(d);
    const giro = safe(d.giro);
    let fraseActividad = `en el rubro de ${rubroNormalizado}`;

    if (giro) {
        fraseActividad += `, dedicándose específicamente a ${giro}`;
    }

    const content: ContentItem[] = [];

    content.push(
        art(`El presente Reglamento Interno de Orden, Higiene y Seguridad se dicta en cumplimiento de la normativa laboral chilena y será de aplicación en ${safe(d.razonSocial) || "la empresa"}, RUT ${safe(d.rutEmpresa) || "[pendiente]"}, cuyo giro comercial corresponde a ${giro || "actividades propias de su objeto social"}.${dom ? ` La organización tiene su domicilio en ${dom}.` : ""}`)
    );

    // Representante legal — solo si tenemos datos
    if (safe(d.nombreCompleto)) {
        const rutRepr = safe(d.rutRepresentante) && safe(d.rutRepresentante) !== safe(d.rutEmpresa)
            ? `, RUT ${d.rutRepresentante},`
            : "";
        const cargoRepr = safe(d.cargo) ? ` en calidad de ${d.cargo},` : "";
        content.push(
            art(`La representación legal es ejercida por don(ña) ${d.nombreCompleto}${rutRepr}${cargoRepr} con plenas facultades para obligar a la organización en los términos de este instrumento.`)
        );
    } else {
        content.push(
            art("La representación legal de la empresa será ejercida por quien conste como tal en los registros públicos correspondientes, con plenas facultades para obligar a la organización en los términos de este instrumento.")
        );
    }

    content.push(
        art(`La organización desarrolla sus actividades ${fraseActividad} y cuenta actualmente con un rango de ${safe(d.numTrabajadores) || "trabajadores"} sujetos al presente Reglamento.${safe(d.mutualidad) ? ` Se encuentra adherida a ${d.mutualidad} como organismo administrador del seguro contra riesgos de accidentes del trabajo y enfermedades profesionales.` : ""}`)
    );

    content.push(
        art("Para todos los efectos legales y administrativos derivados de este instrumento, las comunicaciones, notificaciones y requerimientos se realizarán desde el domicilio indicado precedentemente, o a través de los medios electrónicos que la administración habilite para tal fin.")
    );

    return { title: "IDENTIFICACIÓN DE LA EMPRESA", content };
}

/* ═══════════════════════════════════════════
   CAPÍTULO 2 — ÁMBITO DE APLICACIÓN
   ═══════════════════════════════════════════ */
function moduloAmbitoAplicacion(d: ReglamentoData): ReglamentoSection {
    return {
        title: "ÁMBITO DE APLICACIÓN",
        content: [
            art("El presente Reglamento es aplicable a todos los trabajadores de la organización, sin distinción de cargo, función, antigüedad, modalidad contractual o lugar de prestación de servicios, desde la fecha de inicio de su relación laboral hasta su término, cualquiera sea la causa de este."),
            art("Las disposiciones contenidas en este instrumento obligan tanto a los trabajadores contratados bajo la modalidad de contrato indefinido como a aquellos con contrato a plazo fijo, por obra o faena, a tiempo parcial, en régimen de subcontratación, o bajo cualquier otra forma de vinculación laboral reconocida por la ley."),
            art("El desconocimiento de las normas aquí establecidas no eximirá de responsabilidad a quien las contravenga. La administración se obliga a difundir adecuadamente el contenido de este Reglamento, proporcionando a cada trabajador un ejemplar al momento de su contratación y dejando constancia escrita de su recepción."),
            art("Las disposiciones de este Reglamento se entenderán complementarias y no sustitutivas de las normas legales, los contratos individuales y colectivos de trabajo, y las demás regulaciones internas que se dicten en uso de las facultades de administración. En caso de conflicto, prevalecerán las normas de mayor jerarquía."),
            art(`Corresponderá a la administración remitir copia de este Reglamento a ${d.flexibleLegalWording ? "la autoridad sanitaria y a la autoridad laboral respectivas" : "al Ministerio de Salud y a la Inspección del Trabajo correspondiente"} dentro del plazo legal, contado desde la fecha de su entrada en vigencia.`),
        ],
    };
}

/* ═══════════════════════════════════════════
   CAPÍTULO 3 — PRINCIPIOS GENERALES
   ═══════════════════════════════════════════ */
function moduloPrincipios(): ReglamentoSection {
    return {
        title: "PRINCIPIOS GENERALES",
        content: [
            plain("Los principios que se enuncian a continuación constituyen el fundamento ético y normativo sobre el cual se construyen las relaciones laborales al interior de la organización."),
            art("Las relaciones laborales se fundan en los principios de buena fe, respeto mutuo, colaboración y cumplimiento de las obligaciones recíprocas que emanan de la ley y del contrato de trabajo. Se espera de cada trabajador una conducta acorde con estos valores."),
            art("Se reconoce y garantiza a todos los trabajadores el ejercicio pleno de sus derechos fundamentales, en particular el derecho a la integridad física y psíquica, la no discriminación, la libertad de conciencia, la protección de la vida privada y la honra personal, conforme a lo dispuesto en la Constitución y las leyes."),
            art("Todo trabajador tiene derecho a desempeñar sus funciones en un ambiente laboral libre de violencia, acoso y discriminación. La administración adoptará las medidas preventivas y correctivas necesarias para resguardar la dignidad de las personas y promover relaciones laborales armónicas."),
            art("Se velará por la igualdad de oportunidades en el acceso al empleo, la capacitación, la promoción y las condiciones de trabajo, prohibiendo toda forma de discriminación que no se base en la capacidad profesional o idoneidad personal del trabajador."),
            art("Estos principios informan la interpretación y aplicación de todas las normas contenidas en el presente Reglamento y deberán ser observados por empleadores y trabajadores en el ejercicio de sus respectivos derechos y obligaciones."),
        ],
    };
}

/* ═══════════════════════════════════════════
   CAPÍTULO 4 — DERECHOS DEL EMPLEADOR
   ═══════════════════════════════════════════ */
function moduloDerechosEmpleador(): ReglamentoSection {
    return {
        title: "DERECHOS Y FACULTADES DEL EMPLEADOR",
        content: [
            plain("Sin perjuicio de los derechos que asisten a los trabajadores, el empleador conserva las prerrogativas de dirección y administración que la ley le confiere."),
            art("En ejercicio de su potestad de dirección, el empleador tiene la facultad de organizar, planificar y dirigir las actividades productivas, distribuyendo las funciones y tareas entre sus trabajadores conforme a las necesidades del negocio y respetando en todo momento la dignidad de las personas."),
            art("Corresponderá a la administración determinar la forma, condiciones y oportunidad del trabajo, establecer turnos y horarios de funcionamiento, efectuar las adecuaciones organizacionales que sean necesarias, y designar a los trabajadores en los puestos que estime convenientes."),
            art("Será facultad del empleador modificar las condiciones de trabajo en la medida que se ajusten al ius variandi reconocido por la ley, sin que ello implique menoscabo de los derechos del trabajador ni alteración sustancial de las condiciones pactadas."),
            art("Es derecho del empleador exigir de sus trabajadores el cumplimiento íntegro de las obligaciones pactadas, el respeto a las normas de este Reglamento, y la observancia de las instrucciones que se impartan para el correcto desempeño de las labores y la buena marcha de la organización."),
            art("La administración podrá establecer sistemas de control y evaluación del desempeño, implementar tecnologías para la gestión de asistencia y productividad, y adoptar las medidas internas que considere adecuadas, siempre dentro del marco legal vigente y con pleno respeto a los derechos fundamentales de los trabajadores."),
        ],
    };
}

/* ═══════════════════════════════════════════
   CAPÍTULO 5 — OBLIGACIONES DEL TRABAJADOR
   ═══════════════════════════════════════════ */
function moduloObligacionesTrabajador(): ReglamentoSection {
    return {
        title: "OBLIGACIONES DEL TRABAJADOR",
        content: [
            plain("En el marco de la relación laboral, los trabajadores asumen las siguientes obligaciones esenciales, cuyo cumplimiento resulta indispensable para la buena marcha de la organización."),
            art("Son obligaciones esenciales de todo trabajador: cumplir fielmente con las estipulaciones de su contrato de trabajo, desempeñar las funciones asignadas con diligencia, responsabilidad y dedicación, respetar las instrucciones legítimas de sus superiores jerárquicos, y mantener una conducta compatible con la buena convivencia laboral."),
            art("Cada trabajador deberá presentarse a sus labores en condiciones físicas y mentales adecuadas para el desempeño seguro de sus funciones, manteniendo su lugar de trabajo limpio y ordenado, y utilizando correctamente los equipos, herramientas y materiales que le sean proporcionados."),
            art("Todos los trabajadores están obligados a guardar confidencialidad respecto de toda información comercial, técnica, financiera, estratégica y de clientes a la que tengan acceso en razón de su cargo, tanto durante la vigencia de la relación laboral como con posterioridad a su término."),
            art("Es deber de todo trabajador informar oportunamente a su jefe directo de cualquier anomalía, desperfecto, situación de riesgo, accidente o cuasi accidente que detecte en el desempeño de sus funciones, así como de cualquier impedimento para asistir a su trabajo o cumplir con sus obligaciones."),
            art("Los trabajadores deberán participar en las actividades de capacitación, inducción y entrenamiento que la organización disponga, especialmente aquellas relacionadas con la prevención de riesgos laborales, el cumplimiento normativo y el desarrollo de competencias para el ejercicio de sus funciones."),
            art("Todo trabajador deberá conducirse con respeto, cortesía y profesionalismo hacia sus compañeros de trabajo, superiores, subordinados, clientes, proveedores y cualquier persona con la que interactúe en el contexto de sus funciones laborales."),
        ],
    };
}

/* ═══════════════════════════════════════════
   CAPÍTULO 6 — JORNADA Y DESCANSOS
   ═══════════════════════════════════════════ */
function moduloJornada(d: ReglamentoData): ReglamentoSection {
    const jornada = safe(d.jornadaGeneral) || "la jornada establecida en el contrato individual de trabajo";

    const content: ContentItem[] = [
        plain("En concordancia con las facultades de organización del empleador, la jornada laboral se regirá por las disposiciones que se establecen a continuación."),
        art(`La jornada ordinaria de trabajo será de ${jornada}. La distribución de la jornada, los turnos y los descansos dentro de ella se establecerán conforme a las necesidades operativas, respetando en todo caso los límites máximos legales.`),
        art("La jornada ordinaria no podrá exceder de cuarenta y cuatro horas semanales, distribuidas en no más de seis ni menos de cinco días, conforme a la reducción progresiva establecida por la ley. Esta jornada máxima continuará disminuyendo gradualmente según el calendario legal, hasta alcanzar las cuarenta horas semanales. La jornada diaria no superará las diez horas, salvo los casos de distribución excepcional que la ley autoriza. Se garantizará un descanso semanal de al menos un día, preferentemente el domingo."),
        art("Las horas extraordinarias solo podrán pactarse para atender necesidades o situaciones temporales. Deberán constar por escrito, no excederán de dos horas por día, y se remunerarán con un recargo del cincuenta por ciento sobre el sueldo convenido para la jornada ordinaria."),
    ];

    if (d.controlAsistencia === "si") {
        content.push(
            art("La organización mantendrá un sistema de control de asistencia mediante el cual todo trabajador deberá registrar personalmente su hora de ingreso y salida de forma diaria. Queda estrictamente prohibido registrar la asistencia en nombre de otro. El registro fraudulento será considerado falta grave que podrá dar lugar a la terminación del contrato.")
        );
    } else {
        content.push(
            art("El control de la asistencia y la puntualidad se realizará mediante los mecanismos que la administración disponga, los cuales deberán ajustarse a la normativa laboral vigente. Cada trabajador es responsable de cumplir estrictamente con los horarios establecidos en su contrato y en las instrucciones internas.")
        );
    }

    content.push(
        art("Los atrasos e inasistencias injustificadas facultarán al empleador para aplicar los descuentos de remuneraciones que procedan conforme a la ley, sin perjuicio de las medidas disciplinarias que correspondan según la gravedad y reiteración de la falta. El trabajador deberá justificar documentalmente toda ausencia dentro de las veinticuatro horas siguientes."),
        art("Los trabajadores tendrán derecho a un descanso para colación de al menos treinta minutos dentro de la jornada, el cual no se considerará como tiempo trabajado. La administración podrá establecer turnos escalonados de colación cuando la naturaleza de las operaciones así lo requiera.")
    );

    return { title: "JORNADA DE TRABAJO Y DESCANSOS", content };
}

/* ═══════════════════════════════════════════
   CAPÍTULO 7 — NORMAS DE CONDUCTA Y PROHIBICIONES
   ═══════════════════════════════════════════ */
function moduloNormasInternas(d: ReglamentoData): ReglamentoSection {
    const content: ContentItem[] = [
        plain("Complementando las obligaciones establecidas en los capítulos precedentes, se establecen las siguientes normas de conducta y prohibiciones específicas."),
        art("Todo trabajador deberá observar una conducta de respeto, honestidad y colaboración en sus relaciones laborales, contribuyendo activamente a mantener un ambiente de trabajo armónico, seguro y productivo. La convivencia laboral es responsabilidad compartida de todos los integrantes de la organización."),
    ];

    if (d.prohibiciones && d.prohibiciones.length > 0) {
        content.push(plain("Se prohíbe expresamente a todo trabajador incurrir en las siguientes conductas:"));
        d.prohibiciones.forEach((p) => {
            const texto = prohibicionTextos[p];
            if (texto) content.push(art(texto));
        });
    }

    // Complemento si pocas prohibiciones
    if (!d.prohibiciones || d.prohibiciones.length < 4) {
        content.push(
            art("Con independencia de las prohibiciones anteriormente enumeradas, queda prohibida toda conducta que atente contra la moral, las buenas costumbres, la seguridad de las personas o el patrimonio de la organización. Los trabajadores deberán abstenerse de realizar cualquier acción u omisión que pueda causar daño.")
        );
        content.push(
            art("Queda prohibido realizar actividades comerciales o de otra naturaleza por cuenta propia o de terceros dentro de la jornada laboral o utilizando recursos de la organización, salvo autorización expresa y por escrito de la administración.")
        );
        content.push(
            art("Se prohíbe fumar o utilizar cigarrillos electrónicos dentro de las dependencias, salvo en las áreas expresamente habilitadas para ello, si las hubiere, conforme a la normativa sobre ambientes libres de humo de tabaco.")
        );
    }

    content.push(
        art("La enumeración de prohibiciones contenida en este capítulo no es taxativa. La administración se reserva la facultad de complementar estas disposiciones mediante instrucciones internas, circulares o comunicaciones formales que se pongan en conocimiento de los trabajadores oportunamente.")
    );

    return { title: "NORMAS GENERALES DE CONDUCTA Y PROHIBICIONES", content };
}

/* ═══════════════════════════════════════════
   CAPÍTULO 8 — HIGIENE Y SEGURIDAD
   (adaptado por rubro)
   ═══════════════════════════════════════════ */
function moduloHigiene(d: ReglamentoData): ReglamentoSection {
    const ctx = adaptarSegunRubro(d.categoriaRiesgo);

    const content: ContentItem[] = [
        plain("En cumplimiento del deber general de protección que la legislación sobre accidentes del trabajo y enfermedades profesionales impone al empleador, se establecen las siguientes disposiciones en materia de higiene y seguridad."),
        art(`La organización adoptará todas las medidas necesarias para proteger eficazmente la vida y la salud de los trabajadores, manteniendo las condiciones adecuadas de higiene y seguridad en ${ctx.ambienteLaboral}, en conformidad con la legislación sobre seguro social contra riesgos de accidentes del trabajo y enfermedades profesionales, y con las normas reglamentarias sobre prevención de riesgos.`),
        art(`Se identifican como riesgos principales asociados a la actividad: ${ctx.riesgosEjemplo}. La organización elaborará y mantendrá actualizado el reglamento de seguridad contemplado por la normativa reglamentaria, implementando las medidas de control y mitigación que resulten pertinentes para cada uno de los riesgos identificados.`),
        art(`Entre las medidas preventivas que se adoptarán se incluyen: ${ctx.medidasPreventivas}. Los trabajadores deberán colaborar activamente en la mantención de estas condiciones y cumplir con las disposiciones del Departamento de Prevención de Riesgos o del encargado de seguridad, según corresponda.`),
        art("Cada trabajador está obligado a cumplir con las normas e instrucciones de higiene y seguridad, utilizar los elementos de protección que se le proporcionen, participar en las actividades de capacitación en prevención de riesgos, y cooperar en la mantención de condiciones seguras de trabajo. El trabajador que detecte condiciones de riesgo tiene el derecho y la obligación de informarlo de inmediato."),
        art("Queda prohibido realizar acciones que comprometan la seguridad propia o de terceros, desactivar o alterar dispositivos de seguridad, retirar protecciones de maquinarias, bloquear salidas de emergencia, o negarse a utilizar los elementos de protección personal cuando sean requeridos."),
        art("La organización mantendrá en sus dependencias los elementos necesarios para prestar primeros auxilios, señalización de seguridad adecuada, vías de evacuación despejadas, equipos contra incendios operativos, y un plan de emergencia actualizado que será dado a conocer a todos los trabajadores."),
    ];

    if (safe(d.mutualidad)) {
        content.push(
            art(`La organización se encuentra adherida a ${d.mutualidad} como organismo administrador del seguro social contra riesgos de accidentes del trabajo y enfermedades profesionales. Todo accidente laboral, por leve que sea, debe ser informado de inmediato al jefe directo para gestionar la denuncia correspondiente dentro de los plazos legales.`)
        );
    }

    content.push(
        art("Todo trabajador que sufra un accidente del trabajo o presente síntomas de enfermedad profesional deberá dar aviso inmediato a su jefe directo. Se realizará la denuncia ante el organismo administrador correspondiente, se facilitará la atención médica oportuna y se adoptarán las medidas preventivas necesarias para evitar la repetición del siniestro."),
        art("Se realizarán periódicamente evaluaciones de los riesgos presentes en los distintos puestos de trabajo, implementando las medidas correctivas que resulten de dichas evaluaciones. Los trabajadores deberán colaborar activamente en la identificación de riesgos y en la implementación de las medidas de control.")
    );

    return { title: "HIGIENE Y SEGURIDAD EN EL TRABAJO", content };
}

/* ═══════════════════════════════════════════
   CAPÍTULO 9 — PROCEDIMIENTO DISCIPLINARIO
   ═══════════════════════════════════════════ */
function moduloProcedimientoDisciplinario(d: ReglamentoData): ReglamentoSection {
    const content: ContentItem[] = [
        plain("El régimen disciplinario que se establece a continuación tiene por objeto regular las consecuencias del incumplimiento de las normas contenidas en este Reglamento."),
        art("Las infracciones a las obligaciones y prohibiciones contenidas en este Reglamento, en el contrato de trabajo o en las instrucciones legítimas del empleador, serán sancionadas conforme al procedimiento disciplinario establecido en el presente capítulo, sin perjuicio de las acciones civiles, penales o administrativas que pudieren corresponder."),
        art("La aplicación de toda sanción disciplinaria se realizará con estricto respeto al debido proceso, otorgando al trabajador la posibilidad de ser escuchado y presentar sus descargos antes de la adopción de la medida. Las sanciones serán proporcionales a la gravedad de la falta cometida."),
    ];

    switch (d.tipoProcedimiento) {
        case "escalonado":
            content.push(
                plain("Se aplicará un sistema disciplinario de carácter progresivo y escalonado, que contempla las siguientes etapas sucesivas:")
            );
            content.push(
                art("Primera etapa — Amonestación verbal: ante la primera manifestación de una falta leve, el superior jerárquico realizará una amonestación verbal al trabajador, instándolo a corregir su conducta. Se dejará constancia interna del hecho en el registro del trabajador.")
            );
            content.push(
                art(`Segunda etapa — Amonestación por escrito: en caso de reincidencia o ante una falta de mayor entidad, se aplicará una amonestación formal por escrito, que se incorporará a la carpeta personal del trabajador. Se entregará copia al trabajador y, cuando la ley lo exija, se remitirá a ${d.flexibleLegalWording ? "la autoridad administrativa competente" : "la Inspección del Trabajo respectiva"}.`)
            );
            content.push(
                art("Tercera etapa — Multa: ante la reiteración de faltas previamente amonestadas, el empleador podrá aplicar una multa de hasta el veinticinco por ciento de la remuneración diaria del infractor. El producto de las multas se destinará a los fines que la ley establece. Lo anterior se aplicará dentro de los límites establecidos por la legislación laboral vigente.")
            );
            content.push(
                art("Cuarta etapa — Desvinculación: cuando la gravedad o reiteración de las faltas lo justifique, se procederá a la terminación del contrato de trabajo conforme a las causales legales aplicables, respetando el debido proceso y los derechos del trabajador, incluidas las indemnizaciones que procedan.")
            );
            break;

        case "segun_gravedad":
            content.push(
                art("Se aplicarán las medidas disciplinarias atendiendo a la naturaleza, gravedad, circunstancias y consecuencias de cada infracción, evaluando caso a caso la proporcionalidad de la sanción. No será necesario agotar etapas previas cuando la gravedad de la falta así lo amerite.")
            );
            content.push(
                art("Faltas leves: aquellas infracciones menores que no causan perjuicio significativo, tales como atrasos aislados, descuidos menores o incumplimientos de baja intensidad. Podrán ser sancionadas con amonestación verbal o escrita.")
            );
            content.push(
                art("Faltas moderadas: aquellas que implican un incumplimiento relevante de las obligaciones laborales o de las normas de este Reglamento, o que causan un perjuicio apreciable a la organización o a la convivencia laboral. Podrán ser sancionadas con amonestación escrita o multa de hasta el veinticinco por ciento de la remuneración diaria, dentro de los límites establecidos por la legislación laboral vigente.")
            );
            content.push(
                art("Faltas graves: aquellas que comprometen seriamente la seguridad de las personas, el patrimonio o la reputación de la organización, o que configuran alguna de las causales legales de terminación. Podrán dar lugar a la terminación inmediata del contrato de trabajo conforme a la ley.")
            );
            break;

        case "personalizado":
            if (safe(d.procedimientoDisciplinario)) {
                content.push(
                    plain("Se ha establecido el siguiente procedimiento disciplinario particular para la gestión de las infracciones al presente Reglamento:")
                );
                content.push(art(d.procedimientoDisciplinario));
            } else {
                content.push(
                    art(`El procedimiento disciplinario será determinado conforme a las circunstancias de cada caso, respetando siempre los principios de proporcionalidad, debido proceso y los derechos fundamentales del trabajador. En todo caso, cualquier sanción podrá ser reclamada ante ${d.flexibleLegalWording ? "la autoridad administrativa competente" : "la Inspección del Trabajo"} de conformidad a la ley.`)
                );
            }
            break;

        default:
            content.push(
                art("Las sanciones aplicables incluyen, según la gravedad de la infracción: amonestación verbal, amonestación por escrito, multa de hasta el veinticinco por ciento de la remuneración diaria, y terminación del contrato de trabajo en los casos legalmente procedentes. Lo anterior se aplicará dentro de los límites establecidos por la legislación laboral vigente.")
            );
    }

    content.push(
        art(`De toda sanción aplicada se dejará constancia por escrito, notificándose al trabajador afectado, quien deberá firmar la respectiva constancia. En caso de negativa a firmar, se dejará testimonio de ello ante un testigo. El trabajador tendrá derecho a reclamar ante ${d.flexibleLegalWording ? "la autoridad administrativa competente" : "la Inspección del Trabajo competente"} si considerare que la medida es injusta o desproporcionada.`),
        art("Se llevará un registro interno de las sanciones aplicadas, el cual será de carácter reservado y se utilizará exclusivamente para efectos de evaluar la reincidencia y la proporcionalidad de las medidas disciplinarias futuras.")
    );

    return { title: "PROCEDIMIENTO DISCIPLINARIO", content };
}

/* ═══════════════════════════════════════════
   CAPÍTULO 10 — DISPOSICIONES GENERALES
   ═══════════════════════════════════════════ */
function moduloDisposicionesGenerales(d: ReglamentoData): ReglamentoSection {
    const content: ContentItem[] = [
        plain("Las disposiciones que se establecen a continuación regulan aspectos generales de la relación laboral no abordados específicamente en los capítulos precedentes."),
        art("Las remuneraciones se pagarán en moneda de curso legal, en la forma, período y lugar convenidos en el contrato individual de trabajo, con las deducciones legales y convencionales que correspondan. El trabajador recibirá junto con su remuneración la liquidación de sueldo respectiva, en la que se detallarán los haberes, descuentos y monto líquido a pagar."),
        art("Los trabajadores tendrán derecho al feriado anual y a los permisos que establece la legislación laboral vigente. Las vacaciones se otorgarán preferentemente en forma continua, pudiendo fraccionarse de común acuerdo entre las partes. La administración establecerá un calendario de vacaciones que concilie las necesidades operativas con las preferencias de los trabajadores."),
        art("Las licencias médicas deberán ser presentadas por el trabajador dentro del plazo legal correspondiente. La organización las tramitará ante el organismo previsional respectivo, sin que ello signifique pronunciamiento sobre su procedencia. El trabajador deberá abstenerse de realizar actividades incompatibles con su estado de salud durante el período de licencia."),
        art("Toda terminación del contrato de trabajo se ajustará a las disposiciones legales vigentes, debiendo comunicarse el despido por escrito, indicando la causal invocada y los hechos en que se funda. Se entregarán al trabajador los certificados, finiquito y demás documentos que la ley exige, dentro de los plazos establecidos."),
    ];

    // Comunicaciones — usar email solo si existe
    if (safe(d.email)) {
        content.push(
            art(`Para efectos de comunicaciones oficiales, la organización podrá utilizar medios electrónicos, incluyendo el correo electrónico corporativo y las plataformas digitales que se establezcan. Las comunicaciones enviadas al correo institucional del trabajador se entenderán válidamente notificadas. Para consultas sobre este Reglamento, los trabajadores podrán dirigirse a ${d.email}.`)
        );
    } else {
        content.push(
            art("Para efectos de comunicaciones oficiales, la organización podrá utilizar medios electrónicos, incluyendo el correo electrónico corporativo y las plataformas digitales que se establezcan. Las comunicaciones enviadas al correo institucional del trabajador se entenderán válidamente notificadas.")
        );
    }

    content.push(
        art("Los trabajadores deberán comunicar oportunamente cualquier cambio en sus datos personales, domicilio, estado civil, cargas familiares o situación previsional, a fin de mantener actualizada la información necesaria para la correcta administración de la relación laboral y el cumplimiento de las obligaciones legales.")
    );

    return { title: "DISPOSICIONES GENERALES", content };
}

/* ═══════════════════════════════════════════
   CAPÍTULO 11 — VIGENCIA Y COMUNICACIÓN
   ═══════════════════════════════════════════ */
function moduloVigencia(): ReglamentoSection {
    return {
        title: "VIGENCIA Y COMUNICACIÓN",
        content: [
            art("El presente Reglamento Interno de Orden, Higiene y Seguridad entrará en vigencia una vez transcurrido el plazo legal contado desde la fecha en que se haya puesto en conocimiento de los trabajadores, mediante la entrega del ejemplar correspondiente a cada uno de ellos, conforme al procedimiento establecido por la legislación vigente."),
            art("Las normas del presente Reglamento se entenderán incorporadas a los contratos individuales de trabajo vigentes y a los que se celebren con posterioridad, mientras se mantenga en vigor. Los trabajadores no podrán alegar desconocimiento de sus disposiciones una vez cumplido el procedimiento de difusión."),
            art("Corresponderá a la administración remitir copia del presente Reglamento a las autoridades competentes, de conformidad con la normativa vigente y dentro de los plazos legales aplicables."),
            art("Se deja constancia que este Reglamento ha sido elaborado dando cumplimiento a las exigencias de la legislación laboral en materia de orden, higiene y seguridad, de la normativa sobre prevención de riesgos profesionales, de la legislación sobre prevención del acoso laboral, sexual y la violencia en el trabajo, y de la demás normativa concordante."),
        ],
    };
}

/* ═══════════════════════════════════════════
   CAPÍTULO FINAL — ACTUALIZACIÓN
   ═══════════════════════════════════════════ */
function moduloActualizacion(): ReglamentoSection {
    return {
        title: "ACTUALIZACIÓN Y MODIFICACIONES",
        content: [
            plain("Las disposiciones de este capítulo regulan la facultad del empleador para modificar el presente Reglamento y el procedimiento para dar validez a dichas modificaciones."),
            art("La organización tendrá la facultad de modificar, complementar o actualizar el presente Reglamento cuando sea necesario para adecuarlo a cambios en la legislación laboral, en la estructura organizacional, en las condiciones de operación o en cualquier otro aspecto que incida en su contenido, de conformidad con la legislación vigente. Toda modificación seguirá el procedimiento legal correspondiente."),
            art("Las modificaciones serán comunicadas formalmente a los trabajadores mediante la entrega personal de un ejemplar actualizado o del anexo que contenga las enmiendas, dejándose constancia escrita de su recepción. Las modificaciones entrarán en vigencia una vez transcurrido el plazo legal contado desde su notificación a los trabajadores."),
            art("Corresponderá a la administración remitir copia de las modificaciones a las autoridades competentes, de conformidad con la normativa vigente y dentro de los plazos legales aplicables."),
            art("Corresponderá a la administración revisar periódicamente el contenido de este Reglamento, al menos una vez cada dos años, o antes cuando se produzcan reformas legales relevantes, con el objeto de asegurar su permanente adecuación a la legislación vigente y a las mejores prácticas en materia de relaciones laborales, higiene y seguridad."),
            art("Se deja expresa constancia de que las disposiciones del presente Reglamento se interpretarán siempre de conformidad con la legislación vigente al momento de su aplicación. En caso de que alguna disposición resultare contraria a una norma legal posterior, prevalecerá esta última sin que ello afecte la validez de las restantes disposiciones del Reglamento."),
        ],
    };
}

function moduloAdecuacionNormativa(): ReglamentoSection {
    return {
        title: "ADECUACIÓN NORMATIVA",
        content: [
            art("ARTÍCULO N° — Adecuación normativa: El presente Reglamento se dicta conforme a la legislación laboral vigente a la fecha de su emisión. En caso de modificaciones legales posteriores que afecten su contenido, la empresa procederá a su actualización de conformidad con la normativa aplicable."),
        ],
    };
}

/* ═══════════════════════════════════════════
   PREVENCIÓN DEL ACOSO Y VIOLENCIA EN EL TRABAJO (LEY KARIN)
   ═══════════════════════════════════════════ */
function moduloLeyKarin(d: ReglamentoData): ReglamentoSection {
    return {
        title: "PREVENCIÓN DEL ACOSO LABORAL, SEXUAL Y VIOLENCIA EN EL TRABAJO",
        content: [
            plain("En cumplimiento de la legislación vigente sobre prevención, investigación y sanción del acoso laboral, acoso sexual y la violencia en el trabajo, la organización establece las siguientes disposiciones."),
            art("La organización se compromete a mantener un ambiente laboral libre de acoso laboral, acoso sexual y violencia en el trabajo, adoptando las medidas de prevención, protección y reparación que la ley exige. Estas obligaciones alcanzan a las relaciones entre trabajadores, y entre estos y el empleador, sus representantes, clientes, proveedores y cualquier persona que frecuente el lugar de trabajo."),
            art("Se entiende por acoso laboral toda conducta constitutiva de agresión u hostigamiento ejercida por el empleador o por uno o más trabajadores, en contra de otro u otros trabajadores, por cualquier medio, que tenga como resultado el menoscabo, maltrato o humillación, o que amenace o perjudique la situación laboral o las oportunidades de empleo de la persona afectada, sea que se manifieste una sola vez o de manera reiterada."),
            art("Se entiende por acoso sexual el que una persona realice, en forma indebida, por cualquier medio, requerimientos de carácter sexual, no consentidos por quien los recibe y que amenacen o perjudiquen su situación laboral o sus oportunidades de empleo."),
            art("Se entiende por violencia en el trabajo aquellas conductas ejercidas por terceros ajenos a la relación laboral, tales como clientes, proveedores o usuarios, que afecten a los trabajadores durante la prestación de sus servicios, con ocasión de ella o como consecuencia de esta."),
            art("La organización elaborará, implementará y difundirá un protocolo de prevención del acoso laboral, acoso sexual y la violencia en el trabajo, el cual contendrá: la identificación de los peligros y la evaluación de los riesgos psicosociales asociados, las medidas de prevención a adoptar, las medidas de control e información, y las medidas de resguardo de la privacidad y la honra de los involucrados."),
            art(`Toda persona afectada por conductas de acoso o violencia podrá presentar su denuncia por escrito ante la administración o ante ${d.flexibleLegalWording ? "la autoridad administrativa competente" : "la Inspección del Trabajo competente"}. Recibida la denuncia, el empleador adoptará de inmediato las medidas de resguardo necesarias respecto de los involucrados, tales como la separación de los espacios físicos o la redistribución del tiempo de jornada, considerando la gravedad de los hechos y las posibilidades derivadas de las condiciones de trabajo.`),
            art(`La investigación interna se llevará a cabo conforme al procedimiento establecido en el protocolo de prevención, respetando los principios de confidencialidad, bilateralidad, celeridad y debido proceso. La investigación deberá concluirse en los plazos legales y sus conclusiones serán remitidas a ${d.flexibleLegalWording ? "la autoridad competente" : "la Inspección del Trabajo"} para su revisión. Se prohíbe toda forma de represalia contra los denunciantes o testigos.`),
            art("Los trabajadores tienen la obligación de participar en las actividades de capacitación y sensibilización sobre prevención del acoso y la violencia que la organización disponga. La administración realizará al menos una capacitación anual en esta materia, sin perjuicio de las actividades adicionales que se estimen necesarias."),
        ],
    };
}

/* ═══════════════════════════════════════════
   MÓDULOS CONDICIONALES
   ═══════════════════════════════════════════ */

function moduloTeletrabajo(): ReglamentoSection {
    return {
        title: "TELETRABAJO Y TRABAJO A DISTANCIA",
        content: [
            plain("En conformidad con la legislación que regula el trabajo a distancia y teletrabajo, se establecen las siguientes normas para quienes presten servicios bajo esta modalidad."),
            art("La organización contempla la modalidad de trabajo a distancia o teletrabajo para aquellos cargos o funciones cuya naturaleza lo permita. La prestación de servicios bajo esta modalidad deberá constar por escrito en el contrato de trabajo o en un anexo, el cual especificará el lugar de prestación de servicios, la jornada aplicable, los mecanismos de supervisión y los equipos proporcionados."),
            art("Las partes podrán acordar, al inicio o durante la vigencia de la relación laboral, la modalidad de teletrabajo. Del mismo modo, de conformidad con la legislación vigente, cualquiera de las partes podrá solicitar la reversibilidad de la modalidad de trabajo a distancia, volviendo a la prestación presencial de los servicios, en las condiciones y plazos que se hayan pactado en el contrato o anexo correspondiente. Lo anterior se entenderá sin perjuicio de los acuerdos específicos contenidos en el contrato o anexo respectivo, conforme a la legislación vigente."),
            art("Los trabajadores que se desempeñen bajo esta modalidad deberán cumplir con la jornada pactada, mantenerse disponibles y conectados durante el horario convenido, y reportar sus avances conforme a los mecanismos establecidos por la administración. En caso de teletrabajo sin jornada pactada, el trabajador podrá distribuir libremente su tiempo."),
            art("Corresponderá al empleador proporcionar los equipos y herramientas necesarios para el desempeño del trabajo remoto, o compensar al trabajador por el uso de equipos propios, conforme a lo pactado en el respectivo anexo. Los costos de operación, mantención y reparación de los equipos serán de cargo del empleador, así como los costos de servicios de enlace y conectividad, salvo pacto en contrario."),
            art("Será responsabilidad de la administración comunicar al trabajador remoto las condiciones de seguridad y salud a que debe sujetarse, efectuar la identificación y evaluación de los riesgos del puesto de teletrabajo, e informar las medidas preventivas correspondientes. El trabajador no podrá ser obligado a trabajar en condiciones que no cumplan con los requisitos de seguridad informados."),
            art("El trabajador remoto mantendrá las mismas obligaciones de confidencialidad, seguridad de la información y cumplimiento normativo que rigen en las dependencias de la organización. Deberá garantizar condiciones ergonómicas adecuadas en su lugar de trabajo conforme a las instrucciones que se le impartan y permitir las inspecciones que la ley autoriza."),
            art("Se garantiza el derecho a la desconexión digital, de conformidad con la legislación vigente, conforme al cual el trabajador no estará obligado a responder comunicaciones, órdenes u otros requerimientos del empleador durante un período mínimo de doce horas continuas en un período de veinticuatro horas. El empleador deberá respetar este derecho y no podrá establecer consecuencias adversas por su ejercicio."),
        ],
    };
}

function moduloEPP(d: ReglamentoData): ReglamentoSection {
    const ctx = adaptarSegunRubro(d.rubro);

    return {
        title: "EQUIPOS DE PROTECCIÓN PERSONAL",
        content: [
            art(`La organización proporcionará gratuitamente a sus trabajadores los Equipos de Protección Personal necesarios para el desempeño seguro de sus funciones, incluyendo: ${ctx.eppContexto}.`),
            art("Es obligación de todo trabajador utilizar correctamente los EPP asignados durante toda la jornada laboral o cuando las condiciones de trabajo así lo requieran. La negativa a utilizarlos será considerada falta grave y facultará al empleador para impedir el acceso del trabajador a la zona de riesgo."),
            art("Los trabajadores deberán velar por el buen estado de conservación de los EPP entregados, informando oportunamente sobre cualquier deterioro, defecto o necesidad de reemplazo. Se procederá a la reposición inmediata de los elementos defectuosos o vencidos."),
            art("Se realizarán capacitaciones periódicas sobre el uso correcto de los EPP, las situaciones en que deben emplearse, la forma de almacenamiento y los riesgos asociados a su no utilización. La asistencia a estas capacitaciones es obligatoria para todo el personal expuesto a riesgos."),
        ],
    };
}

function moduloComite(): ReglamentoSection {
    return {
        title: "COMITÉ PARITARIO DE HIGIENE Y SEGURIDAD",
        content: [
            plain("Cuando la empresa cuente con veinticinco o más trabajadores, deberá constituirse un Comité Paritario de Higiene y Seguridad, de conformidad con la legislación vigente sobre constitución y funcionamiento de estos organismos."),
            art("La organización constituirá y mantendrá un Comité Paritario de Higiene y Seguridad cuando corresponda conforme a la normativa vigente, integrado por tres representantes del empleador y tres representantes elegidos por los trabajadores, con sus respectivos suplentes. Los representantes de los trabajadores serán elegidos mediante votación secreta y directa."),
            art("El Comité Paritario tiene entre sus funciones: investigar las causas de los accidentes del trabajo y enfermedades profesionales ocurridos en la empresa, decidir si el accidente o enfermedad se debió a negligencia inexcusable del trabajador, promover la adopción de medidas preventivas, instruir a los trabajadores sobre la correcta utilización de los elementos de protección, y vigilar el cumplimiento de las normas de higiene y seguridad."),
            art("Los representantes de los trabajadores en el Comité Paritario gozarán de fuero en los términos que establece la ley. Los miembros del Comité dispondrán del tiempo necesario para cumplir sus funciones sin reducción de su remuneración. Las reuniones se realizarán en forma ordinaria al menos una vez al mes y en forma extraordinaria cuando las circunstancias lo requieran o cuando ocurra un accidente que cause la muerte de un trabajador."),
            art("Todos los trabajadores están obligados a colaborar con el Comité Paritario, informando sobre condiciones inseguras, participando en las actividades preventivas que se programen, y acatando las instrucciones y recomendaciones que emanen de dicho organismo. Las resoluciones del Comité serán obligatorias tanto para la empresa como para los trabajadores."),
        ],
    };
}

/* ═══════════════════════════════════════════
   MÓDULOS POR TAMAÑO
   ═══════════════════════════════════════════ */

function moduloEmpresaPequena(): ReglamentoSection {
    return {
        title: "DISPOSICIONES PARA EMPRESAS DE MENOR TAMAÑO",
        content: [
            art("Dada la estructura organizacional, las funciones administrativas, de supervisión y de gestión de personal podrán ser ejercidas directamente por el representante legal o por quien este designe, sin necesidad de establecer niveles jerárquicos intermedios."),
            art("La comunicación interna se realizará preferentemente de forma directa, sin perjuicio de que se puedan establecer canales formales adicionales cuando se estime necesario para el buen funcionamiento de las operaciones."),
            art("Se podrán adoptar procedimientos simplificados para la gestión de permisos, licencias, vacaciones y demás solicitudes del personal, siempre que se respeten los derechos establecidos por la legislación laboral y los contratos individuales."),
            art("En materia de prevención de riesgos, se designará al menos un trabajador encargado de velar por el cumplimiento de las normas de higiene y seguridad, sin perjuicio de la responsabilidad directa del empleador en esta materia."),
        ],
    };
}

function moduloEmpresaMediana(): ReglamentoSection {
    return {
        title: "ORGANIZACIÓN Y ESTRUCTURA INTERNA",
        content: [
            art("La organización mantendrá una estructura definida, con niveles de supervisión y jefaturas que aseguren la correcta dirección, coordinación y control de las actividades laborales en cada área o departamento."),
            art("Los trabajadores reportarán a su jefe directo, quien será el responsable de asignar tareas, supervisar el cumplimiento de las obligaciones laborales, evaluar el desempeño y aplicar las medidas disciplinarias de primer nivel cuando corresponda."),
            art("Se establecerán procedimientos formales para la gestión de recursos humanos, incluyendo procesos de selección, inducción, capacitación, evaluación del desempeño, solicitud de permisos y licencias, y tramitación de reclamos internos."),
            art("Se implementarán canales institucionalizados de comunicación interna que aseguren que las políticas, instrucciones y decisiones de la administración sean difundidas oportunamente a todos los trabajadores afectados."),
        ],
    };
}

function moduloEmpresaFormalAmpliada(): ReglamentoSection {
    return {
        title: "ESTRUCTURA CORPORATIVA Y GESTIÓN DEL PERSONAL",
        content: [
            art("La organización mantendrá una estructura formal con departamentos, áreas funcionales y líneas de reporte claramente definidas, asegurando una gestión eficiente y profesional de los recursos humanos."),
            art("Existirá un área o departamento de recursos humanos, o quien haga sus veces, encargado de administrar las relaciones laborales, velar por el cumplimiento de la normativa interna, gestionar los procesos de selección, contratación, capacitación, desarrollo profesional y desvinculación del personal."),
            art("Se implementará un sistema formal de evaluación del desempeño que permita medir objetivamente la contribución de cada trabajador, identificar necesidades de capacitación y fundamentar las decisiones relativas a promociones, incentivos y desarrollo de carrera."),
            art("Se establecerá un procedimiento formal de reclamos y sugerencias que permita a los trabajadores canalizar sus inquietudes de manera estructurada, asegurando el debido proceso y la respuesta oportuna por parte de la administración."),
            art("Se promoverán programas de bienestar laboral orientados a mejorar la calidad de vida de los trabajadores, pudiendo incluir beneficios complementarios, actividades de integración, convenios de salud, y demás iniciativas que fortalezcan el compromiso organizacional."),
        ],
    };
}

/* ═══════════════════════════════════════════
   ENSAMBLADOR PRINCIPAL
   ═══════════════════════════════════════════ */
export function buildReglamento(data: ReglamentoData): ReglamentoSection[] {
    const sections: ReglamentoSection[] = [];

    // ── Capítulos base (siempre presentes) ──
    sections.push(moduloIdentificacion(data));
    sections.push(moduloAmbitoAplicacion(data));
    sections.push(moduloPrincipios());
    sections.push(moduloDerechosEmpleador());
    sections.push(moduloObligacionesTrabajador());
    sections.push(moduloJornada(data));

    // ── Condicional: Teletrabajo ──
    if (data.trabajoRemoto === "si") {
        sections.push(moduloTeletrabajo());
    }

    sections.push(moduloNormasInternas(data));
    sections.push(moduloLeyKarin(data));
    sections.push(moduloHigiene(data));

    // ── Condicionales de seguridad ──
    if (data.usoEPP === "si") {
        sections.push(moduloEPP(data));
    }
    if (data.comiteParitario === "si") {
        sections.push(moduloComite());
    }

    // ── Por tamaño de empresa ──
    switch (data.numTrabajadores) {
        case "10-25":
            sections.push(moduloEmpresaPequena());
            break;
        case "26-50":
            sections.push(moduloEmpresaMediana());
            break;
        case "51+":
            sections.push(moduloEmpresaFormalAmpliada());
            break;
    }

    // ── Capítulos finales (siempre presentes) ──
    sections.push(moduloProcedimientoDisciplinario(data));
    sections.push(moduloDisposicionesGenerales(data));
    sections.push(moduloActualizacion());
    sections.push(moduloAdecuacionNormativa());
    sections.push(moduloVigencia());

    return sections;
}
