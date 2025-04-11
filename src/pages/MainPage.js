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

// Product categorization function
const categorizeProduct = (product) => {
  const lowerProduct = product.toLowerCase();
  
  // Sodas and drinks
  if (lowerProduct.includes('water') || 
      lowerProduct.includes('pepsi') || 
      lowerProduct.includes('dew') || 
      lowerProduct.includes('tea') || 
      lowerProduct.includes('coca') ||
      lowerProduct.includes('coke') ||
      lowerProduct.includes('monster') ||
      lowerProduct.includes('celsius') ||
      lowerProduct.includes('sprite') ||
      lowerProduct.includes('topo chico') ||
      lowerProduct.includes('lemonade') ||
      lowerProduct.includes('strawberry') ||
      lowerProduct.includes('apple') ||
      lowerProduct.includes('orange') ||
      lowerProduct.includes('fanta')) {

    return 'Drinks';
  }
  
  // Energy drinks
  if (lowerProduct.includes('red bull') || 
      lowerProduct.includes('monster') || 
      lowerProduct.includes('celsius') || 
      lowerProduct.includes('propel') || 
      lowerProduct.includes('gatorade') ||
      lowerProduct.includes('body armor') ||
      lowerProduct.includes('vitamin water') ||
      lowerProduct.includes('fairlife') ||
      lowerProduct.includes('storm') ||
      lowerProduct.includes('powerade')) {
    return 'Energy/Electrolyte Drinks';
  }
  
  // Chips and savory snacks
  if (lowerProduct.includes('lays') || 
      lowerProduct.includes('cheetos') || 
      lowerProduct.includes('doritos') || 
      lowerProduct.includes('fritos') || 
      lowerProduct.includes('popcorn') || 
      lowerProduct.includes('chex') || 
      lowerProduct.includes('sun chips') || 
      lowerProduct.includes('cheez it') || 
      lowerProduct.includes('gardettos') || 
      lowerProduct.includes('crackers')) {
    return 'Chips & Savory Snacks';
  }
  
  // Candy and sweets
  if (lowerProduct.includes('oreos') || 
      lowerProduct.includes('snickers') || 
      lowerProduct.includes('kit kat') || 
      lowerProduct.includes('reese') || 
      lowerProduct.includes('musketeers') || 
      lowerProduct.includes('kinder') || 
      lowerProduct.includes('haribo') || 
      lowerProduct.includes('m&m') || 
      lowerProduct.includes('ghiradelli') || 
      lowerProduct.includes('skittles') || 
      lowerProduct.includes('gummies') || 
      lowerProduct.includes('gushers') || 
      lowerProduct.includes('nerds') ||
      lowerProduct.includes('honey bun')) {
    return 'Candy & Sweets';
  }
  
  // Protein and health foods
  if (lowerProduct.includes('protein') || 
      lowerProduct.includes('granola') || 
      lowerProduct.includes('trail mix') || 
      lowerProduct.includes('cashews') || 
      lowerProduct.includes('almond')) {
    return 'Healthy Snacks';
  }
  
  // Default category for anything else
  return 'Other Snacks';
};

// Group products by category
const groupProductsByCategory = (products) => {
  const grouped = {};
  
  products.forEach(product => {
    const category = categorizeProduct(product);
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(product);
  });
  
  return grouped;
};

