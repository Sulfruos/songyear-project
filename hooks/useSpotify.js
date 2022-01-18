import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import SpotifyWebApi from "spotify-web-api-node"
//import spotifyApi from "../lib/spotify";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
})

export default function useSpotify() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      //if refresh access token attempt fails, direct user to login
      if (session.error === "RefreshAccessTokenError") {
        signIn();
      }

      spotifyApi.setAccessToken(session.user.accessToken); //setting access token for api
    }
  }, [session]); //runs whenever log in or log out

  return spotifyApi;
}