#!/usr/bin/env node

import readline from "node:readline";
import { create } from "./utils/create.js";
import { template } from "./utils/template.js";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

(async () => {
    let command = process.argv[2];
    // -t, --template <template>
    //
    const onKeyPress = (_: string, key: any) => {
        if (key.name === "c" && key.ctrl) {
            process.stdin.off("keypress", onKeyPress);
            if (process.stdin.isTTY) process.stdin.setRawMode(false);
            rl.close();
            process.exit(1);
        }
    };

    process.stdin.on("keypress", onKeyPress);
    const argv = process.argv.slice(2); // Remove node + script path

    let options: Record<string, string> = {};
    let directory: string | undefined;

    for (let i = 0; i < argv.length; i++) {
        const current = argv[i];

        // Detect flags like --template or -t
        if (current.startsWith("--")) {
            const key = current.slice(2);
            const next = argv[i + 1];
            if (next && !next.startsWith("-")) {
                options[key] = next;
                i++; // Skip next
            } else {
                options[key] = "true"; // Boolean flag
            }
        } else if (current.startsWith("-")) {
            const key = current.slice(1);
            const next = argv[i + 1];
            if (next && !next.startsWith("-")) {
                options[key] = next;
                i++;
            } else {
                options[key] = "true";
            }
        } else {
            // First non-flag value after all options = directory
            if (!directory) directory = current;
        }
    }
    let config = {
        directory: directory,
        options: options
    };
    create(config)

})();
