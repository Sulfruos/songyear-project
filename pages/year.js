import { signOut, useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify"
import { getSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { playlistNameState } from "../atoms/playlistNameAtom"
import { playlistState } from "../atoms/playlistAtom"
import { playlistIdState } from "../atoms/playlistIdAtom"
import { useRecoilState, useRecoilValue } from "recoil";
import PlaylistSongs from "../components/PlaylistSongs"

export default function year() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [playlists, setPlaylists] = useState([]);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [playlistName, setPlaylistName] = useRecoilState(playlistNameState);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [fake, setFake] = useState([]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) { //if access token was set
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      })
    }
  }, [session, spotifyApi]);

  useEffect(async () => {
    console.log(playlistId);
    if (spotifyApi.getAccessToken()) {
      let res = await makePlaylistRequest(playlistId).then(setPlaylist(res));
      console.log(res);
      console.log(res.tracks);
      setPlaylist(res);
      console.log(playlist);
    }
  }, [playlistId])

  function makePlaylistRequest(id) {
    return new Promise(function (resolve, reject) {
      spotifyApi.getPlaylist(playlistId)
        .then((data) => {
          resolve(data.body);
        },
          (error) => {
            reject(error);
          })
    })
  }

  async function initSongs() {

    let hit = false;
    if (playlists.length > 1) {
      for (let i = 0; i < playlists.length; i++) {
        console.log(playlists[i].name);
        if (playlists[i].name === "SongYear 2022") {
          console.log("hit!");
          hit = true;
        }
      }
      if (hit === false) {
        spotifyApi.createPlaylist('SongYear 2022', { 'description': 'Playlist for SongYear 2022', 'public': true })
          .then(function (data) {
            console.log('Created playlist!');
          }, function (err) {
            console.log('Something went wrong!', err);
          });
      }
    }
    else {
      console.log("nope");
    }
    for (let i = 0; i < playlists.length; i++) {
      if (playlists[i].name === "SongYear 2022") {
        setPlaylistName(playlists[i].name);
        setPlaylistId(playlists[i].id);
        console.log(playlistId);
        if (playlists[i].id === null) {
          console.log("its null");
        }
        console.log(playlistName);
      }
    }
    setButtonPressed(true)

  }

  //look for a playlist named SongYear 2022. if it doesn't exist, make one

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
        {buttonPressed ? null :
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => initSongs()}>
              See My Year In Music
            </button>
          </div>}
        <div className="flew-grow overflow-y-scroll scrollbar-hide h-screen">
          {buttonPressed === true && playlist !== null ? <PlaylistSongs /> : null}
        </div>
      </main>
    </div>
  )
}
