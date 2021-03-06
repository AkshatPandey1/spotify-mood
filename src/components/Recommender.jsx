import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  EmojiExpressionlessFill,
  EmojiFrownFill,
  EmojiLaughingFill,
  EmojiNeutralFill,
  EmojiSmileFill,
} from "react-bootstrap-icons";

let baseURL = "https://api.spotify.com/v1";
let moodNum = 3;
function Recommender(props) {
  let [songs, setSongs] = useState(null);
  let [seedSongs, setSeedSongs] = useState(null);
  let [seedArtists, setArtists] = useState(null);
  let [uriPlaylist, setPlaylist] = useState(null);
  function shuffle(array) {
    return array.sort(() => {
      const randomTrueOrFalse = Math.random() > 0.5;
      return randomTrueOrFalse ? 1 : -1;
    });
  }

  function submit(mood) {
    setPlaylist(null);
    moodNum = mood;
    let artistsIDs = seedArtists.map((artist) => artist.id);
    let genres = seedArtists
      .map((artist) => artist.genres.toString())
      .join(",")
      .split(",");
    let trackIDs = seedSongs.map((songs) => songs.id);

    let URL =
      baseURL +
      "/recommendations?" +
      "seed_artists=" +
      String(shuffle(artistsIDs).slice(0, 1)) +
      "&seed_genres=" +
      String(shuffle(genres).slice(0, 2)) +
      "&seed_tracks=" +
      String(shuffle(trackIDs).slice(0, 2));

    if (mood === 1) URL += "&min_energy=0&max_energy=0.3&min_valence=0.5&max_valence=1";
    else if (mood === 2) URL += "&min_energy=0.3&max_energy=0.5&min_valence=0.5&max_valence=1.0";
    else if (mood === 3) URL += "&min_energy=0.5&max_energy=0.7&min_valence=0.5&max_valence=1.0";
    else if (mood === 4) URL += "&min_energy=0.6&max_energy=0.8&min_valence=0.5&max_valence=1.0";
    else if (mood === 5) URL += "&min_energy=0.7&max_energy=1&min_valence=0.5&max_valence=1.0";

    axios
      .get(URL, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((data) => setSongs(data.data.tracks));
  }

  function embedMaker(URL) {
    URL = URL.split("/track");
    URL = URL.join("/embed/track") + "?utm_source=generator";
    return URL;
  }

  function createPlaylist() {
    axios
      .get(baseURL + "/me", {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((data) => {
        axios
          .post(
            baseURL + `/users/${data.data.id}/playlists`,
            {
              name: "Mood:  " + new Date().toDateString(),
              description:
                "Created using https://music-for-mood.herokuapp.com/",
              public: "true",
            },
            {
              headers: {
                Authorization: `Bearer ${props.token}`,
              },
            }
          )
          .then((data) => {
            setPlaylist(data.data.uri);
            axios.post(
              baseURL +
                `/playlists/${data.data.id}/tracks?uris=${String(
                  songs.map((song) => {
                    return song.uri;
                  })
                )}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${props.token}`,
                },
              }
            );
          });
      });
  }

  useEffect(() => {
    axios
      .get(baseURL + "/me/top/tracks?time_range=short_term&limit=10", {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((data) => setSeedSongs(data.data.items));
    axios
      .get(baseURL + "/me/top/artists?time_range=short_term&limit=10", {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((data) => setArtists(data.data.items));
  }, [props.token]);

  return (
    <div className={"profile-card"}>
      {songs ? (
        <div className={"recommended-songs"} style={{position: "relative"}}>
          <h1>Songs for you :)</h1>
            <button style={{fontSize: "1.25rem", position: "absolute", right: "130px"}} onClick={() => setSongs(null)}>Change mood</button>
          <div className={"song-list"}>
            {songs.map((val, index) => {
              return (
                <div
                  key={index}
                  className="row"
                  onClick={() => window.open(val.external_urls.spotify)}
                >
                  <iframe
                    title={index}
                    style={{ borderRadius: "12px" }}
                    src={embedMaker(val.external_urls.spotify)}
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allowFullScreen=""
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  ></iframe>
                </div>
              );
            })}
          </div>
          {uriPlaylist ? (
            <button
              onClick={() => window.open(uriPlaylist)}
              style={{ padding: "10px 20px 0 0", fontSize: "1.5rem" }}
            >
              View Playlist
            </button>
          ) : (
            <button
              onClick={() => createPlaylist()}
              style={{ padding: "10px 20px 0 0", fontSize: "1.5rem" }}
            >
              Create Playlist
            </button>
          )}
          <button
            onClick={() => submit(moodNum)}
            style={{ padding: "10px 0 0 20px", fontSize: "1.5rem" }}
          >
            Refresh List
          </button>
        </div>
      ) : (
        <div className={"question"}>
          <h1>How are you feeling today?</h1>
          <div className={"choices"}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col col-sm-2">
                  <h2 className={"mood-buttons"} onClick={() => submit(1)}>
                    <EmojiFrownFill />
                  </h2>
                </div>
                <div className="col col-sm-2">
                  <h2 className={"mood-buttons"} onClick={() => submit(2)}>
                    <EmojiExpressionlessFill />
                  </h2>
                </div>
                <div className="col col-sm-2">
                  <h2 className={"mood-buttons"} onClick={() => submit(3)}>
                    <EmojiNeutralFill />
                  </h2>
                </div>
                <div className="col col-sm-2">
                  <h2 className={"mood-buttons"} onClick={() => submit(4)}>
                    <EmojiSmileFill />
                  </h2>
                </div>
                <div className="col col-sm-2">
                  <h2 className={"mood-buttons"} onClick={() => submit(5)}>
                    <EmojiLaughingFill />
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recommender;
