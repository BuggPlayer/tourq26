"use client";

import { useEffect, useState } from "react";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

const TOOL_SLUG = "qr-code-generator";

export default function QrCodeTool() {
  const [text, setText] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const meta = getDevToolBySlug(TOOL_SLUG);

  useEffect(() => {
    const t = text.trim();
    if (!t) {
      setDataUrl("");
      setError(null);
      return;
    }
    let cancelled = false;
    import("qrcode")
      .then(({ default: QRCode }) =>
        QRCode.toDataURL(t, { width: 280, margin: 2, errorCorrectionLevel: "M" }),
      )
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url);
          setError(null);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setDataUrl("");
          setError(e.message || "Could not generate QR code.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [text]);

  return (
    <>
      <ToolHeader
        title="QR code generator"
        description="Encode URLs, Wi‑Fi strings, or any short text as a QR code PNG (data URL). Generated in your browser."
        category={meta?.category}
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Content</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="https://example.com or any text…"
            className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col items-center justify-start gap-4 rounded-xl border border-border/60 bg-surface/50 p-6">
          {dataUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- dynamic PNG data URL from qrcode */}
              <img src={dataUrl} alt="Generated QR code" width={280} height={280} className="rounded-lg bg-white p-2" />
            </>
          ) : (
            <div className="flex h-[280px] w-[280px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              {error ?? "Type or paste content…"}
            </div>
          )}
          {dataUrl ? (
            <a
              href={dataUrl}
              download="qrcode.png"
              className="text-sm font-medium text-primary underline-offset-2 hover:underline"
            >
              Download PNG
            </a>
          ) : null}
        </div>
      </div>
    </>
  );
}
