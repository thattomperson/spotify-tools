import { useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { parse } from 'rss-to-json'
import { trpc } from '../utils/trpc'

import { useAudioPlayer } from '@/components/AudioProvider'
import { Container } from '@/components/Container'
import { FormattedDate } from '@/components/FormattedDate'
import { Layout } from '@/components/Layout'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

// function PlayPauseIcon({ playing, ...props }) {
//   return (
//     <svg aria-hidden="true" viewBox="0 0 10 10" fill="none" {...props}>
//       {playing ? (
//         <path
//           fillRule="evenodd"
//           clipRule="evenodd"
//           d="M1.496 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H2.68a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H1.496Zm5.82 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H8.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H7.316Z"
//         />
//       ) : (
//         <path d="M8.25 4.567a.5.5 0 0 1 0 .866l-7.5 4.33A.5.5 0 0 1 0 9.33V.67A.5.5 0 0 1 .75.237l7.5 4.33Z" />
//       )}
//     </svg>
//   )
// }

function EpisodeEntry({ track }: { track: SpotifyApi.TrackObjectFull}) {
  // let date = new Date(episode.published)

  // let audioPlayerData = useMemo(
  //   () => ({
  //     title: episode.title,
  //     audio: {
  //       src: episode.audio.src,
  //       type: episode.audio.type,
  //     },
  //     link: `/${episode.id}`,
  //   }),
  //   [episode]
  // )
  // let player = useAudioPlayer(audioPlayerData)

  return (
    <article
      aria-labelledby={`episode-${track.id}-title`}
      className="py-10 sm:py-12"
    >
      <Container className={''}>
        <div className='flex'>
          <Image
            alt={track.name}
            className='w-1/5 mr-4'
            src={track.album.images[0].url}
            width={track.album.images[0].width}
            height={track.album.images[0].height}
          />
          <div className="w-4/5 flex flex-col items-start">
            <h2
              id={`episode-${track.id}-title`}
              className="mt-2 text-lg font-bold text-slate-900"
            >
              <Link href={`/${track.id}`}>{track.name}</Link>
            </h2>
            {/* <FormattedDate
              date={date}
              className="order-first font-mono text-sm leading-7 text-slate-500"
            /> */}
            <p className="mt-1 text-base leading-7 text-slate-700">
              {track.album.name}
            </p>
            <div className="mt-4 flex items-center gap-4">
              {/* <button
                type="button"
                onClick={() => player.toggle()}
                className="flex items-center text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900"
                aria-label={`${player.playing ? 'Pause' : 'Play'} episode ${
                  track.title
                }`}
              >
                <PlayPauseIcon
                  playing={player.playing}
                  className="h-2.5 w-2.5 fill-current"
                />
                <span className="ml-3" aria-hidden="true">
                  Listen
                </span>
              </button> */}
              {/* <span
                aria-hidden="true"
                className="text-sm font-bold text-slate-400"
              >
                /
              </span> */}
              {/* <Link
                href={`/${track.id}`}
                className="flex items-center text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900"
                aria-label={`Show notes for episode ${track.title}`}
              >
                Show notes
              </Link> */}
            </div>
          </div>
        </div>
      </Container>
    </article>
  )
}

export default function Home() {
  const { data: session } = useSession();

  const [playlistUrl, setPlaylistUrl] = useState<string>('');
  const playlistId = (/https:\/\/open.spotify.com\/playlist\/(.*)\?/.exec(playlistUrl) ?? {1: null})[1];

  const { data } = trpc.spotify.playlist.useQuery({ id: playlistId as string }, { enabled: !!playlistId })

  return (
    <>
      <Head>
        <title>
          Spotify Playlist Tools
        </title>
        <meta
          name="description"
          content="Tools for working with Spotify Playlists"
        />
      </Head>
      <Layout playlist={data?.playlist} tracks={data?.tracks}>
        <div className='p-8'>
          <input value={playlistUrl ?? ''} onChange={(e) => setPlaylistUrl(e.target.value)} className='border border-pink-300 p-2 rounded w-full' placeholder='Playlist URL' />
        </div>
        <div className="pt-16 pb-12 sm:pb-4 lg:pt-12">

          <Container className={''}>
            <h1 className="text-2xl font-bold leading-7 text-slate-900">
              Songs
            </h1>
          </Container>
          <div className="divide-y divide-slate-100 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100">
            {data?.tracks.map((track) => (
              <EpisodeEntry key={track.id} track={track} />
            ))}
          </div>
        </div>
      </Layout>
    </>
  )
}

// export async function getStaticProps() {
//   let feed = await parse('https://their-side-feed.vercel.app/api/feed')

//   // return {
//   //   props: {
//   //     episodes: feed.items.map(
//   //       ({ id, title, description, enclosures, published }) => ({
//   //         id,
//   //         title: `${id}: ${title}`,
//   //         published,
//   //         description,
//   //         audio: enclosures.map((enclosure) => ({
//   //           src: enclosure.url,
//   //           type: enclosure.type,
//   //         }))[0],
//   //       })
//   //     ),
//   //   },
//   //   revalidate: 10,
//   // }
// }
