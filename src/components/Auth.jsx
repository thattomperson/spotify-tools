import { signIn, useSession } from "next-auth/react"

export function Auth({ children }){
  const { status } = useSession();

  if (status == 'unauthenticated') {
    return <div className="absolute inset-0 h-screen flex justify-center items-center">
      <button
        onClick={() => signIn('spotify')}
        className="flex text-lg justify-center py-2 px-4 font-medium rounded-md text-pink-600 bg-white hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 border-pink-300 border"
      >
        Sign in with Spotify
      </button>
    </div>
  }

  if (status == 'loading') {
    return <h1>Loading</h1>
  }

  return children
}