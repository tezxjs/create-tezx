import { TezX } from "tezx";
import { bunAdapter ,loadEnv} from "tezx/bun";
import { logger } from "tezx/middleware";

const app = new TezX({
    env: loadEnv(),
    debugMode: true,
    // Additional options
});
app.use([logger()]);

app.get("/", (ctx) => ctx.text("Hello from TezX (bun)"));

app.static("public");

bunAdapter(app).listen(3000, () => {
  console.log("🚀 TezX running on http://localhost:3000");
});