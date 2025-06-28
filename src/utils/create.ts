import { execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import readline from "node:readline";
import { ws } from "../ws.js";
import { arrowSelect } from "./arrowSelect.js";
import { colorText } from "./colors.js";

function startLoader(text: string) {
  let i = 0;
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const timer = setInterval(() => {
    process.stdout.write(`\r${frames[i = ++i % frames.length]} ${text}`);
  }, 80);
  return () => {
    clearInterval(timer);
    process.stdout.write("\r✅ Done!                             \n");
  };
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const ask = (q: string, defaultValue = ""): Promise<string> => {
  return new Promise((res) => {
    rl.question(defaultValue ? `${q} (${defaultValue}): ` : q, (ans) => {
      res(ans.trim() || defaultValue);
    });
  });
};

// const __dirname = fileURLToPath(new URL(".", import.meta.url));

export async function create() {
  // console.log(colorText(logo, 'orange'))
  console.log(colorText("\n⚡ TezX App Creator (no dependencies CLI)\n", 'orange'));
  const projectName: any = await ask(colorText("📦 Project name: ", "magenta"));
  if (!projectName) return console.log(colorText("❌ Project name required.", 'red')), process.exit(1);


  const root = resolve(process.cwd(), projectName);
  if (existsSync(root)) return console.log("❌ Folder already exists."), process.exit(1);
  //!done
  const ts = (await ask("🟦 Use TypeScript? (y/N): ") as any).toLowerCase() === "y";

  //!done
  const env = await arrowSelect("💻 Runtime?", ['node', 'bun', 'deno']);
  //!done
  const useWS = (await ask("🌐 Enable WebSocket? (y/N): ") as any).toLowerCase() === "y";
  //!done
  const useStatic = (await ask("📁 Use static folder? (y/N): ") as any).toLowerCase() === "y";
  const staticFolder = useStatic ? await ask("📂 Static folder name? (default: public): ") : "";

  const choice = await arrowSelect("📦 Choose your package manager", ["npm", "bun", "yarn", "pnpm"]);
  const install = (await ask("📥 Install dependencies now? (y/N): ") as any).toLowerCase() === "y";

  console.log(`\n📁 Creating project: ${projectName}...\n`);
  let stop = startLoader("Creating Project");
  mkdirSync(root, { recursive: true });

  // const template = join(__dirname, ts ? "template-ts" : "template-js");
  // cpSync(template, root, { recursive: true });

  if (useWS) {
    writeFileSync(join(root, 'ws.html'), ws);
  }
  // Optional Static Folder
  if (useStatic) {
    const staticDir = join(root, staticFolder || "public");
    mkdirSync(staticDir, { recursive: true });
    //   writeFileSync(join(staticDir, "index.html"), "<h1>Welcome to TezX Static</h1>");
  }
  // Customize main.ts file
  mkdirSync(join(root, "src"), { recursive: true });

  const mainFile = join(root, ts ? "src/index.ts" : "src/index.js");
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

  writeFileSync(mainFile, code.trim());

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

  let packageJson = `{
    "name": "${projectName}",
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

  writeFileSync(join(root, 'package.json'), packageJson);

  rl.close();
  const step = {
    bun: {
      cd: "cd " + projectName,
      install: "bun install",
      dev: "bun dev"
    },
    npm: {
      cd: "cd " + projectName,
      install: "npm install",
      dev: "npm run dev"
    },
    yarn: {
      cd: "cd " + projectName,
      install: "yarn",
      dev: "yarn dev"
    },
    pnpm: {
      cd: "cd " + projectName,
      install: "pnpm install",
      dev: "pnpm run dev"
    }
  };
  let choiceStep = step[choice as keyof typeof step];

  if (install) execSync(choiceStep?.install, { cwd: root, stdio: "inherit" });

  console.log(colorText(`\n✅ TezX project "${projectName}" is ready!\n`, "green"));
  console.log(colorText("🧰 Summary of your configuration:", "cyan"));
  console.log(`📁 Project Name: ${colorText(projectName, "yellow")}`);
  console.log(`🟦 TypeScript: ${colorText(ts ? "Yes" : "No", ts ? "green" : "gray")}`);
  console.log(`💻 Runtime: ${colorText(env, "blue")}`);
  console.log(`🌐 WebSocket: ${colorText(useWS ? "Enabled" : "Disabled", useWS ? "green" : "gray")}`);
  console.log(`📁 Static Folder: ${colorText(useStatic ? staticFolder || "public" : "Not Used", useStatic ? "green" : "gray")}`);
  console.log(`📦 Package Manager: ${colorText(choice, "magenta")}`);
  console.log(`📥 Dependencies Installed: ${colorText(install ? "Yes" : "No", install ? "green" : "red")}\n`);

  console.log(colorText(`👉 Next Steps:`, "cyan"));

  console.log(colorText(`   ${choiceStep?.cd}`, "white"));
  if (!install) {
    console.log(colorText(`   ${choiceStep?.install}`, "white"));
  }
  console.log(colorText(`   ${choiceStep?.dev}`, "white"));
  console.log("");
  stop();
}