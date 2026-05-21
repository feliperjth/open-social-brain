import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const regions = [
  {
    id: "dlpfc",
    name: "Corteza dorsolateral prefrontal",
    tag: "Control ejecutivo",
    color: 0x72a7ff,
    position: [-1.35, 1.08, 0.54],
    scale: [0.48, 0.34, 0.22],
    summary: "Nodo frontal de control ejecutivo: memoria de trabajo, selección de metas, control inhibitorio y ajuste flexible de la conducta.",
    location: "Giro frontal medio/superior, áreas BA 9/46.",
    functions: "Memoria de trabajo, planificación, atención ejecutiva, monitoreo de reglas.",
    network: "Red frontoparietal de control; interacción con red de saliencia.",
    task: "2-back espacial",
    taskCopy: "Evalúa memoria de trabajo y actualización contextual, sensible a la red frontoparietal."
  },
  {
    id: "premotor",
    name: "Corteza premotora",
    tag: "Preparación motora",
    color: 0xd9b66f,
    position: [-0.84, 1.05, 0.84],
    scale: [0.42, 0.26, 0.18],
    summary: "Transforma claves sensoriales en planes de acción y prepara secuencias motoras antes del movimiento.",
    location: "Lóbulo frontal posterior, anterior a M1, BA 6.",
    functions: "Selección de acciones, preparación motora, aprendizaje de secuencias.",
    network: "Circuitos premotor-parietales y ganglios basales.",
    task: "Go / No-Go",
    taskCopy: "Mide preparación de respuesta e inhibición motora ante estímulos frecuentes e infrecuentes."
  },
  {
    id: "auditory",
    name: "Corteza auditiva primaria",
    tag: "Procesamiento sonoro",
    color: 0x55c2b7,
    position: [-0.42, 0.18, 1.18],
    scale: [0.38, 0.18, 0.15],
    summary: "Primer mapa cortical del sonido: codifica frecuencia, intensidad, temporalidad y cambios acústicos rápidos.",
    location: "Giro temporal transverso de Heschl, BA 41/42.",
    functions: "Análisis tonotópico, detección de cambios, integración auditiva temprana.",
    network: "Vía auditiva talamocortical; redes temporales superiores.",
    task: "Oddball auditivo",
    taskCopy: "Presenta tonos frecuentes y desviantes para explorar detección sensorial y respuesta de novedad."
  },
  {
    id: "dmn",
    name: "Red por defecto",
    tag: "Reposo e introspección",
    color: 0xc795ff,
    position: [0.14, 0.88, -0.42],
    scale: [0.42, 0.25, 0.22],
    summary: "Red distribuida activa durante reposo, pensamiento autorreferencial, memoria autobiográfica y simulación mental.",
    location: "Corteza prefrontal medial, precuneus/PCC, angular y temporal medial.",
    functions: "Autorreferencia, prospección, memoria episódica, mente social.",
    network: "Red por defecto medial-temporal y subsistema dorsal medial.",
    task: "Reposo guiado",
    taskCopy: "Alterna fijación externa e introspección breve para observar el perfil conductual asociado al modo por defecto."
  },
  {
    id: "visual",
    name: "Corteza visual primaria",
    tag: "Visión temprana",
    color: 0xef8f74,
    position: [1.34, 0.45, -0.72],
    scale: [0.42, 0.26, 0.18],
    summary: "Mapa retinotópico inicial para bordes, contraste, orientación y organización espacial de la escena visual.",
    location: "Surco calcarino, lóbulo occipital, BA 17.",
    functions: "Contraste, orientación, campo visual, procesamiento visual inicial.",
    network: "Vías dorsal occipitoparietal y ventral occipitotemporal.",
    task: "Detección visual",
    taskCopy: "Detecta breves cambios de contraste; útil para atención sensorial y velocidad perceptual."
  },
  {
    id: "hippocampus",
    name: "Hipocampo",
    tag: "Memoria episódica",
    color: 0xf0c55a,
    position: [0.42, -0.42, 0.42],
    scale: [0.42, 0.16, 0.16],
    summary: "Estructura temporal medial esencial para formar memorias episódicas y mapas relacionales del contexto.",
    location: "Lóbulo temporal medial, formación hipocampal.",
    functions: "Codificación episódica, navegación, asociación contexto-evento.",
    network: "Sistema temporal medial; acoplamiento con red por defecto.",
    task: "Memoria de pares",
    taskCopy: "Codifica pares color-posición y reconoce coincidencias, una versión breve de asociación episódica."
  },
  {
    id: "insula",
    name: "Ínsula anterior",
    tag: "Saliencia",
    color: 0xff8fb3,
    position: [-0.18, 0.28, 0.88],
    scale: [0.28, 0.22, 0.14],
    summary: "Integra señales interoceptivas y detecta eventos relevantes para cambiar entre redes de reposo y control.",
    location: "Corteza insular anterior, profundidad de la cisura lateral.",
    functions: "Interocepción, saliencia, conciencia corporal, cambio de tarea.",
    network: "Red de saliencia junto al cíngulo anterior dorsal.",
    task: "Conteo respiratorio",
    taskCopy: "Registra ciclos respiratorios percibidos y atención interoceptiva durante intervalos cortos."
  },
  {
    id: "parietal",
    name: "Corteza parietal posterior",
    tag: "Atención espacial",
    color: 0x9edc82,
    position: [0.5, 0.95, 0.72],
    scale: [0.48, 0.28, 0.2],
    summary: "Integra visión, propiocepción y metas para orientar atención, acción y cálculo espacial.",
    location: "Lóbulo parietal superior e inferior, BA 7/39/40.",
    functions: "Atención espacial, integración multisensorial, transformación visuomotora.",
    network: "Red dorsal de atención; red frontoparietal.",
    task: "Cueing espacial",
    taskCopy: "Usa claves válidas e inválidas para estimar orientación atencional y costo de reorientación."
  },
  {
    id: "amygdala",
    name: "Amígdala",
    tag: "Valor emocional",
    color: 0xff6961,
    position: [0.08, -0.22, 0.72],
    scale: [0.2, 0.16, 0.15],
    summary: "Evalúa relevancia afectiva, amenaza, aprendizaje emocional y modulación de memoria.",
    location: "Lóbulo temporal medial anterior.",
    functions: "Aprendizaje aversivo, saliencia emocional, modulación autonómica.",
    network: "Circuitos límbicos con hipocampo, vmPFC e hipotálamo.",
    task: "Stroop emocional",
    taskCopy: "Clasifica color ignorando palabras afectivas para observar interferencia emocional."
  },
  {
    id: "cerebellum",
    name: "Cerebelo",
    tag: "Predicción y ajuste",
    color: 0xb9875c,
    position: [0.78, -1.0, -0.58],
    scale: [0.62, 0.34, 0.34],
    summary: "Coordina precisión temporal, aprendizaje por error, ajuste motor y contribuciones cognitivas predictivas.",
    location: "Fosa posterior, dorsal al tronco encefálico.",
    functions: "Coordinación, timing, aprendizaje adaptativo, predicción sensoriomotora.",
    network: "Bucles cerebelo-talamo-corticales.",
    task: "Sincronización rítmica",
    taskCopy: "Toca al ritmo y luego continúa sin señal para explorar timing interno y predicción."
  },
  {
    id: "salience",
    name: "Red de saliencia",
    tag: "Cambio de prioridad",
    color: 0xffb35c,
    position: [-0.28, 0.52, 0.74],
    scale: [0.36, 0.24, 0.18],
    summary: "Red que detecta eventos relevantes y ayuda a alternar entre foco interno, control ejecutivo y respuesta adaptativa.",
    location: "Insula anterior y cingulo anterior dorsal, con acoplamiento subcortical.",
    functions: "Deteccion de saliencia, interocepcion, control adaptativo, cambio entre redes.",
    network: "Red de saliencia; puente entre red por defecto y red frontoparietal.",
    task: "Oddball emocional",
    taskCopy: "Presenta estimulos frecuentes y desviantes con carga emocional para observar deteccion de relevancia."
  },
  {
    id: "ventralAttention",
    name: "Red ventral de atencion / TPJ",
    tag: "Reorientacion social",
    color: 0x7dd7ff,
    position: [0.62, 0.62, 0.98],
    scale: [0.34, 0.22, 0.18],
    summary: "Sistema de reorientacion hacia eventos inesperados, especialmente util para mirar claves sociales como mirada, voz o gestos.",
    location: "Union temporoparietal, parietal inferior, supramarginal y temporal superior.",
    functions: "Reorientacion atencional, deteccion de novedad, perspectiva, claves sociales.",
    network: "Red ventral de atencion y circuitos temporoparietales sociales.",
    task: "Cueing de mirada",
    taskCopy: "Compara claves de mirada validas e invalidas para estimar captura atencional social."
  },
  {
    id: "vmPfc",
    name: "Prefrontal ventromedial / orbitofrontal",
    tag: "Valor social",
    color: 0xffd166,
    position: [-1.0, 0.58, 0.14],
    scale: [0.36, 0.22, 0.18],
    summary: "Integra valor, recompensa, preferencia y significado personal de las decisiones, incluyendo valor social y reputacional.",
    location: "Corteza orbitofrontal medial/lateral y prefrontal ventromedial.",
    functions: "Valoracion, recompensa, flexibilidad, eleccion social, regulacion afectiva.",
    network: "Circuitos orbitofrontales con estriado, amigdala, hipocampo y red por defecto.",
    task: "Decision social",
    taskCopy: "Elegir entre beneficio propio y compartido para discutir valor, norma y reputacion."
  },
  {
    id: "acc",
    name: "Cingulo anterior",
    tag: "Conflicto y esfuerzo",
    color: 0xff7a90,
    position: [-0.16, 0.82, 0.08],
    scale: [0.3, 0.22, 0.16],
    summary: "Monitorea conflicto, error, esfuerzo y demanda de control, conectando regulacion cognitiva con estados afectivos.",
    location: "Cingulo anterior rostral y caudal, en la cara medial frontal.",
    functions: "Monitoreo de conflicto, error, dolor social, esfuerzo, regulacion afectiva.",
    network: "Red de saliencia y control cingulo-opercular.",
    task: "Flanker social",
    taskCopy: "Responder a un objetivo con distractores congruentes o incongruentes y feedback social."
  },
  {
    id: "thalamostriatal",
    name: "Circuito talamo-estriatal",
    tag: "Habito y recompensa",
    color: 0x8bd3a7,
    position: [0.18, -0.18, 0.08],
    scale: [0.34, 0.22, 0.2],
    summary: "Circuito subcortical que participa en seleccion de acciones, aprendizaje por recompensa, habitos y compuertas atencionales.",
    location: "Talamo, caudado, putamen, palido, accumbens y prosencefalo basal.",
    functions: "Recompensa, aprendizaje por refuerzo, seleccion de acciones, habitos, motivacion.",
    network: "Bucles fronto-estriado-talamo-corticales.",
    task: "Aprendizaje por recompensa",
    taskCopy: "Escoger entre opciones que cambian su probabilidad de recompensa para observar aprendizaje y flexibilidad."
  },
  {
    id: "fusiformFace",
    name: "Giro fusiforme / red de caras",
    tag: "Identidad visual",
    color: 0xd88cff,
    position: [0.62, -0.04, 0.76],
    scale: [0.34, 0.18, 0.14],
    summary: "Region temporal ventral importante para reconocimiento visual experto, especialmente identidad facial y rasgos configurales.",
    location: "Giro fusiforme y temporal inferior/medio.",
    functions: "Reconocimiento de caras, identidad, forma compleja, experiencia visual.",
    network: "Via visual ventral occipitotemporal; conexion con temporal superior y amigdala.",
    task: "Reconocimiento de caras",
    taskCopy: "Comparar memoria para caras, objetos y caras invertidas para discutir procesamiento configural."
  }
];

const regionSections = [
  {
    id: "self-mentalizing",
    icon: "YO",
    title: "Yo, otros y mentalización",
    hint: "Autoconciencia, teoría de la mente y narrativa social",
    description: "Reúne redes que permiten representar el yo, inferir estados mentales de otros, construir impresiones y simular escenarios sociales. Se apoya en la red por defecto, corteza prefrontal medial/orbitofrontal, hipocampo y nodos temporoparietales.",
    guide: "Usa esta pestaña para explicar que la cognición social no es solo reconocer caras: también implica memoria autobiográfica, perspectiva, atribución de intenciones y comparación entre rasgos propios y ajenos.",
    experiment: "Juicio de rasgos propio/otro, tarea de falsas creencias breve o lectura de historias sociales con inferencia de intención.",
    handbook: "Guía: Self-Awareness and the Brain; Note to Self; Impression Formation; Theory of Mind Deficits.",
    regions: ["dmn", "vmPfc", "hippocampus", "ventralAttention"]
  },
  {
    id: "person-perception",
    icon: "ID",
    title: "Percepción de personas",
    hint: "Rostros, voz, mirada, identidad y primeras impresiones",
    description: "Organiza los sistemas que extraen información social desde la cara, la voz, la mirada y el movimiento. Integra vías visuales y auditivas con amígdala, temporal superior, fusiforme y redes de atención.",
    guide: "Es la entrada más intuitiva para estudiantes: muestra cómo una señal física se transforma en identidad, emoción, dirección de atención e impresión social.",
    experiment: "Reconocimiento de caras normales/invertidas, clasificación de prosodia emocional y cueing de mirada válido/inválido.",
    handbook: "Guía: Emotion Recognition; Hearing Voices; Person Perception; First Impressions in Face Perception.",
    regions: ["fusiformFace", "auditory", "visual", "amygdala", "ventralAttention"]
  },
  {
    id: "emotion-empathy",
    icon: "EM",
    title: "Emoción y cuerpo",
    hint: "Interocepción, dolor social, saliencia y resonancia afectiva",
    description: "Agrupa estructuras que conectan señales corporales, emoción, amenaza, dolor observado, empatía y detección de relevancia. La ínsula, amígdala, cíngulo anterior y red de saliencia son el núcleo de esta función.",
    guide: "Permite discutir cómo el cerebro convierte cambios corporales y afectivos en significado social: asco, amenaza, rechazo, empatía, compasión y regulación emocional.",
    experiment: "Conteo respiratorio + imágenes emocionales, Stroop emocional, observación de dolor ajeno y escala breve de empatía.",
    handbook: "Guía: Emotion, Consciousness, and Social Behavior; Emotion Recognition; Social Neuroscience of Empathy; Why Rejection Hurts.",
    regions: ["insula", "amygdala", "acc", "salience"]
  },
  {
    id: "empathy-compassion",
    icon: "EC",
    title: "Empatía y compasión",
    hint: "Dolor ajeno, resonancia afectiva, perspectiva y cuidado",
    description: "Integra sistemas que permiten reconocer y compartir estados afectivos de otras personas, distinguir yo/otro, responder al dolor ajeno y transformar resonancia emocional en ayuda o compasión. Se apoya en ínsula, cíngulo anterior, TPJ/parietal, vmPFC y red por defecto.",
    guide: "Permite diferenciar empatía afectiva, empatía cognitiva y compasión: sentir con otro, comprender su estado mental y orientar una respuesta prosocial.",
    experiment: "Observación de dolor ajeno, juicio de perspectiva afectiva y comparación entre empatía por amigo/desconocido.",
    handbook: "Guía: Social Neuroscience of Empathy; Emotion Recognition; Altruism; Mirror Neuron System and Social Cognition.",
    regions: ["insula", "acc", "ventralAttention", "parietal", "vmPfc", "dmn"]
  },
  {
    id: "social-anger",
    icon: "RA",
    title: "Rabia",
    hint: "Amenaza, frustración, injusticia y preparación de respuesta",
    description: "Integra sistemas que transforman una amenaza social, una frustración interpersonal o una injusticia percibida en activación corporal, saliencia, evaluación de daño y control de la respuesta. Participan amígdala, ínsula, cíngulo anterior, red de saliencia y control prefrontal.",
    guide: "Permite diferenciar rabia defensiva, rabia moral y regulación de la agresión: no es solo emoción intensa, también implica interpretación social, norma y control.",
    experiment: "Escenarios breves de ofensa, bloqueo de meta o trato injusto; comparar intensidad de rabia, deseo de confrontar y posibilidad de regular la respuesta.",
    handbook: "Guía: Emotion, Consciousness, and Social Behavior; Social Threat; Staying in Control; Ethical, Legal, and Societal Issues.",
    regions: ["amygdala", "insula", "acc", "salience", "dlpfc", "vmPfc"]
  },
  {
    id: "shame-social",
    icon: "VG",
    title: "Vergüenza",
    hint: "Evaluación pública, self, norma y deseo de reparación",
    description: "Agrupa procesos de autoevaluación ante la mirada de otros: exposición pública, error social, pérdida de estatus, norma vulnerada y necesidad de ocultarse, reparar o regular la conducta.",
    guide: "Ayuda a mostrar que la vergüenza combina cuerpo, self y contexto social: depende de cómo una persona cree que está siendo vista y evaluada por otros.",
    experiment: "Comparar errores privados versus errores observados por otros, con ratings de vergüenza, deseo de ocultamiento, reparación y control emocional.",
    handbook: "Guía: Self-Awareness and the Brain; Emotion and Social Behavior; Staying in Control; Ethical, Legal, and Societal Issues.",
    regions: ["vmPfc", "dmn", "insula", "acc", "amygdala", "dlpfc"]
  },
  {
    id: "regulation-control",
    icon: "RC",
    title: "Regulación y control social",
    hint: "Metas, normas, inhibición, conflicto y reputación",
    description: "Reúne las áreas que mantienen metas, regulan impulsos, monitorean errores y ajustan decisiones cuando hay normas sociales, evaluación externa o conflicto entre beneficio propio y conducta apropiada.",
    guide: "Úsala para conectar funciones ejecutivas con vida social real: autocontrol, reputación, cambio de reglas, vergüenza, control emocional y conducta dirigida a metas.",
    experiment: "Stroop social, Flanker con feedback social, dilemas reputacionales y Go/No-Go con distractores emocionales.",
    handbook: "Guía: The Prefrontal Cortex and Goal-Directed Social Behavior; Staying in Control; Real-world Consequences of Social Deficits.",
    regions: ["dlpfc", "vmPfc", "acc", "salience"]
  },
  {
    id: "moral-ethics",
    icon: "ME",
    title: "Juicio moral y ética",
    hint: "Daño, responsabilidad, culpa, norma y deliberación",
    description: "Integra los sistemas que permiten valorar acciones propias y ajenas según daño, intención, norma, responsabilidad y consecuencias. Depende de prefrontal ventromedial/orbitofrontal, DLPFC, cíngulo anterior, amígdala y red por defecto.",
    guide: "Permite discutir dilemas morales, ética aplicada, culpa, castigo, cuidado por otros y conflicto entre utilidad, emoción y norma social.",
    experiment: "Dilemas morales personales/impersonales, juicio de intención accidental versus intencional y decisiones de castigo justo.",
    handbook: "Guía: Prefrontal Cortex and Goal-Directed Social Behavior; Emotion and Social Behavior; Altruism; Strategic Thinking; Ethical, Legal, and Societal Issues.",
    regions: ["vmPfc", "dlpfc", "acc", "amygdala", "dmn"]
  },
  {
    id: "self-representation",
    icon: "SR",
    title: "Representación del self",
    hint: "Identidad, autobiografía, autoestima y agencia",
    description: "Agrupa redes que sostienen representación de identidad, memoria autobiográfica, agencia, valoración personal y comparación entre self y otros. La red por defecto, vmPFC, hipocampo e ínsula aportan componentes complementarios.",
    guide: "Sirve para explicar por qué el yo no es un módulo único: incluye narrativa autobiográfica, cuerpo sentido, valor personal, control de agencia y memoria social.",
    experiment: "Juicio de adjetivos sobre yo/amigo/desconocido, memoria incidental autorreferencial y evaluación de agencia en acciones propias.",
    handbook: "Guía: Self-Awareness and the Brain; Note to Self; Neural Systems of Self-Esteem Maintenance; Person Perception.",
    regions: ["dmn", "vmPfc", "hippocampus", "insula"]
  },
  {
    id: "action-imitation",
    icon: "AI",
    title: "Acción, imitación y sincronía",
    hint: "Sistema espejo, gestos, coordinación y aprendizaje por observación",
    description: "Integra sistemas premotores, parietales y cerebelosos que preparan acciones, entienden gestos, sostienen imitación y ajustan la sincronía interpersonal.",
    guide: "Muestra que la cognición social también es corporal: observar una acción prepara mapas motores y temporales que facilitan imitar, coordinarse o inhibir una respuesta.",
    experiment: "Imitación congruente/incongruente, observación de gestos, tapping sincronizado y tarea de intención de acción.",
    handbook: "Guía: Mirror Neuron System and Social Cognition; Mirror Neuron System and Imitation; Language and Communication.",
    regions: ["premotor", "parietal", "cerebellum", "ventralAttention"]
  },
  {
    id: "reward-bonding",
    icon: "VR",
    title: "Vínculo, recompensa y motivación",
    hint: "Afiliación, apego, jerarquía, recompensa social y hábitos",
    description: "Agrupa circuitos que asignan valor a recompensas sociales, sostienen motivación, apego, cooperación, estatus y aprendizaje por refuerzo.",
    guide: "Conecta cerebro social con motivación: por qué buscamos aprobación, evitamos rechazo, mantenemos vínculos, repetimos conductas reforzadas y aprendemos normas del grupo.",
    experiment: "Elección entre recompensa propia/compartida, aprendizaje probabilístico social y feedback de aceptación/rechazo.",
    handbook: "Guía: Social Bonding and Attachment; Processing Social and Nonsocial Rewards; Altruism; Social Hierarchy.",
    regions: ["thalamostriatal", "vmPfc", "amygdala", "hippocampus"]
  },
  {
    id: "attachment-bond",
    icon: "AP",
    title: "Apego y vínculo social",
    hint: "Cuidado, afiliación, cercanía y seguridad interpersonal",
    description: "Organiza los sistemas que sostienen apego, afiliación, cuidado y sensación de seguridad social. Integra valoración afectiva, memoria de vínculos, señales corporales y aprendizaje de recompensa social.",
    guide: "Permite discutir por qué los vínculos cercanos regulan emoción, estrés y conducta: no son solo una idea psicológica, sino un sistema motivacional y corporal.",
    experiment: "Comparar imágenes o nombres de persona cercana/desconocida con ratings de cercanía, calma y motivación de ayuda.",
    handbook: "Guía: Social Bonding and Attachment; Social Support to Health; Processing Social and Nonsocial Rewards.",
    regions: ["vmPfc", "thalamostriatal", "amygdala", "insula", "hippocampus"]
  },
  {
    id: "social-threat-stress",
    icon: "TS",
    title: "Amenaza social y estrés",
    hint: "Evaluación social, vigilancia, amenaza y respuesta corporal",
    description: "Agrupa sistemas sensibles a amenaza interpersonal, evaluación externa, incertidumbre social y estrés. Conecta amígdala, ínsula, cíngulo anterior, saliencia y control prefrontal.",
    guide: "Útil para explicar estrés social, exposición pública, crítica, vigilancia evaluativa y cómo la corteza prefrontal puede modular respuestas defensivas.",
    experiment: "Tarea breve de evaluación social: preparar una respuesta frente a observadores simulados y comparar con condición neutra.",
    handbook: "Guía: Social Threat; Staying in Control; Emotion, Consciousness, and Social Behavior.",
    regions: ["amygdala", "insula", "acc", "salience", "dlpfc", "vmPfc"]
  },
  {
    id: "loneliness-isolation",
    icon: "SL",
    title: "Soledad e aislamiento",
    hint: "Aislamiento percibido, hipervigilancia y pertenencia",
    description: "Representa cómo el aislamiento percibido puede modificar atención, amenaza social, autorreferencia y regulación emocional. Integra red por defecto, amígdala, saliencia y prefrontal medial.",
    guide: "Permite distinguir estar solo de sentirse socialmente aislado, y discutir por qué la soledad cambia expectativas sobre otros y sensibilidad a amenaza.",
    experiment: "Rating de pertenencia/aislamiento antes y después de feedback social ambiguo, con comparación de interpretación amenazante.",
    handbook: "Guía: Perceived Social Isolation; Why Rejection Hurts; Social Support to Health.",
    regions: ["dmn", "amygdala", "insula", "salience", "vmPfc", "acc"]
  },
  {
    id: "support-health",
    icon: "SH",
    title: "Apoyo social y salud",
    hint: "Regulación interpersonal, apoyo, bienestar y cuerpo",
    description: "Conecta apoyo social percibido, regulación emocional interpersonal, estrés y salud. Incluye circuitos prefrontales, saliencia, cíngulo e ínsula vinculados a control, cuerpo y protección frente a amenaza.",
    guide: "Sirve para mostrar cómo la presencia de otros puede modular dolor, estrés, emoción y bienestar: una puerta directa hacia salud social.",
    experiment: "Comparar regulación emocional solo versus con mensaje/imagen de apoyo social antes de estímulos negativos.",
    handbook: "Guía: Social Support to Health; Social Regulation of Emotion; Perceived Social Isolation.",
    regions: ["vmPfc", "dlpfc", "acc", "insula", "salience", "amygdala"]
  },
  {
    id: "culture-social-cognition",
    icon: "CU",
    title: "Cultura y cognición social",
    hint: "Normas culturales, identidad, contexto y significado social",
    description: "Integra sistemas que ajustan el self, la percepción de otros y la toma de decisiones según normas culturales, pertenencia grupal y contexto.",
    guide: "Permite discutir self independiente/interdependiente, diferencias culturales en atención social, normas y significado de acciones.",
    experiment: "Juicios de rasgos sobre yo/familia/grupo y comparación de decisiones en contexto individual versus grupal.",
    handbook: "Guía: Cultural Neuroscience; Evolutionary Basis of the Social Brain; Person Perception.",
    regions: ["dmn", "vmPfc", "ventralAttention", "hippocampus", "fusiformFace", "dlpfc"]
  },
  {
    id: "social-norms-conformity",
    icon: "NS",
    title: "Normas y conformidad",
    hint: "Presión grupal, reputación, obediencia y ajuste conductual",
    description: "Agrupa circuitos que detectan conflicto con normas, valoran reputación, ajustan decisiones al grupo y sostienen control social.",
    guide: "Útil para trabajar conformidad, obediencia, influencia social y aprendizaje de reglas explícitas e implícitas.",
    experiment: "Juicio perceptual o moral con respuesta del grupo simulada y medición de cambio tras conocer la mayoría.",
    handbook: "Guía: Strategic Thinking; Group Processes; Prefrontal Cortex and Goal-Directed Social Behavior.",
    regions: ["acc", "dlpfc", "vmPfc", "thalamostriatal", "ventralAttention"]
  },
  {
    id: "altruism-prosocial",
    icon: "AL",
    title: "Altruismo y conducta prosocial",
    hint: "Ayuda, costo personal, cuidado, recompensa y justicia",
    description: "Integra empatía, valoración social, recompensa, perspectiva y control para explicar ayuda, donación, cooperación costosa y cuidado por otros.",
    guide: "Permite diferenciar ayuda impulsada por empatía, por norma, por reputación o por recompensa social.",
    experiment: "Juego de donación con costo personal y manipulación de visibilidad pública/privada de la decisión.",
    handbook: "Guía: Altruism; Social Neuroscience of Empathy; Processing Social and Nonsocial Rewards.",
    regions: ["vmPfc", "thalamostriatal", "insula", "acc", "ventralAttention", "dmn"]
  },
  {
    id: "first-impressions",
    icon: "PI",
    title: "Primeras impresiones",
    hint: "Confianza, dominancia, emoción facial e inferencia rápida",
    description: "Organiza sistemas que extraen señales de rostro, mirada, emoción y contexto para formar evaluaciones rápidas de confianza, dominancia, atractivo social o intención.",
    guide: "Es una buena entrada a sesgos sociales: muestra cómo inferencias rápidas pueden ser adaptativas, pero también frágiles y dependientes del contexto.",
    experiment: "Rating rápido de confianza/dominancia en rostros y comparación con tiempo ilimitado o información contextual.",
    handbook: "Guía: First Impressions in Face Perception; Person Perception; Emotion Recognition.",
    regions: ["fusiformFace", "amygdala", "ventralAttention", "vmPfc", "visual"]
  },
  {
    id: "theory-of-mind",
    icon: "TM",
    title: "Teoría de la mente",
    hint: "Creencias, deseos, intenciones y falsas creencias",
    description: "Focaliza la capacidad de inferir estados mentales no observables en otras personas: qué creen, desean, esperan o intentan. Se apoya en red por defecto, TPJ, prefrontal medial e hipocampo.",
    guide: "Úsala para separar mentalización explícita de percepción social básica: aquí el foco está en comprender la mente del otro, incluso cuando difiere de la realidad.",
    experiment: "Historias breves de falsa creencia, ironía o malentendido social con preguntas sobre intención y conocimiento del personaje.",
    handbook: "Guía: Theory of Mind Deficits; Self-Awareness and the Brain; Person Perception.",
    regions: ["dmn", "ventralAttention", "vmPfc", "hippocampus", "parietal"]
  },
  {
    id: "perspective-taking",
    icon: "PT",
    title: "Toma de perspectiva",
    hint: "Punto de vista, distancia social y simulación del otro",
    description: "Agrupa procesos que permiten desplazar el punto de vista propio hacia la posición perceptual, emocional o mental de otra persona.",
    guide: "Permite explicar por qué comprender a otro exige coordinar atención, memoria, self y control: no basta con mirar la misma escena.",
    experiment: "Tarea de perspectiva visual o social: decidir qué ve, sabe o siente otra persona desde una posición distinta.",
    handbook: "Guía: Social Neuroscience of Empathy; Person Perception; Self-Awareness and the Brain.",
    regions: ["ventralAttention", "dmn", "parietal", "dlpfc", "vmPfc"]
  },
  {
    id: "joint-attention-gaze",
    icon: "MG",
    title: "Mirada y atención conjunta",
    hint: "Gaze cueing, orientación social y objeto compartido",
    description: "Representa cómo la mirada, la cabeza y la dirección corporal orientan la atención hacia objetos, personas o eventos compartidos.",
    guide: "Es una función excelente para docencia porque muestra cómo una señal mínima, como los ojos, cambia prioridad atencional y significado social.",
    experiment: "Cueing de mirada válido/inválido con objetos sociales y no sociales, midiendo rapidez y errores.",
    handbook: "Guía: Person Perception; First Impressions in Face Perception; Social Cognition and Attention.",
    regions: ["ventralAttention", "fusiformFace", "visual", "parietal", "amygdala"]
  },
  {
    id: "agency-intention",
    icon: "AG",
    title: "Agencia e intención",
    hint: "Autoría, intencionalidad, responsabilidad y acción social",
    description: "Integra sistemas que distinguen si una acción fue propia o ajena, accidental o intencional, y si debe atribuirse responsabilidad social.",
    guide: "Conecta acción, moralidad y self: una misma consecuencia social cambia de significado si fue accidental, negligente o deliberada.",
    experiment: "Juicios de accidente versus intención en acciones sociales ambiguas y evaluación de responsabilidad.",
    handbook: "Guía: Prefrontal Cortex and Goal-Directed Social Behavior; Mirror Neuron System and Social Cognition.",
    regions: ["premotor", "parietal", "dmn", "vmPfc", "acc", "dlpfc"]
  },
  {
    id: "pragmatic-language",
    icon: "PL",
    title: "Lenguaje pragmático",
    hint: "Ironía, intención comunicativa, prosodia y contexto",
    description: "Organiza redes que permiten comprender significado social más allá de las palabras literales: ironía, insinuación, tono, intención y contexto.",
    guide: "Ideal para mostrar que comunicación social combina audición, lenguaje, teoría de la mente, emoción y control contextual.",
    experiment: "Frases literales/irónicas con prosodia congruente o incongruente y juicio de intención del hablante.",
    handbook: "Guía: Hearing Voices; Language and Communication; Theory of Mind Deficits.",
    regions: ["auditory", "ventralAttention", "dmn", "dlpfc", "insula"]
  },
  {
    id: "deception-trust-violation",
    icon: "EN",
    title: "Engaño y violación de confianza",
    hint: "Mentira, sospecha, traición y actualización de reputación",
    description: "Agrupa procesos para detectar señales ambiguas, sostener una mentira, evaluar traición y actualizar modelos de confianza sobre otros.",
    guide: "Permite conectar control ejecutivo, reputación, memoria social y valoración afectiva cuando una relación cambia por engaño o incumplimiento.",
    experiment: "Juego de confianza repetido con traición inesperada y posterior actualización de decisiones.",
    handbook: "Guía: Strategic Thinking; Impression Formation; Social Rewards; Goal-Directed Social Behavior.",
    regions: ["dlpfc", "vmPfc", "acc", "amygdala", "hippocampus", "thalamostriatal"]
  },
  {
    id: "ingroup-outgroup",
    icon: "IG",
    title: "Endogrupo y exogrupo",
    hint: "Identidad grupal, pertenencia, sesgo y categorización",
    description: "Representa cómo el cerebro categoriza pertenencia grupal, familiaridad, similitud y diferencia social, modulando atención, emoción y valoración.",
    guide: "Útil para discutir identidad social, cooperación selectiva, amenaza intergrupal y cómo los grupos cambian percepción de personas.",
    experiment: "Clasificación rápida de rostros o nombres endogrupo/exogrupo con juicios de confianza, cercanía o amenaza.",
    handbook: "Guía: Group Processes; Cultural Neuroscience; Person Perception; Social Threat.",
    regions: ["fusiformFace", "amygdala", "vmPfc", "dmn", "acc", "thalamostriatal"]
  },
  {
    id: "prejudice-stigma",
    icon: "PS",
    title: "Prejuicio y estigma",
    hint: "Sesgo social, evaluación implícita y regulación normativa",
    description: "Agrupa redes implicadas en categorización social rápida, respuesta afectiva, conflicto normativo y regulación deliberada de sesgos.",
    guide: "Permite tratar el prejuicio como interacción entre aprendizaje social, saliencia, emoción, control y contexto cultural, no como una sola región.",
    experiment: "Tarea de asociación implícita simplificada o juicio rápido de rasgos con manipulación de norma explícita.",
    handbook: "Guía: Cultural Neuroscience; Person Perception; Social Threat; Staying in Control.",
    regions: ["amygdala", "fusiformFace", "acc", "dlpfc", "vmPfc", "salience"]
  },
  {
    id: "guilt-repair",
    icon: "CU",
    title: "Culpa",
    hint: "Responsabilidad, daño causado, norma y reparación",
    description: "Representa la evaluación de una acción propia como dañina, injusta o contraria a una norma. Integra responsabilidad, malestar, memoria del episodio y motivación para reparar o pedir disculpas.",
    guide: "Permite distinguir culpa de vergüenza: la culpa se centra más en lo que hice y cómo repararlo; la vergüenza se centra más en cómo soy visto por otros.",
    experiment: "Escenarios de daño accidental versus intencional, con ratings de culpa, responsabilidad, disculpa y deseo de reparar.",
    handbook: "Guía: Emotion and Social Behavior; Self-Awareness and the Brain; Ethical, Legal, and Societal Issues.",
    regions: ["vmPfc", "acc", "insula", "dmn", "hippocampus", "dlpfc"]
  },
  {
    id: "social-pride",
    icon: "OR",
    title: "Orgullo",
    hint: "Logro, reconocimiento, autoestima y estatus social",
    description: "Agrupa procesos que valoran logros propios ante otros, reconocimiento social, autoestima, reputación y aumento de estatus dentro de un grupo.",
    guide: "Ayuda a mostrar que el orgullo no es solo placer individual: depende de evaluación social, pertenencia, comparación y significado personal del logro.",
    experiment: "Feedback de desempeño privado versus público, con ratings de orgullo, motivación, autoestima y deseo de compartir el resultado.",
    handbook: "Guía: Self-Awareness and the Brain; Self-Esteem Maintenance; Social Hierarchy; Processing Social and Nonsocial Rewards.",
    regions: ["vmPfc", "thalamostriatal", "dmn", "hippocampus", "acc"]
  },
  {
    id: "social-repair",
    icon: "RS",
    title: "Reparación social",
    hint: "Disculpa, restitución, regulación y restauración del vínculo",
    description: "Representa la tendencia a reparar después de una transgresión, error público o daño interpersonal. Integra culpa, vergüenza, regulación emocional, memoria del vínculo y decisión de disculparse, compensar o restaurar confianza.",
    guide: "Permite distinguir reparación emocional de perdón: aquí el foco está en quien dañó o falló y busca restaurar una relación o norma.",
    experiment: "Escenarios de transgresión con o sin disculpa, compensación o reconocimiento del daño; medir deseo de reparar y confianza esperada.",
    handbook: "Guía: Emotion and Social Behavior; Social Bonding and Attachment; Strategic Thinking; Ethical, Legal, and Societal Issues.",
    regions: ["vmPfc", "dlpfc", "acc", "insula", "hippocampus", "dmn"]
  },
  {
    id: "moral-indignation",
    icon: "IM",
    title: "Indignación moral",
    hint: "Injusticia, daño ajeno, norma vulnerada y castigo",
    description: "Integra la respuesta afectiva ante daño injusto, abuso, traición o violación de normas. Combina saliencia emocional, evaluación moral, rabia social y decisión de confrontar o castigar.",
    guide: "Permite diferenciar rabia general de indignación moral: aquí la emoción se organiza alrededor de una norma vulnerada o de daño injusto hacia alguien.",
    experiment: "Escenarios de trato injusto hacia uno mismo o hacia terceros, con ratings de indignación, castigo, reparación y confianza futura.",
    handbook: "Guía: Emotion and Social Behavior; Altruism; Strategic Thinking; Ethical, Legal, and Societal Issues.",
    regions: ["insula", "acc", "amygdala", "dlpfc", "vmPfc", "salience"]
  },
  {
    id: "envy-social-comparison",
    icon: "CV",
    title: "Comparación social y envidia",
    hint: "Estatus relativo, logro ajeno, autoestima y recompensa",
    description: "Organiza sistemas que valoran el self en relación con otros, comparan estatus o logro y actualizan autoestima, motivación o malestar social.",
    guide: "Permite explicar que la recompensa social suele ser relativa: ganar, perder o ser reconocido depende del contexto comparativo.",
    experiment: "Feedback de desempeño propio versus pares con ratings de justicia, envidia, orgullo y motivación.",
    handbook: "Guía: Social Hierarchy; Self-Esteem Maintenance; Processing Social and Nonsocial Rewards.",
    regions: ["vmPfc", "thalamostriatal", "dmn", "acc", "insula"]
  },
  {
    id: "forgiveness-reconciliation",
    icon: "FR",
    title: "Perdón y reconciliación",
    hint: "Reparación, confianza, regulación y memoria social",
    description: "Agrupa procesos que permiten reevaluar una ofensa, regular afecto negativo, integrar intención/contexto y decidir si restaurar confianza.",
    guide: "Una función muy útil para unir moral, emoción y cooperación: perdonar no es olvidar, sino reinterpretar y decidir si la relación puede repararse.",
    experiment: "Escenarios de disculpa sincera/no sincera tras una transgresión y decisión de castigo, perdón o cooperación futura.",
    handbook: "Guía: Altruism; Strategic Thinking; Social Bonding and Attachment; Emotion and Social Behavior.",
    regions: ["vmPfc", "dlpfc", "acc", "amygdala", "hippocampus", "dmn"]
  },
  {
    id: "reputation-impression",
    icon: "RP",
    title: "Reputación e impresión social",
    hint: "Imagen pública, evaluación de otros y memoria reputacional",
    description: "Integra procesos que permiten formar, mantener y actualizar una impresión sobre otra persona o sobre uno mismo ante los demás.",
    guide: "Permite discutir por qué una acción social no solo tiene consecuencias inmediatas: también cambia reputación, confianza futura y valor social.",
    experiment: "Presentar rostros asociados a acciones cooperativas, egoístas o ambiguas y luego medir confianza y recuerdo.",
    handbook: "Guía: Impression Formation; Strategic Thinking; Person Perception; Social Rewards.",
    regions: ["fusiformFace", "hippocampus", "vmPfc", "dmn", "thalamostriatal"]
  },
  {
    id: "fairness-punishment",
    icon: "JC",
    title: "Justicia y castigo",
    hint: "Equidad, injusticia, castigo altruista y norma social",
    description: "Agrupa sistemas que evalúan distribución justa, violación de normas, enojo moral y decisiones de castigo incluso cuando tienen costo personal.",
    guide: "Sirve para conectar economía conductual, emoción moral y control: castigar puede proteger normas, pero también depende de contexto, intención y reputación.",
    experiment: "Juego del ultimátum o reparto desigual con opción de aceptar, rechazar o castigar al infractor.",
    handbook: "Guía: Altruism; Strategic Thinking; Ethical, Legal, and Societal Issues; Social Rewards.",
    regions: ["insula", "acc", "dlpfc", "vmPfc", "thalamostriatal"]
  },
  {
    id: "social-uncertainty",
    icon: "IN",
    title: "Incertidumbre social",
    hint: "Ambigüedad, predicción, riesgo interpersonal y actualización",
    description: "Representa cómo el cerebro decide cuando las intenciones, reglas o consecuencias sociales son ambiguas y deben actualizarse con nueva evidencia.",
    guide: "Muy útil para mostrar que la vida social exige inferir bajo incertidumbre: no siempre sabemos si una señal es amenaza, cooperación, ironía o error.",
    experiment: "Escenarios sociales ambiguos con información nueva gradual; medir cambio de interpretación y confianza.",
    handbook: "Guía: Strategic Thinking; Social Threat; Goal-Directed Social Behavior; Impression Formation.",
    regions: ["dlpfc", "acc", "salience", "vmPfc", "hippocampus", "amygdala"]
  },
  {
    id: "social-decision-choice",
    icon: "DS",
    title: "Decisión social",
    hint: "Preferencias, alternativas, consecuencias y elección interpersonal",
    description: "Organiza procesos que permiten elegir en contextos donde las consecuencias afectan a otras personas o dependen de sus respuestas. Integra valoración, control, memoria de experiencias previas e incertidumbre.",
    guide: "Conecta teoría de decisión con cerebro social: decidir no es solo escoger una opción, sino anticipar consecuencias, preferencias ajenas, reputación y normas del contexto.",
    experiment: "Presentar elecciones entre beneficio propio, beneficio compartido y costo social; comparar decisión privada versus observada.",
    handbook: "Referencia: Decision Theory and Rationality; Game Theory and Political Theory; Rational Choice and Judgment.",
    regions: ["vmPfc", "dlpfc", "acc", "thalamostriatal", "hippocampus"]
  },
  {
    id: "strategic-interaction",
    icon: "TG",
    title: "Interacción estratégica",
    hint: "Teoría de juegos, predicción del otro, cooperación y competencia",
    description: "Representa situaciones en que el resultado depende simultáneamente de mi acción y de la acción esperada de otra persona o grupo. Combina mentalización, memoria de reputación, valoración y control.",
    guide: "Permite trabajar dilemas sociales, juegos de confianza, negociación, reciprocidad y competencia como problemas de predicción interpersonal.",
    experiment: "Juego del prisionero, confianza repetida o coordinación con información incompleta sobre la estrategia del otro.",
    handbook: "Referencia: Behavioral Game Theory; Game Theory and Political Theory; Foundations of Cooperation in Economic Life.",
    regions: ["dmn", "vmPfc", "dlpfc", "hippocampus", "thalamostriatal", "acc"]
  },
  {
    id: "risk-ambiguity-social",
    icon: "RI",
    title: "Riesgo y ambigüedad social",
    hint: "Prospect theory, pérdida, ganancia, incertidumbre y contexto social",
    description: "Agrupa procesos para decidir cuando hay riesgo conocido o ambigüedad sobre probabilidades, especialmente cuando las pérdidas, ganancias o consecuencias son sociales.",
    guide: "Ayuda a explicar por qué una misma opción cambia de valor si implica pérdida de estatus, posibilidad de rechazo, ganancia compartida o incertidumbre sobre la reacción de otros.",
    experiment: "Elecciones con ganancias/pérdidas sociales bajo riesgo explícito versus ambigüedad, midiendo aversión a la pérdida y confianza.",
    handbook: "Referencia: Prospect Theory for Risk and Ambiguity; Decision Theory and Rationality.",
    regions: ["vmPfc", "salience", "amygdala", "acc", "dlpfc", "thalamostriatal"]
  },
  {
    id: "bounded-rationality-bias",
    icon: "RL",
    title: "Racionalidad limitada y sesgos",
    hint: "Heurísticos, sesgos, emoción, carga cognitiva y decisión social",
    description: "Integra límites de atención, memoria, control y emoción que hacen que las decisiones sociales no siempre sigan una racionalidad ideal. Incluye sesgos, atajos, framing y presión contextual.",
    guide: "Muestra que muchas decisiones sociales son razonables dentro de límites reales: poco tiempo, información incompleta, emociones activas y normas del grupo.",
    experiment: "Comparar una elección social con información completa versus presión de tiempo, marco de pérdida/ganancia o feedback grupal.",
    handbook: "Referencia: Bounded Rationality and Politics; Predictably Irrational; Rational Choice and Judgment.",
    regions: ["dlpfc", "acc", "salience", "vmPfc", "hippocampus"]
  },
  {
    id: "choice-architecture-nudge",
    icon: "NU",
    title: "Arquitectura de elección y nudge",
    hint: "Contexto, default, influencia, diseño de opciones y conducta social",
    description: "Representa cómo el modo en que se presentan las alternativas puede cambiar decisiones sin prohibir opciones. Conecta atención, valor, norma, hábito y susceptibilidad a señales del contexto.",
    guide: "Permite discutir cómo pequeños cambios del entorno social o institucional guían elecciones sobre salud, cooperación, consumo, ayuda o participación.",
    experiment: "Modificar orden, opción por defecto o norma descriptiva en una decisión social y medir cambio de elección.",
    handbook: "Referencia: Nudge; Handbook on Decision Making; Behavioral Game Theory.",
    regions: ["ventralAttention", "vmPfc", "dlpfc", "thalamostriatal", "salience"]
  },
  {
    id: "collective-choice",
    icon: "EL",
    title: "Elección colectiva",
    hint: "Preferencias grupales, votación, justicia y decisión pública",
    description: "Agrupa procesos que permiten pasar de preferencias individuales a decisiones compartidas. Incluye negociación, votación, justicia distributiva, legitimidad y conflicto entre intereses.",
    guide: "Conecta cerebro social con política y vida institucional: vivir en grupo exige transformar preferencias individuales en reglas y decisiones colectivas aceptables.",
    experiment: "Simular votación con preferencias individuales divergentes, cambio de agenda y evaluación de justicia del resultado.",
    handbook: "Referencia: A Primer in Social Choice Theory; Game Theory and Public Policy; The Handbook of Rational and Social Choice.",
    regions: ["dlpfc", "vmPfc", "acc", "dmn", "parietal", "thalamostriatal"]
  },
  {
    id: "interpersonal-synchrony",
    icon: "SI",
    title: "Sincronía interpersonal",
    hint: "Ritmo compartido, coordinación, conversación y afiliación",
    description: "Organiza sistemas que ajustan tiempo, movimiento, turnos conversacionales y coordinación corporal con otras personas.",
    guide: "Permite explicar por qué moverse o hablar en sincronía puede aumentar afiliación, cooperación y sensación de pertenencia.",
    experiment: "Tapping o balanceo sincronizado versus asincrónico en parejas, seguido de rating de cercanía y cooperación.",
    handbook: "Guía: Mirror Neuron System and Social Cognition; Social Bonding and Attachment; Language and Communication.",
    regions: ["cerebellum", "premotor", "parietal", "auditory", "thalamostriatal"]
  },
  {
    id: "affective-mentalizing",
    icon: "MA",
    title: "Mentalización afectiva",
    hint: "Inferir emociones, necesidades y estados internos ajenos",
    description: "Une teoría de la mente y emoción: permite inferir qué siente otra persona, por qué lo siente y qué necesita en una situación social.",
    guide: "Ayuda a diferenciar leer una creencia de comprender un estado afectivo: en lo social real muchas inferencias mentales son también emocionales.",
    experiment: "Historias breves con emoción implícita; pedir identificar sentimiento, causa y respuesta adecuada.",
    handbook: "Guía: Social Neuroscience of Empathy; Theory of Mind Deficits; Emotion Recognition; Person Perception.",
    regions: ["dmn", "insula", "amygdala", "ventralAttention", "vmPfc", "acc"]
  },
  {
    id: "intercorporeality-interaffectivity",
    icon: "IC",
    title: "Intercorporeidad e interafectividad",
    hint: "Cuerpo compartido, resonancia afectiva, presencia y coordinación",
    description: "Integra la idea de que la vida social no parte de mentes aisladas, sino de cuerpos que se afectan, se sincronizan y se regulan mutuamente en la interacción.",
    guide: "Refuerza una lectura encarnada del atlas: emoción, postura, ritmo, mirada y tono no son adornos de la cognición social, sino parte de cómo se construye significado con otros.",
    experiment: "Comparar conversación cara a cara, interacción por audio y texto, midiendo sincronía, afecto percibido y comprensión interpersonal.",
    handbook: "Referencia: Intercorporeality and Interaffectivity; Radical Embodiment; Empathy bodyssence.",
    regions: ["insula", "premotor", "parietal", "cerebellum", "auditory", "salience"]
  },
  {
    id: "dominance-hierarchy",
    icon: "DJ",
    title: "Dominancia y jerarquía",
    hint: "Estatus, poder, amenaza social y posición grupal",
    description: "Representa cómo el cerebro evalúa estatus, dominancia, poder, amenaza social y posición dentro del grupo. Integra amígdala, estriado/tálamo, vmPFC, cíngulo anterior y sistemas de memoria social.",
    guide: "Útil para discutir liderazgo, obediencia, competencia, estatus, sensibilidad a amenaza social y aprendizaje de posiciones jerárquicas.",
    experiment: "Aprendizaje de jerarquía por rostros, elección ante oponentes dominantes/subordinados y feedback de estatus.",
    handbook: "Guía: Neural Representation of Social Hierarchy; Group Processes: Social Dominance; Primate Social Behavior; Social Threat.",
    regions: ["amygdala", "thalamostriatal", "vmPfc", "acc", "hippocampus"]
  },
  {
    id: "trust-cooperation",
    icon: "CC",
    title: "Confianza y cooperación",
    hint: "Altruismo, reciprocidad, reputación y toma de decisiones",
    description: "Agrupa circuitos de valoración, recompensa social, memoria de reputación y control normativo que permiten confiar, cooperar, castigar injusticia o sostener vínculos recíprocos.",
    guide: "Permite trabajar juegos económicos simples y mostrar cómo valor social, memoria de personas y control de impulsos se combinan en decisiones cooperativas.",
    experiment: "Juego de confianza, ultimátum/dictador, cooperación repetida con reputación visible e invisible.",
    handbook: "Guía: Altruism; Strategic Thinking; Social Rewards; Impression Formation; Social Bonding and Attachment.",
    regions: ["vmPfc", "thalamostriatal", "hippocampus", "dlpfc", "fusiformFace"]
  },
  {
    id: "social-learning-memory",
    icon: "MS",
    title: "Memoria y aprendizaje social",
    hint: "Contexto, episodios, personas, cultura y aprendizaje",
    description: "Integra memoria episódica, aprendizaje por experiencia, contexto social, cultura y actualización de modelos sobre personas o grupos.",
    guide: "Permite explicar cómo recordamos quién hizo qué, en qué contexto, con qué emoción y cómo esa experiencia cambia expectativas futuras.",
    experiment: "Memoria rostro-contexto-emoción, aprendizaje de reputación y recuerdo incidental de rasgos asociados al yo u otra persona.",
    handbook: "Guía: Evolutionary Basis of the Social Brain; Cultural Neuroscience; Person Perception; Strategic Thinking.",
    regions: ["hippocampus", "dmn", "thalamostriatal", "fusiformFace"]
  },
  {
    id: "rejection-exclusion",
    icon: "RE",
    title: "Rechazo y exclusión social",
    hint: "Dolor social, amenaza evaluativa, pertenencia y regulación",
    description: "Integra sistemas que responden a exclusión, desaprobación, amenaza evaluativa y pérdida de pertenencia. Participan cíngulo anterior, ínsula, amígdala, red de saliencia y control prefrontal.",
    guide: "Sirve para discutir por qué el rechazo social puede sentirse corporalmente, cómo cambia la atención y qué recursos permiten regularlo.",
    experiment: "Cyberball breve, feedback de aceptación/rechazo y regulación cognitiva de comentarios sociales negativos.",
    handbook: "Guía: Why Rejection Hurts; Social Threat; Perceived Social Isolation; Social Regulation of Emotion.",
    regions: ["acc", "insula", "amygdala", "salience", "dlpfc"]
  },
  {
    id: "communication-health",
    icon: "CS",
    title: "Comunicación, estrés y salud social",
    hint: "Voz, lenguaje, amenaza social, apoyo y regulación",
    description: "Conecta señales comunicativas con estrés social, apoyo interpersonal, amenaza, aislamiento y regulación emocional. Incluye voz, prosodia, saliencia, control y cuerpo.",
    guide: "Útil para cerrar el atlas mostrando consecuencias reales: comunicación, apoyo social, amenaza evaluativa, rechazo, inflamación/estrés y bienestar.",
    experiment: "Prosodia emocional + tarea de amenaza social breve + autorreporte de apoyo o rechazo percibido.",
    handbook: "Guía: Hearing Voices; Social Regulation of Emotion; Perceived Social Isolation; Social Support to Health; Social Threat.",
    regions: ["auditory", "insula", "acc", "dlpfc", "salience"]
  },
  {
    id: "social-metacognition",
    icon: "MC",
    title: "Metacognición social",
    hint: "Confianza, monitoreo del propio juicio y aprendizaje interpersonal",
    description: "Representa la capacidad de evaluar qué tan seguros estamos de una interpretación social, reconocer errores, revisar creencias y aprender de la retroalimentación de otros.",
    guide: "Permite explicar por qué no basta con inferir una intención: también necesitamos saber cuánta confianza tenemos en esa inferencia y cuándo corregirla.",
    experiment: "Juicios sobre intención o emoción ajena con rating de confianza, feedback posterior y actualización de la interpretación.",
    handbook: "Referencia: Metacognición: las diferentes vertientes de una teoría; Social Cognition; Cognitive control.",
    regions: ["dlpfc", "acc", "dmn", "parietal", "vmPfc", "hippocampus"]
  }
];

