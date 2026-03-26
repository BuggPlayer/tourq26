import type { DevToolsLocaleId } from "@/lib/dev-tools-locale";
import {
  DEV_TOOL_CATEGORY_BLURB,
  DEV_TOOL_CATEGORY_LABELS,
  type DevToolCategory,
} from "@/lib/umbrella-tools/tools-config";

export type DevToolsMessages = {
  topBar: { devTools: string; siteLinks: string };
  nav: { about: string; privacy: string; terms: string; contact: string };
  languageSelectAria: string;
  sidebar: {
    searchLabel: string;
    searchPlaceholder: string;
    navAria: string;
    allTools: string;
    aboutUtilities: string;
    toolsByCategory: string;
    noMatch: (q: string) => string;
  };
  breadcrumbs: { home: string; devTools: string; about: string; aria: string };
  mobile: { browseTools: string; searchLabel: string; searchPlaceholder: string };
  mobileNav: { aria: string; noMatch: (q: string) => string };
  related: { title: string; subtitle: string };
  hub: {
    badge: string;
    title: string;
    description1: string;
    description2: string;
    description3: string;
    toolsAvailable: (n: number) => string;
    howData: string;
    expandingTitle: string;
    expandingBodyPrefix: string;
    expandingBodySuffix: string;
    contactLink: string;
  };
  toolCard: { featured: string; openTool: string };
  toolHeader: { backToTools: string; aboutRegion: string };
  aboutPage: {
    title: string;
    lead: string;
    p1: string;
    privacyLink: string;
    p2BeforePrivacy: string;
    p2AfterPrivacy: string;
    backLink: string;
  };
  categoryLabels: Record<DevToolCategory, string>;
  categoryBlurbs: Record<DevToolCategory, string>;
};

const en: DevToolsMessages = {
  topBar: {
    devTools: "DevTools",
    siteLinks: "Site links",
  },
  nav: {
    about: "About",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
  },
  languageSelectAria: "Display language",
  sidebar: {
    searchLabel: "Search tools",
    searchPlaceholder: "Search tools…",
    navAria: "Tools by category",
    allTools: "All tools overview",
    aboutUtilities: "About utilities",
    toolsByCategory: "Tool categories",
    noMatch: (q) => `No tools match “${q}”.`,
  },
  breadcrumbs: {
    home: "Home",
    devTools: "Dev tools",
    about: "About",
    aria: "Breadcrumb",
  },
  mobile: {
    browseTools: "Browse tools",
    searchLabel: "Search tools",
    searchPlaceholder: "Search tools…",
  },
  mobileNav: {
    aria: "Tools (mobile)",
    noMatch: (q) =>
      q.trim() ? `No tools match “${q.trim()}”.` : "No tools match that search.",
  },
  related: {
    title: "Related tools",
    subtitle: "Same category first, then other utilities.",
  },
  hub: {
    badge: "Free · Client-side · No signup",
    title: "Free online developer tools",
    description1:
      "Use JSON, Base64, hashing, encodings, QR, network, and text utilities — all processed in your browser. No account required.",
    description2: "Browse by category: Text, URL, HTML, CSS, JSON, CSV, database, crypto, YAML, and more.",
    description3:
      "Includes database URL parsing, random strings, Base32/Base58/Base64, SHA and HMAC, bcrypt, QR codes, and IPv4 CIDR — all free dev tools that run locally.",
    toolsAvailable: (n) => `${n} tool${n === 1 ? "" : "s"} available`,
    howData: "How we handle data →",
    expandingTitle: "Expanding by category",
    expandingBodyPrefix:
      "We're growing HTML, Markdown, JavaScript, XML, YAML, and PHP utilities further. Request a tool via",
    expandingBodySuffix: ".",
    contactLink: "contact",
  },
  toolCard: {
    featured: "Featured",
    openTool: "Open tool",
  },
  toolHeader: {
    backToTools: "All tools",
    aboutRegion: "About this tool",
  },
  aboutPage: {
    title: "About these utilities",
    lead: "Small, focused tools for everyday dev tasks — built to run without sending your input to our servers.",
    p1: "Tools are grouped by category (Text, URL, CSS, JSON, CSV, and more). Today you'll find JSON formatting, JWT inspection, Base64 and URL encoding, SHA hashing, UUID and timestamp helpers, SVG→CSS backgrounds, JSON→CSV, and a CSS box-shadow generator — all designed for quick work without leaving the site.",
    privacyLink: "privacy policy",
    p2BeforePrivacy: "Processing happens in your browser. We do not send your pasted or uploaded content to our servers for these utilities. See the",
    p2AfterPrivacy: "for how we handle data elsewhere on the site.",
    backLink: "← Back to all tools",
  },
  categoryLabels: DEV_TOOL_CATEGORY_LABELS,
  categoryBlurbs: DEV_TOOL_CATEGORY_BLURB,
};

