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
    'doritos flamin hot': '/images/products/doritos-flamin-hot.jpeg',

    // Lays
    'lays classic': '/images/products/lays-classic.webp',
    'lays barbeque': '/images/products/lays-barbeque.jpg',
    'lays sour cream & onion': '/images/products/lays-sour-cream-onion.webp',
    'lays salt & vinegar': '/images/products/lays-salt-vinegar.webp',
    
    // Cheetos
    'cheetos': '/images/products/cheetos.png',
    'cheetos cheddar jalepeno': '/images/products/cheetos-cheddar-jalapeno.jpeg',
    "chester's flamin hot fries": '/images/products/chesters.jpg',
    
    // Drinks
    'coca cola': '/images/products/coca-cola.webp',
    'diet coke': '/images/products/diet-coke.avif',
    'coke zero': '/images/products/coke-zero.webp',
    'pepsi': '/images/products/pepsi.webp',
    'pepsi zero sugar': '/images/products/pepsi-zero-sugar.webp',
    'mountain dew': '/images/products/moutain-dew.avif',
    'diet mountain dew': '/images/products/diet-mountain-dew.webp',
    'mountain dew zero sugar': '/images/products/mountain-dew-zero-sugar.webp',
    'baja blast mountain dew': '/images/products/baja-blast-mountain-dew.webp',
    'dr. pepper': '/images/products/dr-pepper.jpg',
    'diet dr. pepper': '/images/products/diet-dr-pepper.webp',
    'sprite': '/images/products/sprite.webp',
    'water': '/images/products/water.webp',
    'monster': '/images/products/monster.avif',
    'celsius': '/images/products/celsius.webp',
    'gatorade': '/images/products/gatorade.webp',
    'powerade': '/images/products/powerade.png',
    'vitamin water': '/images/products/vitamin-water.avif',
    'body armor': '/images/products/body-armor.webp',
    'fairlife core power': '/images/products/fairlife-core-power.webp',
    'topo chico': '/images/products/topo-chico.webp',
    'fanta': '/images/products/fanta.webp',
    'sprite zero sugar': '/images/products/sprite-zero-sugar.jpeg',
    'orange juice': '/images/products/orange-juice.webp',
    'cheerwine': '/images/products/cheerwine.jpeg',
    'rockstar energy': '/images/products/rockstar-energy.jpeg',
    'starbucks cold brew': '/images/products/starbucks-cold-brew.jpeg',
    'starbucks caramel frappuccino': '/images/products/starbucks-caramel-frappuccino.webp',
    'starbucks caramel cappuccino': '/images/products/starbucks-caramel-frappuccino.webp',
    'pure leaf sweet tea': '/images/products/pure-leaf-sweet-tea.jpeg',
    'gold peak sweet tea': '/images/products/gold-peak-sweet-tea.webp',
    'lipton citrus green tea': '/images/products/lipton-citrus-green-tea.jpeg',
    'schweppes ginger ale': '/images/products/schweppes-ginger-ale.jpeg',
    'propel': '/images/products/propel.jpeg',
    'mug root beer': '/images/products/mug-root-beer.webp',
    'gatorlyte': '/images/products/gatorlyte.webp',
    'starbucks mocha double shot': '/images/products/starbucks-double-shot.jpeg',
    'starbucks bold mocha triple shot': '/images/products/starbucks-bold-mocha-triple-shot.jpeg',
    'starbucks vanilla triple shot': '/images/products/starbucks-vanilla-triple-shot.webp',
    'starbucks dark caramel triple shot': '/images/products/starbucks-dark-caramel-triple-shot.jpeg',
    'starbucks strawberry acai': '/images/products/starbucks-strawberry-acai.jpeg',
    'starbucks mocha frappuccino': '/images/products/starbucks-mocha-frappuccino.jpeg',
    'starbucks mocha cappuccino': '/images/products/starbucks-mocha-frappuccino.jpeg',
    'starbucks vanilla frappuccino': '/images/products/starbucks-vanilla-frappuccino.jpeg',
    'mellow yellow': '/images/products/mellow-yellow.jpeg',
    'lemonade': '/images/products/lemonade.webp',
    'apple juice': '/images/products/apple-juice.webp',
    'strawberry grape juice': '/images/products/strawberry-grape-juice.jpeg',
    'starry': '/images/products/starry.jpeg',
    'fruit punch': '/images/products/fruit-punch.jpeg',
    'sunkist strawberry': '/images/products/sunkist-strawberry.jpeg',


    // Candy & Sweets
    'snickers': '/images/products/snickers.png',
    'kitkat': '/images/products/kitkat.jpeg',
    "reese's peanut butter cups": '/images/products/reeses-peanut-butter-cups.avif',
    'twix': '/images/products/twix.webp',
    'oreos': '/images/products/oreos.webp',
    'm&ms': '/images/products/mms.webp',
    'peanut m&ms': '/images/products/peanut-mms.webp',
    'skittles': '/images/products/skittles.jpeg',
    'butterfinger': '/images/products/butterfinger.jpeg',
    'crunch': '/images/products/crunch.png',
    'kinder bueno': '/images/products/kinder-bueno.jpeg',
    'haribo gummy bears': '/images/products/haribo-gummy-bears.webp',
    '3 muskateers': '/images/products/3-muskateers.webp',
    'gushers': '/images/products/gushers.webp',
    'black forest fruit snacks': '/images/products/black-forest-fruit-snacks.webp',
    'ghirardelli milk chocolate caramel': '/images/products/ghirardelli-milk-chocolate-caramel.jpeg',
    'nerds gummy clusters': '/images/products/nerds-gummy-clusters.webp',
    'trolli sour gummy worms': '/images/products/trolli-sour-gummy-worms.jpeg',
    'mini gummy worms': '/images/products/mini-gummy-worms.webp',
    'payday': '/images/products/payday.png',
    'sour patch kids': '/images/products/sour-patch-kids.jpeg',
    'skittles gummies': '/images/products/skittles-gummies.webp',
    'sour skittles gummies': '/images/products/sour-skittles-gummies.webp',
    'wild berry skittles gummies': '/images/products/skittles-wild-berry-gummies.webp',
    "hershey's chocolate bar": '/images/products/hersheys-chocolate-bar.jpeg',
    'jolly rancher sour gummies': '/images/products/jolly-rancher-sour-gummies.jpeg',
    'airheads bites': '/images/products/airheads-bites.jpeg',
    "reese's fast break": '/images/products/reeses-fast-break.jpeg',
    'mike&ike': '/images/products/mike-ike.jpeg',
    "reese's sticks": '/images/products/reeses-stick.jpeg',

    
    // Other snacks
    'fritos original': '/images/products/fritos-original.jpg',
    'fritos twists': '/images/products/fritos-twists.jpg',
    'cheez it': '/images/products/cheez-it.jpg',
    'sun chips harvest cheddar': '/images/products/sun-chips-harvest-cheddar.jpg',
    'sun chips garden salsa': '/images/products/sun-chips-garden-salsa.jpg',
    'popchips sea salt': '/images/products/popchips-sea-salt.jpg',
    'popchips sour cream & onion': '/images/products/popchips-sour-cream-onion.webp',
    'ruffles cheddar & sour cream': '/images/products/ruffles-cheddar-sour-cream.jpeg',
    'funyuns': '/images/products/funyuns.jpg',
    'gardettos snack mix': '/images/products/gardettos-snack-mix.webp',
    'chex mix': '/images/products/chex-mix.webp',
    'smartfood white cheddar popcorn': '/images/products/smartfood-white-cheddar-popcorn.jpeg',
    'mini pretzels': '/images/products/mini-pretzels.webp',
    'goldfish': '/images/products/goldfish.jpeg',
    'bugles nacho cheese': '/images/products/bugles-nacho-cheese.jpeg',
    'veggie straws': '/images/products/veggie-straws.jpeg',
    "miss vickie's spicy dill pickle chips": '/images/products/miss-vickies-spicy-dill-pickle-chips.jpeg',
    'pringles': '/images/products/pringles.jpeg',
    'pop tarts': '/images/products/pop-tarts.png',
    'rice krispies treats': '/images/products/rice-krispies-treats.jpg',
    'nature valley granola bar': '/images/products/nature-valley-granola-bar.webp',
    'clif bar chocolate chip': '/images/products/clif-bar-chocolate-chip.webp',
    'gatorade protein bar': '/images/products/gatorade-protein-bar.webp',
    'trail mix': '/images/products/trail-mix.webp',
    'cashews': '/images/products/cashews.webp',
    'roasted & salted almonds': '/images/products/roasted-salted-almonds.webp',
    'pistachios': '/images/products/pistachios.webp',
    'beef tender bites': '/images/products/beef-tender-bites.webp',
    'slim jim': '/images/products/slim-jim.png',
    'big honey bun': '/images/products/big-honey-bun.jpeg',
    'nature valley peanut butter granola bar': '/images/products/nature-valley-peanut-butter-granola-bar.webp',
    'peanut butter crackers': '/images/products/peanut-butter-crackers.jpeg',
    'toasted cheese peanut butter crackers': 'images/products/toasted-cheese-peanut-butter-crackers.jpeg',
    'tubs bar-b-que pork rinds': 'images/products/barbeque-pork-rinds.webp',
    'think! protein bar': 'images/products/think-protein-bar.webp',
    'belvita': 'images/products/belvita.webp',
    'classic cookie': 'images/products/classic-cookie.jpeg',
    'mini cookies': 'images/products/bite-sized-cookies.jpeg',
    'grilled cheese crackers': 'images/products/grilled-cheese-crackers.jpeg',
    'nature valley almond butter biscuits': 'images/products/almond-butter-biscuits.webp',
    'bugles original': '/images/products/bugles-original.jpeg',
    'chicken salad and crackers': 'images/products/chicken-salad-and-crackers.webp',
    'nutra grain': 'images/products/nutra-grain.jpeg',
    'tuna salad': 'images/products/tuna-salad.jpeg',
    'kettle corn popcorners': '/images/products/popcorners_kettle.avif'
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

