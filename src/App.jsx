import React, {useEffect, useState} from "react";
import "react-spotify-auth/dist/index.css";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Player from "./components/Player";

function App() {
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

    return (
        <div className="App">
            <header className="App-header">
                {!token ? (
                    <Login/>
                ) : (
                    <div className={"cards"}>
                        <button onClick={logout}>Logout</button>
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col col-lg-4 col-md-12">
                                    <Player token={token}/>
                                </div>
                                <div className="col col-lg-4 col-md-12">
                                    <Profile token={token}/>
                                </div>
                                <div className="col col-lg-4 col-md-12">
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;
