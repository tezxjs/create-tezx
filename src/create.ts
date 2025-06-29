import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path, { join, resolve } from "node:path";
import readline from "node:readline";
import { TemplateContent } from "./template/index.js";
import { TemplateObjectType } from "./template/utils.js"
import { ws } from "./ws.js";
import { arrowSelect } from "./utils/arrowSelect.js";
import { colorText } from "./utils/colors.js";
import { index, packageJson } from "./utils/fileContent.js";

export type Config = {
  directory?: string, options: Record<"t" | "template" | 'i' | "install" | "p" | "pm" | "ts" | "runtime" | "env" | "useWS" | "useStatic" | "staticFolder", string>
};

export let packageManager = ["npm", "bun", "yarn", "pnpm"];
export let runtime = ['node', 'bun', 'deno'];

export function startLoader(text: string) {
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
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

const ask = (q: string, defaultValue = ""): Promise<string> => {
  return new Promise((res) => {
    rl.question(defaultValue ? `${q} (${defaultValue}): ` : q, (ans) => {
      res(ans.trim() || defaultValue);
    });
  });
};

// const __dirname = fileURLToPath(new URL(".", import.meta.url));
export async function create(config: Config) {
  // console.log(colorText(logo, 'orange'))
  let directory = config?.directory;
  let options = config?.options;
  console.log(colorText("\n⚡ TezX App Creator (no dependencies CLI)\n", 'orange'));

  if (!directory) {
    directory = await ask(colorText("📦 Target directory: ", "magenta"));
    if (!directory) {
      console.log(colorText("❌ Project name required.", "red"));
      process.exit(0);
    }
  }

  let projectName = path.basename(directory);
  const root = resolve(process.cwd(), directory);
  // if (existsSync(root)) return console.log("❌ Folder already exists."), process.exit(1);

  let ts = false;
  let checkEnv = (options?.["env"] || options?.["runtime"]);
  const env = runtime?.includes(checkEnv) ? checkEnv : await arrowSelect("💻 Runtime?", runtime);

  let useWS = !!options?.['useWS'] || false;
  let staticFolder = options?.['staticFolder'] || 'public';
  let useStatic = true;
  let template: TemplateObjectType = {
    content: "",
    import: [],
    files: []
  };
  if (options?.["t"] || options?.["template"]) {
    const templateKey = options["t"] || options["template"];
    useWS = templateKey?.toLowerCase() == 'ws';
    if (!useWS) {
      const availableTemplate = TemplateContent?.[templateKey as keyof typeof TemplateContent];
      if (!availableTemplate) {
        console.error(`❌ Unknown template: "${templateKey}"`);
        console.error(`ℹ️ Available templates: ${Object.keys(TemplateContent).join(", ")}`);
        process.exit(0);
      }
      template = availableTemplate;
    }
  }
  else {
    ts = !!(options?.['ts'] || (await ask("🟦 Use TypeScript? (y/N): ") as any).toLowerCase() === "y");
    useWS = !!options?.['useWS'] || (await ask("🌐 Enable WebSocket? (y/N): ") as any).toLowerCase() === "y";
    useStatic = !!options?.['useStatic'] || (await ask("📁 Use static folder? (y/N): ") as any).toLowerCase() === "y";
    staticFolder = useStatic ? (options?.['staticFolder'] || await ask("📂 Static folder name? (default: public): ")) : "";
  }


  let checkPackageManager = (options?.["pm"] || options?.["p"]);
  const choice = packageManager?.includes(checkPackageManager) ? checkPackageManager : await arrowSelect("📦 Choose your package manager", packageManager);
  const install =
    (options?.["i"] === "true" || options?.["install"] === "true") ||
    ((await ask("📥 Install dependencies now? (y/N): ")).toLowerCase() === "y");

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


  index({
    template,
    root: root,
    ts: !!ts,
    env: env,
    staticFolder: staticFolder,
    useWS: useWS,
    useStatic: useStatic
  })

  packageJson({ directory: directory, env: env, root: root, ts: !!ts, useWS: useWS, template })

  rl.close();
  const step = {
    bun: {
      cd: "cd " + directory,
      install: "bun install",
      dev: "bun dev"
    },
    npm: {
      cd: "cd " + directory,
      install: "npm install",
      dev: "npm run dev"
    },
    yarn: {
      cd: "cd " + directory,
      install: "yarn",
      dev: "yarn dev"
    },
    pnpm: {
      cd: "cd " + directory,
      install: "pnpm install",
      dev: "pnpm run dev"
    }
  };
  let choiceStep = step[choice as keyof typeof step];

  template?.files?.forEach((r) => {
    let folder = path.join(root, path.dirname(r?.path));
    mkdirSync(folder, { recursive: true });
    writeFileSync(path.join(root, r?.path), r?.content);
  })

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
  process.exit(0);
}