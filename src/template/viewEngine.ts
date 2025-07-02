import { packageManagerCommands, TemplateObjectType } from "./utils.js";

export const viewEngineTemplate: TemplateObjectType = {
    readme: `
# TezX View Engine Example

This example demonstrates how to use the \`@tezx/view-engine\` package to render server-side views using template engines such as **EJS**, **Pug**, **Handlebars**, **Mustache**, or **Nunjucks**.

---

## 🚀 How it works

The \`ViewEngine\` class handles:

- Compiling templates at runtime
- Injecting dynamic data into views
- Supporting multiple template engines with the same API

---

## 📁 File structure

\`\`\`bash
.src
├── views/
│   └── home.ejs
└── index.ts
\`\`\`

---

## 🧪 Example Usage

\`\`\`ts
import { ViewEngine } from "@tezx/view-engine";

const views = new ViewEngine("ejs", "./views");

app.get("engine", async (ctx) => {
  const html = await views.render("home", {
    title: "TezX SSR Page",
    user: ctx.user || { name: "Guest" },
  });
  return ctx.html(html);
});
\`\`\`

---

## 💡 Notes

- The \`ViewEngine\` class auto-caches template files unless disabled.
- You can switch engines by passing a different type like \`"pug"\`, \`"hbs"\`, etc.
- All rendering is asynchronous.

---

Happy TezX templating! 🎉
`.trim(),

    content: `
const views = new ViewEngine("ejs", "./views");

app.get("engine", async (ctx) => {
    const html = await views.render("home", {
        title: "TezX SSR Page",
        user: ctx.user || { name: "Guest" },
    });
    return ctx.html(html);
});
  `.trim(),

    files: [
        {
            content: `
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title><%= title %></title>
  </head>
  <body>
    <h1>Welcome to TezX SSR!</h1>
    <p>Hello, <%= user.name %> 👋</p>
  </body>
</html>
      `.trim(),
            path: "views/home.ejs",
        },
    ],

    import: [`import { ViewEngine } from "@tezx/view-engine";`],

    package: [
        packageManagerCommands("@tezx/view-engine", "^1.0.3"),
        packageManagerCommands("ejs", "^3.1.10"),
    ],
};
