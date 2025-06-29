import { packageManagerCommands, TemplateObjectType } from "./utils.js";

export const googleOauth2Template: TemplateObjectType = {
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
  return ctx.redirect(ctx.state.get('google_oauth_url'));
});

// 3. Callback route, verify token and establish session
app.get('/auth/callback', verifyGoogleToken({
  authClient: client,
  onError: (err) => {
    console.error('OAuth Error:', err);
    // handle error or redirect
  },
  onSuccess: (tokens) => {
    console.log('Tokens:', tokens);
  },
  Callbacks: (ctx)=> {
    return {
    signIn: async (user) => {
      // e.g. allow only users from a domain
      return user.email.endsWith('@yourcompany.com');
    },
    jwt: async (token, user) => {
      // attach roles or custom claims
      token.role = user.email_verified ? 'member' : 'guest';
      return token;
    },
    session: async (session, user) => {
      // persist user profile in session
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
  // Now ctx.session is populated
  return ctx.json({ success: true });
});
    `,
    files: [
        {
            content: `GOOGLE_CLIENT_ID = 12323\nGOOGLE_CLIENT_SECRET=234234\n`,
            path: ".env"
        }
    ],
    import: [`import { GoogleOauthClient, getGoogleOAuthURL, verifyGoogleToken } from "@tezx/google-oauth2";`],
    package: [packageManagerCommands('@tezx/google-oauth2', "^1.0.8"), packageManagerCommands("@googleapis/oauth2", "^2.0.1")]
}