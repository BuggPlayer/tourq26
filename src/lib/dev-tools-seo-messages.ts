import type { DevToolsLocaleId } from "@/lib/dev-tools-locale";
import { DEV_TOOL_CATEGORY_META_TAIL } from "@/lib/umbrella-tools/dev-tool-category-meta-tail";
import type { DevToolCategory } from "@/lib/umbrella-tools/types";

export type DevToolsSeoMessages = {
  /** Title segment between page title and site name (e.g. "Developer utilities"). */
  titleSuffix: string;
  hub: { title: string; description: string; keywords: string[] };
  about: { title: string; description: string };
  jsonLdHub: { name: string; description: string; itemListName: string };
  categoryMetaTail: Record<DevToolCategory, string>;
};

const en: DevToolsSeoMessages = {
  titleSuffix: "Developer utilities",
  hub: {
    title: "Free dev tools online",
    description:
      "Free developer tools online — JSON, Base64, SHA/HMAC, bcrypt, QR, CIDR, encodings & URL utilities. No account; everything runs locally in your browser.",
    keywords: [
      "free developer tools",
      "free dev tools online",
      "developer tools online",
      "online developer utilities",
      "browser developer tools",
      "text tools",
      "url tools",
      "json tools",
      "csv tools",
      "css tools",
      "yaml tools",
      "markdown tools",
      "php tools online",
      "database url parser",
      "bcrypt online",
      "qr code generator",
      "cidr calculator",
      "hmac generator",
    ],
  },
  about: {
    title: "About developer utilities",
    description: "What the Torq Studio in-browser developer utilities are and how we handle your data.",
  },
  jsonLdHub: {
    name: "Free online developer tools",
    description:
      "Browse free developer utilities: JSON, Base64, hashing, QR codes, CIDR, encodings, and more. All tools run client-side in your browser — no account required.",
    itemListName: "Developer utilities",
  },
  categoryMetaTail: DEV_TOOL_CATEGORY_META_TAIL,
};

const ar: DevToolsSeoMessages = {
  ...en,
  titleSuffix: "أدوات المطورين",
  hub: {
    title: "أدوات مطورين مجانية على الإنترنت",
    description:
      "أدوات مطور مجانية — JSON وBase64 وSHA/HMAC وbcrypt ورموز QR وCIDR والترميز وأدوات URL. بدون حساب؛ كل شيء يعمل محليًا في متصفحك.",
    keywords: [
      "أدوات مطورين مجانية",
      "أدوات مطورين على الإنترنت",
      "JSON",
      "Base64",
      "bcrypt",
      "رمز QR",
      "CIDR",
      "تجزئة",
      "أدوات نص",
      "أدوات URL",
    ],
  },
  about: {
    title: "حول أدوات المطور",
    description: "ما هي أدوات Torq Studio في المتصفط وكيف نتعامل مع بياناتك.",
  },
  jsonLdHub: {
    name: "أدوات مطورين مجانية على الإنترنت",
    description:
      "تصفح أدوات مجانية: JSON وBase64 والتجزئة ورموز QR وCIDR والترميز والمزيد. كل الأدوات تعمل في المتصفح — بدون تسجيل.",
    itemListName: "أدوات المطورين",
  },
  categoryMetaTail: {
    text: "أداة نص مجانية على الإنترنت — تعمل في المتصفح دون تسجيل.",
    url: "أداة URL — من جانب العميل فقط؛ لا يُرفع شيء إلى خوادمنا.",
    html: "أداة HTML — تُعالج محليًا في متصفحك.",
    markdown: "أداة Markdown — تعمل في المتصفح.",
    css: "أداة CSS للمطورين — تعمل محليًا في المتصفح.",
    javascript: "أداة JavaScript — من جانب العميل دون طلب للخادم.",
    json: "أداة JSON — بياناتك تبقى في علامة التبويب.",
    xml: "أداة XML — تحليل وتحويل محليًا.",
    yaml: "أداة YAML — تعمل في المتصفح؛ لا حاجة لحساب.",
    csv: "أداة CSV / بيانات جدولية — معالجة من جانب العميل.",
    php: "مساعد PHP — يعمل في المتصفح.",
    database: "أداة قواعد بيانات — تحليل سلاسل الاتصال محليًا.",
    randomizers: "مولّد عشوائي — قوي تشفيريًا حيث يُدعم؛ يعمل محليًا.",
    base32: "أداة Base32 — ترميز وفك في المتصفح.",
    base58: "أداة Base58 — تعمل محليًا.",
    base64: "أداة Base64 — UTF-8 آمن؛ بالكامل من جانب العميل.",
    hash: "مولّد تجزئة — تُحسب في المتصفح فقط.",
    hmac: "أداة HMAC — تجزئة مفتاحية للتصحيح؛ تبقى في هذا التبويب.",
    bcrypt: "أداة bcrypt — كلمات المرور لا تغادر متصفحك.",
    qrcode: "أداة QR — تُولَّد أو تُفك محليًا.",
    network: "حاسبة شبكة — IPv4 ومعلومات IP دون تخزين على الخادم.",
    checksum: "أداة checksum — فحوصات سلامة على UTF-8 في المتصفح.",
    pdf: "أداة PDF — دمج أو استخراج صفحات محليًا؛ الملفات لا تُرفع.",
    pastebin: "لصق نصي — روابط مشاركة اختيارية؛ المحتوى يبقى محليًا أو في الرابط.",
  },
};

