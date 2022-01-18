import useSpotify from "../hooks/useSpotify";
import { useRecoilState, useRecoilValue } from "recoil";
import { millisToMinutesAndSeconds } from "../lib/time";
import { useEffect, useState } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { addedSongState } from "../atoms/addedSongAtom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showingSongsState } from "../atoms/showingSongsAtom";
import { playlistIdState } from "../atoms/playlistIdAtom"

export default function Song({ order, track, color }) {
  const spotifyApi = useSpotify();
  const [open, setOpen] = useState(false);
  const [isSongAdded, setIsSongAdded] = useRecoilState(addedSongState);
  const [showingSongs, setShowingSongs] = useRecoilState(showingSongsState);
  const playlistId = useRecoilValue(playlistIdState);

  const closeModal = () => setOpen(false);
  //now we have playlist id set

  const playSong = () => {
    console.log("playing song...");
    spotifyApi.play({
      uris: [track.uri],
    }).catch(function (error) {
      console.error(error);
    });
    setOpen(true);

  }

  return (
    <div>
      <div className={`grid grid-cols-2 text-gray-500 py-4 px-5 
    hover:bg-red-600 rounded-lg cursor-pointer`}
        onClick={playSong}>
        <div className="flex items-center space-x-4">
          <p>{order + 1}</p> {/*order starts from - */}
          <img className="h-10 w-10"
            src={track !== null ? track.album.images[0].url : ""}
            alt=""
          />
          <div>
            <p className="w-36 lg:w-64 truncate text-black">{track !== null ? track.name : ""}</p>
            <p className="w-40">{track !== null ? track.artists[0].name : ""}</p>
          </div>
        </div>
        <div className="flex items-center justify-between ml-auto md:ml-0">
          <p className="w-40 hidden md:inline">{track !== null ? track.album.name : ""}</p>
          <p>{millisToMinutesAndSeconds(track !== null ? track.duration_ms : "")}</p>
        </div>
      </div>
      <Popup open={open}
        modal
        nested
      >
        {
          <div className="text-xl">
            <button className="close" onClick={closeModal}>
              &times;
            </button>
            <div className="border-b-2 border-gray-900 text-xl text-center p-1"> Choose Song </div>
            <div className="py-4 px-2">
              {' '}
              Is this the song you want to add to your journal?
            </div>
            <div className="pb-4 pt-2 m-auto text-center">
              <button
                className="bg-white hover:bg-blue text-gray-800 font-semibold py-2 px-8 border border-gray-400 rounded shadow"
                onClick={() => {
                  //add song here using playlistId
                  spotifyApi.addTracksToPlaylist(playlistId, [track.uri])
                    .then(function (data) {
                      console.log('Added song to playlist!');
                    }, function (err) {
                      console.log('Something went wrong!', err);
                    });
                  toast.success('Song added succesfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    onClose: () => {
                      setIsSongAdded(true);
                      setShowingSongs(false);
                      closeModal();
                    }
                  });
                }}
              >
                Yes
              </button>
              <ToastContainer />
            </div>
          </div>}
      </Popup>
    </div>

    /*<div className={`grid grid-cols-2 text-gray-500 py-4 px-5 
    hover:bg-red-600 rounded-lg cursor-pointer`}
      onClick={playSong}>
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p> 
        <img className="h-10 w-10"
          src={track !== null ? track.album.images[0].url : ""}
          alt=""
        />
        <div>
          <p className="w-36 lg:w-64 truncate text-black">{track !== null ? track.name : ""}</p>
          <p className="w-40">{track !== null ? track.artists[0].name : ""}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden md:inline">{track !== null ? track.album.name : ""}</p>
        <p>{millisToMinutesAndSeconds(track !== null ? track.duration_ms : "")}</p>
      </div>
  </div>*/
  )
}
