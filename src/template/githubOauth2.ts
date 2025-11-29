import { packageManagerCommands, TemplateFnObjectType } from "./utils.js";

export const githubOauth2Template: TemplateFnObjectType = {
    readme: `
# 🔐 GitHub OAuth2 Example for TezX

This example demonstrates how to implement GitHub OAuth2 login using \`@tezx/github-oauth2\`.

---

## 🚀 Features

- 🔐 Redirects users to GitHub for login
- 📥 Handles GitHub's OAuth2 callback
- 🧑 Retrieves user profile and creates session
- ⚙️ Easy to integrate with any TezX backend

---

## 🔧 Setup

### 1. Install the required package

\`\`\`bash
${Object.values(packageManagerCommands('@tezx/github-oauth2', '^1.0.9'))?.filter((r: any) => typeof r !== 'string')?.join("\n#or\n")}
\`\`\`

### 2. Add environment variables

Create a \`.env\` file:

\`\`\`env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
\`\`\`

Make sure you register your OAuth app at:
> https://github.com/settings/developers

Use callback URL:  
\`http://localhost:3000/github/callback\`

---

## 🧪 Example Flow

### Step 1: Redirect to GitHub login

\`\`\`ts
app.get('/github', getGithubOAuthURL({
  authClient: client,
}), (ctx) => {
  return ctx.redirect(ctx.github.oauth_url);
});
\`\`\`

### Step 2: GitHub redirects back → create session

\`\`\`ts
app.get('/github/callback', verifyGithubToken({
  authClient: client,
  Callbacks: (ctx) => ({
    session: async (session, user) => {
      console.log("Session:", session);
      console.log("User:", user);
      return session;
    }
  }),
}), async (ctx) => {
  return ctx.json({ success: true });
});
\`\`\`

---

## 📁 File Structure

\`\`\`
.
├── .env
├── server.ts
\`\`\`

---

## 📚 References

- GitHub OAuth Docs: https://docs.github.com/en/developers/apps/building-oauth-apps
- TezX GitHub OAuth: https://www.npmjs.com/package/@tezx/github-oauth2

---

Login securely and build smarter auth with TezX! 🚀
`.trim(),

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
    return ctx.redirect(ctx.github.oauth_url);
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
  `.trim(),

    files: [
        {
            content: `GITHUB_CLIENT_ID=12323\nGITHUB_CLIENT_SECRET=234234`,
            path: ".env"
        }
    ],

    import: [
        `import { GitHubOauthClient, getGithubOAuthURL, verifyGithubToken } from '@tezx/github-oauth2';`
    ],

    package: [
        packageManagerCommands('@tezx/github-oauth2', "^1.0.9")
    ]
};
