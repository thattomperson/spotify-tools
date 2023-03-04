import { SessionProvider } from "next-auth/react"
import { AudioProvider } from '@/components/AudioProvider'
import { Auth } from "@/components/Auth"

import '@/styles/tailwind.css'
import 'focus-visible'
import { trpc } from "../utils/trpc"
import { AppType } from "next/app"
import { Session } from "next-auth"

const MyApp: AppType<{session: Session | null}> = function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <AudioProvider>
        <Auth>
          <Component {...pageProps} />
        </Auth>
      </AudioProvider>
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)