import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SearchBar from '../components/SearchBar';
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

// Product categorization function
const categorizeProduct = (product) => {
  const lowerProduct = product.toLowerCase();

  // Protein and health foods
  if (lowerProduct.includes('gatorade protein bar') || 
      lowerProduct.includes('granola') || 
      lowerProduct.includes('trail mix') || 
      lowerProduct.includes('cashews') || 
      lowerProduct.includes('almond') ||
      lowerProduct.includes('protein')) {
    return 'Healthy Snacks';
  }

  // Energy drinks
  if (lowerProduct.includes('red bull') || 
      lowerProduct.includes('monster') || 
      lowerProduct.includes('celsius') || 
      lowerProduct.includes('propel') || 
      lowerProduct.includes('gatorade') ||
      lowerProduct.includes('gatorlyte') ||
      lowerProduct.includes('body armor') ||
      lowerProduct.includes('vitamin water') ||
      lowerProduct.includes('fairlife') ||
      lowerProduct.includes('storm') ||
      lowerProduct.includes('starbuck') ||
      lowerProduct.includes('powerade')) {
    return 'Energy/Electrolyte Drinks';
  }

  // Sodas and drinks
  if (lowerProduct.includes('water') || 
      lowerProduct.includes('pepsi') || 
      lowerProduct.includes('dew') || 
      lowerProduct.includes('tea') || 
      lowerProduct.includes('coca') ||
      lowerProduct.includes('mellow') ||
      lowerProduct.includes('dr. pepper') ||
      lowerProduct.includes('coke') ||
      lowerProduct.includes('sprite') ||
      lowerProduct.includes('topo chico') ||
      lowerProduct.includes('lemonade') ||
      lowerProduct.includes('cheerwine') ||
      lowerProduct.includes('strawberry') ||
      lowerProduct.includes('ginger ale') ||
      lowerProduct.includes('starry') ||
      lowerProduct.includes('apple juice') ||
      lowerProduct.includes('orange juice') ||
      lowerProduct.includes('fanta')) {
    return 'Drinks';
  }
  
  // Chips and savory snacks
  if (lowerProduct.includes('lays') || 
      lowerProduct.includes('cheetos') || 
      lowerProduct.includes('doritos') || 
      lowerProduct.includes('fritos') || 
      lowerProduct.includes('pringle') || 
      lowerProduct.includes('funyun') || 
      lowerProduct.includes('pork') || 
      lowerProduct.includes('popcorn') || 
      lowerProduct.includes('chex') || 
      lowerProduct.includes('chips') || 
      lowerProduct.includes('sun chips') || 
      lowerProduct.includes('cheez it') || 
      lowerProduct.includes('gardettos') || 
      lowerProduct.includes('crackers') ||
      lowerProduct.includes('ruffles') ||
      lowerProduct.includes('tuna') ||
      lowerProduct.includes('gold') ||
      lowerProduct.includes('pop') ||
      lowerProduct.includes('veggie') ||
      lowerProduct.includes('cheddar')|| 
      lowerProduct.includes('cheese') ||
      lowerProduct.includes('pretzel')) {
    return 'Chips & Savory Snacks';
  }
  
  // Candy and sweets
  if (lowerProduct.includes('oreos') || 
      lowerProduct.includes('snickers') || 
      lowerProduct.includes('kitkat') || 
      lowerProduct.includes('kit kat') || 
      lowerProduct.includes('fruit snack') || 
      lowerProduct.includes('reese') || 
      lowerProduct.includes('twix') || 
      lowerProduct.includes('butterfinger') || 
      lowerProduct.includes('uskateer') || 
      lowerProduct.includes('kinder') || 
      lowerProduct.includes('Pop') || 
      lowerProduct.includes('haribo') || 
      lowerProduct.includes('cookie') || 
      lowerProduct.includes('m&m') || 
      lowerProduct.includes('payday') || 
      lowerProduct.includes('candy') || 
      lowerProduct.includes('ghiradelli') || 
      lowerProduct.includes('airhead') || 
      lowerProduct.includes('skittles') || 
      lowerProduct.includes('gummies') || 
      lowerProduct.includes('gushers') || 
      lowerProduct.includes('nerds') ||
      lowerProduct.includes('honey bun') ||
      lowerProduct.includes('worm') ||
      lowerProduct.includes('mike')||
      lowerProduct.includes('crunch')) {
    return 'Candy & Sweets';
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
    name: 'BC Vending Machine', 
    location: [36.001057, -78.940978], 
    building: 'Bryan Center',
    floor: 'Middle Floor',
    notes: 'Between McDonalds and Griffith Theater',
    products: ['Pepsi', 'Mountain Dew', 'Pepsi Zero Sugar', 'Mountain Dew Zero Sugar', 'Water', 'Pure Leaf Tea', 'Propel', 'Celsius', 'Lays CLassic', 'Cheetos', 'Doritos Nacho Cheese', 'Fritos Original', 'White Cheddar Popcorn', 'Lays Barbeque', 'Cheetos Cheddar Jalapeno', 'Doritos Cool Ranch', 'Chex Mix', 'Sun Chips Garden Salsa', 'Sun Chips Harvest Cheddar', 'Cheez It', 'Doritos Spicy Sweet Chili', 'Gardettos Snack Mix', 'Lays Salt and Vinegar', 'Penut Butter Crackers', 'Grilled Cheese Crackers', 'Toasted Cheese Peanut Butter Crackers', 'Oreos', 'Snickers', 'Kit Kat', "Reese's Peanut Butter Cups", '3 Musketeers', 'Kinder Bueno', 'Haribo Gummy Bears', 'M&Ms', 'Peanut M&Ms', 'Ghiradelli Milk Chocolate Caramel', "Reese's Fast Break", 'Skittles', 'Slim Jim', 'Cinnamon Almond Butter Biscuits', "Reese's Sticks", "Cashews", 'Trail Mix', 'Beef Tender Bites', "Sour Skittles Gummies", "Gushers", 'Honey Bun', 'Nerds', 'Vitamin Water', 'Body Armor', 'Fairlife Core Power', 'Topo Chico', 'Coca Cola', 'Fanta', 'Sprite', 'Orange Juice', 'Strawberry Grape Juice', 'Apple Juice', 'Powerade', 'Storm', 'Lemonade', 'Coke Zero', 'Monster']
  },
  { 
    id: 2, 
    name: 'Wu Vending Machine', 
    location: [36.000597, -78.939276], 
    building: 'Broadhead Center',
    floor: '2nd Floor',
    notes: 'In the back where the study rooms are',
    products: ['Vitamin Water', 'Storm', 'Topo Chico', 'Body Armor', 'Pure Leaf Tea', 'Lays Classic', 'Doritos Nacho Cheese', 'Lays barbeque', 'Popchips Sea Salt', 'Goldfish', 'Bugles Nacho Cheese', 'Popchips Sour Cream and Onion', 'Veggie Straws', 'Mini Pretzels', 'Cheetos', 'Smartfood White Cheddar', 'Cheez It', 'Grilled Cheese Crackers', 'Crunch', 'Nature Valley Granola Bar', 'Nutra Grain', 'Trail Mix', 'Pistachios', 'Gatorade Protein Bar', 'Clif Bar Chocolate Chip', 'Ghiradelli Milk Chocolate Caramel', 'Sour Skittle Gummies', 'Wild Berry Skittle Gummies', 'Trolli Sour Gummy Worms', 'Mike&Ike', 'Nerds Gumy Clusters', 'Pepsi', 'Gatorade', 'Water', 'Propel', 'Celsius']
  },
  { 
    id: 3, 
    name: 'Perkins Vending Machine', 
    location: [36.002628, -78.938762], 
    building: 'Perkins Library',
    floor: 'LL1',
    notes: 'In the back corner',
    products: ['Vitamin Water', 'Orange Juice', 'Gold Peak Sweet Tea', 'Fairlife Core Power', 'Coca Cola', 'Water', 'Lays Classic', 'Popchips Sea Salt', 'Doritos Nacho Cheese', 'Cheez It', 'Sun Chips Harvest Cheddar', 'Lays Barbeque', 'Doritos Spicy Sweet Chili', 'Mini Pretzels', 'Tuna Salad', 'Pringles', 'Gardettos Snack Mix', 'Chicken Salad and Crackers', 'Toasted Cheese Peanut Butter Crackers', 'Ruffles Cheddar & Sour Cream', 'Cheez It', 'Lays Sour Cream & Onion', "Reese's Peanut Butter Cups", 'Rice Krispies Treats', 'Snickers', 'Peanut M&Ms', 'KitKat', "Reese's Sticks", 'Ghiradelli Milk Chocolate Caramel', 'Clif Bar Chocolate Chip', 'Sour Skittles Gummies', 'Gushers', 'Classic Cookie']
  }, 
  { 
    id: 4, 
    name: 'Wilkinson Vending Machine', 
    location: [36.003349, -78.937840], 
    building: 'Wilkinson',
    floor: 'Bottom Floor',
    notes: 'Straight down the stairs, behind the study booths on the left side',
    products: ['Pepsi', 'Pepsi Zero Sugar', 'Starry', 'Mountain Dew', 'Water', 'Propel', 'Celsius', 'Starbucks Strawberry Acai', 'Starbucks Mocha Cappuccino', 'Starbucks Caramel Cappuccino', 'Apple Juice', 'Lays Classic', 'Cheetos', 'Doritos Nacho Cheese', 'Fritos Twists', 'Lays Salt and Vinegar', 'Funyuns', 'Gardettos Snack Mix', 'Doritos Cool Ranch', 'Ruffles Cheddar & Sour Cream', 'Sun Chips Garden Salsa', 'Tubs Bar-B-Que Pork Rinds', "Miss Vickie's Spicy Dill Pickle Chips", 'Cheetos Cheddar Jalepeno', 'Cheez It', 'Sun Chips Harvest Cheddar', 'Peanut Butter Crackers', 'Grilled Cheese Crackers', 'Oreos', 'Toasted Cheese Peanut Butter Crackers', "Reese's Sticks", 'Nature Valley Peanut Butter Granola Bar', "Reese's Fast Break", "Reese's Peanut Butter Cups", 'KitKat', 'Snickers', 'Peanut M&Ms', 'Twix', '3 Muskateers', 'Skittles', 'Kinder Bueno', 'Butterfinger', 'Cinnamon Almond Butter Biscuits', 'Haribo Gummy Bears', 'Trail Mix', 'Gushers', 'Pringles', 'Classic Cookie', 'Big Honey Bun', 'Mini Chocolate Chip Cookies']
  }, 
  { 
    id: 5, 
    name: 'Teer Vending Machine', 
    location: [36.003830, -78.941049], 
    building: 'Nello L. Teer Building',
    floor: 'FLoor 1',
    notes: 'Down the stairs, go through the left set of doors, then down the right hallway',
    products: ['Pepsi', 'Pepsi Zero Sugar', 'Cherry Pepsi', 'Starry', 'Mountain Dew', 'Diet Mountain Dew', 'Baja Blast Mountain Dew', 'Mug Root Beer', 'Water', 'Lays Classic', 'Cheetos', 'Doritos Nacho Cheese', 'Fritos Twists', 'Smartfood White Cheddar Popcorn', 'Doritos Cool Ranch', 'Funyuns', 'Tubs Bar-B-Que Pork Rinds', 'Ruffles Cheddar & Sour Cream', 'Lays Salt and Vinegar', 'Lays Barbeque', 'Lays Sour Cream & Onion', 'Gardettos Snack Mix', 'Cheez It', 'Chex Mix', 'Peanut Butter Crackers', 'Gushers', 'Toasted Cheese Peanut Butter Crackers', 'Trail Mix', "Reese's Peanut Butter Cups", "Reese's Stick", "Hershey's Chocolate Bar", 'Peanut M&Ms', 'Slim Jim', 'Snickers', 'Sour Patch Kids', 'Gatorade Protein Bar', 'Rice Krispies Treats', 'Haribo Gummy Bears', 'Kinder Bueno', 'Nutra Grain', 'Nature Valley Granola Bar', 'Beef Tender Bites', 'Sour Skittles Gummies', 'Big Honey Bun', 'Bite Sized Cookies', 'Nerds Gummy Clusters', 'Gatorade', 'Gatorlyte', 'Propel', 'Celsius', 'Starbucks Triple Shot Bold Mocha', 'Starbucks Triple Shot Dark Caramel', 'Starbucks triple Shot Vanilla', 'Starbucks Cold Brew']
  },
  { 
    id: 6, 
    name: 'Mary Lou Vending Machine', 
    location: [36.001143, -78.939581], 
    building: 'Flowers Building',
    floor: '2nd Floor',
    notes: "Enter Flowers and go up the stairs. Or enter from Wu side and it's right there",
    products: ['Lays Classic', 'Doritos Nacho Cheese', 'Popchips Sea Salt', 'Cheetos', 'Fritos Original', 'Ruffles Cheddar & Sour Cream', 'Veggie Straws', "Miss Vickie's Spicy Dill Pickle Chips", 'Chex Mix', 'Bugles Nacho Cheese', 'Cheez It', 'Mike&Ike', 'Bite Sized Cookies', 'Black Forest Fruit Snacks', 'Grilled Cheese Crackers', 'Toasted Cheese Peanut Butter Crackers', 'Peanut Butter Crackers', 'Skittles', 'Clif Bar Chocolate Chip', 'Ghiradelli Milk Chocolate Caramel', "Nutra Grain", 'Snickers', 'M&Ms', "Reese's Peanut Butter Cups", 'Payday', 'Kinder Bueno', 'Crunch', "Reese's Sticks", 'Trail Mix']
  },
  { 
    id: 7, 
    name: 'Wilson Vending Machine', 
    location: [35.9969127, -78.9409947], 
    building: 'Wilson Recreation Center',
    floor: 'Bottom Floor',
    notes: 'All the way down the stairs in front of the locker rooms',
    products: ['Lays CLassic', 'Fritos Twists', 'Popchips Sour Cream & Onion', 'Cheez It', 'Lays Barbeque', 'Fritos Original', 'Ruffles Cheddar & Sour Cream', 'Mini Pretzels', 'Gardettos Snack Mix', 'Chex Mix', 'Bugles Nacho Cheese', 'Beef Tender Bites', 'Black Forest Fruit Snacks', 'Clif Bar Chocolate Chip', 'Gatorade Protein Bar', 'Snickers', 'M&Ms', 'Kitkat', 'Ghiradelli Milk Chocolate Caramel', 'Trial Mix', "Reese's Peanut Butter Cups", 'Kinder Bueno', 'Nature Valley Granola Bar', 'Powerade', 'Water']
  },
  { 
    id: 8, 
    name: 'Physics Vending Machine', 
    location: [36.003281, -78.942555], 
    building: 'Physics Building',
    floor: 'Bottom Floor',
    notes: 'Enter the building and go right, follow the hallway and go down the stairs, vending machine is around the corner',
    products: ['Coca Cola', 'Diet Coke', 'Sprite', 'Dr. Pepper', 'Diet Dr. Pepper', 'Coca Cola Zero Sugar', 'Schweppes Ginger Ale', 'Pepsi', 'Pepsi Zero Sugar', 'Cherry Pepsi', 'Starry', 'Water', 'Mountain Dew', 'Diet Mountain Dew', 'Baja Blast Mountain Dew', 'Lays Classic', 'Fritos Twists', 'Doritos Nacho Cheese', 'Smartfood White Cheddar Popcorn', 'Doritos Cool Ranch', 'Cheetos', 'Funyuns', 'Ruffles Cheddar & Sour Cream', 'Mini Pretzels', 'Lays Barbeque', 'Lays Sour Cream & Onion', 'Bugles Nacho Cheese', 'Cheez It', "Miss Vickie's Spicy Dill Pickle Chips", 'Grilled Cheese Crackers', 'Skittles', 'Toasted Cheese Peanut Butter Crackers', 'Peanut Butter Crackers', 'Payday', "Reese's Peanut Butter Cups", 'Nutra Grain', 'Kinder Bueno', 'M&Ms', 'Ghiradelli Milk Chocolate Caramel', 'Snickers', 'Peanut M&Ms', 'KitKat', "Reese's Sticks", 'Butterfinger', 'Clif Chocolate Chip', 'Skittles', "Reese's Fast Break", 'Nature Valley Granola Bar', 'Trolli Sour Gummy Worms', 'Big Honey Bun', 'Pop Tarts', 'Gushers']
  },
  { 
    id: 9, 
    name: 'LSRC Vending Machine 1', 
    location: [36.004893, -78.940819], 
    building: 'Levine Science Research Center',
    floor: '3rd Floor',
    notes: 'Between C and D wings',
    products: ['Lays Classic', 'Fritos Twists', 'Doritos Nacho Cheese', 'Gardettos Snack Mix', 'Doritos Cool Ranch', 'Fritos Original', 'Cheetos', 'Mini Pretzels', 'Cheez It', 'Miss Vickies Spicy Dill Pickle Chips', 'Sour Skittles Gummies', 'Black Forest Fruit Snacks', 'Gushers', 'Toasted Cheese Peanut Butter Crackers', 'Peanut Butter Crackers', 'Trail Mix', "Reese's Peanut Butter Cups", "Reese's Fast Break", 'Nutra Grain', 'Snickers', 'M&Ms', 'Roatsed & Salted Almonds', 'Nature Valley Granola Bar', 'Coca Cola', 'Diet Coke', 'Sprite', 'Mellow Yellow', 'Dr. Pepper', 'Diet Dr. Pepper']
  },
  { 
    id: 10, 
    name: 'LSRC Vending Machine 2', 
    location: [36.004552, -78.941932], 
    building: 'Levine Science Research Center',
    floor: 'Basement',
    notes: 'Basement under the B wing, take elevator down',
    products: ['Pepsi', 'Diet Pepsi', 'Lemonade', 'Celsius', 'Mountain Dew', 'Schweppes Ginger Ale', 'Cherry Pepsi', 'Sunkist Orange', 'Sunkist Strawberry', 'Coca Cola', 'Diet Coke', 'Sprite', 'Mellow Yellow', 'Dr. Pepper', 'Diet Dr. Pepper', 'Water', 'Lays Classic', 'Gardettos Snack Mix', 'Sun Chips Harvest Cheddar', 'Fritos Twists', 'Doritos Cool Ranch', 'Cheetos', 'Fritos Original', 'Ruffles Cheddar & Sour Cream', 'Popchips Sea Salt', 'Lays Barbeque', 'Cheez It', 'Miss Vickies Spicy Dill Pickle Chips', 'Grilled CHeese Crackers', 'Skittles', 'Toasted Cheese Peanut Butter Crackers', 'Peanut Butter Crackers', 'Nature Valley Cinnamon Almond Butter Biscuits', "Reese's Peanut Butter Cups", 'Nutra Grain', 'Twix', 'M&Ms', 'Peanut M&Ms', 'Snickers', 'KitKat', 'Payday', "Reese's Sticks", 'Rice Krispies Treats', 'Crunch', 'Skittles', 'Airheads Bites', 'Nature Valley Granola Bar', 'Sour Skittles Gummies', 'Big Honey Bun', 'Pop Tarts', 'Classic Cookie', 'Gushers']
  },
  { 
    id: 11, 
    name: 'Few FF Laundry Room Vending Machine', 
    location: [36.000565, -78.938354], 
    building: 'Few Quad',
    floor: 'First Floor',
    notes: 'End of the hallway in 1st floor Few',
    products: ['Coca Cola', 'Diet Coke', 'Water', 'Sprite', 'Dr. Pepper', 'Lays Classic', 'Fritos Twists', 'Doritos Nacho Cheese', 'Sun Chips Harvest Cheddar', 'Miss Vickies Spicy Dill Pickle Chips', 'Doritos Cool Ranch', 'Smartfood White Cheddar Popcorn', 'Ruffles Cheddar & Sour Cream', 'Lays Sour Cream & Onion', 'Lays Salt & Vinegar', 'Gardettos Snack Miox', 'Cheez It', 'Classic Cookie', 'Big Honey Bun', 'Nerds Gummy Clusters', 'Mike&Ike', 'Peanut Butter Crackers', 'Toasted Cheese Peanut Butter Crackers', 'Skittles', "Reese's Peanut Butter Cups", 'Kinder Bueno', 'Peanut M&Ms', 'KitKat', "Reese's Sticks", 'Rice Krispies Treats', 'Nature Valley Cinnamon Almond Butter Biscuits', 'Snickers', 'Clif Chocolate Chip', 'Nature Valley Granola Bar', 'Crunch'] 
  },
  { 
    id: 12, 
    name: 'Randolph Laundry Room 1 Vending Machine', 
    location: [36.006757, -78.917442], 
    building: 'Randolph Residence Hall',
    floor: 'First Floor',
    notes: 'Enter on left side and go around the corner',
    products: ['Pepsi', 'Water', 'Mountain Dew', 'Cheerwine', 'Starbucks Double Shot Coffee', 'Lays Classic', 'Fritos Twists', 'Doritos Nacho Cheese', 'Smartfood White Cheddar Popcorn', 'Lays Barbeque', 'Doritos Cool Ranch', 'Cheez It', 'Fritos Original', 'Ruffles CHeddar & Sour Cream', 'Mini Pretzels', 'Cheetos', 'Gardettos Snack Mix', 'Grilled Cheese Crackers', 'Skittles', 'Toasted Cheese Peanut Butter Crackers', 'Peanut Butter Crackers', 'Nature Valley CInnamon Almond Butter Biscuits', "Reese's Peanut Butter Cups", 'Airheads Bites', 'Twix', 'Meanut M&Ms', 'Snickers', 'KitKat', 'Butterfinger', 'Rice Krispies Treats', 'Crunch', '3 Muskateers', 'Haribo Gummy Bears', 'Sour Skittles Gumies', 'Big Honey Bun', 'Beef Tender Bites', 'Vitamin Water', 'Powerade', 'Monster'] 
  },
  { 
    id: 13, 
    name: 'Randolph Laundry Room 2 Vending Machine', 
    location: [36.006760, -78.916828], 
    building: 'Randolph Residence Hall',
    floor: 'First Floor',
    notes: 'Enter on right side and go around the corner',
    products: ['Pepsi', 'Mountain Dew', 'Water', 'Lipton Citrus Green Tea', 'Orange Juice', 'Vitamin Water', 'Powerade', 'Lays Classic', 'Fritos Twists', 'Doritos Nacho Cheese', 'Smartfood White Cheddar Popcorn', 'Funyuns', 'Ruffles Cheddar & Sour Cream', 'Sun Chips Harvest Cheddar', 'Fritos Original', 'Mini Pretzels', 'Sun Chips Garden Salsa', 'Cheez It', 'Nerds Gummy Clusters', 'Grilled Cheese Crackers', 'Skittles', 'Toasted Cheese Peanut Butter Crackers', 'Peanut Butter Crackers', 'Trail Mix', "Reese's Peanut Butter Cups", 'Airheads Bites', 'Twix', 'Peanut M&Ms', 'Snickers', 'KitKat', 'Clif Chocolate Chip', 'Haribo Gummy Bears', 'Rice Krispies Treats', 'Crunch', 'Gatorade Protein bar', '3 Muskateers', 'Nature Valley Granola Bar', 'Sour Skittles Gummies', 'Classic Cookie', 'Gushers','Mike&Ike', 'Beef Tender Bites'] 
  },
  { 
    id: 14, 
    name: 'Bell Tower Laundry Room Vending Machine', 
    location: [36.007101, -78.917891], 
    building: 'Bell Tower Residence Hall',
    floor: 'First Floor',
    notes: 'Enter on right side and go down the hall',
    products: ['Coca Cola', 'Vitamin Water', 'Sprite', 'Dr. Pepper', 'Seagrams Ginger Ale', 'Water', 'Lays Classic', 'Fritos Twists', 'Doritos Nacho Cheese', 'Sun Chip Harvest Cheddar', 'Lays Barbeque', 'Doritos Cool Ranch', 'Smartfood White Cheddar Popcorn', 'Fritos Original', 'Ruffles Cheddar & Sour Cream', 'Mini Pretzels', 'Pop Tarts', 'Gardettos Snack Mix', 'Cheez It', 'Miss Vickies Spicy Dill Pickle Chips', 'Peanut Butter Crackers', 'Skittles', 'Toasted Cheese Peanut Butter Crackers', 'Nature Valley Cinnamon Almond Butter Biscuits', "Reese's Peanut Butter Cups", 'Airheads Bites', 'Kinder Bueno', 'M&Ms', 'Trail Mix', 'Snickers', 'Peanut M&Ms', 'KitKat', 'Clif Chocolate Chip', 'Haribo Gummy Bears', 'Rice Krispies Treats', 'Crunch', 'Gatorade Protein Bar', '3 Muskateers', 'Hersheys Chocolate Bar', 'Nerds Gummy Clusters', 'Big Honey Bun', 'Sour Skittles Gummies', 'Gushers', 'Beef Tender Bites'] 
  },
  { 
    id: 15, 
    name: 'Bell Tower Left Vending Machine', 
    location: [36.006975, -78.918387], 
    building: 'Bell Tower Residence Hall',
    floor: 'First Floor',
    notes: 'Enter on left side and go all the way down the hall',
    products: ['Lays Classic', 'Cheetos', 'Doritos Nacho Cheese', 'Fritos Twists', 'Bugles Nacho Cheese', 'Miss Vickies Spicy Dill Pickle Chips', 'Lays Sour Cream & Onion', 'Fritos Original', 'Ruffles Cheddar & Sour Cream', 'Sun Chips Harvest Cheddar', 'Pop Tarts', 'Gardettos Snack Mix', 'Cheez It', 'Lays Salt & Vinegar', 'Mini Pretzels', 'Wild Cherry Skittles Gummies', 'Jolly Rancher Sour Gummies', 'Trolli Sour Gummy Worms', 'Gushers', 'Beef Tender Bites', 'Grilled Cheese Crackers', 'Toasted Cheese Peanut Butter Crackers', 'Peanut Butter Crackers', 'Skittles', 'Butterfinger', "Reese's Peanut Butter Cups", 'KitKat', 'Twix', 'Peanut M&Ms', 'Snickers', 'Big Honey Bun', 'Classic Cookie', 'Pop Tarts', 'Mini Cookies', 'Belvita'] 
  },
  { 
    id: 16, 
    name: 'Trinity Laundry Room Vending Machine', 
    location: [36.006452, -78.918886], 
    building: 'Trinity Residence Hall',
    floor: 'First Floor',
    notes: 'Enter on the left side, go through the common room, and down the hallway',
    products: ['Baja Blast Mountain Dew', 'Pepsi', 'Starry', 'Celsius', 'Propel', 'Gatorade', 'Water', 'Green Leaf Tea', 'Coca Cola', 'Coca Cola Zero', 'Sprite', 'Dr. Pepper', 'Vitamin Water', 'Lays Classic', 'Fritos Twists', 'Doritos Nacho Cheese', 'Sun Chips Harvest Cheddar', 'Lays Barbeque', 'Ruffles Cheddar & Sour Cream', 'Doritos Nacho Cheese', 'Doritos Flamin Hot Cool Ranch', 'Doritos Cool Ranch', 'Pop Tarts', 'Beef Tender Bites', 'Gardettos Snack Mix', 'Miss Vickies Spicy Dill Pickle Chips', 'Classic Cookie', 'Big Honey Bun', 'Jolly Rancher Sour Gummies', 'Gushers', 'Grilled Cheese Crackers', 'Skittles', 'Toasted Cheese Peanut Butter Crackers', 'Gatorade Protein Bar', 'Slim Jim', "Reese's Peanut Butter Cups", 'Airheads Bites', 'Kinder Bueno', 'Peanut M&Ms', 'Haribos Gummy Bears', 'Snickers', 'KitKat', 'Butterfinger', 'Rice Krispies Treats', 'Ghiradelli Milk Chocolate Caramel', 'Crunch', '3 Muskateers', "Reese's Sticks"] 
  },
  { 
    id: 17, 
    name: 'Southgate Laundry Room Vending Machine', 
    location: [36.005940, -78.918060], 
    building: 'Southgate Residence Hall',
    floor: 'First Floor',
    notes: 'Take a left once you enter, on the right side of the hallway',
    products: ['Coca Cola', 'Diet Coke', 'Sprite', 'Dr. Pepper', 'Mellow Yellow', 'Water', 'Vitamin Water', 'Celsius', 'Pepsi', 'Starbucks Cappuccino', 'Pepsi Zero Sugar', 'Starbucks Vanilla Mocha', 'Mountain Dew', 'Propel', 'Water', 'Lays Classic', 'Fritos Twists', 'Doritos Nacho Cheese', 'Smartfood White Cheddar Popcorn', 'Cheetos', 'Miss Vickies Spicy Dill Pickle Chips', 'Fritos Original', 'Ruffles Cheddar & Sour Cream', 'Mini Pretzels', 'Sun Chips Harvest Cheddar', 'Lays Sour Cream & Onion', 'Gardettos Snack Mix', 'Cheez It', 'Sour Skittles Gummies', 'Big Honey Bun', 'Mike&Ike', 'Classic Cookie', 'Grilled Cheese Cookies', 'Skittles', 'Toasted Cheese Peanut Butter Crackers', 'Peanut Butter Crackers', 'Trail Mix', "Reese's Peanut Butter Cups", 'Ghiradelli Milk Chocolate Caramel', "Reese's Fast Break", 'Peanut M&Ms', 'Haribo Gummy Bears', 'Snickers', 'KitKat', "Reese's Sticks", 'Butterfinger', 'Rice Krispies Treats', 'Gatorate Granola Bar', 'Skitt;es', '3 Muskateers', 'Slim Jim'] 
  },
  { 
    id: 18, 
    name: 'GADU Vending Machine', 
    location: [36.005698, -78.916886], 
    building: 'Gilbert Addoms Residence Hall',
    floor: 'Bottom Floor',
    notes: 'Back right corner of GADU, past the pool table',
    products: ['Lays Classic', 'Cheetos', 'Fritos Twists', 'Doritos Nacho Cheese', 'Doritos Flamin Hot', 'Ruffles Cheddar & Sour Cream', 'Smartfood White Cheddar Popcorn', 'Lays Salt & Vinegar', 'Mini Pretzels', 'Sun Chips Harvest Cheddar', 'Gardettos Snack Mix', 'Doritos Cool Ranch', 'Cheez It', 'Sour Skittles Gumimes', 'Haribo Gummy Bears', 'Gushers', 'Black Forest Fruit Snacks', 'Beef Tender Bites', 'Big Honey Bun', 'Classic Cookie', 'Mini Cookies', 'Snickers', 'Peanut M&Ms', 'KitKat', "Reese's Peanut Butter Cups", 'Kinder Bueno', "Reese's Sticks", 'Gatorade Protein Bar', 'Skittles', 'Coca Cola', 'Diet Coke', 'Sprite', 'Vitamin Water', 'Topo Chico', 'Water', 'Gatorade', 'Gatorlyte', 'Pure Leaf Sweet Tea', 'Celsius', 'Starbucks Triple Shot Bold Mocha', 'Starbucks Frappuccino', 'Pepsi', 'Pepsi Zero Sugar', 'Cherry Pepsi', 'Starry', 'Mountain Dew', 'Baja Blast Mountain Dew', 'Schweppes Ginger Ale', 'Propel'] 
  },
  { 
    id: 19, 
    name: 'West Duke Vending Machine', 
    location: [36.004888, -78.915382], 
    building: 'West Duke Building',
    floor: 'First Floor',
    notes: 'Middle of the hallway in a small foyer area',
    products: ['Pepsi', 'Diet Pepsi', 'Water', 'Mountain Dew', 'Diet Mountain Dew', 'Baja Blast Mountain Dew', 'Celsius', 'Lays Classic', 'Fritos Twists', 'Doritos Nacho Cheese', 'Sun Chips Harvest Cheddar', 'Lays Barbeque', 'Doritos Cool Ranch', 'Cheetos', 'Sun Chips Garden Salsa', 'Ruffles Cheddar & Sour Cream', 'Mini Pretzels', 'Pop Tarts', 'Gardettos Snack Mix', 'Bugles Nacho Cheese', 'Cheez It', 'Sour Skittles Gummies', 'Black Forest Fruit Snacks', 'Peanut M&Ms', 'Mike&Ike', 'Peanut Butter Crackers', 'Skittles', 'Toasted Cheese Peanut Butter Crackers', 'Trail Mix', "Reese's Peanut Butter Cups", 'Nutra Grain', 'Ghiradelli Milk Chocolate Caramel', 'Snickers', 'KitKat', 'Gatorade Protein Bar', 'Haribo Gummy Bears', 'Rice Krispies Treats', 'Crunch', '3 Muskateers', 'Nature Valley Granola Bar'] 
  },
  { 
    id: 20, 
    name: 'Allen Vending Machine', 
    location: [36.001041, -78.937515], 
    building: 'Allen Building',
    floor: 'First Floor',
    notes: 'End of the hallway by the stairs that lead to Allen 011 (Advisor officers)',
    products: ['Coca Cola', 'Diet Coke', 'Sprite', 'Mellow Yellow', 'Dr. Pepper', 'Diet Dr. Pepper', 'Lemonade', 'Lays Classic', 'Fritos Twists', 'Doritos Nacho Cheese', 'Sun Chips Garden Salsa', 'Lays Barbeque', 'Miss Vickies Spicy Dill Pickle Chips', 'Bugles Nacho Cheese', 'Ruffles Cheddar & Sour Cream', 'Popchips Sea Salt', 'Mini Pretzels', 'Cheetos', 'Smartfood White Cheddar Popcorn', 'Cheez It', 'Goldfish', 'Mini Cookies', 'Mike&Ike', 'Big Honey Bun', 'Black Forest Ftuit Snacks', 'Sour Skittles Gummies', 'Grilled Cheese Crackers', 'Skittles', 'Toasted Cheese Peanut Butter Crackers', 'Peanut Butter Crackers', 'Rice Krispies Treats', "Reese's Peanut Butter Cups", 'Nutra Grain', 'Ghiradelli Milk Chocolate Caramel', 'Snickers', 'M&Ms', 'KitKat', 'Clif Bar Chocolate Chip', 'Peanut M&Ms', "Reese's Sticks", 'Trail Mix', 'Gatorade Protein Bar', 'Nature Valley Granola Bar'] 
  },
  { 
    id: 21, 
    name: 'Social Sciences Vending Machine', 
    location: [36.001891, -78.937417], 
    building: 'Social Sciences Building',
    floor: 'First Floor',
    notes: 'Next to the lobby',
    products: ['Lays Classic', 'Fritos Twists', 'Doritos Nacho Cheese', 'Lays Barbeque', 'Doritos Cool Ranch', 'Cheetos', 'Bugles Original', 'Ruffles Cheddar & Sour Cream', 'Smartfood White Cheddar Popcorn', 'Sun Chipd Harvest Cheddar', 'Cheez It', 'Doritos Spicy Sweet Chili', 'Peanut Butter Crackers', 'Skittles', 'Toasted Cheese Peanut Butter Crackers', 'think Protein Bar', 'Trail Mix', "Reese's Peanut Butter Cups", 'Kinder Bueno', 'Slim Jim', 'Snickers', 'Peanut M&Ms', 'KitKat', 'Nutra Grain', 'Rice Krispies Treats', 'Gatorade Protein Bar', 'Mini Cookies', 'Big Honey Bun', 'Black Forest Fruit Snacks', 'Coca Cola', 'Diet Coke', 'Sprite', 'Mellow Yellow', 'Dr. Pepper', 'Diet Dr. Pepper', 'Fanta', 'Water'] 
  },
  { 
    id: 22, 
    name: 'West House Vending Machine', 
    location: [36.005988, -78.915344], 
    building: 'West House Residence Hall',
    floor: 'Basement',
    notes: "Go down the stairs on the far end of the first floor hallway. Door should be marked with 'laundry'",
    products: ['Lays Classic', 'Fritos Twists', 'Doritos Nacho Cheese', 'Sun Chips Harvest Cheddar', 'Bugles Nacho Cheese', 'Miss Vickies Spicy Dill Pickle Chips', 'Cheetos', 'Fritos Original', 'Ruffles Cheddar & Sour Cream', 'Mini Pretzels', 'Pop Tarts', 'Gardettos Snack Mix', 'Lays Sour Cream & Onion', 'Cheez It', 'Lays Salt & Vinegar', 'Nerds Gummy Clusters', 'Sour Skittles Gummies', 'Gushers', 'Beef Tender Bites', 'Grilled Cheese Crackers', 'Toasted Cheese Peanut Butter Crackers', 'Peanut Butter Crackers', 'Skittles', 'Butterfinger', "Reese's Peanut Butter Cups", 'Kit Kat', 'Twix', 'Peanut M&Ms', 'Snickers', 'Big Honey Bun', 'Classic Cookie', 'Small Cookies', 'Belvita', 'Coca Cola', 'Sprite', 'Water', 'Dr. Pepper', 'Fanta', 'Mellow Yellow', 'Diet Dr. Pepper', 'Cherry Coca Cola'] 
  },
  { 
    id: 23, 
    name: 'Marketplace Vending Machine', 
    location: [36.007479, -78.914067], 
    building: 'Eastern Union',
    floor: 'Bottom Floor',
    notes: "On the right side of Trinity cafe when you go down the stairs",
    products: ['Empty when I last checked :('] 
  },
  { 
    id: 24, 
    name: 'Pegram Vending Machine', 
    location: [36.008657, -78.915185], 
    building: 'Pegram Residence Hall',
    floor: 'Main Floor',
    notes: 'In the trash and recycling room',
    products: ['Lays Classic', 'Fritos Twists', 'Doritos Nacho Cheese', 'Smartfood White Cheddar Popcorn', 'Lays Barbeque', 'Ruffles Cheddar & Sour Cream', 'Lays Sour Cream & Onion', 'Fritos Original', 'Mini Pretzels', 'Pop Tarts', 'Sun Chips Harvest Cheddar', 'Gardettos Snack Mix', 'Cheez It', 'Miss Vickies Spicy Dill Pickle Chips', 'Grilled Cheese Crackers', 'Gushers', 'Toasted Cheese Peanut Butter Crackers', 'Peanut Butter Crackers', 'Trail Mix', 'Airheads Bites', 'Crunch', "Reese's Sticks", 'Peanut M&Ms', 'Snickers', 'Kit Kat', 'M&Ms', "Reese's Peanut Butter Cups", 'Gatorade Protein Bar', 'Rice Krispies Treats', 'Slim Jim', 'Nature Valley Almond Butter Biscuits', 'Skittles Gummies', 'Sour Skittles Gummies', 'Beef Tender Bites', 'Gushers', 'Mike&Ike', 'Coca Cola', 'Diet Coke', 'Sprite', 'Lemonade', 'Diet Dr. Pepper', 'Dr. Pepper', 'Fanta', 'Water', 'Vitamin Water'] 
  },
  { 
    id: 25, 
    name: 'Bassett Vending Machine', 
    location: [36.008817, -78.914192], 
    building: 'Bassett Residence Hall',
    floor: 'Main Floor',
    notes: 'Near the entrance on the left side',
    products: ['Starbucks Mocha Frappuccino', 'Starbucks Vanilla Frappuccino', 'Starbucks Caramel Frappuccino', 'Celsius', 'Pepsi', 'Zero Sugar Pepsi', 'Mountain Dew', 'Diet Mountain Dew', 'Water', 'Starry', 'Vitamin Water', 'Powerade', 'Lays Classic', 'Fritos Twists', 'Doritos Nacho Cheese', 'Cheetos', 'Mini Pretzels', 'Pop Tarts', 'Gardettos Snack Mix', 'Cheez It', 'Sour Skittles Gummies', 'Big Honey Bun', 'Classic Cookie', 'Beef Tender Bites', 'Grilled Cheese Crackers', 'Skittles', 'Toasted Cheese Peanut Butter Crackers', 'Nature Valley Cinnamon Almond Butter Biscuits', '3 Muskateers', "Reese's Peanut Butter Cups", 'Peanut M&Ms', 'Snickers', 'Slim Jim', 'Kit Kat', 'Clif Bar Chocolate Chip', 'Crunch', 'Rice Krispies Treat', 'Gatorade Protein Bar', 'Think! Protein Bar', 'Coca Cola', 'Diet Coke', 'Sprite', 'Fruit Punch', 'Dr. Pepper', 'Water', 'Mellow Yellow'] 
  },
  { 
    id: 26, 
    name: 'Brown Vending Machine', 
    location: [36.008200, -78.914258], 
    building: 'Brown Residence Hall',
    floor: 'Main Floor',
    notes: 'In the shared cleaning supplies area',
    products: ['Lays Classic', 'Fritos Twists', 'Doritos Nacho Cheese', 'Smartfood White Cheddar Popcorn', 'Sun Chips Harvest Cheddar', 'Lays Barbeque', 'Cheetos', 'Fritos Original', 'Ruffles Cheddar & Sour Cream', 'Mini Pretzels', 'Nerds Gummy Clusters', 'Pringles', 'Gardettos Snack Mix', 'Cheez It', 'Bugles Nacho Cheese', 'Peanut Butter Crackers', 'Skittles', 'Toasted Cheese Peanut Butter Crackers', 'Peanut Butter Crackers', 'Trail Mix', "Reese's Peanut Butter Cups", 'Slim Jim', 'Ghiradelli Milk Chocolate Caramel', 'Haribo Gummy Bears', 'Snickers', 'Peanut M&Ms', 'Kit Kat', 'Gatorade Protein Bar', 'Rice Krispies Treats', 'Airheads Bites', 'Crunch', '3 Muskateers', 'Nature Valley Granola Bar', 'Trolli Sour Gummy Worms', 'Big Honey Bun', 'Classic Cookie', 'Mini Gummy Worms', 'Sour Skittles Gummies', 'Coca Cola', 'Diet Coke', 'Sprite', 'Dr. Pepper', 'Lemonade', 'Fanta', 'Monster', 'Water'] 
  },
  { 
    id: 26, 
    name: 'Alspaugh Vending Machine', 
    location: [36.008118, -78.915083], 
    building: 'Alspaugh Residence Hall',
    floor: 'Main Floor',
    notes: "In its own little corner in the main hallway",
    products: ['Water', 'Powerade', 'Vitamin Water', 'Coca Cola', 'Sprite', 'Zero Sugar Coca Cola', 'Dr. Pepper', 'Diet Coke', 'Seagrams Ginger Ale', 'Snack vending machine was empty when I checked :('] 
  },
  { 
    id: 27, 
    name: 'Giles Vending Machine', 
    location: [36.007095, -78.915135], 
    building: 'Giles Residence Hall',
    floor: 'Main Floor',
    notes: "In the trash and recycling room",
    products: ['Lays Classic', 'Fritos Twists', 'Doritos Nacho Cheese', 'Doritos Spicy Sweet Chili', 'Doritos Cool Ranch', 'Sun Chips Harvest Cheddar', 'Lays Barbeque', 'Ruffles Cheddar & Sour Cream', 'Cheetos', 'Cheez It', 'Peanut Butter Crackers', 'Skittles', 'Toasted Cheese Peanut Butter Crackers', '3 Muskateers', "Reese's Peanut Butter Cups", 'Kit Kat', 'Haribo Gummy Bears', 'Snickers', 'Ghiradelli Milk Chocolate Caramel', 'Gatorade Protein Bar', 'Rice Krispies Treats', 'Peanut M&Ms', 'Nature Valley Granola Bar', 'Sour Skittles Gummies', 'Big Honey Bun', 'Jolly Ranchers Gummies Sours', 'Mike&Ike', 'Coca Cola', 'Diet Coke', 'Sprite', 'Mellow Yellow', 'Dr. Pepper', 'Diet Dr. Pepper', 'Water', 'Powerade'] 
  },
  { 
    id: 28, 
    name: 'Wilson Vending Machine', 
    location: [36.007084, -78.914196], 
    building: 'Wilson Residence Hall',
    floor: 'Main Floor',
    notes: "In the laundry room as soon as you enter from the main entrance",
    products: ['Coca Cola', 'Sprite', 'Seagrams Ginger Ale', 'Dr. Pepper', 'Diet Coke', 'Water', 'Pepsi', 'Diet Pepsi', 'Mountain Dew', 'Diet Mountain Dew', 'Lays Classic', 'Fritos Twists', 'Doritos Nacho Cheese', 'Bugles Nacho Cheese', 'Fritos Original', 'Ruffles Cheddar & Sour Cream', 'Mini Pretzels', 'Pop Tarts', 'Cheez It', 'Miss Vickies Spicy Dill Pickle Chips', 'Sour Skittles Gummies', 'Big Honey Bun', 'Gatorade Protein Bar', 'Mini Cookies', 'Beef Tender Bites', 'Gushers', 'Toasted Cheese Peanut Butter Crackers', 'Peanut Butter Crackers', 'Snickers', 'Peanut M&Ms', 'Ghiradelli Milk Chocolate Caramel', 'Slim Jim', 'Crunch', 'Nature Valley Granola Bar'] 
  },
  { 
    id: 29, 
    name: 'Classroom Building Vending Machine', 
    location: [36.006224, -78.915233], 
    building: 'Classroom Building',
    floor: 'Main Floor',
    notes: "Go to the left after entering the main door and around the corner, its in a small common room",
    products: ['Lays Classic', 'Fritos Twists', 'Doritos Nacho Cheese', 'Sun Chips Harvest Cheddar', 'Lays Barbeque', 'Doritos Cool Ranch', 'Cheetos', 'Fritos Original', 'Ruffles Cheddar & Sour Cream', 'Mini Pretzels', 'Pop Tarts', 'Gardettos Snack Mix', 'Cheez It', 'Peanut Butter Crackers', 'Toasted Cheese Peanut Butter Crackers', 'Nature Valley Cinnamon Almond Butter Biscuits', "Reese's Peanut Butter Cups", 'Nutra Grain', 'Peanut M&Ms', 'Ghiradelli Milk Chocolate Caramel', 'Snickers', 'Peanut M&Ms', 'Kit Kat', "Reese's Sticks", 'Rise Krispies Treats', 'Crunch', '3 Muskateers', 'Nature Valley Granola Bar', 'Sour Skittles Gummies', 'Gushers', 'Big Honey Bun', 'Black Forest Fruit Snacks', 'Classic Cookie', 'Vitamin Water', 'Orange Juice', 'Topo Chico', 'Dr. Pepper', 'Diet Coke', 'Coca Cola', 'Diet Dr. Pepper', 'Sprite', 'Water'] 
  },
];

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
  const searchInputRef = useRef(null);
  
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
  
  // Handle search functionality
  const handleSearch = (term) => {
    if (!term.trim()) {
      clearSearch();
      return;
    }
    
    setSearchTerm(term.toLowerCase());
    const results = [];
    const matchingMachines = [];
    
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
          matchingMachines.push(machine);
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
    }
    
    setSearchResults(results);
    setSearchPerformed(true);
    setVisibleMachines(matchingMachines);
    
    // Reset expanded categories
    setExpandedCategories({});
  };
  
  // Clear search function
  const clearSearch = () => {
    setSearchResults([]);
    setSearchPerformed(false);
    setSearchTerm('');
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