import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import Fuse from 'fuse.js';
import 'leaflet/dist/leaflet.css';
import SearchBar from '../components/SearchBar';
import { categorizeProduct, groupProductsByCategory } from '../data/productCategories';
import { vendingMachines } from '../data/vendingMachines';
import './MainPage.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Update the distance calculation function:
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Radius of the earth in miles (instead of 6371 km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in miles
  return distance;
};

// Update the format distance function:
const formatDistance = (distance) => {
  if (distance < 0.1) {
    // Convert to feet if less than 0.1 miles
    return `${Math.round(distance * 5280)} ft`;
  }
  return `${distance.toFixed(1)} mi`;
};

// Create a component to handle map updates
function MapUpdater({ visibleMachines, userLocation }) {
  const map = useMap();
  
  // Fit map bounds to visible markers and user location
  React.useEffect(() => {
    if (visibleMachines.length > 0) {
      const points = [...visibleMachines.map(machine => machine.location)];
      
      // Include user location in bounds if available
      if (userLocation) {
        points.push([userLocation.latitude, userLocation.longitude]);
      }
      
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [visibleMachines, userLocation, map]);
  
  return null;
}

// User location marker component
function UserLocationMarker({ position }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);
  
  if (!position) return null;
  
  return (
    <>
      <Circle 
        center={position} 
        radius={4} 
        pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.65 }} 
      />
    </>
  );
}

// Function to extract all unique products from all vending machines
const extractAllProducts = (machines) => {
  const allProducts = new Set();
  machines.forEach(machine => {
    machine.products.forEach(product => {
      allProducts.add(product.toLowerCase());
    });
  });
  return Array.from(allProducts);
};

// Create a dictionary for colloquial/alternative product names
const productAliases = {
  // Doritos
  "purple doritos": "doritos spicy sweet chili",
  "red doritos": "doritos nacho cheese",
  "blue doritos": "doritos cool ranch",  
  "cool ranch doritos": "doritos cool ranch",
  "nacho cheese doritos": "doritos nacho cheese", 
  "spicy sweet chili doritos": "doritos spicy sweet chili",
};

