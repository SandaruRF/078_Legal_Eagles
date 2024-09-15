import React from "react";

const RadioButton = ({ isRadioSelected, onRadioChange }) => {
  return (
    <div className="radio-container">
      <label>
        <input
          type="radio"
          checked={isRadioSelected} // Determines if the radio button is checked
          onChange={onRadioChange} // Handler for when the radio button is clicked
        />
        Select All
      </label>
    </div>
  );
};

export default RadioButton;
