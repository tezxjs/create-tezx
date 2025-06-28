#!/usr/bin/env node

import readline from "node:readline";
import { create } from "./utils/create.js";
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

    let option = process.argv[2];
    switch (option) {
        case "--t":
        case "--template":
            console.log("template use here")
            break;

        default:
            create()
            break;
    }
})();
