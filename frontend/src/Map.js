import React, { useState } from "react";
import MyMap from "./components/MyMap";
import Chart from "./components/Chart";
import DaughnutChartValid from "./components/DoughnutChartValid";
import DaughnutChartPolled from "./components/DoughnutChartPolled";
import SummeryCard from "./components/SummeryCard";

function Map() {
    const [selectedDistrict, setSelectedDistrict] = useState("Digamadulla");
    const [clickedButton, setClickedButton] = useState("postal");

    const handleDistrictClick = (districtName) => {
        setSelectedDistrict(districtName);
        //console.log(districtName);
    };

    const handleButtonClick = (buttonName) => {
        //console.log(buttonName);
        setClickedButton(buttonName);
    };

    return (
        <>
            <div className="analysisContainer_575">
                <MyMap
                    onDistrictClick={handleDistrictClick}
                    onButtonClick={handleButtonClick}
                />
                <Chart
                    districtName={selectedDistrict}
                    buttonName={clickedButton}
                />
                <div className="doughnutChartContainer">
                    <DaughnutChartValid
                        districtName={selectedDistrict}
                        buttonName={clickedButton}
                    />
                    <DaughnutChartPolled
                        districtName={selectedDistrict}
                        buttonName={clickedButton}
                    />
                </div>
                <SummeryCard
                    districtName={selectedDistrict}
                    buttonName={clickedButton}
                />
            </div>

            <div className="analysisContainer_768">
                <div className="mapAndCardContainer">
                    <MyMap
                        onDistrictClick={handleDistrictClick}
                        onButtonClick={handleButtonClick}
                    />
                    <div style={{ display: "block", marginTop: "100px" }}>
                        <SummeryCard
                            districtName={selectedDistrict}
                            buttonName={clickedButton}
                        />
                    </div>
                </div>
                <div className="charts">
                    <Chart
                        districtName={selectedDistrict}
                        buttonName={clickedButton}
                    />
                    <div className="doughnutChartContainer">
                        <DaughnutChartValid
                            districtName={selectedDistrict}
                            buttonName={clickedButton}
                        />
                        <DaughnutChartPolled
                            districtName={selectedDistrict}
                            buttonName={clickedButton}
                        />
                    </div>
                </div>
            </div>

            <div className="analysisContainer_1200">
                <div className="mapContainer">
                    <MyMap
                        onDistrictClick={handleDistrictClick}
                        onButtonClick={handleButtonClick}
                    />
                </div>
                <div className="dataContainer">
                    <div className="cardContainer">
                        <SummeryCard
                            districtName={selectedDistrict}
                            buttonName={clickedButton}
                        />
                    </div>
                    <div className="chartContainer">
                        <Chart
                            districtName={selectedDistrict}
                            buttonName={clickedButton}
                        />
                        <div className="doughnutChartContainer">
                            <DaughnutChartValid
                                districtName={selectedDistrict}
                                buttonName={clickedButton}
                            />
                            <DaughnutChartPolled
                                districtName={selectedDistrict}
                                buttonName={clickedButton}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Map;
