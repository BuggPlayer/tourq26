/** Default snippets when switching language — industry-style starters. */
export type PlaygroundLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "cpp"
  | "go"
  | "html";

export const PLAYGROUND_LANGUAGES: {
  id: PlaygroundLanguage;
  label: string;
  monaco: string;
  /** If true, run is client-only (no /api/run). */
  clientOnly: boolean;
}[] = [
  { id: "javascript", label: "JavaScript", monaco: "javascript", clientOnly: false },
  { id: "typescript", label: "TypeScript", monaco: "typescript", clientOnly: false },
  { id: "python", label: "Python", monaco: "python", clientOnly: false },
  { id: "java", label: "Java", monaco: "java", clientOnly: false },
  { id: "cpp", label: "C++", monaco: "cpp", clientOnly: false },
  { id: "go", label: "Go", monaco: "go", clientOnly: false },
  { id: "html", label: "HTML", monaco: "html", clientOnly: true },
];

export const CODE_PLAYGROUND_STARTERS: Record<PlaygroundLanguage, string> = {
  javascript: `// Node-style stdout (Piston)
console.log("Hello from JavaScript");

const n = [1, 2, 3, 4, 5];
console.log("sum =", n.reduce((a, b) => a + b, 0));
`,
  typescript: `const greet = (name: string): string => \`Hello, \${name}!\`;
console.log(greet("TypeScript"));

type Point = { x: number; y: number };
const p: Point = { x: 3, y: 4 };
console.log("distance^2 =", p.x * p.x + p.y * p.y);
`,
  python: `def main():
    xs = [1, 2, 3, 4, 5]
    print("sum =", sum(xs))

if __name__ == "__main__":
    main()
`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java");
        int s = 0;
        for (int i = 1; i <= 10; i++) s += i;
        System.out.println("1..10 sum = " + s);
    }
}
`,
  cpp: `#include <iostream>
#include <vector>

int main() {
    std::cout << "Hello from C++\\n";
    std::vector<int> v = {1, 2, 3, 4, 5};
    int s = 0;
    for (int x : v) s += x;
    std::cout << "sum = " << s << "\\n";
    return 0;
}
`,
  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello from Go")
    sum := 0
    for i := 1; i <= 10; i++ {
        sum += i
    }
    fmt.Println("1..10 sum =", sum)
}
`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Preview</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 2rem; background: #0f1419; color: #e6edf3; }
    h1 { color: #58a6ff; }
  </style>
</head>
<body>
  <h1>Hello, HTML preview</h1>
  <p>Edit this document and click <strong>Run</strong> to refresh the preview.</p>
  <script>
    console.log("Script runs in the preview iframe");
  </script>
</body>
</html>
`,
};
