import { githubOauth2Template } from "./githubOauth2.js"
import { googleOauth2Template } from "./googleOauth2.js"
import { TemplateObjectType } from "./utils.js"
import { viewEngineTemplate } from "./viewEngine.js"
import { wsTemplate } from "./ws.js"

export let TemplateContent: Record<"minimal" | 'ws' | 'view-engine' | 'github-oauth2' | 'google-oauth2', TemplateObjectType> = {
    "minimal": {
        readme: "",
        content: "",
        files: [],
        import: [],
        package: [],
    },
    'ws': wsTemplate,
    "github-oauth2": githubOauth2Template,
    "google-oauth2": googleOauth2Template,
    "view-engine": viewEngineTemplate
}