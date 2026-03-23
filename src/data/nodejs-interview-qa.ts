/**
 * JavaScript / Node.js interview Q&A for TorqStudio Interview Hub.
 *
 * ## How content & “Source:” work (similar to FullStack.Cafe)
 * - **Today:** Static TypeScript. Each item can include optional `source: { name, url? }`
 *   for attribution when an answer is summarized from public docs, a blog, or a book.
 * - **TorqStudio originals:** Omit `source` or set `name: "TorqStudio editorial"`.
 * - **Production:** Candidate UI reads from **MongoDB** (`InterviewBankItem` in the `nodejs` bank) when the
 *   hub DB is on and rows exist; otherwise this bundle is the fallback for that bank. Manage banks at
 *   **Admin → Interview Q&A banks** (`/admin/hub/interview-banks`). Run `npm run db:seed` to import this
 *   file into the `nodejs` bank.
 *   Editors paste content; your app **does not auto-scrape** third-party sites unless you
 *   build an ETL with explicit licensing — always store attribution in `source`.
 */

export type Difficulty = "Easy" | "Mid" | "Hard";

export type NodeJsQABullet = { title: string; text: string };

export type NodeJsQASource = { name: string; url?: string };

export type NodeJsQAItem = {
  id: string;
  categoryId: string;
  question: string;
  /** Always present — used for search + accordion fallback. */
  answer: string;
  difficulty?: Difficulty;
  /** Short label for pill next to difficulty, e.g. "Node.js" */
  categoryBadge?: string;
  /** Opening paragraph(s) under "Answer" */
  answerIntro?: string;
  bullets?: NodeJsQABullet[];
  /** Shown in a dark code block */
  codeExample?: string;
  /** Footer attribution, e.g. { name: "MDN", url: "https://developer.mozilla.org/..." } */
  source?: NodeJsQASource;
};

export const NODEJS_QA_CATEGORIES = [
  { id: "all", label: "All topics" },
  { id: "js-core", label: "JavaScript core" },
  { id: "async", label: "Async & event loop" },
  { id: "node-runtime", label: "Node.js runtime" },
  { id: "modules", label: "Modules & npm" },
  { id: "events-io", label: "Events, streams & HTTP" },
  { id: "perf-sec", label: "Performance & security" },
] as const;

