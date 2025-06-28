import { TezX } from "tezx";
import { bunAdapter ,loadEnv} from "tezx/bun";
import { upgradeWebSocket } from "tezx/ws";

const app = new TezX({
    env: loadEnv()
    // Additional options
});
app.get("/", (ctx) => ctx.text("Hello from TezX (bun)"));

app.static("public");


const socket: WebSocket[] = [];
app.get(
  "/ws",
  upgradeWebSocket(
    (ctx) => {
      return {
        // make sure it is work with nodejs
        open: (ws) => {
            socket.push(ws);
            console.log("WebSocket connected");
            ws.send("👋 Welcome to TezX WebSocket!");
        },
        message: (ws, msg) => {
            if (typeof msg === "string" && msg === "ping") {
                ws.send("pong 🏓");
            } else if (msg !== undefined) {
                ws.send("Echo: " + msg);
            }
        },
        close: (ws, data) => {
            console.log(`WebSocket closed: ${ data?.reason ?? "No reason provided"}`);
        },
      };
    },
    {
      maxPayload: 2 * 1024 * 1024, // 2MB
      perMessageDeflate: {
        threshold: 1024, // Compress messages > 1KB
      },
    },
  ),
  (ctx) => {
    return ctx.sendFile("ws.html");
  },
);


bunAdapter(app).listen(3000, () => {
  console.log("🚀 TezX running on http://localhost:3000");
});