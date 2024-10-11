import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const CheckImages = ({ src, text, isChecked, onClick }) => {
    const { theme } = useContext(ThemeContext);
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
            <p style={{ marginTop: "8px",color:theme === 'dark' ?'white':'black'}}>{text}</p>
        </div>
    );
};

export default CheckImages;
