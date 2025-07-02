import { TezX } from "tezx";
import { nodeAdapter ,loadEnv} from "tezx/node";
import { logger } from "tezx/middleware";

const app = new TezX({
    env: loadEnv(),
    debugMode: true,
    // Additional options
});
app.use([logger()]);

app.get("/", (ctx) => ctx.text("Hello from TezX (node)"));

app.static("public");

nodeAdapter(app).listen(3000, () => {
  console.log("🚀 TezX running on http://localhost:3000");
});