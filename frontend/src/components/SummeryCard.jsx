import React, { useContext } from "react";
import districtData from "./../data/electioin_data.json";
import { ThemeContext } from "../ThemeContext";
import "./MyMap.css";

const SummeryCard = ({ districtName, buttonName }) => {
    const { theme } = useContext(ThemeContext);
    const colors = [];
    const images = [];
    let names = [];
    let voteCount = [5634915, 4363035, 2299767, 342781, 679118];
    let sum = voteCount.reduce((acc, curr) => acc + curr, 0);

    const getCardClass = () =>
        theme === "dark" ? "card_analysis_dark" : "card_analysis_lite";

    if (!districtName) {
        return (
            <>
                <div className="cardRow">
                    <div className={getCardClass()}>
                        <img src="anura.png" alt="candidate" />
                        <p>Vote count: {voteCount[0].toLocaleString()}</p>
                        <p>
                            Percentage:{" "}
                            {((voteCount[0] * 100) / sum).toFixed(2)}%
                        </p>
                    </div>
                    <div className={getCardClass()}>
                        <img src="sajith.png" alt="candidate" />
                        <p>Vote count: {voteCount[1].toLocaleString()}</p>
                        <p>
                            Percentage:{" "}
                            {((voteCount[1] * 100) / sum).toFixed(2)}%
                        </p>
                    </div>
                </div>
                <div className="cardRow">
                    <div className={getCardClass()} style={{ display: "flex" }}>
                        <img src="ranil.png" alt="candidate" />
                        <p>Vote count: {voteCount[2].toLocaleString()}</p>
                        <p>
                            Percentage:{" "}
                            {((voteCount[2] * 100) / sum).toFixed(2)}%
                        </p>
                    </div>
                    <div className={getCardClass()} style={{ display: "flex" }}>
                        <img src="namal.png" alt="candidate" />
                        <p>Vote count: {voteCount[3].toLocaleString()}</p>
                        <p>
                            Percentage:{" "}
                            {((voteCount[3] * 100) / sum).toFixed(2)}%
                        </p>
                    </div>
                </div>
            </>
        );
    }

    const selectedDistrictData = districtData.find(
        (district) => district.districtName === districtName
    );

    if (!selectedDistrictData) {
        return <div>No voting data available for {districtName}.</div>;
    }

    if (buttonName === "district") {
        names = selectedDistrictData.districtResult.map(
            (districtResult) => districtResult.candidateName
        );
        voteCount = selectedDistrictData.districtResult.map(
            (districtResult) => districtResult.totalVotes
        );
        sum = voteCount.reduce((acc, curr) => acc + curr, 0);
    } else if (buttonName === "postal") {
        names = selectedDistrictData.postalResult.map(
            (postalResult) => postalResult.candidateName
        );
        voteCount = selectedDistrictData.postalResult.map(
            (postalResult) => postalResult.totalVotes
        );
        sum = voteCount.reduce((acc, curr) => acc + curr, 0);
    } else if (buttonName === "preference") {
        names = selectedDistrictData.preferenceResult.map(
            (preferenceResult) => preferenceResult.candidateName
        );
        voteCount = selectedDistrictData.preferenceResult.map(
            (preferenceResult) => preferenceResult.totalVotes
        );
        sum = voteCount.reduce((acc, curr) => acc + curr, 0);
    } else {
        names = selectedDistrictData.districtResult.map(
            (districtResult) => districtResult.candidateName
        );
        voteCount = selectedDistrictData.districtResult.map(
            (districtResult) => districtResult.totalVotes
        );
        sum = voteCount.reduce((acc, curr) => acc + curr, 0);
    }

    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        if (name === "Anura Kumara Dissanayake") {
            colors.push("#c80d4d");
            images.push("/anura.png");
        } else if (name === "Sajith Premadasa") {
            colors.push("#51a303");
            images.push("/sajith.png");
        } else if (name === "Ranil Wickremesinghe") {
            colors.push("#fab002");
            images.push("/ranil.png");
        } else if (name === "Namal Rajapaksa") {
            colors.push("#82072b");
            images.push("/namal.png");
        } else if (name === "Ariyanethiran Pakkiyaselvam") {
            colors.push("#fc6f03");
            images.push("/ariyanethiran.png");
        } else {
            colors.push("#ababb3");
            images.push(""); 
        }
    }

    return (
        <>
            <div className="cardRow">
                <div className={getCardClass()}>
                    <img src={images[0]} alt="candidate" />
                    <p>Vote count: {voteCount[0].toLocaleString()}</p>
                    <p>
                        Percentage: {((voteCount[0] * 100) / sum).toFixed(2)}%
                    </p>
                </div>
                <div className={getCardClass()}>
                    <img src={images[1]} alt="candidate" />
                    <p>Vote count: {voteCount[1].toLocaleString()}</p>
                    <p>
                        Percentage: {((voteCount[1] * 100) / sum).toFixed(2)}%
                    </p>
                </div>
            </div>
            <div className="cardRow">
                <div
                    className={getCardClass()}
                    style={{
                        display: buttonName === "preference" ? "none" : "flex",
                    }}
                >
                    <img src={images[2]} alt="candidate" />
                    <p>Vote count: {voteCount[2]?.toLocaleString() || "N/A"}</p>
                    <p>
                        Percentage: {((voteCount[2] * 100) / sum).toFixed(2)}%
                    </p>
                </div>
                <div
                    className={getCardClass()}
                    style={{
                        display: buttonName === "preference" ? "none" : "flex",
                    }}
                >
                    <img src={images[3]} alt="candidate" />
                    <p>Vote count: {voteCount[3]?.toLocaleString() || "N/A"}</p>
                    <p>
                        Percentage: {((voteCount[3] * 100) / sum).toFixed(2)}%
                    </p>
                </div>
            </div>
        </>
    );
};

export default SummeryCard;
