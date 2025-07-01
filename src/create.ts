import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path, { join, resolve } from "node:path";
import readline from "node:readline";
import { TemplateContent } from "./template/index.js";
import { TemplateObjectType } from "./template/utils.js";
import { arrowSelect } from "./utils/arrowSelect.js";
import { colorText } from "./utils/colors.js";
import { gitignore, index, packageJson } from "./utils/fileContent.js";

export type Config = {
  directory?: string, options: Record<"t" | "template" | 'i' | "install" | "p" | "pm" | "ts" | "runtime" | "env" | "useStatic" | "staticFolder", string>
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
    directory = await ask(colorText("📦 Project name: ", "magenta"));
    if (!directory) {
      console.log(colorText("❌ Project name required.", "red"));
      process.exit(0);
    }
  }

  let projectName = path.basename(directory);
  const root = resolve(process.cwd(), directory);
  // if (existsSync(root)) return console.log("❌ Folder already exists."), process.exit(1);

  let ts = !!options?.['ts'];
  let checkEnv = (options?.["env"] || options?.["runtime"]);
  const env = runtime?.includes(checkEnv) ? checkEnv : await arrowSelect(rl, "💻 Runtime?", runtime);

  let staticFolder = options?.['staticFolder'] || 'public';
  let useStatic = true;
  let template: TemplateObjectType = {
    content: "",
    import: [],
    files: []
  };

  if (options?.["t"] || options?.["template"]) {
    const templateKey = options["t"] || options["template"];
    const availableTemplate = TemplateContent?.[templateKey as keyof typeof TemplateContent];
    if (!availableTemplate) {
      console.error(`❌ Unknown template: "${templateKey}"`);
      console.error(`ℹ️ Available templates: ${Object.keys(TemplateContent).join(", ")}`);
      process.exit(0);
    }
    template = availableTemplate;
  }
  else {
    ts = !!(options?.['ts'] || (await ask("🟦 Use TypeScript? (y/N): ") as any).toLowerCase() === "y");
    useStatic = !!options?.['useStatic'] || (await ask("📁 Use static folder? (y/N): ") as any).toLowerCase() === "y";
    staticFolder = useStatic ? (options?.['staticFolder'] || await ask("📂 Static folder name? (default: public): ")) : "";
  }


  let checkPackageManager = (options?.["pm"] || options?.["p"]);
  const choice = packageManager?.includes(checkPackageManager) ? checkPackageManager : await arrowSelect(rl, "📦 Choose your package manager", packageManager);
  const install =
    (options?.["i"] === "true" || options?.["install"] === "true") ||
    ((await ask("📥 Install dependencies now? (y/N): ")).toLowerCase() === "y");

  console.log(`\n📁 Creating project: ${projectName}...\n`);
  let stop = startLoader("Creating Project");
  mkdirSync(root, { recursive: true });

  // const template = join(__dirname, ts ? "template-ts" : "template-js");
  // cpSync(template, root, { recursive: true });

  // Optional Static Folder
  if (useStatic) {
    const staticDir = join(root, staticFolder || "public");
    mkdirSync(staticDir, { recursive: true });
    //   writeFileSync(join(staticDir, "index.html"), "<h1>Welcome to TezX Static</h1>");
  }
  // Customize main.ts file

  const step = {
    bun: {
      cd: "cd " + directory,
      install: "bun install",
      dev: "bun dev",
      build: "bun build:esm && bun build:dts",
    },
    npm: {
      cd: "cd " + directory,
      install: "npm install",
      dev: "npm run dev",
      build: "npm run build:esm && npm run build:dts",
    },
    yarn: {
      cd: "cd " + directory,
      install: "yarn",
      dev: "yarn dev",
      build: "yarn build:esm && yarn build:dts",
    },
    pnpm: {
      cd: "cd " + directory,
      install: "pnpm install",
      dev: "pnpm run dev",
      build: "pnpm run build:esm && pnpm run build:dts",
    }
  };

  let choiceStep = step[choice as keyof typeof step];

  index({
    template,
    root: root,
    ts: !!ts,
    env: env,
    staticFolder: staticFolder,
    useStatic: useStatic
  })

  packageJson({ projectName: projectName, env: env, root: root, ts: !!ts, template, choiceStep: choiceStep })
  gitignore({ root })
  rl.close();


  template?.files?.forEach((r) => {
    let folder = path.join(root, path.dirname(r?.path));
    mkdirSync(folder, { recursive: true });
    writeFileSync(path.join(root, r?.path), r?.content);
  })

  if (install) execSync(choiceStep?.install, { cwd: root, stdio: "inherit" });

  console.log(colorText(`\n✅ TezX project "${projectName}" is ready!\n`, "green"));
  console.log(colorText("🧰 Summary of your configuration:", "cyan"));
  console.log(`📁 Project Name: ${colorText(projectName, "yellow")}`);
  let templateName = options?.['t'] || options?.['template'];
  if (templateName) {
    console.log(`📁 Template Name: ${colorText(templateName, "orange")}`);
  }
  console.log(`🟦 TypeScript: ${colorText(ts ? "Yes" : "No", ts ? "green" : "gray")}`);
  console.log(`💻 Runtime: ${colorText(env, "blue")}`);
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