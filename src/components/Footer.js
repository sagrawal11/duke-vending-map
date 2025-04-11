import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Sloth Studios</p>
      </div>
    </footer>
  );
}

export default Footer;
