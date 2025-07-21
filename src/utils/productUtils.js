import { vendingMachines } from '../data/vendingMachines';

// Product aliases - mapping alternative names to the actual product names
const createProductAliases = () => {
  return {
    // Doritos variations
    "purple doritos": "doritos spicy sweet chili",
    "spicy sweet chili doritos": "doritos spicy sweet chili",
    "spicy doritos": "doritos spicy sweet chili",
    "sweet chili doritos": "doritos spicy sweet chili",

    "red doritos": "doritos nacho cheese",
    "orange doritos": "doritos nacho cheese",
    "nacho cheese doritos": "doritos nacho cheese",
    "classic doritos": "doritos nacho cheese",
    "cheese doritos": "doritos nacho cheese",
    "nacho doritos": "doritos nacho cheese",

    "blue doritos": "doritos cool ranch",
    "cool ranch doritos": "doritos cool ranch",
    "ranch doritos": "doritos cool ranch",
    
    // Lays variations
    "classic lays": "lays classic",
    "original lays": "lays classic",
    "regular lays": "lays classic",

    "bbq lays": "lays barbecue",
    "lays bbq": "lays barbecue",
    "barbecue lays": "lays barbecue",

    "sour cream and onion lays": "lays sour cream & onion",
    "lays sour cream and onion": "lays sour cream & onion",
    "sour cream & onion lays": "lays sour cream & onion",

    "salt and vinegar lays": "lays salt & vinegar",
    "lays salt and vinegar": "lays salt & vinegar",
    "salt & vinegar lays": "lays salt & vinegar",
    "salt lays": "lays salt & vinegar",

    // Cheetos variations
    "regular cheetos": "cheetos",
    "original cheetos": "cheetos",

    "spicy cheetos": "cheetos cheddar jalepeno",
    "hot cheetos": "cheetos cheddar jalepeno",
    "cheetos cheddar & jalepeno": "cheetos cheddar jalepeno",
    "cheetos cheddar and jalepeno": "cheetos cheddar jalepeno",
    "cheddar and jalepeno cheetos": "cheetos cheddar jalepeno",
    "cheddar & jalepeno cheetos": "cheetos cheddar jalepeno",

    // Drinks
    "coke": "coca cola",
    "coca-cola": "coca cola",
    "classic coke": "coca cola",
  
    "diet coca cola": "diet coke",
    "coca cola zero": "coke zero",

    "mtn dew": "mountain dew",
    "dew": "mountain dew",
    "dr pepper": "dr. pepper",
    "doctor pepper": "dr. pepper",
    
    // Candy
    "reeses": "reese's peanut butter cups",
    "reeses cups": "reese's peanut butter cups",
    "reeses peanut butter cups": "reese's peanut butter cups",
    "reese's cups": "reese's peanut butter cups",
    "peanut butter cups": "reese's peanut butter cups",
    "chocolate peanut butter cups": "reese's peanut butter cups",

    "kit kat": "kitkat",
    "kit-kat": "kitkat",
    "snicker's": "snickers",
  };
};

// Normalize product names for better matching
const normalizeProductName = (product) => {
  return product
    .toLowerCase()
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/[&]/g, 'and') // Replace & with 'and'
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

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

// Filter products based on search term
export const getProductSuggestions = (searchTerm, maxResults = 8) => {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return [];
  }
  
  const allProducts = getAllUniqueProducts();
  const productAliases = createProductAliases();
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  // First, find exact matches (case-insensitive)
  const exactMatches = allProducts.filter(product => 
    product.toLowerCase().includes(normalizedSearch)
  );
  
  // Then find partial matches
  const partialMatches = allProducts.filter(product => {
    const normalizedProduct = product.toLowerCase();
    const words = normalizedProduct.split(' ');
    return words.some(word => word.startsWith(normalizedSearch));
  });
  
  // Check if search term matches any aliases
  const aliasMatches = [];
  Object.entries(productAliases).forEach(([alias, canonical]) => {
    if (alias.toLowerCase().includes(normalizedSearch)) {
      // Find the actual product name in our list
      const actualProduct = allProducts.find(product => 
        normalizeProductName(product) === normalizeProductName(canonical)
      );
      if (actualProduct && !aliasMatches.includes(actualProduct)) {
        aliasMatches.push(actualProduct);
      }
    }
  });
  
  // Combine and deduplicate, prioritizing exact matches, then alias matches, then partial matches
  const combined = [...new Set([...exactMatches, ...aliasMatches, ...partialMatches])];
  
  return combined.slice(0, maxResults);
}; 