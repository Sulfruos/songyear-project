import { useRecoilValue } from "recoil";
import spotifyApi from "../lib/spotify";
import PlaylistSong from "./PlaylistSong"
import { signOut, useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { useEffect, useState } from "react";
import { playlistIdState } from "../atoms/playlistIdAtom"
import { playlistState } from "../atoms/playlistAtom"

export default function PlaylistSongs() {
  const playlistId = useRecoilValue(playlistIdState);
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const playlist = useRecoilValue(playlistState);


  return (
    <div className="pl-2 pr-8 flex flex-col space-y-1 pb-28 text-black">
      {playlist?.tracks.items.map((track, i) => (
        <PlaylistSong key={track.track.id} track={track} order={playlist?.tracks.items.length - i - 1} />
      ))}
    </div>
  )
}