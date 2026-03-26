"use client";

import { useMemo, useState } from "react";
import Papa from "papaparse";
import { parse as yamlParse, stringify as yamlStringify } from "yaml";
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import { format as formatSql } from "sql-formatter";
import { DevToolPageShell } from "@/components/umbrella-tools/DevToolPageShell";

function escapeXmlText(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function unescapeXmlText(s: string) {
  return s
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

function jsonToPhpArray(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
  if (Array.isArray(value)) {
    const inner = value.map((v) => jsonToPhpArray(v)).join(", ");
    return `array(${inner})`;
  }
  if (typeof value === "object") {
    const o = value as Record<string, unknown>;
    const inner = Object.entries(o)
      .map(([k, v]) => `'${k.replace(/'/g, "\\'")}' => ${jsonToPhpArray(v)}`)
      .join(", ");
    return `array(${inner})`;
  }
  return "null";
}

function roughPhpArrayToJson(s: string): string {
  let t = s.trim();
  t = t.replace(/^\s*<\?php\s*/i, "");
  t = t.replace(/;\s*$/, "");
  t = t.replace(/^\s*array\s*\(/i, "{").replace(/\)\s*$/, "}");
  t = t.replace(/'([^']*)'\s*=>/g, '"$1":');
  t = t.replace(/=>\s*'([^']*)'/g, ': "$1"');
  t = t.replace(/=>\s*(\d+)/g, ": $1");
  t = t.replace(/=>\s*(true|false)\b/g, ": $1");
  return t;
}

