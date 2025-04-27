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
SearchBar: Handles user input for searches
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