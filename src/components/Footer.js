import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Made by Duke students for Duke students</p>
      </div>
    </footer>
  );
}

export default Footer;