const socialThemeGroups = [
  {
    id: "social-perception",
    icon: "PS",
    title: "Percepción social",
    hint: "Rostros, mirada, identidad, perspectiva e impresión",
    description: "Reúne funciones que permiten extraer significado social desde rostros, mirada, señales corporales, perspectiva y reputación.",
    themes: ["person-perception", "first-impressions", "joint-attention-gaze", "perspective-taking", "reputation-impression"]
  },
  {
    id: "social-emotions",
    icon: "ES",
    title: "Emociones Sociales",
    hint: "Cuerpo, empatía, rabia, vergüenza, culpa y orgullo",
    description: "Agrupa funciones afectivas que dan significado corporal y relacional a la interacción social: empatía, rabia, vergüenza, culpa, orgullo, reparación, indignación, cuerpo compartido, rechazo y compasión.",
    themes: ["emotion-empathy", "empathy-compassion", "social-anger", "shame-social", "guilt-repair", "social-pride", "social-repair", "moral-indignation", "affective-mentalizing", "intercorporeality-interaffectivity", "rejection-exclusion"]
  },
  {
    id: "social-communication",
    icon: "CS",
    title: "Comunicación Social",
    hint: "Lenguaje pragmático, prosodia, sincronía y salud social",
    description: "Organiza funciones de intercambio comunicativo: intención verbal, prosodia, coordinación interpersonal y señales de apoyo o amenaza.",
    themes: ["pragmatic-language", "communication-health", "interpersonal-synchrony"]
  },
  {
    id: "social-learning",
    icon: "AS",
    title: "Aprendizaje social",
    hint: "Memoria social, imitación, agencia e incertidumbre",
    description: "Integra aprendizaje por observación, memoria de personas y contextos, atribución de intención y actualización de modelos sociales ambiguos.",
    themes: ["social-learning-memory", "action-imitation", "agency-intention", "social-uncertainty"]
  },
  {
    id: "control-norms-morality",
    icon: "CM",
    title: "Control: normas sociales y moral",
    hint: "Regulación, norma, justicia, engaño y reparación",
    description: "Conecta control ejecutivo, normas sociales, juicio moral, justicia, castigo, engaño, perdón y regulación de la conducta apropiada.",
    themes: ["regulation-control", "moral-ethics", "social-norms-conformity", "fairness-punishment", "deception-trust-violation", "forgiveness-reconciliation"]
  },
  {
    id: "social-decision-rationality",
    icon: "DR",
    title: "Decisión social y racionalidad",
    hint: "Elección, riesgo, estrategia, sesgos, nudge y decisión colectiva",
    description: "Integra funciones que explican cómo elegimos en contextos sociales: preferencias, riesgo, ambigüedad, interacción estratégica, racionalidad limitada, arquitectura de elección y decisiones colectivas.",
    themes: ["social-decision-choice", "strategic-interaction", "risk-ambiguity-social", "bounded-rationality-bias", "choice-architecture-nudge", "collective-choice"]
  },
  {
    id: "bonding-cooperation",
    icon: "VC",
    title: "Vínculo y Cooperación",
    hint: "Apego, recompensa, altruismo y confianza",
    description: "Presenta las funciones motivacionales que sostienen apego, cooperación, ayuda, confianza, recompensa social y reciprocidad.",
    themes: ["reward-bonding", "attachment-bond", "altruism-prosocial", "trust-cooperation"]
  },
  {
    id: "group-culture-status",
    icon: "GE",
    title: "Grupos, cultura y estatus",
    hint: "Identidad grupal, jerarquía, comparación y sesgos",
    description: "Explora cómo el cerebro procesa pertenencia grupal, normas culturales, prejuicio, estigma, dominancia, jerarquía, comparación social y estatus.",
    themes: ["culture-social-cognition", "ingroup-outgroup", "prejudice-stigma", "dominance-hierarchy", "envy-social-comparison"]
  },
  {
    id: "social-cognition-mental-health",
    icon: "SM",
    title: "Yo social y Salud Mental",
    hint: "Self, teoría de la mente, amenaza, soledad y apoyo",
    description: "Reúne funciones del yo social y salud mental: self, teoría de la mente, metacognición social, amenaza evaluativa, soledad, apoyo social y bienestar.",
    themes: ["self-mentalizing", "self-representation", "theory-of-mind", "social-metacognition", "social-threat-stress", "loneliness-isolation", "support-health"]
  }
];

const uiText = {
  es: {
    appKicker: "Atlas neuroanatómico social interactivo",
    center: "Centrar",
    loadModel: "Cargar modelo 3D",
    cortex: "Corteza",
    networks: "Redes",
    subcortex: "Subcorteza",
    selectedStructure: "Estructura seleccionada",
    location: "Localización",
    functions: "Funciones",
    cerebraLabel: "Etiqueta CerebrA",
    socialCog: "Neurociencia social y cognitiva",
    keyConcepts: "Áreas de la red",
    teachingExample: "Ejemplo docente",
    learnMore: "Saber más",
    activeTheme: "Explorar función social",
    anatomicalZones: "Zonas anatómicas",
    functionalExperiment: "Experimento funcional",
    themeIntro: "Selecciona una pestaña superior para explorar las redes y áreas asociadas a ese sistema.",
    regions: "regiones",
    themes: "funciones",
    mainDomains: "Categorías sociales principales",
    chooseMainDomain: "Elige una categoría social principal para desplegar sus funciones específicas.",
    specificFunctions: "Funciones específicas",
    involvedAreas: "Áreas cerebrales involucradas",
    noActiveDomain: "Sin categoría activa",
    cleanStart: "Ventana inicial limpia: el cerebro queda sin una función marcada hasta que selecciones una categoría y luego una función específica.",
    domainSelected: "Categoría social seleccionada",
    chooseSpecificFunction: "Selecciona una función específica para resaltar en el cerebro las áreas corticales y subcorticales asociadas.",
    approximation: "Aproximación funcional; carga el GLB CerebrA para ver etiquetas anatómicas."
  },
  en: {
    appKicker: "Interactive social neuroanatomy atlas",
    center: "Center",
    loadModel: "Load 3D model",
    cortex: "Cortex",
    networks: "Networks",
    subcortex: "Subcortex",
    selectedStructure: "Selected structure",
    location: "Location",
    functions: "Functions",
    cerebraLabel: "CerebrA label",
    socialCog: "Social and cognitive neuroscience",
    keyConcepts: "Network areas",
    teachingExample: "Teaching example",
    learnMore: "Learn more",
    activeTheme: "Explore social function",
    anatomicalZones: "Anatomical zones",
    functionalExperiment: "Functional experiment",
    themeIntro: "Choose a top tab to explore the networks and areas associated with that system.",
    regions: "regions",
    themes: "functions",
    mainDomains: "Main social categories",
    chooseMainDomain: "Choose a main social category to reveal its specific functions.",
    specificFunctions: "Specific functions",
    involvedAreas: "Involved brain areas",
    noActiveDomain: "No active category",
    cleanStart: "Clean initial window: the brain remains unmarked until you choose a category and then a specific function.",
    domainSelected: "Selected social category",
    chooseSpecificFunction: "Choose a specific function to highlight the associated cortical and subcortical areas in the brain.",
    approximation: "Functional approximation; load the CerebrA GLB to inspect anatomical labels."
  }
};

