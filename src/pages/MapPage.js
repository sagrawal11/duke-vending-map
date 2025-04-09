import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';
import L from 'leaflet';

// Fix for Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Example vending machine data (you'll replace this with your database data later)
const vendingMachines = [
  { 
    id: 1, 
    name: 'Bryan Center Machine #1', 
    location: [36.0014, -78.9382], 
    products: ['Coke', 'Diet Coke', 'Sprite', 'Water', 'Snickers'] 
  },
  { 
    id: 2, 
    name: 'Perkins Library Machine', 
    location: [36.0026, -78.9387], 
    products: ['Coffee', 'Water', 'Chips', 'Candy Bars'] 
  },
  { 
    id: 3, 
    name: 'West Campus Machine', 
    location: [36.0032, -78.9412], 
    products: ['Energy Drinks', 'Water', 'Granola Bars'] 
  }
];

function MapPage() {
  // Duke University campus center coordinates
  const dukeCenter = [36.0014, -78.9382];
  
  return (
    <div className="map-page">
      <div className="container">
        <h1 className="page-title">Vending Machine Map</h1>
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
              <Marker key={machine.id} position={machine.location}>
                <Popup>
                  <div>
                    <h3>{machine.name}</h3>
                    <p><strong>Products:</strong></p>
                    <ul>
                      {machine.products.map((product, index) => (
                        <li key={index}>{product}</li>
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
  );
}

export default MapPage;
