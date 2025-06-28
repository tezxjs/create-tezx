import { ws } from "../ws.js"

export type TemplateObjectType = {
    content: string,
    file: { path: string, content: string }[]
}
export let TemplateContent = {
    'ws': ws
}