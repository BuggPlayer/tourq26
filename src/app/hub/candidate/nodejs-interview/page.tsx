import type { Metadata } from "next";
import { CafeStyleInterviewQA } from "@/components/hub/CafeStyleInterviewQA";
import { nodeJsInterviewQA } from "@/data/nodejs-interview-qa";

export const metadata: Metadata = {
  title: "JavaScript & Node.js interview Q&A | TorqStudio Interview Hub",
  description:
    "Browse JavaScript core, async, Node.js runtime, modules, streams, and security interview questions with answers.",
};

export default function NodeJsInterviewPage() {
  return <CafeStyleInterviewQA items={nodeJsInterviewQA} />;
}