function categoryLabelsAr(): Record<DevToolCategory, string> {
  return {
    text: "أدوات النص",
    url: "أدوات URL",
    html: "أدوات HTML",
    markdown: "أدوات Markdown",
    css: "أدوات CSS",
    javascript: "أدوات JavaScript",
    json: "أدوات JSON",
    xml: "أدوات XML",
    yaml: "أدوات YAML",
    csv: "أدوات CSV",
    php: "أدوات PHP",
    database: "أدوات قواعد البيانات",
    randomizers: "مولّدات عشوائية",
    base32: "أدوات Base32",
    base58: "أدوات Base58",
    base64: "أدوات Base64",
    hash: "مولّدات التجزئة",
    hmac: "أدوات HMAC",
    bcrypt: "أدوات bcrypt",
    qrcode: "رموز QR",
    network: "أدوات الشبكة",
    checksum: "أدوات التحقق",
    pdf: "أدوات PDF",
    pastebin: "لصق نصي",
  };
}

const ar: DevToolsMessages = {
  ...en,
  topBar: { devTools: "أدوات المطور", siteLinks: "روابط الموقع" },
  nav: {
    about: "حول",
    privacy: "الخصوصية",
    terms: "الشروط",
    contact: "اتصل بنا",
  },
  languageSelectAria: "لغة العرض",
  sidebar: {
    searchLabel: "البحث في الأدوات",
    searchPlaceholder: "ابحث في الأدوات…",
    navAria: "الأدوات حسب الفئة",
    allTools: "نظرة عامة على كل الأدوات",
    aboutUtilities: "حول الأدوات",
    toolsByCategory: "فئات الأدوات",
    noMatch: (q) => `لا توجد أدوات تطابق «${q}».`,
  },
  breadcrumbs: {
    home: "الرئيسية",
    devTools: "أدوات المطور",
    about: "حول",
    aria: "مسار التنقل",
  },
  mobile: {
    browseTools: "تصفح الأدوات",
    searchLabel: "البحث في الأدوات",
    searchPlaceholder: "ابحث في الأدوات…",
  },
  mobileNav: {
    aria: "الأدوات (جوال)",
    noMatch: (q) =>
      q.trim() ? `لا توجد أدوات تطابق «${q.trim()}».` : "لا توجد أدوات تطابق هذا البحث.",
  },
  related: {
    title: "أدوات ذات صلة",
    subtitle: "نفس الفئة أولاً، ثم أدوات أخرى.",
  },
  hub: {
    badge: "مجاني · في المتصفح · بدون تسجيل",
    title: "أدوات مطورين مجانية على الإنترنت",
    description1:
      "استخدم JSON وBase64 والتجزئة والترميز ورموز QR والشبكة وأدوات النص — كل المعالجة في متصفحك. لا حاجة لحساب.",
    description2: "تصفح حسب الفئة: نص، URL، HTML، CSS، JSON، CSV، قواعد بيانات، تشفير، YAML، والمزيد.",
    description3:
      "يتضمن تحليل عناوين قواعد البيانات وسلاسل عشوائية وBase32/Base58/Base64 وSHA وHMAC وbcrypt ورموز QR وCIDR لـ IPv4 — كلها أدوات مجانية تعمل محليًا.",
    toolsAvailable: (n) => (n === 1 ? "أداة واحدة متاحة" : `${n} أدوات متاحة`),
    howData: "كيف نتعامل مع البيانات ←",
    expandingTitle: "توسيع حسب الفئة",
    expandingBodyPrefix:
      "نواصل إضافة أدوات HTML وMarkdown وJavaScript وXML وYAML وPHP. اطلب أداة عبر",
    expandingBodySuffix: ".",
    contactLink: "اتصل بنا",
  },
  toolCard: {
    featured: "مميز",
    openTool: "فتح الأداة",
  },
  toolHeader: {
    backToTools: "كل الأدوات",
    aboutRegion: "حول هذه الأداة",
  },
  aboutPage: {
    title: "حول هذه الأدوات",
    lead: "أدوات صغيرة ومركزة لمهام التطوير اليومية — تعمل دون إرسال مدخلاتك إلى خوادمنا.",
    p1: "الأدوات مرتبة حسب الفئة (نص، URL، CSS، JSON، CSV، والمزيد). ستجد تنسيق JSON وفحص JWT وترميز Base64 وURL وتجزئة SHA ومساعدات UUID والطوابع الزمنية وSVG→CSS وJSON→CSV ومولد ظلال CSS — كلها للعمل السريع دون مغادرة الموقع.",
    privacyLink: "سياسة الخصوصية",
    p2BeforePrivacy:
      "تتم المعالجة في متصفحك. لا نرسل المحتوى الذي تلصقه أو ترفعه إلى خوادمنا لهذه الأدوات. راجع",
    p2AfterPrivacy: "لمعرفة كيف نتعامل مع البيانات في أجزاء أخرى من الموقع.",
    backLink: "← العودة إلى كل الأدوات",
  },
  categoryLabels: categoryLabelsAr(),
  categoryBlurbs: DEV_TOOL_CATEGORY_BLURB,
};

