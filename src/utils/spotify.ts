import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import SpotifyWebApi from 'spotify-web-api-node';

export const scopes = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-top-read',
  'user-read-currently-playing',
  'user-read-recently-played',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-read-playback-state',
];

export async function spotifyClientFromRequest(req: NextApiRequest): Promise<SpotifyWebApi> {
  const token = await getToken({ req });
  if (!token) {
    throw new Error('No JWT Token');
  }

  return spotifyClient(
    token.access_token as string,
    token.refresh_token as string,
  );
}

export function spotifyClient(accessToken: string, refreshToken: string)
{
  return new SpotifyWebApi({
    clientId: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET,
    accessToken,
    refreshToken,
  });
}