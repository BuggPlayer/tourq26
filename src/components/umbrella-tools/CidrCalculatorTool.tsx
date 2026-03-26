"use client";

import { useMemo, useState } from "react";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import { parseCidr } from "@/lib/umbrella-tools/cidr";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

const TOOL_SLUG = "cidr-calculator";

export default function CidrCalculatorTool() {
  const [input, setInput] = useState("192.168.1.10/24");
  const meta = getDevToolBySlug(TOOL_SLUG);

  const result = useMemo(() => {
    try {
      return parseCidr(input);
    } catch {
      return null;
    }
  }, [input]);

  const err = input.trim() && !result ? "Enter a valid IPv4 CIDR, e.g. 10.0.0.0/16" : null;

  return (
    <>
      <ToolHeader
        title="CIDR calculator"
        description="Given an IPv4 address and prefix length, compute the network, broadcast, mask, and usable hosts."
        category={meta?.category}
      />
      <label className="text-sm font-medium text-muted-foreground">IPv4 CIDR</label>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="192.168.1.0/24"
        className="mt-2 w-full max-w-xl rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
      {err ? <p className="mt-3 text-sm text-destructive">{err}</p> : null}
      {result ? (
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["Network (CIDR)", result.cidr],
              ["Network address", result.networkAddress],
              ["Broadcast", result.broadcastAddress],
              ["Subnet mask", result.subnetMask],
              ["Wildcard mask", result.wildcardMask],
              ["First host", result.firstHost],
              ["Last host", result.lastHost],
              ["Total addresses", String(result.totalHosts)],
              ["Usable hosts", String(result.usableHosts)],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="rounded-xl border border-border/60 bg-surface/80 px-4 py-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{k}</dt>
              <dd className="mt-1 font-mono text-sm text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </>
  );
}