const themeTextEn = {
  "self-mentalizing": {
    title: "Self, others and mentalizing",
    hint: "Self-awareness, theory of mind and social narrative",
    description: "Brings together networks that represent the self, infer others' mental states, build impressions and simulate social scenarios.",
    guide: "Use this tab to show that social cognition is not only face recognition: it also involves autobiographical memory, perspective, intention attribution and self-other comparison.",
    experiment: "Self/other trait judgment, brief false-belief task or social stories requiring intention inference.",
    handbook: "Guide: Self-Awareness and the Brain; Note to Self; Impression Formation; Theory of Mind Deficits."
  },
  "person-perception": {
    title: "Person perception",
    hint: "Faces, voice, gaze, identity and first impressions",
    description: "Organizes systems that extract social information from faces, voices, gaze and movement, linking sensory pathways with amygdala, superior temporal regions, fusiform cortex and attention networks.",
    guide: "The most intuitive entry point for students: it shows how a physical signal becomes identity, emotion, attention direction and social impression.",
    experiment: "Upright/inverted face recognition, emotional prosody classification and valid/invalid gaze cueing.",
    handbook: "Guide: Emotion Recognition; Hearing Voices; Person Perception; First Impressions in Face Perception."
  },
  "emotion-empathy": {
    title: "Emotion and body",
    hint: "Interoception, social pain, salience and affective resonance",
    description: "Groups structures linking body signals, emotion, threat, observed pain, empathy and relevance detection.",
    guide: "Discuss how the brain turns bodily and affective changes into social meaning: disgust, threat, rejection, empathy, compassion and emotion regulation.",
    experiment: "Breathing count + emotional images, emotional Stroop, observed pain and a brief empathy scale.",
    handbook: "Guide: Emotion, Consciousness, and Social Behavior; Emotion Recognition; Social Neuroscience of Empathy; Why Rejection Hurts."
  },
  "empathy-compassion": {
    title: "Empathy and compassion",
    hint: "Others' pain, affective resonance, perspective and care",
    description: "Integrates systems that recognize and share others' affective states, distinguish self from other, respond to observed pain and transform emotional resonance into helping or compassion.",
    guide: "Separates affective empathy, cognitive empathy and compassion: feeling with another, understanding their mental state and orienting prosocial response.",
    experiment: "Observed pain, affective perspective judgment and empathy for friend versus stranger.",
    handbook: "Guide: Social Neuroscience of Empathy; Emotion Recognition; Altruism; Mirror Neuron System and Social Cognition."
  },
  "social-anger": {
    title: "Anger",
    hint: "Threat, frustration, injustice and response preparation",
    description: "Integrates systems that turn social threat, interpersonal frustration or perceived injustice into bodily activation, salience, harm evaluation and response control.",
    guide: "Use it to separate defensive anger, moral anger and aggression regulation: anger is intense affect plus social interpretation, norm and control.",
    experiment: "Brief offense, goal-blocking or unfair-treatment scenarios; compare anger intensity, confrontation tendency and regulation.",
    handbook: "Guide: Emotion, Consciousness, and Social Behavior; Social Threat; Staying in Control; Ethical, Legal, and Societal Issues."
  },
  "shame-social": {
    title: "Shame",
    hint: "Public evaluation, self, norm and repair",
    description: "Groups self-evaluative processes under others' gaze: public exposure, social error, status loss, norm violation and the urge to hide, repair or regulate behavior.",
    guide: "Shows that shame combines body, self and social context: it depends on how a person believes they are being seen and evaluated by others.",
    experiment: "Compare private errors versus errors observed by others, with ratings of shame, hiding, repair and emotional control.",
    handbook: "Guide: Self-Awareness and the Brain; Emotion and Social Behavior; Staying in Control; Ethical, Legal, and Societal Issues."
  },
  "regulation-control": {
    title: "Social regulation and control",
    hint: "Goals, norms, inhibition, conflict and reputation",
    description: "Covers areas that maintain goals, regulate impulses, monitor errors and adjust decisions under social norms, external evaluation or conflict.",
    guide: "Connect executive function with real social behavior: self-control, reputation, rule switching, embarrassment, emotion control and goal-directed social action.",
    experiment: "Social Stroop, Flanker with social feedback, reputation dilemmas and emotional Go/No-Go.",
    handbook: "Guide: Prefrontal Cortex and Goal-Directed Social Behavior; Staying in Control; Social Deficits after Frontal Damage."
  },
  "moral-ethics": {
    title: "Moral judgment and ethics",
    hint: "Harm, responsibility, guilt, norm and deliberation",
    description: "Integrates systems that evaluate self and other actions according to harm, intention, norm, responsibility and consequences.",
    guide: "Useful for moral dilemmas, applied ethics, guilt, punishment, care for others and conflict between utility, emotion and social norm.",
    experiment: "Personal/impersonal moral dilemmas, accidental versus intentional harm and fair punishment decisions.",
    handbook: "Guide: Prefrontal Cortex and Goal-Directed Social Behavior; Emotion and Social Behavior; Altruism; Strategic Thinking; Ethical, Legal, and Societal Issues."
  },
  "self-representation": {
    title: "Self representation",
    hint: "Identity, autobiography, self-esteem and agency",
    description: "Groups networks supporting identity, autobiographical memory, agency, personal valuation and self-other comparison.",
    guide: "Shows that the self is not one module: it includes autobiographical narrative, felt body, personal value, agency control and social memory.",
    experiment: "Self/friend/stranger trait judgment, self-reference memory and agency evaluation.",
    handbook: "Guide: Self-Awareness and the Brain; Note to Self; Self-Esteem Maintenance; Person Perception."
  },
  "action-imitation": {
    title: "Action, imitation and synchrony",
    hint: "Mirror system, gestures, coordination and observational learning",
    description: "Integrates premotor, parietal and cerebellar systems that prepare actions, understand gestures, support imitation and tune interpersonal synchrony.",
    guide: "Shows that social cognition is embodied: observing actions prepares motor and timing maps that support imitation, coordination or inhibition.",
    experiment: "Congruent/incongruent imitation, gesture observation, synchronized tapping and action intention judgment.",
    handbook: "Guide: Mirror Neuron System and Social Cognition; Mirror Neuron System and Imitation; Language and Communication."
  },
  "reward-bonding": {
    title: "Bonding, reward and motivation",
    hint: "Affiliation, attachment, hierarchy, social reward and habits",
    description: "Groups circuits assigning value to social rewards, motivation, attachment, cooperation, status and reinforcement learning.",
    guide: "Connect the social brain with motivation: approval seeking, rejection avoidance, bonding, group norms and reinforced social habits.",
    experiment: "Self/shared reward choice, social probabilistic learning and acceptance/rejection feedback.",
    handbook: "Guide: Social Bonding and Attachment; Social and Nonsocial Rewards; Altruism; Social Hierarchy."
  },
  "attachment-bond": {
    title: "Attachment and social bonding",
    hint: "Care, affiliation, closeness and interpersonal safety",
    description: "Organizes systems supporting attachment, affiliation, care and social safety through affective valuation, bond memory, bodily signals and social reward learning.",
    guide: "Use it to explain why close bonds regulate emotion, stress and behavior as a motivational and bodily system.",
    experiment: "Compare close-person versus stranger cues with ratings of closeness, calm and motivation to help.",
    handbook: "Guide: Social Bonding and Attachment; Social Support to Health; Processing Social and Nonsocial Rewards."
  },
  "social-threat-stress": {
    title: "Social threat and stress",
    hint: "Social evaluation, vigilance, threat and bodily response",
    description: "Groups systems sensitive to interpersonal threat, external evaluation, social uncertainty and stress.",
    guide: "Useful for social stress, public exposure, criticism, evaluative vigilance and prefrontal modulation of defensive responses.",
    experiment: "Brief social-evaluation task: prepare an answer for simulated observers and compare with a neutral condition.",
    handbook: "Guide: Social Threat; Staying in Control; Emotion, Consciousness, and Social Behavior."
  },
  "loneliness-isolation": {
    title: "Loneliness and isolation",
    hint: "Perceived isolation, hypervigilance and belonging",
    description: "Represents how perceived isolation can alter attention, social threat, self-reference and emotion regulation.",
    guide: "Distinguish being alone from feeling socially isolated, and discuss how loneliness changes expectations about others.",
    experiment: "Belonging/isolation ratings before and after ambiguous social feedback, with threat-interpretation comparison.",
    handbook: "Guide: Perceived Social Isolation; Why Rejection Hurts; Social Support to Health."
  },
  "support-health": {
    title: "Social support and health",
    hint: "Interpersonal regulation, support, well-being and body",
    description: "Connects perceived social support, interpersonal emotion regulation, stress and health.",
    guide: "Shows how the presence of others can modulate pain, stress, emotion and well-being.",
    experiment: "Compare emotion regulation alone versus with a supportive cue before negative stimuli.",
    handbook: "Guide: Social Support to Health; Social Regulation of Emotion; Perceived Social Isolation."
  },
  "culture-social-cognition": {
    title: "Culture and social cognition",
    hint: "Cultural norms, identity, context and social meaning",
    description: "Integrates systems that tune self, person perception and decision-making according to cultural norms, group membership and context.",
    guide: "Discuss independent/interdependent self, cultural differences in social attention, norms and action meaning.",
    experiment: "Self/family/group trait judgments and decisions in individual versus group contexts.",
    handbook: "Guide: Cultural Neuroscience; Evolutionary Basis of the Social Brain; Person Perception."
  },
  "social-norms-conformity": {
    title: "Norms and conformity",
    hint: "Group pressure, reputation, obedience and behavioral adjustment",
    description: "Groups circuits that detect norm conflict, value reputation, adjust decisions to the group and support social control.",
    guide: "Useful for conformity, obedience, social influence and learning explicit or implicit rules.",
    experiment: "Perceptual or moral judgment with simulated group response and change after majority feedback.",
    handbook: "Guide: Strategic Thinking; Group Processes; Prefrontal Cortex and Goal-Directed Social Behavior."
  },
  "altruism-prosocial": {
    title: "Altruism and prosocial behavior",
    hint: "Helping, personal cost, care, reward and fairness",
    description: "Integrates empathy, social valuation, reward, perspective and control to explain helping, donation, costly cooperation and care.",
    guide: "Separate helping driven by empathy, norm, reputation or social reward.",
    experiment: "Donation game with personal cost and public/private visibility manipulation.",
    handbook: "Guide: Altruism; Social Neuroscience of Empathy; Processing Social and Nonsocial Rewards."
  },
  "first-impressions": {
    title: "First impressions",
    hint: "Trust, dominance, facial emotion and fast inference",
    description: "Organizes systems extracting face, gaze, emotion and context signals to form rapid evaluations of trust, dominance or intention.",
    guide: "A strong entry into social bias: rapid inferences can be adaptive but fragile and context-dependent.",
    experiment: "Rapid trust/dominance ratings for faces compared with unlimited time or contextual information.",
    handbook: "Guide: First Impressions in Face Perception; Person Perception; Emotion Recognition."
  },
  "theory-of-mind": {
    title: "Theory of mind",
    hint: "Beliefs, desires, intentions and false beliefs",
    description: "Focuses on the ability to infer unobservable mental states in other people: what they believe, want, expect or intend.",
    guide: "Separates explicit mentalizing from basic social perception: the focus is understanding another mind, even when it differs from reality.",
    experiment: "Brief false-belief, irony or misunderstanding stories with questions about a character's intention and knowledge.",
    handbook: "Guide: Theory of Mind Deficits; Self-Awareness and the Brain; Person Perception."
  },
  "perspective-taking": {
    title: "Perspective taking",
    hint: "Point of view, social distance and simulation of others",
    description: "Groups processes that shift one's own point of view toward another person's perceptual, emotional or mental position.",
    guide: "Shows why understanding others coordinates attention, memory, self and control.",
    experiment: "Visual or social perspective task: decide what another person sees, knows or feels from a different position.",
    handbook: "Guide: Social Neuroscience of Empathy; Person Perception; Self-Awareness and the Brain."
  },
  "joint-attention-gaze": {
    title: "Gaze and joint attention",
    hint: "Gaze cueing, social orienting and shared objects",
    description: "Represents how gaze, head direction and body orientation guide attention toward shared objects, people or events.",
    guide: "A minimal cue like the eyes can change attentional priority and social meaning.",
    experiment: "Valid/invalid gaze cueing with social and nonsocial objects, measuring speed and errors.",
    handbook: "Guide: Person Perception; First Impressions in Face Perception; Social Cognition and Attention."
  },
  "agency-intention": {
    title: "Agency and intention",
    hint: "Authorship, intentionality, responsibility and social action",
    description: "Integrates systems that distinguish whether an action was self/other generated, accidental or intentional, and socially responsible.",
    guide: "Connects action, morality and self: the same consequence changes meaning if accidental, negligent or deliberate.",
    experiment: "Accident versus intention judgments in ambiguous social actions and responsibility ratings.",
    handbook: "Guide: Prefrontal Cortex and Goal-Directed Social Behavior; Mirror Neuron System and Social Cognition."
  },
  "pragmatic-language": {
    title: "Pragmatic language",
    hint: "Irony, communicative intention, prosody and context",
    description: "Organizes networks that understand social meaning beyond literal words: irony, implication, tone, intention and context.",
    guide: "Social communication combines audition, language, theory of mind, emotion and contextual control.",
    experiment: "Literal/ironic sentences with congruent or incongruent prosody and speaker-intention judgment.",
    handbook: "Guide: Hearing Voices; Language and Communication; Theory of Mind Deficits."
  },
  "deception-trust-violation": {
    title: "Deception and trust violation",
    hint: "Lying, suspicion, betrayal and reputation updating",
    description: "Groups processes for detecting ambiguous cues, sustaining deception, evaluating betrayal and updating trust models.",
    guide: "Connect executive control, reputation, social memory and affective valuation when a relationship changes through deception.",
    experiment: "Repeated trust game with unexpected betrayal and later decision updating.",
    handbook: "Guide: Strategic Thinking; Impression Formation; Social Rewards; Goal-Directed Social Behavior."
  },
  "ingroup-outgroup": {
    title: "Ingroup and outgroup",
    hint: "Group identity, belonging, bias and categorization",
    description: "Represents how the brain categorizes group membership, familiarity, similarity and social difference.",
    guide: "Useful for social identity, selective cooperation, intergroup threat and how groups change person perception.",
    experiment: "Fast classification of ingroup/outgroup faces or names with trust, closeness or threat ratings.",
    handbook: "Guide: Group Processes; Cultural Neuroscience; Person Perception; Social Threat."
  },
  "prejudice-stigma": {
    title: "Prejudice and stigma",
    hint: "Social bias, implicit evaluation and normative regulation",
    description: "Groups networks involved in rapid social categorization, affective response, normative conflict and deliberate bias regulation.",
    guide: "Treat prejudice as interaction between social learning, salience, emotion, control and cultural context.",
    experiment: "Simplified implicit association task or rapid trait judgment with explicit norm manipulation.",
    handbook: "Guide: Cultural Neuroscience; Person Perception; Social Threat; Staying in Control."
  },
  "guilt-repair": {
    title: "Guilt",
    hint: "Responsibility, caused harm, norm and repair",
    description: "Represents the evaluation of one's own action as harmful, unfair or norm-violating. It integrates responsibility, distress, episode memory and motivation to repair or apologize.",
    guide: "Use it to distinguish guilt from shame: guilt focuses more on what I did and how to repair it; shame focuses more on how I am seen by others.",
    experiment: "Accidental versus intentional harm scenarios, with guilt, responsibility, apology and repair ratings.",
    handbook: "Guide: Emotion and Social Behavior; Self-Awareness and the Brain; Ethical, Legal, and Societal Issues."
  },
  "social-pride": {
    title: "Pride",
    hint: "Achievement, recognition, self-esteem and social status",
    description: "Groups processes that value one's achievements before others, social recognition, self-esteem, reputation and increased status within a group.",
    guide: "Shows that pride is not only individual pleasure: it depends on social evaluation, belonging, comparison and the personal meaning of achievement.",
    experiment: "Private versus public performance feedback, with pride, motivation, self-esteem and sharing-intention ratings.",
    handbook: "Guide: Self-Awareness and the Brain; Self-Esteem Maintenance; Social Hierarchy; Processing Social and Nonsocial Rewards."
  },
  "social-repair": {
    title: "Social repair",
    hint: "Apology, restitution, regulation and restored bonding",
    description: "Represents the tendency to repair after a transgression, public error or interpersonal harm. It integrates guilt, shame, emotion regulation, bond memory and the decision to apologize, compensate or restore trust.",
    guide: "Use it to distinguish emotional repair from forgiveness: here the focus is on the person who harmed or failed and tries to restore a relationship or norm.",
    experiment: "Transgression scenarios with or without apology, compensation or acknowledgment of harm; measure repair motivation and expected trust.",
    handbook: "Guide: Emotion and Social Behavior; Social Bonding and Attachment; Strategic Thinking; Ethical, Legal, and Societal Issues."
  },
  "moral-indignation": {
    title: "Moral indignation",
    hint: "Injustice, harm to others, violated norm and punishment",
    description: "Integrates the affective response to unfair harm, abuse, betrayal or norm violation. It combines emotional salience, moral evaluation, social anger and decisions to confront or punish.",
    guide: "Separates general anger from moral indignation: here the emotion is organized around a violated norm or unjust harm to someone.",
    experiment: "Unfair-treatment scenarios toward oneself or third parties, with indignation, punishment, repair and future-trust ratings.",
    handbook: "Guide: Emotion and Social Behavior; Altruism; Strategic Thinking; Ethical, Legal, and Societal Issues."
  },
  "envy-social-comparison": {
    title: "Social comparison and envy",
    hint: "Relative status, others' success, self-esteem and reward",
    description: "Organizes systems that value the self relative to others, compare status or achievement and update self-esteem or motivation.",
    guide: "Social reward is often relative: winning, losing or being recognized depends on comparison context.",
    experiment: "Self versus peer performance feedback with fairness, envy, pride and motivation ratings.",
    handbook: "Guide: Social Hierarchy; Self-Esteem Maintenance; Processing Social and Nonsocial Rewards."
  },
  "forgiveness-reconciliation": {
    title: "Forgiveness and reconciliation",
    hint: "Repair, trust, regulation and social memory",
    description: "Groups processes that reevaluate an offense, regulate negative affect, integrate intention/context and decide whether to restore trust.",
    guide: "Forgiving is not forgetting; it is reinterpretation and a decision about whether a relationship can be repaired.",
    experiment: "Sincere/insincere apology scenarios after transgression with punishment, forgiveness or future cooperation decisions.",
    handbook: "Guide: Altruism; Strategic Thinking; Social Bonding and Attachment; Emotion and Social Behavior."
  },
  "reputation-impression": {
    title: "Reputation and social impression",
    hint: "Public image, evaluation of others and reputation memory",
    description: "Integrates processes for forming, maintaining and updating impressions about other people or oneself before others.",
    guide: "A social action has immediate consequences, but it also changes reputation, future trust and social value.",
    experiment: "Associate faces with cooperative, selfish or ambiguous actions, then measure trust and memory.",
    handbook: "Guide: Impression Formation; Strategic Thinking; Person Perception; Social Rewards."
  },
  "fairness-punishment": {
    title: "Fairness and punishment",
    hint: "Equity, injustice, altruistic punishment and social norms",
    description: "Groups systems evaluating fair distribution, norm violation, moral anger and punishment decisions even when punishment is costly.",
    guide: "Connect behavioral economics, moral emotion and control: punishment may protect norms, but depends on context, intention and reputation.",
    experiment: "Ultimatum or unequal-split game with options to accept, reject or punish the violator.",
    handbook: "Guide: Altruism; Strategic Thinking; Ethical, Legal, and Societal Issues; Social Rewards."
  },
  "social-uncertainty": {
    title: "Social uncertainty",
    hint: "Ambiguity, prediction, interpersonal risk and updating",
    description: "Represents how the brain decides when intentions, rules or social consequences are ambiguous and must be updated with new evidence.",
    guide: "Social life requires inference under uncertainty: a cue can mean threat, cooperation, irony or error.",
    experiment: "Ambiguous social scenarios with gradual new information; measure interpretation and confidence change.",
    handbook: "Guide: Strategic Thinking; Social Threat; Goal-Directed Social Behavior; Impression Formation."
  },
  "social-decision-choice": {
    title: "Social decision-making",
    hint: "Preferences, alternatives, consequences and interpersonal choice",
    description: "Organizes processes for choosing when consequences affect other people or depend on their responses.",
    guide: "Connect decision theory with the social brain: deciding means anticipating consequences, others' preferences, reputation and contextual norms.",
    experiment: "Choices between self-benefit, shared benefit and social cost; compare private versus observed decisions.",
    handbook: "Reference: Decision Theory and Rationality; Game Theory and Political Theory; Rational Choice and Judgment."
  },
  "strategic-interaction": {
    title: "Strategic interaction",
    hint: "Game theory, prediction of others, cooperation and competition",
    description: "Represents situations where the outcome depends on both one's own action and another person or group's expected action.",
    guide: "Use it for social dilemmas, trust games, negotiation, reciprocity and competition as interpersonal prediction problems.",
    experiment: "Prisoner's dilemma, repeated trust or coordination game with incomplete information about the other's strategy.",
    handbook: "Reference: Behavioral Game Theory; Game Theory and Political Theory; Foundations of Cooperation in Economic Life."
  },
  "risk-ambiguity-social": {
    title: "Social risk and ambiguity",
    hint: "Prospect theory, loss, gain, uncertainty and social context",
    description: "Groups processes for deciding under known risk or ambiguous probabilities when gains, losses or consequences are social.",
    guide: "Shows why an option changes value when it involves status loss, rejection risk, shared gain or uncertainty about others' reactions.",
    experiment: "Social gains/losses under explicit risk versus ambiguity, measuring loss aversion and confidence.",
    handbook: "Reference: Prospect Theory for Risk and Ambiguity; Decision Theory and Rationality."
  },
  "bounded-rationality-bias": {
    title: "Bounded rationality and bias",
    hint: "Heuristics, bias, emotion, cognitive load and social decision",
    description: "Integrates limits of attention, memory, control and emotion that make social decisions depart from ideal rationality.",
    guide: "Many social decisions are reasonable under real limits: little time, incomplete information, active emotion and group norms.",
    experiment: "Compare a social choice with complete information versus time pressure, gain/loss framing or group feedback.",
    handbook: "Reference: Bounded Rationality and Politics; Predictably Irrational; Rational Choice and Judgment."
  },
  "choice-architecture-nudge": {
    title: "Choice architecture and nudge",
    hint: "Context, defaults, influence, option design and social behavior",
    description: "Represents how the presentation of alternatives can change decisions without forbidding options.",
    guide: "Small changes in social or institutional environments can guide choices about health, cooperation, consumption, helping or participation.",
    experiment: "Modify order, default option or descriptive norm in a social decision and measure choice change.",
    handbook: "Reference: Nudge; Handbook on Decision Making; Behavioral Game Theory."
  },
  "collective-choice": {
    title: "Collective choice",
    hint: "Group preferences, voting, justice and public decision",
    description: "Groups processes that transform individual preferences into shared decisions, including negotiation, voting and distributive justice.",
    guide: "Living in groups requires transforming individual preferences into acceptable shared rules and collective decisions.",
    experiment: "Simulate voting with divergent preferences, agenda change and fairness evaluation.",
    handbook: "Reference: A Primer in Social Choice Theory; Game Theory and Public Policy; The Handbook of Rational and Social Choice."
  },
  "interpersonal-synchrony": {
    title: "Interpersonal synchrony",
    hint: "Shared rhythm, coordination, conversation and affiliation",
    description: "Organizes systems that tune timing, movement, conversational turns and bodily coordination with other people.",
    guide: "Moving or speaking in synchrony can increase affiliation, cooperation and belonging.",
    experiment: "Synchronous versus asynchronous tapping or rocking in pairs, followed by closeness and cooperation ratings.",
    handbook: "Guide: Mirror Neuron System and Social Cognition; Social Bonding and Attachment; Language and Communication."
  },
  "affective-mentalizing": {
    title: "Affective mentalizing",
    hint: "Inferring others' emotions, needs and internal states",
    description: "Links theory of mind and emotion: inferring what another person feels, why they feel it and what they may need.",
    guide: "Separate reading a belief from understanding an affective state; real social inference is often emotional as well as cognitive.",
    experiment: "Brief stories with implicit emotion; identify feeling, cause and appropriate response.",
    handbook: "Guide: Social Neuroscience of Empathy; Theory of Mind Deficits; Emotion Recognition; Person Perception."
  },
  "intercorporeality-interaffectivity": {
    title: "Intercorporeality and interaffectivity",
    hint: "Shared body, affective resonance, presence and coordination",
    description: "Integrates the idea that social life does not start from isolated minds, but from bodies that affect, synchronize and regulate one another.",
    guide: "Emotion, posture, rhythm, gaze and tone are part of how social meaning is built with others.",
    experiment: "Compare face-to-face conversation, audio interaction and text interaction, measuring synchrony, perceived affect and interpersonal understanding.",
    handbook: "Reference: Intercorporeality and Interaffectivity; Radical Embodiment; Empathy bodyssence."
  },
  "dominance-hierarchy": {
    title: "Dominance and hierarchy",
    hint: "Status, power, social threat and group position",
    description: "Represents how the brain evaluates status, dominance, power, social threat and position within a group.",
    guide: "Useful for leadership, obedience, competition, status, social threat sensitivity and learning hierarchical positions.",
    experiment: "Face-based hierarchy learning, choices against dominant/subordinate opponents and status feedback.",
    handbook: "Guide: Neural Representation of Social Hierarchy; Social Dominance; Primate Social Behavior; Social Threat."
  },
  "trust-cooperation": {
    title: "Trust and cooperation",
    hint: "Altruism, reciprocity, reputation and decision-making",
    description: "Groups valuation, social reward, reputation memory and norm-control circuits that support trust, cooperation and fairness.",
    guide: "Works well with economic games showing how social value, person memory and impulse control combine in cooperative decisions.",
    experiment: "Trust game, ultimatum/dictator game and repeated cooperation with visible/invisible reputation.",
    handbook: "Guide: Altruism; Strategic Thinking; Social Rewards; Impression Formation; Social Bonding and Attachment."
  },
  "social-learning-memory": {
    title: "Social memory and learning",
    hint: "Context, episodes, people, culture and learning",
    description: "Integrates episodic memory, experience-based learning, social context, culture and updated models of people or groups.",
    guide: "Explain how we remember who did what, in which context, with which emotion, and how that experience changes future expectations.",
    experiment: "Face-context-emotion memory, reputation learning and incidental memory for self/other traits.",
    handbook: "Guide: Evolutionary Basis of the Social Brain; Cultural Neuroscience; Person Perception; Strategic Thinking."
  },
  "rejection-exclusion": {
    title: "Rejection and social exclusion",
    hint: "Social pain, evaluative threat, belonging and regulation",
    description: "Integrates systems responding to exclusion, disapproval, evaluative threat and loss of belonging.",
    guide: "Shows why rejection can feel bodily, how it changes attention and which resources regulate it.",
    experiment: "Brief Cyberball, acceptance/rejection feedback and cognitive regulation of negative social comments.",
    handbook: "Guide: Why Rejection Hurts; Social Threat; Perceived Social Isolation; Social Regulation of Emotion."
  },
  "communication-health": {
    title: "Communication, stress and social health",
    hint: "Voice, language, social threat, support and regulation",
    description: "Connects communicative cues with social stress, interpersonal support, threat, isolation and emotion regulation.",
    guide: "A strong closing theme: communication, support, evaluative threat, rejection, stress biology and well-being.",
    experiment: "Emotional prosody + brief social threat task + perceived support/rejection report.",
    handbook: "Guide: Hearing Voices; Social Regulation of Emotion; Social Isolation; Social Support and Health; Social Threat."
  },
  "social-metacognition": {
    title: "Social metacognition",
    hint: "Confidence, monitoring one's own judgment and interpersonal learning",
    description: "Represents the capacity to evaluate confidence in a social interpretation, recognize errors, revise beliefs and learn from others' feedback.",
    guide: "It is not enough to infer another person's intention; we also need to know how confident we are and when to correct the inference.",
    experiment: "Judgments about intention or emotion with confidence rating, later feedback and interpretation updating.",
    handbook: "Reference: Metacognition; Social Cognition; Cognitive control."
  }
};
const regionTextEn = {
  dlpfc: ["Dorsolateral prefrontal cortex", "Executive control", "Frontal control hub: working memory, goal selection, inhibition and flexible adjustment of behavior.", "Middle/superior frontal gyrus, BA 9/46.", "Working memory, planning, executive attention, rule monitoring.", "Frontoparietal control network; interaction with salience network.", "Spatial 2-back", "Tests working memory and contextual updating."],
  premotor: ["Premotor cortex", "Motor preparation", "Transforms sensory cues into action plans and prepares movement sequences.", "Posterior frontal lobe, anterior to M1, BA 6.", "Action selection, motor preparation, sequence learning.", "Premotor-parietal and basal ganglia circuits.", "Go / No-Go", "Measures response preparation and inhibition."],
  auditory: ["Primary auditory cortex", "Sound processing", "Early cortical sound map coding frequency, intensity and rapid acoustic change.", "Heschl's transverse temporal gyrus, BA 41/42.", "Tonotopic analysis, change detection, early auditory integration.", "Thalamocortical auditory pathway and superior temporal networks.", "Auditory oddball", "Explores sensory detection and novelty response."],
  dmn: ["Default mode network", "Rest and introspection", "Distributed network for self-reference, autobiographical memory and mental simulation.", "Medial prefrontal cortex, precuneus/PCC, angular and medial temporal regions.", "Self-reference, prospection, episodic memory, social mind.", "Default mode medial-temporal and dorsal medial subsystems.", "Guided rest", "Alternates external fixation and brief introspection."],
  visual: ["Primary visual cortex", "Early vision", "Initial retinotopic map for edges, contrast, orientation and spatial layout.", "Calcarine sulcus, occipital lobe, BA 17.", "Contrast, orientation, visual field, early visual processing.", "Dorsal occipitoparietal and ventral occipitotemporal pathways.", "Visual detection", "Detects brief contrast changes."],
  hippocampus: ["Hippocampus", "Episodic memory", "Medial temporal structure essential for episodic memories and relational context.", "Medial temporal lobe, hippocampal formation.", "Episodic encoding, navigation, context-event association.", "Medial temporal system; coupling with default mode network.", "Paired-associate memory", "Encodes and recognizes color-position pairs."],
  insula: ["Anterior insula", "Salience", "Integrates interoceptive signals and detects relevant events for switching between rest and control.", "Anterior insular cortex, deep in the lateral fissure.", "Interoception, salience, bodily awareness, task switching.", "Salience network with dorsal anterior cingulate.", "Breathing count", "Tracks perceived respiratory cycles during short intervals."],
  parietal: ["Posterior parietal cortex", "Spatial attention", "Integrates vision, proprioception and goals to orient attention and action.", "Superior and inferior parietal lobe, BA 7/39/40.", "Spatial attention, multisensory integration, visuomotor transformation.", "Dorsal attention and frontoparietal networks.", "Spatial cueing", "Uses valid and invalid cues to estimate attentional orienting."],
  amygdala: ["Amygdala", "Emotional value", "Evaluates affective relevance, threat, emotional learning and memory modulation.", "Anterior medial temporal lobe.", "Aversive learning, emotional salience, autonomic modulation.", "Limbic circuits with hippocampus, vmPFC and hypothalamus.", "Emotional Stroop", "Classifies color while ignoring affective words."],
  cerebellum: ["Cerebellum", "Prediction and adjustment", "Coordinates timing, error-based learning, motor adjustment and predictive cognitive contributions.", "Posterior fossa, dorsal to the brainstem.", "Coordination, timing, adaptive learning, sensorimotor prediction.", "Cerebello-thalamo-cortical loops.", "Rhythmic synchronization", "Tap to a rhythm and continue without external signal."],
  salience: ["Salience network", "Priority switching", "Detects relevant events and helps switch between internal focus, executive control and adaptive response.", "Anterior insula and dorsal anterior cingulate, with subcortical coupling.", "Salience detection, interoception, adaptive control, network switching.", "Bridge between default mode and frontoparietal control networks.", "Emotional oddball", "Detects frequent and deviant emotionally relevant stimuli."],
  ventralAttention: ["Ventral attention network / TPJ", "Social reorienting", "Reorients toward unexpected events, including gaze, voice and gestures.", "Temporoparietal junction, inferior parietal, supramarginal and superior temporal regions.", "Attention reorienting, novelty detection, perspective, social cues.", "Ventral attention and temporoparietal social circuits.", "Gaze cueing", "Compares valid and invalid gaze cues."],
  vmPfc: ["Ventromedial prefrontal / orbitofrontal cortex", "Social value", "Integrates value, reward, preference and personal meaning in social decisions.", "Medial/lateral orbitofrontal and ventromedial prefrontal cortex.", "Valuation, reward, flexibility, social choice, affect regulation.", "Orbitofrontal circuits with striatum, amygdala, hippocampus and default mode network.", "Social decision", "Choose between self-benefit and shared benefit."],
  acc: ["Anterior cingulate cortex", "Conflict and effort", "Monitors conflict, error, effort and control demand, linking cognition with affect.", "Rostral and caudal anterior cingulate on the medial frontal surface.", "Conflict monitoring, error, social pain, effort, affect regulation.", "Salience and cingulo-opercular control networks.", "Social Flanker", "Respond under congruent/incongruent distractors and social feedback."],
  thalamostriatal: ["Thalamo-striatal circuit", "Habit and reward", "Subcortical circuit for action selection, reward learning, habits and attentional gating.", "Thalamus, caudate, putamen, pallidum, accumbens and basal forebrain.", "Reward, reinforcement learning, action selection, habits, motivation.", "Fronto-striato-thalamo-cortical loops.", "Reward learning", "Choose between options with changing reward probabilities."],
  fusiformFace: ["Fusiform gyrus / face network", "Visual identity", "Ventral temporal region important for expert visual recognition, especially facial identity.", "Fusiform gyrus and inferior/middle temporal cortex.", "Face recognition, identity, complex form, visual expertise.", "Ventral occipitotemporal pathway; links with superior temporal cortex and amygdala.", "Face recognition", "Compare memory for faces, objects and inverted faces."]
};

const container = document.querySelector("#scene");
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0d1014, 5, 13);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(0, 1.3, 6.2);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.localClippingEnabled = true;
container.appendChild(renderer.domElement);
renderer.domElement.style.touchAction = "none";

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 2.7;
controls.maxDistance = 8;
controls.target.set(0, 0.25, 0);
controls.rotateSpeed = 0.58;
controls.zoomSpeed = 0.72;
controls.panSpeed = 0.42;
controls.screenSpacePanning = true;
controls.enablePan = true;
controls.enableRotate = false;
controls.autoRotate = false;
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.PAN
};
controls.touches = {
  ONE: THREE.TOUCH.ROTATE,
  TWO: THREE.TOUCH.DOLLY_PAN
};

const brain = new THREE.Group();
scene.add(brain);

scene.add(new THREE.AmbientLight(0xf5eee5, 0.82));
const key = new THREE.DirectionalLight(0xffffff, 3.0);
key.position.set(-4, 5, 5);
scene.add(key);
const rim = new THREE.DirectionalLight(0x55c2b7, 1.6);
rim.position.set(4, 1, -4);
scene.add(rim);
const warmFill = new THREE.DirectionalLight(0xd9b66f, 0.72);
warmFill.position.set(2, -1, 3);
scene.add(warmFill);

const hemi = new THREE.HemisphereLight(0x95b7ff, 0x4a231f, 0.48);
scene.add(hemi);

function makeTissueTexture(size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(size, size);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4;
      const wave = Math.sin(x * 0.075) * 18 + Math.sin((x + y) * 0.035) * 16 + Math.sin(y * 0.115) * 8;
      const grain = (Math.random() - 0.5) * 30;
      const value = 138 + wave + grain;
      image.data[i] = Math.max(72, Math.min(228, value + 34));
      image.data[i + 1] = Math.max(48, Math.min(182, value - 4));
      image.data[i + 2] = Math.max(42, Math.min(154, value - 18));
      image.data[i + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.8, 2.8);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeBumpTexture(size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(size, size);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4;
      const folds = Math.sin(x * 0.105 + Math.sin(y * 0.04) * 2.2) * 42;
      const micro = Math.sin((x - y) * 0.18) * 12 + (Math.random() - 0.5) * 22;
      const value = Math.max(18, Math.min(238, 122 + folds + micro));
      image.data[i] = value;
      image.data[i + 1] = value;
      image.data[i + 2] = value;
      image.data[i + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5.5, 5.5);
  return texture;
}

const tissueMap = makeTissueTexture();
const bumpMap = makeBumpTexture();
function makeInternalSliceTexture(size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(size, size);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4;
      const fibers = Math.sin(x * 0.05 + Math.sin(y * 0.025) * 3) * 28;
      const vessels = Math.sin((x + y) * 0.12) > 0.94 ? 42 : 0;
      const lamina = Math.sin(y * 0.075) * 12;
      const noise = (Math.random() - 0.5) * 24;
      const value = 148 + fibers + lamina + noise;
      image.data[i] = Math.max(80, Math.min(230, value + vessels + 28));
      image.data[i + 1] = Math.max(56, Math.min(190, value + 2));
      image.data[i + 2] = Math.max(50, Math.min(168, value - 12));
      image.data[i + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const internalSliceMap = makeInternalSliceTexture();
function makeSelectionHalo(color = 0x55c2b7) {
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });
  const halo = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), material);
  halo.visible = false;
  scene.add(halo);
  return halo;
}

const selectionHalo = makeSelectionHalo();
selectionHalo.visible = false;

const cortexMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xd78374,
  map: tissueMap,
  bumpMap,
  bumpScale: 0.025,
  roughness: 0.72,
  metalness: 0.02,
  clearcoat: 0.35,
  clearcoatRoughness: 0.5,
  transparent: true,
  opacity: 0.92
});

const deepMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xd9b66f,
  map: tissueMap,
  bumpMap,
  bumpScale: 0.014,
  roughness: 0.68,
  metalness: 0.02,
  transparent: true,
  opacity: 0.7
});

function makeLobe(name, position, scale, color = 0xd78374) {
  const geometry = new THREE.SphereGeometry(1, 48, 32);
  const material = cortexMaterial.clone();
  material.color.setHex(color);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  brain.add(mesh);
  return mesh;
}

function colorForCerebraLabel(label, region) {
  if ([5, 29, 37, 41, 56, 80, 88, 92].includes(label)) return 0x6f93a4;
  if ([11, 62].includes(label)) return 0x9a7659;
  if ([39, 46, 90, 97, 2, 20, 50, 53, 71, 101].includes(label)) return 0xb88962;
  if ([40, 49, 91, 100, 21, 72, 27, 78, 4, 55, 25, 76, 26, 77].includes(label)) return 0xb8a06d;
  if ([48, 99, 19, 70, 18, 69, 36, 87].includes(label)) return 0xc99a67;
  if (region) return new THREE.Color(region.color).lerp(new THREE.Color(0xd08a7c), 0.58).getHex();
  return label <= 51 ? 0xc98278 : 0xb97986;
}

makeLobe("frontal-left", [-0.82, 0.72, 0.28], [1.03, 0.85, 1.02]);
makeLobe("frontal-right", [-0.82, 0.72, -0.28], [1.03, 0.85, 1.02]);
makeLobe("parietal-left", [0.22, 0.85, 0.34], [1.02, 0.84, 0.98], 0xdd8c7e);
makeLobe("parietal-right", [0.22, 0.85, -0.34], [1.02, 0.84, 0.98], 0xdd8c7e);
makeLobe("temporal-left", [-0.05, 0.0, 0.9], [0.88, 0.42, 0.46], 0xc97870);
makeLobe("temporal-right", [-0.05, 0.0, -0.9], [0.88, 0.42, 0.46], 0xc97870);
makeLobe("occipital-left", [1.18, 0.48, 0.25], [0.65, 0.62, 0.72], 0xe29676);
makeLobe("occipital-right", [1.18, 0.48, -0.25], [0.65, 0.62, 0.72], 0xe29676);
makeLobe("cerebellum-left", [0.82, -0.78, 0.34], [0.58, 0.34, 0.48], 0xb9875c);
makeLobe("cerebellum-right", [0.82, -0.78, -0.34], [0.58, 0.34, 0.48], 0xb9875c);

const stem = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.2, 1.18, 18, 34),
  new THREE.MeshPhysicalMaterial({ color: 0xa97859, roughness: 0.68 })
);
stem.position.set(0.35, -0.64, 0);
stem.rotation.z = -0.2;
brain.add(stem);

const callosum = new THREE.Mesh(
  new THREE.TorusGeometry(0.58, 0.07, 16, 80, Math.PI * 1.08),
  deepMaterial
);
callosum.position.set(-0.05, 0.35, 0);
callosum.rotation.set(Math.PI / 2, 0.08, 0);
brain.add(callosum);

const regionMeshes = new Map();
const atlasMeshes = new Map();
const allAtlasMeshes = [];
const internalAtlasMeshes = [];
let importedBrain = null;
let proceduralVisible = false;
const originalAtlasColors = new Map();
const markerMaterial = new THREE.MeshPhysicalMaterial({
  map: tissueMap,
  bumpMap,
  bumpScale: 0.02,
  roughness: 0.35,
  metalness: 0.05,
  emissiveIntensity: 0.45,
  transparent: true,
  opacity: 0.88
});

regions.forEach((region) => {
  const marker = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), markerMaterial.clone());
  marker.material.color.setHex(region.color);
  marker.material.emissive = new THREE.Color(region.color).multiplyScalar(0.18);
  marker.position.set(...region.position);
  marker.scale.set(...region.scale);
  marker.userData.regionId = region.id;
  brain.add(marker);
  regionMeshes.set(region.id, marker);
});

const sulcusMaterial = new THREE.LineBasicMaterial({ color: 0x4d2221, transparent: true, opacity: 0.42 });
for (let i = 0; i < 36; i += 1) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.35 + Math.random() * 0.5, 0.35 + Math.random() * 0.7, -0.92 + Math.random() * 1.84),
    new THREE.Vector3(-0.35 + Math.random() * 0.8, 0.65 + Math.random() * 0.7, -1.05 + Math.random() * 2.1),
    new THREE.Vector3(0.85 + Math.random() * 0.5, 0.35 + Math.random() * 0.55, -0.82 + Math.random() * 1.64)
  ]);
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(60)), sulcusMaterial);
  brain.add(line);
}

const networkMaterial = new THREE.LineBasicMaterial({ color: 0x55c2b7, transparent: true, opacity: 0.24 });
const networkPairs = [
  ["dlpfc", "parietal"],
  ["dlpfc", "premotor"],
  ["dmn", "hippocampus"],
  ["dmn", "parietal"],
  ["insula", "dlpfc"],
  ["auditory", "insula"],
  ["salience", "dlpfc"],
  ["salience", "dmn"],
  ["salience", "acc"],
  ["ventralAttention", "parietal"],
  ["ventralAttention", "auditory"],
  ["vmPfc", "amygdala"],
  ["vmPfc", "thalamostriatal"],
  ["fusiformFace", "amygdala"],
  ["fusiformFace", "ventralAttention"],
  ["thalamostriatal", "premotor"]
];
networkPairs.forEach(([a, b]) => {
  const start = regionMeshes.get(a).position;
  const end = regionMeshes.get(b).position;
  const mid = start.clone().lerp(end, 0.5).add(new THREE.Vector3(0, 0.35, 0));
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  brain.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)), networkMaterial));
});

