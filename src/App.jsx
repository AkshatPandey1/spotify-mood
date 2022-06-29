import React, {useEffect, useState} from "react";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Player from "./components/Player";
import Recommender from "./components/Recommender";
import {Github} from "react-bootstrap-icons";

function App() {
    const [token, setToken] = useState("");

    function diff_minutes(dt2, dt1) {
        let diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff));
    }

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
            window.localStorage.tokenTime = new Date();
        } else if (
            token &&
            diff_minutes(new Date(window.localStorage.tokenTime), new Date()) > 30
        ) {
            logout();
            alert("30 min session limit passed, login again");
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
                        <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
                            <a className="navbar-brand" href="/">
                                Music For Mood
                            </a>
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarNav"
                                aria-controls="navbarNav"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div
                                className="collapse navbar-collapse justify-content-end"
                                id="navbarNav"
                            >
                                <ul className="navbar-nav">
                                    <li className="nav-item active">
                                        <a
                                            className="nav-link"
                                            href={"https://github.com/AkshatPandey1/spotify-mood"}
                                        >
                                            <Github/>
                                        </a>
                                    </li>
                                </ul>
                                <ul className="navbar-nav">
                                    <li className="nav-item active">
                                        <a className="nav-link" href={"/"} onClick={logout}>
                                            Logout
                                        </a>
                                    </li>

                                </ul>
                            </div>
                        </nav>
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col col-lg-4 col-md-12 d-flex justify-content-center">
                                    <Player token={token}/>
                                </div>
                                <div className="col col-lg-4 col-md-12 d-flex justify-content-center">
                                    <Profile token={token}/>
                                </div>
                                <div className="col col-lg-4 col-md-12 d-flex justify-content-center">
                                    <Recommender token={token}/>
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
