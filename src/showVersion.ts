import { version } from "./version.js";

export function showVersion() {
    console.log(`TezX CLI v${version}`);
    process.exit(0);
}