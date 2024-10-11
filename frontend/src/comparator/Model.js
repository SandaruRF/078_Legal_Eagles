import React, { useState } from "react";
import "./Model.css";

function Model({ closeModal, onFileUploaded }) {
  const [closing, setClosing] = useState(false);
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      closeModal(false);
    }, 300);
  };

  const validateFileType = (selectedFile) => {
    // Check if the file is a PDF
    if (selectedFile.type !== "application/pdf") {
      setErrorMessage("Only PDF files are allowed!");
      return false;
    }
    return true;
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && validateFileType(selectedFile)) {
      setFile(selectedFile);
      setErrorMessage(""); // Clear any previous error message
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (file) {
      setErrorMessage("You cannot add another file. First, remove the available one.");
      return; // Stop if there's already a file
    }
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && validateFileType(droppedFile)) {
      setFile(droppedFile);
      setErrorMessage(""); // Clear any previous error message
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemoveFile = () => {
    setFile(null); // Clear the file state
    document.getElementById("fileInput").value = ""; // Reset the file input value
    setErrorMessage(""); // Clear any error message
  };

  const handleFileInputClick = (event) => {
    if (file) {
      setErrorMessage("You cannot add another file. First, remove the available one.");
      event.preventDefault(); // Prevent the default file input action
    }
  };

  const handleContinue = async () => {
    console.log("Continue button clicked.");
    if (!candidateName) {
      setErrorMessage("Please enter a candidate name before continuing."); // Check for name
      return;
    }
    if (!file) {
      setErrorMessage("Please upload a PDF file before continuing.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    console.log("Uploading file hi:", file.name); 

    try {
      console.log("Making POST request...");
      const response = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        console.log("Upload successful.");
        onFileUploaded(file.name, candidateName); // Notify parent of the uploaded file
        handleClose(); // Close the modal
      } else {
        console.log("Upload failed with status:", response.status);
        setErrorMessage("Failed to upload the file. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage("Error uploading file. Please try again.");
    }
  };
  return (
    <div className={`modalBackground ${closing ? "fadeOut" : ""}`}>
      <div className={`modalContainer ${closing ? "slideOut" : ""}`}>
        <div className="titleCloseBtn">
          <button onClick={handleClose}>X</button>
        </div>
        <div className="title">
          <h1>Enter details of your candidate</h1>
        </div>
        <div className="body">
          <label>Name:</label>
          <input type="text"  value={candidateName} 
            onChange={(e) => setCandidateName(e.target.value)} />
          <label>Upload manifesto (PDF only):</label>
          <div
            className="dropzone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {file ? (
              <div className="fileInfo">
                <p>{file.name}</p> {/* Display the name of the uploaded file */}
                <button className="removeFileBtn" onClick={handleRemoveFile}>
                  Remove
                </button>
              </div>
            ) : (
              <p>Drag & drop a file here, or click to select one</p>
            )}
            <input
              type="file"
              onChange={handleFileChange}
              onClick={handleFileInputClick} // Check for existing file on click
              style={{ display: "none" }} // Hide the default file input
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="fileInputLabel"
              onClick={handleFileInputClick} // Check for existing file on click
            >
              Click here to select a file
            </label>
            {errorMessage && <p className="errorMessage">{errorMessage}</p>} {/* Display error message */}
          </div>
        </div>
        <div className="footer" style={{ backgroundColor: "white" }}>
          <button onClick={handleClose} id="cancelBtn">
            Cancel
          </button>
          <button className="continueBtn" onClick={handleContinue}>continue</button>
        </div>
      </div>
    </div>
  );
}

export default Model;
