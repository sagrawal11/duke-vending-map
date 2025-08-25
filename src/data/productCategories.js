// Product categorization function
export const categorizeProduct = (product) => {
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
        lowerProduct.includes('fruit punch') ||
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
      return 'Sodas & Drinks';
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
        lowerProduct.includes('chester') ||
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
        lowerProduct.includes('rice krispies treats') || 
        lowerProduct.includes('muska') || 
        lowerProduct.includes('kinder') || 
        lowerProduct.includes('Pop') || 
        lowerProduct.includes('haribo') || 
        lowerProduct.includes('cookie') || 
        lowerProduct.includes('m&m') || 
        lowerProduct.includes('payday') || 
        lowerProduct.includes('candy') || 
        lowerProduct.includes('ghirardelli') || 
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
  export const groupProductsByCategory = (products) => {
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