const proceduralMeshes = brain.children.slice();
brain.visible = false;
proceduralMeshes.forEach((mesh) => {
  mesh.visible = false;
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let selected = regions[0];
let targetCamera = null;
let userInteracting = false;
let pointerDown = null;
let dragState = null;
let lastInteractionAt = 0;
let viewLockedUntil = 0;
let medialCutEnabled = false;
let medialHemisphere = null;
const anatomicalRotation = new THREE.Euler(-Math.PI / 2, 0, 0);
const anatomicalQuaternion = new THREE.Quaternion().setFromEuler(anatomicalRotation);
const modelRotation = {
  yaw: 0,
  pitch: 0
};
const worldUpAxis = new THREE.Vector3(0, 1, 0);
const worldRightAxis = new THREE.Vector3(1, 0, 0);
const medialClipPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
const medialLocalAxis = new THREE.Vector3(1, 0, 0);
const atlasBounds = {
  center: new THREE.Vector3(0, 0, 0),
  radius: 3.25
};

const title = document.querySelector("#region-title");
const summary = document.querySelector("#region-summary");
const locationEl = document.querySelector("#region-location");
const functionsEl = document.querySelector("#region-functions");
const networkEl = document.querySelector("#region-network");
const labelEl = document.querySelector("#region-label");
const socialTitleEl = document.querySelector("#social-title");
const socialSummaryEl = document.querySelector("#social-summary");
const socialConceptsEl = document.querySelector("#social-concepts");
const socialExampleEl = document.querySelector("#social-example");
const deepTitleEl = document.querySelector("#deep-title");
const deepCopyEl = document.querySelector("#deep-copy");
const deepPurposeEl = document.querySelector("#deep-purpose");
const deepSourceEl = document.querySelector("#deep-source");
const experimentTitle = document.querySelector("#experiment-title");
const experimentCopy = document.querySelector("#experiment-copy");
const regionList = document.querySelector("#region-list");
const regionCountEl = document.querySelector("#region-count");
const themeTabsBar = document.querySelector("#theme-tabs-bar");
const modelInput = document.querySelector("#model-input");
const modelStatus = document.querySelector("#model-status");
const zoneList = document.querySelector("#zone-list");
const zoneSearch = document.querySelector("#zone-search");
const zoneCount = document.querySelector("#zone-count");
const tooltipEl = document.querySelector("#brain-tooltip");
let activeSide = "all";
let activeGroup = "all";
let currentLang = "es";

const atlasAliases = {
  dlpfc: ["dlpfc", "dorsolateral", "prefrontal", "ba9", "ba46", "frontal_middle"],
  premotor: ["premotor", "pre_motor", "ba6", "sma", "supplementary_motor"],
  auditory: ["auditory", "heschl", "temporal_transverse", "ba41", "ba42"],
  dmn: ["default", "dmn", "precuneus", "pcc", "posterior_cingulate", "medial_prefrontal", "mpfc"],
  visual: ["visual", "v1", "calcarine", "occipital", "ba17"],
  hippocampus: ["hippocampus", "hippocampal"],
  insula: ["insula", "insular"],
  parietal: ["parietal", "angular", "supramarginal", "ba7", "ba39", "ba40"],
  amygdala: ["amygdala", "amygdaloid"],
  cerebellum: ["cerebellum", "cerebellar"],
  salience: ["salience", "cingulo_opercular", "cingulo-opercular"],
  ventralAttention: ["ventral_attention", "tpj", "temporoparietal", "temporo_parietal"],
  vmPfc: ["vmpfc", "ventromedial", "orbitofrontal", "orbital_frontal"],
  acc: ["anterior_cingulate", "cingulate_anterior", "acc"],
  thalamostriatal: ["thalamus", "caudate", "putamen", "pallidum", "accumbens", "striatal", "striatum"],
  fusiformFace: ["fusiform", "face", "ffa", "inferior_temporal", "middle_temporal"]
};

const cerebraRegionLabels = {
  dlpfc: [1, 38, 42, 52, 89, 93],
  premotor: [16, 35, 67, 86],
  auditory: [14, 45, 65, 96],
  dmn: [15, 31, 33, 47, 66, 82, 84, 98],
  visual: [6, 12, 34, 43, 57, 63, 85, 94],
  hippocampus: [48, 99],
  insula: [23, 74],
  parietal: [9, 10, 51, 60, 61, 102],
  amygdala: [19, 70],
  cerebellum: [2, 20, 39, 46, 50, 53, 71, 90, 97, 101],
  salience: [8, 23, 30, 59, 74, 81],
  ventralAttention: [10, 45, 51, 61, 96, 102],
  vmPfc: [7, 15, 44, 58, 66, 95],
  acc: [8, 30, 59, 81],
  thalamostriatal: [4, 21, 25, 27, 40, 49, 55, 72, 76, 78, 91, 100],
  fusiformFace: [3, 24, 28, 54, 75, 79]
};

const cerebraLabels = [
  [2002, "Caudal Anterior Cingulate", 30, 81, "", 0.79],
  [2003, "Caudal Middle Frontal", 42, 93, "Improved distinction from Precentral", 0.73],
  [2005, "Cuneus", 43, 94, "", 0.67],
  [2006, "Entorhinal", 36, 87, "Improved delimitation", 0.78],
  [2007, "Fusiform", 24, 75, "", 0.77],
  [2008, "Inferior Parietal", 10, 61, "", 0.75],
  [2009, "Inferior Temporal", 3, 54, "Removed dorsal part MT", 0.72],
  [2010, "Isthmus Cingulate", 33, 84, "", 0.79],
  [2011, "Lateral Occipital", 34, 85, "", 0.76],
  [2012, "Lateral Orbitofrontal", 7, 58, "", 0.8],
  [2013, "Lingual", 12, 63, "", 0.75],
  [2014, "Medial Orbitofrontal", 15, 66, "", 0.72],
  [2015, "Middle Temporal", 28, 79, "Added dorsal part", 0.72],
  [2016, "Parahippocampal", 18, 69, "", 0.86],
  [2017, "Paracentral", 16, 67, "", 0.77],
  [2018, "Pars Opercularis", 32, 83, "", 0.77],
  [2019, "Pars Orbitalis", 44, 95, "", 0.8],
  [2020, "Pars Triangularis", 22, 73, "", 0.76],
  [2021, "Pericalcarine", 6, 57, "", 0.6],
  [2022, "Postcentral", 13, 64, "", 0.82],
  [2023, "Posterior Cingulate", 47, 98, "", 0.8],
  [2024, "Precentral", 35, 86, "", 0.84],
  [2025, "Precuneus", 31, 82, "", 0.8],
  [2026, "Rostral Anterior Cingulate", 8, 59, "", 0.72],
  [2027, "Rostral Middle Frontal", 1, 52, "Improved delimitation from CMF", 0.74],
  [2028, "Superior Frontal", 38, 89, "", 0.82],
  [2029, "Superior Parietal", 9, 60, "Improved delimitation from Precuneus and IP", 0.72],
  [2030, "Superior Temporal", 45, 96, "Added dorsal part limiting with IP and Supramarginal", 0.87],
  [2031, "Supramarginal", 51, 102, "", 0.81],
  [2034, "Transverse Temporal", 14, 65, "", 0.85],
  [2035, "Insula", 23, 74, "", 0.88],
  [16, "Brainstem", 11, 62, "Completed filling and removed labelled voxels out of actual brainstem.", 0.65],
  [14, "Third Ventricle", 29, 80, "", 0.68],
  [15, "Fourth Ventricle", 37, 88, "Missing label. Manually delimited using CSF threshold.", 0.39],
  [85, "Optic Chiasm", 17, 68, "Completed optic chiasm and tracts.", 0],
  [43, "Lateral Ventricle", 41, 92, "Improved continuity of labelled voxels.", 0.89],
  [44, "Inferior Lateral Ventricle", 5, 56, "", 0.12],
  [45, "Cerebellum Gray Matter", 46, 97, "Completed filling using threshold for CGM.", 0.83],
  [46, "Cerebellum White Matter", 39, 90, "Improved according threshold for CWM.", 0.73],
  [49, "Thalamus", 40, 91, "", 0.97],
  [50, "Caudate", 49, 100, "Completed filling using threshold.", 0.84],
  [51, "Putamen", 21, 72, "Corrected uniformity using threshold.", 0.87],
  [52, "Pallidum", 27, 78, "Improved delimitation between putamen and pallidum.", 0.83],
  [53, "Hippocampus", 48, 99, "", 0.69],
  [54, "Amygdala", 19, 70, "", 0.64],
  [58, "Accumbens Area", 4, 55, "", 0.76],
  [60, "Ventral Diencephalon", 26, 77, "", 0.93],
  [92, "Basal Forebrain", 25, 76, "", 0.82],
  [630, "Vermal lobules I-V", 50, 101, "Improved delimitation with other vermal lobules and cerebellar hemispheres.", 0.66],
  [631, "Vermal lobules VI-VII", 2, 53, "Improved delimitation with other vermal lobules and cerebellar hemispheres.", 0.38],
  [632, "Vermal lobules VIII-X", 20, 71, "Improved delimitation with other vermal lobules and cerebellar hemispheres.", 0.44]
];

const zoneDisplay = {
  "Caudal Anterior Cingulate": ["Cíngulo anterior caudal", "limbic"],
  "Caudal Middle Frontal": ["Frontal medio caudal", "frontal"],
  "Cuneus": ["Cúneo", "occipital"],
  "Entorhinal": ["Corteza entorrinal", "limbic"],
  "Fusiform": ["Giro fusiforme", "temporal"],
  "Inferior Parietal": ["Parietal inferior", "parietal"],
  "Inferior Temporal": ["Temporal inferior", "temporal"],
  "Isthmus Cingulate": ["Istmo del cíngulo", "limbic"],
  "Lateral Occipital": ["Occipital lateral", "occipital"],
  "Lateral Orbitofrontal": ["Orbitofrontal lateral", "frontal"],
  "Lingual": ["Giro lingual", "occipital"],
  "Medial Orbitofrontal": ["Orbitofrontal medial", "frontal"],
  "Middle Temporal": ["Temporal medio", "temporal"],
  "Parahippocampal": ["Parahipocampal", "limbic"],
  "Paracentral": ["Paracentral", "frontal"],
  "Pars Opercularis": ["Pars opercularis", "frontal"],
  "Pars Orbitalis": ["Pars orbitalis", "frontal"],
  "Pars Triangularis": ["Pars triangularis", "frontal"],
  "Pericalcarine": ["Pericalcarina", "occipital"],
  "Postcentral": ["Postcentral / somatosensorial", "parietal"],
  "Posterior Cingulate": ["Cíngulo posterior", "limbic"],
  "Precentral": ["Precentral / motora primaria", "frontal"],
  "Precuneus": ["Precúneo", "parietal"],
  "Rostral Anterior Cingulate": ["Cíngulo anterior rostral", "limbic"],
  "Rostral Middle Frontal": ["Frontal medio rostral", "frontal"],
  "Superior Frontal": ["Frontal superior", "frontal"],
  "Superior Parietal": ["Parietal superior", "parietal"],
  "Superior Temporal": ["Temporal superior", "temporal"],
  "Supramarginal": ["Giro supramarginal", "parietal"],
  "Transverse Temporal": ["Temporal transverso / Heschl", "temporal"],
  "Insula": ["Ínsula", "limbic"],
  "Brainstem": ["Tronco encefálico", "subcortex"],
  "Third Ventricle": ["Tercer ventrículo", "subcortex"],
  "Fourth Ventricle": ["Cuarto ventrículo", "subcortex"],
  "Optic Chiasm": ["Quiasma óptico", "subcortex"],
  "Lateral Ventricle": ["Ventrículo lateral", "subcortex"],
  "Inferior Lateral Ventricle": ["Ventrículo lateral inferior", "subcortex"],
  "Cerebellum Gray Matter": ["Cerebelo: sustancia gris", "cerebellum"],
  "Cerebellum White Matter": ["Cerebelo: sustancia blanca", "cerebellum"],
  "Thalamus": ["Tálamo", "subcortex"],
  "Caudate": ["Caudado", "subcortex"],
  "Putamen": ["Putamen", "subcortex"],
  "Pallidum": ["Pálido", "subcortex"],
  "Hippocampus": ["Hipocampo", "limbic"],
  "Amygdala": ["Amígdala", "limbic"],
  "Accumbens Area": ["Área accumbens", "subcortex"],
  "Ventral Diencephalon": ["Diencéfalo ventral", "subcortex"],
  "Basal Forebrain": ["Prosencéfalo basal", "subcortex"],
  "Vermal lobules I-V": ["Vermis cerebeloso I-V", "cerebellum"],
  "Vermal lobules VI-VII": ["Vermis cerebeloso VI-VII", "cerebellum"],
  "Vermal lobules VIII-X": ["Vermis cerebeloso VIII-X", "cerebellum"]
};

const socialCognitiveContent = {
  dlpfc: {
    title: "Control cognitivo en contexto social",
    summary: "Mantiene metas activas, inhibe respuestas dominantes y permite ajustar la conducta cuando cambian reglas, normas o demandas sociales.",
    concepts: "Control ejecutivo, memoria de trabajo, toma de decisiones, regulación conductual.",
    example: "Discutir un dilema social donde una respuesta impulsiva compite con una respuesta regulada por normas o metas."
  },
  premotor: {
    title: "Preparación de acciones e imitación",
    summary: "Convierte claves perceptivas en planes motores; es relevante para imitación, aprendizaje por observación y preparación de respuestas sociales.",
    concepts: "Acción observada, preparación motora, mapeo percepción-acción, aprendizaje social.",
    example: "Observar gestos faciales o manuales y medir rapidez para imitarlos o inhibirlos."
  },
  auditory: {
    title: "Percepción auditiva social",
    summary: "Procesa rasgos básicos del sonido que luego permiten interpretar voz, prosodia, habla y cambios relevantes en el ambiente social.",
    concepts: "Voz, prosodia, detección de novedad, atención auditiva.",
    example: "Usar un oddball con tonos o sílabas para mostrar cómo el sistema detecta desviaciones acústicas."
  },
  dmn: {
    title: "Autorreferencia y cognición social",
    summary: "Sostiene procesos de pensamiento interno, memoria autobiográfica, simulación de escenarios y reflexión sobre uno mismo y otras personas.",
    concepts: "Mente social, autorreferencia, memoria autobiográfica, prospección.",
    example: "Comparar juicios sobre rasgos propios, rasgos de otra persona y juicios no sociales."
  },
  visual: {
    title: "Entrada visual para la cognición social",
    summary: "Entrega análisis visual temprano necesario para reconocer caras, movimientos, escenas y señales sociales posteriores.",
    concepts: "Contraste, forma, atención visual, percepción de caras y escenas.",
    example: "Mostrar caras o cuerpos brevemente y manipular contraste para discutir límites perceptivos."
  },
  hippocampus: {
    title: "Memoria episódica y contexto social",
    summary: "Permite vincular personas, lugares, eventos y contexto; esto es crucial para recordar interacciones y aprender de experiencias sociales.",
    concepts: "Memoria episódica, contexto, asociación, navegación relacional.",
    example: "Pedir recordar pares rostro-contexto o persona-emoción después de una fase de codificación."
  },
  insula: {
    title: "Interocepción, empatía y saliencia",
    summary: "Integra señales corporales y relevancia emocional; ayuda a detectar eventos significativos y estados internos durante interacciones.",
    concepts: "Interocepción, saliencia, emoción corporal, empatía afectiva.",
    example: "Relacionar percepción del ritmo respiratorio o cardíaco con evaluación de imágenes emocionales."
  },
  parietal: {
    title: "Atención espacial y perspectiva",
    summary: "Integra espacio, acción y atención; contribuye a orientar la atención hacia señales sociales y a transformar perspectivas.",
    concepts: "Atención espacial, reorientación, integración multisensorial, perspectiva.",
    example: "Usar claves de mirada o flechas para comparar orientación social y no social de la atención."
  },
  amygdala: {
    title: "Valor emocional y aprendizaje social",
    summary: "Detecta relevancia afectiva, especialmente amenaza o valor emocional, y modula memoria y atención hacia estímulos sociales significativos.",
    concepts: "Emoción, amenaza, aprendizaje afectivo, saliencia social.",
    example: "Comparar detección de caras emocionales con caras neutras bajo tiempo limitado."
  },
  cerebellum: {
    title: "Predicción temporal y coordinación social",
    summary: "Además de coordinación motora, participa en predicción temporal y ajuste de secuencias, importantes para sincronía social y aprendizaje por error.",
    concepts: "Timing, predicción, error, sincronización interpersonal.",
    example: "Pedir sincronizar golpes con un ritmo y luego mantenerlo sin señal externa."
  },
  salience: {
    title: "Red de saliencia y cambio de estado",
    summary: "Detecta eventos relevantes del cuerpo o del ambiente y ayuda a reclutar control cuando una situacion exige respuesta.",
    concepts: "Saliencia, interocepcion, cambio de red, alerta, control adaptativo.",
    example: "Comparar un estimulo neutro repetido con un estimulo inesperado y emocionalmente relevante."
  },
  ventralAttention: {
    title: "Reorientacion atencional social",
    summary: "Apoya la captura de atencion por eventos inesperados, mirada, voz o gestos, especialmente cuando cambian las prioridades de la escena.",
    concepts: "TPJ, reorientacion, mirada, novedad, atencion social.",
    example: "Usar claves de mirada validas e invalidas y discutir por que la mirada ajena cuesta ignorarla."
  },
  vmPfc: {
    title: "Valoracion social y significado personal",
    summary: "Integra recompensa, preferencia, norma y valor personal para guiar decisiones sociales flexibles.",
    concepts: "Valor, recompensa, preferencia, reputacion, regulacion afectiva.",
    example: "Comparar decisiones anonimas versus decisiones observadas por otros."
  },
  acc: {
    title: "Conflicto, error y esfuerzo",
    summary: "Permite discutir como el cerebro detecta conflicto, error y necesidad de control, incluyendo errores con significado social.",
    concepts: "Conflicto, monitoreo de error, esfuerzo, dolor social, regulacion.",
    example: "Agregar feedback social a una tarea Stroop o Flanker y observar cambios de cautela."
  },
  thalamostriatal: {
    title: "Aprendizaje por recompensa y habitos",
    summary: "Circuito clave para seleccionar acciones, aprender de recompensas y estabilizar habitos o preferencias.",
    concepts: "Recompensa, estriado, talamo, habitos, motivacion, accion.",
    example: "Una tarea de eleccion donde las probabilidades de recompensa cambian lentamente."
  },
  fusiformFace: {
    title: "Reconocimiento visual de identidad",
    summary: "Apoya reconocimiento de caras y formas complejas; permite conectar percepcion visual con identidad, memoria y emocion.",
    concepts: "Caras, identidad, via ventral, procesamiento configural, experiencia.",
    example: "Comparar reconocimiento de caras normales, caras invertidas y objetos."
  }
};

const socialThemeGroupTextEn = {
  "social-perception": {
    title: "Social perception",
    hint: "Faces, gaze, identity, perspective and impression",
    description: "Groups functions that extract social meaning from faces, gaze, body cues, perspective and reputation."
  },
  "social-emotions": {
    title: "Social emotions",
    hint: "Body, empathy, anger, shame, guilt and pride",
    description: "Collects affective functions that give bodily and relational meaning to social interaction: empathy, anger, shame, guilt, pride, repair, indignation, shared body, rejection and compassion."
  },
  "social-communication": {
    title: "Social communication",
    hint: "Pragmatic language, prosody, synchrony and social health",
    description: "Organizes communicative exchange: verbal intention, prosody, interpersonal coordination and cues of support or threat."
  },
  "social-learning": {
    title: "Social learning",
    hint: "Social memory, imitation, agency and uncertainty",
    description: "Integrates observational learning, memory for people and contexts, intention attribution and updating ambiguous social models."
  },
  "control-norms-morality": {
    title: "Control: social norms and morality",
    hint: "Regulation, norms, justice, deception and repair",
    description: "Links executive control, social norms, moral judgment, justice, punishment, deception, forgiveness and appropriate conduct regulation."
  },
  "social-decision-rationality": {
    title: "Social decision and rationality",
    hint: "Choice, risk, strategy, bias, nudge and collective decision",
    description: "Integrates functions that explain how people choose in social contexts: preferences, risk, ambiguity, strategic interaction, bounded rationality, choice architecture and collective decisions."
  },
  "bonding-cooperation": {
    title: "Bonding and Cooperation",
    hint: "Attachment, reward, altruism and trust",
    description: "Presents motivational functions that support attachment, cooperation, helping, trust, social reward and reciprocity."
  },
  "group-culture-status": {
    title: "Groups, culture and status",
    hint: "Group identity, hierarchy, comparison and bias",
    description: "Explores how the brain processes group belonging, cultural norms, prejudice, stigma, dominance, hierarchy, social comparison and status."
  },
  "social-cognition-mental-health": {
    title: "Social self and Mental health",
    hint: "Self, theory of mind, threat, loneliness and support",
    description: "Brings together the social self and mental health: self, theory of mind, social metacognition, evaluative threat, loneliness, social support and wellbeing."
  }
};

const zoneContentOverrides = {
  "Cíngulo anterior caudal": ["Monitoreo de conflicto", "Evalúa conflicto entre respuestas y ayuda a ajustar control cuando una tarea social exige corregir errores o inhibir impulsos."],
  "Cíngulo anterior rostral": ["Regulación afectiva", "Conecta evaluación emocional y control, útil para discutir dolor social, monitoreo afectivo y regulación."],
  "Cíngulo posterior": ["Autorreferencia", "Forma parte de circuitos de memoria autobiográfica y pensamiento interno relacionados con red por defecto."],
  "Precúneo": ["Simulación mental", "Participa en imaginería, memoria episódica y cambio entre perspectiva propia y escenarios imaginados."],
  "Temporal superior": ["Señales sociales dinámicas", "Relevante para voz, movimiento biológico y señales audiovisuales usadas al interpretar a otras personas."],
  "Temporal transverso / Heschl": ["Audición temprana", "Punto de entrada cortical para sonidos; permite conectar tonos, voz y prosodia en tareas auditivas."],
  "Ínsula": ["Cuerpo y emoción", "Integra estados corporales con relevancia emocional, una vía concreta para hablar de interocepción y empatía."],
  "Amígdala": ["Saliencia emocional", "Prioriza señales afectivas, especialmente caras y estímulos con valor emocional o amenaza."],
  "Hipocampo": ["Memoria social contextual", "Vincula persona, lugar, emoción y episodio, clave para recordar interacciones sociales."],
  "Parahipocampal": ["Contexto de la escena", "Aporta contexto espacial y ambiental para interpretar eventos y recuerdos."],
  "Orbitofrontal medial": ["Valor y decisión social", "Relaciona recompensa, valoración y ajuste de decisiones en escenarios sociales."],
  "Orbitofrontal lateral": ["Cambio de valor", "Ayuda a actualizar decisiones cuando una conducta deja de ser apropiada o recompensante."],
  "Frontal medio rostral": ["Metas y reglas", "Sostiene reglas abstractas y metas durante tareas de decisión social."],
  "Frontal medio caudal": ["Control de tarea", "Apoya selección de respuestas y control cognitivo durante demandas complejas."],
  "Frontal superior": ["Control sostenido", "Contribuye al mantenimiento de metas y control atencional prolongado."],
  "Giro supramarginal": ["Atención y perspectiva corporal", "Participa en integración sensoriomotora y puede usarse para discutir perspectiva y cuerpo propio/ajeno."],
  "Parietal inferior": ["Atención social", "Integra atención, acción y significado de claves visuales como mirada, gestos o dirección."],
  "Precentral / motora primaria": ["Ejecución de acción", "Permite contrastar preparación/observación de acciones con ejecución motora directa."],
  "Postcentral / somatosensorial": ["Cuerpo percibido", "Base para discutir tacto, cuerpo y representación somatosensorial en cognición social."]
};

const literalQuoteLibrary = {
  socialSpecies: {
    copy: "\"create emergent organizations beyond the individual\"",
    copyEs: "\"crean organizaciones emergentes más allá del individuo\"",
    importance: "Social life builds dyads, families, groups and cultures; each function helps the person move inside those levels.",
    importanceEs: "La vida social organiza díadas, familias, grupos y culturas; cada función ayuda a moverse dentro de esos niveles.",
    source: "Cacioppo & Decety, The Oxford Handbook of Social Neuroscience, Ch. 1"
  },
  socialBrain: {
    copy: "\"not solitary information processors\"",
    copyEs: "\"no son procesadores solitarios de información\"",
    importance: "The function matters because the brain constantly interprets action, timing and meaning with other people.",
    importanceEs: "La función importa porque el cerebro interpreta acción, tiempo y significado junto con otras personas.",
    source: "Cacioppo & Decety, The Oxford Handbook of Social Neuroscience, Ch. 1"
  },
  socialCognition: {
    copy: "\"human social behavior\"",
    copyEs: "\"conducta social humana\"",
    importance: "This links the selected function to real social behavior rather than to an isolated cognitive skill.",
    importanceEs: "Esto vincula la función seleccionada con conducta social real, no solo con una habilidad cognitiva aislada.",
    source: "Gazzaniga, Ivry & Mangun, Cognitive Neuroscience, Ch. Social Cognition"
  },
  mentalStates: {
    copy: "\"understanding the mental states of others\"",
    copyEs: "\"comprender los estados mentales de otros\"",
    importance: "It is essential for predicting beliefs, intentions and needs when another person sees the world differently.",
    importanceEs: "Es esencial para predecir creencias, intenciones y necesidades cuando otra persona ve el mundo de otra manera.",
    source: "Gazzaniga, Ivry & Mangun, Cognitive Neuroscience, Ch. Social Cognition"
  },
  selfReference: {
    copy: "\"process it in relation to themselves\"",
    copyEs: "\"procesarlo en relación con ellos mismos\"",
    importance: "Self-reference helps organize memory, identity and social meaning around what matters personally.",
    importanceEs: "La autorreferencia ayuda a organizar memoria, identidad y significado social alrededor de lo personalmente relevante.",
    source: "Gazzaniga, Ivry & Mangun, Cognitive Neuroscience, Ch. Social Cognition"
  },
  personCues: {
    copy: "\"facial expressions, body movements, clothes, actions, and words\"",
    copyEs: "\"expresiones faciales, movimientos corporales, ropa, acciones y palabras\"",
    importance: "Person perception turns visible and audible cues into identity, emotion and social expectation.",
    importanceEs: "La percepción de personas transforma señales visibles y audibles en identidad, emoción y expectativa social.",
    source: "Gazzaniga, Ivry & Mangun, Cognitive Neuroscience, Ch. Social Cognition"
  },
  friendFoe: {
    copy: "\"identify friend from foe and trustworthy from untrustworthy\"",
    copyEs: "\"identificar amigo de enemigo y confiable de no confiable\"",
    importance: "This supports fast social orientation: whom to approach, avoid, trust or evaluate more carefully.",
    importanceEs: "Esto sostiene la orientación social rápida: a quién acercarse, evitar, confiar o evaluar con más cuidado.",
    source: "Gazzaniga, Ivry & Mangun, Cognitive Neuroscience, Ch. Social Cognition"
  },
  jointAttention: {
    copy: "\"share joint attention\"",
    copyEs: "\"compartir atención conjunta\"",
    importance: "Joint attention lets people coordinate attention around the same object, event or intention.",
    importanceEs: "La atención conjunta permite coordinar la atención alrededor de un mismo objeto, evento o intención.",
    source: "Gazzaniga, Ivry & Mangun, Cognitive Neuroscience, Ch. Social Cognition"
  },
  intentions: {
    copy: "\"goals and intentions\"",
    copyEs: "\"metas e intenciones\"",
    importance: "Interpreting agency helps decide whether an act was accidental, deliberate, cooperative or harmful.",
    importanceEs: "Interpretar agencia ayuda a decidir si una acción fue accidental, deliberada, cooperativa o dañina.",
    source: "Gazzaniga, Ivry & Mangun, Cognitive Neuroscience, Ch. Social Cognition"
  },
  wordsMentalStates: {
    copy: "\"words don’t match their mental states\"",
    copyEs: "\"las palabras no coinciden con sus estados mentales\"",
    importance: "Communication requires reading intention, tone and context, especially when literal words are not enough.",
    importanceEs: "La comunicación requiere leer intención, tono y contexto, especialmente cuando las palabras literales no bastan.",
    source: "Gazzaniga, Ivry & Mangun, Cognitive Neuroscience, Ch. Social Cognition"
  },
  emotionBehavior: {
    copy: "\"emotional impact on social behavior\"",
    copyEs: "\"impacto emocional en la conducta social\"",
    importance: "Emotion guides priority, bodily readiness and social interpretation before a deliberate response appears.",
    importanceEs: "La emoción guía prioridad, preparación corporal e interpretación social antes de una respuesta deliberada.",
    source: "Winkielman, Berridge & Sher, The Oxford Handbook of Social Neuroscience, Ch. 12"
  },
  empathyCapacity: {
    copy: "\"empathy is our capacity to understand and respond\"",
    copyEs: "\"la empatía es nuestra capacidad de comprender y responder\"",
    importance: "Empathy is important because it connects another person's state with care, help or regulation.",
    importanceEs: "La empatía importa porque conecta el estado de otra persona con cuidado, ayuda o regulación.",
    source: "Gazzaniga, Ivry & Mangun, Cognitive Neuroscience, Ch. Social Cognition"
  },
  guiltAmends: {
    copy: "\"pangs of guilt propel us to make amends\"",
    copyEs: "\"los remordimientos de culpa nos impulsan a reparar\"",
    importance: "Guilt and repair convert social error into apology, compensation and restoration of trust.",
    importanceEs: "La culpa y la reparación convierten el error social en disculpa, compensación y restauración de confianza.",
    source: "Winkielman, Berridge & Sher, The Oxford Handbook of Social Neuroscience, Ch. 12"
  },
  moralSentiments: {
    copy: "\"pride, guilt, shame, embarrassment, or indignation\"",
    copyEs: "\"orgullo, culpa, vergüenza, embarazo o indignación\"",
    importance: "These emotions evaluate the self and others through norms, reputation and social consequences.",
    importanceEs: "Estas emociones evalúan al yo y a otros mediante normas, reputación y consecuencias sociales.",
    source: "Zahn, de Oliveira-Souza & Moll, The Oxford Handbook of Social Neuroscience, Ch. 32"
  },
  moralNorms: {
    copy: "\"right\" or \"wrong\" based on socio-cultural norm",
    copyEs: "\"correcto\" o \"incorrecto\" según una norma sociocultural",
    importance: "Moral cognition lets people evaluate harm, responsibility and acceptable conduct in shared life.",
    importanceEs: "La cognición moral permite evaluar daño, responsabilidad y conducta aceptable en la vida compartida.",
    source: "Zahn, de Oliveira-Souza & Moll, The Oxford Handbook of Social Neuroscience, Ch. 32"
  },
  socialNorms: {
    copy: "\"behavior counter to moral and social norms\"",
    copyEs: "\"conducta contraria a normas morales y sociales\"",
    importance: "Norm control helps adapt behavior to expectations, roles and consequences in a group.",
    importanceEs: "El control normativo ayuda a adaptar la conducta a expectativas, roles y consecuencias dentro de un grupo.",
    source: "Zahn, de Oliveira-Souza & Moll, The Oxford Handbook of Social Neuroscience, Ch. 32"
  },
  indignationAnger: {
    copy: "\"Indignation/anger and contempt/disgust towards others\"",
    copyEs: "\"indignación/rabia y desprecio/asco hacia otros\"",
    importance: "Moral anger marks a perceived violation and can motivate confrontation, punishment or repair.",
    importanceEs: "La rabia moral marca una violación percibida y puede motivar confrontación, castigo o reparación.",
    source: "Zahn, de Oliveira-Souza & Moll, The Oxford Handbook of Social Neuroscience, Ch. 32"
  },
  fairnessEmpathy: {
    copy: "\"fairness in social relations also affects empathy\"",
    copyEs: "\"la justicia en las relaciones sociales también afecta la empatía\"",
    importance: "Fairness shapes how much people care, punish, cooperate and restore balance after inequity.",
    importanceEs: "La justicia modula cuánto cuidamos, castigamos, cooperamos y restauramos equilibrio tras la inequidad.",
    source: "Gazzaniga, Ivry & Mangun, Cognitive Neuroscience, Ch. Social Cognition"
  },
  trustCooperation: {
    copy: "\"unconditional trust in economic cooperation\"",
    copyEs: "\"confianza incondicional en la cooperación económica\"",
    importance: "Trust allows people to take social risks when future cooperation may benefit both sides.",
    importanceEs: "La confianza permite asumir riesgos sociales cuando la cooperación futura puede beneficiar a ambos.",
    source: "Zahn, de Oliveira-Souza & Moll, The Oxford Handbook of Social Neuroscience, Ch. 32"
  },
  reputationTrust: {
    copy: "\"Reputation and trust in a two-person economic exchange\"",
    copyEs: "\"reputación y confianza en un intercambio económico de dos personas\"",
    importance: "Reputation stores social history so later decisions can use memory of reliability or betrayal.",
    importanceEs: "La reputación guarda historia social para que decisiones posteriores usen memoria de confiabilidad o traición.",
    source: "Zahn, de Oliveira-Souza & Moll, The Oxford Handbook of Social Neuroscience, Ch. 32"
  },
  vicariousReward: {
    copy: "\"rewards being delivered to themselves or a stranger\"",
    copyEs: "\"recompensas entregadas a ellos mismos o a un desconocido\"",
    importance: "Social reward matters because another person's outcome can influence motivation, empathy and prosocial action.",
    importanceEs: "La recompensa social importa porque el resultado de otra persona puede influir en motivación, empatía y ayuda.",
    source: "Contreras-Huerta et al., Neural representations of vicarious rewards"
  },
  socialConnectedness: {
    copy: "\"social connectedness serves as a scaffold\"",
    copyEs: "\"la conexión social sirve como andamiaje\"",
    importance: "Connectedness supports regulation, optimism, stress buffering and a sense of safety in everyday life.",
    importanceEs: "La conexión sostiene regulación, optimismo, amortiguación del estrés y sensación de seguridad cotidiana.",
    source: "Hawkley & Cacioppo, Loneliness Matters"
  },
  lonelinessThreat: {
    copy: "\"increase vigilance for threat\"",
    copyEs: "\"aumenta la vigilancia ante amenazas\"",
    importance: "Loneliness changes social prediction, making ambiguous cues feel more threatening or rejecting.",
    importanceEs: "La soledad cambia la predicción social y hace que señales ambiguas parezcan más amenazantes o rechazantes.",
    source: "Hawkley & Cacioppo, Loneliness Matters"
  },
  socialIsolationUnsafe: {
    copy: "\"perceived social isolation is tantamount to feeling unsafe\"",
    copyEs: "\"el aislamiento social percibido equivale a sentirse inseguro\"",
    importance: "Social threat and stress show why evaluation or exclusion can recruit bodily defense systems.",
    importanceEs: "La amenaza y el estrés social muestran por qué evaluación o exclusión pueden activar defensas corporales.",
    source: "Hawkley & Cacioppo, Loneliness Matters"
  },
  supportHealth: {
    copy: "\"safe, secure social surround to survive and thrive\"",
    copyEs: "\"entorno social seguro para sobrevivir y prosperar\"",
    importance: "Support is important because relationships can regulate stress, health, pain and recovery.",
    importanceEs: "El apoyo importa porque las relaciones pueden regular estrés, salud, dolor y recuperación.",
    source: "Hawkley & Cacioppo, Loneliness Matters"
  },
  cultureValues: {
    copy: "\"values and preferences shaped by culture\"",
    copyEs: "\"valores y preferencias moldeados por la cultura\"",
    importance: "Culture changes which cues, norms and identities become socially meaningful.",
    importanceEs: "La cultura cambia qué señales, normas e identidades se vuelven socialmente significativas.",
    source: "Zahn, de Oliveira-Souza & Moll, The Oxford Handbook of Social Neuroscience, Ch. 32"
  },
  dominanceHierarchy: {
    copy: "\"social structure, including the stability of hierarchies\"",
    copyEs: "\"estructura social, incluida la estabilidad de las jerarquías\"",
    importance: "Hierarchy affects access, threat, status, alliance and how people interpret dominance cues.",
    importanceEs: "La jerarquía afecta acceso, amenaza, estatus, alianza y cómo se interpretan señales de dominancia.",
    source: "Czoty, Morgan & Nader, The Oxford Handbook of Social Neuroscience, Ch. Group Processes"
  },
  supportSubordinates: {
    copy: "\"social support to subordinates\"",
    copyEs: "\"apoyo social a subordinados\"",
    importance: "Group position is buffered by support, changing stress, cooperation and social safety.",
    importanceEs: "La posición grupal se amortigua con apoyo, cambiando estrés, cooperación y seguridad social.",
    source: "Czoty, Morgan & Nader, The Oxford Handbook of Social Neuroscience, Ch. Group Processes"
  },
  automaticImitation: {
    copy: "\"automatic imitation\"",
    copyEs: "\"imitación automática\"",
    importance: "Imitation links observation to action, supporting learning, coordination and shared routines.",
    importanceEs: "La imitación vincula observación y acción, sosteniendo aprendizaje, coordinación y rutinas compartidas.",
    source: "Gazzaniga, Ivry & Mangun, Cognitive Neuroscience, Ch. Social Cognition"
  },
  cooperationTechnology: {
    copy: "\"cooperation involved with creating complex technologies\"",
    copyEs: "\"cooperación implicada en crear tecnologías complejas\"",
    importance: "Social learning and cooperation allow skills, rules and culture to accumulate across people.",
    importanceEs: "El aprendizaje social y la cooperación permiten acumular habilidades, reglas y cultura entre personas.",
    source: "Gazzaniga, Ivry & Mangun, Cognitive Neuroscience, Ch. Social Cognition"
  },
  decisionTheory: {
    copy: "\"Individual preference and individual choice\"",
    copyEs: "\"preferencia individual y elección individual\"",
    importance: "Decision theory helps connect preferences, alternatives and consequences with social action.",
    importanceEs: "La teoría de decisión ayuda a conectar preferencias, alternativas y consecuencias con la acción social.",
    source: "Ordeshook, Game Theory and Political Theory; Bermúdez, Decision Theory and Rationality"
  },
  gameTheory: {
    copy: "\"Behavioral Game Theory: Thinking, Learning, and Teaching\"",
    copyEs: "\"teoría de juegos conductual: pensar, aprender y enseñar\"",
    importance: "Strategic interaction matters because people adapt to what they expect others will do.",
    importanceEs: "La interacción estratégica importa porque las personas ajustan su conducta a lo que esperan que otros hagan.",
    source: "Camerer, Behavioral Game Theory; Ordeshook, Game Theory and Political Theory"
  },
  prospectTheory: {
    copy: "\"decisions are made ... under risk and ambiguity\"",
    copyEs: "\"las decisiones se toman ... bajo riesgo y ambigüedad\"",
    importance: "Risk and ambiguity shape social choices when outcomes involve loss, status, trust or rejection.",
    importanceEs: "El riesgo y la ambigüedad moldean decisiones sociales cuando los resultados implican pérdida, estatus, confianza o rechazo.",
    source: "Wakker, Prospect Theory for Risk and Ambiguity"
  },
  boundedRationality: {
    copy: "\"accounts for bounded rationality\"",
    copyEs: "\"toma en cuenta la racionalidad limitada\"",
    importance: "Bounded rationality explains why social decisions depend on time, attention, emotion and available information.",
    importanceEs: "La racionalidad limitada explica por qué las decisiones sociales dependen de tiempo, atención, emoción e información disponible.",
    source: "Camerer, Behavioral Game Theory; Bounded Rationality and Politics"
  },
  choiceArchitecture: {
    copy: "\"Choice Architecture\"",
    copyEs: "\"arquitectura de elección\"",
    importance: "Choice architecture shows how context, defaults and presentation can guide social behavior.",
    importanceEs: "La arquitectura de elección muestra cómo contexto, opciones por defecto y presentación pueden guiar la conducta social.",
    source: "Thaler & Sunstein, Nudge"
  },
  socialChoice: {
    copy: "\"aggregating individual preferences\"",
    copyEs: "\"agregar preferencias individuales\"",
    importance: "Collective choice matters because groups must transform individual preferences into shared decisions.",
    importanceEs: "La elección colectiva importa porque los grupos deben transformar preferencias individuales en decisiones compartidas.",
    source: "Gaertner, A Primer in Social Choice Theory"
  },
  intercorporeality: {
    copy: "\"human sociality does not start from isolated individuals\"",
    copyEs: "\"la socialidad humana no parte de individuos aislados\"",
    importance: "Intercorporeality highlights how bodies, rhythms and affective signals co-create social meaning.",
    importanceEs: "La intercorporeidad destaca cómo cuerpos, ritmos y señales afectivas co-crean significado social.",
    source: "Fuchs, Intercorporeality and Interaffectivity"
  },
  metacognition: {
    copy: "\"metacognition\"",
    copyEs: "\"metacognición\"",
    importance: "Social metacognition helps monitor confidence, revise interpretations and learn from interpersonal feedback.",
    importanceEs: "La metacognición social ayuda a monitorear confianza, revisar interpretaciones y aprender de la retroalimentación interpersonal.",
    source: "Crespo, La metacognición: las diferentes vertientes de una teoría"
  }
};

const literalQuoteBySocialGroup = {
  "social-perception": "personCues",
  "social-emotions": "emotionBehavior",
  "social-communication": "wordsMentalStates",
  "social-learning": "cooperationTechnology",
  "control-norms-morality": "moralNorms",
  "social-decision-rationality": "decisionTheory",
  "bonding-cooperation": "trustCooperation",
  "group-culture-status": "dominanceHierarchy",
  "social-cognition-mental-health": "selfReference"
};

const literalQuoteByTheme = {
  "self-mentalizing": "mentalStates",
  "self-representation": "selfReference",
  "theory-of-mind": "mentalStates",
  "perspective-taking": "mentalStates",
  "agency-intention": "intentions",
  "affective-mentalizing": "empathyCapacity",
  "person-perception": "personCues",
  "first-impressions": "friendFoe",
  "joint-attention-gaze": "jointAttention",
  "pragmatic-language": "wordsMentalStates",
  "communication-health": "socialConnectedness",
  "emotion-empathy": "emotionBehavior",
  "empathy-compassion": "empathyCapacity",
  "social-anger": "indignationAnger",
  "shame-social": "moralSentiments",
  "guilt-repair": "guiltAmends",
  "social-pride": "moralSentiments",
  "social-repair": "guiltAmends",
  "moral-indignation": "indignationAnger",
  "rejection-exclusion": "lonelinessThreat",
  "forgiveness-reconciliation": "guiltAmends",
  "regulation-control": "socialNorms",
  "moral-ethics": "moralNorms",
  "social-norms-conformity": "socialNorms",
  "fairness-punishment": "fairnessEmpathy",
  "social-uncertainty": "socialIsolationUnsafe",
  "social-decision-choice": "decisionTheory",
  "strategic-interaction": "gameTheory",
  "risk-ambiguity-social": "prospectTheory",
  "bounded-rationality-bias": "boundedRationality",
  "choice-architecture-nudge": "choiceArchitecture",
  "collective-choice": "socialChoice",
  "deception-trust-violation": "reputationTrust",
  "reward-bonding": "vicariousReward",
  "attachment-bond": "supportHealth",
  "altruism-prosocial": "empathyCapacity",
  "trust-cooperation": "trustCooperation",
  "reputation-impression": "reputationTrust",
  "culture-social-cognition": "socialSpecies",
  "ingroup-outgroup": "friendFoe",
  "prejudice-stigma": "friendFoe",
  "dominance-hierarchy": "dominanceHierarchy",
  "envy-social-comparison": "vicariousReward",
  "action-imitation": "automaticImitation",
  "intercorporeality-interaffectivity": "intercorporeality",
  "interpersonal-synchrony": "socialBrain",
  "social-learning-memory": "cooperationTechnology",
  "social-metacognition": "metacognition",
  "social-threat-stress": "socialIsolationUnsafe",
  "loneliness-isolation": "lonelinessThreat",
  "support-health": "supportHealth"
};

const literalQuoteByRegion = {
  dlpfc: "socialNorms",
  premotor: "socialBrain",
  auditory: "wordsMentalStates",
  dmn: "selfReference",
  visual: "personCues",
  hippocampus: "socialCognition",
  insula: "emotionBehavior",
  parietal: "mentalStates",
  amygdala: "emotionBehavior",
  cerebellum: "socialBrain",
  salience: "emotionBehavior",
  ventralAttention: "jointAttention",
  vmPfc: "vicariousReward",
  acc: "socialNorms",
  thalamostriatal: "vicariousReward",
  fusiformFace: "personCues"
};

const deepDiveContent = {
  dlpfc: {
    title: "Prefrontal dorsolateral: mantener la meta",
    copy: "En neurociencia cognitiva se usa como ejemplo de control ejecutivo: sostiene informacion activa, selecciona reglas y ayuda a resistir respuestas automaticas. En una clase de neurociencia social sirve para preguntar como las normas, reputacion o metas compartidas cambian la decision.",
    experiment: "2-back o Stroop social: comparar una condicion neutra con otra donde el estimulo tenga carga social, por ejemplo palabras de aprobacion/rechazo o rostros distractores.",
    question: "Cuando una persona responde distinto por presion social, es solo emocion o tambien control ejecutivo?",
    source: "Sintesis: Gazzaniga et al. + clase"
  },
  premotor: {
    title: "Premotora: preparar acciones observadas",
    copy: "La corteza premotora conecta percepcion y accion. Es especialmente util para explicar imitacion, preparacion motora y como una accion vista puede facilitar o interferir con la accion propia.",
    experiment: "Imitacion/inhibicion: mostrar una mano que ejecuta un movimiento congruente o incongruente con la respuesta del estudiante y medir tiempo de reaccion.",
    question: "Por que ver una accion puede preparar al cuerpo para ejecutarla aunque no queramos imitarla?",
    source: "Sintesis: Gazzaniga et al. + clase"
  },
  auditory: {
    title: "Auditiva primaria: del tono a la voz",
    copy: "La entrada auditiva temprana codifica propiedades basicas del sonido. Desde ahi se construyen procesos mas complejos como habla, voz, prosodia y deteccion de cambios relevantes.",
    experiment: "Oddball auditivo: presentar muchos tonos iguales y algunos desviantes; luego repetir con silabas o prosodia emocional para discutir novedad y significado social.",
    question: "Que cambia entre detectar un tono raro y detectar una voz con tono emocional?",
    source: "Sintesis: Gazzaniga et al. + clase"
  },
  dmn: {
    title: "Red por defecto: yo, memoria y mente social",
    copy: "La red por defecto se asocia a pensamiento interno, memoria autobiografica, simulacion del futuro y juicios sobre uno mismo u otras personas. Es una puerta directa a temas de identidad, mentalizacion y narrativa social.",
    experiment: "Juicio autorreferencial: decidir si adjetivos describen al propio estudiante, a otra persona conocida o a un objeto no social; despues comparar recuerdo incidental.",
    question: "Por que recordar algo sobre uno mismo suele ser mas facil que recordar una etiqueta neutra?",
    source: "Sintesis: Gazzaniga et al. + clase"
  },
  visual: {
    title: "Visual primaria: base perceptiva de lo social",
    copy: "Antes de reconocer caras, gestos o escenas sociales, el sistema visual necesita resolver contraste, bordes, orientacion y posicion. Esta zona muestra que la cognicion social tambien depende de operaciones sensoriales tempranas.",
    experiment: "Deteccion breve: variar contraste o duracion de caras, objetos y patrones simples para separar limite sensorial de interpretacion social.",
    question: "Cuando alguien no interpreta una senal social, el problema puede empezar en la percepcion temprana?",
    source: "Sintesis: Gazzaniga et al. + clase"
  },
  hippocampus: {
    title: "Hipocampo: episodios sociales con contexto",
    copy: "El hipocampo permite asociar elementos de una experiencia: persona, lugar, emocion y momento. En neurociencia social es clave para entender memoria episodica, aprendizaje relacional y contexto de las interacciones.",
    experiment: "Memoria rostro-contexto: aprender pares de rostro y lugar, luego preguntar si el rostro aparecio y en que contexto.",
    question: "Que parte de una interaccion recordamos: la persona, el lugar, la emocion o la combinacion?",
    source: "Sintesis: Gazzaniga et al. + clase"
  },
  insula: {
    title: "Insula: cuerpo, emocion y saliencia",
    copy: "La insula integra senales internas del cuerpo con estados afectivos y relevancia contextual. Por eso es una estructura excelente para conectar interocepcion, asco, dolor, empatia afectiva y cambio entre redes.",
    experiment: "Interocepcion breve: contar ciclos respiratorios o latidos percibidos y luego evaluar imagenes emocionales; discutir si la precision corporal se relaciona con intensidad afectiva.",
    question: "Sentir el cuerpo con mas claridad cambia como interpretamos la emocion propia o ajena?",
    source: "Sintesis: Gazzaniga et al. + clase"
  },
  parietal: {
    title: "Parietal posterior: atencion y perspectiva",
    copy: "Las regiones parietales integran espacio, cuerpo y metas. En cognicion social permiten estudiar mirada, gestos, perspectiva corporal y orientacion de la atencion hacia senales de otras personas.",
    experiment: "Cueing de mirada: comparar si una mirada o una flecha acelera la deteccion de un objetivo en el lado indicado.",
    question: "Una mirada orienta la atencion igual que una flecha o tiene un peso social especial?",
    source: "Sintesis: Gazzaniga et al. + clase"
  },
  amygdala: {
    title: "Amigdala: relevancia emocional",
    copy: "La amigdala participa en aprendizaje afectivo, deteccion de amenaza y modulacion de memoria y atencion. No es solo miedo: ayuda a priorizar estimulos con valor biologico o social.",
    experiment: "Busqueda de caras: detectar rapidamente caras amenazantes, alegres o neutras en una matriz; comparar velocidad y errores.",
    question: "Que hace que una senal emocional capture la atencion incluso cuando no es la meta de la tarea?",
    source: "Sintesis: Gazzaniga et al. + clase"
  },
  cerebellum: {
    title: "Cerebelo: prediccion y sincronizacion",
    copy: "Ademas de la coordinacion motora, el cerebelo se relaciona con prediccion temporal, ajuste por error y secuencias. Esto permite discutir ritmo conversacional, sincronizacion interpersonal y aprendizaje adaptativo.",
    experiment: "Tapping sincronizado: seguir un ritmo, luego mantenerlo sin sonido y comparar deriva temporal entre participantes.",
    question: "La coordinacion social depende solo de entender al otro o tambien de predecir su timing?",
    source: "Sintesis: Gazzaniga et al. + clase"
  },
  salience: {
    title: "Red de saliencia: prioridad y cambio de red",
    copy: "Esta red permite explicar como el cerebro marca algo como relevante y cambia de un modo interno a uno orientado a la accion. En clase conecta interocepcion, alerta, emocion y control ejecutivo.",
    experiment: "Oddball emocional: presentar estimulos frecuentes y algunos desviantes con carga social o afectiva; medir rapidez y precision de deteccion.",
    question: "Que hace que una senal pase de ser fondo a convertirse en prioridad?",
    source: "Sintesis: Gazzaniga et al. + clase"
  },
  ventralAttention: {
    title: "Red ventral / TPJ: reorientar hacia otras personas",
    copy: "La union temporoparietal y regiones vecinas son muy utiles para discutir atencion social, cambios inesperados y perspectiva. La red ayuda a abandonar el foco actual cuando aparece informacion relevante.",
    experiment: "Cueing social: mirar si una flecha y una mirada capturan igual la atencion cuando predicen o no predicen el objetivo.",
    question: "Por que una mirada ajena puede capturar la atencion incluso cuando no ayuda a la tarea?",
    source: "Sintesis: Gazzaniga et al. + clase"
  },
  vmPfc: {
    title: "vmPFC/orbitofrontal: valor social",
    copy: "Esta zona permite discutir como el cerebro valora opciones: recompensa, castigo, preferencia, reputacion y significado personal. Es central para decisiones sociales flexibles.",
    experiment: "Decision reputacional: elegir entre ganar mas para uno o compartir puntos cuando la eleccion es privada versus observada.",
    question: "El valor de una opcion cambia cuando alguien mas puede verla?",
    source: "Sintesis: Gazzaniga et al. + clase"
  },
  acc: {
    title: "Cingulo anterior: conflicto con costo social",
    copy: "El cingulo anterior ayuda a pensar conflicto, error y esfuerzo. En neurociencia social permite agregar feedback, evaluacion de otros o dolor social a tareas de control.",
    experiment: "Flanker social: responder bajo distractores congruentes/incongruentes y agregar feedback de aprobacion o rechazo.",
    question: "Un error pesa mas cuando es visto por otros?",
    source: "Sintesis: Gazzaniga et al. + clase"
  },
  thalamostriatal: {
    title: "Talamo-estriatal: recompensa, accion y habito",
    copy: "Los bucles fronto-estriatales permiten estudiar aprendizaje por recompensa, motivacion, seleccion de acciones y formacion de habitos. Es una buena entrada para decisiones repetidas en contextos sociales.",
    experiment: "Aprendizaje probabilistico: escoger entre opciones con recompensa cambiante y observar perseveracion o flexibilidad.",
    question: "Cuando una conducta social se vuelve habito, que tan flexible sigue siendo?",
    source: "Sintesis: Gazzaniga et al. + clase"
  },
  fusiformFace: {
    title: "Fusiforme/red de caras: identidad visual",
    copy: "La via ventral permite reconocer formas complejas e identidad. Con caras se puede mostrar procesamiento configural, experiencia visual y el enlace con memoria y emocion.",
    experiment: "Efecto de inversion facial: comparar reconocimiento de caras normales, caras invertidas y objetos invertidos.",
    question: "Por que una cara invertida se vuelve tan dificil de reconocer?",
    source: "Sintesis: Gazzaniga et al. + clase"
  }
};

function contentKey(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const deepDiveByZoneKey = new Map(Object.entries({
  "insula": {
    title: "Insula: interocepcion y empatia afectiva",
    copy: "Para la clase, la insula funciona como puente entre cuerpo y significado social: senales internas, asco, dolor observado y conciencia de estados afectivos pueden organizarse alrededor de esta region.",
    experiment: "Mini experimento: conteo respiratorio de 45 segundos, evaluacion de imagenes emocionales y comparacion entre seguridad corporal reportada e intensidad emocional.",
    question: "La empatia afectiva requiere representar el estado corporal propio?",
    source: "Libro: sistemas emocionales e interocepcion"
  },
  "amigdala": {
    title: "Amigdala: aprender que importa",
    copy: "Es fundamental para explicar como un estimulo gana valor afectivo y como ese valor sesga atencion y memoria. Sirve para discutir miedo, amenaza, aprendizaje emocional y caras.",
    experiment: "Condicionamiento simple en clase: asociar un color o sonido con retroalimentacion aversiva leve simbolica; luego medir expectativa o rapidez de deteccion.",
    question: "Como se diferencia detectar amenaza de sentir miedo conscientemente?",
    source: "Libro: emocion, aprendizaje y atencion"
  },
  "hipocampo": {
    title: "Hipocampo: memoria de experiencias sociales",
    copy: "Permite unir los elementos de una escena social en un episodio recordable. Es clave para diferenciar familiaridad simple de recordar donde, cuando y con quien ocurrio algo.",
    experiment: "Rostro-lugar-emocion: estudiar combinaciones y luego preguntar que elemento iba con cual; se puede analizar memoria de item versus memoria relacional.",
    question: "Que se pierde en una memoria social si se conserva la familiaridad pero no el contexto?",
    source: "Libro: memoria episodica y sistemas temporales mediales"
  },
  "cingulo anterior caudal": {
    title: "Cingulo anterior: conflicto y ajuste",
    copy: "Se puede presentar como un sistema que monitorea conflicto, error y demanda de control. En tareas sociales ayuda a pensar por que algunas respuestas requieren mas regulacion.",
    experiment: "Flanker o Stroop con feedback social: mostrar aciertos/errores con aprobacion o desaprobacion y medir cambios de velocidad.",
    question: "El error social se procesa igual que un error perceptivo?",
    source: "Libro: atencion, control y monitoreo"
  },
  "cingulo anterior rostral": {
    title: "Cingulo anterior rostral: regulacion afectiva",
    copy: "Conecta control y afecto. Es una buena region para discutir dolor social, evaluacion emocional y ajuste de respuestas cuando una situacion tiene carga interpersonal.",
    experiment: "Stroop emocional con palabras sociales positivas y negativas; comparar interferencia frente a palabras neutras.",
    question: "Regular una emocion social usa los mismos recursos que resolver conflicto cognitivo?",
    source: "Libro: emocion y control cognitivo"
  },
  "cingulo posterior": {
    title: "Cingulo posterior: autobiografia y red por defecto",
    copy: "Es un nodo central para pensamiento interno, memoria autobiografica y orientacion hacia informacion relevante para el yo.",
    experiment: "Juicios sobre rasgos propios versus rasgos de una figura publica; luego memoria incidental de los adjetivos.",
    question: "Por que el procesamiento autorreferencial organiza tan bien la memoria?",
    source: "Libro: red por defecto y memoria"
  },
  "precuneo": {
    title: "Precuneo: imaginar escenas y perspectivas",
    copy: "Ayuda a conectar memoria, imagen mental y cambio de perspectiva. En social, puede usarse para mentalizacion, autobiografia y simulacion de situaciones.",
    experiment: "Imaginar una escena desde primera y tercera persona; luego estimar viveza, detalle espacial y carga emocional.",
    question: "Cambiar de perspectiva cambia lo que recordamos de una escena social?",
    source: "Libro: memoria, imagen mental y cognicion social"
  },
  "temporal superior": {
    title: "Temporal superior: voz y senales dinamicas",
    copy: "Permite conectar procesamiento auditivo y audiovisual con senales sociales dinamicas como voz, prosodia, movimiento biologico y cambios en la expresion.",
    experiment: "Prosodia emocional: clasificar la emocion de una frase con contenido neutro dicha con tonos afectivos distintos.",
    question: "Cuanta informacion social se transmite sin cambiar las palabras?",
    source: "Libro: percepcion social y lenguaje"
  },
  "temporal transverso / heschl": {
    title: "Heschl: entrada cortical del sonido",
    copy: "Es la puerta cortical temprana para frecuencia, intensidad y temporalidad. Desde aqui se puede escalar hacia voz, habla y prosodia.",
    experiment: "Oddball con tonos y luego con silabas: comparar deteccion de cambio acustico simple versus cambio con significado.",
    question: "Donde empieza la diferencia entre sonido y comunicacion?",
    source: "Libro: sistemas sensoriales auditivos"
  },
  "orbitofrontal medial": {
    title: "Orbitofrontal medial: valor y preferencia",
    copy: "Aporta a representar valor, recompensa y preferencia. En social, ayuda a explicar decisiones donde importan aprobacion, confianza o beneficio para otros.",
    experiment: "Eleccion social: escoger entre recompensa propia y recompensa compartida; manipular reputacion o anonimato.",
    question: "El valor social se calcula igual que una recompensa material?",
    source: "Libro: decision, recompensa y corteza frontal"
  },
  "orbitofrontal lateral": {
    title: "Orbitofrontal lateral: cambiar cuando cambia el valor",
    copy: "Es util para explicar aprendizaje de inversion: una opcion antes correcta deja de serlo. En interacciones sociales, las reglas cambian y la conducta debe actualizarse.",
    experiment: "Reversal learning: una opcion gana puntos al inicio y luego deja de hacerlo; medir cuantas pruebas tarda el cambio.",
    question: "Por que cuesta abandonar una estrategia social que antes funcionaba?",
    source: "Libro: aprendizaje por recompensa y flexibilidad"
  },
  "giro supramarginal": {
    title: "Giro supramarginal: cuerpo, accion y perspectiva",
    copy: "Integra informacion sensoriomotora y atencional. Es util para discutir representacion corporal, distincion yo-otro y perspectiva en acciones observadas.",
    experiment: "Perspectiva corporal: juzgar si una mano izquierda/derecha corresponde al propio punto de vista o al de otra persona.",
    question: "Como separa el cerebro mi accion de la accion observada en otra persona?",
    source: "Libro: accion, cuerpo y atencion"
  },
  "parietal inferior": {
    title: "Parietal inferior: atencion hacia claves sociales",
    copy: "Se puede usar para explicar reorientacion atencional y transformaciones espaciales necesarias para seguir mirada, gesto o direccion de accion.",
    experiment: "Cueing social: mirada valida, invalida o neutral antes de un objetivo; comparar tiempos de respuesta.",
    question: "La mirada ajena captura atencion aunque sea irrelevante para la tarea?",
    source: "Libro: atencion espacial y percepcion social"
  },
  "postcentral / somatosensorial": {
    title: "Somatosensorial: el cuerpo como mapa",
    copy: "La representacion del cuerpo permite conectar tacto, propiocepcion y experiencia corporal con contagio emocional, dolor observado y empatia.",
    experiment: "Estimacion tactil simple: localizar toques en la mano con ojos cerrados y discutir como cambia al observar manos ajenas.",
    question: "La empatia por dolor ajeno necesita una simulacion corporal?",
    source: "Libro: sistemas somatosensoriales y emocion"
  }
}).map(([key, value]) => [contentKey(key), value]));

const socialFunctionProfiles = {
  dlpfc: {
    title: "Control social dirigido a metas",
    summary: "La corteza dorsolateral prefrontal permite sostener reglas sociales activas, inhibir respuestas impulsivas y elegir conductas coherentes con metas de largo plazo. En interacción social participa cuando una persona debe regular lo que dice, cambiar de estrategia, resistir presión del grupo o resolver conflicto entre interés propio y norma.",
    concepts: "Autocontrol, normas, reputación, flexibilidad, memoria de trabajo social.",
    example: "Comparar una respuesta espontánea con una respuesta regulada ante crítica, rechazo o presión de pares.",
    deep: "Desde el esquema del handbook, esta región conecta capítulos sobre corteza prefrontal y conducta social dirigida a metas, autorregulación y déficits sociales por daño frontal. Es una zona clave para explicar por qué saber una norma no basta: hay que mantenerla activa y aplicarla en el momento correcto.",
    experiment: "Stroop social con palabras de aprobación/rechazo o Flanker con feedback público versus privado.",
    question: "Qué cambia en el control ejecutivo cuando un error puede ser visto por otros?"
  },
  vmPfc: {
    title: "Valor social y significado personal",
    summary: "La corteza ventromedial/orbitofrontal integra recompensa, preferencia, normas, daño/beneficio para otros y significado personal. Es central para decisiones donde importan confianza, reputación, culpa, cooperación o valor afectivo de una persona.",
    concepts: "Valor social, recompensa, reputación, juicio moral, preferencia.",
    example: "Elegir entre ganancia propia y ganancia compartida bajo anonimato o mirada de otros.",
    deep: "Relaciona los temas del handbook sobre recompensa social, altruismo, evaluación motivacional y conducta social dirigida a metas. Ayuda a explicar por qué la misma recompensa material puede cambiar de valor según contexto, vínculo o reputación.",
    experiment: "Tarea de decisión reputacional: decisiones privadas versus observadas por compañeros.",
    question: "Una recompensa social se calcula igual cuando hay vínculo, estatus o posibilidad de evaluación?"
  },
  acc: {
    title: "Conflicto, error y dolor social",
    summary: "El cíngulo anterior monitorea conflicto, error, esfuerzo y señales aversivas. En lo social es útil para explicar dolor por rechazo, incomodidad por evaluación, necesidad de control y ajustes después de errores interpersonales.",
    concepts: "Conflicto, error, esfuerzo, rechazo social, ajuste conductual.",
    example: "Observar si el feedback social negativo aumenta cautela o cambia tiempos de respuesta.",
    deep: "Se vincula con los capítulos sobre autorregulación, rechazo social y regulación emocional. Permite presentar una idea poderosa: los errores sociales no son solo cognitivos, también tienen costo afectivo y corporal.",
    experiment: "Flanker con feedback de aceptación/rechazo o exclusión social simulada breve.",
    question: "Por qué un error social puede sentirse más intenso que un error perceptivo?"
  },
  dmn: {
    title: "Yo, memoria autobiográfica y mentalización",
    summary: "La red por defecto sostiene autorreferencia, memoria autobiográfica, simulación del futuro y reflexión sobre estados mentales propios y ajenos. Es una red fundamental para identidad, narrativa personal y teoría de la mente.",
    concepts: "Self, autobiografía, prospección, mentalización, impresión social.",
    example: "Comparar juicios sobre rasgos propios, rasgos de un amigo y rasgos de un desconocido.",
    deep: "El handbook incluye self-awareness, note to self, person perception e impression formation. Esta red permite unir esos temas: pensar en mí, recordar interacciones y proyectar intenciones de otros usan recursos parcialmente compartidos.",
    experiment: "Juicio de rasgos propio/otro con memoria incidental posterior.",
    question: "Por qué la información relacionada con el yo suele recordarse mejor?"
  },
  ventralAttention: {
    title: "Reorientación hacia claves sociales",
    summary: "La red ventral de atención y la unión temporoparietal ayudan a cambiar el foco cuando aparece una señal relevante: mirada, voz, gesto, sorpresa o intención inesperada. Es importante para atención conjunta y perspectiva social.",
    concepts: "TPJ, mirada, atención conjunta, novedad, perspectiva.",
    example: "Una mirada ajena orienta la atención incluso si no predice correctamente el objetivo.",
    deep: "Conecta temas de person perception, teoría de la mente, voz y señales sociales dinámicas. Sirve para mostrar cómo el cerebro abandona una meta actual cuando otra persona entrega una señal relevante.",
    experiment: "Cueing de mirada versus flechas, con claves válidas, inválidas y neutras.",
    question: "La mirada de otra persona captura atención igual que una flecha?"
  },
  salience: {
    title: "Detección de relevancia social",
    summary: "La red de saliencia, con ínsula anterior y cíngulo anterior, detecta eventos importantes para el organismo y ayuda a cambiar entre introspección, control y acción. En lo social prioriza amenaza, rechazo, dolor ajeno, sorpresa y señales corporales relevantes.",
    concepts: "Saliencia, cambio de red, interocepción, alerta, relevancia social.",
    example: "Un estímulo emocional inesperado interrumpe una tarea neutra y recluta control.",
    deep: "Articula capítulos sobre emoción, conciencia, empatía, rechazo social y regulación. Es una red puente: convierte algo socialmente significativo en una demanda de atención y acción.",
    experiment: "Oddball emocional con tonos o imágenes sociales desviantes.",
    question: "Qué hace que una señal social pase de fondo a prioridad?"
  },
  insula: {
    title: "Interocepción y empatía afectiva",
    summary: "La ínsula integra señales internas del cuerpo con emoción y conciencia subjetiva. En neurociencia social es clave para empatía afectiva, asco, dolor observado, ansiedad social y sensación corporal durante vínculos o rechazo.",
    concepts: "Interocepción, empatía, asco, dolor observado, conciencia corporal.",
    example: "Relacionar precisión respiratoria o cardíaca percibida con intensidad emocional reportada.",
    deep: "Desde el handbook se conecta con emoción, empatía, rechazo social y alexitimia. Permite discutir que comprender al otro no siempre es inferencia fría: muchas veces implica representar cambios corporales propios y ajenos.",
    experiment: "Conteo respiratorio + evaluación de imágenes de dolor/emoción.",
    question: "La empatía afectiva requiere sentir el cuerpo?"
  },
  amygdala: {
    title: "Relevancia emocional y aprendizaje social",
    summary: "La amígdala evalúa amenaza, incertidumbre, valor emocional y aprendizaje afectivo. En lo social participa en expresión emocional, vigilancia de caras, aprendizaje de confianza/desconfianza y memoria modulada por emoción.",
    concepts: "Amenaza, emoción facial, vigilancia, confianza, aprendizaje afectivo.",
    example: "Detectar más rápido expresiones amenazantes o ambiguas que expresiones neutras.",
    deep: "Se alinea con capítulos de emoción, reconocimiento emocional, social bonding y comportamiento social primate. No debe reducirse a miedo: ayuda a priorizar estímulos con valor social o biológico.",
    experiment: "Búsqueda visual de caras emocionales y aprendizaje de reputación asociado a rostros.",
    question: "Cómo aprende el cerebro que una persona o señal social merece atención?"
  },
  hippocampus: {
    title: "Memoria episódica de personas y contextos",
    summary: "El hipocampo une persona, lugar, emoción, momento y contexto. En lo social permite recordar quién hizo qué, dónde ocurrió, qué emoción se asoció al episodio y cómo usar esa memoria para predecir futuras interacciones.",
    concepts: "Contexto social, memoria episódica, reputación, asociación, autobiografía.",
    example: "Recordar qué rostro apareció con qué escena y qué emoción.",
    deep: "Conecta memoria, self, person perception y aprendizaje social. Es central para diferenciar familiaridad simple de recuerdo contextual: no solo conozco la cara, recuerdo la historia asociada.",
    experiment: "Memoria rostro-contexto-emoción con prueba de reconocimiento y fuente.",
    question: "Qué cambia entre reconocer a alguien y recordar el contexto de una interacción?"
  },
  fusiformFace: {
    title: "Identidad facial y lectura social visual",
    summary: "El giro fusiforme participa en reconocimiento de caras e identidad visual experta. En lo social permite estabilizar quién es la persona, diferenciar identidades y conectar percepción facial con emoción, memoria y expectativas.",
    concepts: "Identidad facial, procesamiento configural, familiaridad, rostro, vía ventral.",
    example: "La inversión de una cara afecta mucho más el reconocimiento que la inversión de muchos objetos.",
    deep: "Se vincula con emotion recognition, person perception y first impressions. Sirve para explicar que una cara no es solo una imagen: es una señal social rica que activa identidad, emoción y memoria.",
    experiment: "Efecto de inversión facial y memoria de caras familiares/no familiares.",
    question: "Por qué reconocer una cara invertida se vuelve tan difícil?"
  },
  auditory: {
    title: "Voz, prosodia y comunicación social",
    summary: "La corteza auditiva y regiones temporales superiores permiten analizar tono, ritmo, intensidad y cambios de la voz. En lo social son esenciales para prosodia emocional, intención comunicativa, atención a voces y aprendizaje del lenguaje.",
    concepts: "Voz humana, prosodia, emoción vocal, comunicación, novedad auditiva.",
    example: "Una misma frase neutra cambia de significado social según prosodia.",
    deep: "El handbook incluye Hearing Voices, melody, language and communication. Esta pestaña muestra cómo el cerebro pasa de sonido a señal social: quién habla, cómo lo dice y qué emoción o intención transmite.",
    experiment: "Oddball auditivo con tonos versus prosodia emocional en frases neutras.",
    question: "Cuánta información social aparece sin cambiar las palabras?"
  },
  visual: {
    title: "Entrada visual para señales sociales",
    summary: "La corteza visual primaria entrega el análisis básico de contraste, bordes y orientación necesario para procesar caras, gestos, escenas y movimiento social. Es la base perceptiva sobre la cual se construye reconocimiento social.",
    concepts: "Contraste, forma, escena, atención visual, señal social temprana.",
    example: "Bajar contraste o duración de un rostro reduce reconocimiento emocional.",
    deep: "Aunque parece una zona sensorial básica, es importante para person perception y first impressions: si la entrada visual es ambigua, las inferencias sociales posteriores también cambian.",
    experiment: "Detección breve de caras con contraste variable.",
    question: "Cuándo un error social empieza como un límite perceptivo?"
  },
  premotor: {
    title: "Preparación de acciones e imitación social",
    summary: "La corteza premotora transforma señales observadas en planes de acción. En lo social sostiene imitación, aprendizaje por observación, preparación de gestos, contagio motor y control de respuestas imitativas.",
    concepts: "Imitación, acción observada, sistema espejo, gestos, preparación motora.",
    example: "Ver una mano moverse facilita o interfiere con la respuesta propia.",
    deep: "Se relaciona con mirror neuron system, imitation y comunicación. Permite mostrar que entender una acción puede implicar mapearla en sistemas motores propios.",
    experiment: "Imitación congruente/incongruente de gestos manuales o faciales.",
    question: "Por qué ver una acción prepara al cuerpo para responder?"
  },
  parietal: {
    title: "Perspectiva, cuerpo y atención social",
    summary: "La corteza parietal integra espacio, cuerpo, atención y acción. En lo social contribuye a seguir mirada, transformar perspectiva, representar cuerpo propio/ajeno y coordinar acciones con otros.",
    concepts: "Atención espacial, perspectiva, cuerpo, mirada, integración sensoriomotora.",
    example: "Juzgar una mano desde mi perspectiva o desde la perspectiva de otra persona.",
    deep: "Se vincula con person perception, mirror system y theory of mind. Es un puente entre percepción espacial, acción y comprensión de señales corporales de otros.",
    experiment: "Cueing espacial con mirada y tarea de rotación/perspectiva corporal.",
    question: "Cómo distingue el cerebro mi cuerpo del cuerpo observado en otra persona?"
  },
  cerebellum: {
    title: "Timing, predicción y sincronía interpersonal",
    summary: "El cerebelo ajusta precisión temporal, predicción y aprendizaje por error. En lo social ayuda a coordinar turnos conversacionales, sincronía motora, ritmo compartido e inferencias temporales sobre acciones de otros.",
    concepts: "Timing, predicción, sincronía, error, coordinación interpersonal.",
    example: "Dos personas sincronizan golpes o ritmo al conversar y moverse juntas.",
    deep: "Aunque históricamente se presentó como motor, hoy sirve para discutir predicción temporal y coordinación social. Aporta a comprender cómo anticipamos el momento de respuesta del otro.",
    experiment: "Tapping sincronizado en pareja y continuación sin metrónomo.",
    question: "La coordinación social depende también de predecir el timing del otro?"
  },
  thalamostriatal: {
    title: "Recompensa social, hábitos y motivación",
    summary: "Los circuitos tálamo-estriatales participan en aprendizaje por recompensa, selección de acciones, hábitos y motivación. En lo social permiten aprender de aprobación, rechazo, estatus, cooperación y refuerzo grupal.",
    concepts: "Recompensa social, hábito, motivación, aprendizaje por refuerzo, estatus.",
    example: "Una conducta se repite más si recibe aprobación social o aumenta reputación.",
    deep: "Se conecta con social bonding, reward, altruism, hierarchy y group processes. Permite explicar cómo las normas sociales se aprenden también por refuerzo y no solo por razonamiento explícito.",
    experiment: "Aprendizaje probabilístico con feedback social positivo/negativo.",
    question: "Cuándo una conducta social deja de ser elección y se convierte en hábito?"
  }
};

const cerebraByLabel = new Map();
cerebraLabels.forEach(([mindboggleId, name, rhLabel, lhLabel, notes, dice]) => {
  const [displayName, group] = zoneDisplay[name] ?? [name, "subcortex"];
  cerebraByLabel.set(rhLabel, { mindboggleId, name, displayName, group, hemisphere: "RH", label: rhLabel, pairedLabel: lhLabel, notes, dice });
  cerebraByLabel.set(lhLabel, { mindboggleId, name, displayName, group, hemisphere: "LH", label: lhLabel, pairedLabel: rhLabel, notes, dice });
});

let selectedZoneLabel = null;
let selectionMode = "none";

function zoneLabelText(zone) {
  return `${zone.displayName} ${zone.hemisphere === "RH" ? "derecha" : "izquierda"}`;
}

function meshesForRegion(regionId) {
  const labels = new Set(cerebraRegionLabels[regionId] ?? []);
  if (!labels.size) return atlasMeshes.get(regionId) ?? [];
  return allAtlasMeshes.filter((mesh) => labels.has(mesh.userData.cerebraLabel?.label));
}

regionCountEl.textContent = `${socialThemeGroups.length} categorías`;
let activeThemeId = null;
let activeSocialGroupId = null;

function makeRegionButton(region) {
  const copy = getRegionCopy(region);
  const button = document.createElement("button");
  button.dataset.region = region.id;
  button.innerHTML = `<strong>${copy.name}</strong><span>${copy.tag}</span><small>${copy.functions}</small>`;
  button.addEventListener("click", () => selectRegion(region.id));
  return button;
}

function getRegionCopy(region) {
  const en = regionTextEn[region.id];
  if (currentLang !== "en" || !en) return region;
  return {
    ...region,
    name: en[0],
    tag: en[1],
    summary: en[2],
    location: en[3],
    functions: en[4],
    network: en[5],
    task: en[6],
    taskCopy: en[7]
  };
}

function getThemeCopy(section) {
  if (!section) return null;
  return currentLang === "en" ? (themeTextEn[section.id] ?? section) : section;
}

function getSocialGroupCopy(group) {
  if (!group) return null;
  return currentLang === "en" ? { ...group, ...(socialThemeGroupTextEn[group.id] ?? {}) } : group;
}

function socialGroupForTheme(themeId) {
  return socialThemeGroups.find((group) => group.themes.includes(themeId)) ?? null;
}

function themeById(themeId) {
  return regionSections.find((section) => section.id === themeId) ?? null;
}

function uniqueGroupRegionIds(group) {
  return [...new Set(group.themes.flatMap((themeId) => themeById(themeId)?.regions ?? []))];
}

function literalQuote(key) {
  return literalQuoteLibrary[key] ?? literalQuoteLibrary.socialSpecies;
}

function deepNarrativeTitle(label) {
  if (!label) return currentLang === "en" ? "The social brain" : "El cerebro social";
  return label;
}

function quoteLabel() {
  return currentLang === "en" ? "From the literature" : "En la literatura";
}

function asSentence(text) {
  const clean = `${text ?? ""}`.trim();
  if (!clean) return "";
  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
}

function lowerFirst(text) {
  const clean = `${text ?? ""}`.trim();
  if (!clean) return "";
  return `${clean.charAt(0).toLowerCase()}${clean.slice(1)}`;
}

function listPreview(items, max = 4) {
  return items.slice(0, max).join(", ");
}

function buildDeepNarrative(quote, phenomSummary, label, phenomDeep = "") {
  const baseImportance = currentLang === "en" ? quote.importance : (quote.importanceEs ?? quote.importance);
  const core = asSentence(phenomSummary);
  const extra = asSentence(phenomDeep);
  const base = asSentence(baseImportance);
  if (currentLang === "en") {
    if (!label) return `${base} The atlas reads social life as a coordination between body, attention, memory, value and action — each function is a node in that network.`;
    return extra ? `${core} ${extra} ${base}` : `${core} ${base}`;
  }
  if (!label) return `${base} El atlas lee la vida social como coordinación entre cuerpo, atención, memoria, valor y acción — cada función es un nodo de esa red.`;
  return extra ? `${core} ${extra} ${base}` : `${core} ${base}`;
}

function showLiteralQuote(key, options = {}) {
  const quote = literalQuote(key);
  const baseImportance = currentLang === "en" ? quote.importance : (quote.importanceEs ?? quote.importance);
  const phenomSummary = options.importance ?? baseImportance;
  const label = options.label ?? "";
  const phenomDeep = options.deepExtra ?? "";
  const visibleQuote = currentLang === "en" ? quote.copy : (quote.copyEs ?? quote.copy);
  deepTitleEl.textContent = deepNarrativeTitle(label);
  deepCopyEl.textContent = buildDeepNarrative(quote, phenomSummary, label, phenomDeep);
  if (deepPurposeEl) deepPurposeEl.textContent = `${quoteLabel()}: ${visibleQuote}`;
  deepSourceEl.textContent = quote.source;
}

function quoteKeyForTheme(sectionId) {
  return literalQuoteByTheme[sectionId] ?? literalQuoteBySocialGroup[socialGroupForTheme(sectionId)?.id] ?? "socialSpecies";
}

function quoteKeyForRegion(regionId) {
  return literalQuoteByRegion[regionId] ?? "socialSpecies";
}

function buildGroupNarrative(group, groupCopy, themeCopies, regionIds) {
  const names = listPreview(themeCopies.map((theme) => theme.title), 5);
  if (currentLang === "en") {
    return `${asSentence(groupCopy.description)} This category opens a route through ${group.themes.length} related functions, including ${names}. Together they show how ${groupCopy.title.toLowerCase()} depends on coordinated activity across ${regionIds.length} atlas systems rather than on a single isolated area.`;
  }
  return `${asSentence(groupCopy.description)} Esta categoría abre una ruta por ${group.themes.length} funciones relacionadas, como ${names}. En conjunto muestran que ${groupCopy.title.toLowerCase()} depende de la coordinación de ${regionIds.length} sistemas del atlas, no de una sola zona aislada.`;
}

function buildThemeLead(section, themeCopy) {
  if (currentLang === "en") {
    return `When you explore ${themeCopy.title.toLowerCase()}, the atlas highlights ${section.regions.length} associated systems and follows how they work together in social life. ${asSentence(themeCopy.description)}`;
  }
  return `Al explorar ${themeCopy.title.toLowerCase()}, el atlas ilumina ${section.regions.length} sistemas asociados y permite seguir cómo se coordinan en la vida social. ${asSentence(themeCopy.description)}`;
}

function buildTeachingNarrative(themeCopy) {
  if (currentLang === "en") {
    return `${asSentence(themeCopy.guide ?? themeCopy.description)} This gives the function a concrete role in everyday interaction instead of leaving it as an abstract label.`;
  }
  return `${asSentence(themeCopy.guide ?? themeCopy.description)} Así la función queda ubicada en situaciones concretas de interacción, y no solo como una etiqueta abstracta.`;
}

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.title = "Open Social Brain";
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });
  const t = uiText[lang];
  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  };
  setText(".topbar .eyebrow", t.appKicker);
  setText("[data-view='center']", t.center);
  setText(".model-loader span", t.loadModel);
  const legendItems = document.querySelectorAll(".legend span");
  if (legendItems[0]) legendItems[0].lastChild.textContent = t.cortex;
  if (legendItems[1]) legendItems[1].lastChild.textContent = t.networks;
  if (legendItems[2]) legendItems[2].lastChild.textContent = t.subcortex;
  setText(".panel-section:nth-of-type(1) .eyebrow", t.selectedStructure);
  const factLabels = document.querySelectorAll(".panel-section:nth-of-type(1) dt");
  if (factLabels[0]) factLabels[0].textContent = t.location;
  if (factLabels[1]) factLabels[1].textContent = t.functions;
  if (factLabels[2]) factLabels[2].textContent = t.networks;
  if (factLabels[3]) factLabels[3].textContent = t.cerebraLabel;
  setText(".panel-section:nth-of-type(2) .eyebrow", t.socialCog);
  const socialLabels = document.querySelectorAll(".panel-section:nth-of-type(2) dt");
  if (socialLabels[0]) socialLabels[0].textContent = t.keyConcepts;
  if (socialLabels[1]) socialLabels[1].textContent = t.teachingExample;
  setText(".panel-section:nth-of-type(3) .eyebrow", t.learnMore);
  setText(".panel-section:nth-of-type(4) .eyebrow", t.activeTheme);
  setText(".panel-section:nth-of-type(5) .eyebrow", t.anatomicalZones);
  setText(".experiment .eyebrow", t.functionalExperiment);
  regionCountEl.textContent = `${regions.length} ${t.regions}`;
  renderThemeTabs(activeThemeId);
  if (selectionMode === "region") {
    selectRegion(selected.id, { revealMenu: false });
  } else if (selectionMode === "theme" && activeThemeId) {
    selectTheme(activeThemeId, { renderTabs: false });
  } else {
    clearSelectionDisplay();
  }
  renderZoneList();
}

