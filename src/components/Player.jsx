import React, {useEffect, useState} from "react";
import axios from "axios";

let baseURL = "https://api.spotify.com/v1";

function Player(props) {
    let [song, setSong] = useState(null);

    useEffect(() => {
        axios
            .get(baseURL + "/me/player/currently-playing", {
                headers: {
                    Authorization: `Bearer ${props.token}`,
                },
            })
            .then((data) => setSong(data.data));
    });

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
                        />
                    ) : (
                        <h1>No song image</h1>
                    )}
                    <h4
                        style={{marginTop: "10px", cursor: "pointer"}}
                        onClick={() => window.open(song.item.external_urls.spotify)}
                    >
                        {song.item.name}
                    </h4>
                </div>
            ) : (
                <h1>No data</h1>
            )}
        </div>
    );
}

export default Player;
