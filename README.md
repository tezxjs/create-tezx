# ⚡ Create TezX

Easily scaffold a new [TezX](https://github.com/tezxjs/tezx) project using official starter templates.

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

---

## ⚙️ CLI Options

You can skip the interactive prompts by passing options directly.

### `-t`, `--template <template>`

Use a specific template.

```bash
npm create tezx@latest my-app --template minimal
```

### `-i`, `--install`

Automatically install dependencies after setup.

```bash
npm create tezx@latest my-app --install
```

### `-p`, `--pm <npm|pnpm|bun|yarn>`

Specify which package manager to use.

```bash
npm create tezx@latest my-app --pm bun
```

### `--ts`, `-ts`

Enable TypeScript support.

```bash
npm create tezx@latest my-app --ts
```

### `--env`, `--runtime`, `-env`, `-runtime`

Set the runtime environment: `node`, `bun`, or `deno`.

```bash
npm create tezx@latest my-app --runtime bun
```

### `--y`, `--yes`, `-y`, `-yes`

Want to skip all prompts?

---

## 📁 Supported Templates

> ✅ More templates coming soon!

* `minimal` – Minimal TypeScript setup
* `websocket` – TezX with built-in WebSocket support `--template ws`
* `Google Oauth2` – Google oauth2 `--t google-oauth2`
* `Github Oauth2` – Github oauth2 `--t github-oauth2`

---

## 🧑‍💻 Author

Built by [Rakibul Islam](https://github.com/srakib17)
and [TezX](https://github.com/tezxjs/tezx) contributors.

---
