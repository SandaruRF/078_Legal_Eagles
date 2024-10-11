import React, { Component ,useContext} from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import electrol_districts from "../data/electrol_districts.json";
import { ThemeContext } from "../ThemeContext";
import "leaflet/dist/leaflet.css";
import "./MyMap.css";

class MyMap extends Component {
    allLayers = [];

    // Initial district style
    districtStyle = {
        fillColor: "#c80d4d",
        fillOpacity: 1,
        color: "black",
        weight: 0.5,
    };

    changeDistrictColor = (event, district) => {
        this.allLayers.forEach((layer) => {
            layer.setStyle({ fillOpacity: 1 });
        });

        event.target.setStyle({ fillOpacity: 0.6 });
        this.props.onDistrictClick(district);
    };

    addBorderShadow = (event) => {
        this.allLayers.forEach((layer) => {
            layer.setStyle({
                weight: 0.5,
                color: "black",
                opacity: 1,
            });
        });

        event.target.setStyle({
            weight: 4,
            color: "rgba(0, 0, 0, 0.6)",
            opacity: 0.7,
        });
    };

    removeBorderShadow = (event) => {
        event.target.setStyle({
            weight: 0.5,
            color: "black",
            opacity: 1,
        });
    };

    postalClick = () => {
        const sajithDistricts = ["Vanni"];
        const ranilDistricts = ["Jaffna", "Batticaloa"];

        this.allLayers.forEach((layer) => {
            const districtName = layer.feature.properties.electoralDistrict;
            if (sajithDistricts.includes(districtName)) {
                layer.setStyle({ fillColor: "#51a303" });
            } else if (ranilDistricts.includes(districtName)) {
                layer.setStyle({ fillColor: "#fab002" });
            } else {
                layer.setStyle({ fillColor: "#c80d4d" }); // Reset other districts' color
            }
        });

        this.props.onButtonClick("postal");
    };

    preferenceClick = () => {
        this.allLayers.forEach((layer) => {
            layer.setStyle({ fillColor: "#51a303" });
        });

        this.props.onButtonClick("preference");
    };

    districtsClick = () => {
        const sajithDistricts = [
            "Jaffna",
            "Vanni",
            "Trincomalee",
            "Batticaloa",
            "Digamadulla",
            "Badulla",
            "Nuwaraeliya",
        ];

        this.allLayers.forEach((layer) => {
            const districtName = layer.feature.properties.electoralDistrict;
            if (sajithDistricts.includes(districtName)) {
                layer.setStyle({ fillColor: "#51a303" });
            } else {
                layer.setStyle({ fillColor: "#c80d4d" }); // Reset other districts' color
            }
        });

        this.props.onButtonClick("district");
    };

    onEachDistrict = (district, layer) => {
        const districtName = district.properties.electoralDistrict;

        const sajithDistricts = [
            "Jaffna",
            "Vanni",
            "Trincomalee",
            "Batticaloa",
            "Digamadulla",
            "Badulla",
            "Nuwaraeliya",
        ];
        if (sajithDistricts.includes(districtName)) {
            layer.setStyle({ fillColor: "#51a303" });
        }

        this.allLayers.push(layer);
        layer.bindPopup(districtName);
        layer.on({
            click: (event) => this.changeDistrictColor(event, districtName),
            mouseover: this.addBorderShadow,
            mouseout: this.removeBorderShadow,
        });
    };

    render() {
        return (
            <ThemeContext.Consumer>
                {({ theme }) => (
                    <div>
                        <div
                            className={
                                theme === "dark"
                                    ? "buttonContainer_dark"
                                    : "buttonContainer_lite"
                            }
                        >
                            <button onClick={this.districtsClick}>
                                Districts
                            </button>
                            <button onClick={this.postalClick}>
                                Postal Votes
                            </button>
                            <button onClick={this.preferenceClick}>
                                Preference
                            </button>
                        </div>
                        <MapContainer
                            className="map"
                            zoom={8}
                            center={[8, 80.8]}
                            dragging={false}
                            scrollWheelZoom={false}
                            touchZoom={false}
                            doubleClickZoom={false}
                            zoomControl={false}
                            attributionControl={false}
                        >
                            <GeoJSON
                                style={this.districtStyle}
                                data={electrol_districts.features}
                                onEachFeature={this.onEachDistrict}
                            />
                        </MapContainer>
                    </div>
                )}
            </ThemeContext.Consumer>
        );
    }
}

export default MyMap;
