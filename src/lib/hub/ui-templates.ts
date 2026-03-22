/** HTML + inline script starter templates for UI coding tracks (injected into Monaco). */

export const UI_TEMPLATES: Record<string, string> = {
  vanilla: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Preview</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 1rem; }
    button { padding: 0.5rem 1rem; cursor: pointer; }
  </style>
</head>
<body>
  <button id="btn">Add</button>
  <span id="out">0</span>
  <script>
    let c = 0;
    document.getElementById("btn").onclick = () => {
      c++;
      document.getElementById("out").textContent = String(c);
    };
  </script>
</body>
</html>`,
  react: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>body { font-family: system-ui; padding: 1rem; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    function App() {
      const [n, setN] = React.useState(0);
      return (
        <main>
          <button type="button" onClick={() => setN(n + 1)}>Add</button>
          <h1 data-testid="greet">Count {n}</h1>
        </main>
      );
    }
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);
  </script>
</body>
</html>`,
  vue: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Vue 3 (CDN)</title></head>
<body>
  <div id="app"></div>
  <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
  <script>
    const { createApp, ref } = Vue;
    createApp({
      setup() {
        const n = ref(0);
        return { n };
      },
      template: '<button type="button" @click="n++">Add</button><p id="out">{{ n }}</p>'
    }).mount("#app");
  </script>
</body>
</html>`,
  angular: `<!-- Simplified "Angular-style" imperative demo in iframe without CLI -->
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Angular-style</title></head>
<body>
  <input id="email" placeholder="email" />
  <p id="err" hidden>Need @</p>
  <script>
    const i = document.getElementById("email");
    const e = document.getElementById("err");
    i.addEventListener("input", () => { e.hidden = i.value.includes("@"); });
  </script>
</body>
</html>`,
  svelte: `<!-- Svelte typically needs a build; this is a compact reactive-style vanilla fallback -->
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Svelte-style</title></head>
<body>
  <button id="b">0</button>
  <script>
    let x = 0;
    const b = document.getElementById("b");
    b.onclick = () => { x++; b.textContent = String(x); };
  </script>
</body>
</html>`,
};
