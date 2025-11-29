import { colorText } from "./utils/colors.js";

export function showHelp() {
  console.log(`
        ${colorText("╭───────────────────────────────────────────────────────╮", "gray")}
        ${colorText("│", "gray")}${colorText("   ⚡ Create TezX", "yellow")} - Scaffold your next backend app     ${colorText("│", "gray")}
        ${colorText("╰───────────────────────────────────────────────────────╯", "gray")}
        
        ${colorText("📦 Usage:", "cyan")} 
         ${colorText("create-tezx", "green")} ${colorText("[directory] [...options]", "gray")}
        
        ${colorText("🚀 Quick Start:", "cyan")}
          ${colorText("npm", "magenta")} create tezx@latest
          ${colorText("yarn", "magenta")} create tezx
          ${colorText("pnpm", "magenta")} create tezx@latest
          ${colorText("bun", "magenta")} create tezx@latest
        
        ${colorText("🎛️  Options:", "cyan")}
        
          ${colorText("-t, --template <name>", "green")}    Use a specific starter template
          ${colorText("--ts, -ts", "green")}                Enable TypeScript setup
          ${colorText("-p, --pm <manager>", "green")}       Package manager: npm | bun | yarn | pnpm
          ${colorText("-i, --install", "green")}            Automatically install dependencies
          ${colorText("-y, --yes", "green")}                Skip prompts using default options
          ${colorText("-v, --version", "green")}            Show CLI version
          ${colorText("-h, --help", "green")}               Display this help message
        
        ${colorText("🧰 Examples:", "cyan")}
          ${colorText("npm create tezx@latest my-app --template ws --ts", "gray")}
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