function showInitialOverviewCopy() {
  const groupTitles = socialThemeGroups.map((group) => getSocialGroupCopy(group).title);
  title.textContent = "Open Social Brain";
  summary.textContent = uiText[currentLang].cleanStart;
  locationEl.textContent = currentLang === "en" ? "Whole-brain social atlas." : "Atlas social de cerebro completo.";
  functionsEl.textContent = uiText[currentLang].mainDomains;
  networkEl.textContent = groupTitles.join(", ");
  labelEl.textContent = currentLang === "en"
    ? `${regionSections.length} social functions organized into ${socialThemeGroups.length} categories.`
    : `${regionSections.length} funciones sociales organizadas en ${socialThemeGroups.length} categorías.`;
  socialTitleEl.textContent = currentLang === "en" ? "Exploration by social category" : "Exploración por categoría social";
  socialSummaryEl.textContent = currentLang === "en"
    ? "The first layer is intentionally clean: choose a main category, then a specific function to highlight its brain network."
    : "La primera capa queda limpia: elige una categoría principal y luego una función específica para iluminar su red cerebral.";
  socialConceptsEl.textContent = groupTitles.join(" · ");
  showLiteralQuote("socialSpecies", {
    label: currentLang === "en" ? "the social brain" : "el cerebro social",
    importance: currentLang === "en"
      ? "The first view is intentionally open: before choosing a function, the atlas frames the brain as a system prepared for life with others."
      : "La primera vista queda abierta a propósito: antes de elegir una función, el atlas presenta el cerebro como un sistema preparado para vivir con otros."
  });
  experimentTitle.textContent = currentLang === "en" ? "Guided social exploration" : "Exploración social guiada";
  experimentCopy.textContent = uiText[currentLang].chooseMainDomain;
}

