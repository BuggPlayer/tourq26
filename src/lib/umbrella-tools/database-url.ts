export type ParsedDatabaseUrl = {
  scheme: string;
  host: string;
  port: string;
  username: string;
  /** Decoded for local debugging — never leaves your browser. */
  password: string;
  database: string;
  searchParams: Record<string, string>;
  href: string;
};

/** Best-effort parse for postgres://, mysql://, mongodb://, redis://, etc. */
export function parseDatabaseUrl(raw: string): ParsedDatabaseUrl {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Enter a connection URL.");

  let u: URL;
  try {
    u = new URL(trimmed);
  } catch {
    throw new Error("Could not parse as a URL. Include a scheme (e.g. postgresql://…).");
  }

  const path = u.pathname.replace(/^\//, "");
  const dbName = path.split("/")[0] ?? "";

  const searchParams: Record<string, string> = {};
  u.searchParams.forEach((v, k) => {
    searchParams[k] = v;
  });

  let password = "";
  if (u.password) {
    try {
      password = decodeURIComponent(u.password);
    } catch {
      password = u.password;
    }
  }

  return {
    scheme: u.protocol.replace(/:$/, "") || "(none)",
    host: u.hostname || "(empty)",
    port: u.port || "(default)",
    username: decodeURIComponent(u.username) || "(none)",
    password: password || "(none)",
    database: dbName || "(none)",
    searchParams,
    href: u.href,
  };
}
