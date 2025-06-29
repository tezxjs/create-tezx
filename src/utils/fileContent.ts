import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TemplateObjectType } from "../template/utils.js";

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

export let packageJson = ({ template, root, directory, env, ts, useWS, }: { template: TemplateObjectType, root: string, directory: string, env: string, ts?: boolean, useWS?: boolean }) => {
  let install: string[] = [];
  if (Array.isArray(template?.package)) {
    template?.package?.forEach((p) => {
      let { version, npm } = p as any || {};
      install.push(`"${npm?.[1]}": "${version}"`)
    })
  }
  let json = `{
        "name": "${directory}",
        "version": "1.0.0",
        "type": "module",
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
          "tezx": "^2.0.3"${env == 'node' ? `,\n          "tsx": "^4.19.2"` : ""}${useWS && env == 'node' ? `,\n          "ws": "^8.18.1"` : ""}${install.length ? `,\n          ${install?.join(",\n")}` : ""}
        },
        "devDependencies": {
          "@types/node": "^22.13.14"
        }
      }`.trim();

  writeFileSync(join(root, 'package.json'), json);
}