const es: DevToolsMessages = {
  ...en,
  topBar: { devTools: "DevTools", siteLinks: "Enlaces del sitio" },
  nav: { about: "Acerca de", privacy: "Privacidad", terms: "Términos", contact: "Contacto" },
  languageSelectAria: "Idioma de la interfaz",
  sidebar: {
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Buscar herramientas…",
    navAria: "Herramientas por categoría",
    allTools: "Resumen de todas las herramientas",
    aboutUtilities: "Acerca de las utilidades",
    toolsByCategory: "Categorías de herramientas",
    noMatch: (q) => `Ninguna herramienta coincide con «${q}».`,
  },
  breadcrumbs: {
    home: "Inicio",
    devTools: "Herramientas para desarrolladores",
    about: "Acerca de",
    aria: "Migas de pan",
  },
  mobile: {
    browseTools: "Explorar herramientas",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "Buscar herramientas…",
  },
  mobileNav: {
    aria: "Herramientas (móvil)",
    noMatch: (q) =>
      q.trim()
        ? `Ninguna herramienta coincide con «${q.trim()}».`
        : "Ninguna herramienta coincide con esa búsqueda.",
  },
  related: {
    title: "Herramientas relacionadas",
    subtitle: "Primero la misma categoría, luego otras utilidades.",
  },
  hub: {
    badge: "Gratis · En el cliente · Sin registro",
    title: "Herramientas gratuitas para desarrolladores en línea",
    description1:
      "Usa JSON, Base64, hash, codificaciones, QR, red y texto — todo se procesa en tu navegador. Sin cuenta.",
    description2:
      "Explora por categoría: texto, URL, HTML, CSS, JSON, CSV, bases de datos, cripto, YAML y más.",
    description3:
      "Incluye análisis de URL de BD, cadenas aleatorias, Base32/Base58/Base64, SHA y HMAC, bcrypt, QR y CIDR IPv4 — gratuitas y locales.",
    toolsAvailable: (n) => `${n} herramienta${n === 1 ? "" : "s"} disponible${n === 1 ? "" : "s"}`,
    howData: "Cómo tratamos los datos →",
    expandingTitle: "Ampliando por categoría",
    expandingBodyPrefix:
      "Seguimos ampliando utilidades HTML, Markdown, JavaScript, XML, YAML y PHP. Solicita una herramienta en",
    expandingBodySuffix: ".",
    contactLink: "contacto",
  },
  toolCard: { featured: "Destacada", openTool: "Abrir herramienta" },
  toolHeader: { backToTools: "Todas las herramientas", aboutRegion: "Acerca de esta herramienta" },
  aboutPage: {
    title: "Acerca de estas utilidades",
    lead: "Herramientas pequeñas y enfocadas para el día a día — pensadas para no enviar tus datos a nuestros servidores.",
    p1: "Las herramientas están agrupadas por categoría (texto, URL, CSS, JSON, CSV y más). Encontrarás formato JSON, inspección JWT, codificación Base64 y URL, hash SHA, UUID y marcas de tiempo, SVG→CSS, JSON→CSV y un generador de sombras CSS.",
    privacyLink: "política de privacidad",
    p2BeforePrivacy:
      "El procesamiento ocurre en tu navegador. No enviamos el contenido que pegas o subes a nuestros servidores para estas utilidades. Consulta la",
    p2AfterPrivacy: "para saber cómo tratamos los datos en el resto del sitio.",
    backLink: "← Volver a todas las herramientas",
  },
  categoryLabels: {
    ...DEV_TOOL_CATEGORY_LABELS,
    text: "Herramientas de texto",
    url: "Herramientas de URL",
    html: "Herramientas HTML",
    markdown: "Herramientas Markdown",
    css: "Herramientas CSS",
    javascript: "Herramientas JavaScript",
    json: "Herramientas JSON",
    xml: "Herramientas XML",
    yaml: "Herramientas YAML",
    csv: "Herramientas CSV",
    php: "Herramientas PHP",
    database: "Bases de datos",
    randomizers: "Aleatorios",
    base32: "Base32",
    base58: "Base58",
    base64: "Base64",
    hash: "Generadores de hash",
    hmac: "HMAC",
    bcrypt: "Bcrypt",
    qrcode: "Códigos QR",
    network: "Red",
    checksum: "Checksum",
    pdf: "PDF",
    pastebin: "Pastebin",
  },
  categoryBlurbs: DEV_TOOL_CATEGORY_BLURB,
};

