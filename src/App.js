import React, {useEffect, useState} from "react";
import "react-spotify-auth/dist/index.css";
import axios from "axios";

function App() {
    const CLIENT_ID = process.env.REACT_APP_CID;
    const REDIRECT_URI = process.env.REACT_APP_URI;
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";

    const [token, setToken] = useState("");

    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token");

        if (!token && hash) {
            token = hash
                .substring(1)
                .split("&")
                .find((elem) => elem.startsWith("access_token"))
                .split("=")[1];

            window.location.hash = "";
            window.localStorage.setItem("token", token);
        }

        setToken(token);
    }, []);

    const logout = () => {
        setToken("");
        window.localStorage.removeItem("token");
    };

    const getUser = async (e) => {
        e.preventDefault();
        const {data} = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(data);
    };


    return (
        <div className="App">
            <header className="App-header">
                <h1>Spotify React</h1>
                {!token ? (
                    <a
                        href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
                    >
                        Login to Spotify
                    </a>
                ) : (
                    <div>
                        <button onClick={getUser}>Get Data</button>
                        <button onClick={logout}>Logout</button>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;
