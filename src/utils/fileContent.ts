import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TemplateObjectType } from "../template/utils.js";
import { version } from "../version.js";

let defaultReadme = `
# 🚀 TezX Starter Template

Welcome to the **TezX Starter Template** — a blazing-fast, full-featured backend template built on [TezX](https://github.com/tezxjs/tezx), the lightweight web framework inspired by the best of Express, Hono, and Bun.

This starter is designed to help you spin up production-ready APIs or SSR apps in seconds.

---

## ✨ Features

- ⚡️ Ultra-fast routing & middleware
- 🔒 Built-in WebSocket & OAuth2-ready
- 🔧 Plug-and-play \`ViewEngine\` for SSR
- 🌱 Environment-based config support
- 🧪 Minimal, testable, and extendable codebase

---

## 📦 Tech Stack

- **Framework:** [TezX](https://github.com/tezxjs/tezx)
- **Language:** TypeScript / JavaScript
- **Template Engine (optional):** \`ejs\`, \`pug\`, \`hbs\`, \`mustache\`, or \`nunjucks\`
- **Runtime Support:** Node.js, Bun, Deno (via compatibility)

---

## 🛠️ Getting Started

### 1. Install Dependencies

\`\`\`bash
npm install
# or
bun install
\`\`\`\`

### 2. Start Development Server

\`\`\`bash
npm run dev
# or
bun run dev
\`\`\`

### 3. Open in Browser

\`\`\`bash
http://localhost:3000
\`\`\`

---

## 🔐 Environment Variables

Create a \`.env\` file at the project root:

\`\`\`bash
PORT=3000
NODE_ENV=development

# For OAuth2 templates
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
\`\`\`

---

## 📁 Project Structure

\`\`\`
.
├── public/             # Static files (images, js, css)
├── views/              # SSR templates (optional)
├── src/
│   ├── index.ts        # Entry point
│   └── routes/         # Route modules
├── .env
├── .gitignore
└── package.json
\`\`\`

---

## 🧪 Example Commands

\`\`\`bash
# Build the app
bun run build

# Start the server in production
bun start

# Run a TezX test (if added)
bun test
\`\`\`

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT © [SRAKIB17](https://github.com/SRAKIB17)

---

## 💚 Powered by

[TezX Framework](https://github.com/tezxjs/TezX) · Made with performance in mind

---

`
export let index = ({
  ts,
  template,
  root,
  env, useStatic = false, staticFolder }: {
    ts: boolean,
    template?: TemplateObjectType,
    root: string,
    env: string,
    useStatic?: boolean,
    staticFolder: string,
  }) => {

  const mainFile = join(root, ts ? "src/index.ts" : "src/index.js");

  mkdirSync(join(root, "src"), { recursive: true });

  let code = `
import { TezX } from "tezx";
import { ${env}Adapter ,loadEnv} from "tezx/${env}";
import { logger } from "tezx/middleware";
${template?.import?.join("\n")}
const app = new TezX({
    env: loadEnv(),
    debugMode: true,
    // Additional options
});
app.use([logger()]);

app.get("/", (ctx) => ctx.text("Hello from TezX (${env})"));

${useStatic ? `app.static("${staticFolder || "public"}");` : ""}
${template?.content ? `\n${template?.content?.trim()}\n` : ""}
${env}Adapter(app).listen(3000, () => {
  console.log("🚀 TezX running on http://localhost:3000");
});
`;


  if (ts) {
    let tsconfig = `
{
  "compilerOptions": {
    "outDir": "./dist",
    "module": "CommonJS",
    "target": "ESNext",
    "moduleResolution": "node",
    "skipLibCheck": true,
    "removeComments": false,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "strict": true,
  },
  "include": [
    "src",
  ],
  "exclude": [
    "node_modules",
    "dist",
    "tests"
  ]
}
  `.trim();
    writeFileSync(join(root, 'tsconfig.json'), tsconfig);
  }

  writeFileSync(mainFile, code.trim());
}

export let packageJson = ({ template, root, projectName, env, ts, useWS, choiceStep }: {
  choiceStep: {
    cd: string;
    install: string;
    dev: string;
    build: string;
  }, template: TemplateObjectType, root: string, projectName: string, env: string, ts?: boolean, useWS?: boolean
}) => {
  let install: string[] = [];
  if (Array.isArray(template?.package)) {
    template?.package?.forEach((p) => {
      let { version, npm } = p as any || {};
      install.push(`"${npm?.[1]}": "${version}"`)
    })
  }
  let cmd = {
    bun: {
      start: "bun dist/index.js",
      dev: "bun run --hot --watch src/index.ts",
    },
    deno: {
      start: "deno run --allow-all dist/index.js",
      dev: "deno run --watch --allow-all --unstable-sloppy-imports src/index.ts",
    },
    node: {
      start: "node dist/index.js",
      dev: "tsx watch src/index.ts",
    }
  };

  let json = `
{
  "name": "${projectName || "tezx-app-example"}",
  "version": "1.0.0",
  "type": "module",
  "description": "TezX is a high-performance, lightweight JavaScript framework designed for speed, scalability, and flexibility. It enables efficient routing, middleware management, and static file serving with minimal configuration. Fully compatible with Node.js, Deno, and Bun.",
  "scripts": { ${ts ? `
    "build:esm": "tsc --module ESNext --outDir dist --removeComments",
    "build:dts": "tsc --module ESNext --outDir dist --declaration --emitDeclarationOnly",
    "build": "${choiceStep?.build}",` : ""}
    "start": "${cmd?.[env as keyof typeof cmd]?.start}",
    "dev": "${cmd?.[env as keyof typeof cmd]?.dev}"
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
    ${(ts ? `"typescript": "^5.8.2",` : "")}
    "tezx": "^${version}"${env == 'node' ? `,\n    "tsx": "^4.19.2"` : ""}${useWS && env == 'node' ? `,\n    "ws": "^8.18.1"` : ""}${install.length ? `,\n    ${install?.join(",\n    ")}` : ""}
  },
  "devDependencies": {
    "@types/node": "^22.13.14"
  }
}`.trim();

  writeFileSync(join(root, 'package.json'), json);
}


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
