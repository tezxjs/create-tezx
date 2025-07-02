import { TezX } from "tezx";
import { nodeAdapter ,loadEnv} from "tezx/node";
import { logger } from "tezx/middleware";
import { ViewEngine } from "@tezx/view-engine";
const app = new TezX({
    env: loadEnv(),
    debugMode: true,
    // Additional options
});
app.use([logger()]);

app.get("/", (ctx) => ctx.text("Hello from TezX (node)"));

app.static("public");

const views = new ViewEngine("ejs", "./views");

app.get("engine", async (ctx) => {
    const html = await views.render("home", {
        title: "TezX SSR Page",
        user: ctx.user || { name: "Guest" },
    });
    return ctx.html(html);
});

nodeAdapter(app).listen(3000, () => {
  console.log("🚀 TezX running on http://localhost:3000");
});