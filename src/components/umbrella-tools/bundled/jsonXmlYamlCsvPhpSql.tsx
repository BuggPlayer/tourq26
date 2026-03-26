"use client";

import { useMemo, useState } from "react";
import Papa from "papaparse";
import { parse as yamlParse, stringify as yamlStringify } from "yaml";
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import { format as formatSql } from "sql-formatter";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

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
  const meta = getDevToolBySlug("json-minifier");
  const { out, err } = useMemo(() => {
    try {
      return { out: JSON.stringify(JSON.parse(input)), err: null as string | null };
    } catch (e) {
      return { out: "", err: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, [input]);
  return (
    <>
      <ToolHeader title="JSON minifier" description="Remove whitespace — compact one-liner JSON." category={meta?.category} />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      {err ? <p className="mt-2 text-sm text-destructive">{err}</p> : null}
      <textarea readOnly value={out} rows={4} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
    </>
  );
}

export function JsonEscapeTool() {
  const [input, setInput] = useState('say "hi"');
  const meta = getDevToolBySlug("json-escape");
  const out = useMemo(() => JSON.stringify(input).slice(1, -1), [input]);
  return (
    <>
      <ToolHeader title="JSON escape" description="Escape a string as JSON would inside a quoted string (no outer quotes)." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={8} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </>
  );
}

export function JsonUnescapeTool() {
  const [input, setInput] = useState(String.raw`say \"hi\"`);
  const meta = getDevToolBySlug("json-unescape");
  const { out, err } = useMemo(() => {
    try {
      const quoted = `"${input.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
      return { out: JSON.parse(quoted) as string, err: null as string | null };
    } catch (e) {
      return { out: "", err: e instanceof Error ? e.message : "Parse error" };
    }
  }, [input]);
  return (
    <>
      <ToolHeader title="JSON unescape" description="Unescape a JSON string fragment (quoted JSON string rules)." category={meta?.category} />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      {err ? <p className="mt-2 text-sm text-destructive">{err}</p> : null}
      <textarea readOnly value={out} rows={8} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
    </>
  );
}

export function JsonValidatorStandaloneTool() {
  const [input, setInput] = useState("{}");
  const meta = getDevToolBySlug("json-validator-standalone");
  const { ok, msg } = useMemo(() => {
    try {
      JSON.parse(input);
      return { ok: true, msg: "Valid JSON." };
    } catch (e) {
      return { ok: false, msg: e instanceof Error ? e.message : "Invalid" };
    }
  }, [input]);
  return (
    <>
      <ToolHeader title="JSON validator" description="Validate JSON and show parse errors." category={meta?.category} />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <p className={`mt-4 text-sm font-medium ${ok ? "text-success" : "text-destructive"}`}>{msg}</p>
    </>
  );
}

export function XmlFormatterTool() {
  const [input, setInput] = useState("<root><a>1</a></root>");
  const meta = getDevToolBySlug("xml-formatter");
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
    <>
      <ToolHeader title="XML formatter" description="Pretty-print XML via parse → build (may normalize namespaces)." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={14} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </>
  );
}

export function XmlMinifierTool() {
  const [input, setInput] = useState("<root>\n  <a>1</a>\n</root>");
  const meta = getDevToolBySlug("xml-minifier");
  const out = useMemo(() => input.replace(/>\s+</g, "><").trim(), [input]);
  return (
    <>
      <ToolHeader title="XML minifier" description="Collapse whitespace between tags." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={12} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </>
  );
}

export function XmlEncoderTool() {
  const [input, setInput] = useState('<tag attr="a">');
  const meta = getDevToolBySlug("xml-encoder");
  const out = useMemo(() => escapeXmlText(input), [input]);
  return (
    <>
      <ToolHeader title="XML encoder" description="Encode special characters for XML text nodes." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={8} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </>
  );
}

export function XmlDecoderTool() {
  const [input, setInput] = useState("&lt;tag&gt;");
  const meta = getDevToolBySlug("xml-decoder");
  const out = useMemo(() => unescapeXmlText(input), [input]);
  return (
    <>
      <ToolHeader title="XML decoder" description="Decode predefined XML entities." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={8} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </>
  );
}

export function XmlEscapeTool() {
  const [input, setInput] = useState('<tag attr="a">');
  const meta = getDevToolBySlug("xml-escape");
  const out = useMemo(() => escapeXmlText(input), [input]);
  return (
    <>
      <ToolHeader title="XML escape" description="Escape &, &lt;, &gt;, and quotes for XML text." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={8} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </>
  );
}

export function XmlUnescapeTool() {
  const [input, setInput] = useState("&lt;tag&gt;");
  const meta = getDevToolBySlug("xml-unescape");
  const out = useMemo(() => unescapeXmlText(input), [input]);
  return (
    <>
      <ToolHeader title="XML unescape" description="Unescape predefined XML entities." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={8} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </>
  );
}

export function XmlValidatorTool() {
  const [input, setInput] = useState("<root/>");
  const meta = getDevToolBySlug("xml-validator");
  const msg = useMemo(() => {
    const r = XMLValidator.validate(input);
    if (r === true) return "Well-formed XML.";
    return r.err.msg;
  }, [input]);
  return (
    <>
      <ToolHeader title="XML validator" description="Validate XML structure with fast-xml-parser." category={meta?.category} />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <p className="mt-4 text-sm text-muted-foreground">{msg}</p>
    </>
  );
}

export function XmlToJsonTool() {
  const [input, setInput] = useState("<a x=\"1\">hi</a>");
  const meta = getDevToolBySlug("xml-to-json");
  const out = useMemo(() => {
    try {
      const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
      return JSON.stringify(parser.parse(input), null, 2);
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <>
      <ToolHeader title="XML to JSON" description="Convert XML to JSON (fast-xml-parser)." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={14} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </>
  );
}

export function JsonToXmlTool() {
  const [input, setInput] = useState('{"root":{"a":"1"}}');
  const meta = getDevToolBySlug("json-to-xml");
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
    <>
      <ToolHeader title="JSON to XML" description="Build XML from a JSON object (root keys become tags)." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={14} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </>
  );
}

export function YamlValidatorTool() {
  const [input, setInput] = useState("a: 1");
  const meta = getDevToolBySlug("yaml-validator");
  const msg = useMemo(() => {
    try {
      yamlParse(input);
      return "Valid YAML.";
    } catch (e) {
      return e instanceof Error ? e.message : "Invalid";
    }
  }, [input]);
  return (
    <>
      <ToolHeader title="YAML validator" description="Parse YAML and report errors." category={meta?.category} />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <p className="mt-4 text-sm text-muted-foreground">{msg}</p>
    </>
  );
}

export function YamlToJsonTool() {
  const [input, setInput] = useState("a: 1\nb: two");
  const meta = getDevToolBySlug("yaml-to-json");
  const out = useMemo(() => {
    try {
      return JSON.stringify(yamlParse(input), null, 2);
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <>
      <ToolHeader title="YAML to JSON" description="Convert YAML to formatted JSON." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={14} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </>
  );
}

export function JsonToYamlTool() {
  const [input, setInput] = useState('{"a":1}');
  const meta = getDevToolBySlug("json-to-yaml");
  const out = useMemo(() => {
    try {
      return yamlStringify(JSON.parse(input));
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <>
      <ToolHeader title="JSON to YAML" description="Convert JSON to YAML." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={14} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </>
  );
}

export function CsvToJsonTool() {
  const [input, setInput] = useState("a,b\n1,2");
  const meta = getDevToolBySlug("csv-to-json");
  const out = useMemo(() => {
    const r = Papa.parse<Record<string, string>>(input, { header: true, skipEmptyLines: true });
    if (r.errors.length) return r.errors.map((e) => e.message).join("\n");
    return JSON.stringify(r.data, null, 2);
  }, [input]);
  return (
    <>
      <ToolHeader title="CSV to JSON" description="Parse CSV with header row (Papa Parse)." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={14} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </>
  );
}

export function PhpArrayToJsonTool() {
  const [input, setInput] = useState("array('a' => 1, 'b' => 'x')");
  const meta = getDevToolBySlug("php-array-to-json");
  const { out, err } = useMemo(() => {
    try {
      const j = roughPhpArrayToJson(input);
      return { out: JSON.stringify(JSON.parse(j), null, 2), err: null as string | null };
    } catch (e) {
      return { out: "", err: e instanceof Error ? e.message : "Could not convert — try simplifying the PHP literal." };
    }
  }, [input]);
  return (
    <>
      <ToolHeader title="PHP array to JSON" description="Best-effort conversion for simple associative array() literals." category={meta?.category} />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      {err ? <p className="mt-2 text-sm text-destructive">{err}</p> : null}
      <textarea readOnly value={out} rows={12} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
    </>
  );
}

export function JsonToPhpArrayTool() {
  const [input, setInput] = useState('{"a":1,"b":"x"}');
  const meta = getDevToolBySlug("json-to-php-array");
  const out = useMemo(() => {
    try {
      return jsonToPhpArray(JSON.parse(input));
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <>
      <ToolHeader title="JSON to PHP array" description="Convert JSON to a PHP array() literal string." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={12} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </>
  );
}

export function SqlFormatterTool() {
  const [input, setInput] = useState("SELECT * FROM t WHERE a=1");
  const meta = getDevToolBySlug("sql-formatter");
  const out = useMemo(() => {
    try {
      return formatSql(input, { language: "sql" });
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <>
      <ToolHeader title="SQL formatter" description="Pretty-print SQL with sql-formatter." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={16} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={16} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </>
  );
}

export function SqlMinifierTool() {
  const [input, setInput] = useState("SELECT /*x*/ 1 FROM t");
  const meta = getDevToolBySlug("sql-minifier");
  const out = useMemo(() => sqlMinify(input), [input]);
  return (
    <>
      <ToolHeader title="SQL minifier" description="Strip comments and collapse whitespace." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={12} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </>
  );
}

export function SqlEscapeTool() {
  const [input, setInput] = useState("O'Reilly");
  const meta = getDevToolBySlug("sql-escape");
  const out = useMemo(() => input.replace(/'/g, "''"), [input]);
  return (
    <>
      <ToolHeader title="SQL escape" description="Escape single quotes for SQL string literals (double the quote)." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={6} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </>
  );
}
