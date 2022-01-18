import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react"
import { shuffle, difference } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectionsState } from "../atoms/selectionsAtom"
import useSpotify from "../hooks/useSpotify"
import Songs from "../components/Songs"
import { showingSongsState } from "../atoms/showingSongsAtom";
import { addedSongState } from "../atoms/addedSongAtom";
import { playlistNameState } from "../atoms/playlistNameAtom"
import { playlistIdState } from "../atoms/playlistIdAtom"


export default function Home() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  let lodash = require("lodash");

  const [showingSongs, setShowingSongs] = useRecoilState(showingSongsState);
  const songAdded = useRecoilValue(addedSongState);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [playlistName, setPlaylistName] = useRecoilState(playlistNameState);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) { //if access token was set
      spotifyApi.getUserPlaylists().then((data: any) => {
        setPlaylists(data.body.items);
      })
    }
  }, [session, spotifyApi]);

  function initSongs() {

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
          .then(function (data: any) {
            console.log('Created playlist!');
          }, function (err: any) {
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
        setPlaylistId(playlists[i].id)
        console.log(playlistName);
      }
    }
  }

  function makeTermRequest(lim: number, range: string) {
    return new Promise<[]>(function (resolve, reject) {
      spotifyApi
        .getMyTopTracks({
          limit: lim,
          time_range: range,
        })
        .then((data: any) => {
          resolve(data.body.items);
        },
          (error: any) => {
            reject(error);
          })
    })
  }

  function makeHistoryRequest(lim: number) {
    return new Promise<[]>(function (resolve, reject) {
      spotifyApi
        .getMyRecentlyPlayedTracks({
          limit: lim,
        })
        .then((data: any) => {
          resolve(data.body.items);
        },
          (error: any) => {
            reject(error);
          })
    })
  }

  async function getTodaysTracks() {
    let shortTerm: any[];
    shortTerm = [];
    let mediumTerm: any[];
    mediumTerm = [];
    let longTerm: any[];
    longTerm = [];
    let recentlyPlayed: any[];
    recentlyPlayed = [];

    let shortTermNames: any[];
    shortTermNames = [];
    let mediumTermNames: any[];
    mediumTermNames = [];
    let longTermNames: any[];
    longTermNames = [];
    let recentlyPlayedNames: any[];
    recentlyPlayedNames = [];


    recentlyPlayed = await makeHistoryRequest(30);
    shortTerm = await makeTermRequest(20, "short_term");
    mediumTerm = await makeTermRequest(30, "medium_term");
    longTerm = await makeTermRequest(45, "long_term");

    for (let i = 0; i < recentlyPlayed.length; i++) {
      recentlyPlayedNames.push(recentlyPlayed[i].track.name);
    }

    for (let i = 0; i < shortTerm.length; i++) {
      shortTermNames.push(shortTerm[i].name);
    }
    for (let i = 0; i < mediumTerm.length; i++) {
      mediumTermNames.push(mediumTerm[i].name);
    }

    for (let i = 0; i < longTerm.length; i++) {
      longTermNames.push(longTerm[i].name);
    }

    shortTermNames = difference(shortTermNames, recentlyPlayedNames);
    mediumTermNames = difference(mediumTermNames, shortTermNames, recentlyPlayedNames);
    longTermNames = difference(longTermNames, mediumTermNames, shortTermNames, recentlyPlayedNames);

    for (let i = 0; i < shortTerm.length; i++) {
      var index = shortTermNames.indexOf(shortTerm[i].name);
      if (index === -1) {
        shortTerm.splice(i, 1);
        i--;
      }
    }

    for (let i = 0; i < mediumTerm.length; i++) {
      var index = mediumTermNames.indexOf(mediumTerm[i].name);
      if (index === -1) {
        mediumTerm.splice(i, 1);
        i--;
      }
    }

    for (let i = 0; i < longTerm.length; i++) {
      var index = longTermNames.indexOf(longTerm[i].name);
      if (index === -1) {
        longTerm.splice(i, 1);
        i--;
      }
    }

    let highestCount = 0;
    let highestIndex = 0;
    recentlyPlayedNames.sort();

    for (let i = 1; i < recentlyPlayedNames.length; i++) {
      let count = 0;
      while (recentlyPlayedNames[i] === recentlyPlayedNames[i - 1]) {
        count++;
        if (count > highestCount) {
          highestCount = count;
          highestIndex = i;
        }
        i++;
      }
    }
    let mostPlayedName = recentlyPlayedNames[highestIndex];

    for (let i = 0; i < recentlyPlayedNames.length; i++) {
      while (recentlyPlayedNames[i] === recentlyPlayedNames[i - 1]) {
        recentlyPlayedNames.splice(i - 1, 1);
      }
    }

    recentlyPlayedNames = shuffle(recentlyPlayedNames);
    shortTerm = shuffle(shortTerm);
    mediumTerm = shuffle(mediumTerm);
    longTerm = shuffle(longTerm);

    let selectionArr: any[]; //array for the songs the user can select from
    selectionArr = [];

    let height = 3;
    for (let i = 0; i < height; i++) {
      if (recentlyPlayedNames[i] === mostPlayedName) {
        i++;
        height++;
      }
      let find = recentlyPlayed.findIndex(element => element.track.name === recentlyPlayedNames[i]);
      console.log(recentlyPlayed[find].track);
      selectionArr.push(recentlyPlayed[find].track);
    }
    for (let i = 0; i < 4; i++) {
      selectionArr.push(shortTerm[i]);
    }
    selectionArr.push(mediumTerm[0]);
    selectionArr.push(longTerm[0]);
    let find = recentlyPlayed.findIndex(element => element.track.name === mostPlayedName);
    selectionArr.push(recentlyPlayed[find].track);


    for (let i = 0; i < selectionArr.length; i++) {
      console.log(selectionArr[i].name);
    }

    selectionArr = shuffle(selectionArr);



    console.log(selectionArr);

    console.log("selections: ");
    console.log(selections);

    setSelections(selectionArr);

    console.log("selections: ");
    console.log(selections);


    return selectionArr;

  }

  const [selections, setSelections] = useRecoilState(selectionsState);

  useEffect(() => {
    getTodaysTracks()
      .then((res: any) => {
        setSelections(res);
        console.log(selections);
      })
  }, [])

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
        <div>
          <div>
            {(showingSongs === false && songAdded === false) ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  setShowingSongs(true);
                  initSongs(); //now we have playlist id
                }}>
                Show Me My Top Tracks Today
              </button>
            </div> : null}
            {(showingSongs === false && songAdded === true) ?
              <h1 className="flex justify-center items-center h-screen text-3xl">All done for today! Check out your year in music and come back tomorrow to add another song!</h1> : null}
          </div>
          <div className="flew-grow overflow-y-scroll scrollbar-hide h-screen" >
            {(showingSongs === true && songAdded === false) ? <Songs /> : null}
          </div>
        </div>
      </main>
    </div>
  )
}



export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  //pre fetch session to get key beforehand 
  //basically prerendering user on server so we get access key before it
  //hits client

  return {
    props: {
      session
    }
  }
}
