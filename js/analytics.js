/**
 * Website Analytics Script
 * Records user actions on major sections of the website
 */

class WebsiteAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.currentSection = null;
    this.sectionTimes = {};
    this.interactions = [];
    this.visibleSections = new Set();
    
    // Define sections to track
    this.sections = [
      '#about', 
      '#interests', 
      '#explore', 
      '.cv-download-section', 
      '#hobbies',
      '#contact'
    ];
    
    // Define hover elements to track
    this.hoverElements = [
      '.interests-grid a',
      '.page-link-card',
      '.download-button',
      '.social-links a',
      '.tooltip-container',
      '.profile-image-container a'
    ];
    
    // Initialize tracking
    this.initializeTracking();
    
    // Save data when user leaves the page
    window.addEventListener('beforeunload', () => this.saveData());
    
    // Log initialization to console
    console.log('%c Website Analytics Initialized', 'background: #222; color: #bada55; font-size: 14px; padding: 5px;');
    console.log(`Session ID: ${this.sessionId}`);
    console.log(`Start time: ${new Date(this.startTime).toLocaleTimeString()}`);
    console.log(`Tracking sections: ${this.sections.join(', ')}`);
  }
  
  // Generate a unique session ID
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Initialize all tracking methods
  initializeTracking() {
    this.trackSectionViews();
    this.trackClicks();
    this.trackHovers();
    this.trackSectionTime();
    
    // Log status every minute
    setInterval(() => this.logStatus(), 60000);
  }
  
  // Track when sections come into view using Intersection Observer
  trackSectionViews() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id || entry.target.className;
        
        if (entry.isIntersecting) {
          this.visibleSections.add(id);
          this.recordAction('view', id, 'Section came into view');
          
          // Start timing this section
          if (!this.sectionTimes[id]) {
            this.sectionTimes[id] = {
              totalTime: 0,
              lastEntered: Date.now()
            };
          } else {
            this.sectionTimes[id].lastEntered = Date.now();
          }
          
          // Console log section view
          console.log(`%c Section Viewed: ${id}`, 'color: #4CAF50; font-weight: bold;');
        } else {
          // If section is no longer visible, update time spent
          if (this.visibleSections.has(id)) {
            this.visibleSections.delete(id);
            
            if (this.sectionTimes[id]) {
              const timeSpent = Date.now() - this.sectionTimes[id].lastEntered;
              this.sectionTimes[id].totalTime += timeSpent;
              
              // Log time spent in section
              console.log(`%c Left section: ${id} - Time spent: ${this.formatTime(timeSpent)}`, 'color: #FF9800;');
            }
          }
        }
      });
    }, { threshold: 0.2 }); // Element is considered "visible" when 20% is in view
    
    // Observe all sections
    this.sections.forEach(section => {
      const elements = document.querySelectorAll(section);
      elements.forEach(element => observer.observe(element));
    });
  }
  
  // Track hovers on interactive elements
  trackHovers() {
    this.hoverElements.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      
      elements.forEach(element => {
        // Track mouseenter (hover start)
        element.addEventListener('mouseenter', () => {
          const elementId = element.id || element.className;
          const elementText = element.textContent.trim() || 
                              element.getAttribute('title') || 
                              (element.querySelector('h3') ? element.querySelector('h3').textContent.trim() : null) ||
                              elementId;
          
          this.recordAction('hover_start', elementId, `User hovered over: ${elementText}`, element.getAttribute('href'));
        });
        
        // Track mouseleave (hover end)
        element.addEventListener('mouseleave', () => {
          const elementId = element.id || element.className;
          this.recordAction('hover_end', elementId, 'User stopped hovering');
        });
      });
    });
    
    // Additionally track tooltip containers specifically
    const tooltipContainers = document.querySelectorAll('.tooltip-container');
    tooltipContainers.forEach(container => {
      container.addEventListener('mouseenter', () => {
        const tooltip = container.querySelector('.tooltip');
        if (tooltip) {
          this.recordAction('tooltip_shown', container.className, `Tooltip shown: ${tooltip.textContent.trim()}`);
        }
      });
    });
  }
  
  // Track clicks on interactive elements
  trackClicks() {
    // Track clicks on links
    document.addEventListener('click', (event) => {
      let target = event.target;
      
      // Find closest anchor or button if clicked on a child element
      while (target && target !== document && !['A', 'BUTTON'].includes(target.tagName)) {
        target = target.parentNode;
      }
      
      if (target && target.tagName === 'A') {
        const href = target.getAttribute('href');
        const text = target.textContent.trim() || target.getAttribute('title') || href;
        this.recordAction('click', 'link', text, href);
      } else if (target && target.tagName === 'BUTTON') {
        const text = target.textContent.trim();
        this.recordAction('click', 'button', text);
      }
    });
    
    // Special tracking for CV download
    const downloadButtons = document.querySelectorAll('.download-button');
    downloadButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.recordAction('download', 'cv', 'Resume downloaded');
        console.log('%c Resume Downloaded!', 'background: #009688; color: white; padding: 3px 6px; border-radius: 3px; font-weight: bold;');
      });
    });
    
    // Track interest card clicks
    const interestCards = document.querySelectorAll('.interests-grid a, .page-link-card');
    interestCards.forEach(card => {
      card.addEventListener('click', (event) => {
        const text = card.querySelector('h3')?.textContent || 'Interest card';
        this.recordAction('click', 'interest-card', text, card.getAttribute('href'));
      });
    });
  }
  
  // Track time spent on each section
  trackSectionTime() {
    // Update active section times every 5 seconds
    setInterval(() => {
      this.visibleSections.forEach(id => {
        if (this.sectionTimes[id]) {
          // Update and reset the timer
          const now = Date.now();
          const timeSpent = now - this.sectionTimes[id].lastEntered;
          this.sectionTimes[id].totalTime += timeSpent;
          this.sectionTimes[id].lastEntered = now;
        }
      });
    }, 5000);
  }
  
  // Format milliseconds to readable time
  formatTime(ms) {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${Math.floor(ms/1000)}s`;
    return `${Math.floor(ms/60000)}m ${Math.floor((ms % 60000)/1000)}s`;
  }
  
  // Record an action
  recordAction(type, target, description, url = null) {
    const action = {
      type,
      target,
      description,
      url,
      timestamp: new Date().toISOString()
    };
    
    this.interactions.push(action);
    
    // Format console output based on action type
    let logStyle = '';
    
    switch(type) {
      case 'click':
        logStyle = 'color: #2196F3; font-weight: bold;';
        break;
      case 'view':
        logStyle = 'color: #4CAF50;';
        break;
      case 'download':
        logStyle = 'color: #E91E63; font-weight: bold;';
        break;
      case 'hover_start':
        logStyle = 'color: #9C27B0;';
        break;
      case 'hover_end':
        logStyle = 'color: #9C27B0; font-style: italic;';
        break;
      case 'tooltip_shown':
        logStyle = 'color: #FF5722;';
        break;
      default:
        logStyle = 'color: #9C27B0;';
    }
    
    console.log(`%c ${type.toUpperCase()}: ${description} - ${target} ${url ? '→ ' + url : ''}`, logStyle);
    
    // Optional: Send to server in real-time for important actions
    if (['download', 'form_submit'].includes(type)) {
      this.sendToServer(action);
    }
  }
  
  // Log current analytics status to console
  logStatus() {
    console.group('%c Analytics Status Update', 'background: #333; color: white; padding: 3px 6px; border-radius: 3px;');
    console.log(`Session duration: ${this.formatTime(Date.now() - this.startTime)}`);
    console.log(`Total interactions: ${this.interactions.length}`);
    
    // Show section times
    console.group('Section Times:');
    for (const [section, data] of Object.entries(this.sectionTimes)) {
      console.log(`${section}: ${this.formatTime(data.totalTime)}`);
    }
    console.groupEnd();
    
    // Show last 5 interactions
    if (this.interactions.length > 0) {
      console.group('Recent Interactions:');
      const recentInteractions = this.interactions.slice(-5).reverse();
      recentInteractions.forEach(interaction => {
        console.log(`${interaction.type}: ${interaction.description} (${new Date(interaction.timestamp).toLocaleTimeString()})`);
      });
      console.groupEnd();
    }
    
    console.groupEnd();
  }
  
  // Save data to localStorage
  saveData() {
    // Update section times one last time before saving
    this.visibleSections.forEach(id => {
      if (this.sectionTimes[id]) {
        const timeSpent = Date.now() - this.sectionTimes[id].lastEntered;
        this.sectionTimes[id].totalTime += timeSpent;
      }
    });
    
    const analyticsData = {
      sessionId: this.sessionId,
      startTime: this.startTime,
      endTime: Date.now(),
      totalTime: Date.now() - this.startTime,
      sectionTimes: this.sectionTimes,
      interactions: this.interactions,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      pageUrl: window.location.href
    };
    
    // Get existing data
    let allData = [];
    try {
      const storedData = localStorage.getItem('websiteAnalytics');
      if (storedData) {
        allData = JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error reading analytics data from localStorage', error);
    }
    
    // Add new session and save
    allData.push(analyticsData);
    
    // Keep only last 10 sessions to avoid storage issues
    if (allData.length > 10) {
      allData = allData.slice(-10);
    }
    
    localStorage.setItem('websiteAnalytics', JSON.stringify(allData));
    
    // Log session summary
    console.group('%c Session Summary', 'background: #4CAF50; color: white; padding: 5px; font-size: 14px;');
    console.log(`Total time on site: ${this.formatTime(analyticsData.totalTime)}`);
    console.log(`Total interactions: ${this.interactions.length}`);
    console.log(`Data saved to localStorage`);
    console.groupEnd();
    
    // Send final data to server
    this.sendToServer(analyticsData);
  }
  
  // Send data to server (mock function)
  sendToServer(data) {
    // In a real implementation, this would make an AJAX call to your server
    console.log('%c Sending data to server', 'color: #795548');
    
    // Example implementation (commented out):
    /*
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => console.log('Server response:', result))
    .catch(error => console.error('Error sending analytics:', error));
    */
  }
  
  // Get all analytics data
  getAllData() {
    try {
      const storedData = localStorage.getItem('websiteAnalytics');
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error reading analytics data', error);
    }
    return [];
  }
  
  // Get current session data
  getCurrentSessionData() {
    // Update section times before returning
    this.visibleSections.forEach(id => {
      if (this.sectionTimes[id]) {
        const timeSpent = Date.now() - this.sectionTimes[id].lastEntered;
        this.sectionTimes[id].totalTime += timeSpent;
        this.sectionTimes[id].lastEntered = Date.now();
      }
    });
    
    const data = {
      sessionId: this.sessionId,
      startTime: this.startTime,
      currentTime: Date.now(),
      totalTime: Date.now() - this.startTime,
      sectionTimes: this.sectionTimes,
      interactions: this.interactions
    };
    
    // Log the data to console in a nice format
    console.group('%c Current Analytics Data', 'background: #673AB7; color: white; padding: 3px 6px;');
    console.log('Session ID:', this.sessionId);
    console.log('Duration:', this.formatTime(data.totalTime));
    console.log('Interactions:', data.interactions.length);
    
    console.group('Section Times:');
    Object.entries(data.sectionTimes).forEach(([section, timeData]) => {
      console.log(`${section}: ${this.formatTime(timeData.totalTime)}`);
    });
    console.groupEnd();
    
    console.groupEnd();
    
    return data;
  }
}

// Initialize analytics when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Create global analytics instance
  window.websiteAnalytics = new WebsiteAnalytics();
  
  // Add console commands for easy access
  window.getAnalytics = () => window.websiteAnalytics.getCurrentSessionData();
  window.getAllAnalytics = () => window.websiteAnalytics.getAllData();
  
  // Log info about console commands
  console.log('%c Analytics Console Commands:', 'background: #FFC107; color: black; padding: 3px 6px;');
  console.log('Type getAnalytics() to see current session data');
  console.log('Type getAllAnalytics() to see all stored sessions');
});
