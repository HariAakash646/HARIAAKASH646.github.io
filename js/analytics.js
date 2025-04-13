/**
 * Simple Website Analytics Script
 * Records all clicks and page views on the website
 */

class WebsiteAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.pageViews = [];
    this.clicks = [];
    
    // Initialize tracking
    this.initializeTracking();
    
    console.log('%c Website Analytics Initialized', 'background: #222; color: #bada55; font-size: 14px; padding: 5px;');
    console.log(`Session ID: ${this.sessionId}`);
    console.log(`Start time: ${new Date(this.startTime).toLocaleTimeString()}`);
  }
  
  // Generate a unique session ID
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Initialize tracking methods
  initializeTracking() {
    this.trackPageViews();
    this.trackAllClicks();
  }
  
  // Track when elements come into view
  trackPageViews() {
    // Create intersection observer to detect when elements are visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const elementId = element.id || '';
          const elementClass = element.className || '';
          const elementTag = element.tagName || '';
          const elementText = element.textContent?.trim().substring(0, 50) || '';
          
          const viewData = {
            timestamp: new Date().toISOString(),
            elementId,
            elementClass,
            elementTag,
            elementText,
            path: this.getElementPath(element)
          };
          
          this.pageViews.push(viewData);
          
          // Log to console with appropriate styling
          console.log(
            `%c PAGE VIEW: ${elementTag}${elementId ? '#'+elementId : ''}${elementClass ? '.'+elementClass.replace(/\s+/g, '.') : ''}`, 
            'color: #4CAF50; font-weight: bold;'
          );
          if (elementText) {
            console.log(`  Content: "${elementText}${elementText.length >= 50 ? '...' : ''}"`);
          }
          console.log(`  Path: ${viewData.path}`);
        }
      });
    }, { threshold: 0.2 });
    
    // Observe all elements on the page that might be significant
    document.querySelectorAll('section, div, header, footer, nav, main, article, aside, h1, h2, h3, h4, h5, h6, img, button, a').forEach(element => {
      observer.observe(element);
    });
  }
  
  // Track all clicks on the page
  trackAllClicks() {
    document.addEventListener('click', (event) => {
      // Get the clicked element
      const element = event.target;
      
      // Get element details
      const elementId = element.id || '';
      const elementClass = element.className || '';
      const elementTag = element.tagName || '';
      const elementText = element.textContent?.trim().substring(0, 50) || '';
      const elementHref = element.href || element.closest('a')?.href || '';
      
      const clickData = {
        timestamp: new Date().toISOString(),
        elementId,
        elementClass,
        elementTag,
        elementText,
        elementHref,
        path: this.getElementPath(element),
        x: event.clientX,
        y: event.clientY
      };
      
      this.clicks.push(clickData);
      
      // Log to console with appropriate styling
      console.log(
        `%c CLICK: ${elementTag}${elementId ? '#'+elementId : ''}${elementClass ? '.'+elementClass.replace(/\s+/g, '.') : ''}`, 
        'color: #2196F3; font-weight: bold;'
      );
      if (elementText) {
        console.log(`  Content: "${elementText}${elementText.length >= 50 ? '...' : ''}"`);
      }
      if (elementHref) {
        console.log(`  Link: ${elementHref}`);
      }
      console.log(`  Position: x=${event.clientX}, y=${event.clientY}`);
      console.log(`  Path: ${clickData.path}`);
    });
  }
  
  // Get DOM path for an element
  getElementPath(element) {
    let path = [];
    let currentElement = element;
    
    while (currentElement && currentElement !== document.body && currentElement !== document) {
      let selector = currentElement.tagName.toLowerCase();
      
      if (currentElement.id) {
        selector += `#${currentElement.id}`;
      } else if (currentElement.className && typeof currentElement.className === 'string') {
        selector += `.${currentElement.className.trim().replace(/\s+/g, '.')}`;
      }
      
      path.unshift(selector);
      currentElement = currentElement.parentElement;
    }
    
    return path.join(' > ');
  }
  
  // Get all analytics data
  getAllData() {
    return {
      sessionId: this.sessionId,
      startTime: this.startTime,
      currentTime: Date.now(),
      duration: Date.now() - this.startTime,
      pageViews: this.pageViews,
      clicks: this.clicks,
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    };
  }
}

// Initialize analytics when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Create global analytics instance
  window.websiteAnalytics = new WebsiteAnalytics();
  
  // Add console command for easy access
  window.getAnalytics = () => window.websiteAnalytics.getAllData();
  
  console.log('%c Analytics Command:', 'background: #FFC107; color: black; padding: 3px 6px;');
  console.log('Type getAnalytics() to see all captured data');
});
