import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SearchBar from '../components/SearchBar';
import './MainPage.css';

// Fix for Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Vending machine data
const vendingMachines = [
  { 
    id: 1, 
    name: 'Bryan Center Machine #1', 
    location: [36.003211, -78.942427], 
    building: 'Bryan Center',
    floor: '1st Floor',
    notes: 'Near the entrance, by the seating area',
    products: ['Coca-Cola', 'Diet Coke', 'Sprite', 'Water', 'Snickers', 'M&Ms', 'Doritos', 'Lays']
  },
  { 
    id: 2, 
    name: 'Perkins Library Machine', 
    location: [36.0026, -78.9387], 
    building: 'Perkins Library',
    floor: '2nd Floor',
    notes: 'In the study lounge, next to the elevators',
    products: ['Coffee', 'Water', 'Sparkling Water', 'Chips', 'Candy Bars', 'Trail Mix']
  },
  { 
    id: 3, 
    name: 'West Campus Machine', 
    location: [36.0032, -78.9412], 
    building: 'West Union',
    floor: 'Basement',
    notes: 'Near the game room',
    products: ['Red Bull', 'Monster', 'Water', 'Granola Bars', 'Gatorade Protein Bars']
  }
];

function MainPage() {
  // Duke University campus center coordinates
  const dukeCenter = [36.0014, -78.9382];
  
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Handle search functionality
  const handleSearch = (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }
    
    const results = [];
    
    // Search for products
    vendingMachines.forEach(machine => {
      const matchingProducts = machine.products.filter(product => 
        product.toLowerCase().includes(term.toLowerCase())
      );
      
      if (matchingProducts.length > 0) {
        matchingProducts.forEach(product => {
          results.push({
            product,
            machine
          });
        });
      }
    });
    
    // If no products found, try searching by building or machine name
    if (results.length === 0) {
      vendingMachines.forEach(machine => {
        if (
          machine.name.toLowerCase().includes(term.toLowerCase()) ||
          machine.building.toLowerCase().includes(term.toLowerCase())
        ) {
          machine.products.forEach(product => {
            results.push({
              product,
              machine
            });
          });
        }
      });
    }
    
    // Remove duplicates (same product in same machine)
    const uniqueResults = results.filter((result, index, self) =>
      index === self.findIndex(r => r.product === result.product && r.machine.id === result.machine.id)
    );
    
    setSearchResults(uniqueResults);
    setSearchPerformed(true);
  };
  
  return (
    <div className="main-page">
      <div className="hero-section">
        <div className="container">
          <h1 className="hero-title">Duke Vending Machine Finder</h1>
          <p className="hero-description">
            Your guide to the munchies
          </p>
        </div>
      </div>
      
      <div className="container main-content">
        <div className="search-section">
          <h2>Find Snacks & Drinks</h2>
          <SearchBar onSearch={handleSearch} />
          
          {searchPerformed && (
            <div className="search-results">
              <h3>Search Results</h3>
              
              {searchResults.length === 0 ? (
                <p className="no-results">No products found. Try a different search term.</p>
              ) : (
                <div className="results-list">
                  {searchResults.map((result, index) => (
                    <div key={index} className="result-item">
                      <div className="result-content">
                        <h4>{result.product}</h4>
                        <p><strong>Location:</strong> {result.machine.building}, {result.machine.floor}</p>
                        <p><strong>Machine:</strong> {result.machine.name}</p>
                        <p><strong>Notes:</strong> {result.machine.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="map-section">
          <h2>Campus Vending Machine Map</h2>
          <div className="map-container">
            <MapContainer 
              center={dukeCenter} 
              zoom={16} 
              scrollWheelZoom={true} 
              style={{ height: "500px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {vendingMachines.map(machine => (
                <Marker 
                  key={machine.id} 
                  position={machine.location}
                >
                  <Popup>
                    <div className="machine-popup">
                      <h3>{machine.name}</h3>
                      <p><strong>Building:</strong> {machine.building}</p>
                      <p><strong>Floor:</strong> {machine.floor}</p>
                      <p><strong>Notes:</strong> {machine.notes}</p>
                      <p><strong>Available Products:</strong></p>
                      <ul className="product-list">
                        {machine.products.map((product, i) => (
                          <li key={i}>{product}</li>
                        ))}
                      </ul>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;