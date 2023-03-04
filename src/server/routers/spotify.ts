import "@total-typescript/ts-reset";
import { spotifyClientFromRequest } from "@/utils/spotify";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, t } from "../trpc";

const isAuthed = t.middleware(async ({next, ctx}) => {
  return next({
    ctx: {
      ...ctx,
      spotify: await spotifyClientFromRequest((ctx as any).req)
    }
  });
});


const protectedProcedure = t.procedure.use(isAuthed)

export const spotifyRouter = router({
  hello: protectedProcedure.query(async ({ ctx }) => {
    return {'top': await ctx.spotify.getMyTopTracks()};
  }),
  playlist: protectedProcedure.input(z.object({
    id: z.string()
  })).query(async ({input, ctx}) => {
    const res = await ctx.spotify.getPlaylist(input.id);

    const playlist = {
      ...res.body,
      tracks: undefined
    };

    let tracks: SpotifyApi.TrackObjectFull[] = res.body.tracks.items.map(item => item.track).filter(Boolean);
    let done = res.body.tracks.total === tracks.length;
    while (!done) {
      const res = await ctx.spotify.getPlaylistTracks(input.id, { offset: tracks.length });
      tracks = [...tracks, ...res.body.items.map(item => item.track).filter(Boolean)]
      console.log(res);

      done = res.body.total === tracks.length;
    }
    return {
      playlist,
      tracks
    }
  })
})