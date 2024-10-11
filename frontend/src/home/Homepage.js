import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavBar } from "../navbar/NavBar";
import Heading from "./Heading";
import Footer from "../footer/Footer";
import ResultGraph from "./ResultGraph";
import Winner from "./winner";
import Map from "../Map";

function Homepage() {
    const { theme } = useContext(ThemeContext);

    const backgroundColor = theme === "dark" ? "#212121" : "white";

    return (
        <div className={`App ${theme}`} style={{ backgroundColor }}>
            <NavBar />
            <Heading />
            <div className="graphWinner-container" style={{ backgroundColor }}>
                <ResultGraph />
                <Winner />
            </div>
            <Map />
            <br />
            <Footer />
        </div>
    );
}

export default Homepage;
