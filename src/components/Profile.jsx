import axios from "axios";
import React, {useEffect, useState} from "react";
import SongList from "./SongList";
import {Spotify} from "react-bootstrap-icons";

let loaded = false;
let baseURL = "https://api.spotify.com/v1";

function Profile(props) {
    let [userData, setData] = useState({});

    function loadedData(data) {
        setData(data);
        loaded = true;
    }

    useEffect(() => {
        axios
            .get(baseURL + "/me", {
                headers: {
                    Authorization: `Bearer ${props.token}`,
                },
            })
            .then((data) => loadedData(data.data))
            .catch((err) => console.log(err));
    }, [props.token, setData]);

    return (
        <div className={"profile-card"}>
            {loaded ? (
                <div>
                    {userData.images && userData.images.length > 0 ? (
                        <div style={{height: "150px", position: "relative"}}>
                            <a href={userData.uri} style={{color: "black"}}>Open using Spotify <Spotify/></a>
                            <br/>
                            <img
                                src={userData.images[0].url}
                                onClick={() => window.open(userData.uri)}
                                style={{
                                    height: "130px",
                                    width: "130px",
                                }}
                                alt={"Profile pic couldn't be loaded"}
                            />


                        </div>
                    ) : (
                        <div
                            style={{height: "150px", width: "100%", textAlign: "center"}}
                        >
                            <h1 style={{fontSize: "1.75rem", color: "white"}}>
                                No <br/> profile <br/>
                                picture
                            </h1>
                        </div>
                    )}
                    <h1
                        style={{cursor: "pointer"}}
                        onClick={() => window.open(userData.external_urls.spotify)}
                    >
                        {userData.display_name}
                    </h1>
                    <SongList token={props.token}/>
                </div>
            ) : (
                <h1>No data</h1>
            )}
        </div>
    );
}

export default Profile;
