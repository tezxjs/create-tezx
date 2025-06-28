import readline from "node:readline";

export async function arrowSelect(promptText: string, options: string[]): Promise<string> {
    return new Promise((resolve) => {
        let selected = 0;

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        readline.emitKeypressEvents(process.stdin, rl);
        if (process.stdin.isTTY) process.stdin.setRawMode(true);

        const render = () => {
            // Clear screen
            process.stdout.write("\x1B[2J\x1B[0f");
            console.log(promptText + " (Use ↑ ↓ arrows, Enter to confirm)\n");
            options.forEach((opt, i) => {
                const prefix = i === selected ? "👉" : "  ";
                const color = i === selected ? "\x1b[36m" : "\x1b[0m";
                console.log(`${prefix} ${color}${opt}\x1b[0m`);
            });
        };

        const onKeyPress = (_: string, key: any) => {
            if (key.name === "up") {
                selected = (selected - 1 + options.length) % options.length;
                render();
            } else if (key.name === "down") {
                selected = (selected + 1) % options.length;
                render();
            } else if (key.name === "return") {
                // cleanup();
                return resolve(options[selected]);
            } else if (key.name === "c" && key.ctrl) {
                process.stdin.off("keypress", onKeyPress);
                if (process.stdin.isTTY) process.stdin.setRawMode(false);
                rl.close();
                process.exit(1);
            }
        };
        // const cleanup = () => {
        //     process.stdin.off("keypress", onKeyPress);
        //     if (process.stdin.isTTY) process.stdin.setRawMode(false);
        //     rl.close();
        // };
        render();
        process.stdin.on("keypress", onKeyPress);
    });
}
