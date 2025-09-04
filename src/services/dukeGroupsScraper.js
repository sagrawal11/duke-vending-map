// University Calendar Scraper Service
// This service fetches free food events from the university calendar


// Function to fetch free food events
export const fetchFreeFoodEvents = async () => {
  try {
    console.log('Fetching free food events from University Calendar...');
    
    const scrapedEvents = await scrapeUniversityCalendar();
    
    if (scrapedEvents && scrapedEvents.length > 0) {
      console.log(`Successfully scraped ${scrapedEvents.length} events`);
      return scrapedEvents;
    } else {
      console.log('No events found from scraping');
      return [];
    }
    
  } catch (error) {
    console.error('Error fetching free food events:', error);
    throw new Error('Failed to fetch free food events');
  }
};

// Function to scrape university calendar
export const scrapeUniversityCalendar = async () => {
  try {
    // Duke calendar URL for free food events
    const calendarUrl = 'https://calendar.duke.edu/index?cf%5B%5D=Free+Food+and+Beverages';
    
    console.log('Scraping calendar URL:', calendarUrl);
    
    // Try different CORS proxies (tested and working)
    const proxies = [
      `https://api.allorigins.win/get?url=${encodeURIComponent(calendarUrl)}`,
      `https://cors-anywhere.herokuapp.com/${calendarUrl}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(calendarUrl)}`
    ];
    
    let htmlContent = null;
    
    for (let i = 0; i < proxies.length; i++) {
      const proxyUrl = proxies[i];
      console.log(`Trying proxy ${i + 1}/${proxies.length}...`);
      
      try {
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
          console.log(`Proxy ${i + 1} failed with status: ${response.status}`);
          continue;
        }
        
        console.log(`Proxy ${i + 1} successful!`);
        
        // Try to parse as JSON first (allorigins format)
        const responseText = await response.text();
        try {
          const data = JSON.parse(responseText);
          htmlContent = data.contents;
        } catch (jsonError) {
          // If JSON parsing fails, use the text directly (direct HTML)
          htmlContent = responseText;
        }
        break;
        
      } catch (error) {
        console.log(`Proxy ${i + 1} failed: ${error.message}`);
        continue;
      }
    }
    
    if (!htmlContent) {
      throw new Error('All CORS proxies failed');
    }
    
    console.log(`Successfully fetched HTML content (${htmlContent.length} characters)`);
    
    // Parse the HTML content to extract events
    const events = parseEventData(htmlContent);
    
    console.log(`Parsed ${events.length} events from calendar`);
    return events;
    
  } catch (error) {
    console.error('Error scraping university calendar:', error);
    throw error;
  }
};

// Function to parse event data from university calendar HTML
export const parseEventData = (htmlContent) => {
  try {
    // Create a temporary DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    const events = [];
    const seenEvents = new Set(); // To prevent duplicates based on all event data
    
    // Look for actual event titles - Duke calendar uses .event-title for the real data
    const eventSelectors = [
      '.event-title',
      'h2.event-title',
      '[class*="event-title"]',
      '.event-item',
      '.calendar-event', 
      '.event'
    ];
    
    let eventElements = [];
    for (const selector of eventSelectors) {
      const elements = doc.querySelectorAll(selector);
      if (elements.length > 0) {
        eventElements = elements;
        console.log(`Found ${elements.length} events using selector: ${selector}`);
        break;
      }
    }
    
    // Parse each event element
    eventElements.forEach(element => {
      const event = extractEventFromElement(element);
      if (event && event.date) {
        const eventId = createEventId(event);
        if (!seenEvents.has(eventId) && isFutureEvent(event.date)) {
          // Only add if it's a future event with a valid date and not a duplicate
          events.push(event);
          seenEvents.add(eventId);
        }
      }
    });
    
    // If no events found with specific selectors, try a more targeted approach
    if (events.length === 0) {
      console.log('No events found with specific selectors, trying targeted approach...');
      const targetedEvents = extractEventsFromTargetedHTML(doc);
      targetedEvents.forEach(event => {
        if (event.date) {
          const eventId = createEventId(event);
          if (!seenEvents.has(eventId) && isFutureEvent(event.date)) {
            events.push(event);
            seenEvents.add(eventId);
          }
        }
      });
    }
    
    // Sort events by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    console.log(`Found ${events.length} unique future free food events from calendar`);
    return events;
    
  } catch (error) {
    console.error('Error parsing HTML content:', error);
    return [];
  }
};

