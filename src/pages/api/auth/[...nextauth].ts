import colors from 'tailwindcss/colors';

import NextAuth, { type NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { scopes, spotifyClient } from "../../../utils/spotify";

const now = () => Math.round((new Date).getTime() / 1000);

function expiresSoon(token: any): boolean
{
  const hour = 60 * 60;
  const refreshAfter = now() - hour

  return token.exp <= refreshAfter;
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_ID as string,
      clientSecret: process.env.SPOTIFY_SECRET as string,
      authorization: { params: { scope: scopes.join(' ') } },
      profile(profile, tokens) {
        return {
          id: profile.id,
          name: profile.display_name,
          email: profile.email,
          image: profile.images?.[0]?.url ?? 'https://placeholdmon.ttp.sh/100x100'
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {

     if (account) {
       token.refresh_token = account.refresh_token;
       token.access_token = account.access_token;
     }

     if (expiresSoon(token)) {
      console.log('Token Expires soon, refreshing')

      const res = await spotifyClient(token.access_token as string, token.refresh_token as string).refreshAccessToken();
      token.refresh_token = res.body.refresh_token;
      token.access_token = res.body.access_token;
      token.exp = now() + res.body.expires_in;
     }

     return Promise.resolve(token);
    },
 },
 theme: {
  colorScheme: 'auto',
  brandColor: colors.pink[600]
 }
};

export default NextAuth(authOptions);
