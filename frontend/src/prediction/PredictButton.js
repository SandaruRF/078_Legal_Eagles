import './PredictButton.css';

export const PredictButton = ({ onClick, theme }) => {
    return (
        <div className="predictButton-container">
            <span className={theme === "light" ? "predictButtn-light" : "predictButtn-dark"}>
                <button onClick={onClick} className="vvd">
                    <span>Compare the results</span>
                </button>
            </span>
        </div>
    );
};