function showSocialGroupOverview(group) {
  const groupCopy = getSocialGroupCopy(group);
  const themeCopies = group.themes.map(themeById).filter(Boolean).map(getThemeCopy);
  const regionIds = uniqueGroupRegionIds(group);
  const groupNarrative = buildGroupNarrative(group, groupCopy, themeCopies, regionIds);
  title.textContent = groupCopy.title;
  summary.textContent = groupNarrative;
  locationEl.textContent = currentLang === "en" ? "Main social category." : "Categoría social principal.";
  functionsEl.textContent = groupCopy.hint;
  networkEl.textContent = themeCopies.map((theme) => theme.title).join(", ");
  labelEl.textContent = currentLang === "en"
    ? `${group.themes.length} specific functions; ${regionIds.length} associated atlas systems.`
    : `${group.themes.length} funciones específicas; ${regionIds.length} sistemas del atlas asociados.`;
  socialTitleEl.textContent = groupCopy.title;
  socialSummaryEl.textContent = groupCopy.description ?? groupNarrative;
  socialConceptsEl.textContent = themeCopies.map((theme) => theme.title).join(" · ");
  showLiteralQuote(literalQuoteBySocialGroup[group.id] ?? "socialSpecies", {
    label: groupCopy.title,
    importance: themeCopies.map((theme) => theme.hint).join(". "),
    deepExtra: groupCopy.description ?? ""
  });
  experimentTitle.textContent = groupCopy.title;
  experimentCopy.textContent = currentLang === "en"
    ? "Choose one of the specific functions to turn this broad category into a concrete brain network."
    : "Elige una de las funciones específicas para convertir esta categoría amplia en una red cerebral concreta.";
}

function selectMainThemeGroup(groupId, options = {}) {
  const { renderTabs = true } = options;
  const group = socialThemeGroups.find((item) => item.id === groupId);
  if (!group) return;
  activeSocialGroupId = group.id;
  activeThemeId = null;
  selectedZoneLabel = null;
  selectionMode = "none";
  if (renderTabs) renderThemeTabs(null);
  clearSelectionDisplay({ updateCopy: false });
  showSocialGroupOverview(group);
  document.querySelectorAll("[data-theme]").forEach((button) => button.classList.remove("active"));
}

function renderThemeTabs(sectionId = activeThemeId) {
  const section = regionSections.find((item) => item.id === sectionId) ?? null;
  const sectionGroup = section ? socialGroupForTheme(section.id) : null;
  if (sectionGroup) activeSocialGroupId = sectionGroup.id;
  const activeGroup = socialThemeGroups.find((group) => group.id === activeSocialGroupId) ?? null;
  const themeCopy = getThemeCopy(section);
  const groupCopy = getSocialGroupCopy(activeGroup);
  activeThemeId = section?.id ?? null;
  if (!activeGroup) {
    regionCountEl.textContent = currentLang === "en"
      ? `${socialThemeGroups.length} categories`
      : `${socialThemeGroups.length} categorías`;
  } else if (!section) {
    regionCountEl.textContent = currentLang === "en"
      ? `${activeGroup.themes.length} functions`
      : `${activeGroup.themes.length} funciones`;
  } else {
    regionCountEl.textContent = currentLang === "en"
      ? `${section.regions.length} areas`
      : `${section.regions.length} áreas`;
  }
  regionList.className = "theme-detail";
  regionList.innerHTML = "";
  if (themeTabsBar) themeTabsBar.innerHTML = "";

  socialThemeGroups.forEach((group) => {
    const copy = getSocialGroupCopy(group);
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "program-tab main-social-tab";
    tab.dataset.themeGroup = group.id;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", String(group.id === activeGroup?.id));
    tab.classList.toggle("active", group.id === activeGroup?.id);
    tab.title = copy.hint;
    tab.innerHTML = `<span class="tab-icon">${group.icon}</span><strong>${copy.title}</strong><span class="tab-count">${group.themes.length}</span>`;
    tab.addEventListener("click", () => selectMainThemeGroup(group.id));
    themeTabsBar?.appendChild(tab);
  });

  themeTabsBar?.querySelector(".program-tab.active")?.scrollIntoView({
    block: "nearest",
    inline: "nearest"
  });

  const intro = document.createElement("p");
  intro.className = "theme-intro";
  intro.textContent = activeGroup
    ? (section ? uiText[currentLang].chooseSpecificFunction : uiText[currentLang].domainSelected)
    : uiText[currentLang].chooseMainDomain;
  regionList.appendChild(intro);

  const header = document.createElement("div");
  header.className = "theme-window-header";
  header.innerHTML = `
    <div>
      <strong>${section ? themeCopy.title : (groupCopy?.title ?? uiText[currentLang].mainDomains)}</strong>
      <span>${section ? themeCopy.hint : (groupCopy?.hint ?? uiText[currentLang].noActiveDomain)}</span>
    </div>
  `;
  regionList.appendChild(header);

  const body = document.createElement("div");
  body.className = "theme-window-body";
  const handbook = section?.handbook ? `<p class="theme-handbook">${themeCopy.handbook}</p>` : "";
  body.innerHTML = `
    <p>${section ? themeCopy.description : (groupCopy?.description ?? uiText[currentLang].cleanStart)}</p>
    ${handbook}
  `;
  regionList.appendChild(body);

  if (!activeGroup) return;

  const functionTitle = document.createElement("div");
  functionTitle.className = "theme-area-title";
  functionTitle.innerHTML = `<strong>${uiText[currentLang].specificFunctions}</strong><span>${activeGroup.themes.length}</span>`;
  regionList.appendChild(functionTitle);

  const functionList = document.createElement("div");
  functionList.className = "social-function-list";
  activeGroup.themes
    .map(themeById)
    .filter(Boolean)
    .forEach((theme) => {
      const copy = getThemeCopy(theme);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "social-function-card";
      button.dataset.theme = theme.id;
      button.classList.toggle("active", theme.id === section?.id);
      button.innerHTML = `
        <span class="function-icon">${theme.icon ?? "OS"}</span>
        <span>
          <strong>${copy.title}</strong>
          <small>${copy.hint}</small>
        </span>
        <span class="function-count">${theme.regions.length}</span>
      `;
      button.addEventListener("click", () => selectTheme(theme.id));
      functionList.appendChild(button);
    });
  regionList.appendChild(functionList);

  if (!section) return;

  const group = document.createElement("div");
  group.className = "region-group theme-region-group";
  const groupTitle = document.createElement("div");
  groupTitle.className = "theme-area-title";
  groupTitle.innerHTML = `<strong>${uiText[currentLang].involvedAreas}</strong><span>${section.regions.length}</span>`;
  regionList.appendChild(groupTitle);
  section.regions
    .map((id) => regions.find((region) => region.id === id))
    .filter(Boolean)
    .forEach((region) => group.appendChild(makeRegionButton(region)));
  regionList.appendChild(group);
}
function revealRegionInMenu(regionId) {
  const section = regionSections.find((item) => item.id === activeThemeId && item.regions.includes(regionId))
    ?? regionSections.find((item) => item.regions.includes(regionId));
  if (!section) return;
  if (activeThemeId !== section.id || !regionList.querySelector(`[data-region="${regionId}"]`)) {
    renderThemeTabs(section.id);
  }
  document.querySelectorAll("[data-region]").forEach((button) => {
    button.classList.toggle("active", button.dataset.region === regionId);
  });
}

renderThemeTabs();

function renderZoneList() {
  const query = zoneSearch.value.trim().toLowerCase();
  zoneList.innerHTML = "";

  const zones = [...cerebraByLabel.values()]
    .filter((zone) => activeSide === "all" || zone.hemisphere === activeSide)
    .filter((zone) => activeGroup === "all" || zone.group === activeGroup)
    .filter((zone) => !query || zoneLabelText(zone).toLowerCase().includes(query) || zone.name.toLowerCase().includes(query));

  zoneCount.textContent = `${zones.length} zonas`;

  zones
    .sort((a, b) => a.group.localeCompare(b.group) || a.displayName.localeCompare(b.displayName) || a.hemisphere.localeCompare(b.hemisphere))
    .forEach((zone) => {
      const button = document.createElement("button");
      button.dataset.zoneLabel = String(zone.label);
      button.classList.toggle("active", selectedZoneLabel === zone.label);
      button.innerHTML = `<span><strong>${zone.displayName}</strong><span class="zone-meta">${zone.groupLabel ?? groupName(zone.group)}</span></span><span class="side-pill">${zone.hemisphere === "RH" ? "Der." : "Izq."}</span>`;
      button.addEventListener("click", () => selectZone(zone.label));
      zoneList.appendChild(button);
    });
}

function groupName(group) {
  return {
    frontal: "Lóbulo frontal",
    temporal: "Lóbulo temporal",
    parietal: "Lóbulo parietal",
    occipital: "Lóbulo occipital",
    limbic: "Sistema límbico",
    subcortex: "Subcorteza y ventrículos",
    cerebellum: "Cerebelo"
  }[group] ?? "Atlas";
}

function isDeepRegion(regionId) {
  return ["hippocampus", "amygdala", "insula", "cerebellum"].includes(regionId);
}

function isDeepZone(zone) {
  if (!zone) return false;
  if (["subcortex", "cerebellum"].includes(zone.group)) return true;
  return [
    "Hipocampo",
    "Amígdala",
    "Ínsula",
    "Parahipocampal",
    "Corteza entorrinal",
    "Diencéfalo ventral",
    "Prosencéfalo basal"
  ].includes(zone.displayName);
}

function isCorticalMesh(mesh) {
  const group = mesh.userData.cerebraLabel?.group;
  return ["frontal", "temporal", "parietal", "occipital", "limbic"].includes(group);
}

function stabilizeMaterial(mesh, visible = true) {
  mesh.userData.selectionVisible = visible;
  applyAtlasMeshVisibility(mesh);
  if (!mesh.material) return;
  mesh.material.transparent = false;
  mesh.material.opacity = 1;
  mesh.material.depthWrite = true;
  mesh.material.side = THREE.FrontSide;
  mesh.material.needsUpdate = true;
  syncInternalSurface(mesh);
}

function applyContextMaterial(mesh, isSelected, color = null) {
  if (!mesh.material) return;
  if (color && isSelected) mesh.material.color.setHex(color);
  mesh.material.transparent = !isSelected;
  mesh.material.opacity = isSelected ? 1 : 0.18;
  mesh.material.depthWrite = isSelected;
  mesh.material.roughness = isSelected ? 0.36 : 0.88;
  mesh.material.clearcoat = isSelected ? 0.72 : 0.12;
  mesh.material.emissive = new THREE.Color(isSelected && color ? color : 0x000000);
  mesh.material.emissiveIntensity = isSelected ? 0.32 : 0.0;
  mesh.material.side = THREE.FrontSide;
  mesh.material.needsUpdate = true;
  syncInternalSurface(mesh);
}

function applyAtlasMeshVisibility(mesh) {
  const selectionVisible = mesh.userData.selectionVisible !== false;
  const label = mesh.userData.cerebraLabel;
  const hemisphereVisible = !medialCutEnabled || label?.hemisphere === medialHemisphere;
  mesh.visible = selectionVisible && hemisphereVisible;
  if (mesh.userData.innerMesh) mesh.userData.innerMesh.visible = mesh.visible;
}

function syncInternalSurface(mesh) {
  const inner = mesh.userData.innerMesh;
  if (!inner || !mesh.material) return;
  inner.visible = mesh.visible;
  inner.material.color.copy(mesh.material.color).lerp(new THREE.Color(0xffc0a6), 0.22);
  inner.material.emissive = mesh.material.emissive?.clone?.() ?? new THREE.Color(0x000000);
  inner.material.emissiveIntensity = Math.min(mesh.material.emissiveIntensity ?? 0, 0.12);
  inner.material.clippingPlanes = mesh.material.clippingPlanes ?? [];
  inner.material.transparent = mesh.material.transparent;
  inner.material.opacity = mesh.material.opacity;
  inner.material.depthWrite = mesh.material.depthWrite;
  inner.material.needsUpdate = true;
}

function resetSelectionVisibility() {
  allAtlasMeshes.forEach((mesh) => {
    mesh.userData.selectionVisible = true;
    applyAtlasMeshVisibility(mesh);
  });
}

function updateSocialContent(regionId, zone = null) {
  if (currentLang === "en") {
    const region = regions.find((item) => item.id === regionId) ?? regions[0];
    const copy = getRegionCopy(region);
    socialTitleEl.textContent = zone ? `${zone.displayName}: social neuroscience link` : `${copy.name}: social neuroscience link`;
    socialSummaryEl.textContent = copy.summary;
    socialConceptsEl.textContent = copy.functions;
    if (socialExampleEl) socialExampleEl.textContent = copy.taskCopy;
    return;
  }
  const profile = socialFunctionProfiles[regionId];
  if (profile && !zone) {
    socialTitleEl.textContent = profile.title;
    socialSummaryEl.textContent = profile.summary;
    socialConceptsEl.textContent = profile.concepts;
    if (socialExampleEl) socialExampleEl.textContent = profile.example;
    return;
  }
  const base = socialCognitiveContent[regionId] ?? socialCognitiveContent.dlpfc;
  const override = zone ? zoneContentOverrides[zone.displayName] : null;
  socialTitleEl.textContent = override?.[0] ?? base.title;
  socialSummaryEl.textContent = override?.[1] ?? base.summary;
  socialConceptsEl.textContent = base.concepts;
  if (socialExampleEl) socialExampleEl.textContent = base.example;
}

function updateDeepDive(regionId, zone = null) {
  const region = regions.find((item) => item.id === regionId) ?? regions[0];
  const copy = getRegionCopy(region);
  const profile = socialFunctionProfiles[regionId];
  const phenomSummary = zone
    ? (zoneContentOverrides[zone.displayName]?.[1] ?? profile?.summary ?? copy.summary)
    : (profile?.summary ?? copy.summary);
  showLiteralQuote(quoteKeyForRegion(regionId), {
    label: zone ? zone.displayName : (profile?.title ?? copy.name),
    importance: phenomSummary,
    deepExtra: zone ? "" : (profile?.deep ?? "")
  });
}

const themeDeepExtrasEs = {
  "self-mentalizing": ["Extensión: el yo como modelo social", "Una idea útil para clase es que el yo funciona como referencia para simular a otros. En primates y humanos, las señales de rango, familiaridad y memoria social modifican cómo se predice la conducta ajena.", "Comparar juicios sobre yo, amigo y desconocido; luego pedir predicción de conducta en una escena ambigua.", "Cuándo usamos el propio yo como atajo para comprender a otra persona?"],
  "person-perception": ["Más allá del rostro", "La percepción de personas no termina en identificar una cara: integra voz, postura, mirada, emoción y contexto. En primates, la mirada y las expresiones faciales son claves para anticipar afiliación, amenaza o intención.", "Presentar rostro neutro con voz amable/amenazante y evaluar cómo cambia la impresión inicial.", "Qué señal pesa más: rostro, voz o contexto?"],
  "emotion-empathy": ["Cuerpo, emoción y predicción", "En animales sociales, señales corporales de miedo, dolor o alarma pueden propagarse en el grupo y preparar respuestas defensivas. En humanos, la ínsula permite discutir cómo el cuerpo propio participa en comprender estados ajenos.", "Medir interocepción breve y luego comparar intensidad emocional ante escenas sociales y no sociales.", "La emoción social requiere sentir algo en el propio cuerpo?"],
  "empathy-compassion": ["Empatía no es lo mismo que ayuda", "La evidencia comparada muestra formas básicas de contagio emocional en roedores y primates, pero la compasión humana añade regulación, perspectiva y decisión prosocial. Esto ayuda a separar resonancia afectiva de conducta de ayuda.", "Comparar dolor ajeno con y sin posibilidad de ayudar; registrar malestar personal versus motivación prosocial.", "Sentir el dolor ajeno siempre aumenta la ayuda?"],
  "regulation-control": ["Control bajo presión social", "El control ejecutivo cambia cuando hay observadores, reputación o presión grupal. En estudios de conducta social, el mismo error puede tener más peso cuando implica vergüenza o evaluación externa.", "Hacer una tarea Go/No-Go con feedback privado versus público simulado.", "Por qué una regla fácil se vuelve difícil cuando otros observan?"],
  "moral-ethics": ["Moralidad como conflicto entre sistemas", "Los dilemas morales permiten ver la tensión entre daño, intención, emoción y cálculo de consecuencias. En animales se observan precursores de aversión a inequidad y cuidado, pero la deliberación normativa humana añade lenguaje y cultura.", "Comparar dilemas de daño accidental, daño intencional y daño útil para salvar a varios.", "Juzgamos más la intención o la consecuencia?"],
  "action-imitation": ["Imitación flexible", "La imitación en primates y humanos no es copiar todo: depende de meta, contexto, estatus del modelo y control inhibitorio. Esto permite discutir aprendizaje social y sincronía sin reducirlo a reflejo motor.", "Tarea de imitación congruente/incongruente usando gestos de una persona con distinto estatus social.", "Cuándo conviene imitar y cuándo inhibir la imitación?"],
  "reward-bonding": ["La recompensa social cambia con el vínculo", "En especies sociales, contacto, afiliación y cercanía pueden funcionar como recompensa. En humanos, aprobación, reputación y pertenencia pueden modificar el valor de una misma decisión.", "Comparar elección de recompensa propia versus compartida con amigo, desconocido o grupo.", "La recompensa social puede competir con la recompensa material?"],
  "attachment-bond": ["Vínculo como regulador biológico", "El apego puede reducir respuestas de amenaza y modificar dolor o estrés. En animales sociales, la separación y el reencuentro son modelos clásicos para estudiar afiliación, cuidado y regulación.", "Presentar una señal de apoyo social antes de una imagen negativa y comparar regulación emocional reportada.", "Por qué una persona cercana puede cambiar la respuesta al estrés?"],
  "social-threat-stress": ["Amenaza evaluativa", "La amenaza social no siempre es física: puede ser reputacional. En primates, la posición jerárquica cambia vigilancia y estrés; en humanos, ser evaluado públicamente puede reclutar circuitos de amenaza y control.", "Simular preparación de exposición oral con o sin evaluación externa y registrar ansiedad anticipatoria.", "Qué diferencia una amenaza física de una amenaza a la reputación?"],
  "loneliness-isolation": ["Soledad como sesgo de predicción", "La soledad percibida puede aumentar hipervigilancia ante señales ambiguas. Más que falta objetiva de contacto, puede funcionar como un estado que cambia expectativas sobre aceptación o rechazo.", "Interpretar mensajes sociales ambiguos después de inducir recuerdo de inclusión o exclusión.", "La soledad cambia lo que vemos en señales ambiguas?"],
  "support-health": ["Apoyo social como amortiguador", "El apoyo interpersonal puede amortiguar estrés, dolor y emoción negativa. Esta función permite conectar el atlas con salud, bienestar y regulación social del cuerpo.", "Comparar dolor o imagen negativa en condición solo versus recordando apoyo de alguien cercano.", "El apoyo actúa por emoción, atención, expectativa o significado?"],
  "culture-social-cognition": ["Cultura como contexto neural", "La cultura orienta qué información social se considera relevante: self, familia, grupo, norma o reputación. No cambia un módulo aislado, sino el peso de redes de self, atención y valoración.", "Juicio de rasgos sobre yo, familia y grupo en contextos individualistas versus colectivistas discutidos en clase.", "La cultura cambia la respuesta social o cambia la tarea que el cerebro cree estar haciendo?"],
  "social-norms-conformity": ["Conformidad y error social", "Cuando la respuesta propia difiere del grupo puede aparecer una señal de conflicto. En animales sociales y humanos, alinearse con el grupo puede reducir riesgo, pero también producir errores colectivos.", "Mostrar respuestas falsas de mayoría antes de un juicio perceptual o moral y medir cambio de decisión.", "Cuándo la conformidad es adaptación y cuándo es sesgo?"],
  "altruism-prosocial": ["Ayudar tiene varias rutas", "La ayuda puede surgir por empatía, norma, reputación, reciprocidad o recompensa social. En animales se observan conductas de ayuda y cooperación, pero en humanos la motivación puede cambiar con visibilidad y significado moral.", "Juego de donación privado versus público, separando costo personal y beneficio para otro.", "Ayudamos por el otro, por la norma o por cómo nos veremos?"],
  "first-impressions": ["Inferencias rápidas y sesgo", "Las primeras impresiones son veloces, pero muy sensibles al contexto. Rasgos como confianza o dominancia pueden inferirse desde señales faciales mínimas, aunque esas inferencias no siempre son válidas.", "Rating de confianza en rostros antes y después de entregar información contextual contradictoria.", "Cuánto corregimos una primera impresión cuando aparece nueva evidencia?"],
  "dominance-hierarchy": ["Jerarquía, aprendizaje y cuerpo", "En primates, jerarquía social organiza acceso a recursos, estrés y alianzas. En humanos, el estatus también se aprende por rostros, resultados y reputación, no solo por fuerza física.", "Aprender pares de rostros dominante/subordinado y luego probar memoria y elección de alianza.", "El estatus se reconoce, se aprende o se negocia?"],
  "trust-cooperation": ["Confianza como predicción", "Confiar implica predecir conducta futura bajo incertidumbre. La memoria de reputación y el valor esperado de cooperación se actualizan cuando aparece reciprocidad o traición.", "Juego de confianza repetido con una ruptura inesperada de cooperación.", "Cuántas experiencias negativas bastan para romper la confianza?"],
  "social-learning-memory": ["Memoria para personas relevantes", "La memoria social suele priorizar personas emocionalmente relevantes, cooperadores, tramposos o miembros del grupo. Esto se puede conectar con aprendizaje adaptativo en grupos.", "Memorizar rostros asociados a cooperación, trampa o neutralidad y probar recuerdo diferido.", "Recordamos mejor a quien ayuda o a quien amenaza?"],
  "rejection-exclusion": ["Exclusión y conducta posterior", "El rechazo no solo duele: puede cambiar atención, búsqueda de afiliación, agresión o retirada. En animales sociales, separación y exclusión alteran conducta exploratoria y señales de estrés.", "Cyberball breve seguido de elección entre reconectar, evitar o competir.", "El rechazo nos vuelve más prosociales o más defensivos?"],
  "communication-health": ["La voz como señal corporal social", "La prosodia comunica amenaza, cuidado, ironía o apoyo incluso con las mismas palabras. Esta vía permite unir audición, emoción, estrés y regulación interpersonal.", "Escuchar la misma frase con prosodia cálida, neutra o crítica y evaluar amenaza/apoyo percibido.", "Cuándo el tono pesa más que el contenido verbal?"],
  "social-anger": ["Rabia como señal social", "La rabia no siempre indica pérdida de control: en muchos contextos comunica frustración, injusticia o un límite. Su intensidad y expresión dependen del estatus, la presencia de observadores y la interpretación del episodio que la provocó.", "Escenarios breves de bloqueo de meta o trato injusto, comparando intensidad de rabia según visibilidad y estatus del otro.", "Cuándo la rabia deja de ser una señal social legítima y se convierte en un problema de regulación?"],
  "shame-social": ["La mirada internalizada", "La vergüenza no requiere que alguien nos observe en el momento: basta con imaginar cómo seríamos vistos. Integra self, norma y perspectiva social en una emoción que puede motivar reparación o, en exceso, paralizar la conducta.", "Comparar errores privados con errores ante observadores; medir vergüenza, deseo de ocultamiento y regulación emocional.", "Por qué nos importa cómo nos ven incluso cuando nadie nos está mirando?"],
  "self-representation": ["El yo como construcción activa", "La identidad no es un archivo fijo: se reconstruye con cada interacción social, comparación con otros, recuerdo autobiográfico y valoración del propio cuerpo. Representar el yo usa muchos de los mismos recursos que se usan para representar a los demás.", "Comparar tiempos de respuesta y memoria en juicios de rasgos propios, de un amigo cercano y de una figura pública desconocida.", "El yo es algo que tenemos de forma estable o algo que actualizamos en cada contexto social?"],
  "theory-of-mind": ["Inferir mentes invisibles", "Comprender a otra persona implica ir más allá de lo observable: inferir qué cree, qué desea o qué espera aunque esa creencia sea falsa o distinta a la nuestra. Desacoplar lo que el mundo ES de lo que alguien CREE que es, es una de las capacidades más complejas del cerebro social.", "Historias de falsa creencia y escenarios de malentendido; preguntar qué sabe el personaje y qué haría en consecuencia.", "Cuándo comprendemos genuinamente a alguien y cuándo solo proyectamos lo que nosotros haríamos en su lugar?"],
  "perspective-taking": ["Salir del propio punto de vista", "Tomar la perspectiva de otro exige suprimir activamente el propio punto de vista y simular el del otro. No basta con empatizar: requiere coordinar qué sabe, dónde está y qué siente alguien desde una posición diferente a la nuestra.", "Tarea de perspectiva visual o afectiva: decidir qué ve o siente un personaje desde una posición distinta a la del observador.", "Tomar la perspectiva de otro cambia genuinamente lo que sentimos o solo cambia lo que decidimos hacer?"],
  "joint-attention-gaze": ["La mirada que orienta sin palabras", "Seguir la mirada de otro no es un reflejo automático: implica inferir que hay algo relevante para compartir en el espacio social. La atención conjunta es una de las conductas sociales más tempranas y facilita el aprendizaje, la cooperación y la comunicación.", "Cueing de mirada válido e inválido con objetos sociales y no sociales; medir rapidez y confianza en la orientación.", "Por qué seguimos la mirada de alguien aunque sepamos que puede estar equivocado sobre dónde mirar?"],
  "agency-intention": ["Quién causó qué y por qué", "Atribuir agencia implica decidir si una consecuencia social fue resultado de una decisión, un accidente o una negligencia. Esa diferencia modifica el juicio moral, la respuesta emocional y la decisión de responsabilizar o perdonar.", "Juicios de accidente versus intención en escenas sociales ambiguas, con variaciones en daño causado y responsabilidad esperada.", "Una misma consecuencia social cambia de significado moral según la intención que le atribuimos?"],
  "pragmatic-language": ["Más allá del significado literal", "El lenguaje social rara vez se entiende solo por las palabras. La ironía, el sarcasmo y la insinuación exigen integrar tono, contexto, historia compartida y modelado de las intenciones del hablante, conectando audición, emoción y teoría de la mente.", "Frases literales e irónicas con prosodia congruente o incongruente; medir tiempo de interpretación y error pragmático.", "Cuánto del significado de lo que alguien dice está en las palabras y cuánto en el modo en que las dice?"],
  "deception-trust-violation": ["Cuando el modelo del otro falla", "Detectar engaño o traición exige comparar lo esperado con lo observado. Una vez que alguien miente o traiciona, el cerebro actualiza un modelo de reputación que puede persistir largo tiempo y resistir evidencia contraria.", "Juego de confianza repetido con traición inesperada; medir velocidad de recuperación de cooperación y cambio de evaluación del otro.", "Una sola traición puede destruir una confianza construida durante mucho tiempo?"],
  "ingroup-outgroup": ["El cerebro que categoriza grupos", "La distinción entre el propio grupo y otros es una de las organizaciones sociales más rápidas y automáticas. Pero la categoría no es fija: puede cambiar con el contexto, la tarea, la identidad activada o la amenaza percibida.", "Clasificación de rostros o nombres como endogrupo/exogrupo con manipulación de contexto identitario; medir confianza y sesgo implícito.", "El favoritismo hacia el propio grupo es siempre negativo o puede ser una base necesaria para la cohesión social?"],
  "prejudice-stigma": ["Sesgos que operan sin conciencia", "Los sesgos de categorización social no son siempre deliberados: pueden surgir de aprendizajes implícitos y asociaciones afectivas que operan antes de que el control consciente intervenga. Conocerlos no los elimina, pero puede cambiar cuándo y cómo se expresan.", "Asociación implícita simplificada o juicio rápido de rasgos con y sin instrucción de norma igualitaria explícita; comparar respuestas.", "Podemos tener sesgos implícitos que contradicen con sinceridad nuestras creencias conscientes sobre justicia?"],
  "guilt-repair": ["El malestar que orienta hacia la acción", "A diferencia de la vergüenza, la culpa se orienta hacia lo que se hizo y cómo puede compensarse. Esta orientación reparadora la hace más adaptativa socialmente cuando la intensidad no desborda la capacidad de actuar.", "Escenarios de daño propio con opción de disculpa, compensación o inacción; medir culpa, intención de reparar y valoración de la relación.", "La culpa motiva reparación o puede ser tan intensa que paralice la conducta social?"],
  "social-pride": ["El logro que busca ser reconocido", "El orgullo combina evaluación del propio logro con anticipación del reconocimiento ajeno. En grupos, el orgullo bien calibrado puede señalar competencia sin desafiar jerarquías, pero cuando es excesivo puede generar rechazo o competencia.", "Feedback de desempeño privado versus público con ratings de orgullo, motivación de compartir el resultado y expectativa de reconocimiento.", "El orgullo es solo placer por el logro propio o también una señal de posición dentro del grupo?"],
  "social-repair": ["Restaurar lo que el error rompió", "Reparar no siempre basta con disculparse: el otro evalúa si la disculpa es genuina y si el comportamiento cambiará. Esa evaluación de sinceridad implica inferir intención, memoria de la relación y valorar el costo que el otro está dispuesto a asumir.", "Escenarios de transgresión con disculpa sincera, disculpa vacía o silencio; medir confianza restaurada y cooperación futura esperada.", "Una disculpa es más efectiva por las palabras que contiene o por el costo que muestra que quien se disculpa está dispuesto a pagar?"],
  "moral-indignation": ["La rabia que defiende una norma", "La indignación moral no es rabia personal: es la respuesta afectiva ante daño percibido como injusto hacia terceros o hacia normas compartidas. Puede motivar castigo altruista y defensa de principios más allá del interés propio.", "Escenarios de injusticia hacia uno mismo versus hacia un tercero; comparar intensidad de indignación, motivación de castigo y costo aceptado.", "Nos indignamos más cuando la injusticia nos afecta directamente o cuando viola una norma que consideramos fundamental?"],
  "envy-social-comparison": ["El valor relativo del logro", "La recompensa social tiene una dimensión comparativa: el logro propio se relativiza con el de los cercanos. Esta sensibilidad puede motivar esfuerzo y aprendizaje, pero también generar malestar cuando la brecha percibida parece injusta o ilegítima.", "Feedback de desempeño propio y de pares simultáneo; medir envidia, orgullo, motivación y deseo de reducir la ventaja ajena.", "La comparación social siempre perjudica el bienestar o puede funcionar también como motor de aprendizaje?"],
  "forgiveness-reconciliation": ["Reevaluar para poder continuar", "Perdonar no significa olvidar ni aceptar que el daño estuvo bien. Implica reinterpretar la ofensa, regular la rabia y decidir si la relación puede reanudarse bajo nuevas condiciones. El perdón cambia el peso afectivo del recuerdo, aunque el recuerdo persista.", "Escenarios de ofensa con disculpa sincera, insincera o ausente; medir disposición al perdón, cambio de confianza y calidad del recuerdo posterior.", "Perdonar a alguien cambia cómo lo recordamos o solo cambia cómo actuamos hacia esa persona de ahora en adelante?"],
  "reputation-impression": ["La imagen que persiste en la memoria", "Las acciones sociales dejan huella en quienes las observan. Una sola acción llamativa puede dominar la impresión sobre alguien incluso cuando hay abundante información contraria, especialmente si esa acción fue negativa o inesperada.", "Rostros asociados a acciones cooperativas y egoístas en distintas proporciones; medir impresión final y qué acciones se recuerdan mejor.", "Cuántas acciones positivas son necesarias para contrarrestar el peso de una sola acción negativa sobre nuestra impresión de alguien?"],
  "fairness-punishment": ["Castigar aunque cueste", "La aversión a la inequidad y la tendencia a castigar injusticia aparecen incluso cuando el castigo tiene costo personal para quien lo aplica. Esta disposición puede sostener normas sociales sin autoridad externa, pero también generar castigos desproporcionados.", "Juego del ultimátum con variaciones de inequidad; medir umbral de rechazo, intensidad de indignación y disposición a sacrificar ganancia.", "Por qué rechazamos repartos desiguales aunque rechazar signifique no recibir nada?"],
  "social-uncertainty": ["Decidir cuando el otro también ignora", "La incertidumbre social es diferente a la incertidumbre física: no solo ignoramos el resultado sino también las intenciones del otro. El cerebro resuelve esto combinando inferencia de estados mentales, memoria de reputación y actualización de expectativas.", "Escenarios sociales ambiguos con señales graduales de intención; medir interpretación inicial, cambio ante nueva evidencia y confianza final.", "Toleramos mejor la incertidumbre social cuando sabemos que el otro también desconoce el resultado?"],
  "social-decision-choice": ["Elegir cuando el resultado depende de otros", "Las decisiones sociales añaden al cálculo de consecuencias la consideración de cómo afectamos a otros, qué pensarán de nosotros y qué esperamos de su respuesta. Ese añadido puede hacer más lenta, más emocional o más sesgada una elección que en abstracto parecería simple.", "Elecciones equivalentes en versión privada versus social, variando consecuencias para el otro y visibilidad de la decisión propia.", "Una decisión que afecta a otras personas se procesa de forma diferente en el cerebro que una decisión puramente individual?"],
  "strategic-interaction": ["El juego de las expectativas mutuas", "En la interacción estratégica, mi mejor opción depende de lo que el otro elija, y el otro razona de la misma forma. Este círculo de expectativas mutuas hace que muchas situaciones sociales dependan de historia, confianza y reputación más que de lógica pura.", "Dilema del prisionero o juego de coordinación repetido; variar información sobre la estrategia del otro y medir cambios de cooperación.", "Intentar predecir lo que el otro hará nos vuelve más cooperativos o nos hace desconfiar más?"],
  "risk-ambiguity-social": ["Cuando perder tiene nombre y cara", "El riesgo social no es solo estadístico: cuando la pérdida posible implica rechazo, pérdida de estatus o daño a una relación, el sistema afectivo se activa de forma distinta que ante pérdidas puramente económicas. Las pérdidas sociales suelen pesar más que las ganancias equivalentes.", "Elecciones con ganancias y pérdidas equivalentes en versión social versus no social; medir aversión a la pérdida y variabilidad de decisión.", "Cambia nuestra aversión al riesgo cuando la pérdida posible es social —rechazo, vergüenza, reputación— y no solo económica?"],
  "bounded-rationality-bias": ["La razón dentro de límites reales", "Las personas deciden bajo presión, con memoria imperfecta, sesgos cognitivos y atención limitada. Entender esos límites no invalida la razón: explica por qué la conducta social a veces se desvía de lo que la teoría predice y cómo el contexto puede amplificar o reducir esos desvíos.", "Comparar elecciones con tiempo sin restricción versus presión temporal o información completa versus parcial; medir sesgo y calidad de la decisión.", "Conocer uno de nuestros sesgos cognitivos es suficiente para corregirlo en el momento en que debemos decidir?"],
  "choice-architecture-nudge": ["El contexto que guía sin obligar", "La arquitectura de elección propone que el modo en que se presentan las opciones puede cambiar sistemáticamente las decisiones sin alterar incentivos ni prohibir nada. Esta idea tiene implicaciones directas para política pública, salud, cooperación y conducta social a gran escala.", "Modificar la opción por defecto o la norma descriptiva en una elección social idéntica; medir diferencia en proporción de elección resultante.", "Cambiar el contexto de una decisión sin prohibir ninguna opción es un acto de libertad o una forma de influencia social?"],
  "collective-choice": ["Preferencias individuales, decisión compartida", "Transformar preferencias individuales en decisiones colectivas plantea un problema que la lógica sola no resuelve: no siempre existe un método de agregación que respete todas las preferencias razonables. Las instituciones y la legitimidad percibida complementan lo que el cálculo no puede resolver.", "Simular votación con preferencias divergentes y distintos métodos de agregación; evaluar justicia percibida del resultado entre los participantes.", "La suma de preferencias individuales racionales puede producir una decisión colectiva que nadie habría elegido por separado?"],
  "interpersonal-synchrony": ["El ritmo como pegamento social", "Moverse, hablar o respirar en sincronía con otro puede aumentar la sensación de cercanía, afiliación y disposición a cooperar, incluso cuando la sincronía es breve o parcial. Esta función muestra cómo el tiempo compartido crea alineamiento social sin mediación consciente.", "Tapping sincronizado versus asincrónico en parejas, seguido de juego de cooperación; medir diferencia en cooperación y cercanía percibida.", "Moverse en sincronía con alguien genera disposición real a cooperar o solo crea una sensación momentánea de cercanía?"],
  "affective-mentalizing": ["Leer lo que el otro siente", "Mentalizar estados afectivos exige algo más que reconocer emociones en rostros: implica inferir por qué alguien se siente así, qué lo produjo y qué necesita. Esa inferencia integra memoria episódica, teoría de la mente y resonancia afectiva en una tarea social continua.", "Historias sociales con emoción implícita; identificar el estado del personaje, su causa y una respuesta adecuada de quien lo acompaña.", "Podemos comprender genuinamente la emoción de alguien sin haber vivido algo similar?"],
  "intercorporeality-interaffectivity": ["Cuerpos que se afectan mutuamente", "La interacción social no comienza en la mente: comienza en el cuerpo. Postura, tono, ritmo, mirada y gesto se sincronizan y se afectan mutuamente antes de que llegue la interpretación consciente. Este enfoque desafía la idea de que el cerebro social opera como un procesador aislado.", "Comparar comprensión y afecto en conversación cara a cara, solo audio y solo texto; medir diferencias en sincronía, cercanía y malentendidos.", "La interacción cara a cara aporta algo al entendimiento social que el audio o el texto no pueden replicar?"],
  "social-metacognition": ["Saber cuánto sabemos del otro", "La metacognición social evalúa cuánta confianza tenemos en nuestra lectura de otros, detecta errores en esas inferencias y corrige modelos cuando la retroalimentación lo exige. Sin esta capacidad, las interpretaciones sociales se vuelven rígidas e impermeables a evidencia.", "Juicio de emoción o intención ajena con rating de confianza; comparar calibración antes y después de retroalimentación correctiva.", "Cuándo tenemos exceso de confianza en nuestra lectura de los demás y cuándo la sometemos genuinamente a revisión?"]
};

