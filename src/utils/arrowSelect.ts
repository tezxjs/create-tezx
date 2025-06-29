import readline from "node:readline";

export async function arrowSelect(rl: any, promptText: string, options: string[]): Promise<string> {
    return new Promise((resolve) => {
        let selected = 0;

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
