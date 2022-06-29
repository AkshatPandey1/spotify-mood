import React, {useEffect, useState} from "react";
import axios from "axios";
import {PlayCircleFill, Spotify} from "react-bootstrap-icons";

let baseURL = "https://api.spotify.com/v1";

function SongList(props) {
    let [songs, setSongs] = useState([]);
    let [buttonNumber, setNumber] = useState(0);
    let [subButton, setSubNumber] = useState(0);

    function setRecent(items) {
        let array = [];
        items.forEach((value) => {
            array.push(value.track);
        });
        setSongs(array);
    }

    function addToQueue(uri) {
        axios
            .post(
                baseURL + "/me/player/queue?uri=" + uri,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${props.token}`,
                    },
                }
            )
            .then(() => {
                axios
                    .post(
                        baseURL + "/me/player/next",
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${props.token}`,
                            },
                        }
                    )
                    .then(() => console.log("Playing song"));
            });
    }

    function colorButton(selectedButton, unselectedButtons) {
        if (unselectedButtons) {
            document.querySelector(unselectedButtons[1]).style.opacity = 0.7;
            document.querySelector(unselectedButtons[0]).style.opacity = 0.7;
        }
        document.querySelector(selectedButton).style.opacity = 1;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function getRecent() {
        axios
            .get(baseURL + "/me/player/recently-played", {
                headers: {
                    Authorization: `Bearer ${props.token}`,
                },
            })
            .then((data) => setRecent(data.data.items));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function getTopArtists(term) {
        axios
            .get(baseURL + "/me/top/artists?time_range=" + term, {
                headers: {
                    Authorization: `Bearer ${props.token}`,
                },
            })
            .then((data) => setSongs(data.data.items));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function getTopTracks(term) {
        axios
            .get(baseURL + "/me/top/tracks?time_range=" + term, {
                headers: {
                    Authorization: `Bearer ${props.token}`,
                },
            })
            .then((data) => setSongs(data.data.items));
    }

    useEffect(() => {
        let term = ["short_term", "medium_term", "long_term"];
        if (buttonNumber === -1) {
            getRecent();
            colorButton(".b1", [".b2", ".b3"]);
        } else if (buttonNumber === 0) {
            getTopTracks(term[subButton]);
            colorButton(".b2", [".b1", ".b3"]);
            colorButton(
                ".sb" + String(subButton + 1),
                [".sb1", ".sb2", ".sb3"].filter((value, index) => {
                    return index !== subButton;
                })
            );
        } else {
            getTopArtists(term[subButton]);
            colorButton(".b3", [".b1", ".b2"]);
            colorButton(
                ".sb" + String(subButton + 1),
                [".sb1", ".sb2", ".sb3"].filter((value, index) => {
                    return index !== subButton;
                })
            );
        }
    }, [buttonNumber, subButton]);

    return (
        <div>
            <div className="song-list-buttons">
                <div className="row">
                    <div className="col b1">
                        <h6 onClick={() => setNumber(-1)}>Recently Played</h6>
                    </div>
                    <div className="col b2">
                        <h6 onClick={() => setNumber(0)}>Top Tracks</h6>
                    </div>
                    <div className="col b3">
                        <h6 onClick={() => setNumber(1)}>Top Artists</h6>
                    </div>
                </div>
            </div>
            {buttonNumber !== -1 ? (
                <div className={"song-list-buttons sub"}>
                    <div className="row justify-content-center">
                        <div className="col col-3 sb1">
                            <h6 onClick={() => setSubNumber(0)}>Recent</h6>
                        </div>
                        <div className="col col-3 sb2">
                            <h6 onClick={() => setSubNumber(1)}>6 Months</h6>
                        </div>
                        <div className="col col-3 sb3">
                            <h6 onClick={() => setSubNumber(2)}>All Time</h6>
                        </div>
                    </div>
                </div>
            ) : null}
            <div className={"song-list"}>
                {songs.map((val, index) => {
                    return (
                        <div key={index} className="row" style={{padding: "0 5%"}}>
                            <div className={"col col-2 d-flex justify-content-center"}>
                                <h2>{index + 1}</h2>
                            </div>
                            <div className={"col col-8"} onClick={() => window.open(val.uri)}>
                                <h1>{val.name.slice(0, 16)} <Spotify/></h1>
                            </div>
                            {buttonNumber !== 1 ? (
                                <div
                                    className={"col col-2 d-flex justify-content-center player-buttons"}
                                    style={{fontSize: "1.5rem"}}
                                    onClick={() => addToQueue(val.uri)}
                                >
                                    <PlayCircleFill/>
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SongList;
