# Duke Vending Machine Finder

## Overview

People at Duke are hungry, this helps them find the munchies

## Features

### Location-Based Services

Interactive campus map showing all vending machine locations,
geolocation support to find the nearest vending machines,
distance calculations in miles/feet to each vending machine,
map auto-focuses on search results and current location

### Smart Search

Search by product name (e.g., "Doritos", "Coca Cola"),
search by building name or vending machine location.
Gives detailed results including distance, location notes, and available products

**Autocomplete Suggestions:** As you type, the search bar shows product suggestions to help you find what you're looking for quickly. Type "dor" to see all Doritos options, "coke" to find Coca Cola, or "hot cheetos" to find the spicy variety.

**Product Images:** Visual product identification in autocomplete suggestions and search results for better user experience.

**Keyboard Navigation:** Use arrow keys to navigate suggestions, Enter to select, and Escape to close.

### Product Organization

Products categorized into groups:

Healthy Snacks
<br>
Energy/Electrolyte Drinks
<br>
Drinks
<br>
Chips & Savory Snacks
<br>
Candy & Sweets
<br>
Other Snacks

Expandable/collapsible product categories in search results
Product count per category

### User Interface

Clean, mobile-friendly design,
building and floor information for each machine,
detailed location notes to help find machines in buildings,
map popups with machine details and product category summaries

## Setting Up Product Images

To add product images to the autocomplete and search results:

1. **Upload Images:** Place product images in `public/images/products/`
2. **Naming Convention:** Use kebab-case (e.g., `doritos-nacho-cheese.jpg`)
3. **Image Mapping:** Update `src/utils/productImages.js` with your image mappings
4. **Supported Formats:** JPG, PNG, WebP
5. **Recommended Size:** 200x200px for optimal performance

### Example Image Setup:
```
public/images/products/
├── doritos-nacho-cheese.jpg
├── coca-cola.jpg
├── snickers.jpg
├── lays-classic.jpg
└── default-product.jpg
```

## Technical Details

### Dependencies

React
<br>
React Leaflet (map component)
<br>
Leaflet (mapping library)

### Key Components

MainPage: The main application container
<br>
SearchBar: Handles user input for searches with autocomplete functionality
<br>
ProductImage: Displays product images with loading states and fallbacks
<br>
MapContainer: The Leaflet map component
<br>
MapUpdater: Handles map bounds and view updates
<br>
UserLocationMarker: Shows the user's current location on the map

### Key Functions

calculateDistance: Uses the Haversine formula to calculate distances between coordinates
<br>
formatDistance: Formats distances in appropriate units (miles or feet)
<br>
categorizeProduct: Categorizes products into logical groups
<br>
groupProductsByCategory: Organizes products by their categories
<br>
getProductSuggestions: Provides autocomplete suggestions based on user input
<br>
getProductImage: Maps product names to their corresponding image files