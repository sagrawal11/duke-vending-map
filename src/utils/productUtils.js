import { vendingMachines } from '../data/vendingMachines';
import { calculateDistance } from './distance';





// Get all unique products from all vending machines
export const getAllUniqueProducts = () => {
  const allProducts = new Set();
  // Only add actual products from vending machines
  vendingMachines.forEach(machine => {
    machine.products.forEach(product => {
      // Skip empty or placeholder products
      if (product && !product.includes('Empty when I last checked') && !product.includes('Snack vending machine was empty')) {
        allProducts.add(product);
      }
    });
  });
  // Do NOT add aliases to the autocomplete pool
  return Array.from(allProducts).sort();
};

// Get all unique building names from vending machines
export const getAllUniqueBuildings = () => {
  const allBuildings = new Set();
  vendingMachines.forEach(machine => {
    if (machine.building) {
      allBuildings.add(machine.building);
    }
  });
  return Array.from(allBuildings).sort();
};

// Filter products and buildings based on search term
export const getSuggestions = (searchTerm, maxResults = 8) => {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return [];
  }
  const normalizedSearch = searchTerm.toLowerCase().trim();
  // Product suggestions
  const allProducts = getAllUniqueProducts();
  const productSuggestions = allProducts.filter(product =>
    product.toLowerCase().includes(normalizedSearch)
  ).map(product => ({ type: 'product', value: product }));
  // Building suggestions
  const allBuildings = getAllUniqueBuildings();
  let buildingSuggestions = allBuildings.filter(building =>
    building.toLowerCase().includes(normalizedSearch)
  ).map(building => ({ type: 'building', value: building }));
  // Alias support: if the search term matches an alias, add the canonical building as a suggestion
  if (buildingAliases[normalizedSearch]) {
    const canonical = buildingAliases[normalizedSearch];
    // Only add if not already present
    if (!buildingSuggestions.some(s => s.value === canonical)) {
      buildingSuggestions.unshift({
        type: 'building',
        value: canonical,
        alias: normalizedSearch
      });
    }
  }
  // Combine and limit
  const combined = [...productSuggestions, ...buildingSuggestions].slice(0, maxResults);
  return combined;
};

// Building aliases for Duke
const buildingAliases = {
  'wu': 'Broadhead Center',
  'broadhead': 'Broadhead Center',
  'broadhead center': 'Broadhead Center',
  'west dining hall': 'Broadhead Center',
  'lsrc': 'Levine Science Research Center',
  'levine': 'Levine Science Research Center',
  'levine science research center': 'Levine Science Research Center',
  'bc': 'Bryan Center',
  'bryan': 'Bryan Center',
  'bryan center': 'Bryan Center',
  'marketplace': 'Eastern Union',
  'east dining hall': 'Eastern Union',
};

function normalizeBuildingSearchTerm(term) {
  const normalized = term.toLowerCase().trim();
  return buildingAliases[normalized] || term;
}

// Enhanced searchByLocation: prefer exact match if available, with alias support
export const searchByLocation = (locationTerm, userLocation) => {
  const canonicalTerm = normalizeBuildingSearchTerm(locationTerm);
  const normalizedTerm = canonicalTerm.toLowerCase().trim();
  const allBuildings = getAllUniqueBuildings();
  // Check for exact match
  const exactBuilding = allBuildings.find(
    b => b.toLowerCase().trim() === normalizedTerm
  );
  let results = [];
  if (exactBuilding) {
    // Only return machines for the exact building
    results = vendingMachines.filter(machine =>
      machine.building.toLowerCase().trim() === normalizedTerm
    ).map(machine => ({
      machine,
      products: machine.products,
      searchType: 'location',
      relevanceScore: 1
    }));
  } else {
    // Fallback to partial match
    results = vendingMachines.filter(machine =>
      machine.building.toLowerCase().includes(normalizedTerm)
    ).map(machine => ({
      machine,
      products: machine.products,
      searchType: 'location',
      relevanceScore: 1
    }));
  }
  if (userLocation) {
    results.forEach(result => {
      result.distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        result.machine.location[0],
        result.machine.location[1]
      );
    });
    results.sort((a, b) => a.distance - b.distance);
  }
  return {
    results,
    searchType: 'location'
  };
}; 