const es: DevToolsSeoMessages = {
  ...en,
  titleSuffix: "Utilidades para desarrolladores",
  hub: {
    title: "Herramientas de desarrollo gratuitas online",
    description:
      "Herramientas gratis — JSON, Base64, SHA/HMAC, bcrypt, QR, CIDR, codificaciones y URL. Sin cuenta; todo en tu navegador.",
    keywords: [
      "herramientas desarrollador gratis",
      "dev tools online",
      "JSON",
      "Base64",
      "bcrypt",
      "QR",
      "CIDR",
      "hash",
      "herramientas texto",
      "herramientas URL",
    ],
  },
  about: {
    title: "Acerca de las utilidades para desarrolladores",
    description: "Qué son las utilidades en el navegador de Torq Studio y cómo tratamos tus datos.",
  },
  jsonLdHub: {
    name: "Herramientas de desarrollo gratuitas en línea",
    description:
      "Explora utilidades gratuitas: JSON, Base64, hash, QR, CIDR, codificaciones y más. Todo en el cliente; sin registro.",
    itemListName: "Utilidades para desarrolladores",
  },
  categoryMetaTail: {
    text: "Utilidad de texto gratuita — en tu navegador, sin registro.",
    url: "Herramienta URL — solo en el cliente; nada se sube a nuestros servidores.",
    html: "Utilidad HTML — procesada localmente en tu navegador.",
    markdown: "Utilidad Markdown — en el cliente.",
    css: "Herramienta CSS — funciona localmente en tu navegador.",
    javascript: "Utilidad JavaScript — cliente, sin ida al servidor.",
    json: "Herramienta JSON — tus datos permanecen en la pestaña.",
    xml: "Utilidad XML — analizar y convertir localmente.",
    yaml: "Herramienta YAML — en el navegador; sin cuenta.",
    csv: "Utilidad CSV / datos tabulares — procesamiento en el cliente.",
    php: "Ayuda PHP — en tu navegador.",
    database: "Utilidad de bases de datos — cadenas de conexión analizadas localmente.",
    randomizers: "Aleatorizador — criptográficamente fuerte donde aplique; local.",
    base32: "Herramienta Base32 — codificar y decodificar en el navegador.",
    base58: "Herramienta Base58 — local; sin envío a servidores.",
    base64: "Herramienta Base64 — UTF-8 seguro; solo en el cliente.",
    hash: "Generador de hash — digest solo en tu navegador.",
    hmac: "Herramienta HMAC — hashes con clave para depuración.",
    bcrypt: "Utilidad bcrypt — las contraseñas no salen del navegador.",
    qrcode: "Herramienta QR — generada o decodificada localmente.",
    network: "Calculadora de red — IPv4 e info sin almacenamiento en servidor.",
    checksum: "Utilidad checksum — integridad UTF-8 en el navegador.",
    pdf: "Herramienta PDF — fusionar o extraer localmente; sin subir archivos.",
    pastebin: "Pastebin — enlaces opcionales; contenido en cliente o URL.",
  },
};