const themeDeepExtrasEn = {
  "empathy-compassion": ["Empathy is not the same as helping", "Comparative evidence shows basic emotional contagion in rodents and primates, while human compassion adds regulation, perspective and prosocial choice.", "Compare observed pain with or without a chance to help; separate personal distress from helping motivation.", "Does feeling another person's pain always increase helping?"],
  "attachment-bond": ["Bonding as biological regulation", "Attachment can reduce threat responses and modulate pain or stress. Separation and reunion in social animals are classic models for care, affiliation and regulation.", "Present a social-support cue before negative images and compare reported emotion regulation.", "Why can a close person change the stress response?"],
  "social-threat-stress": ["Evaluative threat", "Social threat can be reputational rather than physical. In primates, hierarchy changes vigilance and stress; in humans, public evaluation recruits threat and control circuits.", "Simulate preparation for a public answer with or without external evaluation and record anticipatory anxiety.", "How is physical threat different from reputational threat?"],
  "altruism-prosocial": ["Helping has several routes", "Helping can arise from empathy, norms, reputation, reciprocity or social reward. Visibility changes the meaning of prosocial decisions.", "Use a private versus public donation game with personal cost and benefit to another person.", "Do we help for the other person, the norm or our reputation?"]
};

function getThemeDeepExtra(section, themeCopy) {
  const fallback = currentLang === "en"
    ? [
      "Comparative and classroom extension",
      "Use this function to connect human social cognition with comparative evidence from social animals: affiliation, hierarchy, threat, cooperation and learning change how brains prioritize information.",
      "Create a short scenario task with social and nonsocial versions, then compare ratings, reaction time or memory.",
      "What changes when the same cognitive process becomes social?"
    ]
    : [
      "Extensión comparada y docente",
      "Usa esta función para conectar la cognición social humana con evidencia comparada en animales sociales: afiliación, jerarquía, amenaza, cooperación y aprendizaje cambian qué información se vuelve prioritaria.",
      "Crear una tarea breve con versión social y no social del mismo proceso, comparando rating, tiempo de respuesta o memoria.",
      "Qué cambia cuando el mismo proceso cognitivo se vuelve social?"
    ];
  const source = currentLang === "en"
    ? (themeDeepExtrasEn[section.id] ?? fallback)
    : (themeDeepExtrasEs[section.id] ?? fallback);
  return {
    title: source[0] ?? themeCopy.title,
    copy: source[1] ?? fallback[1],
    experiment: source[2] ?? fallback[2],
    question: source[3] ?? fallback[3]
  };
}

const themeNetworkDescriptionsEs = {
  "self-mentalizing": "En esta red, la red por defecto construye una escena interna con recuerdos, metas y narrativa del yo; vmPFC le asigna significado personal y valor social; el hipocampo aporta episodios concretos de interacciones previas; y TPJ/atención ventral ayuda a separar lo que yo sé de lo que otra persona puede saber o creer. Así, la mentalización aparece cuando memoria, self y perspectiva se coordinan para imaginar la mente de otro.",
  "person-perception": "La percepción de personas comienza con análisis visual y auditivo, pero se vuelve social cuando el fusiforme estabiliza identidad facial, la corteza auditiva extrae prosodia y voz, la vía visual organiza rasgos y movimiento, la amígdala evalúa relevancia emocional, y TPJ/atención ventral orienta hacia mirada, gestos o cambios inesperados. La red permite pasar de ver un rostro a interpretar presencia, intención y estado afectivo.",
  "emotion-empathy": "La ínsula convierte señales corporales en experiencia subjetiva, la amígdala detecta amenaza o valor afectivo, el cíngulo anterior registra conflicto, malestar o necesidad de ajuste, y la red de saliencia decide qué emoción merece prioridad. En conjunto, esta red explica cómo una señal social se siente en el cuerpo antes de convertirse en una decisión o interpretación consciente.",
  "regulation-control": "DLPFC mantiene la regla social activa, vmPFC pondera valor, consecuencia y significado personal, el cíngulo anterior detecta conflicto o error, y la red de saliencia cambia el sistema desde una reacción automática hacia control deliberado. Esta red es clave cuando la persona debe inhibir una respuesta impulsiva, proteger reputación o actuar según una norma aunque exista presión emocional.",
  "moral-ethics": "vmPFC integra daño, valor afectivo y significado interpersonal; DLPFC sostiene principios, reglas y consecuencias; el cíngulo anterior detecta conflicto entre opciones; la amígdala aporta sensibilidad ante daño o amenaza; y la red por defecto permite simular intención, responsabilidad y contexto. El juicio moral surge de esa negociación entre emoción, norma, intención y deliberación.",
  "self-representation": "La red por defecto organiza autobiografía y continuidad del yo, vmPFC valora lo que resulta importante para la identidad, el hipocampo enlaza recuerdos personales con contexto, y la ínsula aporta sensación corporal de agencia o estado interno. La representación del self no es una fotografía fija, sino una construcción dinámica entre memoria, cuerpo, valor personal y comparación social.",
  "action-imitation": "La corteza premotora prepara mapas de acción al observar gestos, el parietal traduce postura y cuerpo ajeno en coordenadas propias, el cerebelo ajusta predicción temporal y error, y TPJ/atención ventral ayuda a detectar cuándo la acción del otro exige imitar, coordinarse o inhibirse. La imitación social funciona como percepción orientada a la acción, no como copia automática.",
  "reward-bonding": "Los circuitos tálamo-estriatales aprenden qué señales sociales son recompensantes, vmPFC integra preferencia, apego y valor personal, la amígdala marca relevancia afectiva del vínculo, y el hipocampo conserva episodios que hacen confiable o significativo a alguien. Así, aprobación, cercanía o pertenencia pueden adquirir peso motivacional comparable a recompensas materiales.",
  "attachment-bond": "En el apego, vmPFC da valor de seguridad a la persona cercana, el estriado refuerza acercamiento y cuidado, la amígdala ajusta amenaza ante separación o reunión, la ínsula registra calma o malestar corporal, y el hipocampo conserva la historia del vínculo. Esta red explica por qué una relación cercana puede regular estrés, conducta exploratoria y búsqueda de apoyo.",
  "social-threat-stress": "La amígdala detecta amenaza interpersonal o evaluativa, la ínsula traduce esa amenaza en sensación corporal, el cíngulo anterior monitorea conflicto y preparación de respuesta, la red de saliencia prioriza el evento, DLPFC intenta sostener control, y vmPFC puede modular el significado de la situación. La amenaza social funciona como un problema de reputación, cuerpo y predicción a la vez.",
  "loneliness-isolation": "La soledad percibida recluta la red por defecto para interpretar el lugar del yo en el mundo social, la amígdala aumenta sensibilidad a señales ambiguas, la ínsula y la saliencia amplifican malestar corporal, vmPFC evalúa pertenencia o valor personal, y el cíngulo anterior registra dolor social. La red puede sesgar la predicción hacia rechazo incluso cuando la señal externa es incierta.",
  "support-health": "El apoyo social modula la red desde arriba y desde el cuerpo: vmPFC reinterpreta seguridad y significado, DLPFC sostiene estrategias de regulación, cíngulo e ínsula monitorean malestar, la red de saliencia reduce prioridad de amenaza, y la amígdala puede disminuir respuesta defensiva. Por eso una señal de apoyo puede cambiar dolor, estrés y recuperación emocional.",
  "culture-social-cognition": "La cultura actúa como contexto que cambia qué señales pesan más. La red por defecto organiza self y pertenencia, vmPFC valora normas y significados compartidos, TPJ/atención ventral orienta hacia claves sociales relevantes, el hipocampo aporta aprendizaje contextual, el fusiforme participa en reconocimiento de personas significativas, y DLPFC sostiene reglas culturales explícitas.",
  "social-norms-conformity": "El cíngulo anterior detecta discrepancia entre la respuesta propia y la norma grupal, DLPFC mantiene la regla o inhibe la desviación, vmPFC calcula costo reputacional y valor de pertenecer, el estriado aprende aprobación o desaprobación social, y TPJ/atención ventral actualiza lo que otros esperan. La conformidad surge cuando error social, recompensa y control apuntan en la misma dirección.",
  "altruism-prosocial": "vmPFC estima valor de ayudar, el estriado puede convertir la conducta prosocial en recompensa, la ínsula registra resonancia afectiva, el cíngulo anterior aporta esfuerzo o costo, TPJ/atención ventral permite considerar la necesidad de otro, y la red por defecto contextualiza vínculo, historia y significado moral. La ayuda aparece por rutas distintas: empatía, norma, reputación o cuidado.",
  "first-impressions": "El fusiforme estabiliza rasgos faciales en pocos cientos de milisegundos, la amígdala estima relevancia emocional o posible amenaza, TPJ/atención ventral dirige atención a mirada y señales inesperadas, vmPFC asigna valor social inicial, y la corteza visual sostiene el análisis de forma y contraste. La primera impresión es rápida porque combina percepción y valoración antes de una deliberación completa.",
  "joint-attention-gaze": "La red opera como una cadena de orientación social. La corteza visual extrae dirección de ojos, cabeza y cuerpo; el fusiforme estabiliza identidad y configuración facial; la red temporoparietal/atención ventral detecta que la mirada de otro cambia la prioridad del entorno; la corteza parietal transforma esa señal en orientación espacial hacia el objeto compartido; y la amígdala ajusta la relevancia afectiva cuando la mirada indica amenaza, interés o afiliación.",
  "perspective-taking": "TPJ/atención ventral ayuda a desplazar la atención desde la posición propia hacia la del otro, la red por defecto simula la escena desde una narrativa alternativa, el parietal transforma coordenadas espaciales y corporales, DLPFC inhibe el punto de vista propio cuando interfiere, y vmPFC integra cercanía, valor y relevancia interpersonal. Tomar perspectiva exige cambiar de marco, no solo imaginar.",
  "agency-intention": "La corteza premotora representa la acción posible, el parietal compara cuerpo propio y acción observada, la red por defecto permite inferir intención, vmPFC evalúa significado y responsabilidad, el cíngulo anterior detecta conflicto entre accidente y propósito, y DLPFC sostiene la regla del juicio. La agencia social aparece cuando una acción se interpreta como propia, ajena, accidental o deliberada.",
  "empathy-compassion": "La ínsula representa el componente corporal del estado ajeno, el cíngulo anterior aporta dolor, conflicto y motivación para responder, TPJ/parietal ayuda a distinguir yo/otro y tomar perspectiva, vmPFC integra valor social y decisión de ayuda, y la red por defecto aporta contexto autobiográfico y significado interpersonal.",
  "social-anger": "La rabia social combina detección de amenaza o daño en la amígdala, malestar corporal en la ínsula, conflicto y preparación de respuesta en el cíngulo anterior, y priorización del evento en la red de saliencia. DLPFC y vmPFC permiten regular la reacción, reinterpretar intención y decidir si confrontar, inhibir o reparar según la norma social.",
  "shame-social": "La vergüenza emerge cuando la red por defecto representa el yo bajo la mirada de otros, vmPFC asigna valor personal y reputacional al error, la ínsula aporta malestar corporal, el cíngulo anterior detecta conflicto o necesidad de ajuste, y DLPFC ayuda a regular la conducta posterior. Es una emoción social porque depende de evaluación pública, norma y self.",
  "theory-of-mind": "La red por defecto sostiene simulación narrativa e inferencia de estados internos; TPJ/atención ventral actualiza lo que otra persona sabe o cree; vmPFC integra significado social y valor personal; hipocampo aporta contexto episódico; y parietal contribuye a separar perspectivas espaciales y mentales.",
  "pragmatic-language": "La corteza auditiva analiza tono y ritmo de la voz; regiones temporoparietales vinculan la frase con intención comunicativa; la red por defecto permite inferir creencias e ironía; DLPFC mantiene contexto y regla conversacional; e ínsula aporta saliencia afectiva cuando el tono cambia el significado social.",
  "deception-trust-violation": "DLPFC sostiene la estrategia y el control necesarios para mentir o detectar inconsistencias, vmPFC actualiza valor de confianza, el cíngulo anterior registra conflicto y sospecha, la amígdala responde a traición o amenaza interpersonal, el hipocampo recupera antecedentes de la persona, y el estriado ajusta expectativas de recompensa o pérdida social.",
  "ingroup-outgroup": "El fusiforme procesa identidad visible, la amígdala puede aumentar alerta ante diferencia o amenaza aprendida, vmPFC asigna valor y cercanía al grupo, la red por defecto integra identidad social, el cíngulo anterior detecta conflicto entre norma e impulso, y el estriado refuerza pertenencia o cooperación selectiva. La pertenencia grupal cambia percepción, memoria y valor.",
  "prejudice-stigma": "La amígdala y la saliencia priorizan señales socialmente cargadas, el fusiforme organiza categorización visual, el cíngulo anterior detecta conflicto cuando una respuesta automática choca con una norma, DLPFC permite regular sesgos, y vmPFC reevalúa significado personal o moral. El prejuicio se entiende mejor como interacción entre aprendizaje cultural, emoción y control.",
  "guilt-repair": "La culpa combina vmPFC para valorar daño, responsabilidad y norma; cíngulo anterior para detectar conflicto y necesidad de ajuste; ínsula para el malestar corporal; red por defecto para reconstruir el self en la historia social; hipocampo para recordar el episodio; y DLPFC para sostener la decisión de reparar. Su foco principal es la acción: qué hice, a quién dañé y cómo puedo responder.",
  "social-pride": "El orgullo integra vmPFC para asignar valor personal al logro, circuitos tálamo-estriatales para recompensa social, red por defecto para autoestima e identidad narrativa, hipocampo para situar el logro en una historia personal, y cíngulo anterior para monitorear esfuerzo o comparación. El orgullo social aparece cuando el logro adquiere reconocimiento, estatus o significado ante otros.",
  "social-repair": "La reparación social usa vmPFC para valorar el daño y la relación, DLPFC para sostener una respuesta regulada, cíngulo anterior para monitorear conflicto y costo, ínsula para el malestar asociado a culpa o vergüenza, hipocampo para recuperar la historia del vínculo, y red por defecto para reconstruir la narrativa interpersonal. Su función es transformar emoción social en una acción de restauración.",
  "moral-indignation": "La indignación moral combina ínsula y cíngulo anterior para registrar aversión ante injusticia, amígdala para responder ante daño o amenaza social, DLPFC para sostener la norma vulnerada, vmPFC para valorar daño e intención, y red de saliencia para priorizar la violación. A diferencia de la rabia general, aquí la emoción se organiza alrededor de una regla social o daño injusto.",
  "envy-social-comparison": "vmPFC calcula valor relativo del self, el estriado responde a logro propio o ajeno según contexto, la red por defecto sostiene autoestima e identidad narrativa, el cíngulo anterior detecta discrepancia o frustración, y la ínsula aporta malestar asociado a inequidad. La comparación social convierte la recompensa en algo relacional, no absoluto.",
  "forgiveness-reconciliation": "vmPFC reevalúa intención, daño y posibilidad de restaurar valor social; DLPFC sostiene control sobre impulso de castigo; el cíngulo anterior registra conflicto entre reparación y defensa; la amígdala mantiene memoria afectiva de la ofensa; el hipocampo aporta detalles del episodio; y la red por defecto permite reconstruir la historia de la relación.",
  "reputation-impression": "El fusiforme identifica a la persona, el hipocampo conserva acciones previas asociadas a ese rostro, vmPFC estima valor social y confiabilidad, la red por defecto integra rasgos en una impresión narrativa, y el estriado aprende qué personas predicen cooperación o beneficio. La reputación funciona como memoria social con consecuencias para decisiones futuras.",
  "fairness-punishment": "La ínsula registra aversión ante inequidad, el cíngulo anterior detecta conflicto y costo de responder, DLPFC sostiene la norma y permite castigo deliberado, vmPFC pondera daño, intención y valor social, y el estriado participa cuando castigar o restaurar justicia adquiere valor motivacional. La justicia combina malestar, norma y decisión.",
  "social-uncertainty": "DLPFC mantiene hipótesis alternativas, el cíngulo anterior señala conflicto o error predictivo, la red de saliencia prioriza información nueva, vmPFC actualiza valor social, el hipocampo compara con episodios previos, y la amígdala amplifica vigilancia cuando la ambigüedad puede implicar amenaza. La incertidumbre social obliga a revisar interpretaciones en tiempo real.",
  "interpersonal-synchrony": "El cerebelo ajusta timing y predicción, la corteza premotora prepara acciones coordinadas, parietal integra cuerpo propio y ajeno, corteza auditiva sigue ritmo y turnos, y circuitos tálamo-estriatales refuerzan la coordinación cuando aumenta afiliación o recompensa social.",
  "affective-mentalizing": "La red por defecto permite imaginar el mundo interno de otra persona, la ínsula aporta resonancia corporal, la amígdala detecta emoción o vulnerabilidad, TPJ/atención ventral separa perspectiva propia y ajena, vmPFC interpreta significado interpersonal, y el cíngulo anterior añade motivación para ajustar la respuesta. Es una lectura emocional de la mente, no solo una inferencia fría.",
  "dominance-hierarchy": "La amígdala detecta señales de amenaza, poder o sumisión; el estriado aprende qué posiciones jerárquicas predicen recompensa o pérdida; vmPFC valora conveniencia de acercarse, competir o evitar; el cíngulo anterior monitorea conflicto; y el hipocampo conserva la historia de alianzas y rango. La jerarquía se aprende como mapa social dinámico.",
  "trust-cooperation": "vmPFC estima valor esperado de confiar, el estriado aprende reciprocidad y recompensa social, el hipocampo recuerda reputación previa, DLPFC inhibe decisiones impulsivas o egoístas, y el fusiforme mantiene identidad de la contraparte. La cooperación emerge cuando valor, memoria y control permiten apostar por una relación futura.",
  "social-learning-memory": "El hipocampo une rostro, contexto, emoción y episodio; la red por defecto integra esa experiencia en una narrativa social; el estriado aprende consecuencias de cooperación o traición; y el fusiforme ayuda a reconocer de nuevo a la persona relevante. La memoria social prioriza información que permite predecir futuras interacciones.",
  "rejection-exclusion": "El cíngulo anterior y la ínsula registran dolor social y malestar corporal, la amígdala aumenta vigilancia ante señales de desaprobación, la red de saliencia prioriza el evento, y DLPFC puede regular la respuesta posterior. La exclusión cambia atención, emoción y conducta porque amenaza pertenencia y valor social.",
  "communication-health": "La corteza auditiva extrae prosodia y tono, la ínsula y el cíngulo anterior registran impacto corporal y afectivo, DLPFC sostiene regulación ante mensajes difíciles, y la red de saliencia decide si la señal comunica apoyo, amenaza o crítica. La comunicación social influye en salud porque las palabras y la voz pueden regular o activar estrés."
};

const themeNetworkDescriptionsEn = {
  "self-mentalizing": "In this network, the default mode network builds an internal scene with memories, goals and self-narrative; vmPFC gives it personal meaning and social value; hippocampus contributes concrete episodes from previous interactions; and TPJ/ventral attention helps separate what I know from what another person may know or believe. Mentalizing appears when memory, self and perspective work together to imagine another mind.",
  "person-perception": "Person perception starts with visual and auditory analysis, but becomes social when fusiform cortex stabilizes facial identity, auditory cortex extracts prosody and voice, visual cortex organizes features and movement, amygdala evaluates emotional relevance, and TPJ/ventral attention orients toward gaze, gestures or unexpected change.",
  "emotion-empathy": "Insula turns bodily signals into subjective feeling, amygdala detects threat or affective value, anterior cingulate registers conflict, discomfort or need for adjustment, and the salience network decides which emotional signal deserves priority. This network explains how a social cue is felt in the body before it becomes a decision or conscious interpretation.",
  "regulation-control": "DLPFC keeps the social rule active, vmPFC weighs value, consequence and personal meaning, anterior cingulate detects conflict or error, and the salience network shifts the system from automatic reaction toward deliberate control. This matters when a person must inhibit an impulse, protect reputation or act according to a norm under emotional pressure.",
  "moral-ethics": "vmPFC integrates harm, affective value and interpersonal meaning; DLPFC holds principles, rules and consequences; anterior cingulate detects conflict between options; amygdala adds sensitivity to harm or threat; and the default mode network simulates intention, responsibility and context. Moral judgment is a negotiation between emotion, norm, intention and deliberation.",
  "self-representation": "The default mode network organizes autobiography and continuity of the self, vmPFC values what matters for identity, hippocampus links personal memories with context, and insula adds bodily agency or internal state. Self-representation is a dynamic construction between memory, body, personal value and social comparison.",
  "action-imitation": "Premotor cortex prepares action maps while observing gestures, parietal cortex translates another body into one's own coordinates, cerebellum tunes temporal prediction and error, and TPJ/ventral attention helps decide when another person's action should be imitated, coordinated with or inhibited.",
  "reward-bonding": "Thalamo-striatal circuits learn which social cues are rewarding, vmPFC integrates preference, attachment and personal value, amygdala marks affective relevance of the bond, and hippocampus stores episodes that make another person reliable or meaningful. Approval, closeness and belonging can gain motivational weight similar to material rewards.",
  "attachment-bond": "In attachment, vmPFC gives a close person safety value, striatal circuits reinforce approach and care, amygdala adjusts threat during separation or reunion, insula registers calm or bodily distress, and hippocampus stores the history of the bond. A close relationship can regulate stress, exploration and support seeking.",
  "social-threat-stress": "Amygdala detects interpersonal or evaluative threat, insula turns that threat into bodily feeling, anterior cingulate monitors conflict and response preparation, the salience network prioritizes the event, DLPFC tries to maintain control, and vmPFC can reshape the meaning of the situation.",
  "loneliness-isolation": "Perceived loneliness recruits the default mode network to interpret the self's place in the social world, amygdala increases sensitivity to ambiguous cues, insula and salience amplify bodily discomfort, vmPFC evaluates belonging or personal value, and anterior cingulate registers social pain.",
  "support-health": "Social support modulates the network from meaning and body at the same time: vmPFC reinterprets safety, DLPFC maintains regulation strategies, cingulate and insula monitor distress, the salience network reduces threat priority, and amygdala can lower defensive response.",
  "culture-social-cognition": "Culture acts as context that changes which social cues matter most. The default mode network organizes self and belonging, vmPFC values shared norms and meanings, TPJ/ventral attention orients toward relevant social cues, hippocampus adds contextual learning, fusiform cortex supports recognition of significant people, and DLPFC holds explicit cultural rules.",
  "social-norms-conformity": "Anterior cingulate detects mismatch between one's answer and the group norm, DLPFC holds the rule or inhibits deviation, vmPFC computes reputational cost and belonging value, striatal circuits learn social approval or disapproval, and TPJ/ventral attention updates what others expect.",
  "altruism-prosocial": "vmPFC estimates the value of helping, striatal circuits can turn prosocial action into reward, insula registers affective resonance, anterior cingulate adds effort or cost, TPJ/ventral attention represents another person's need, and the default mode network contextualizes bond, history and moral meaning.",
  "first-impressions": "Fusiform cortex stabilizes facial features within a very short window, amygdala estimates emotional relevance or possible threat, TPJ/ventral attention directs attention to gaze and unexpected cues, vmPFC assigns initial social value, and visual cortex supports form and contrast analysis.",
  "joint-attention-gaze": "The network works as a social-orienting chain. Visual cortex extracts eye, head and body direction; fusiform cortex stabilizes facial identity and configuration; temporoparietal/ventral attention regions detect that another person's gaze changes environmental priority; parietal cortex turns that cue into spatial orienting toward the shared object; and amygdala adjusts affective relevance when gaze signals threat, interest or affiliation.",
  "perspective-taking": "TPJ/ventral attention helps shift attention from one's own position to another person's, the default mode network simulates the scene from an alternative narrative, parietal cortex transforms spatial and bodily coordinates, DLPFC inhibits one's own point of view when it interferes, and vmPFC integrates closeness, value and interpersonal relevance.",
  "agency-intention": "Premotor cortex represents possible action, parietal cortex compares one's own body with observed action, the default mode network supports intention inference, vmPFC evaluates meaning and responsibility, anterior cingulate detects conflict between accident and purpose, and DLPFC maintains the rule used for judgment.",
  "empathy-compassion": "Insula represents the bodily component of another person's state, anterior cingulate contributes pain, conflict and response motivation, TPJ/parietal regions separate self from other and support perspective, vmPFC integrates social value and helping choice, and the default mode network adds autobiographical context and interpersonal meaning.",
  "social-anger": "Social anger combines threat or harm detection in amygdala, bodily distress in insula, conflict and response preparation in anterior cingulate, and event prioritization in the salience network. DLPFC and vmPFC help regulate the reaction, reinterpret intention and decide whether to confront, inhibit or repair according to the social norm.",
  "shame-social": "Shame emerges when the default mode network represents the self under others' gaze, vmPFC assigns personal and reputational value to the error, insula adds bodily discomfort, anterior cingulate detects conflict or need for adjustment, and DLPFC helps regulate later behavior.",
  "theory-of-mind": "The default mode network supports narrative simulation and internal-state inference; TPJ/ventral attention updates what another person knows or believes; vmPFC integrates social meaning and personal value; hippocampus adds episodic context; and parietal cortex helps separate spatial and mental perspectives.",
  "pragmatic-language": "Auditory cortex analyzes tone and voice rhythm; temporoparietal regions link the utterance to communicative intention; the default mode network supports belief and irony inference; DLPFC maintains conversational context and rules; and insula adds affective salience when tone changes social meaning.",
  "deception-trust-violation": "DLPFC maintains strategy and control needed to lie or detect inconsistency, vmPFC updates trust value, anterior cingulate registers conflict and suspicion, amygdala responds to betrayal or interpersonal threat, hippocampus retrieves the person's history, and striatal circuits adjust reward or loss expectations.",
  "ingroup-outgroup": "Fusiform cortex processes visible identity, amygdala can increase alertness to learned difference or threat, vmPFC assigns value and closeness to the group, the default mode network integrates social identity, anterior cingulate detects conflict between norm and impulse, and striatal circuits reinforce belonging or selective cooperation.",
  "prejudice-stigma": "Amygdala and salience networks prioritize socially loaded cues, fusiform cortex organizes visual categorization, anterior cingulate detects conflict when an automatic response clashes with a norm, DLPFC supports bias regulation, and vmPFC reevaluates personal or moral meaning.",
  "guilt-repair": "Guilt combines vmPFC for harm, responsibility and norm value; anterior cingulate for conflict and need for adjustment; insula for bodily discomfort; the default mode network for reconstructing the self within the social story; hippocampus for episode memory; and DLPFC for maintaining the decision to repair.",
  "social-pride": "Pride integrates vmPFC for the personal value of achievement, thalamo-striatal circuits for social reward, the default mode network for self-esteem and narrative identity, hippocampus for placing the achievement in a personal story, and anterior cingulate for effort or comparison monitoring.",
  "social-repair": "Social repair uses vmPFC to value harm and relationship meaning, DLPFC to maintain a regulated response, anterior cingulate to monitor conflict and cost, insula for guilt- or shame-related discomfort, hippocampus to retrieve bond history, and the default mode network to rebuild the interpersonal narrative.",
  "moral-indignation": "Moral indignation combines insula and anterior cingulate to register aversion to injustice, amygdala to respond to harm or social threat, DLPFC to maintain the violated norm, vmPFC to evaluate harm and intention, and the salience network to prioritize the violation.",
  "envy-social-comparison": "vmPFC computes relative self-value, striatal circuits respond to one's own or another person's success depending on context, the default mode network supports self-esteem and narrative identity, anterior cingulate detects discrepancy or frustration, and insula adds distress linked to inequity.",
  "forgiveness-reconciliation": "vmPFC reevaluates intention, harm and the possibility of restoring social value; DLPFC controls the impulse to punish; anterior cingulate registers conflict between repair and defense; amygdala preserves affective memory of the offense; hippocampus adds episode details; and the default mode network reconstructs the relationship story.",
  "reputation-impression": "Fusiform cortex identifies the person, hippocampus stores previous actions associated with that face, vmPFC estimates social value and trustworthiness, the default mode network integrates traits into a narrative impression, and striatal circuits learn which people predict cooperation or benefit.",
  "fairness-punishment": "Insula registers aversion to inequity, anterior cingulate detects conflict and response cost, DLPFC maintains the norm and supports deliberate punishment, vmPFC weighs harm, intention and social value, and striatal circuits participate when punishment or restored justice becomes motivationally valuable.",
  "social-uncertainty": "DLPFC maintains alternative hypotheses, anterior cingulate signals conflict or prediction error, the salience network prioritizes new information, vmPFC updates social value, hippocampus compares the situation with previous episodes, and amygdala increases vigilance when ambiguity may imply threat.",
  "interpersonal-synchrony": "Cerebellum tunes timing and prediction, premotor cortex prepares coordinated actions, parietal cortex integrates self and other bodies, auditory cortex tracks rhythm and turn-taking, and thalamo-striatal circuits reinforce coordination when affiliation or social reward increases.",
  "affective-mentalizing": "The default mode network imagines another person's internal world, insula adds bodily resonance, amygdala detects emotion or vulnerability, TPJ/ventral attention separates self and other perspective, vmPFC interprets interpersonal meaning, and anterior cingulate adds motivation to adjust the response.",
  "dominance-hierarchy": "Amygdala detects signals of threat, power or submission; striatal circuits learn which hierarchical positions predict reward or loss; vmPFC values whether to approach, compete or avoid; anterior cingulate monitors conflict; and hippocampus stores the history of alliances and rank.",
  "trust-cooperation": "vmPFC estimates the expected value of trust, striatal circuits learn reciprocity and social reward, hippocampus remembers prior reputation, DLPFC inhibits impulsive or selfish choices, and fusiform cortex maintains the identity of the partner.",
  "social-learning-memory": "Hippocampus binds face, context, emotion and episode; the default mode network integrates that experience into a social narrative; striatal circuits learn consequences of cooperation or cheating; and fusiform cortex helps recognize the relevant person again.",
  "rejection-exclusion": "Anterior cingulate and insula register social pain and bodily distress, amygdala increases vigilance to disapproval cues, the salience network prioritizes the event, and DLPFC can regulate the later response. Exclusion changes attention, emotion and behavior because it threatens belonging and social value.",
  "communication-health": "Auditory cortex extracts prosody and tone, insula and anterior cingulate register bodily and affective impact, DLPFC supports regulation during difficult messages, and the salience network decides whether the signal communicates support, threat or criticism."
};

