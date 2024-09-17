import React from "react";

const CheckImages = ({ src, text, isChecked, onClick }) => {
    // const [isChecked, setIsChecked] = useState(false);

    // const handleImageClick = () => {
    //   setIsChecked(!isChecked);
    // };

    return (
        <div
            className={`image-container ${isChecked ? "bordered" : ""}`}
            onClick={onClick}
        >
            <img src={src} alt={text} className="image" />
            <input
                type="checkbox"
                id="checkbox"
                className="checkbox"
                checked={isChecked}
                onChange={onClick}
            />
            <label htmlFor="checkbox" className="checkbox-label"></label>
            <p style={{ marginTop: "8px" }}>{text}</p>
        </div>
    );
};

export default CheckImages;
