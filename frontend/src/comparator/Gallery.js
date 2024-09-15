import React, { useState, useEffect } from "react";
import CheckImages from "./Checkimages";
import RadioButton from "./RadioButton";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import picture1 from "../images/economy.jpeg";
import picture2 from "../images/health.jpeg";
import picture3 from "../images/education.jpeg";
import picture4 from "../images/energy.jpeg";
import picture5 from "../images/transport.jpeg";
import picture6 from "../images/agriculture.jpeg";
import picture7 from "../images/tourism.jpeg";
import picture8 from "../images/defense.jpeg";
import picture9 from "../images/science.jpeg";
import picture10 from "../images/social.jpeg";
import picture11 from "../images/privategovernmentBussiness.jpeg";
import picture12 from "../images/nature.jpeg";

const Gallery = () => {
    const [checkedImages, setCheckedImages] = useState(Array(11).fill(false));
    const [isRadioSelected, setIsRadioSelected] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const images = [
        picture1,
        picture2,
        picture3,
        picture4,
        picture5,
        picture6,
        picture7,
        picture8,
        picture9,
        picture10,
        picture11,
        picture12,
    ];
    const texts = [
        "Economy",
        "Health",
        "Education",
        "Energy",
        "Transport",
        "Agriculture",
        "Tourism",
        "Defense",
        "Science and Technology",
        "Social Empowerment",
        "Private and Government sectors",
        "Environment",
    ];

    const handleRadioChange = () => {
        if (!isRadioSelected) {
            setCheckedImages(Array(12).fill(true));
        } else {
            setCheckedImages(Array(12).fill(false));
        }
        setIsRadioSelected(!isRadioSelected);
    };

    const handleImageClick = (index) => {
        const newCheckedImages = [...checkedImages];
        newCheckedImages[index] = !newCheckedImages[index];
        setCheckedImages(newCheckedImages);
    };

    useEffect(() => {
        if (checkedImages.includes(false)) {
            setIsRadioSelected(false);
        }
    }, [checkedImages]);

    const handleSubmit = async () => {
        const selectedFields = texts.filter((_, index) => checkedImages[index]);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedFields }), 
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
        setIsButtonClicked(true);

        setTimeout(() => {
            setIsButtonClicked(false);
        }, 200);
    };
    return (
        <>
            <Card
                id="topics"
                className="text-center"
                style={{
                    backgroundColor: "#EEEEEE",
                    marginRight: "5rem",
                    marginLeft: "5rem",
                    marginTop: "3rem",
                }}
            >
                <br></br>
                <Card.Title style={{ fontSize: "1.7rem", fontWeight: "bold" }}>
                    Select branches you need to compare{" "}
                </Card.Title>
                <Card.Text>Select at Least 1 Branch</Card.Text>
                <div>
                    <RadioButton
                        isRadioSelected={isRadioSelected}
                        onRadioChange={handleRadioChange}
                    />
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}
                    >
                        {images.slice(0, 12).map((src, index) => (
                            <CheckImages
                                key={index}
                                src={src}
                                text={texts[index]}
                                isChecked={checkedImages[index]}
                                onClick={() => handleImageClick(index)}
                            />
                        ))}
                    </div>
                    {/* <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <CheckImages src={images[10]} /> 
      </div> */}
                    <br></br>
                    <br></br>
                    <div style={{ textAlign: "center" }}>
                        <Button
                            onClick={handleSubmit}
                            variant="primary"
                            size="lg"
                        >
                            Submit and Compare
                        </Button>
                        <br></br>
                        <br></br>
                        <br></br>
                    </div>
                </div>
            </Card>
        </>
    );
};

export default Gallery;
