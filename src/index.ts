#!/usr/bin/env node

import readline from "node:readline";
import { colorText } from "./utils/colors.js";
import { Config, create, packageManager, runtime } from "./utils/create.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

(async () => {
    const onKeyPress = (_: string, key: any) => {
        if (key.name === "c" && key.ctrl) {
            process.stdin.off("keypress", onKeyPress);
            if (process.stdin.isTTY) process.stdin.setRawMode(false);
            rl.close();
            process.exit(0);
        }
    };

    process.stdin.on("keypress", onKeyPress);
    const argv = process.argv.slice(2); // Remove node + script path

    let options: Record<string, string> = {};
    let directory: string | undefined;

    for (let i = 0; i < argv.length; i++) {
        const current = argv[i];

        // Detect flags like --template or -t
        if (current.startsWith("--")) {
            const key = current.slice(2);
            const next = argv[i + 1];
            if (next && !next.startsWith("-")) {
                options[key] = next;
                i++; // Skip next
            } else {
                options[key] = "true"; // Boolean flag
            }
        } else if (current.startsWith("-")) {
            const key = current.slice(1);
            const next = argv[i + 1];
            if (next && !next.startsWith("-")) {
                options[key] = next;
                i++;
            } else {
                options[key] = "true";
            }
        } else {
            // First non-flag value after all options = directory
            if (!directory) directory = current;
        }
    }
    let config: Config = {
        directory: directory,
        options: options
    };

    if (options["y"] === "true" || options["yes"] === "true") {
        // auto set values
        config.options["ts"] = "true";
        config.options["useWS"] = "true";

        config.options["useStatic"] = "true";
        config.options["staticFolder"] = "public";
        config.options["pm"] = packageManager?.includes((config.options?.p || config?.options?.pm)) ? (config.options?.p || config?.options?.pm) : "npm";
        config.options["p"] = packageManager?.includes((config.options?.p || config?.options?.pm)) ? (config.options?.p || config?.options?.pm) : "npm";

        config.options["env"] = runtime?.includes((config.options?.env || config?.options?.runtime)) ? (config.options?.env || config?.options?.runtime) : "node";
        config.options["runtime"] = runtime?.includes((config.options?.env || config?.options?.runtime)) ? (config.options?.env || config?.options?.runtime) : "node";

        config.options["install"] = "true";
    }

    if (options["help"] || options["h"]) {
        console.log(`
${colorText("╭─────────────────────────────────────────────╮", "gray")}
${colorText("│", "gray")}     ${colorText("⚡ Create TezX", "yellow")} - Scaffold your next backend app     ${colorText("│", "gray")}
${colorText("╰─────────────────────────────────────────────╯", "gray")}

${colorText("📦 Usage:", "cyan")} 
  ${colorText("create-tezx", "green")} ${colorText("[directory] [...options]", "gray")}

${colorText("🚀 Quick Start:", "cyan")}
  ${colorText("npm", "magenta")} create tezx@latest
  ${colorText("yarn", "magenta")} create tezx
  ${colorText("pnpm", "magenta")} create tezx@latest
  ${colorText("bun", "magenta")} create tezx@latest
  ${colorText("deno", "magenta")} run -A npm:create-tezx@latest

${colorText("🎛️  Options:", "cyan")}

  ${colorText("-t, --template <name>", "green")}    Use a specific starter template
  ${colorText("--ts, -ts", "green")}                Enable TypeScript setup
  ${colorText("--env, --runtime <env>", "green")}   Set runtime: node | bun | deno
  ${colorText("-p, --pm <manager>", "green")}       Package manager: npm | bun | yarn | pnpm
  ${colorText("-i, --install", "green")}            Automatically install dependencies
  ${colorText("-y, --yes", "green")}                Skip prompts using default options
  ${colorText("-v, --version", "green")}            Show CLI version
  ${colorText("-h, --help", "green")}               Display this help message

${colorText("🧰 Examples:", "cyan")}
  ${colorText("npm create tezx@latest my-app --template ws --ts --env node", "gray")}
  ${colorText("bun create tezx@latest -- --install --pm bun", "gray")}

${colorText("📁 Available Templates:", "cyan")}
  ${colorText("minimal", "yellow")}         Minimal TypeScript setup
  ${colorText("ws", "yellow")}              Built-in WebSocket server
  ${colorText("google-oauth2", "yellow")}   Google OAuth2 Authentication
  ${colorText("github-oauth2", "yellow")}   GitHub OAuth2 Authentication

${colorText("🔗 Repository:", "cyan")}
  ${colorText("https://github.com/tezxjs/tezx", "underline")}

${colorText("🧑‍💻 Author:", "cyan")}
  Rakibul Islam ${colorText("<https://github.com/srakib17>", "blue")}`);
        process.exit(0);
    }
    if (options["v"] || options["version"]) {
        console.log("TezX CLI v1.0.4");
        process.exit(0);
        return;
    }

    create(config)

})();