// Helper function to extract event data from a DOM element
const extractEventFromElement = (element) => {
  try {
    // For .event-title elements, the title is the element itself
    let title = '';
    if (element.classList.contains('event-title')) {
      title = element.textContent?.trim();
    } else {
      title = element.querySelector('h3, h4, .event-title, .title, a')?.textContent?.trim();
    }
    
    if (!title) return null;
    
    // Look for related data in the same container - Duke calendar has specific structure
    const container = element.closest('div[class*="col-"], .event-container, .event-item') || element.parentElement;
    
    // Extract sponsor from .event-sponsor div
    const sponsorElement = container?.querySelector('.event-sponsor a');
    const sponsor = sponsorElement?.textContent?.trim() || '';
    
    // Extract date from .event-container with itemprop="date"
    const dateElement = container?.querySelector('.event-container[itemprop="date"] .featured-info, .event-container div[itemprop="date"]');
    const date = dateElement?.textContent?.trim() || '';
    
    // Extract time from .event-container with itemprop="time"
    const timeElement = container?.querySelector('.event-container[itemprop="time"] .featured-info, .event-container div[itemprop="time"]');
    const time = timeElement?.textContent?.trim() || '';
    
    // Extract location from .event-container with itemprop="location"
    const locationElement = container?.querySelector('.event-container[itemprop="location"] .featured-info a, .event-container div[itemprop="location"] a');
    const location = locationElement?.textContent?.trim() || '';
    
    // Extract description (if available)
    const description = container?.querySelector('.description, .summary, .event-description, .event-summary')?.textContent?.trim() || '';
    
    // If we still don't have date/time, try to extract from the title or description
    let extractedDate = parseDate(date);
    let extractedTime = time;
    
    if (!extractedDate) {
      // Try to extract date from title or description
      const dateMatch = (title + ' ' + description).match(/(\w+day,?\s+\w+\s+\d{1,2})|(\d{1,2}\/\d{1,2}\/\d{4})|(\w+\s+\d{1,2},?\s+\d{4})/i);
      if (dateMatch) {
        extractedDate = parseDate(dateMatch[0]);
      }
    }
    
    if (!extractedTime) {
      // Try to extract time from title or description
      const timeMatch = (title + ' ' + description).match(/(\d{1,2}:\d{2}\s*[ap]m)|(\d{1,2}-\d{1,2}pm)|(\d{1,2}pm)/i);
      if (timeMatch) {
        extractedTime = timeMatch[0];
      }
    }
    
    return {
      id: Date.now() + Math.random(),
      title: title,
      description: description,
      location: location,
      date: extractedDate,
      time: extractedTime,
      sponsor: sponsor,
      type: getEventType(title, description)
    };
  } catch (error) {
    console.error('Error extracting event from element:', error);
    return null;
  }
};

// Helper function to create a unique identifier for an event
const createEventId = (event) => {
  // Create a unique ID based on all event data
  return `${event.title}|${event.date}|${event.time}|${event.location}|${event.sponsor}`.toLowerCase().trim();
};

// Helper function to check if an event date is in the future
const isFutureEvent = (dateString) => {
  if (!dateString) return false;
  
  try {
    // Parse the date string as local date (YYYY-MM-DD format)
    const [year, month, day] = dateString.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day); // month is 0-indexed
    
    // Get today's date in local timezone
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    const todayDate = new Date(todayYear, todayMonth, todayDay);
    
    return eventDate >= todayDate;
  } catch (error) {
    console.error('Error checking if event is future:', error);
    return false;
  }
};

// Helper function to extract events from targeted HTML (more precise)
const extractEventsFromTargetedHTML = (doc) => {
  const events = [];
  
  // Look for more specific patterns that are likely to be actual events
  const eventContainers = doc.querySelectorAll('div[class*="event"], article[class*="event"], section[class*="event"]');
  
  eventContainers.forEach(container => {
    // Skip if it's clearly navigation or header content
    const text = container.textContent.toLowerCase();
    if (text.includes('navigation') || text.includes('header') || text.includes('footer') || 
        text.includes('menu') || text.includes('search') || text.length < 20) {
      return;
    }
    
    const event = extractEventFromElement(container);
    if (event && event.title.length > 5) { // More strict title validation
      events.push(event);
    }
  });
  
  return events;
};

// Note: isFoodRelatedEvent function removed as the source URL already filters for "Free Food and Beverages"

// Helper function to parse date strings
const parseDate = (dateString) => {
  if (!dateString) return null;
  
  try {
    // Clean up the date string
    const cleanDateString = dateString.trim().replace(/\s+/g, ' ');
    
    // Try to parse various date formats
    const date = new Date(cleanDateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    
    // Try parsing common date patterns
    const patterns = [
      /(\w+day,?\s+\w+\s+\d{1,2},?\s+\d{4})/i, // Thursday, September 04, 2025
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // MM/DD/YYYY
      /(\d{4})-(\d{1,2})-(\d{1,2})/,   // YYYY-MM-DD
      /(\w+)\s+(\d{1,2}),?\s+(\d{4})/  // Month DD, YYYY
    ];
    
    for (const pattern of patterns) {
      const match = cleanDateString.match(pattern);
      if (match) {
        const parsedDate = new Date(cleanDateString);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString().split('T')[0];
        }
      }
    }
    
  } catch (error) {
    console.error('Error parsing date:', error);
  }
  
  // If all else fails, return null so the event gets filtered out
  return null;
};

// Helper function to determine event type
const getEventType = (title, description) => {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('shabbat') || text.includes('jewish')) return 'Jewish Life';
  if (text.includes('popsicle') || text.includes('ice cream')) return 'Frozen Treats';
  if (text.includes('lunch') || text.includes('power lunch')) return 'Lunch';
  if (text.includes('brunch') || text.includes('bagel')) return 'Brunch';
  if (text.includes('reception') || text.includes('opening')) return 'Reception';
  if (text.includes('social') || text.includes('meet')) return 'Social';
  if (text.includes('fair') || text.includes('festival')) return 'Fair/Festival';
  if (text.includes('dinner')) return 'Dinner';
  
  return 'Free Food';
};

// Function to filter events by date range
export const filterEventsByDateRange = (events, startDate, endDate) => {
  return events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= startDate && eventDate <= endDate;
  });
};

// Function to search events by keyword
export const searchEvents = (events, searchTerm) => {
  const term = searchTerm.toLowerCase();
  return events.filter(event => 
    event.title.toLowerCase().includes(term) ||
    event.description.toLowerCase().includes(term) ||
    event.location.toLowerCase().includes(term) ||
    event.sponsor.toLowerCase().includes(term)
  );
};
