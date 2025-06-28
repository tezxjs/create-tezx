import { wsTemplate } from "./ws.js"

export type TemplateObjectType = {
    content: string,
    package?: string[],
    file: { path: string, content: string }[]
}
export let TemplateContent = {
    'ws': wsTemplate
}