const fr: DevToolsSeoMessages = {
  ...en,
  titleSuffix: "Utilitaires développeur",
  hub: {
    title: "Outils de développement gratuits en ligne",
    description:
      "Outils gratuits — JSON, Base64, SHA/HMAC, bcrypt, QR, CIDR, encodages et URL. Sans compte ; tout s’exécute localement dans votre navigateur.",
    keywords: [
      "outils développeur gratuits",
      "dev tools en ligne",
      "JSON",
      "Base64",
      "bcrypt",
      "QR",
      "CIDR",
      "hash",
      "outils texte",
      "outils URL",
    ],
  },
  about: {
    title: "À propos des utilitaires développeur",
    description: "Ce que sont les utilitaires navigateur Torq Studio et comment nous traitons vos données.",
  },
  jsonLdHub: {
    name: "Outils de développement gratuits en ligne",
    description:
      "Parcourez des utilitaires gratuits : JSON, Base64, hachage, QR, CIDR, encodages et plus. Tout côté client — sans inscription.",
    itemListName: "Utilitaires développeur",
  },
  categoryMetaTail: es.categoryMetaTail,
};

const de: DevToolsSeoMessages = {
  ...en,
  titleSuffix: "Entwickler-Tools",
  hub: {
    title: "Kostenlose Dev-Tools online",
    description:
      "Kostenlose Entwickler-Tools — JSON, Base64, SHA/HMAC, bcrypt, QR, CIDR, Kodierung & URL. Kein Konto; alles lokal im Browser.",
    keywords: [
      "kostenlose entwickler tools",
      "dev tools online",
      "JSON",
      "Base64",
      "bcrypt",
      "QR",
      "CIDR",
      "hash",
      "text tools",
      "url tools",
    ],
  },
  about: {
    title: "Über die Entwickler-Utilities",
    description: "Was die Torq Studio Browser-Utilities sind und wie wir mit Ihren Daten umgehen.",
  },
  jsonLdHub: {
    name: "Kostenlose Online-Entwickler-Tools",
    description:
      "Kostenlose Utilities: JSON, Base64, Hashing, QR, CIDR, Kodierung und mehr. Alles clientseitig — ohne Anmeldung.",
    itemListName: "Entwickler-Utilities",
  },
  categoryMetaTail: {
    text: "Kostenloses Text-Tool — im Browser, ohne Anmeldung.",
    url: "URL-Tool — nur clientseitig; nichts wird hochgeladen.",
    html: "HTML-Utility — lokal im Browser verarbeitet.",
    markdown: "Markdown-Utility — clientseitig im Browser.",
    css: "CSS-Entwicklertool — lokal im Browser.",
    javascript: "JavaScript-Utility — clientseitig, kein Server-Roundtrip.",
    json: "JSON-Tool — Daten bleiben im Tab.",
    xml: "XML-Utility — lokal parsen und konvertieren.",
    yaml: "YAML-Tool — im Browser; kein Konto nötig.",
    csv: "CSV-/Tabellendaten-Utility — clientseitige Verarbeitung.",
    php: "PHP-Hilfe — im Browser.",
    database: "Datenbank-Utility — Verbindungsstrings lokal analysiert.",
    randomizers: "Zufallsgenerator — kryptographisch stark wo unterstützt; lokal.",
    base32: "Base32-Tool — Kodieren und Dekodieren im Browser.",
    base58: "Base58-Tool — lokal; keine Daten an Server.",
    base64: "Base64-Tool — UTF-8-sicher; vollständig clientseitig.",
    hash: "Hash-Generator — Digest nur im Browser.",
    hmac: "HMAC-Tool — Schlüssel-Hashes zum Debuggen.",
    bcrypt: "bcrypt-Utility — Passwörter verlassen den Browser nicht.",
    qrcode: "QR-Tool — lokal erzeugt oder dekodiert.",
    network: "Netzwerk-Rechner — IPv4 ohne serverseitige Speicherung.",
    checksum: "Prüfsummen-Utility — UTF-8-Integrität im Browser.",
    pdf: "PDF-Tool — Seiten lokal zusammenführen oder extrahieren.",
    pastebin: "Pastebin — optionale Links; Inhalt clientseitig oder in der URL.",
  },
};