const fr: DevToolsMessages = {
  ...en,
  topBar: { devTools: "DevTools", siteLinks: "Liens du site" },
  nav: { about: "À propos", privacy: "Confidentialité", terms: "Conditions", contact: "Contact" },
  languageSelectAria: "Langue d’affichage",
  sidebar: {
    searchLabel: "Rechercher des outils",
    searchPlaceholder: "Rechercher des outils…",
    navAria: "Outils par catégorie",
    allTools: "Vue d’ensemble de tous les outils",
    aboutUtilities: "À propos des utilitaires",
    toolsByCategory: "Catégories d’outils",
    noMatch: (q) => `Aucun outil ne correspond à « ${q} ».`,
  },
  breadcrumbs: {
    home: "Accueil",
    devTools: "Outils développeur",
    about: "À propos",
    aria: "Fil d’Ariane",
  },
  mobile: {
    browseTools: "Parcourir les outils",
    searchLabel: "Rechercher des outils",
    searchPlaceholder: "Rechercher des outils…",
  },
  mobileNav: {
    aria: "Outils (mobile)",
    noMatch: (q) =>
      q.trim()
        ? `Aucun outil ne correspond à « ${q.trim()} ».`
        : "Aucun outil ne correspond à cette recherche.",
  },
  related: {
    title: "Outils associés",
    subtitle: "Même catégorie d’abord, puis d’autres utilitaires.",
  },
  hub: {
    badge: "Gratuit · Côté client · Sans inscription",
    title: "Outils de développement gratuits en ligne",
    description1:
      "JSON, Base64, hachage, encodages, QR, réseau et texte — tout est traité dans votre navigateur. Sans compte.",
    description2:
      "Parcourez par catégorie : texte, URL, HTML, CSS, JSON, CSV, base de données, crypto, YAML, etc.",
    description3:
      "Inclut l’analyse d’URL de base de données, chaînes aléatoires, Base32/Base58/Base64, SHA et HMAC, bcrypt, QR et CIDR IPv4.",
    toolsAvailable: (n) => `${n} outil${n === 1 ? "" : "s"} disponible${n === 1 ? "" : "s"}`,
    howData: "Comment nous traitons les données →",
    expandingTitle: "Extension par catégorie",
    expandingBodyPrefix:
      "Nous enrichissons les utilitaires HTML, Markdown, JavaScript, XML, YAML et PHP. Demandez un outil via",
    expandingBodySuffix: ".",
    contactLink: "contact",
  },
  toolCard: { featured: "À la une", openTool: "Ouvrir l’outil" },
  toolHeader: { backToTools: "Tous les outils", aboutRegion: "À propos de cet outil" },
  aboutPage: {
    title: "À propos de ces utilitaires",
    lead: "Petits outils ciblés pour le quotidien — conçus pour ne pas envoyer vos saisies à nos serveurs.",
    p1: "Les outils sont regroupés par catégorie (texte, URL, CSS, JSON, CSV, etc.). Vous y trouverez formatage JSON, inspection JWT, encodage Base64 et URL, hachage SHA, UUID et horodatage, SVG→CSS, JSON→CSV et un générateur d’ombres CSS.",
    privacyLink: "politique de confidentialité",
    p2BeforePrivacy:
      "Le traitement se fait dans votre navigateur. Nous n’envoyons pas le contenu collé ou téléversé à nos serveurs pour ces utilitaires. Voir la",
    p2AfterPrivacy: "pour le reste du site.",
    backLink: "← Retour à tous les outils",
  },
  categoryLabels: es.categoryLabels,
  categoryBlurbs: DEV_TOOL_CATEGORY_BLURB,
};

