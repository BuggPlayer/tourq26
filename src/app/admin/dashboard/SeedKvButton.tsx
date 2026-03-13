"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SeedKvButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSeed = async () => {
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage(`Seeded: ${data.blog ?? 0} posts, ${data.testimonials ?? 0} testimonials.`);
        router.refresh();
      } else {
        setMessage(data.error || "Seed failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleSeed}
        disabled={loading}
        className={className}
      >
        {loading ? "Seeding…" : "Seed from files → KV (one-time)"}
      </button>
      {message && (
        <p className={`mt-2 text-sm ${message.startsWith("Seeded") ? "text-green-400" : "text-amber-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