// Add building image support
const buildingImageMap = {
    'randolphresidencehall': '/images/buildings/randolph.jpg',
    'alspaughresidencehall': '/images/buildings/alspaughresidencehall.jpg',
    'bassetresidencehall': '/images/buildings/bassetresidencehall.jpeg',
    'blackwellresidencehall': '/images/buildings/blackwellresidencehall.jpeg',
    'brodierecreationcenter': '/images/buildings/brodierecreationcenter.jpeg',
    'gilbertaddomsresidencehall': '/images/buildings/gilbertaddomsresidencehall.jpg',
    'gilesresidencehall': '/images/buildings/gilesresidencehall.jpg',
    'easternunion': '/images/buildings/marketplace.jpg',
    'pegramresidencehall': '/images/buildings/pegramresidencehall.jpeg',
    'southgateresidencehall': '/images/buildings/southgateresidencehall.jpg',
    'trinityresidencehall': '/images/buildings/trinityresidencehall.jpg',
    'wilsonresidencehall': '/images/buildings/wilsonresidencehall.jpg',
    'broadheadcenter': '/images/buildings/wu.jpg',
    'westdukebuilding': '/images/buildings/westduke.jpg',
    'bryancenter': '/images/buildings/bc.jpeg',
    'westhouseresidencehall': '/images/buildings/westhouse.jpg',
    'classroombuilding': '/images/buildings/classroom.jpg',
    'brownresidencehall': '/images/buildings/brown.jpeg',
    'perkinslibrary': '/images/buildings/perkins.jpeg',
    'socialsciencesbuilding': '/images/buildings/socialsciences.png',
    'allenbuilding': '/images/buildings/allen.jpeg',
    'reubencookebuilding': '/images/buildings/reubencooke.jpeg',
    'belltowerresidencehall': '/images/buildings/belltower.jpeg',
    'flowersbuilding': '/images/buildings/flowers.jpg',
    'teerbuilding': '/images/buildings/teer.jpg',
    'physicsbuilding': '/images/buildings/physics.jpeg',
    'wilsonrecreationcenter': '/images/buildings/wilsongym.jpeg',
    'levinescienceresearchcenter': '/images/buildings/lsrc.jpg',
    'wilkinson': '/images/buildings/wilk.jpeg',
    'fewresidencehall': '/images/buildings/few.jpg',
    'cravenresidencehall': '/images/buildings/craven.jpg',

};

export const getBuildingImage = (buildingName) => {
  if (!buildingName) return '/images/buildings/default-building.jpg';
  const normalized = buildingName.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (buildingImageMap[normalized]) {
    return buildingImageMap[normalized];
  }
  // Try partial match
  for (const [key, imagePath] of Object.entries(buildingImageMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return imagePath;
    }
  }
  return '/images/buildings/default-building.jpg';
}; 