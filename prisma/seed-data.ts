/**
 * Sample content for TorqStudio Interview Hub seed.
 * starterCode and tests are JSON strings stored in SQLite.
 */

export const companyTagsSeed = [
  { name: "Meta", category: "FAANG" },
  { name: "Google", category: "FAANG" },
  { name: "Amazon", category: "FAANG" },
  { name: "Flipkart", category: "unicorn" },
  { name: "Razorpay", category: "unicorn" },
  { name: "Infosys", category: "service" },
  { name: "TCS", category: "service" },
  { name: "Microsoft", category: "FAANG" },
];

export const preparationPlansSeed = [
  {
    slug: "1-week-sprint",
    name: "1 Week Sprint",
    description: "High-intensity daily blocks for rapid revision.",
    durationDays: 7,
    sortOrder: 1,
    milestones: JSON.stringify([
      { id: "m1", title: "Arrays & strings", questionCount: 5 },
      { id: "m2", title: "Trees & graphs intro", questionCount: 4 },
      { id: "m3", title: "Mock quiz + UI mini", questionCount: 3 },
    ]),
  },
  {
    slug: "1-month-core",
    name: "1 Month Core",
    description: "Balanced DSA, frontend, and system design fundamentals.",
    durationDays: 30,
    sortOrder: 2,
    milestones: JSON.stringify([
      { id: "m1", title: "Foundations", questionCount: 20 },
      { id: "m2", title: "Mid-level patterns", questionCount: 25 },
      { id: "m3", title: "UI + quizzes", questionCount: 15 },
      { id: "m4", title: "System design dry runs", questionCount: 5 },
    ]),
  },
  {
    slug: "3-month-mastery",
    name: "3 Month Mastery",
    description: "Deep preparation with breadth across stacks.",
    durationDays: 90,
    sortOrder: 3,
    milestones: JSON.stringify([
      { id: "m1", title: "DSA deep dive", questionCount: 60 },
      { id: "m2", title: "Multi-framework UI", questionCount: 20 },
      { id: "m3", title: "Design & communication", questionCount: 15 },
    ]),
  },
  {
    slug: "campus-placement",
    name: "Campus Placement Track",
    description: "Curated for college hiring: aptitude-friendly DSA + basics.",
    durationDays: 45,
    sortOrder: 4,
    milestones: JSON.stringify([
      { id: "m1", title: "Easy/Medium DSA", questionCount: 30 },
      { id: "m2", title: "SQL & quizzes", questionCount: 10 },
      { id: "m3", title: "HR + puzzle warmups", questionCount: 5 },
    ]),
  },
];

const dsaStarter = (js: string, py: string, java: string, cpp: string, go: string) =>
  JSON.stringify({ javascript: js, python: py, java: java, cpp: cpp, go: go });