const de: DevToolsMessages = {
  ...en,
  topBar: { devTools: "DevTools", siteLinks: "Seitenlinks" },
  nav: { about: "Über uns", privacy: "Datenschutz", terms: "AGB", contact: "Kontakt" },
  languageSelectAria: "Anzeigesprache",
  sidebar: {
    searchLabel: "Tools durchsuchen",
    searchPlaceholder: "Tools durchsuchen…",
    navAria: "Tools nach Kategorie",
    allTools: "Alle Tools – Übersicht",
    aboutUtilities: "Über die Utilities",
    toolsByCategory: "Tool-Kategorien",
    noMatch: (q) => `Keine Tools passen zu „${q}“.`,
  },
  breadcrumbs: {
    home: "Start",
    devTools: "Entwickler-Tools",
    about: "Über",
    aria: "Brotkrumen",
  },
  mobile: {
    browseTools: "Tools durchsuchen",
    searchLabel: "Tools durchsuchen",
    searchPlaceholder: "Tools durchsuchen…",
  },
  mobileNav: {
    aria: "Tools (Mobil)",
    noMatch: (q) =>
      q.trim() ? `Keine Tools passen zu „${q.trim()}“.` : "Keine Tools passen zu dieser Suche.",
  },
  related: {
    title: "Verwandte Tools",
    subtitle: "Zuerst dieselbe Kategorie, dann andere Utilities.",
  },
  hub: {
    badge: "Kostenlos · Clientseitig · Ohne Anmeldung",
    title: "Kostenlose Online-Entwickler-Tools",
    description1:
      "JSON, Base64, Hashing, Kodierungen, QR, Netzwerk und Text — alles im Browser. Kein Konto nötig.",
    description2:
      "Nach Kategorie: Text, URL, HTML, CSS, JSON, CSV, Datenbank, Krypto, YAML und mehr.",
    description3:
      "Inkl. DB-URL-Parsing, Zufallsstrings, Base32/Base58/Base64, SHA & HMAC, bcrypt, QR und IPv4-CIDR — lokal im Browser.",
    toolsAvailable: (n) => `${n} Tool${n === 1 ? "" : "s"} verfügbar`,
    howData: "Wie wir Daten behandeln →",
    expandingTitle: "Wachstum nach Kategorie",
    expandingBodyPrefix:
      "Wir erweitern HTML-, Markdown-, JavaScript-, XML-, YAML- und PHP-Utilities. Wünsche per",
    expandingBodySuffix: ".",
    contactLink: "Kontakt",
  },
  toolCard: { featured: "Highlight", openTool: "Tool öffnen" },
  toolHeader: { backToTools: "Alle Tools", aboutRegion: "Über dieses Tool" },
  aboutPage: {
    title: "Über diese Utilities",
    lead: "Kleine, fokussierte Tools für den Alltag — ohne Ihre Eingaben an unsere Server zu senden.",
    p1: "Die Tools sind nach Kategorie gruppiert (Text, URL, CSS, JSON, CSV u. a.). Sie finden JSON-Formatierung, JWT-Prüfung, Base64- und URL-Kodierung, SHA-Hashing, UUID- und Zeitstempel-Hilfen, SVG→CSS, JSON→CSV und einen CSS-Schatten-Generator.",
    privacyLink: "Datenschutzerklärung",
    p2BeforePrivacy:
      "Die Verarbeitung erfolgt im Browser. Für diese Utilities senden wir Ihren Inhalt nicht an unsere Server. Siehe die",
    p2AfterPrivacy: "für den Rest der Website.",
    backLink: "← Zurück zu allen Tools",
  },
  categoryLabels: {
    ...DEV_TOOL_CATEGORY_LABELS,
    text: "Text-Tools",
    url: "URL-Tools",
    html: "HTML-Tools",
    markdown: "Markdown-Tools",
    css: "CSS-Tools",
    javascript: "JavaScript-Tools",
    json: "JSON-Tools",
    xml: "XML-Tools",
    yaml: "YAML-Tools",
    csv: "CSV-Tools",
    php: "PHP-Tools",
    database: "Datenbank-Tools",
    randomizers: "Zufallsgeneratoren",
    base32: "Base32-Tools",
    base58: "Base58-Tools",
    base64: "Base64-Tools",
    hash: "Hash-Generatoren",
    hmac: "HMAC-Tools",
    bcrypt: "Bcrypt-Tools",
    qrcode: "QR-Codes",
    network: "Netzwerk-Tools",
    checksum: "Prüfsummen",
    pdf: "PDF-Tools",
    pastebin: "Pastebin",
  },
  categoryBlurbs: DEV_TOOL_CATEGORY_BLURB,
};

