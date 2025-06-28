import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TemplateObjectType } from "../template/index.js";

export let index = ({
  ts,
  template,
  root,
  env, useWS = false, useStatic = false, staticFolder }: {
    ts: boolean,
    template?: TemplateObjectType,
    root: string,
    env: string,
    useStatic?: boolean,
    staticFolder: string,
    useWS?: boolean,
  }) => {

  const mainFile = join(root, ts ? "src/index.ts" : "src/index.js");

  mkdirSync(join(root, "src"), { recursive: true });

  let code = `
import { TezX } from "tezx";
import { ${env}Adapter ,loadEnv} from "tezx/${env}";
${useWS ? `import { upgradeWebSocket } from "tezx/ws";\n` : ""}
const app = new TezX({
    env: loadEnv()
    // Additional options
});
app.get("/", (ctx) => ctx.text("Hello from TezX (${env})"));

${useStatic ? `app.static("${staticFolder || "public"}");` : ""}
${template?.content ? `\n${template?.content}\n` : ""}
${useWS ? `
const socket: WebSocket[] = [];
app.get(
  "/ws",
  upgradeWebSocket(
    (ctx) => {
      return {
        // make sure it is work with nodejs
        open: (ws) => {
            socket.push(ws);
            console.log("WebSocket connected");
            ws.send("👋 Welcome to TezX WebSocket!");
        },
        message: (ws, msg) => {
            if (typeof msg === "string" && msg === "ping") {
                ws.send("pong 🏓");
            } else if (msg !== undefined) {
                ws.send("Echo: " + msg);
            }
        },
        close: (ws, data) => {
            console.log(\`WebSocket closed: \${ data?.reason ?? "No reason provided"}\`);
        },
      };
    },
    {
      maxPayload: 2 * 1024 * 1024, // 2MB
      perMessageDeflate: {
        threshold: 1024, // Compress messages > 1KB
      },
    },
  ),
  (ctx) => {
    return ctx.sendFile("ws.html");
  },
);
` : ""}

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

export let packageJson = ({ root, directory, env, ts, useWS, }: { root: string, directory: string, env: string, ts?: boolean, useWS?: boolean }) => {
  let json = `{
        "name": "${directory}",
        "version": "1.0.0",
        "description": "TezX is a high-performance, lightweight JavaScript framework designed for speed, scalability, and flexibility. It enables efficient routing, middleware management, and static file serving with minimal configuration. Fully compatible with Node.js, Deno, and Bun.",
        "scripts": {
          "build:cjs": "tsc --module CommonJS --outDir dist/cjs --removeComments",
          "build:esm": "tsc --module ESNext --outDir dist --removeComments",
          "build:dts": "tsc --module ESNext --outDir dist --declaration --emitDeclarationOnly",
          "build": "npm run build:cjs && npm run build:esm && npm run build:dts",
          "start": "node dist/index.js",
          ${(
      env == 'node' ?
        `"dev": "tsx watch src/index.ts" ` :
        env == "bun" ?
          `"dev": "bun run --hot --watch src/index.ts"` :
          `"dev": "deno run --watch --allow-all --unstable-sloppy-imports src/index.ts" `
    )}
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
          "tezx": "^2.0.3",
          "tsx": "^4.19.2"${useWS && env == 'node' ? `,\n"ws": "^8.18.1"` : ""}
        },
        "devDependencies": {
          "@types/node": "^22.13.14"
        }
      }`.trim();

  writeFileSync(join(root, 'package.json'), json);
}