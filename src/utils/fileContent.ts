import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TemplateObjectType } from "../template/utils.js";
import { version } from "../version.js";

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
    "tezx": "^${version}"${env == 'node' ? `,\n    "tsx": "^4.19.2"` : ""}${useWS && env == 'node' ? `,\n    "ws": "^8.18.1"` : ""}${install.length ? `,\n    ${install?.join(",\n")}` : ""}
  },
  "devDependencies": {
    "@types/node": "^22.13.14"
  }
}`.trim();

  writeFileSync(join(root, 'package.json'), json);
}