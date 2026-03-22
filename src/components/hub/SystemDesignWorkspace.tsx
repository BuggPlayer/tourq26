"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { toast } from "sonner";

const PALETTE: { type: string; label: string }[] = [
  { type: "user", label: "User / Browser" },
  { type: "cdn", label: "CDN" },
  { type: "origin", label: "Origin / S3" },
  { type: "ssr", label: "Edge SSR" },
  { type: "api", label: "API" },
  { type: "cache", label: "Cache" },
  { type: "nginx", label: "Nginx" },
];

export function SystemDesignWorkspace(props: {
  questionId: string;
  title: string;
  description: string;
  officialTypes: string[];
  officialSolution: string;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [showSolution, setShowSolution] = useState(false);
  const nodeSeq = useRef(0);

  const onConnect = useCallback(
    (c: Connection) => setEdges((eds) => addEdge(c, eds)),
    [setEdges],
  );

  function addNode(item: (typeof PALETTE)[number]) {
    nodeSeq.current += 1;
    const id = `${item.type}-${nodeSeq.current}`;
    setNodes((nds) => [
      ...nds,
      {
        id,
        position: { x: 80 + nds.length * 30, y: 80 + nds.length * 20 },
        data: { label: item.label, nodeType: item.type },
        type: "default",
      },
    ]);
  }

  async function submit() {
    const types = nodes
      .map((n) => (n.data as { nodeType?: string }).nodeType)
      .filter(Boolean) as string[];
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: props.questionId,
        code: "",
        language: "javascript",
        systemDesignTypes: types,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Submit failed");
      return;
    }
    toast.success(data.passed ? "Architecture matches" : "Iterate", {
      description: data.feedback,
    });
  }

  return (
    <div className="space-y-4">
      <Link href="/hub/candidate" className="text-sm text-cyan-400 hover:underline">
        ← Back
      </Link>
      <header>
        <h1 className="font-display text-2xl font-bold text-white">{props.title}</h1>
        <p className="mt-2 text-sm text-slate-400 whitespace-pre-wrap">
          {props.description}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Official building blocks for this prompt:{" "}
          {props.officialTypes.join(", ")}
        </p>
      </header>
      <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Component palette">
        {PALETTE.map((p) => (
          <button
            key={p.type}
            type="button"
            onClick={() => addNode(p)}
            className="rounded-full border border-slate-600 px-3 py-1 text-xs hover:border-cyan-600"
          >
            + {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={submit}
          className="ml-auto rounded-lg bg-cyan-600 px-4 py-1 text-sm font-semibold text-white"
        >
          Submit diagram
        </button>
        <button
          type="button"
          onClick={() => setShowSolution((s) => !s)}
          className="rounded-lg border border-slate-600 px-3 py-1 text-sm"
        >
          {showSolution ? "Hide" : "Show"} solution notes
        </button>
      </div>
      {showSolution && (
        <p className="rounded-lg border border-cyan-900/40 bg-cyan-950/20 p-3 text-sm text-cyan-100">
          {props.officialSolution}
        </p>
      )}
      <div className="h-[480px] rounded-xl border border-slate-700 bg-slate-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          aria-describedby="sd-help"
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
      <p id="sd-help" className="text-xs text-slate-500">
        Drag nodes, connect edges to show data flow. Screen reader: use palette
        buttons to add named components, then submit for automated checks.
      </p>
    </div>
  );
}
