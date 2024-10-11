import React, { useContext } from "react";
import Card from "react-bootstrap/Card";
import Form from 'react-bootstrap/Form';
import { ThemeContext } from "../ThemeContext";

const RadioButton = ({ isRadioSelected, onRadioChange }) => {
    const { theme } = useContext(ThemeContext);
    return (
        <div className="radio-container">
            <Card.Text>
                <Form.Check style={{color:theme === 'dark' ?'white':'black'}} 
                    type="switch"
                    id="custom-switch"
                    label="Select All"
                    checked={isRadioSelected} // Determines if the radio button is checked
                    onChange={onRadioChange} // Handler for when the radio button is clicked
                />
            </Card.Text>
        </div>
    );
};

export default RadioButton;
