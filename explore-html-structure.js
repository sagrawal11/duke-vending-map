// Script to explore the actual HTML structure of Duke calendar events
const fetch = require('node-fetch').default;

async function exploreHTMLStructure() {
  console.log('🔍 Exploring Duke Calendar HTML Structure\n');
  
  try {
    // Get the HTML content
    const calendarUrl = 'https://calendar.duke.edu/index?cf%5B%5D=Free+Food+and+Beverages';
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(calendarUrl)}`;
    
    const response = await fetch(proxyUrl);
    const data = await response.json();
    const htmlContent = data.contents;
    
    // Parse with JSDOM
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(htmlContent);
    const doc = dom.window.document;
    
    // Find all .event elements
    const eventElements = doc.querySelectorAll('.event');
    console.log(`Found ${eventElements.length} .event elements\n`);
    
    // Explore the first few events in detail
    for (let i = 0; i < Math.min(3, eventElements.length); i++) {
      const element = eventElements[i];
      console.log(`=== EVENT ${i + 1} ===`);
      console.log('Full HTML:');
      console.log(element.outerHTML);
      console.log('\n---\n');
      
      // Look for any text content
      console.log('Text content:');
      console.log(element.textContent.trim());
      console.log('\n---\n');
      
      // Look for all child elements
      console.log('Child elements:');
      const children = element.children;
      for (let j = 0; j < children.length; j++) {
        const child = children[j];
        console.log(`  ${j + 1}. <${child.tagName.toLowerCase()}> class="${child.className}"`);
        if (child.textContent.trim()) {
          console.log(`     Text: "${child.textContent.trim().substring(0, 100)}..."`);
        }
        if (child.attributes) {
          for (let attr of child.attributes) {
            if (attr.name !== 'class') {
              console.log(`     ${attr.name}: "${attr.value}"`);
            }
          }
        }
      }
      console.log('\n' + '='.repeat(50) + '\n');
    }
    
    // Look for patterns in the broader HTML structure
    console.log('🔍 Looking for event-related patterns in the broader HTML...\n');
    
    // Check for any elements that might contain event data
    const possibleEventData = doc.querySelectorAll('[class*="title"], [class*="date"], [class*="time"], [class*="location"], [class*="description"]');
    console.log(`Found ${possibleEventData.length} elements with event-related classes:`);
    
    for (let i = 0; i < Math.min(10, possibleEventData.length); i++) {
      const el = possibleEventData[i];
      console.log(`  ${i + 1}. <${el.tagName.toLowerCase()}> class="${el.className}"`);
      console.log(`     Text: "${el.textContent.trim().substring(0, 80)}..."`);
    }
    
    // Look for any script tags that might contain event data
    console.log('\n🔍 Looking for script tags with event data...\n');
    const scripts = doc.querySelectorAll('script');
    let foundEventData = false;
    
    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];
      const content = script.textContent;
      if (content.includes('event') || content.includes('title') || content.includes('date')) {
        console.log(`Script ${i + 1} contains event-related data:`);
        console.log(content.substring(0, 500) + '...');
        foundEventData = true;
        break;
      }
    }
    
    if (!foundEventData) {
      console.log('No event data found in script tags');
    }
    
    console.log('\n🎯 HTML structure exploration completed!');
    
  } catch (error) {
    console.error('❌ Exploration failed:', error.message);
  }
}

// Run the exploration
exploreHTMLStructure();
