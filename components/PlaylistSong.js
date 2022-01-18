import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { millisToMinutesAndSeconds } from "../lib/time";
import { signOut, useSession } from "next-auth/react";

export default function PlaylistSong({ order, track }) {
  const spotifyApi = useSpotify();

  const playSong = () => {
    console.log("playing song...");
    spotifyApi.play({
      uris: [track.track.uri], //what song you want to play
    }).catch(function (error) {
      console.error(error);
    });
  }

  function calcDate(num) {
    var today = new Date();
    today.setDate(today.getDate() - num);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    today = mm + '/' + dd;
    return today;
  }

  return (
    <div className="grid grid-cols-2 text-gray-500 py-4 px-5 
    hover:bg-red-600 rounded-lg cursor-pointer"
      onClick={playSong}>
      <div className="flex items-center space-x-4">
        <p>{calcDate(order)}</p> {/*order starts from - */}
        <img className="h-10 w-10"
          src={track.track.album.images[0].url}
          alt=""
        />
        <div>
          <p className="w-36 lg:w-64 truncate text-black">{track.track.name}</p>
          <p className="w-40">{track.track.artists[0].name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden md:inline">{track.track.album.name}</p>
        <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
      </div>
    </div>
  )
}
