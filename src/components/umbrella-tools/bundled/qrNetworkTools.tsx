"use client";

import { useCallback, useEffect, useState } from "react";
import jsQR from "jsqr";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import { useIsClient } from "@/hooks/use-is-client";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

export function QrToTextTool() {
  const [text, setText] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const meta = getDevToolBySlug("qr-to-text");

  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setText(null);
    setErr(null);
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setErr("Canvas not available.");
        URL.revokeObjectURL(url);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(data.data, data.width, data.height);
      URL.revokeObjectURL(url);
      if (code?.data) setText(code.data);
      else setErr("No QR code found in this image.");
    };
    img.onerror = () => {
      setErr("Could not load image.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  return (
    <>
      <ToolHeader title="QR code to text" description="Decode a QR from an image file — processing stays in your browser." category={meta?.category} />
      <input type="file" accept="image/*" onChange={onFile} className="text-sm" />
      {err ? <p className="mt-4 text-sm text-destructive">{err}</p> : null}
      {text ? (
        <textarea readOnly value={text} rows={6} className="mt-4 w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      ) : null}
    </>
  );
}

export function MyIpTool() {
  const [ip, setIp] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const meta = getDevToolBySlug("my-ip");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/dev-tools/my-ip")
      .then((r) => r.json())
      .then((j: { ip?: string }) => {
        if (!cancelled) setIp(j.ip ?? "unknown");
      })
      .catch(() => {
        if (!cancelled) setErr("Could not load IP.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <ToolHeader title="My IP" description="Public IP as seen by this site via the request (may be a proxy or CDN)." category={meta?.category} />
      {err ? <p className="text-sm text-destructive">{err}</p> : null}
      <p className="font-mono text-2xl font-semibold">{ip ?? "…"}</p>
    </>
  );
}

export function MyUserAgentTool() {
  const isClient = useIsClient();
  const meta = getDevToolBySlug("my-user-agent");
  const ua = isClient ? navigator.userAgent : "";
  const plat = isClient ? navigator.platform : "";

  return (
    <>
      <ToolHeader title="My user agent" description="navigator.userAgent and platform — client-side only." category={meta?.category} />
      <dl className="mt-4 space-y-3 font-mono text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">userAgent</dt>
          <dd className="mt-1 break-all rounded border border-border bg-surface p-3">{ua || "…"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">platform</dt>
          <dd className="mt-1 break-all rounded border border-border bg-surface p-3">{plat || "—"}</dd>
        </div>
      </dl>
    </>
  );
}
