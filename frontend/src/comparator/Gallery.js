import React, { useState, useEffect } from "react";
import CheckImages from "./Checkimages";
import RadioButton from "./RadioButton";

import picture1 from '../images/economy.jpeg';
import picture2 from '../images/health.jpeg';
import picture3 from '../images/education.jpeg';
import picture4 from '../images/energy.jpeg';
import picture5 from '../images/transport.jpeg';
import picture6 from '../images/agriculture.jpeg';
import picture7 from '../images/tourism.jpeg';
import picture8 from '../images/defense.jpeg';
import picture9 from '../images/science.jpeg';
import picture10 from '../images/social.jpeg';
import picture11 from '../images/privategovernmentBussiness.jpeg';
import picture12 from '../images/nature.jpeg';

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
    "Environment"
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

  const handleSubmit = () => {
    setIsButtonClicked(true); 
  
    setTimeout(() => {
      setIsButtonClicked(false);
    }, 200);
  };
  return (
    <>
    <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px', margin: '20px' }}>
    <br></br>
    <h1 className="heading">Select branches you need to compare : </h1>
        <br></br>
    <div>
        
       <RadioButton
        isRadioSelected={isRadioSelected} 
        onRadioChange={handleRadioChange} 
      />
      <br></br>
      <br></br>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
        {images.slice(0, 12).map((src, index) => (
          <CheckImages key={index} src={src} text={texts[index]} isChecked={checkedImages[index]} 
          onClick={() => handleImageClick(index)}/>
        ))}
      </div>
      {/* <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <CheckImages src={images[10]} /> 
      </div> */}
      <br></br>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <button 
        onClick={handleSubmit}
        style={{
 backgroundColor: isButtonClicked ? 'darkblue' : 'blue',
 color: 'white',
 padding: '10px 20px',
 border: 'none',
 borderRadius: '5px',
 cursor: 'pointer',
 fontSize: '16px',
 transition: 'background-color 0.3s, transform 0.1s',
 transform: isButtonClicked ? 'scale(0.95)' : 'scale(1)',
    }}>Submit</button>
      </div>
    </div>
    </div>
    </>
  );
};

export default Gallery;