const ptBR: DevToolsMessages = {
  ...en,
  topBar: { devTools: "DevTools", siteLinks: "Links do site" },
  nav: { about: "Sobre", privacy: "Privacidade", terms: "Termos", contact: "Contato" },
  languageSelectAria: "Idioma da interface",
  sidebar: {
    searchLabel: "Buscar ferramentas",
    searchPlaceholder: "Buscar ferramentas…",
    navAria: "Ferramentas por categoria",
    allTools: "Visão geral de todas as ferramentas",
    aboutUtilities: "Sobre as utilidades",
    toolsByCategory: "Categorias de ferramentas",
    noMatch: (q) => `Nenhuma ferramenta corresponde a «${q}».`,
  },
  breadcrumbs: {
    home: "Início",
    devTools: "Ferramentas para desenvolvedores",
    about: "Sobre",
    aria: "Navegação estrutural",
  },
  mobile: {
    browseTools: "Explorar ferramentas",
    searchLabel: "Buscar ferramentas",
    searchPlaceholder: "Buscar ferramentas…",
  },
  mobileNav: {
    aria: "Ferramentas (mobile)",
    noMatch: (q) =>
      q.trim()
        ? `Nenhuma ferramenta corresponde a «${q.trim()}».`
        : "Nenhuma ferramenta corresponde a essa busca.",
  },
  related: {
    title: "Ferramentas relacionadas",
    subtitle: "Primeiro a mesma categoria, depois outras utilidades.",
  },
  hub: {
    badge: "Grátis · No cliente · Sem cadastro",
    title: "Ferramentas gratuitas para desenvolvedores online",
    description1:
      "JSON, Base64, hash, codificações, QR, rede e texto — tudo no seu navegador. Sem conta.",
    description2:
      "Navegue por categoria: texto, URL, HTML, CSS, JSON, CSV, banco de dados, cripto, YAML e mais.",
    description3:
      "Inclui análise de URL de BD, strings aleatórias, Base32/Base58/Base64, SHA e HMAC, bcrypt, QR e CIDR IPv4.",
    toolsAvailable: (n) => `${n} ferramenta${n === 1 ? "" : "s"} disponível${n === 1 ? "" : "eis"}`,
    howData: "Como tratamos os dados →",
    expandingTitle: "Expandindo por categoria",
    expandingBodyPrefix:
      "Continuamos ampliando utilitários HTML, Markdown, JavaScript, XML, YAML e PHP. Solicite uma ferramenta em",
    expandingBodySuffix: ".",
    contactLink: "contato",
  },
  toolCard: { featured: "Em destaque", openTool: "Abrir ferramenta" },
  toolHeader: { backToTools: "Todas as ferramentas", aboutRegion: "Sobre esta ferramenta" },
  aboutPage: {
    title: "Sobre estas utilidades",
    lead: "Ferramentas pequenas e focadas para o dia a dia — sem enviar suas entradas aos nossos servidores.",
    p1: "As ferramentas são agrupadas por categoria (texto, URL, CSS, JSON, CSV e mais). Há formatação JSON, inspeção JWT, codificação Base64 e URL, hash SHA, UUID e carimbo de tempo, SVG→CSS, JSON→CSV e um gerador de sombras CSS.",
    privacyLink: "política de privacidade",
    p2BeforePrivacy:
      "O processamento ocorre no seu navegador. Não enviamos o conteúdo colado ou enviado aos nossos servidores para estas utilidades. Veja a",
    p2AfterPrivacy: "para o restante do site.",
    backLink: "← Voltar a todas as ferramentas",
  },
  categoryLabels: es.categoryLabels,
  categoryBlurbs: DEV_TOOL_CATEGORY_BLURB,
};

