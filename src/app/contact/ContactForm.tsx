"use client";

import { useState } from "react";

/**
 * Marketing contact form (DESIGN.md → text-input + button-primary).
 * Flat, hairline-bordered inputs; primary black/white CTA at the bottom.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company || undefined,
          message: formData.message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(
          typeof data.error === "string"
            ? data.error
            : "Something went wrong. Please try again or email hello@torqstudio.com.",
        );
        return;
      }
      setStatus("sent");
      setFormData({ name: "", email: "", company: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMessage(
        "Something went wrong. Please try again or email hello@torqstudio.com.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="name"
          label="Name"
          required
          value={formData.name}
          onChange={(v) => setFormData((p) => ({ ...p, name: v }))}
          placeholder="Your name"
        />
        <Field
          id="email"
          label="Email"
          required
          type="email"
          value={formData.email}
          onChange={(v) => setFormData((p) => ({ ...p, email: v }))}
          placeholder="you@company.com"
        />
      </div>
      <Field
        id="company"
        label="Company"
        value={formData.company}
        onChange={(v) => setFormData((p) => ({ ...p, company: v }))}
        placeholder="Your company (optional)"
      />
      <div>
        <label htmlFor="message" className="mono-label block text-muted-foreground">
          MESSAGE <span className="text-foreground">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
          className="text-input mt-2 min-h-[180px] resize-y"
          placeholder="Tell us about your project, timeline, and what you need…"
        />
      </div>
      {status === "sent" && (
        <p className="card-flat text-[15px] leading-[1.5] text-foreground">
          Thanks — we&apos;ve received your message and will get back to you within 24
          hours.
        </p>
      )}
      {status === "error" && (
        <p
          className="text-[14px] text-[color:var(--app-destructive)]"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3 border-t border-hairline pt-6">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-base btn-primary"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <span className="mono-label text-muted-foreground">
          NO COMMITMENT · 24 HOUR REPLY
        </span>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  required = false,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mono-label block text-muted-foreground">
        {label.toUpperCase()}
        {required ? <span className="ml-1 text-foreground">*</span> : null}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-input mt-2"
        placeholder={placeholder}
      />
    </div>
  );
}
