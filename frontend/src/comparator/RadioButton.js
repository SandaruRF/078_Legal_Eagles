import React from "react";
import Card from "react-bootstrap/Card";
import Form from 'react-bootstrap/Form';

const RadioButton = ({ isRadioSelected, onRadioChange }) => {
    return (
        <div className="radio-container">
            <Card.Text>
                <Form.Check
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