const ja: DevToolsMessages = {
  ...en,
  topBar: { devTools: "開発者ツール", siteLinks: "サイトリンク" },
  nav: { about: "概要", privacy: "プライバシー", terms: "利用規約", contact: "お問い合わせ" },
  languageSelectAria: "表示言語",
  sidebar: {
    searchLabel: "ツールを検索",
    searchPlaceholder: "ツールを検索…",
    navAria: "カテゴリ別ツール",
    allTools: "すべてのツール一覧",
    aboutUtilities: "ユーティリティについて",
    toolsByCategory: "ツールカテゴリ",
    noMatch: (q) => `「${q}」に一致するツールはありません。`,
  },
  breadcrumbs: {
    home: "ホーム",
    devTools: "開発者ツール",
    about: "概要",
    aria: "パンくずリスト",
  },
  mobile: {
    browseTools: "ツールを見る",
    searchLabel: "ツールを検索",
    searchPlaceholder: "ツールを検索…",
  },
  mobileNav: {
    aria: "ツール（モバイル）",
    noMatch: (q) =>
      q.trim()
        ? `「${q.trim()}」に一致するツールはありません。`
        : "一致するツールはありません。",
  },
  related: {
    title: "関連ツール",
    subtitle: "同じカテゴリを優先し、その他のユーティリティを表示します。",
  },
  hub: {
    badge: "無料 · クライアント側 · 登録不要",
    title: "無料のオンライン開発者ツール",
    description1:
      "JSON、Base64、ハッシュ、エンコード、QR、ネットワーク、テキストなど — すべてブラウザ内で処理。アカウント不要。",
    description2: "カテゴリ別に閲覧：テキスト、URL、HTML、CSS、JSON、CSV、データベース、暗号、YAML など。",
    description3:
      "DB URL の解析、ランダム文字列、Base32/Base58/Base64、SHA・HMAC、bcrypt、QR、IPv4 CIDR など — ローカルで動作。",
    toolsAvailable: (n) => `${n} 件のツールが利用可能`,
    howData: "データの取り扱い →",
    expandingTitle: "カテゴリ別に拡充中",
    expandingBodyPrefix:
      "HTML、Markdown、JavaScript、XML、YAML、PHP のユーティリティを拡充しています。ツールのリクエストは",
    expandingBodySuffix: "から。",
    contactLink: "お問い合わせ",
  },
  toolCard: { featured: "注目", openTool: "ツールを開く" },
  toolHeader: { backToTools: "すべてのツール", aboutRegion: "このツールについて" },
  aboutPage: {
    title: "これらのユーティリティについて",
    lead: "日々の開発タスク向けの小さなツール — 入力をサーバーに送らずに使えます。",
    p1: "ツールはカテゴリ（テキスト、URL、CSS、JSON、CSV など）別に整理されています。JSON の整形、JWT の確認、Base64・URL エンコード、SHA ハッシュ、UUID・タイムスタンプ、SVG→CSS、JSON→CSV、CSS ボックスシャドウ生成などがあります。",
    privacyLink: "プライバシーポリシー",
    p2BeforePrivacy:
      "処理はブラウザ内で行われます。これらのユーティリティでは、貼り付けやアップロードした内容をサーバーに送りません。サイト全体のデータ取り扱いは",
    p2AfterPrivacy: "をご覧ください。",
    backLink: "← すべてのツールに戻る",
  },
  categoryLabels: {
    ...DEV_TOOL_CATEGORY_LABELS,
    text: "テキスト",
    url: "URL",
    html: "HTML",
    markdown: "Markdown",
    css: "CSS",
    javascript: "JavaScript",
    json: "JSON",
    xml: "XML",
    yaml: "YAML",
    csv: "CSV",
    php: "PHP",
    database: "データベース",
    randomizers: "ランダム",
    base32: "Base32",
    base58: "Base58",
    base64: "Base64",
    hash: "ハッシュ",
    hmac: "HMAC",
    bcrypt: "bcrypt",
    qrcode: "QRコード",
    network: "ネットワーク",
    checksum: "チェックサム",
    pdf: "PDF",
    pastebin: "Pastebin",
  },
  categoryBlurbs: DEV_TOOL_CATEGORY_BLURB,
};