// Vending machine data
const vendingMachines = [
  { 
    id: 1, 
    name: 'Bryan Center Vending Machine', 
    location: [36.001057, -78.940978], 
    building: 'Bryan Center',
    floor: 'Middle Floor',
    notes: 'In between McDonalds and Griffith Theater',
    products: ['Pepsi', 'Mountain Dew', 'Pepsi Zero Sugar', 'Mountain Dew Zero Sugar', 'Water', 'Pure Leaf Tea', 'Propel', 'Celsius', 'Lays CLassic', 'Cheetos', 'Doritos Nacho Cheese', 'Fritos', 'White Cheddar Popcorn', 'Lays Barbeque', 'Cheetos Cheddar Jalapeno', 'Doritos Cool Ranch', 'Chex Mix', 'Sun Chips Garden Salsa', 'Sun Chips Harvest Cheddar', 'Cheez It', 'Doritos Spicy Sweet Chili', 'Gardettos Snack Mix', 'Lays Salt and Vinegar', 'Penut Butter Crackers', 'Grilled Cheese Crackers', 'Toasted Cheese Peanut Butter Crackers', 'Oreos', 'Snickers', 'Kit Kat', "Reese's", '3 Musketeers', 'Kinder Bueno', 'Haribo Gummy Bears', 'M&Ms', 'Peanut M&Ms', 'Ghiradelli Mlik Chocolate Caramel', "Reese's Fast Break", 'Skittles', 'Slim Kim', 'Cinnamon Almond Butter Biscuits', "Reese's Sticks", "Cashews", 'Trail Mix', 'Beef Tender Bites', "Sour Skittles Gummies", "Gushers", 'Honey Bun', 'Nerds', 'Vitamin Water', 'Body Armor', 'Fairlife Core Power', 'Topo Chico', 'Coca Cola', 'Fanta', 'Sprite', 'Orange Juice', 'Strawberry Grape Juice', 'Apple Juice', 'Powerade', 'Storm', 'Lemonade', 'Coke Zero', 'Monster']
  },
  { 
    id: 2, 
    name: 'Wilkinson Vending Machine', 
    location: [36.000597, -78.939276], 
    building: 'Wilkinson',
    floor: 'Bottom FLoor',
    notes: 'Behind the booths',
    products: ['Vitamin Water', 'Storm', 'Topo Chico', 'Body Armor', 'Water', 'Pure Leaf tea', 'Lays Classic', 'Sea Salt Popchips', 'Doritos Nacho Cheese', 'Lays barbeque' CONTINUE FROM HERE]
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
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // Handle search functionality
  const handleSearch = (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setSearchPerformed(false);
      setSearchTerm('');
      return;
    }
    
    setSearchTerm(term.toLowerCase());
    const results = [];
    const isProductSearch = vendingMachines.some(machine => 
      machine.products.some(product => 
        product.toLowerCase().includes(term.toLowerCase())
      )
    );
    
    if (isProductSearch) {
      // Search for specific product
      vendingMachines.forEach(machine => {
        const matchingProducts = machine.products.filter(product => 
          product.toLowerCase().includes(term.toLowerCase())
        );
        
        if (matchingProducts.length > 0) {
          results.push({
            products: matchingProducts,
            machine,
            isProductSearch: true
          });
        }
      });
    } else {
      // Search by location or machine name
      vendingMachines.forEach(machine => {
        if (
          machine.name.toLowerCase().includes(term.toLowerCase()) ||
          machine.building.toLowerCase().includes(term.toLowerCase())
        ) {
          results.push({
            products: machine.products,
            machine,
            isProductSearch: false
          });
        }
      });
    }
    
    setSearchResults(results);
    setSearchPerformed(true);
    
    // Reset expanded categories
    setExpandedCategories({});
  };
  
  // Toggle category expansion
  const toggleCategory = (machineId, category) => {
    setExpandedCategories(prev => {
      const key = `${machineId}-${category}`;
      return {
        ...prev,
        [key]: !prev[key]
      };
    });
  };
  
  // Render dropdown grouped products
  const renderDropdownGroupedProducts = (products, machineId) => {
    const groupedProducts = groupProductsByCategory(products);
    
    return (
      <div className="grouped-products">
        {Object.entries(groupedProducts).map(([category, products]) => {
          const key = `${machineId}-${category}`;
          const isExpanded = expandedCategories[key];
          
          return (
            <div key={category} className="product-category">
              <div 
                className="category-header"
                onClick={() => toggleCategory(machineId, category)}
              >
                <h5>{category} ({products.length})</h5>
                <span className="dropdown-icon">{isExpanded ? '▼' : '►'}</span>
              </div>
              
              {isExpanded && (
                <ul className="category-products">
                  {products.map((product, i) => (
                    <li key={i}>{product}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  // Render grouped products for map popups
  const renderGroupedProducts = (products) => {
    const groupedProducts = groupProductsByCategory(products);
    
    return (
      <div className="grouped-products">
        {Object.entries(groupedProducts).map(([category, products]) => (
          <div key={category} className="product-category">
            <h5>{category}</h5>
            <ul className="category-products">
              {products.map((product, i) => (
                <li key={i}>{product}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
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
                        <h4>{result.machine.name}</h4>
                        <p><strong>Location:</strong> {result.machine.building}, {result.machine.floor}</p>
                        <p><strong>Notes:</strong> {result.machine.notes}</p>
                        
                        {/* For product searches, don't show products list */}
                        {!result.isProductSearch && (
                          <div className="products-container">
                            <h5>Available Products:</h5>
                            {renderDropdownGroupedProducts(result.products, result.machine.id)}
                          </div>
                        )}
                        
                        {/* For product searches, show matching products */}
                        {result.isProductSearch && (
                          <p><strong>Found Products:</strong> {result.products.join(', ')}</p>
                        )}
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
                      <div className="popup-products">
                        <p><strong>Available Products:</strong></p>
                        {renderGroupedProducts(machine.products)}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
      
      {/* Add some styling for the dropdowns */}
      <style jsx>{`
        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          padding: 5px;
          background-color: #f5f5f5;
          border-radius: 4px;
          margin-bottom: 5px;
        }
        
        .category-header:hover {
          background-color: #e5e5e5;
        }
        
        .dropdown-icon {
          font-size: 12px;
        }
        
        .product-category {
          margin-bottom: 10px;
        }
        
        .category-products {
          margin-top: 5px;
          margin-bottom: 15px;
          padding-left: 20px;
        }
      `}</style>
    </div>
  );
}

export default MainPage;