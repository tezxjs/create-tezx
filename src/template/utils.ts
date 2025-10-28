export type Package = ({ version: string } | Record<"npm" | "yarn" | "bun" | "pnpm", [string, string]>)[];
export const packageManagerCommands = (pm: string, version: string): any => ({
    version: version,
    npm: ["npm install", pm],
    bun: ["bun add", pm],
    yarn: ["yarn add", pm],
    pnpm: ["pnpm add", pm]
});

export type TemplateReturnType = {
    readme: string,
    content: string,
    import: string[],
    package?: Package,
    files: { path: string, content: string }[]
};

export type TemplateFnObjectType = (env: string) => TemplateReturnType