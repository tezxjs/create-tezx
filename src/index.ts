#!/usr/bin/env node

import { Config, create, packageManager, runtime } from "./create.js";
import { showHelp } from "./showHelp.js";
import { showVersion } from "./showVersion.js";

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

(async () => {

    let typing = "";
    const onKeyPress = (_: string, key: any) => {
        if (key.name === "c" && key.ctrl) {
            process.stdin.off("keypress", onKeyPress);
            if (process.stdin.isTTY) process.stdin.setRawMode(false);
            process.exit(0);
        }
        typing += key?.sequence;
        if (key.name === "return") {
            let t = typing;
            typing = "";
            return t;
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
    let config: Config = {
        directory: directory,
        options: options
    };

    if (options["y"] === "true" || options["yes"] === "true") {
        // auto set values
        config.options["ts"] = "true";
        config.options["useWS"] = "true";

        config.options["useStatic"] = "true";
        config.options["staticFolder"] = "public";
        config.options["pm"] = packageManager?.includes((config.options?.p || config?.options?.pm)) ? (config.options?.p || config?.options?.pm) : "npm";
        config.options["p"] = packageManager?.includes((config.options?.p || config?.options?.pm)) ? (config.options?.p || config?.options?.pm) : "npm";

        config.options["env"] = runtime?.includes((config.options?.env || config?.options?.runtime)) ? (config.options?.env || config?.options?.runtime) : "node";
        config.options["runtime"] = runtime?.includes((config.options?.env || config?.options?.runtime)) ? (config.options?.env || config?.options?.runtime) : "node";

        config.options["install"] = "true";
    }

    if (options["help"] || options["h"]) {
        showHelp();
        return
    }
    if (options["v"] || options["version"]) {
        showVersion();
        return;
    }

    create(config)

})();
