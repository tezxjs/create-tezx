
import { TemplateFnObjectType } from "./utils.js";
export let ws = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>TezX WebSocket Demo</title>
        <style>
            * {
                box-sizing: border-box;
            }

            body {
                font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                background: #f7f9fc;
                padding: 30px;
                color: #333;
            }

            h1 {
                text-align: center;
                color: #444;
                margin-bottom: 30px;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                background: #fff;
                border-radius: 10px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
                padding: 20px;
            }

            #messages {
                border: 1px solid #ddd;
                border-radius: 6px;
                padding: 12px;
                height: 250px;
                overflow-y: auto;
                background-color: #fafafa;
                font-size: 14px;
                margin-bottom: 15px;
            }

            #input {
                width: 100%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 6px;
                font-size: 14px;
                margin-bottom: 10px;
            }

            .buttons {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }

            button {
                padding: 8px 16px;
                font-size: 14px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            button:hover {
                opacity: 0.9;
            }

            button:active {
                transform: scale(0.97);
            }

            .send-btn {
                background-color: #4caf50;
                color: white;
            }

            .ping-btn {
                background-color: #2196f3;
                color: white;
            }

            .message {
                margin-bottom: 8px;
                padding: 6px 10px;
                border-radius: 4px;
            }

            .message.client {
                background: #e8f5e9;
                color: #2e7d32;
            }

            .message.server {
                background: #e3f2fd;
                color: #1565c0;
            }

            .message.system {
                background: #fff3e0;
                color: #ef6c00;
                font-style: italic;
            }
        </style>
    </head>
    <body>
        <h1>TezX WebSocket Demo</h1>
        <div class="container">
            <div id="messages"></div>
            <input id="input" type="text" placeholder="Type a message..." />
            <div class="buttons">
                <button class="send-btn" onclick="sendMessage()">Send</button>
                <button class="ping-btn" onclick="sendPing()">Ping</button>
            </div>
        </div>

        <script>
            const ws = new WebSocket(\`ws://\${location.host}/ws\`);
            const messages = document.getElementById("messages");
            const input = document.getElementById("input");

            ws.onopen = () => {
                appendMessage("Connected to WebSocket server", "system");
            };

            ws.onmessage = (event) => {
                appendMessage(\`Server: \${event.data}\`, "server");
            };

            ws.onclose = () => {
                appendMessage("Disconnected from WebSocket server", "system");
            };

            ws.onerror = (error) => {
                appendMessage(\`Error: \${error}\`, "system");
            };

            function appendMessage(message, type = "client") {
                const div = document.createElement("div");
                div.textContent = message;
                div.className = \`message \${type}\`;
                messages.appendChild(div);
                messages.scrollTop = messages.scrollHeight;
            }

            function sendMessage() {
                const message = input.value;
                if (message && ws.readyState === WebSocket.OPEN) {
                    ws.send(message);
                    appendMessage(\`Client: \${message}\`, "client");
                    input.value = "";
                }
            }

            function sendPing() {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send("ping");
                    appendMessage("Client: ping", "client");
                }
            }
        </script>
    </body>
</html>
`
export const wsTemplate: TemplateFnObjectType = {
    readme: `
# 🔌 TezX WebSocket Example

This example demonstrates how to set up a WebSocket server using \`upgradeWebSocket\` from \`tezx/ws\`.

---

## 🚀 Features

- Upgrade HTTP requests to WebSocket connections
- Handle events: \`open\`, \`message\`, and \`close\`
- Respond to \`ping\` with \`pong\`
- Echo received messages back to the client
- Works with Node.js and Bun

---

## 🔧 Setup

### 1. Install required package (if needed)

TezX WebSocket support is built-in with \`tezx/ws\`. If your setup doesn't include it:

\`\`\`bash
npm install tezx
# or
bun add tezx
\`\`\`

---

### 2. How it works

- Connect to \`/ws\` via a browser or WebSocket client
- On connect: sends a welcome message
- On message: replies with either \`pong\` or echoes back the message
- Logs disconnection reason

---

## 🧪 Client Test File

A simple HTML file is included in \`public/ws.html\`:

\`\`\`html
<script>
  const ws = new WebSocket("ws://localhost:3000/ws");

  ws.onopen = () => {
    console.log("Connected to WebSocket!");
    ws.send("ping");
  };

  ws.onmessage = (event) => {
    console.log("Message:", event.data);
  };

  ws.onclose = () => {
    console.log("Disconnected.");
  };
</script>
\`\`\`

---

## 📁 File Structure

\`\`\`
.
├── public/
│   └── ws.html
└── src
    └── index.ts
\`\`\`

---

Enjoy real-time power with TezX! ⚡️
`.trim(),

    content: `
const socket = [];

app.get(
  "/ws",
  upgradeWebSocket(
    (ctx) => {
      return {
        // ✅ Node.js-compatible WebSocket handler
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
          console.log(\`WebSocket closed: \${data?.reason ?? "No reason provided"}\`);
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
    return ctx.sendFile("public/ws.html");
  },
);
`.trim(),

    files: [
        {
            content: ws,
            path: "public/ws.html"
        }
    ],

    import: [`import { upgradeWebSocket } from "tezx/ws";`],
}
