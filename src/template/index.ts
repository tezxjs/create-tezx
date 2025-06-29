import { githubOauth2Template } from "./githubOauth2.js"
import { googleOauth2Template } from "./googleOauth2.js"
import { TemplateObjectType } from "./utils.js"
import { wsTemplate } from "./ws.js"

export let TemplateContent: Record<'ws' | 'github-oauth2' | 'google-oauth2', TemplateObjectType> = {
    'ws': wsTemplate,
    "github-oauth2": githubOauth2Template,
    "google-oauth2": googleOauth2Template,
}