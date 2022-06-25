import React, {useEffect, useState} from "react";
import axios from "axios";
import {PlayCircleFill, SkipBackwardCircleFill, SkipForwardCircleFill,} from "react-bootstrap-icons";

let baseURL = "https://api.spotify.com/v1";
let paused = false;

function Player(props) {
    let [song, setSong] = useState(null);

    function millisToMinutesAndSeconds(millis) {
        let minutes = Math.floor(millis / 60000);
        let seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    function changeSong(type) {
        axios
            .post(baseURL + "/me/player/" + type, null, {
                headers: {
                    Authorization: `Bearer ${props.token}`,
                },
            })
            .catch((err) => console.log("Try again"));
        axios
            .get(baseURL + "/me/player/currently-playing", {
                headers: {
                    Authorization: `Bearer ${props.token}`,
                },
            })
            .then((data) => setSong(data.data))
            .catch((err) => console.log("Can't fetch play data"));
    }

    function playOPause() {
        let string = "play";
        if (paused === false) {
            paused = true;
            string = "pause";
        } else {
            paused = false;
        }
        axios
            .put(baseURL + "/me/player/" + string, null, {
                headers: {
                    Authorization: `Bearer ${props.token}`,
                },
            })
            .catch((err) => console.log("Try again"));
    }

    useEffect(() => {
        const interval = setInterval(() => {
            axios
                .get(baseURL + "/me/player/currently-playing", {
                    headers: {
                        Authorization: `Bearer ${props.token}`,
                    },
                })
                .then((data) => setSong(data.data))
                .catch((err) => console.log("Can't fetch play data"));
        }, 5000);
        return () => clearInterval(interval);
    }, [props.token]);

    return (
        <div className={"profile-card"}>
            <h1 style={{marginBottom: "25px"}}>Currently Playing</h1>
            {song ? (
                <div style={{height: "150px", width: "400px", textAlign: "center"}}>
                    {song.item.album.images && song.item.album.images.length > 0 ? (
                        <img
                            src={song.item.album.images[0].url}
                            alt={"Cannot load"}
                            style={{height: "150px", width: "150px"}}
                            onClick={() => console.log(song)}
                        />
                    ) : (
                        <h1>No song image</h1>
                    )}
                    <h4
                        style={{marginTop: "10px", cursor: "pointer"}}
                        onClick={() => window.open(song.item.external_urls.spotify)}
                    >
                        {song.item.name.slice(0, 25)}
                    </h4>
                    <div className="song-control">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div
                                    className="col col-sm-2"
                                    onClick={() => changeSong("previous")}
                                >
                                    <h2 className={"player-buttons"}>
                                        <SkipBackwardCircleFill/>
                                    </h2>
                                </div>
                                <div className="col col-sm-2" onClick={playOPause}>
                                    <h2 className={"player-buttons"}>
                                        <PlayCircleFill/>
                                    </h2>
                                </div>
                                <div
                                    className="col col-sm-2"
                                    onClick={() => changeSong("next")}
                                >
                                    <h2 className={"player-buttons"}>
                                        <SkipForwardCircleFill/>
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"song-details"}>
                        {song ? (
                            <div>
                                <div className="container">
                                    <div className="row highlight">
                                        <div className="col col-sm-6">
                                            <h6>Name</h6>
                                        </div>
                                        <div className="col col-sm-6">
                                            <h6>{song.item.name}</h6>
                                        </div>
                                    </div>
                                    <div className="row highlight">
                                        <div className="col col-sm-6">
                                            <h6>Artists</h6>
                                        </div>
                                        <div className="col col-sm-6">
                                            <h6>
                                                {song.item.artists
                                                    .map((artist) => {
                                                        return artist.name;
                                                    })
                                                    .join(", ")}
                                            </h6>
                                        </div>
                                    </div>
                                    <div className="row highlight">
                                        <div className="col col-sm-6">
                                            <h6>Type</h6>
                                        </div>
                                        <div className="col col-sm-6">
                                            <h6>
                                                {song.item.album.album_type.charAt(0).toUpperCase() +
                                                    song.item.album.album_type.slice(1)}
                                            </h6>
                                        </div>
                                    </div>
                                    <div className="row highlight">
                                        <div className="col col-sm-6">
                                            <h6>Duration</h6>
                                        </div>
                                        <div className="col col-sm-6">
                                            <h6>
                                                {millisToMinutesAndSeconds(song.item.duration_ms)}
                                            </h6>
                                        </div>
                                    </div>
                                    <div className="row highlight">
                                        <div className="col col-sm-6">
                                            <h6>Popularity</h6>
                                        </div>
                                        <div className="col col-sm-6">
                                            <h6>{String(song.item.popularity) + "%"}</h6>
                                        </div>
                                    </div>
                                    <div className="row highlight">
                                        <div className="col col-sm-6">
                                            <h6>Release Date</h6>
                                        </div>
                                        <div className="col col-sm-6">
                                            <h6>
                                                {String(
                                                    new Date(
                                                        song.item.album.release_date
                                                    ).toLocaleDateString()
                                                )}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <h1>Can't load song data</h1>
                        )}
                    </div>
                </div>
            ) : (
                <h1>Nothing is playing, can't load player</h1>
            )}
        </div>
    );
}

export default Player;
