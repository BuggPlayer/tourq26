"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
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
        return;
      }
      setStatus("sent");
      setFormData({ name: "", email: "", company: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Name <span className="text-[var(--color-muted)]">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
          className="mt-2 w-full rounded-xl border border-[var(--color-border)]/60 bg-[var(--surface)] px-4 py-3.5 text-white placeholder:text-[var(--color-muted)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white">
          Email <span className="text-[var(--color-muted)]">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
          className="mt-2 w-full rounded-xl border border-[var(--color-border)]/60 bg-[var(--surface)] px-4 py-3.5 text-white placeholder:text-[var(--color-muted)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
          placeholder="you@company.com"
        />
      </div>
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-white">
          Company
        </label>
        <input
          id="company"
          type="text"
          value={formData.company}
          onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
          className="mt-2 w-full rounded-xl border border-[var(--color-border)]/60 bg-[var(--surface)] px-4 py-3.5 text-white placeholder:text-[var(--color-muted)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
          placeholder="Your company (optional)"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-white">
          Message <span className="text-[var(--color-muted)]">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
          className="mt-2 w-full resize-y rounded-xl border border-[var(--color-border)]/60 bg-[var(--surface)] px-4 py-3.5 text-white placeholder:text-[var(--color-muted)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
          placeholder="Tell us about your project, timeline, and what you need..."
        />
      </div>
      {status === "sent" && (
        <p className="text-sm text-[var(--color-primary)]">
          Thanks! We’ve received your message and will get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-400">Something went wrong. Please try again or email hello@torqstudio.com.</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary w-full rounded-full bg-[var(--color-primary)] py-4 text-base font-semibold text-[var(--background)] disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
