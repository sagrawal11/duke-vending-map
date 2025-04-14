import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Sarthak Agrawal</p>
      </div>
    </footer>
  );
}

export default Footer;
