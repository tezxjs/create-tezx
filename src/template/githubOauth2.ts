import { packageManagerCommands, TemplateObjectType } from "./utils.js";

export const githubOauth2Template: TemplateObjectType = {
    content: `
// 1. Initialize OAuth2 client
const client = GitHubOauthClient({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/github/callback'
});

// Step 1: Redirect user to GitHub login
app.get('/github', getGithubOAuthURL({
    authClient: client,
}), (ctx) => {
    return ctx.redirect(ctx.state.get('github_oauth_url'));
});

// Step 2: Verify GitHub token and handle user session
app.get('/github/callback', verifyGithubToken({
    authClient: client,
    Callbacks: (ctx) => {
        return {
            session: async (session, user) => {
                console.log('Session:', session);
                console.log('User:', user);
                return session;
            }
        };
    }
}), async (ctx) => {
    return ctx.json({ success: true });
});
    `,
    files: [
        {
            content: `GITHUB_CLIENT_ID = 12323\nGITHUB_CLIENT_SECRET=234234\n`,
            path: ".env"
        }
    ],
    import: ["import { GitHubOauthClient, getGithubOAuthURL,  verifyGithubToken } from '@tezx/github-oauth2'; "],
    package: [packageManagerCommands('@tezx/github-oauth2', "^1.0.2")]
}