function sqlMinify(s: string) {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/--[^\n]*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function JsonMinifierTool() {
  const [input, setInput] = useState('{\n  "a": 1\n}');
  const { out, err } = useMemo(() => {
    try {
      return { out: JSON.stringify(JSON.parse(input)), err: null as string | null };
    } catch (e) {
      return { out: "", err: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, [input]);
  return (
    <DevToolPageShell slug="json-minifier">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      {err ? <p className="mt-2 text-sm text-destructive">{err}</p> : null}
      <textarea readOnly value={out} rows={4} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
    </DevToolPageShell>
  );
}

export function JsonEscapeTool() {
  const [input, setInput] = useState('say "hi"');
  const out = useMemo(() => JSON.stringify(input).slice(1, -1), [input]);
  return (
    <DevToolPageShell slug="json-escape">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={8} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </DevToolPageShell>
  );
}

export function JsonUnescapeTool() {
  const [input, setInput] = useState(String.raw`say \"hi\"`);
  const { out, err } = useMemo(() => {
    try {
      const quoted = `"${input.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
      return { out: JSON.parse(quoted) as string, err: null as string | null };
    } catch (e) {
      return { out: "", err: e instanceof Error ? e.message : "Parse error" };
    }
  }, [input]);
  return (
    <DevToolPageShell slug="json-unescape">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      {err ? <p className="mt-2 text-sm text-destructive">{err}</p> : null}
      <textarea readOnly value={out} rows={8} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
    </DevToolPageShell>
  );
}

export function JsonValidatorStandaloneTool() {
  const [input, setInput] = useState("{}");
  const { ok, msg } = useMemo(() => {
    try {
      JSON.parse(input);
      return { ok: true, msg: "Valid JSON." };
    } catch (e) {
      return { ok: false, msg: e instanceof Error ? e.message : "Invalid" };
    }
  }, [input]);
  return (
    <DevToolPageShell slug="json-validator-standalone">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <p className={`mt-4 text-sm font-medium ${ok ? "text-success" : "text-destructive"}`}>{msg}</p>
    </DevToolPageShell>
  );
}

export function XmlFormatterTool() {
  const [input, setInput] = useState("<root><a>1</a></root>");
  const out = useMemo(() => {
    try {
      const parser = new XMLParser({ ignoreAttributes: false, trimValues: false });
      const builder = new XMLBuilder({ format: true, ignoreAttributes: false, indentBy: "  " });
      const obj = parser.parse(input);
      return builder.build(obj);
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <DevToolPageShell slug="xml-formatter">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={14} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </DevToolPageShell>
  );
}

export function XmlMinifierTool() {
  const [input, setInput] = useState("<root>\n  <a>1</a>\n</root>");
  const out = useMemo(() => input.replace(/>\s+</g, "><").trim(), [input]);
  return (
    <DevToolPageShell slug="xml-minifier">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={12} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </DevToolPageShell>
  );
}

export function XmlEncoderTool() {
  const [input, setInput] = useState('<tag attr="a">');
  const out = useMemo(() => escapeXmlText(input), [input]);
  return (
    <DevToolPageShell slug="xml-encoder">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={8} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </DevToolPageShell>
  );
}

export function XmlDecoderTool() {
  const [input, setInput] = useState("&lt;tag&gt;");
  const out = useMemo(() => unescapeXmlText(input), [input]);
  return (
    <DevToolPageShell slug="xml-decoder">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={8} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </DevToolPageShell>
  );
}

export function XmlEscapeTool() {
  const [input, setInput] = useState('<tag attr="a">');
  const out = useMemo(() => escapeXmlText(input), [input]);
  return (
    <DevToolPageShell slug="xml-escape">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={8} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </DevToolPageShell>
  );
}

export function XmlUnescapeTool() {
  const [input, setInput] = useState("&lt;tag&gt;");
  const out = useMemo(() => unescapeXmlText(input), [input]);
  return (
    <DevToolPageShell slug="xml-unescape">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={8} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </DevToolPageShell>
  );
}

export function XmlValidatorTool() {
  const [input, setInput] = useState("<root/>");
  const msg = useMemo(() => {
    const r = XMLValidator.validate(input);
    if (r === true) return "Well-formed XML.";
    return r.err.msg;
  }, [input]);
  return (
    <DevToolPageShell slug="xml-validator">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <p className="mt-4 text-sm text-muted-foreground">{msg}</p>
    </DevToolPageShell>
  );
}

export function XmlToJsonTool() {
  const [input, setInput] = useState("<a x=\"1\">hi</a>");
  const out = useMemo(() => {
    try {
      const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
      return JSON.stringify(parser.parse(input), null, 2);
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <DevToolPageShell slug="xml-to-json">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={14} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </DevToolPageShell>
  );
}

export function JsonToXmlTool() {
  const [input, setInput] = useState('{"root":{"a":"1"}}');
  const out = useMemo(() => {
    try {
      const obj = JSON.parse(input);
      const builder = new XMLBuilder({ ignoreAttributes: false, format: true, indentBy: "  ", suppressEmptyNode: true });
      return builder.build(obj);
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <DevToolPageShell slug="json-to-xml">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={14} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </DevToolPageShell>
  );
}

export function YamlValidatorTool() {
  const [input, setInput] = useState("a: 1");
  const msg = useMemo(() => {
    try {
      yamlParse(input);
      return "Valid YAML.";
    } catch (e) {
      return e instanceof Error ? e.message : "Invalid";
    }
  }, [input]);
  return (
    <DevToolPageShell slug="yaml-validator">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <p className="mt-4 text-sm text-muted-foreground">{msg}</p>
    </DevToolPageShell>
  );
}

export function YamlToJsonTool() {
  const [input, setInput] = useState("a: 1\nb: two");
  const out = useMemo(() => {
    try {
      return JSON.stringify(yamlParse(input), null, 2);
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <DevToolPageShell slug="yaml-to-json">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={14} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </DevToolPageShell>
  );
}

export function JsonToYamlTool() {
  const [input, setInput] = useState('{"a":1}');
  const out = useMemo(() => {
    try {
      return yamlStringify(JSON.parse(input));
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <DevToolPageShell slug="json-to-yaml">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={14} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </DevToolPageShell>
  );
}

export function CsvToJsonTool() {
  const [input, setInput] = useState("a,b\n1,2");
  const out = useMemo(() => {
    const r = Papa.parse<Record<string, string>>(input, { header: true, skipEmptyLines: true });
    if (r.errors.length) return r.errors.map((e) => e.message).join("\n");
    return JSON.stringify(r.data, null, 2);
  }, [input]);
  return (
    <DevToolPageShell slug="csv-to-json">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={14} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </DevToolPageShell>
  );
}

export function PhpArrayToJsonTool() {
  const [input, setInput] = useState("array('a' => 1, 'b' => 'x')");
  const { out, err } = useMemo(() => {
    try {
      const j = roughPhpArrayToJson(input);
      return { out: JSON.stringify(JSON.parse(j), null, 2), err: null as string | null };
    } catch (e) {
      return { out: "", err: e instanceof Error ? e.message : "Could not convert — try simplifying the PHP literal." };
    }
  }, [input]);
  return (
    <DevToolPageShell slug="php-array-to-json">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      {err ? <p className="mt-2 text-sm text-destructive">{err}</p> : null}
      <textarea readOnly value={out} rows={12} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
    </DevToolPageShell>
  );
}

export function JsonToPhpArrayTool() {
  const [input, setInput] = useState('{"a":1,"b":"x"}');
  const out = useMemo(() => {
    try {
      return jsonToPhpArray(JSON.parse(input));
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <DevToolPageShell slug="json-to-php-array">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={12} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </DevToolPageShell>
  );
}

export function SqlFormatterTool() {
  const [input, setInput] = useState("SELECT * FROM t WHERE a=1");
  const out = useMemo(() => {
    try {
      return formatSql(input, { language: "sql" });
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <DevToolPageShell slug="sql-formatter">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={16} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={16} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </DevToolPageShell>
  );
}

export function SqlMinifierTool() {
  const [input, setInput] = useState("SELECT /*x*/ 1 FROM t");
  const out = useMemo(() => sqlMinify(input), [input]);
  return (
    <DevToolPageShell slug="sql-minifier">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={12} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </DevToolPageShell>
  );
}

export function SqlEscapeTool() {
  const [input, setInput] = useState("O'Reilly");
  const out = useMemo(() => input.replace(/'/g, "''"), [input]);
  return (
    <DevToolPageShell slug="sql-escape">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={6} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </DevToolPageShell>
  );
}