export const questionsSeed: Array<{
  type: "DSA" | "UI" | "QUIZ" | "FRONTEND_SYSTEM_DESIGN";
  title: string;
  description: string;
  difficulty: string;
  topic: string;
  framework?: string | null;
  defaultLanguage?: string | null;
  starterCode?: string | null;
  tests?: string | null;
  officialSolution?: string | null;
  systemDesignMeta?: string | null;
  companyTagNames?: string[];
}> = [
  {
    type: "DSA",
    title: "Two Sum",
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. Assume exactly one solution.",
    difficulty: "easy",
    topic: "arrays",
    defaultLanguage: "javascript",
    starterCode: dsaStarter(
      "function twoSum(nums, target) {\n  // return [i, j]\n}\n",
      "def two_sum(nums, target):\n    pass\n",
      "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[0];\n    }\n}\n",
      "#include <vector>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) {\n    return {};\n}\n",
      "package main\nfunc twoSum(nums []int, target int) []int {\n    return nil\n}\n",
    ),
    tests: JSON.stringify({
      kind: "dsa",
      jsHarness:
        '\nconsole.log(JSON.stringify([twoSum([2,7,11,15],9), twoSum([3,2,4],6)]));',
      pyHarness:
        '\nimport json\nprint(json.dumps([two_sum([2,7,11,15],9), two_sum([3,2,4],6)]))',
      expectedJson: [[0, 1], [1, 2]],
    }),
    officialSolution: "Use a hash map from value to index while scanning; O(n) time.",
    companyTagNames: ["Google", "Amazon"],
  },
  {
    type: "DSA",
    title: "Valid Parentheses",
    description: "Return true if `s` has valid `()`, `[]`, `{}` nesting.",
    difficulty: "easy",
    topic: "stacks",
    defaultLanguage: "javascript",
    starterCode: dsaStarter(
      "function isValid(s) {\n  return false;\n}\n",
      "def is_valid(s: str) -> bool:\n    return False\n",
      "class Solution {\n    public boolean isValid(String s) { return false; }\n}\n",
      "#include <string>\nusing namespace std;\nbool isValid(string s) { return false; }\n",
      "package main\nfunc isValid(s string) bool { return false }\n",
    ),
    tests: JSON.stringify({
      kind: "dsa",
      jsHarness: '\nconsole.log(JSON.stringify([isValid("()"), isValid("([)]")]));',
      pyHarness:
        '\nimport json\nprint(json.dumps([is_valid("()"), is_valid("([)]")]))',
      expectedJson: [true, false],
    }),
    officialSolution: "Stack push on open, pop and match on close.",
    companyTagNames: ["Meta", "Microsoft"],
  },
  {
    type: "DSA",
    title: "Binary Search",
    description: "Return index of `target` in sorted `nums` or -1.",
    difficulty: "easy",
    topic: "search",
    defaultLanguage: "javascript",
    starterCode: dsaStarter(
      "function search(nums, target) {\n  return -1;\n}\n",
      "def search(nums, target):\n    return -1\n",
      "class Solution {\n    public int search(int[] nums, int target) { return -1; }\n}\n",
      "int search(vector<int>& nums, int target) { return -1; }\n",
      "func search(nums []int, target int) int { return -1 }\n",
    ),
    tests: JSON.stringify({
      kind: "dsa",
      jsHarness:
        '\nconsole.log(JSON.stringify([search([-1,0,3,5,9,12],9), search([-1,0,3,5,9,12],2)]));',
      pyHarness:
        '\nimport json\nprint(json.dumps([search([-1,0,3,5,9,12],9), search([-1,0,3,5,9,12],2)]))',
      expectedJson: [4, -1],
    }),
    officialSolution: "Classic binary search on indices.",
    companyTagNames: ["Flipkart"],
  },
  {
    type: "DSA",
    title: "Maximum Subarray (Kadane)",
    description: "Return the largest sum of a contiguous subarray.",
    difficulty: "medium",
    topic: "arrays",
    defaultLanguage: "python",
    starterCode: dsaStarter(
      "function maxSubArray(nums) { return 0; }\n",
      "def max_sub_array(nums):\n    return 0\n",
      "class Solution {\n    public int maxSubArray(int[] nums) { return 0; }\n}\n",
      "int maxSubArray(vector<int>& nums) { return 0; }\n",
      "func maxSubArray(nums []int) int { return 0 }\n",
    ),
    tests: JSON.stringify({
      kind: "dsa",
      jsHarness:
        '\nconsole.log(JSON.stringify([maxSubArray([-2,1,-3,4,-1,2,1,-5,4]), maxSubArray([1])]));',
      pyHarness:
        '\nimport json\nprint(json.dumps([max_sub_array([-2,1,-3,4,-1,2,1,-5,4]), max_sub_array([1])]))',
      expectedJson: [6, 1],
    }),
    officialSolution: "Kadane: track current best ending here.",
    companyTagNames: ["Amazon", "Google"],
  },
  {
    type: "DSA",
    title: "Reverse Linked List",
    description: "Reverse a singly linked list (simulate with array for Piston).",
    difficulty: "easy",
    topic: "linked-list",
    defaultLanguage: "javascript",
    starterCode: dsaStarter(
      "function reverseList(arr) {\n  return arr.reverse();\n}\n",
      "def reverse_list(arr):\n    return arr[::-1]\n",
      "class Solution {\n    public int[] reverseList(int[] arr) {\n        return arr;\n    }\n}\n",
      "vector<int> reverseList(vector<int> arr) { return arr; }\n",
      "func reverseList(arr []int) []int { return arr }\n",
    ),
    tests: JSON.stringify({
      kind: "dsa",
      jsHarness: '\nconsole.log(JSON.stringify(reverseList([1,2,3,4])));',
      pyHarness: '\nimport json\nprint(json.dumps(reverse_list([1,2,3,4])))',
      expectedJson: [4, 3, 2, 1],
    }),
    officialSolution: "Iterative pointer reversal (array version: reverse).",
    companyTagNames: ["Razorpay"],
  },
  {
    type: "DSA",
    title: "Climbing Stairs",
    description: "Count ways to reach step `n` taking 1 or 2 steps.",
    difficulty: "easy",
    topic: "dp",
    defaultLanguage: "javascript",
    starterCode: dsaStarter(
      "function climbStairs(n) { return 0; }\n",
      "def climb_stairs(n):\n    return 0\n",
      "class Solution {\n    public int climbStairs(int n) { return 0; }\n}\n",
      "int climbStairs(int n) { return 0; }\n",
      "func climbStairs(n int) int { return 0 }\n",
    ),
    tests: JSON.stringify({
      kind: "dsa",
      jsHarness: '\nconsole.log(JSON.stringify([climbStairs(3), climbStairs(5)]));',
      pyHarness:
        '\nimport json\nprint(json.dumps([climb_stairs(3), climb_stairs(5)]))',
      expectedJson: [3, 8],
    }),
    officialSolution: "Fibonacci: f(n)=f(n-1)+f(n-2).",
    companyTagNames: ["TCS", "Infosys"],
  },
  {
    type: "DSA",
    title: "Merge Intervals",
    description: "Merge overlapping intervals `[[start,end],...]`.",
    difficulty: "medium",
    topic: "intervals",
    defaultLanguage: "python",
    starterCode: dsaStarter(
      "function merge(intervals) { return intervals; }\n",
      "def merge(intervals):\n    return intervals\n",
      "class Solution {\n    public int[][] merge(int[][] intervals) { return intervals; }\n}\n",
      "vector<vector<int>> merge(vector<vector<int>> intervals) { return intervals; }\n",
      "func merge(intervals [][]int) [][]int { return intervals }\n",
    ),
    tests: JSON.stringify({
      kind: "dsa",
      jsHarness:
        '\nconsole.log(JSON.stringify(merge([[1,3],[2,6],[8,10],[15,18]])));',
      pyHarness:
        '\nimport json\nprint(json.dumps(merge([[1,3],[2,6],[8,10],[15,18]])))',
      expectedJson: [
        [1, 6],
        [8, 10],
        [15, 18],
      ],
    }),
    officialSolution: "Sort by start, sweep and merge.",
    companyTagNames: ["Google"],
  },
  {
    type: "DSA",
    title: "Number of Islands",
    description: "Count islands in a binary grid (use 2D array as JSON string in tests — simplified: return count for fixed grid in code).",
    difficulty: "medium",
    topic: "graphs",
    defaultLanguage: "javascript",
    starterCode: dsaStarter(
      "function numIslands(grid) {\n  return 1;\n}\n",
      "def num_islands(grid):\n    return 1\n",
      "class Solution {\n    public int numIslands(char[][] grid) { return 1; }\n}\n",
      "int numIslands(vector<vector<char>>& grid) { return 1; }\n",
      "func numIslands(grid [][]byte) int { return 1 }\n",
    ),
    tests: JSON.stringify({
      kind: "dsa",
      jsHarness:
        '\nconst g=[["1","1","0"],["1","0","0"],["0","0","1"]];console.log(JSON.stringify(numIslands(g)));',
      pyHarness:
        '\nimport json\ng=[["1","1","0"],["1","0","0"],["0","0","1"]];print(json.dumps(num_islands(g)))',
      expectedJson: 2,
    }),
    officialSolution: "DFS/BFS flood fill for each unvisited `1`.",
    companyTagNames: ["Amazon", "Microsoft"],
  },
  {
    type: "UI",
    title: "Counter with label",
    description:
      "Build a counter: a button increments count; show the count in an element with `id=\"out\"`. Starter uses vanilla HTML/JS.",
    difficulty: "easy",
    topic: "components",
    framework: "vanilla",
    starterCode: JSON.stringify({
      html: `<!DOCTYPE html><html><body>
<button id="btn">Add</button>
<span id="out">0</span>
<script>
let c=0; document.getElementById('btn').onclick=()=>{c++;document.getElementById('out').textContent=c};
</script></body></html>`,
    }),
    tests: JSON.stringify({
      kind: "ui",
      mustContain: ['id="out"', "getElementById"],
    }),
    officialSolution: "Keep state in JS, update DOM text on click.",
    companyTagNames: ["Flipkart"],
  },
  {
    type: "UI",
    title: "Toggle theme chip",
    description: "Create a clickable chip with `id=\"chip\"` that toggles text between Light and Dark.",
    difficulty: "easy",
    topic: "interactivity",
    framework: "vanilla",
    starterCode: JSON.stringify({
      html: `<!DOCTYPE html><html><body>
<div id="chip" role="button" tabindex="0">Light</div>
<script>
const el=document.getElementById('chip');
el.addEventListener('click',()=>{
  el.textContent = el.textContent==='Light'?'Dark':'Light';
});
</script></body></html>`,
    }),
    tests: JSON.stringify({ kind: "ui", mustContain: ['id="chip"'] }),
    officialSolution: "Toggle textContent on click.",
    companyTagNames: ["Razorpay"],
  },
  {
    type: "UI",
    title: "React: greeting input",
    description:
      "React template: sync input value to a greeting `h1` with `data-testid=\"greet\"`. Export default App.",
    difficulty: "medium",
    topic: "react",
    framework: "react",
    starterCode: JSON.stringify({
      html: `<!DOCTYPE html><html><body><div id="root"></div>
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
function App(){
  const [name,setName]=React.useState('');
  return (
    <main>
      <input aria-label="name" value={name} onChange={e=>setName(e.target.value)} />
      <h1 data-testid="greet">Hello {name}</h1>
    </main>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script></body></html>`,
    }),
    tests: JSON.stringify({ kind: "ui", mustContain: ['data-testid="greet"'] }),
    officialSolution: "Controlled input + derived h1.",
    companyTagNames: ["Meta"],
  },
  {
    type: "UI",
    title: "Vue-style list (vanilla)",
    description: "Render a `ul#list` with three `li` items: Alpha, Beta, Gamma.",
    difficulty: "easy",
    topic: "vue",
    framework: "vue",
    starterCode: JSON.stringify({
      html: `<!DOCTYPE html><html><body><ul id="list"></ul>
<script>
const items=['Alpha','Beta','Gamma'];
const ul=document.getElementById('list');
items.forEach(t=>{const li=document.createElement('li');li.textContent=t;ul.appendChild(li);});
</script></body></html>`,
    }),
    tests: JSON.stringify({ kind: "ui", mustContain: ['id="list"', "<li"] }),
    officialSolution: "Create elements in a loop.",
    companyTagNames: ["Infosys"],
  },
  {
    type: "UI",
    title: "Angular-ish form validation",
    description: "Email input `id=\"email\"` shows `id=\"err\"` when value lacks `@`.",
    difficulty: "medium",
    topic: "forms",
    framework: "angular",
    starterCode: JSON.stringify({
      html: `<!DOCTYPE html><html><body>
<input id="email" />
<p id="err" hidden>Invalid</p>
<script>
const i=document.getElementById('email');
const e=document.getElementById('err');
i.addEventListener('input',()=>{
  e.hidden = i.value.includes('@');
});
</script></body></html>`,
    }),
    tests: JSON.stringify({ kind: "ui", mustContain: ['id="email"', 'id="err"'] }),
    officialSolution: "Input listener toggles visibility.",
    companyTagNames: ["TCS"],
  },
  {
    type: "QUIZ",
    title: "JS: event loop",
    description: "What prints first?",
    difficulty: "easy",
    topic: "javascript",
    tests: JSON.stringify({
      kind: "quiz",
      options: [
        "setTimeout before console.log",
        "console.log before setTimeout callback",
        "Both at same time",
        "Runtime error",
      ],
      correctIndex: 1,
      explanation: "Sync code runs before macrotasks queued by setTimeout.",
    }),
    officialSolution: "B",
    companyTagNames: ["Google"],
  },
  {
    type: "QUIZ",
    title: "React keys",
    description: "Why are stable keys important in lists?",
    difficulty: "easy",
    topic: "react",
    tests: JSON.stringify({
      kind: "quiz",
      options: [
        "SEO only",
        "Help React reconcile list items efficiently",
        "Required for CSS",
        "Encryption",
      ],
      correctIndex: 1,
      explanation: "Keys identify siblings for reconciliation.",
    }),
    officialSolution: "B",
    companyTagNames: ["Meta"],
  },
  {
    type: "QUIZ",
    title: "HTTP idempotent methods",
    description: "Which is idempotent?",
    difficulty: "medium",
    topic: "web",
    tests: JSON.stringify({
      kind: "quiz",
      options: ["POST", "PATCH", "GET", "CONNECT"],
      correctIndex: 2,
      explanation: "GET should not change server state; repeated GETs are safe.",
    }),
    officialSolution: "C",
    companyTagNames: ["Amazon"],
  },
  {
    type: "QUIZ",
    title: "Big-O: binary search",
    description: "Average time complexity of binary search on sorted array?",
    difficulty: "easy",
    topic: "complexity",
    tests: JSON.stringify({
      kind: "quiz",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      correctIndex: 1,
      explanation: "Halve search space each step.",
    }),
    officialSolution: "B",
    companyTagNames: ["Microsoft"],
  },
  {
    type: "QUIZ",
    title: "CSS specificity",
    description: "Which wins: `.a` or `#b`?",
    difficulty: "easy",
    topic: "css",
    tests: JSON.stringify({
      kind: "quiz",
      options: [".a", "#b", "Whichever comes last in file always", "They tie"],
      correctIndex: 1,
      explanation: "ID selectors outweigh class selectors.",
    }),
    officialSolution: "B",
    companyTagNames: ["Flipkart"],
  },
  {
    type: "QUIZ",
    title: "SQL: PRIMARY KEY",
    description: "PRIMARY KEY implies?",
    difficulty: "easy",
    topic: "sql",
    tests: JSON.stringify({
      kind: "quiz",
      options: [
        "Nullable unique index",
        "Unique + not null row identifier",
        "Foreign key",
        "Full-text search",
      ],
      correctIndex: 1,
      explanation: "PK uniquely identifies rows and is NOT NULL.",
    }),
    officialSolution: "B",
    companyTagNames: ["Infosys"],
  },
  {
    type: "QUIZ",
    title: "Go: goroutines",
    description: "Goroutines are:",
    difficulty: "medium",
    topic: "go",
    tests: JSON.stringify({
      kind: "quiz",
      options: [
        "OS threads only",
        "Lightweight concurrent functions scheduled by the runtime",
        "GPU shaders",
        "Database connections",
      ],
      correctIndex: 1,
      explanation: "The Go runtime multiplexes goroutines onto threads.",
    }),
    officialSolution: "B",
    companyTagNames: ["Google"],
  },
  {
    type: "QUIZ",
    title: "Accessibility: focus",
    description: "Which is essential for keyboard users?",
    difficulty: "easy",
    topic: "a11y",
    tests: JSON.stringify({
      kind: "quiz",
      options: [
        "Animations",
        "Visible focus styles and logical tab order",
        "Parallax",
        "Auto-playing video",
      ],
      correctIndex: 1,
      explanation: "WCAG requires focus visibility and meaningful sequence.",
    }),
    officialSolution: "B",
    companyTagNames: ["Microsoft"],
  },
  {
    type: "QUIZ",
    title: "REST vs GraphQL",
    description: "GraphQL primarily reduces:",
    difficulty: "medium",
    topic: "apis",
    tests: JSON.stringify({
      kind: "quiz",
      options: [
        "DNS lookups",
        "Over/under-fetching by letting clients specify fields",
        "TLS handshakes",
        "CSS bundle size",
      ],
      correctIndex: 1,
      explanation: "Clients request exactly the shape they need.",
    }),
    officialSolution: "B",
    companyTagNames: ["Razorpay"],
  },
  {
    type: "QUIZ",
    title: "Docker image vs container",
    description: "An image is:",
    difficulty: "easy",
    topic: "devops",
    tests: JSON.stringify({
      kind: "quiz",
      options: [
        "A running process namespace",
        "A read-only template used to spawn containers",
        "A VM disk",
        "A CI log",
      ],
      correctIndex: 1,
      explanation: "Images are immutable layers; containers are runnable instances.",
    }),
    officialSolution: "B",
    companyTagNames: ["Amazon"],
  },
  {
    type: "FRONTEND_SYSTEM_DESIGN",
    title: "Global CDN static site",
    description:
      "Drag components to show: users → CDN → S3 static bucket. Official nodes: cdn, origin, user.",
    difficulty: "medium",
    topic: "cdn",
    systemDesignMeta: JSON.stringify({
      officialNodeTypes: ["user", "cdn", "origin"],
    }),
    officialSolution: "Terminate static assets at CDN with origin in object storage.",
    companyTagNames: ["Amazon", "Google"],
  },
  {
    type: "FRONTEND_SYSTEM_DESIGN",
    title: "SSR product page",
    description: "Illustrate browser → CDN → edge SSR → API → cache layers.",
    difficulty: "hard",
    topic: "ssr",
    systemDesignMeta: JSON.stringify({
      officialNodeTypes: ["browser", "cdn", "ssr", "api", "cache"],
    }),
    officialSolution: "Edge SSR for TTFB, API for dynamic fragments, cache hot reads.",
    companyTagNames: ["Meta", "Flipkart"],
  },
];
