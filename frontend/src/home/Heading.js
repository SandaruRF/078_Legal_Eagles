import React, {useContext } from "react";
import Typewriter from 'typewriter-effect';
import { ThemeContext } from "../ThemeContext";


const Heading = () => {
  const { theme } = useContext(ThemeContext);
  const textColor = theme === 'dark' ? 'white' : 'black'; 

  return (
    <div style={{ color: textColor, fontSize: '3em', textAlign: 'center', margin: '5px 0 10px', fontFamily:'fantasy' }}>
      <Typewriter
        options={{
          strings: ['2024 Presidential Election Results'],
          autoStart: true,
          loop: true,
          deleteSpeed: 50,
          pauseFor: 5000,
          cursor: '|',
        }}
      />
    </div>
  );
};

export default Heading;
