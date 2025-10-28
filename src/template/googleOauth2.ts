import { packageManagerCommands, TemplateFnObjectType } from "./utils.js";

export const googleOauth2Template: TemplateFnObjectType = () => {
  return {
    readme: `
# 🔐 Google OAuth2 Example for TezX

This example demonstrates how to use \`@tezx/google-oauth2\` to implement Google OAuth2 login in your TezX app.

---

## 🚀 Features

- Redirects users to Google Sign-In
- Verifies ID token and fetches user profile
- Allows role control via email domain or claims
- Persists session with custom user structure

---

## 🔧 Setup Instructions

### 1. Install Required Packages

Choose your package manager and install:

\`\`\`bash
${Object.values(packageManagerCommands('@tezx/google-oauth2', '^1.0.13'))
        .filter((r: any) => typeof r !== 'string')
        .join('\n# or\n')}

# Plus Google OAuth SDK
${Object.values(packageManagerCommands('@googleapis/oauth2', '^2.0.1'))
        .filter((r: any) => typeof r !== 'string')
        .join('\n# or\n')}
\`\`\`

---

### 2. Setup \`.env\`

\`\`\`env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
\`\`\`

> Register your app here: https://console.cloud.google.com/apis/credentials  
> Redirect URI: \`http://localhost:3000/auth/callback\`

---

## 🧪 Example Route Flow

### 🔗 Step 1: Start Google OAuth

\`\`\`ts
app.get('/auth/google', getGoogleOAuthURL({
  authClient: client,
  scopes: ['openid', 'email', 'profile'],
}), (ctx) => {
  return ctx.redirect(ctx.google?.oauth_url);
});
\`\`\`

---

### ✅ Step 2: Callback — Verify & Create Session

\`\`\`ts
app.get('/auth/callback', verifyGoogleToken({
  authClient: client,
  onError: (err) => {
    console.error('OAuth Error:', err);
  },
  onSuccess: (tokens) => {
    console.log('Tokens:', tokens);
  },
  Callbacks: (ctx) => ({
    signIn: async (user) => user.email.endsWith('@yourcompany.com'),
    jwt: async (token, user) => {
      token.role = user.email_verified ? 'member' : 'guest';
      return token;
    },
    session: async (session, user) => {
      session.user = {
        id: user.sub,
        email: user.email,
        name: user.name,
        picture: user.picture
      };
      return session;
    }
  })
}), async (ctx) => {
  return ctx.json({ success: true });
});
\`\`\`

---

## 📁 File Structure

\`\`\`
.
├── .env
└── server.ts
\`\`\`

---

> 💡 Note: TezX OAuth2 uses stateful sessions or JWTs depending on your setup. It supports advanced callback hooks for full control.

Secure your apps with Google the easy way 🔒
`.trim(),

    content: `
// 1. Initialize OAuth2 client
const client = GoogleOauthClient({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/auth/callback',
});

// 2. Route to start Google login
app.get('/auth/google', getGoogleOAuthURL({
  authClient: client,
  scopes: ['openid','email','profile'],
}), (ctx) => {
  return ctx.redirect(ctx.google?.oauth_url);
});

// 3. Callback route, verify token and establish session
app.get('/auth/callback', verifyGoogleToken({
  authClient: client,
  onError: (err) => {
    console.error('OAuth Error:', err);
  },
  onSuccess: (tokens) => {
    console.log('Tokens:', tokens);
  },
  Callbacks: (ctx)=> {
    return {
      signIn: async (user) => {
        return user.email.endsWith('@yourcompany.com');
      },
      jwt: async (token, user) => {
        token.role = user.email_verified ? 'member' : 'guest';
        return token;
      },
      session: async (session, user) => {
        session.user = {
          id: user.sub,
          email: user.email,
          name: user.name,
          picture: user.picture
        };
        return session;
      }
    }
  }
}), async (ctx) => {
  return ctx.json({ success: true });
});
`.trim(),

    files: [
      {
        content: `GOOGLE_CLIENT_ID=12323\nGOOGLE_CLIENT_SECRET=234234\n`,
        path: ".env"
      }
    ],

    import: [
      `import { GoogleOauthClient, getGoogleOAuthURL, verifyGoogleToken } from "@tezx/google-oauth2";`
    ],

    package: [
      packageManagerCommands('@tezx/google-oauth2', "^1.0.13"),
      packageManagerCommands("@googleapis/oauth2", "^2.0.1")
    ]
  }
};
