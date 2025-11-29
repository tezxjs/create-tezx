import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TemplateReturnType } from "../template/utils.js";
import { version } from "../version.js";

let defaultReadme = `
# ⚡ TezX – High-Performance JavaScript Framework for **Bun**

**TezX** is a modern, ultra-fast, and lightweight JavaScript framework built specifically for **Bun**.
With a clean API, powerful routing, WebSocket support, middleware stacking, and native static file serving — TezX helps you build scalable applications with unmatched speed.

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/tezxjs/TezX)

---

## 🚀 Why TezX (Built for Bun)?

* ⚡ **Blazing Fast** — Fully optimized for Bun’s event loop & native performance.
* 🧩 **Minimal, Clean API** — Developer-friendly and intuitive.
* 🗂 **Native Static Serving** — No external dependencies needed.
* 🔌 **Powerful Middleware Engine** — Compose any logic effortlessly.
* 🧭 **Advanced Routing** — Dynamic, nested, and pattern-based.
* 🔐 **Secure by Default** — Built-in safe context handling.
* 📡 **WebSocket Support** — Real-time apps made easy with \`wsHandlers\`.
* ♻️ **Multi-Process Ready** — Via Bun’s \`reusePort\`.

---

## 📦 Installation

\`\`\`bash
bun add tezx
# or
npm install tezx
\`\`\`

---

## ⚡ Quick Start (Bun)

\`\`\`ts
import { TezX } from "tezx";
import { logger } from "tezx/middleware";
import { serveStatic } from "tezx/static";
import { wsHandlers } from "tezx/ws";

const app = new TezX();

// Middlewares
app.use(logger());

// Static files
app.static(serveStatic("/", "./static"));

// Route
app.get("/", (ctx) =>
  ctx.html(\`
    <h1>Welcome to TezX</h1>
    <p>High-performance JavaScript framework optimized for Bun.</p>
\`)
);

// Server
const port = Number(process.env.PORT) || 3001;

Bun.serve({
  port,
  reusePort: true,
  fetch(req, server) {
    return app.serve(req, server);
  },
  websocket: wsHandlers({
    // Optional WebSocket config
  }),
});

console.log(\`🚀 TezX server running at http://localhost:$\{port}\`);
\`\`\`

---

## ▶ Run the Server

\`\`\`bash
bun run server.ts
  \`\`\`

---

## 🔌 Middleware Example

\`\`\`ts
app.use((ctx, next) => {
  console.log("➡ Request:", ctx.req.url);
  return next();
});
\`\`\`

---

## 🗂 Static File Serving

\`\`\`ts
import { serveStatic } from "tezx/static";

app.static(serveStatic("/assets", "./assets"));
\`\`\`

Access via:

\`\`\`bash
http://localhost:3001/assets/your-file.ext
\`\`\`

---

## 🧭 Routing

\`\`\`ts
app.get("/about", (ctx) => ctx.html("<h1>About TezX</h1>"));

app.post("/contact", async (ctx) => {
  const body = await ctx.json();
  return ctx.json({ received: body });
});
\`\`\`

---

## ⚠️ Error Handling

\`\`\`ts
app.onError((err, ctx) => {
  return ctx.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});
\`\`\`

---

## 🧪 Development Setup

### \`dev\` script for Bun

**package.json**

\`\`\`json
{
  "scripts": {
    "dev": "bun run --hot --watch src/index.ts"
  }
}
\`\`\`

### Example: \`src / index.ts\`

\`\`\`ts
import app from "./app";

Bun.serve({
  port: 3001,
  reusePort: true,
  fetch(req, server) {
    return app.serve(req, server);
  },
});
\`\`\`

---

## 🤝 Contributing

We welcome contributions!

1. Fork the repo
2. Create a new branch
3. Commit your changes
4. Open a pull request

👉 GitHub: **[https://github.com/tezxjs](https://github.com/tezxjs)**

---

## 💖 Support TezX

If TezX helps you, consider supporting:

* ⭐ Star on GitHub
* 💸 Sponsor on GitHub: [https://github.com/sponsors/srakib17](https://github.com/sponsors/srakib17)

Your support helps improve the framework.

---

`
export let index = ({
  ts,
  template,
  root,
  useStatic = false, staticFolder }: {
    ts: boolean,
    template?: TemplateReturnType,
    root: string,
    useStatic?: boolean,
    staticFolder: string,
  }) => {

  const mainFile = join(root, ts ? "src/index.ts" : "src/index.js");

  mkdirSync(join(root, "src"), { recursive: true });
  let footer = "";

  template?.import?.push(`import { wsHandlers } from "tezx/ws";`)
  footer = `
let PORT = Number(process.env.PORT) || 3000;
Bun.serve({
  port: PORT,
  reusePort: true, // Enables multi-process clustering
  fetch(req, server) {
    return app.serve(req, server); // Handle requests via TezX
  },
  websocket: wsHandlers({
    // Optional WebSocket configure
  })
});
console.log(\`🚀 TezX is running at http://localhost:$\{PORT\}\`);
    `
  let code = `
import { TezX } from "tezx";
import { serveStatic } from "tezx/static";
import { logger } from "tezx/middleware";
${template?.import?.join("\n")}
const app = new TezX({
    debugMode: true,
    // Additional options
});
app.use([logger()]);

app.get("/", (ctx) => ctx.text("Hello from TezX"));

${useStatic ? `app.static(serveStatic("${staticFolder || "public"}"));` : ""}
${template?.content ? `\n${template?.content?.trim()}\n` : ""}
${footer}
`;

  if (ts) {
    const tsconfig = `
{
  "compilerOptions": {
    "module": "esnext",
    "target": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "allowImportingTsExtensions": true,
    "noEmit": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
    `.trim();
    writeFileSync(join(root, 'tsconfig.json'), tsconfig);
  }
  writeFileSync(mainFile, code.trim());
}
export let packageJson = ({
  template,
  root,
  projectName,
  ts,
  useWS,
  choiceStep
}: {
  choiceStep: {
    cd: string;
    install: string;
    dev: string;
    build: string;
  },
  template: TemplateReturnType,
  root: string,
  projectName: string,
  ts?: boolean,
  useWS?: boolean
}) => {

  let install: string[] = [];

  // Add template packages
  if (Array.isArray(template?.package)) {
    template?.package?.forEach((p) => {
      let { version, npm } = p as any || {};
      install.push(`"${npm?.[1]}": "${version}"`);
    });
  }

  // Base devDependencies
  let devDeps = [
    `"@types/bun": "^1.3.1"`
  ];

  // If TypeScript enabled → add TS + Node types
  if (ts) {
    devDeps.push(`"typescript": "^5.8.2"`);
    devDeps.push(`"@types/node": "^22.13.14"`);
  }

  let json = `
{
  "name": "${projectName || "tezx-app-example"}",
  "version": "1.0.0",
  "type": "module",
  "description": "TezX is a high-performance, lightweight JavaScript framework designed for speed, scalability, and flexibility. It enables efficient routing, middleware management, and static file serving with minimal configuration.",
  "scripts": {
    "start": "bun src/index${ts ? ".ts" : ".js"}",
    "dev": "bun --hot --watch src/index${ts ? ".ts" : ".js"}",
    "type-check": ${ts ? `"tsc --noEmit"` : `"echo 'No TypeScript configured'"`}
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/tezxjs/tezx-app-example"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/tezxjs/tezx-app-example"
  },
  "homepage": "https://github.com/tezxjs/tezx-app-example",
  "dependencies": {
    "tezx": "^${version}"${install.length ? `,\n    ${install.join(",\n    ")}` : ""}
  },
  "devDependencies": {
    ${devDeps.join(",\n    ")}
  }
}
`.trim();

  writeFileSync(join(root, "package.json"), json);
};


export const gitignore = ({ root }: { root: string }) => {
  const file = `
# Node dependencies
node_modules/
.env
.env.local
.env.*.local

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*


# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Dependency directories
node_modules/
package/example-ts/node_modules/
package/example-commonjs/node_modules/
package/example-js-module/node_modules/
package-lock.json
bun.lock

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*


# Build outputs
dist/
build/
.cache/
.tezx/
out/

# System files
.DS_Store
Thumbs.db


# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# Editor settings
.vscode/
.idea/
*.swp
  `.trim();

  writeFileSync(join(root, ".gitignore"), file, { encoding: "utf8" });
};



export const README = ({ root, readme }: { readme?: string, root: string }) => {
  const file = (typeof readme == 'string' && readme) ? readme?.trim() : defaultReadme.trim();
  writeFileSync(join(root, "README.md"), file, { encoding: "utf8" });
};
