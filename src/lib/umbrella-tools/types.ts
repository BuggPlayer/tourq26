export type DevToolCategory =
  | "text"
  | "url"
  | "html"
  | "markdown"
  | "css"
  | "javascript"
  | "json"
  | "xml"
  | "yaml"
  | "csv"
  | "php"
  | "database"
  | "randomizers"
  | "base32"
  | "base58"
  | "base64"
  | "hash"
  | "hmac"
  | "bcrypt"
  | "qrcode"
  | "network"
  | "checksum"
  | "pastebin";

export type UmbrellaTool = {
  slug: string;
  title: string;
  description: string;
  category: DevToolCategory;
  icon: string;
  keywords?: string[];
  badge?: string;
};