const regionNetworkRoleEs = {
  dlpfc: "mantiene metas, reglas y control cuando la respuesta social no puede ser automática",
  premotor: "prepara gestos, acciones observadas e imitación posible",
  auditory: "analiza voz, ritmo, prosodia y cambios acústicos socialmente relevantes",
  dmn: "aporta narrativa personal, simulación mental y contexto autobiográfico",
  visual: "extrae rasgos visuales básicos necesarios para leer caras, cuerpos y escenas",
  hippocampus: "vincula personas, lugares, emociones y episodios previos",
  insula: "traduce señales corporales en experiencia afectiva y saliencia subjetiva",
  parietal: "integra espacio, cuerpo y perspectiva para orientar atención o acción",
  amygdala: "detecta relevancia emocional, amenaza, ambigüedad o valor afectivo",
  cerebellum: "ajusta timing, predicción y coordinación fina entre acciones",
  salience: "prioriza eventos importantes y ayuda a cambiar entre introspección, control y respuesta",
  ventralAttention: "reorienta la atención hacia señales inesperadas, mirada, voz o intención ajena",
  vmPfc: "integra valor social, significado personal, recompensa y regulación afectiva",
  acc: "monitorea conflicto, error, esfuerzo, dolor social y necesidad de ajuste",
  thalamostriatal: "aprende recompensa social, hábitos, motivación y selección de acciones",
  fusiformFace: "estabiliza identidad facial, configuración del rostro e impresión visual inicial"
};

const regionNetworkRoleEn = {
  dlpfc: "maintains goals, rules and control when a social response cannot stay automatic",
  premotor: "prepares gestures, observed actions and possible imitation",
  auditory: "analyzes voice, rhythm, prosody and socially relevant acoustic change",
  dmn: "adds personal narrative, mental simulation and autobiographical context",
  visual: "extracts basic visual features needed to read faces, bodies and scenes",
  hippocampus: "links people, places, emotions and previous episodes",
  insula: "turns bodily signals into affective experience and subjective salience",
  parietal: "integrates space, body and perspective to orient attention or action",
  amygdala: "detects emotional relevance, threat, ambiguity or affective value",
  cerebellum: "tunes timing, prediction and fine coordination between actions",
  salience: "prioritizes important events and helps switch between introspection, control and response",
  ventralAttention: "reorients attention toward unexpected cues, gaze, voice or another person's intention",
  vmPfc: "integrates social value, personal meaning, reward and affect regulation",
  acc: "monitors conflict, error, effort, social pain and need for adjustment",
  thalamostriatal: "learns social reward, habits, motivation and action selection",
  fusiformFace: "stabilizes facial identity, face configuration and initial visual impression"
};

function buildThemeNetworkDescription(section) {
  const custom = currentLang === "en" ? themeNetworkDescriptionsEn[section.id] : themeNetworkDescriptionsEs[section.id];
  if (custom) return custom;

  const items = section.regions
    .map((id) => regions.find((region) => region.id === id))
    .filter(Boolean)
    .slice(0, 6)
    .map((region) => {
      const copy = getRegionCopy(region);
      const role = currentLang === "en" ? regionNetworkRoleEn[region.id] : regionNetworkRoleEs[region.id];
      if (role) return currentLang === "en" ? `${copy.name} ${role}` : `${copy.name} ${role}`;
      return currentLang === "en"
        ? `${copy.name} contributes ${copy.functions.toLowerCase()}`
        : `${copy.name} aporta ${copy.functions.toLowerCase()}`;
    });

  if (currentLang === "en") {
    const title = (themeTextEn[section.id]?.title ?? section.title).toLowerCase();
    return `This network can be read as a coordinated route for ${title}: ${items.join("; ")}. The important idea is that the function is not stored in one place; it appears when perception, emotion, memory, valuation and control are combined according to the social context.`;
  }
  return `Esta red puede leerse como una ruta coordinada para ${section.title.toLowerCase()}: ${items.join("; ")}. Lo importante es que la función no está guardada en una sola zona; aparece cuando percepción, emoción, memoria, valoración y control se combinan según el contexto social.`;
}

function clearSelectionDisplay(options = {}) {
  const { updateCopy = true } = options;
  selectionMode = "none";
  selectedZoneLabel = null;

  document.querySelectorAll("[data-region]").forEach((button) => button.classList.remove("active"));

  regionMeshes.forEach((mesh, regionId) => {
    const region = regions.find((item) => item.id === regionId);
    mesh.material.opacity = 0.72;
    if (region) mesh.scale.set(...region.scale);
    mesh.material.emissiveIntensity = 0.08;
  });

  allAtlasMeshes.forEach((atlasMesh) => {
    const baseColor = originalAtlasColors.get(atlasMesh.uuid);
    if (baseColor) atlasMesh.material.color.copy(baseColor);
    stabilizeMaterial(atlasMesh, true);
  });

  updateSelectionHalo([], selected.color);
  setMedialCut(medialHemisphere);
  if (updateCopy) {
    const group = socialThemeGroups.find((item) => item.id === activeSocialGroupId);
    if (group) {
      showSocialGroupOverview(group);
    } else {
      showInitialOverviewCopy();
    }
  }
  renderZoneList();
}

function selectTheme(sectionId, options = {}) {
  const { renderTabs = true } = options;
  const section = regionSections.find((item) => item.id === sectionId);
  if (!section) return;

  selectionMode = "theme";
  selectedZoneLabel = null;
  activeThemeId = section.id;
  activeSocialGroupId = socialGroupForTheme(section.id)?.id ?? activeSocialGroupId;
  if (renderTabs) renderThemeTabs(section.id);

  const themeCopy = currentLang === "en" ? (themeTextEn[section.id] ?? section) : section;
  title.textContent = themeCopy.title;
  summary.textContent = buildThemeLead(section, themeCopy);
  locationEl.textContent = currentLang === "en" ? "Distributed social network." : "Red social distribuida.";
  functionsEl.textContent = themeCopy.hint;
  networkEl.textContent = section.regions
    .map((id) => getRegionCopy(regions.find((region) => region.id === id) ?? regions[0]).name)
    .join(", ");
  labelEl.textContent = currentLang === "en"
    ? `${section.regions.length} associated atlas systems.`
    : `${section.regions.length} sistemas del atlas asociados.`;
  const themeDeep = getThemeDeepExtra(section, themeCopy);
  experimentTitle.textContent = themeDeep.question
    ? (currentLang === "en" ? "Reflection question" : "Pregunta de reflexión")
    : themeCopy.title;
  experimentCopy.textContent = themeDeep.question ?? buildTeachingNarrative(themeCopy);

  socialTitleEl.textContent = themeCopy.title;
  socialSummaryEl.textContent = buildThemeNetworkDescription(section);
  socialConceptsEl.textContent = section.regions
    .map((id) => getRegionCopy(regions.find((region) => region.id === id) ?? regions[0]).name)
    .join(" · ");
  if (socialExampleEl) socialExampleEl.textContent = themeCopy.guide ?? "";
  showLiteralQuote(quoteKeyForTheme(section.id), {
    label: themeDeep.title,
    importance: themeDeep.copy
  });

  const themeRegionIds = new Set(section.regions);
  const selectedAtlasMeshes = [];
  section.regions.forEach((id) => selectedAtlasMeshes.push(...meshesForRegion(id)));
  const selectedAtlasSet = new Set(selectedAtlasMeshes);

  document.querySelectorAll("[data-region]").forEach((button) => {
    button.classList.toggle("active", themeRegionIds.has(button.dataset.region));
  });

  regionMeshes.forEach((mesh, regionId) => {
    const region = regions.find((item) => item.id === regionId);
    const isThemeRegion = themeRegionIds.has(regionId);
    mesh.material.opacity = isThemeRegion ? 0.95 : 0.18;
    if (region) mesh.scale.set(...region.scale);
    mesh.material.emissiveIntensity = isThemeRegion ? 0.22 : 0.03;
  });

  allAtlasMeshes.forEach((atlasMesh) => {
    const region = regions.find((item) => item.id === atlasMesh.userData.regionId);
    const isThemeMesh = selectedAtlasSet.has(atlasMesh);
    const baseColor = originalAtlasColors.get(atlasMesh.uuid);
    if (baseColor) atlasMesh.material.color.copy(baseColor);
    stabilizeMaterial(atlasMesh, true);
    applyContextMaterial(atlasMesh, isThemeMesh, region?.color ?? null);
  });

  updateSelectionHalo(selectedAtlasMeshes, 0x55c2b7);
  setMedialCut(medialHemisphere);
  renderZoneList();
  resetTask();
  updateURL();
  openSheet();
}

function selectRegion(id, options = {}) {
  const { revealMenu = true } = options;
  selectionMode = "region";
  selected = regions.find((region) => region.id === id) ?? regions[0];
  const selectedCopy = getRegionCopy(selected);
  selectedZoneLabel = null;
  const selectedAtlasMeshes = meshesForRegion(id);
  const selectedLabels = [...new Set(selectedAtlasMeshes.map((mesh) => mesh.userData.cerebraLabel?.displayName).filter(Boolean) ?? [])];
  title.textContent = selectedCopy.name;
  summary.textContent = selectedCopy.summary;
  locationEl.textContent = selectedCopy.location;
  functionsEl.textContent = selectedCopy.functions;
  networkEl.textContent = selectedCopy.network;
  labelEl.textContent = selectedLabels.length
    ? selectedLabels.join(", ")
    : uiText[currentLang].approximation;
  const profile = socialFunctionProfiles[id];
  experimentTitle.textContent = profile?.title ?? selectedCopy.functions;
  experimentCopy.textContent = profile?.summary ?? selectedCopy.summary;
  updateSocialContent(id);
  updateDeepDive(id);

  document.querySelectorAll("[data-region]").forEach((button) => {
    button.classList.toggle("active", button.dataset.region === id);
  });
  if (revealMenu) revealRegionInMenu(id);

  const relatedRegionIds = new Set(
    regionSections
      .filter((s) => s.regions.includes(id))
      .flatMap((s) => s.regions)
      .filter((rid) => rid !== id)
  );

  regionMeshes.forEach((mesh, regionId) => {
    if (regionId === id) {
      mesh.material.opacity = 1;
    } else if (relatedRegionIds.has(regionId)) {
      mesh.material.opacity = 0.56;
      mesh.material.emissiveIntensity = 0.10;
    } else {
      mesh.material.opacity = 0.12;
    }
    mesh.scale.set(...regions.find((region) => region.id === regionId).scale);
  });
  const mesh = regionMeshes.get(id);
  mesh.scale.multiplyScalar(1.18);

  const relatedAtlasMeshes = new Set([...relatedRegionIds].flatMap((rid) => meshesForRegion(rid)));

  atlasMeshes.forEach((meshes, regionId) => {
    meshes.forEach((atlasMesh) => {
      const isSelected = regionId === id;
      const isRelated = !isSelected && relatedRegionIds.has(regionId);
      const baseColor = originalAtlasColors.get(atlasMesh.uuid);
      if (baseColor) atlasMesh.material.color.copy(baseColor);
      stabilizeMaterial(atlasMesh, true);
      applyContextMaterial(atlasMesh, isSelected, selected.color);
      if (isRelated && atlasMesh.material) {
        atlasMesh.material.opacity = 0.38;
        atlasMesh.material.needsUpdate = true;
      }
    });
  });
  const selectedSet = new Set(selectedAtlasMeshes);
  allAtlasMeshes.forEach((atlasMesh) => {
    const isSelected = selectedSet.has(atlasMesh);
    const isRelated = !isSelected && relatedAtlasMeshes.has(atlasMesh);
    const baseColor = originalAtlasColors.get(atlasMesh.uuid);
    if (baseColor) atlasMesh.material.color.copy(baseColor);
    stabilizeMaterial(atlasMesh, true);
    applyContextMaterial(atlasMesh, isSelected, selected.color);
    if (isRelated && atlasMesh.material) {
      atlasMesh.material.opacity = 0.38;
      atlasMesh.material.needsUpdate = true;
    }
  });

  updateSelectionHalo(selectedAtlasMeshes, selected.color);
  setMedialCut(medialHemisphere);
  renderZoneList();
  resetTask();
  updateURL();
  openSheet();
}

function selectZone(label) {
  const zone = cerebraByLabel.get(Number(label));
  if (!zone) return;
  selectionMode = "region";
  selectedZoneLabel = zone.label;

  const mesh = [...atlasMeshes.values()].flat().find((item) => item.userData.cerebraLabel?.label === zone.label);
  const regionId = mesh?.userData.regionId || regions.find((region) => cerebraRegionLabels[region.id]?.includes(zone.label))?.id || selected.id;
  selected = regions.find((region) => region.id === regionId) ?? selected;
  const selectedCopy = getRegionCopy(selected);

  title.textContent = zoneLabelText(zone);
  summary.textContent = zone.notes || `Etiqueta anatómica CerebrA correspondiente a ${zone.name}.`;
  locationEl.textContent = `${groupName(zone.group)}, ${zone.hemisphere === "RH" ? "hemisferio derecho" : "hemisferio izquierdo"}.`;
  functionsEl.textContent = selectedCopy.functions;
  networkEl.textContent = selectedCopy.network;
  labelEl.textContent = `${zone.displayName} ${zone.hemisphere === "RH" ? "derecha" : "izquierda"}. Concordancia atlas: ${Math.round(zone.dice * 100)}%.`;
  const profile = socialFunctionProfiles[regionId];
  experimentTitle.textContent = zoneContentOverrides[zone.displayName]?.[0] ?? profile?.title ?? selectedCopy.functions;
  experimentCopy.textContent = zoneContentOverrides[zone.displayName]?.[1] ?? profile?.summary ?? selectedCopy.summary;
  updateSocialContent(regionId, zone);
  updateDeepDive(regionId, zone);

  atlasMeshes.forEach((meshes) => {
    meshes.forEach((atlasMesh) => {
      const isZone = atlasMesh.userData.cerebraLabel?.label === zone.label;
      const baseColor = originalAtlasColors.get(atlasMesh.uuid);
      if (baseColor) atlasMesh.material.color.copy(baseColor);
      stabilizeMaterial(atlasMesh, true);
      applyContextMaterial(atlasMesh, isZone, selected.color);
    });
  });
  const regionSet = new Set([...atlasMeshes.values()].flat());
  allAtlasMeshes.forEach((atlasMesh) => {
    const isZone = atlasMesh.userData.cerebraLabel?.label === zone.label;
    if (isZone || regionSet.has(atlasMesh)) return;
    const baseColor = originalAtlasColors.get(atlasMesh.uuid);
    if (baseColor) atlasMesh.material.color.copy(baseColor);
    stabilizeMaterial(atlasMesh, true);
    applyContextMaterial(atlasMesh, false);
  });

  regionMeshes.forEach((regionMesh) => {
    regionMesh.material.opacity = 0.25;
  });

  document.querySelectorAll("[data-region]").forEach((button) => {
    button.classList.toggle("active", button.dataset.region === regionId);
  });
  revealRegionInMenu(regionId);

  updateSelectionHalo(mesh ? [mesh] : [], selected.color);
  setMedialCut(medialHemisphere);
  renderZoneList();
  updateURL();
  openSheet();
}

function updateSelectionHalo(meshes, color) {
  selectionHalo.visible = false;
}

zoneSearch.addEventListener("input", renderZoneList);
document.querySelectorAll("[data-side]").forEach((button) => {
  button.addEventListener("click", () => {
    activeSide = button.dataset.side;
    document.querySelectorAll("[data-side]").forEach((item) => item.classList.toggle("active", item === button));
    renderZoneList();
  });
});
document.querySelectorAll("[data-group]").forEach((button) => {
  button.addEventListener("click", () => {
    activeGroup = button.dataset.group;
    document.querySelectorAll("[data-group]").forEach((item) => item.classList.toggle("active", item === button));
    renderZoneList();
  });
});

function focusOn(position) {
  const direction = position.clone().normalize().multiplyScalar(3.35);
  targetCamera = {
    position: position.clone().add(direction).add(new THREE.Vector3(0.15, 0.45, 1.25)),
    target: position.clone()
  };
}

function cameraPose(direction, distanceScale = 1.65) {
  const distance = Math.max(4.5, atlasBounds.radius * distanceScale);
  return {
    position: atlasBounds.center.clone().add(direction.clone().normalize().multiplyScalar(distance)),
    target: atlasBounds.center.clone()
  };
}

function setView(view) {
  alignToAnatomicalAxes();
  resetSelectionVisibility();
  const medialMode = view === "medial-left" ? "LH" : view === "medial-right" ? "RH" : null;
  setMedialCut(medialMode);
  const views = {
    lateral: cameraPose(new THREE.Vector3(1, 0.02, 0)),
    "medial-left": cameraPose(new THREE.Vector3(1, 0.02, 0), 1.42),
    "medial-right": cameraPose(new THREE.Vector3(-1, 0.02, 0), 1.42),
    center: cameraPose(new THREE.Vector3(0, 0.02, 1), 1.58),
    reset: cameraPose(new THREE.Vector3(0, 0.02, 1), 1.58)
  };
  targetCamera = views[view];
  viewLockedUntil = performance.now() + 3500;
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

function updateHoverTooltip(event) {
  if (!tooltipEl) return;
  if (!event) {
    tooltipEl.classList.remove("visible");
    return;
  }
  const rect = renderer.domElement.getBoundingClientRect();
  const hoverPointer = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );
  raycaster.setFromCamera(hoverPointer, camera);
  const atlasTargets = [...atlasMeshes.values()].flat();
  const hoverHits = raycaster.intersectObjects([...atlasTargets, ...regionMeshes.values()], false);
  const hit = hoverHits.find((h) => h.object.userData.regionId);
  if (hit) {
    const cerebraLabel = hit.object.userData.cerebraLabel;
    const regionId = hit.object.userData.regionId;
    const region = regions.find((r) => r.id === regionId);
    const name = cerebraLabel ? cerebraLabel.displayName : (region ? getRegionCopy(region).name : "");
    const tag = cerebraLabel
      ? ({ frontal: "Lóbulo frontal", temporal: "Lóbulo temporal", parietal: "Lóbulo parietal", occipital: "Lóbulo occipital", limbic: "Sistema límbico", subcortex: "Subcorteza", cerebellum: "Cerebelo" }[cerebraLabel.group] ?? cerebraLabel.group)
      : (region ? getRegionCopy(region).tag : "");
    tooltipEl.innerHTML = `<strong>${name}</strong>${tag}`;
    const tipX = Math.min(event.clientX + 16, window.innerWidth - 200);
    const tipY = Math.max(event.clientY - 12, 8);
    tooltipEl.style.left = `${tipX}px`;
    tooltipEl.style.top = `${tipY}px`;
    tooltipEl.classList.add("visible");
  } else {
    tooltipEl.classList.remove("visible");
  }
}

renderer.domElement.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  pointerDown = { x: event.clientX, y: event.clientY, time: performance.now() };
  dragState = { x: event.clientX, y: event.clientY, moved: false };
  userInteracting = true;
  targetCamera = null;
  lastInteractionAt = performance.now();
  renderer.domElement.setPointerCapture(event.pointerId);
});

renderer.domElement.addEventListener("pointermove", (event) => {
  if (!dragState) {
    updateHoverTooltip(event);
    return;
  }
  updateHoverTooltip(null);
  const dx = event.clientX - dragState.x;
  const dy = event.clientY - dragState.y;
  if (Math.abs(dx) + Math.abs(dy) > 2) dragState.moved = true;
  modelRotation.yaw += dx * 0.0038;
  modelRotation.pitch += dy * 0.0026;
  modelRotation.pitch = THREE.MathUtils.clamp(modelRotation.pitch, -0.72, 0.72);
  if (importedBrain) {
    applyModelRotation();
  } else {
    brain.rotation.y += dx * 0.0038;
    brain.rotation.x = THREE.MathUtils.clamp(brain.rotation.x + dy * 0.0026, -0.72, 0.72);
  }
  dragState.x = event.clientX;
  dragState.y = event.clientY;
});

renderer.domElement.addEventListener("pointerup", (event) => {
  if (event.button !== 0 || !pointerDown) return;
  const moved = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
  const elapsed = performance.now() - pointerDown.time;
  const wasDrag = dragState?.moved;
  pointerDown = null;
  dragState = null;
  userInteracting = false;
  lastInteractionAt = performance.now();
  if (renderer.domElement.hasPointerCapture(event.pointerId)) {
    renderer.domElement.releasePointerCapture(event.pointerId);
  }
  if (wasDrag || moved > 6 || elapsed > 450) return;

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const atlasTargets = [...atlasMeshes.values()].flat();
  const hits = raycaster.intersectObjects([...atlasTargets, ...regionMeshes.values()], false);
  const regionHit = hits.find((hit) => hit.object.userData.regionId);
  if (regionHit) {
    const cerebraLabel = regionHit.object.userData.cerebraLabel;
    if (cerebraLabel) {
      selectZone(cerebraLabel.label);
    } else {
      selectRegion(regionHit.object.userData.regionId);
    }
  }
});

renderer.domElement.addEventListener("pointerleave", () => updateHoverTooltip(null));

controls.addEventListener("start", () => {
  userInteracting = true;
  targetCamera = null;
  lastInteractionAt = performance.now();
});

controls.addEventListener("end", () => {
  userInteracting = false;
  lastInteractionAt = performance.now();
});

function centerBrain() {
  alignToAnatomicalAxes();
  resetSelectionVisibility();
  setMedialCut(null);
  targetCamera = cameraPose(new THREE.Vector3(0, 0.03, 1), 1.58);
}

function setMedialCut(hemisphere) {
  medialHemisphere = hemisphere;
  medialCutEnabled = Boolean(hemisphere);
  updateMedialClipPlane();
  const clippingPlanes = medialCutEnabled ? [medialClipPlane] : [];
  allAtlasMeshes.forEach((mesh) => {
    applyAtlasMeshVisibility(mesh);
    if (mesh.material) {
      mesh.material.clippingPlanes = clippingPlanes;
      mesh.material.clipShadows = false;
      mesh.material.side = THREE.FrontSide;
      mesh.material.needsUpdate = true;
      syncInternalSurface(mesh);
    }
  });
}

function setProceduralVisibility(visible) {
  proceduralVisible = false;
  brain.visible = false;
  proceduralMeshes.forEach((mesh) => {
    mesh.visible = false;
  });
  regionMeshes.forEach((mesh) => {
    mesh.visible = false;
  });
}

function regionForMeshName(name) {
  const clean = name.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  const cerebraMatch = clean.match(/cerebra_label_(\d+)/);
  if (cerebraMatch) {
    const label = Number(cerebraMatch[1]);
    const match = regions.find((region) => cerebraRegionLabels[region.id]?.includes(label));
    if (match) return match.id;
  }
  return regions.find((region) => atlasAliases[region.id].some((alias) => clean.includes(alias)))?.id;
}

function normalizeImportedModel(root) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const largest = Math.max(size.x, size.y, size.z) || 1;
  root.position.sub(center);
  root.scale.multiplyScalar(3.25 / largest);
  modelRotation.yaw = 0;
  modelRotation.pitch = 0;
  root.rotation.copy(anatomicalRotation);
  controls.target.set(0, 0, 0);
  controls.update();
}

function alignToAnatomicalAxes() {
  modelRotation.yaw = 0;
  modelRotation.pitch = 0;
  if (importedBrain) {
    applyModelRotation();
  } else {
    brain.rotation.set(0, 0, 0);
  }
}

function applyModelRotation() {
  if (!importedBrain) return;
  const yaw = new THREE.Quaternion().setFromAxisAngle(worldUpAxis, modelRotation.yaw);
  const pitch = new THREE.Quaternion().setFromAxisAngle(worldRightAxis, modelRotation.pitch);
  importedBrain.quaternion.copy(yaw).multiply(pitch).multiply(anatomicalQuaternion);
  updateMedialClipPlane();
}

function updateMedialClipPlane() {
  if (!importedBrain || !medialCutEnabled) return;
  const normal = medialLocalAxis.clone().applyQuaternion(importedBrain.quaternion).normalize();
  if (medialHemisphere === "LH") normal.multiplyScalar(-1);
  medialClipPlane.setFromNormalAndCoplanarPoint(normal, atlasBounds.center);
}

function prepareImportedAtlas(root, label) {
  if (importedBrain) {
    scene.remove(importedBrain);
    internalAtlasMeshes.forEach((mesh) => scene.remove(mesh));
  }

  atlasMeshes.clear();
  allAtlasMeshes.length = 0;
  internalAtlasMeshes.length = 0;
  normalizeImportedModel(root);
  importedBrain = root;
  scene.add(importedBrain);
  setProceduralVisibility(false);

  let matched = 0;
  const neutral = new THREE.MeshPhysicalMaterial({
    color: 0xc98778,
    map: tissueMap,
    bumpMap,
    bumpScale: 0.032,
    roughness: 0.74,
    metalness: 0.02,
    clearcoat: 0.26,
    clearcoatRoughness: 0.55,
    sheen: 0.62,
    sheenRoughness: 0.9,
    transparent: false,
    opacity: 1,
    depthWrite: false
  });

  root.traverse((child) => {
    if (!child.isMesh) return;
    if (child.userData.isInternalSurface) return;
    allAtlasMeshes.push(child);
    child.castShadow = true;
    child.frustumCulled = false;
    child.geometry.deleteAttribute?.("normal");
    child.geometry.computeVertexNormals();
    const regionId = regionForMeshName(child.name);
    const region = regions.find((item) => item.id === regionId);
    const labelMatch = child.name.toLowerCase().match(/cerebra_label_(\d+)/);
    const labelId = labelMatch ? Number(labelMatch[1]) : 0;
    const cerebraLabel = cerebraByLabel.get(labelId);
    child.userData.selectionVisible = true;
    child.geometry.computeBoundingBox();
    const localCenter = child.geometry.boundingBox.getCenter(new THREE.Vector3());
    child.userData.anatomicalSide = Math.abs(localCenter.x) < 1.5 ? "midline" : (localCenter.x < 0 ? "left" : "right");
    const material = neutral.clone();
    material.color.setHex(colorForCerebraLabel(labelId, region));
    originalAtlasColors.set(child.uuid, material.color.clone());
    child.userData.cerebraLabel = cerebraLabel;
    if (cerebraLabel) {
      child.name = `CerebrA_${String(labelId).padStart(3, "0")}_${cerebraLabel.hemisphere}_${cerebraLabel.displayName.replace(/\s+/g, "_")}`;
    }
    if (region) {
      matched += 1;
      material.emissive = new THREE.Color(region.color).multiplyScalar(0.04);
      material.opacity = 0.42;
      child.userData.regionId = region.id;
      atlasMeshes.set(region.id, [...(atlasMeshes.get(region.id) ?? []), child]);
    } else {
      child.userData.regionId = "";
    }
    material.envMapIntensity = 0.28;
    material.depthWrite = true;
    material.alphaHash = false;
    material.side = THREE.FrontSide;
    child.material = material;

    const innerMaterial = material.clone();
    innerMaterial.map = internalSliceMap;
    innerMaterial.bumpMap = bumpMap;
    innerMaterial.bumpScale = 0.045;
    innerMaterial.side = THREE.BackSide;
    innerMaterial.color.copy(material.color).lerp(new THREE.Color(0xffc0a6), 0.22);
    innerMaterial.roughness = 0.86;
    innerMaterial.clearcoat = 0.08;
    innerMaterial.depthWrite = true;
    innerMaterial.clippingPlanes = material.clippingPlanes ?? [];

    const innerMesh = new THREE.Mesh(child.geometry, innerMaterial);
    innerMesh.userData.isInternalSurface = true;
    innerMesh.userData.sourceMesh = child;
    innerMesh.userData.cerebraLabel = child.userData.cerebraLabel;
    innerMesh.userData.selectionVisible = child.userData.selectionVisible;
    child.userData.innerMesh = innerMesh;
    child.add(innerMesh);
    internalAtlasMeshes.push(innerMesh);
  });
  setMedialCut(medialHemisphere);

  const box = new THREE.Box3().setFromObject(importedBrain);
  box.getCenter(atlasBounds.center);
  atlasBounds.radius = Math.max(2.8, box.getSize(new THREE.Vector3()).length() * 0.5);
  controls.target.copy(atlasBounds.center);

  modelStatus.textContent = matched
    ? `${label}: ${matched} regiones detectadas`
    : `${label}: modelo cargado sin nombres de atlas`;
  window.__atlasDebug = {
    visibleByHemisphere: () => allAtlasMeshes.reduce((acc, mesh) => {
      const hemi = mesh.userData.cerebraLabel?.hemisphere ?? "NA";
      if (mesh.visible) acc[hemi] = (acc[hemi] ?? 0) + 1;
      return acc;
    }, {}),
    totalMeshes: () => allAtlasMeshes.length
  };
  clearSelectionDisplay();
  centerBrain();
}

function loadAtlasUrl(url, label) {
  const loader = new GLTFLoader();
  modelStatus.textContent = "Cargando atlas CerebrA...";
  setProceduralVisibility(false);
  loader.load(
    url,
    (gltf) => prepareImportedAtlas(gltf.scene, label),
    undefined,
    (error) => {
      console.error("No se pudo cargar el GLB CerebrA", error);
      modelStatus.textContent = "No se pudo cargar CerebrA. Revisa brain_atlas.glb";
      setProceduralVisibility(false);
    }
  );
}

modelInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  loadAtlasUrl(url, file.name);
});

const stimulusEl = document.querySelector("#task-stimulus");
const startTask = document.querySelector("#start-task");
const responseTask = document.querySelector("#response-task");
const hitsEl = document.querySelector("#hits");
const accuracyEl = document.querySelector("#accuracy");
const rtEl = document.querySelector("#rt");

let taskTimer = null;
let trial = 0;
let hits = 0;
let responses = 0;
let currentTarget = false;
let trialStart = 0;
const taskSymbols = ["●", "◆", "■", "▲", "○", "◇"];

function resetTask() {
  clearTimeout(taskTimer);
  trial = 0;
  hits = 0;
  responses = 0;
  currentTarget = false;
  if (!stimulusEl || !hitsEl || !accuracyEl || !rtEl) return;
  stimulusEl.textContent = "+";
  hitsEl.textContent = "0";
  accuracyEl.textContent = "0%";
  rtEl.textContent = "-- ms";
}

function nextTrial() {
  if (!stimulusEl) return;
  trial += 1;
  if (trial > 16) {
    stimulusEl.textContent = "Fin";
    return;
  }

  currentTarget = Math.random() < 0.34;
  const symbol = taskSymbols[Math.floor(Math.random() * taskSymbols.length)];
  stimulusEl.textContent = selected.id === "auditory" ? (currentTarget ? "880" : "440") : symbol;
  stimulusEl.style.background = currentTarget ? "rgba(217, 182, 111, 0.22)" : "rgba(85, 194, 183, 0.14)";
  trialStart = performance.now();

  if (selected.id === "auditory") {
    playTone(currentTarget ? 880 : 440, currentTarget ? 0.2 : 0.12);
  }
  taskTimer = setTimeout(nextTrial, 1050);
}

function playTone(freq, duration) {
  const audio = new AudioContext();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.frequency.value = freq;
  gain.gain.value = 0.05;
  osc.connect(gain).connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + duration);
}

startTask?.addEventListener("click", () => {
  resetTask();
  nextTrial();
});

responseTask?.addEventListener("click", () => {
  if (!trial || !hitsEl || !accuracyEl || !rtEl) return;
  responses += 1;
  if (currentTarget) hits += 1;
  const rt = Math.round(performance.now() - trialStart);
  hitsEl.textContent = String(hits);
  accuracyEl.textContent = `${Math.round((hits / Math.max(responses, 1)) * 100)}%`;
  rtEl.textContent = `${rt} ms`;
});

function animate() {
  requestAnimationFrame(animate);
  const canAutoRotate = !userInteracting && !targetCamera && performance.now() - lastInteractionAt > 1200;
  const viewIsLocked = performance.now() < viewLockedUntil;
  if (canAutoRotate && !viewIsLocked) {
    if (importedBrain) {
      modelRotation.yaw += 0.0011;
      applyModelRotation();
    } else {
      brain.rotation.y += 0.0011;
    }
  }
  regionMeshes.forEach((mesh, id) => {
    if (selectionMode === "region" && id === selected.id) mesh.material.emissiveIntensity = 0.55 + Math.sin(performance.now() * 0.004) * 0.25;
  });
  if (targetCamera && !userInteracting) {
    camera.position.lerp(targetCamera.position, 0.065);
    controls.target.lerp(targetCamera.target, 0.065);
    if (camera.position.distanceTo(targetCamera.position) < 0.03) targetCamera = null;
  }
  updateMedialClipPlane();
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

document.querySelectorAll("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.lang));
});

function updateURL() {
  const params = new URLSearchParams();
  if (currentLang !== "es") params.set("lang", currentLang);
  if (selectionMode === "region" && selected) params.set("region", selected.id);
  else if (selectionMode === "theme" && activeThemeId) params.set("theme", activeThemeId);
  const query = params.toString();
  history.replaceState(null, "", query ? `?${query}` : location.pathname);
}

function restoreFromURL() {
  const params = new URLSearchParams(location.search);
  const lang = params.get("lang");
  if (lang === "en") applyLanguage("en");
  const region = params.get("region");
  if (region && regions.find((r) => r.id === region)) {
    selectRegion(region);
    return;
  }
  const theme = params.get("theme");
  if (theme) selectTheme(theme);
}

const aboutOverlay = document.querySelector("#about-overlay");
const aboutBtn = document.querySelector("#about-btn");
const aboutClose = document.querySelector("#about-close");

function openAbout() {
  if (!aboutOverlay) return;
  aboutOverlay.classList.add("open");
  aboutOverlay.removeAttribute("aria-hidden");
}

function closeAbout() {
  if (!aboutOverlay) return;
  aboutOverlay.classList.remove("open");
  aboutOverlay.setAttribute("aria-hidden", "true");
}

aboutBtn?.addEventListener("click", openAbout);
aboutClose?.addEventListener("click", closeAbout);
aboutOverlay?.addEventListener("click", (e) => {
  if (e.target === aboutOverlay) closeAbout();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && aboutOverlay?.classList.contains("open")) closeAbout();
});

// ── Mobile bottom sheet ─────────────────────────────────
const panelEl = document.querySelector(".panel");
const panelHandle = document.querySelector(".panel-handle");
let sheetIsOpen = false;

function isMobileSheet() {
  return window.matchMedia("(max-width: 940px)").matches;
}

function openSheet() {
  if (!isMobileSheet()) return;
  panelEl?.classList.add("sheet-open");
  sheetIsOpen = true;
}

function closeSheet() {
  panelEl?.classList.remove("sheet-open");
  sheetIsOpen = false;
}

panelHandle?.addEventListener("click", () => {
  if (sheetIsOpen) closeSheet(); else openSheet();
});

let touchStartY = 0;
panelEl?.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

panelEl?.addEventListener("touchend", (e) => {
  if (!isMobileSheet()) return;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (dy > 64 && panelEl.scrollTop <= 2) closeSheet();
}, { passive: true });

window.addEventListener("resize", () => {
  if (!isMobileSheet()) closeSheet();
});

applyLanguage("es");
loadAtlasUrl("./assets/brain_atlas.glb", "brain_atlas.glb");
centerBrain();
animate();
restoreFromURL();


