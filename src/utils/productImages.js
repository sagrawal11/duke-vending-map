// Product image mapping utility
// This maps product names to their corresponding image files
// Images should be placed in public/images/products/

export const getProductImage = (productName) => {
  // Normalize the product name for consistent matching
  const normalizedName = productName.toLowerCase().trim();
  
  // Product image mapping - add your image mappings here
  const productImageMap = {
    // Doritos
    'doritos nacho cheese': '/images/products/doritos-nacho-cheese.jpg',
    'doritos cool ranch': '/images/products/doritos-cool-ranch.webp',
    'doritos spicy sweet chili': '/images/products/doritos-spicy-sweet-chili.jpg',
    'doritos flamin hot cool ranch': '/images/products/doritos-flamin-hot-cool-ranch.webp',
    
    // Lays
    'lays classic': '/images/products/lays-classic.webp',
    'lays barbecue': '/images/products/lays-barbecue.jpg',
    'lays sour cream & onion': '/images/products/lays-sour-cream-onion.webp',
    'lays salt & vinegar': '/images/products/lays-salt-vinegar.webp',
    
    // Cheetos
    'cheetos': '/images/products/cheetos.png',
    'cheetos cheddar jalepeno': '/images/products/cheetos-cheddar-jalapeno.jpeg',
    
    // Drinks
    'coca cola': '/images/products/coca-cola.jpg',
    'diet coke': '/images/products/diet-coke.jpg',
    'coke zero': '/images/products/coke-zero.jpg',
    'pepsi': '/images/products/pepsi.jpg',
    'pepsi zero sugar': '/images/products/pepsi-zero-sugar.jpg',
    'mountain dew': '/images/products/mountain-dew.jpg',
    'diet mountain dew': '/images/products/diet-mountain-dew.jpg',
    'baja blast mountain dew': '/images/products/baja-blast-mountain-dew.jpg',
    'dr. pepper': '/images/products/dr-pepper.jpg',
    'diet dr. pepper': '/images/products/diet-dr-pepper.jpg',
    'sprite': '/images/products/sprite.jpg',
    'water': '/images/products/water.jpg',
    'monster': '/images/products/monster.jpg',
    'celsius': '/images/products/celsius.jpg',
    'gatorade': '/images/products/gatorade.jpg',
    'powerade': '/images/products/powerade.jpg',
    'vitamin water': '/images/products/vitamin-water.jpg',
    
    // Candy & Sweets
    'snickers': '/images/products/snickers.jpg',
    'kitkat': '/images/products/kitkat.jpg',
    "reese's peanut butter cups": '/images/products/reeses-peanut-butter-cups.jpg',
    'twix': '/images/products/twix.jpg',
    'oreos': '/images/products/oreos.jpg',
    'm&ms': '/images/products/mms.jpg',
    'peanut m&ms': '/images/products/peanut-mms.jpg',
    'skittles': '/images/products/skittles.jpg',
    'butterfinger': '/images/products/butterfinger.jpg',
    'crunch': '/images/products/crunch.jpg',
    'kinder bueno': '/images/products/kinder-bueno.jpg',
    'haribo gummy bears': '/images/products/haribo-gummy-bears.jpg',
    
    // Other snacks
    'fritos original': '/images/products/fritos-original.jpg',
    'fritos twists': '/images/products/fritos-twists.jpg',
    'cheez it': '/images/products/cheez-it.jpg',
    'sun chips harvest cheddar': '/images/products/sun-chips-harvest-cheddar.jpg',
    'sun chips garden salsa': '/images/products/sun-chips-garden-salsa.jpg',
    'popchips sea salt': '/images/products/popchips-sea-salt.jpg',
    'popchips sour cream & onion': '/images/products/popchips-sour-cream-onion.jpg',
    'popchips sour cream and onion': '/images/products/popchips-sour-cream-onion.jpg',
    'ruffles cheddar & sour cream': '/images/products/ruffles-cheddar-sour-cream.jpg',
    'funyuns': '/images/products/funyuns.jpg',
    'gardettos snack mix': '/images/products/gardettos-snack-mix.jpg',
    'chex mix': '/images/products/chex-mix.jpg',
    'smartfood white cheddar popcorn': '/images/products/smartfood-white-cheddar-popcorn.jpg',
    'white cheddar popcorn': '/images/products/smartfood-white-cheddar-popcorn.jpg',
    'mini pretzels': '/images/products/mini-pretzels.jpg',
    'goldfish': '/images/products/goldfish.jpg',
    'bugles nacho cheese': '/images/products/bugles-nacho-cheese.jpg',
    'veggie straws': '/images/products/veggie-straws.jpg',
    "miss vickie's spicy dill pickle chips": '/images/products/miss-vickies-spicy-dill-pickle-chips.jpg',
    'pringles': '/images/products/pringles.jpg',
    'pop tarts': '/images/products/pop-tarts.jpg',
    'rice krispies treats': '/images/products/rice-krispies-treats.jpg',
    'nature valley granola bar': '/images/products/nature-valley-granola-bar.jpg',
    'clif bar chocolate chip': '/images/products/clif-bar-chocolate-chip.jpg',
    'gatorade protein bar': '/images/products/gatorade-protein-bar.jpg',
    'trail mix': '/images/products/trail-mix.jpg',
    'cashews': '/images/products/cashews.jpg',
    'roasted & salted almonds': '/images/products/roasted-salted-almonds.jpg',
    'pistachios': '/images/products/pistachios.jpg',
    
    // Add more mappings as you upload images...
  };
  
  // Try to find an exact match first
  if (productImageMap[normalizedName]) {
    return productImageMap[normalizedName];
  }
  
  // Try to find a partial match
  for (const [key, imagePath] of Object.entries(productImageMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return imagePath;
    }
  }
  
  // Return a default/placeholder image if no match found
  return '/images/products/default-product.jpg';
};

// Check if an image exists (for error handling)
export const imageExists = (imagePath) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imagePath;
  });
};

// Get a fallback image if the main image doesn't exist
export const getFallbackImage = (productName) => {
  // You can add category-based fallback images here
  const normalizedName = productName.toLowerCase();
  
  if (normalizedName.includes('doritos')) return '/images/products/doritos-default.jpg';
  if (normalizedName.includes('lays')) return '/images/products/lays-default.jpg';
  if (normalizedName.includes('cheetos')) return '/images/products/cheetos-default.jpg';
  if (normalizedName.includes('coca') || normalizedName.includes('pepsi') || normalizedName.includes('mountain dew')) {
    return '/images/products/soda-default.jpg';
  }
  if (normalizedName.includes('water') || normalizedName.includes('gatorade') || normalizedName.includes('powerade')) {
    return '/images/products/drink-default.jpg';
  }
  if (normalizedName.includes('snickers') || normalizedName.includes('reese') || normalizedName.includes('kitkat')) {
    return '/images/products/candy-default.jpg';
  }
  
  return '/images/products/default-product.jpg';
}; 