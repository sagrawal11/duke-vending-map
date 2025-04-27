# Duke Vending Machine Finder

## Overview

People at Duke are hungry, this helps them find the munchies

## Features

### Location-Based Services

Interactive campus map showing all vending machine locations
Geolocation support to find the nearest vending machines
Distance calculations in miles/feet to each vending machine
Map auto-focuses on search results and your current location

### Smart Search

Search by product name (e.g., "Doritos", "Coca Cola")
Search by building name or vending machine location
Detailed results including distance, location notes, and available products

### Product Organization

Products categorized into groups:

Healthy Snacks
Energy/Electrolyte Drinks
Drinks
Chips & Savory Snacks
Candy & Sweets
Other Snacks

Expandable/collapsible product categories in search results
Product count per category

### User Interface

Clean, mobile-friendly design
Building and floor information for each machine
Detailed location notes to help find machines in buildings
Map popups with machine details and product category summaries

## Technical Details

### Dependencies

React
React Leaflet (map component)
Leaflet (mapping library)

### Key Components

MainPage: The main application container
SearchBar: Handles user input for searches
MapContainer: The Leaflet map component
MapUpdater: Handles map bounds and view updates
UserLocationMarker: Shows the user's current location on the map

### Key Functions

calculateDistance: Uses the Haversine formula to calculate distances between coordinates
formatDistance: Formats distances in appropriate units (miles or feet)
categorizeProduct: Categorizes products into logical groups
groupProductsByCategory: Organizes products by their categories

### Data Structure
The application contains a dataset of 21 vending machines across Duke's campus with:

### Unique IDs
Location names
Geographic coordinates
Building information
Floor details
Location notes
Complete product inventories