const ptBR: DevToolsSeoMessages = {
  ...es,
  titleSuffix: "Ferramentas para desenvolvedores",
  hub: {
    ...es.hub,
    title: "Ferramentas de desenvolvimento gratuitas online",
    description:
      "Ferramentas gratuitas — JSON, Base64, SHA/HMAC, bcrypt, QR, CIDR, codificações e URL. Sem conta; tudo no seu navegador.",
  },
  about: {
    title: "Sobre as utilidades para desenvolvedores",
    description: "O que são as utilidades no navegador da Torq Studio e como tratamos seus dados.",
  },
  jsonLdHub: {
    name: "Ferramentas de desenvolvimento gratuitas online",
    description:
      "Explore utilidades gratuitas: JSON, Base64, hash, QR, CIDR, codificações e mais. Tudo no cliente — sem cadastro.",
    itemListName: "Ferramentas para desenvolvedores",
  },
};

const ja: DevToolsSeoMessages = {
  ...en,
  titleSuffix: "開発者向けユーティリティ",
  hub: {
    title: "無料のオンライン開発者ツール",
    description:
      "無料の開発者ツール — JSON、Base64、SHA/HMAC、bcrypt、QR、CIDR、エンコード、URL など。アカウント不要。すべてブラウザ内でローカル実行。",
    keywords: [
      "無料 開発者ツール",
      "オンライン dev tools",
      "JSON",
      "Base64",
      "bcrypt",
      "QRコード",
      "CIDR",
      "ハッシュ",
    ],
  },
  about: {
    title: "開発者ユーティリティについて",
    description: "Torq Studio のブラウザ内ユーティリティの概要とデータの取り扱い。",
  },
  jsonLdHub: {
    name: "無料のオンライン開発者ツール",
    description:
      "JSON、Base64、ハッシュ、QR、CIDR、エンコードなどの無料ユーティリティ。すべてクライアント側で動作。登録不要。",
    itemListName: "開発者ユーティリティ",
  },
  categoryMetaTail: DEV_TOOL_CATEGORY_META_TAIL,
};

const zhCN: DevToolsSeoMessages = {
  ...en,
  titleSuffix: "开发者实用工具",
  hub: {
    title: "免费在线开发者工具",
    description:
      "免费开发者工具 — JSON、Base64、SHA/HMAC、bcrypt、二维码、CIDR、编码与 URL 等。无需账号，均在浏览器本地运行。",
    keywords: [
      "免费开发者工具",
      "在线 dev tools",
      "JSON",
      "Base64",
      "bcrypt",
      "二维码",
      "CIDR",
      "哈希",
    ],
  },
  about: {
    title: "关于开发者实用工具",
    description: "Torq Studio 浏览器内实用工具的说明及数据处理方式。",
  },
  jsonLdHub: {
    name: "免费在线开发者工具",
    description:
      "浏览免费实用工具：JSON、Base64、哈希、二维码、CIDR、编码等。全部在客户端运行，无需注册。",
    itemListName: "开发者实用工具",
  },
  categoryMetaTail: DEV_TOOL_CATEGORY_META_TAIL,
};

/** Keep compiled while English-only; re-add to `bundles` when restoring locales in `dev-tools-locale.ts`. */
void [ar, es, fr, de, ptBR, ja, zhCN];

const bundles: Record<DevToolsLocaleId, DevToolsSeoMessages> = {
  en,
};

export function getDevToolsSeoMessages(locale: DevToolsLocaleId): DevToolsSeoMessages {
  return bundles[locale] ?? en;
}
