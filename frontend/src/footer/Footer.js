import logo from '../images/logo.png';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer className="footer text-white" style={{ backgroundColor: "#b6b4b4", padding: '8px 0' }}>
      <div className="container">
        <div className="row justify-content-center align-items-center text-center">

          <div id='footer'  className="col-auto">
            <img
              src={logo}
              alt="Logo"
              className="img-fluid"
              style={{ width: '90px' }} 
            />
          </div>

          <div className="col-auto">
            <p className="footerText mb-0" style={{ color: 'black' }}>© Legal Eagles, 2024. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
