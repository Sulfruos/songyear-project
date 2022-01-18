import { signOut, useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify"
import { getSession } from "next-auth/react"

export default function about() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  return (
    <div className="bg-red-400 h-screen overflow-hidden">
      <nav className="flex items-center justify-between flex-wrap bg-orange-400  p-6">
        <div className="flex items-center flex-shrink-0 text-black mr-6">
          <span className="font-semibold text-xl tracking-tight">SongYear</span>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow">
            <a href="/about" className="block mt-4 lg:inline-block lg:mt-0 text-black-200 hover:text-white mr-4">
              How it Works
            </a>
            <a href="/" className="block mt-4 lg:inline-block lg:mt-0 text-black-200 hover:text-white mr-4">
              Today's Choices
            </a>
            <a href="/year" className="block mt-4 lg:inline-block lg:mt-0 text-black-200 hover:text-white">
              Your Year In Music
            </a>
          </div>
          <div>
            <button className="inline-block text-sm px-4 py-2 leading-none border rounded text-black border-black hover:border-transparent hover:text-orange-500 hover:bg-white mt-4 lg:mt-0" onClick={() => signOut()}>Log Out</button>
          </div>
        </div>
      </nav>
      <main>
        <h1 className="px-10 py-10 text-3xl">Some emotions are really hard to describe with words.
          Yet, no matter how you feel, there always seems to be some song that fits your vibe perfectly.
          SongYear is an app I made so that you can record how you feel everyday
          applying this unique property of music. Using an algorithm powered by
          Spotify, this app fetches 10 songs you have an affinity
          for daily and lets you choose between them (you can also play them from
          this app if you have Spotify Premium open and playing music!).
          Select one that resonates right now and log it into the journal. When you want to
          see the past songs you've added, check out "Your Year In Music"
          or stream them using the SongYear playlist that's made on your Spotify account!
        </h1>
      </main>
    </div>
  )
}
