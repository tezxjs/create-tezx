import { TezX } from "tezx";
import { serveStatic } from "tezx/static";
import { logger } from "tezx/middleware";
import { ViewEngine } from "@tezx/view-engine";
import { wsHandlers } from "tezx/ws";
const app = new TezX({
  // Additional options
});
app.use([logger()]);

app.get("/", (ctx) => ctx.text("Hello from TezX"));

app.static(serveStatic("public"));

const views = new ViewEngine("ejs", "./views");

app.get("engine", async (ctx) => {
  const html = await views.render("home", {
    title: "TezX SSR Page",
    user: ctx.user || { name: "Guest" },
  });
  return ctx.html(html);
});


let PORT = Number(process.env.PORT) || 3000;
Bun.serve({
  port: PORT,
  reusePort: true, // Enables multi-process clustering
  fetch(req, server) {
    return app.serve(req, server); // Handle requests via TezX
  },
  websocket: wsHandlers({
    // Optional WebSocket configure
  })
});
console.log(`🚀 TezX is running at http://localhost:${PORT}`);