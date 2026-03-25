function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = typeof value === "object" ? JSON.stringify(value) : String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function formatJSON(jsonString: string): string {
  const parsed = JSON.parse(jsonString);
  return JSON.stringify(parsed, null, 2);
}

export function validateJSON(jsonString: string): { valid: boolean; error: string } {
  const s = jsonString.trim();
  if (!s) {
    return { valid: false, error: "JSON is empty." };
  }
  try {
    JSON.parse(s);
    return { valid: true, error: "" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid JSON.";
    return { valid: false, error: msg };
  }
}

/** Expects an array of plain objects with consistent keys (first row defines columns). */
export function jsonToCSV(jsonArray: Record<string, unknown>[]): string {
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
    return "";
  }
  const first = jsonArray[0];
  if (first === null || typeof first !== "object" || Array.isArray(first)) {
    throw new Error("Each row must be a plain object.");
  }
  const keys = Object.keys(first);
  const header = keys.map(escapeCsvCell).join(",");
  const rows = jsonArray.map((row) => {
    if (row === null || typeof row !== "object" || Array.isArray(row)) {
      throw new Error("Each row must be a plain object.");
    }
    return keys.map((k) => escapeCsvCell((row as Record<string, unknown>)[k])).join(",");
  });
  return [header, ...rows].join("\n");
}