function MainPage() {
  // Duke University campus center coordinates
  const dukeCenter = [36.0014, -78.9382];
  
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [visibleMachines, setVisibleMachines] = useState(vendingMachines);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [searchSuggestion, setSearchSuggestion] = useState(null);
  const [confirmedSearch, setConfirmedSearch] = useState(null);
  const searchInputRef = useRef(null);
  
  // Initialize Fuse.js once all products are extracted
  const allUniqueProducts = React.useMemo(() => {
    return extractAllProducts(vendingMachines);
  }, []);
  
  // Create Fuse instance for fuzzy searching with improved settings for typos
  const fuseInstance = React.useMemo(() => {
    return new Fuse(allUniqueProducts, {
      includeScore: true,
      threshold: 0.3, // Lower threshold for better typo handling
      distance: 1000,
      minMatchCharLength: 3,
      ignoreLocation: true,
      findAllMatches: true
    });
  }, [allUniqueProducts]);
  
  // Get user location on component mount
  useEffect(() => {
    checkLocationPermission();
  }, []);

  // Check user's location permission status
  const checkLocationPermission = () => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(permissionStatus => {
          setLocationPermission(permissionStatus.state);
          // If permission is already granted, get location automatically
          if (permissionStatus.state === 'granted') {
            getUserLocation();
          }
        })
        .catch(error => {
          console.error("Error checking location permission:", error);
        });
    }
  };
  
  // Request user location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationPermission('granted');
        setIsLoadingLocation(false);
        
        // If there's already a search performed, re-sort results by distance
        if (searchPerformed && searchResults.length > 0) {
          sortResultsByDistance(searchResults, position.coords);
        }
      },
      (error) => {
        console.error("Error getting user location:", error);
        setLocationPermission('denied');
        setIsLoadingLocation(false);
        
        if (error.code === 1) { // Permission denied
          alert("Location permission denied. Enable location services to see nearby vending machines.");
        } else if (error.code === 2) { // Position unavailable
          alert("Location information is unavailable.");
        } else if (error.code === 3) { // Timeout
          alert("The request to get user location timed out.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };
  
  // Sort search results by distance from user
  const sortResultsByDistance = (results, coords) => {
    if (!coords) return;
    
    const resultsWithDistance = results.map(result => {
      const machine = result.machine;
      const distance = calculateDistance(
        coords.latitude, 
        coords.longitude, 
        machine.location[0], 
        machine.location[1]
      );
      
      return {
        ...result,
        distance
      };
    });
    
    // Sort by distance (closest first)
    resultsWithDistance.sort((a, b) => a.distance - b.distance);
    setSearchResults(resultsWithDistance);
  };
  
  // Enhanced search function with better fuzzy matching and brand search
  const handleSearch = (term) => {
    if (!term.trim()) {
      clearSearch();
      return;
    }
    
    const searchTermLower = term.toLowerCase();
    
    // Clear previous suggestion state
    setSearchSuggestion(null);
    setConfirmedSearch(null);
    
    // Define brand names that shouldn't trigger suggestions
    const brandNames = ['doritos', 'dorito', 'lays', 'cheetos', 'fritos', 'reese', 'reese\'s', 'reeses', 'snickers', 'kit kat', 'kitkat', 'coke', 'coca cola', 'pepsi', 'mountain dew', 'crackers', 'cookies', 'cookie', 'sun chips'];
    
    // Check for colloquial names first
    let correctedTerm = searchTermLower;
    let shouldShowSuggestion = false;
    
    // Check if the term exists in our alias dictionary
    if (productAliases[searchTermLower]) {
      correctedTerm = productAliases[searchTermLower];
      setSearchSuggestion({
        original: searchTermLower,
        suggested: correctedTerm,
        type: 'colloquial'
      });
      setConfirmedSearch(correctedTerm);
      shouldShowSuggestion = true;
    } else if (!brandNames.includes(searchTermLower)) {
      // Only show fuzzy suggestions if it's not a brand name
      // Try fuzzy matching on the search term
      const fuzzyResults = fuseInstance.search(searchTermLower);
      
      // If we have a close match but not exact
      if (fuzzyResults.length > 0 && fuzzyResults[0].score < 0.3 && 
          fuzzyResults[0].item !== searchTermLower) {
        correctedTerm = fuzzyResults[0].item;
        setSearchSuggestion({
          original: searchTermLower,
          suggested: correctedTerm,
          type: 'fuzzy'
        });
        setConfirmedSearch(correctedTerm);
        shouldShowSuggestion = true;
      }
    }
    
    // Continue with the search using the corrected term
    performSearch(shouldShowSuggestion ? correctedTerm : searchTermLower);
    setSearchTerm(searchTermLower); // Keep the original search term for display
  };
  
  // Perform the actual search with the given term
  const performSearch = (term) => {
    const results = [];
    const matchingMachines = [];
    
    // Brand name patterns for comprehensive brand search
    const brandPatterns = [
      { brand: 'doritos', variations: ['doritos', 'dorito'] },
      { brand: 'lays', variations: ['lays', 'lay\'s'] },
      { brand: 'cheetos', variations: ['cheetos', 'cheeto'] },
      { brand: 'fritos', variations: ['fritos', 'frito', 'frito\'s'] },
      { brand: 'snickers', variations: ['snickers', 'snicker'] },
      { brand: 'reese', variations: ['reese\'s', 'reese', 'reeses'] },
      { brand: 'kit kat', variations: ['kit kat', 'kitkat', 'kit-kat'] },
      { brand: 'coke', variations: ['coca cola', 'coke', 'coca-cola'] },
      { brand: 'pepsi', variations: ['pepsi'] },
      { brand: 'mountain dew', variations: ['mountain dew', 'mtn dew', 'dew'] },
      { brand: 'crackers', variations: ['crackers', 'cracker'] },
    ];
    
    // Check if this is a brand search
    const brandMatch = brandPatterns.find(pattern => 
      pattern.variations.some(variation => 
        term.includes(variation) || variation.includes(term)
      )
    );
    
    // First check if this is a product search
    const isProductSearch = vendingMachines.some(machine => 
      machine.products.some(product => 
        product.toLowerCase().includes(term)
      )
    );
    
    if (isProductSearch || brandMatch) {
      // Search for specific product or brand
      vendingMachines.forEach(machine => {
        let matchingProducts = [];
        
        if (brandMatch) {
          // For brand searches, find all products containing any brand variation
          matchingProducts = machine.products.filter(product => {
            const productLower = product.toLowerCase();
            return brandMatch.variations.some(variation => {
              // Use word boundary for better brand matching
              const regex = new RegExp(`\\b${variation.replace(/'/g, '\'?')}\\b`, 'i');
              return regex.test(productLower) || productLower.includes(variation);
            });
          });
        } else {
          // For specific product searches, use both exact and fuzzy matching
          matchingProducts = machine.products.filter(product => {
            const productLower = product.toLowerCase();
            
            // First try exact substring matching
            if (productLower.includes(term)) {
              return true;
            }
            
            // Then try fuzzy matching for typos
            const fuzzyResults = fuseInstance.search(product);
            return fuzzyResults.length > 0 && fuzzyResults[0].score < 0.3;
          });
        }
        
        if (matchingProducts.length > 0) {
          results.push({
            products: matchingProducts,
            machine,
            isProductSearch: true,
            isBrandSearch: !!brandMatch
          });
          matchingMachines.push(machine);
        }
      });
    } else {
      // Search by location or machine name
      vendingMachines.forEach(machine => {
        if (
          machine.name.toLowerCase().includes(term) ||
          machine.building.toLowerCase().includes(term)
        ) {
          results.push({
            products: machine.products,
            machine,
            isProductSearch: false
          });
          matchingMachines.push(machine);
        }
      });
    }
    
    // If user location is available, add distance to results and sort
    if (userLocation) {
      results.forEach(result => {
        const machine = result.machine;
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          machine.location[0],
          machine.location[1]
        );
        result.distance = distance;
      });
      
      // Sort by distance (closest first)
      results.sort((a, b) => a.distance - b.distance);
    } else {
      // If no location, sort by number of matching products (most matches first)
      if (isProductSearch) {
        results.sort((a, b) => b.products.length - a.products.length);
      }
    }
    
    setSearchResults(results);
    setSearchPerformed(true);
    setVisibleMachines(matchingMachines);
    
    // Reset expanded categories
    setExpandedCategories({});
  };  
  
  // Handle user accepting a search suggestion
  const handleAcceptSuggestion = () => {
    if (confirmedSearch) {
      // Set the search term to match the confirmed search
      setSearchTerm(confirmedSearch);
      
      // Perform the search with the confirmed term
      performSearch(confirmedSearch.toLowerCase());
      
      // Update the search input to show the corrected term
      if (searchInputRef.current) {
        searchInputRef.current.value = confirmedSearch;
      }
      
      // Clear the suggestion now that it's been accepted
      setSearchSuggestion(null);
    }
  };

  
  // Clear search function
  const clearSearch = () => {
    setSearchResults([]);
    setSearchPerformed(false);
    setSearchTerm('');
    setSearchSuggestion(null);
    setConfirmedSearch(null);
    setVisibleMachines(vendingMachines);
    
    // Reset search input if there's a ref to it
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
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
  
  // Render just category summaries for map popups (no individual items)
  const renderCategorySummary = (products) => {
    const groupedProducts = groupProductsByCategory(products);
    
    return (
      <div className="category-summary">
        {Object.entries(groupedProducts).map(([category, products]) => (
          <div key={category} className="category-item">
            <span className="category-name">{category}</span>
            <span className="category-count">({products.length})</span>
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
          <div className="search-container">
            <SearchBar onSearch={handleSearch} inputRef={searchInputRef} />
            <button className="clear-button" onClick={clearSearch}>
              Reset
            </button>
          </div>
          
          {/* Location Button */}
          <div className="location-section">
            <button 
              className={`location-button ${locationPermission === 'granted' ? 'active' : ''}`}
              onClick={getUserLocation}
              disabled={isLoadingLocation}
            >
              {isLoadingLocation ? 'Getting location...' : 
               locationPermission === 'granted' ? 'Update My Location' : 'Enable Location Services (optional)'}
            </button>
            {userLocation && (
              <p className="location-status">
                Location services enabled. *Location may not be 100% accurate*
              </p>
            )}
          </div>
          
          {/* Search Suggestion Message */}
          {searchSuggestion && (
            <div className="search-suggestion">
              <p>
                {searchSuggestion.type === 'colloquial' ? (
                  <>We found "{searchSuggestion.suggested}" for your search "{searchSuggestion.original}".</>
                ) : (
                  <>Did you mean "{searchSuggestion.suggested}" instead of "{searchSuggestion.original}"?</>
                )}
              </p>
              <div className="suggestion-actions">
                <button className="accept-suggestion" onClick={handleAcceptSuggestion}>
                  Yes, that's what I meant
                </button>
                <button className="reject-suggestion" onClick={() => setSearchSuggestion(null)}>
                  No, search as typed
                </button>
              </div>
            </div>
          )}
          
          {searchPerformed && (
            <div className="search-results">
              <h3>Search Results {searchTerm && `for "${searchTerm}"`}</h3>
              
              {searchResults.length === 0 ? (
                <p className="no-results">No products found. Try a different search term.</p>
              ) : (
                <div className="results-list">
                  {searchResults.map((result, index) => (
                    <div key={index} className="result-item">
                      <div className="result-content">
                        <div className="result-header">
                          <h4>{result.machine.name}</h4>
                          {result.distance !== undefined && (
                            <span className="distance-badge">
                              {formatDistance(result.distance)}
                            </span>
                          )}
                        </div>
                        <p><strong>Location:</strong> {result.machine.building}, {result.machine.floor}</p>
                        <p><strong>Notes:</strong> {result.machine.notes}</p>
                        
                        {/* For product searches, show matching products */}
                        {result.isProductSearch && (
                          <div className="found-products">
                            <p><strong>Found Products:</strong> {result.products.join(', ')}</p>
                          </div>
                        )}
                        
                        {/* For location searches, show all products */}
                        {!result.isProductSearch && (
                          <div className="products-container">
                            <h5>Available Products:</h5>
                            {renderDropdownGroupedProducts(result.products, result.machine.id)}
                          </div>
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
              key={visibleMachines.map(m => m.id).join('-')} // Add a key prop to force re-render
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Only render markers for visible machines */}
              {visibleMachines.map(machine => (
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
                      {userLocation && (
                        <p><strong>Distance:</strong> {
                          formatDistance(calculateDistance(
                            userLocation.latitude,
                            userLocation.longitude,
                            machine.location[0],
                            machine.location[1]
                          ))
                        }</p>
                      )}
                      <div className="popup-products">
                        <p><strong>Available Categories:</strong></p>
                        {renderCategorySummary(machine.products)}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* User location marker */}
              {userLocation && (
                <UserLocationMarker 
                  position={[userLocation.latitude, userLocation.longitude]}
                />
              )}
              
              {/* Map updater component to handle map view changes */}
              <MapUpdater 
                visibleMachines={visibleMachines} 
                userLocation={userLocation}
              />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