export const nodeJsInterviewQA: NodeJsQAItem[] = [
  {
    id: "1",
    categoryId: "js-core",
    question: "What is hoisting in JavaScript?",
    difficulty: "Easy",
    categoryBadge: "JavaScript",
    answer:
      "Hoisting is the compile-time behavior where `var` declarations and `function` declarations are assigned scope before execution, so they can be referenced earlier in the block/function without a ReferenceError (though `var` initializes as `undefined` until the line runs). `let` and `const` are hoisted too but stay in the temporal dead zone until their declaration line executes. Arrow functions assigned to `const` are not hoisted like `function foo(){}`.",
    source: {
      name: "ECMAScript specification (concept)",
      url: "https://tc39.es/ecma262/",
    },
  },
  {
    id: "2",
    categoryId: "js-core",
    question: "Explain closures with an interview-friendly example.",
    difficulty: "Mid",
    categoryBadge: "JavaScript",
    answer:
      "A closure is a function that retains access to variables from an outer (enclosing) scope even after that outer function returns. Example: a factory `function counter(){ let n=0; return ()=>++n; }` — each returned function closes over its own `n`. Interviewers often probe loops with `var` vs `let` in `setTimeout` callbacks to see if you understand per-iteration binding.",
  },
  {
    id: "3",
    categoryId: "js-core",
    question: "`==` vs `===` — when does it matter?",
    difficulty: "Easy",
    categoryBadge: "JavaScript",
    answer:
      "`===` checks value and type without coercion. `==` applies abstract equality conversion (e.g. `0 == false`). In application code, default to `===` to avoid surprises; know `==` rules for reading legacy code and for `null`/`undefined` checks (`x == null` matches both, sometimes used intentionally).",
    source: { name: "MDN — Equality comparisons", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality" },
  },
  {
    id: "4",
    categoryId: "js-core",
    question: "How does `this` get bound in JavaScript?",
    difficulty: "Mid",
    categoryBadge: "JavaScript",
    answer:
      "In non-strict mode, `this` in a plain function call is the global object (browser: `window`; strict: `undefined`). Method calls set `this` to the receiver. `call`/`apply`/`bind` set it explicitly. Arrow functions inherit `this` from the enclosing lexical scope. In classes, `this` in instance methods refers to the instance (watch unbound methods passed as callbacks — need arrow or `.bind`).",
  },
  {
    id: "5",
    categoryId: "js-core",
    question: "What is the prototype chain?",
    difficulty: "Mid",
    categoryBadge: "JavaScript",
    answer:
      "Each object may delegate property lookups to its prototype (`Object.getPrototypeOf`). That prototype may have its own prototype, forming a chain until `null`. `class` syntax is syntactic sugar over prototype-based inheritance. `hasOwnProperty` distinguishes own vs inherited properties.",
  },
  {
    id: "6",
    categoryId: "async",
    question: "What runs first: a `setTimeout(0)` callback or a resolved Promise `.then`?",
    difficulty: "Mid",
    categoryBadge: "Async",
    answer:
      "Promise reactions (microtasks) run before the next macrotask. So after synchronous code, the microtask queue is drained, then timers/IO callbacks run. Order: sync → microtasks (Promise, queueMicrotask) → macrotasks (`setTimeout`, `setImmediate` in Node in its phase).",
    source: {
      name: "Node.js — Event loop",
      url: "https://nodejs.org/en/learn/asynchronous-discussion/the-nodejs-event-loop",
    },
  },
  {
    id: "7",
    categoryId: "async",
    question: "What is `async/await` syntactic sugar over?",
    difficulty: "Easy",
    categoryBadge: "Async",
    answer:
      "`async` functions return Promises. `await` pauses the async function until the Promise settles, resuming with the value or throwing on rejection. Errors in `await` can be caught with `try/catch`. It does not block the main thread — other tasks run while waiting.",
  },
  {
    id: "8",
    categoryId: "async",
    question: "How do you avoid unhandled Promise rejections?",
    difficulty: "Mid",
    categoryBadge: "Async",
    answer:
      "Always attach `.catch()` or use `try/catch` with `await`. For `Promise.all`, one rejection rejects the whole batch — use `allSettled` when you need every outcome. In Node, unhandled rejections can crash the process depending on flags/version; treat them as bugs.",
  },
  {
    id: "9",
    categoryId: "node-runtime",
    question: "Is Node.js single-threaded?",
    difficulty: "Mid",
    categoryBadge: "Node.js",
    answer:
      "JavaScript execution on the main thread is single-threaded, but Node uses a thread pool (libuv) for some operations (e.g. file system, DNS, some crypto) and can use worker threads. The event loop coordinates callbacks; CPU-heavy JS still blocks the loop — offload with workers or native addons.",
  },
  {
    id: "10",
    categoryId: "node-runtime",
    question: "What are the main phases of the Node.js event loop?",
    difficulty: "Hard",
    categoryBadge: "Node.js",
    answer:
      "Timers → pending callbacks → idle/prepare → poll (I/O) → check (`setImmediate`) → close callbacks. Between phases, microtasks run. Understanding this helps explain ordering of `setImmediate` vs `setTimeout(fn,0)` and why heavy sync work starves I/O.",
    source: {
      name: "Node.js docs — Event loop",
      url: "https://nodejs.org/en/learn/asynchronous-discussion/the-nodejs-event-loop",
    },
  },
  {
    id: "11",
    categoryId: "node-runtime",
    question: "`process.nextTick` vs `setImmediate`?",
    difficulty: "Hard",
    categoryBadge: "Node.js",
    answer:
      "`nextTick` runs before the next event loop phase (still part of the current turn in a sense — can starve I/O if abused). `setImmediate` runs in the check phase after poll. Prefer `setImmediate` for deferring to avoid I/O starvation; use `nextTick` sparingly for breaking up sync work or ensuring ordering before other I/O.",
  },
  {
    id: "12",
    categoryId: "node-runtime",
    question: "What is `Buffer` and why does Node have it?",
    difficulty: "Mid",
    categoryBadge: "Node.js",
    answer:
      "`Buffer` represents binary data (raw bytes). It exists because the web `TypedArray` ecosystem evolved differently; Node historically used Buffers for TCP, files, crypto. Prefer `Buffer.from()` / `Uint8Array` awareness; know that `JSON.stringify` on raw binary needs encoding (e.g. base64).",
    source: { name: "Node.js — Buffer", url: "https://nodejs.org/api/buffer.html" },
  },
  {
    id: "13",
    categoryId: "modules",
    question: "CommonJS vs ES modules in Node?",
    difficulty: "Mid",
    categoryBadge: "Node.js",
    answer:
      "CommonJS uses `require`/`module.exports`; loads are synchronous at runtime (with caching). ESM uses `import`/`export`; static analysis, async loading, top-level await in ESM. Node treats `.cjs`/`.mjs` and `type: module` in package.json. Interop sometimes needs dynamic `import()` from CJS or default exports shape differences.",
    source: { name: "Node.js — Modules", url: "https://nodejs.org/api/modules.html" },
  },
  {
    id: "14",
    categoryId: "modules",
    question: "What is dependency hell and how does npm lockfile help?",
    difficulty: "Easy",
    categoryBadge: "npm",
    answer:
      "Nested/conflicting transitive versions can duplicate packages or break semver assumptions. `package-lock.json` (or `pnpm-lock.yaml`) pins the resolved tree for reproducible installs. Interview angle: know difference between `dependencies` vs `devDependencies` and security audits (`npm audit`).",
  },
  {
    id: "15",
    categoryId: "modules",
    question: "What does `require.resolve` tell you?",
    difficulty: "Easy",
    categoryBadge: "Node.js",
    answer:
      "It returns the resolved path Node would load for a given specifier without executing the module — useful for tooling, path introspection, or verifying resolution in monorepos.",
  },
  {
    id: "16",
    categoryId: "events-io",
    question: "What is the `EventEmitter` pattern?",
    difficulty: "Mid",
    categoryBadge: "Node.js",
    answer:
      "`EventEmitter` (from `events`) lets objects emit named events and register listeners. Used internally by streams, HTTP, etc. Know that adding many listeners without `setMaxListeners` can warn; errors on an `error` event without a listener can crash. Prefer `once()` when appropriate.",
    source: { name: "Node.js — Events", url: "https://nodejs.org/api/events.html" },
  },
  {
    id: "17",
    categoryId: "events-io",
    question: "Readable vs Writable vs Transform streams?",
    difficulty: "Mid",
    categoryBadge: "Node.js",
    answer:
      "Readable produces data (e.g. `fs.createReadStream`), Writable consumes it, Transform duplexes with a mapping in between. Backpressure: `pipe` coordinates so fast producers don’t overwhelm slow consumers. Good for large files and composable I/O.",
  },
  {
    id: "18",
    categoryId: "events-io",
    question: "How does Node handle an HTTP request at a high level?",
    difficulty: "Mid",
    categoryBadge: "Node.js",
    answer:
      "HTTP server receives a socket; Node parses request line/headers and emits a request object with a readable body stream. Response is a writable stream. Keep handlers non-blocking; delegate heavy work to workers or queues. In production you often sit behind a reverse proxy (TLS termination, buffering).",
  },
  {
    id: "19",
    categoryId: "events-io",
    question: "What is middleware in Express-style apps?",
    difficulty: "Mid",
    categoryBadge: "Web",
    answer:
      "Functions `(req, res, next)` that run in sequence; they can end the response or call `next()` to continue. Used for auth, logging, parsing body, errors. Interview: contrast with single handler per route and discuss error-handling middleware `(err, req, res, next)`.",
  },
  {
    id: "20",
    categoryId: "perf-sec",
    question: "How do you debug memory leaks in Node?",
    difficulty: "Hard",
    categoryBadge: "Node.js",
    answer:
      "Use heap snapshots (Chrome DevTools, `node --inspect`), watch `process.memoryUsage()`, look for growing retained objects (closures holding large graphs, global caches without eviction, timers not cleared). In production, use APM and periodic profiling, not just logs.",
  },
  {
    id: "21",
    categoryId: "perf-sec",
    question: "What is `cluster` or `worker_threads` for?",
    difficulty: "Mid",
    categoryBadge: "Node.js",
    answer:
      "`cluster` forks processes sharing ports (older model for scaling CPU on one machine). `worker_threads` share memory less freely but allow parallel JS for CPU work without forking whole processes. For IO-bound APIs, horizontal scaling + stateless services often matters more than threads.",
  },
  {
    id: "22",
    categoryId: "perf-sec",
    question: "Name a few OWASP-style concerns for Node APIs.",
    difficulty: "Mid",
    categoryBadge: "Security",
    answer:
      "Injection (SQL/NoSQL/command), broken auth, sensitive data exposure, XSS (if serving HTML), rate limiting / DoS, dependency vulnerabilities, unsafe `eval`/`child_process` with user input, path traversal on file APIs, JWT misuse (alg:none, weak secrets).",
    source: { name: "OWASP", url: "https://owasp.org/" },
  },
  {
    id: "23",
    categoryId: "js-core",
    question: "What is a `Symbol` used for?",
    difficulty: "Mid",
    categoryBadge: "JavaScript",
    answer:
      "Primitive unique identifier; useful for non-colliding object keys (`Symbol.iterator`), metadata, or library-private properties. Not enumerable in normal `Object.keys` loops unless you use `Reflect.ownKeys`.",
  },
  {
    id: "24",
    categoryId: "async",
    question: "What is `AbortController`?",
    difficulty: "Easy",
    categoryBadge: "Web APIs",
    answer:
      "Web-standard API to signal cancellation to `fetch`, streams, or your own async work via `AbortSignal`. Passing `signal` to `fetch` aborts the request; combine with timeouts for robust clients.",
    source: {
      name: "MDN — AbortController",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
    },
  },
  {
    id: "25",
    categoryId: "node-runtime",
    question: "What is `NODE_ENV` used for?",
    difficulty: "Easy",
    categoryBadge: "Node.js",
    answer:
      "Convention: `development` vs `production`. Many libraries branch behavior (logging verbosity, React optimizations, Express template caching). Set explicitly in deployment; don’t rely on it for security secrets — use real env vars and secret managers.",
  },
  {
    id: "26",
    categoryId: "modules",
    question: "What is tree-shaking?",
    difficulty: "Mid",
    categoryBadge: "JavaScript",
    answer:
      "Bundler elimination of unused ESM exports for smaller bundles. Requires static `import`/`export`; CommonJS is harder to tree-shake. Dead code elimination pairs with minifiers.",
  },
  {
    id: "27",
    categoryId: "events-io",
    question: "What is backpressure in streams?",
    difficulty: "Mid",
    categoryBadge: "Node.js",
    answer:
      "When a consumer cannot keep up, internal buffers grow. APIs like `write()` returning false and `'drain'` events let producers pause/resume. Ignoring backpressure can spike memory.",
  },
  {
    id: "28",
    categoryId: "perf-sec",
    question: "Why avoid blocking the event loop in production?",
    difficulty: "Mid",
    categoryBadge: "Node.js",
    answer:
      "Long synchronous CPU work delays timers, I/O callbacks, and HTTP responses — increasing latency for all clients. Profile hot paths; split work, use workers, or move CPU jobs to a queue service.",
  },
  {
    id: "29",
    categoryId: "async",
    question: "How to avoid Callback Hell in Node.js?",
    difficulty: "Mid",
    categoryBadge: "Node.js",
    answer:
      "Callback hell is deeply nested callbacks that obscure control flow and error handling. Node’s single-threaded event loop still runs your JS on one thread — flatten control flow so I/O chains stay readable. Prefer promises or async functions, modularize steps, and centralize error handling.",
    answerIntro:
      "Nested callbacks make code hard to read and to reason about errors. Interviewers want to hear concrete strategies: flatten with named functions, use Promises with `.then()` chains, or prefer `async`/`await` with `try/catch`. For generator-based flows, libraries historically wrapped `yield` with thunk runners — today `async/await` is the default answer.",
    bullets: [
      {
        title: "Use async/await",
        text: "Sequential async steps read top-to-bottom. Wrap callback APIs with `util.promisify` or manual `new Promise` so you can `await` them.",
      },
      {
        title: "Promise chains with .then()",
        text: "Each step returns a Promise; attach `.catch()` once at the end of the chain for a single error sink.",
      },
      {
        title: "Split into small named functions",
        text: "Avoid anonymous inline callbacks five levels deep — export `function loadUser(id, cb)` style units and compose them.",
      },
      {
        title: "Control-flow utilities",
        text: "`async`/`for await`, `Promise.all` / `allSettled`, or tiny modules like `async` (series/waterfall) when you need patterns beyond raw callbacks.",
      },
    ],
    codeExample: `const fs = require("fs").promises;

async function readConfig(path) {
  try {
    const raw = await fs.readFile(path, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("config failed", err);
    throw err;
  }
}`,
    source: {
      name: "Node.js — Callback pattern (overview)",
      url: "https://nodejs.org/en/learn/asynchronous-discussion/overview-of-blocking-vs-non-blocking",
    },
  },
];

export function getNodeJsQAById(id: string): NodeJsQAItem | undefined {
  return nodeJsInterviewQA.find((q) => q.id === id);
}

export function countQuestionsInCategory(categoryId: string): number {
  return nodeJsInterviewQA.filter((q) => q.categoryId === categoryId).length;
}

export function globalQuestionNumber(id: string): number {
  const i = nodeJsInterviewQA.findIndex((q) => q.id === id);
  return i >= 0 ? i + 1 : 0;
}

/** Plain-text blob for search indexing */
export function searchableTextForItem(item: NodeJsQAItem): string {
  const parts = [item.question, item.answer, item.answerIntro ?? ""];
  if (item.bullets) {
    for (const b of item.bullets) {
      parts.push(b.title, b.text);
    }
  }
  if (item.codeExample) parts.push(item.codeExample);
  return parts.join("\n").toLowerCase();
}
