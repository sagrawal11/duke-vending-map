import React from 'react';
import './App.css';
import MainPage from './pages/MainPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app">
      <Navbar />
      <MainPage />
      <Footer />
    </div>
  );
}

export default App;