const zhCN: DevToolsMessages = {
  ...en,
  topBar: { devTools: "开发者工具", siteLinks: "网站链接" },
  nav: { about: "关于", privacy: "隐私", terms: "条款", contact: "联系" },
  languageSelectAria: "显示语言",
  sidebar: {
    searchLabel: "搜索工具",
    searchPlaceholder: "搜索工具…",
    navAria: "按分类浏览工具",
    allTools: "全部工具总览",
    aboutUtilities: "关于实用工具",
    toolsByCategory: "工具分类",
    noMatch: (q) => `没有与「${q}」匹配的工具。`,
  },
  breadcrumbs: {
    home: "首页",
    devTools: "开发者工具",
    about: "关于",
    aria: "面包屑导航",
  },
  mobile: {
    browseTools: "浏览工具",
    searchLabel: "搜索工具",
    searchPlaceholder: "搜索工具…",
  },
  mobileNav: {
    aria: "工具（移动版）",
    noMatch: (q) =>
      q.trim() ? `没有与「${q.trim()}」匹配的工具。` : "没有匹配该搜索的工具。",
  },
  related: {
    title: "相关工具",
    subtitle: "优先同类别，再显示其他实用工具。",
  },
  hub: {
    badge: "免费 · 客户端 · 无需注册",
    title: "免费在线开发者工具",
    description1:
      "使用 JSON、Base64、哈希、编码、二维码、网络与文本工具 — 均在浏览器中处理，无需账号。",
    description2: "按类别浏览：文本、URL、HTML、CSS、JSON、CSV、数据库、加密、YAML 等。",
    description3:
      "包含数据库 URL 解析、随机字符串、Base32/Base58/Base64、SHA 与 HMAC、bcrypt、二维码与 IPv4 CIDR — 均在本地运行。",
    toolsAvailable: (n) => `共 ${n} 个工具可用`,
    howData: "我们如何处理数据 →",
    expandingTitle: "按类别持续扩充",
    expandingBodyPrefix:
      "我们正在扩展 HTML、Markdown、JavaScript、XML、YAML 与 PHP 相关工具。可通过",
    expandingBodySuffix: "申请新工具。",
    contactLink: "联系",
  },
  toolCard: { featured: "精选", openTool: "打开工具" },
  toolHeader: { backToTools: "全部工具", aboutRegion: "关于此工具" },
  aboutPage: {
    title: "关于这些实用工具",
    lead: "面向日常开发的小型工具 — 无需将您的输入发送到我们的服务器。",
    p1: "工具按类别分组（文本、URL、CSS、JSON、CSV 等）。提供 JSON 格式化、JWT 检查、Base64 与 URL 编码、SHA 哈希、UUID 与时间戳、SVG→CSS、JSON→CSV 以及 CSS 阴影生成等。",
    privacyLink: "隐私政策",
    p2BeforePrivacy:
      "处理在浏览器中完成。对于这些实用工具，我们不会将您粘贴或上传的内容发送到服务器。网站其他部分的数据处理请参阅",
    p2AfterPrivacy: "。",
    backLink: "← 返回全部工具",
  },
  categoryLabels: {
    ...DEV_TOOL_CATEGORY_LABELS,
    text: "文本工具",
    url: "URL 工具",
    html: "HTML 工具",
    markdown: "Markdown 工具",
    css: "CSS 工具",
    javascript: "JavaScript 工具",
    json: "JSON 工具",
    xml: "XML 工具",
    yaml: "YAML 工具",
    csv: "CSV 工具",
    php: "PHP 工具",
    database: "数据库工具",
    randomizers: "随机生成",
    base32: "Base32 工具",
    base58: "Base58 工具",
    base64: "Base64 工具",
    hash: "哈希生成",
    hmac: "HMAC 工具",
    bcrypt: "Bcrypt 工具",
    qrcode: "二维码",
    network: "网络工具",
    checksum: "校验和",
    pdf: "PDF 工具",
    pastebin: "Pastebin",
  },
  categoryBlurbs: DEV_TOOL_CATEGORY_BLURB,
};

const bundles: Record<DevToolsLocaleId, DevToolsMessages> = {
  en,
  ar,
  es,
  fr,
  de,
  "pt-BR": ptBR,
  ja,
  "zh-CN": zhCN,
};

export function getDevToolsMessages(locale: DevToolsLocaleId): DevToolsMessages {
  return bundles[locale] ?? en;
}
