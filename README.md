
---

# Create TezX

Create a TezX project from official starter templates.

## Quick Start

Starter templates are available for common platforms. Use one of the following `create-tezx` commands:

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

## Options

### `-t, --template <template>`

Specify the desired template to skip interactive selection.

```bash
npm create tezx@latest ./my-app --template minimal
```

### `-i, --install`

Automatically install dependencies after the project is created.

```bash
npm create tezx@latest ./my-app --install
```

### `-p, --pm <pnpm|bun|npm|yarn>`

Choose your preferred package manager.

```bash
npm create tezx@latest ./my-app -- --pm bun
```

## Supported Templates

<!-- * `minimal` - A minimal TypeScript setup
* `next` - Next.js starter with TezX support
* `express` - Node.js (Express) starter with TypeScript
* `solid` - SolidJS with routing and SSR -->

> More templates coming soon!

## Author

Rakibul Islam
[https://github.com/rakibul-islam](https://github.com/srakib17)

and TezX contributors

---
# create-tezx
