# ⚡ Create TezX

Easily scaffold a new [TezX](https://github.com/tezxjs/tezx) project using official starter templates. Whether you're building a backend with WebSocket support or a TypeScript-powered server, `create-tezx` gets you started fast.

---

## 🚀 Quick Start

Starter templates are available for common runtimes and package managers. Run one of the following commands:

```bash
# npm
npm create tezx@latest

# yarn
yarn create tezx

# pnpm
pnpm create tezx@latest

# bun
bun create tezx@latest

# deno
deno run -A npm:create-tezx@latest
````

This will launch an interactive setup. You can also skip prompts using CLI flags.

---

## ⚙️ CLI Options

You can skip interactive prompts by passing options directly via the command line.

### `-t`, `--template <template>`

Use a specific template by name.

```bash
npm create tezx@latest my-app -- --template minimal
```

---

### `-i`, `--install`

Automatically install dependencies after project setup.

```bash
npm create tezx@latest my-app -- --install
```

---

### `-p`, `--pm <npm|pnpm|bun|yarn>`

Choose a package manager.

```bash
npm create tezx@latest my-app -- --pm bun
```

---

### `--ts`, `-ts`

Enable TypeScript in the scaffolded project.

```bash
npm create tezx@latest my-app -- --ts
```

---

### `--env`, `--runtime`, `-env`, `-runtime`

Set the runtime environment: `node`, `bun`, or `deno`.

```bash
npm create tezx@latest my-app -- --runtime bun
```

---

### `--y`, `--yes`, `-y`, `-yes`

Skip all prompts using sensible defaults.

```bash
npm create tezx@latest my-app -- --yes
```

---

## 📁 Supported Templates

> ✅ More templates coming soon!

| Template        | Description                     | Flag Example               |
| --------------- | ------------------------------- | -------------------------- |
| `minimal`       | Minimal TypeScript setup        | `--template minimal`       |
| `ws`            | WebSocket support (Node or Bun) | `--template ws`            |
| `google-oauth2` | Google OAuth2 integration       | `--template google-oauth2` |
| `github-oauth2` | GitHub OAuth2 integration       | `--template github-oauth2` |

---

## 🧪 Example Usage

```bash
npm create tezx@latest my-app -- --template ws --ts --runtime node --install
```

```bash
bun create tezx@latest auth-app -- --template google-oauth2 --pm bun --yes
```

---

## 🧑‍💻 Author

Built by [Rakibul Islam](https://github.com/srakib17)
and [TezX](https://github.com/tezxjs/tezx) contributors.

---
