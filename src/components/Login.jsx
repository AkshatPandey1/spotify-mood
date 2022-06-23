import React from "react";

function Login() {
    const CLIENT_ID = process.env.REACT_APP_CID;
    const REDIRECT_URI = process.env.REACT_APP_URI;
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";

    return (
        <div className={"div-size"}>
            <h1>Spotify Profile Viewer</h1>

            <div className={"login"}>
                <a
                    href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-read-currently-playing,streaming`}
                >
                    Login to Spotify
                </a>
            </div>
        </div>
    );
}

export default Login;
