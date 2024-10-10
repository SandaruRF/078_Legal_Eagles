import React, {useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import logoLight from '../images/logo.png'; 
import logoDark from '../images/dark-logo.png'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <footer className={`footer ${theme}`} style={{ padding: '8px 0' }}>
      <div className="container">
        <div className="row justify-content-center align-items-center text-center">
          <div className="col-auto">
            <img
              src={theme === "light" ? logoLight : logoDark} 
              alt="Logo"
              className="img-fluid"
              style={{ width: '90px' }}
            />
          </div>
          <div className="col-auto">
            <p className="footerText mb-0" style={{ color: theme === "light" ? 'black' : 'white' }}>
              © Legal Eagles, 2024. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
