// Text analyzer function
function analyzeText(text) {
  const stats = {
    // Basic counts
    wordCount: 0,
    letterCount: 0,
    spaceCount: 0,
    newlineCount: 0,
    specialCharCount: 0,
    characterCount: 0,
    sentenceCount: 0,
    
    // Detailed linguistic counts
    pronouns: {
      total: 0,
      byType: {
        personal: 0,
        demonstrative: 0,
        interrogative: 0,
        relative: 0,
        indefinite: 0
      },
      byWord: {}
    },
    
    prepositions: {
      total: 0,
      byType: {
        simple: 0,
        compound: 0,
        spatial: 0,
        temporal: 0
      },
      byWord: {}
    },
    
    indefiniteArticles: {
      total: 0,
      a: 0,
      an: 0,
      followingWords: {
        a: [],
        an: []
      }
    }
  };
  
  // Count basic text metrics
  stats.characterCount = text.length;
  stats.letterCount = (text.match(/[a-zA-Z]/g) || []).length;
  stats.spaceCount = (text.match(/\s/g) || []).length;
  stats.newlineCount = (text.match(/\n/g) || []).length;
  stats.specialCharCount = (text.match(/[^\w\s]/g) || []).length;
  
  // Count words and sentences
  const words = text.toLowerCase().trim().split(/\s+/);
  stats.wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  stats.sentenceCount = sentences.length;
  
  // Define linguistic categories
  const pronounCategories = {
    personal: ['i', 'me', 'my', 'mine', 'myself', 'you', 'your', 'yours', 'yourself', 
              'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 
              'it', 'its', 'itself', 'we', 'us', 'our', 'ours', 'ourselves', 
              'they', 'them', 'their', 'theirs', 'themselves'],
    demonstrative: ['this', 'that', 'these', 'those'],
    interrogative: ['who', 'whom', 'whose', 'which', 'what'],
    relative: ['who', 'whom', 'whose', 'which', 'that'],
    indefinite: ['anyone', 'anybody', 'anything', 'each', 'either', 'everyone', 'everybody', 'everything', 
                'neither', 'nobody', 'nothing', 'someone', 'somebody', 'something', 'both', 'few', 
                'many', 'several', 'all', 'some', 'most', 'none']
  };
  
  const prepositionCategories = {
    simple: ['at', 'by', 'for', 'from', 'in', 'of', 'on', 'to', 'with', 'about', 'above', 'across', 'after', 
            'against', 'along', 'among', 'around', 'as', 'before', 'behind', 'below', 'beneath', 'beside', 
            'between', 'beyond', 'but', 'despite', 'down', 'during', 'except', 'inside', 'like', 'near', 
            'off', 'over', 'past', 'since', 'through', 'throughout', 'till', 'toward', 'under', 'underneath', 
            'until', 'up', 'via', 'within', 'without'],
    compound: ['according to', 'ahead of', 'apart from', 'as for', 'as of', 'as per', 'as regards', 'aside from', 
              'because of', 'close to', 'due to', 'except for', 'far from', 'in addition to', 'in between', 
              'in case of', 'in front of', 'in lieu of', 'in place of', 'in spite of', 'instead of', 'near to', 
              'next to', 'on account of', 'on behalf of', 'on top of', 'out of', 'outside of', 'owing to', 
              'prior to', 'pursuant to', 'rather than', 'regardless of', 'thanks to', 'together with', 'up to', 
              'with regard to'],
    spatial: ['above', 'across', 'against', 'along', 'among', 'around', 'at', 'before', 'behind', 'below', 
            'beneath', 'beside', 'between', 'beyond', 'by', 'down', 'from', 'in', 'inside', 'into', 'near', 
            'off', 'on', 'onto', 'opposite', 'outside', 'over', 'past', 'through', 'to', 'toward', 'under', 
            'underneath', 'up', 'upon', 'within'],
    temporal: ['after', 'at', 'before', 'by', 'during', 'following', 'for', 'from', 'in', 'on', 'prior to', 
              'since', 'till', 'to', 'until', 'when', 'while']
  };
  
  // Count pronouns
  words.forEach(word => {
    // Remove punctuation
    const cleanWord = word.replace(/[^\w]/g, '');
    if (!cleanWord) return;
    
    // Check each pronoun category
    Object.entries(pronounCategories).forEach(([category, categoryPronouns]) => {
      if (categoryPronouns.includes(cleanWord)) {
        // Increment category count
        stats.pronouns.byType[category]++;
        stats.pronouns.total++;
        
        // Increment specific pronoun count
        stats.pronouns.byWord[cleanWord] = (stats.pronouns.byWord[cleanWord] || 0) + 1;
      }
    });
  });
  
  // Count simple prepositions
  const lowercaseText = text.toLowerCase();
  prepositionCategories.simple.forEach(prep => {
    const regex = new RegExp('\\b' + prep + '\\b', 'gi');
    const matches = lowercaseText.match(regex) || [];
    
    if (matches.length > 0) {
      stats.prepositions.byType.simple += matches.length;
      stats.prepositions.total += matches.length;
      stats.prepositions.byWord[prep] = matches.length;
    }
  });
  
  // Count compound prepositions
  prepositionCategories.compound.forEach(prep => {
    const regex = new RegExp('\\b' + prep.replace(/ /g, '\\s+') + '\\b', 'gi');
    const matches = lowercaseText.match(regex) || [];
    
    if (matches.length > 0) {
      stats.prepositions.byType.compound += matches.length;
      stats.prepositions.total += matches.length;
      stats.prepositions.byWord[prep] = matches.length;
    }
  });
  
  // Count spatial and temporal prepositions (already included in simple/compound)
  prepositionCategories.spatial.forEach(prep => {
    const regex = new RegExp('\\b' + prep + '\\b', 'gi');
    const matches = lowercaseText.match(regex) || [];
    
    if (matches.length > 0) {
      stats.prepositions.byType.spatial += matches.length;
    }
  });
  
  prepositionCategories.temporal.forEach(prep => {
    const regex = new RegExp('\\b' + prep.replace(/ /g, '\\s+') + '\\b', 'gi');
    const matches = lowercaseText.match(regex) || [];
    
    if (matches.length > 0) {
      stats.prepositions.byType.temporal += matches.length;
    }
  });
  
  // Count indefinite articles
  const aRegex = /\ba\s+(\w+)/g;
  let aMatch;
  while ((aMatch = aRegex.exec(lowercaseText)) !== null) {
    stats.indefiniteArticles.a++;
    stats.indefiniteArticles.total++;
    if (aMatch[1]) {
      stats.indefiniteArticles.followingWords.a.push(aMatch[1]);
    }
  }
  
  const anRegex = /\ban\s+(\w+)/g;
  let anMatch;
  while ((anMatch = anRegex.exec(lowercaseText)) !== null) {
    stats.indefiniteArticles.an++;
    stats.indefiniteArticles.total++;
    if (anMatch[1]) {
      stats.indefiniteArticles.followingWords.an.push(anMatch[1]);
    }
  }
  
  return stats;
}

// Function to display statistics on the page
function displayTextStats(stats) {
  console.log("Displaying stats:", stats); // Debug log
  
  // Remove any existing stats container first
  const existingStats = document.getElementById('text-stats');
  if (existingStats) {
    existingStats.remove();
  }
  
  // Create a new stats container
  const statsDiv = document.createElement('div');
  statsDiv.id = 'text-stats';
  statsDiv.className = 'stats-container';
  
  // Set display to block explicitly
  statsDiv.style.display = 'block';
  
  // Insert the stats div right after the analyze button for better visibility
  const analyzeBtn = document.getElementById('analyze-button');
  if (analyzeBtn && analyzeBtn.parentNode) {
    analyzeBtn.parentNode.insertBefore(statsDiv, analyzeBtn.nextSibling);
  } else {
    // Use the review-form as a fallback insertion point
    const reviewForm = document.querySelector('.review-form');
    if (reviewForm) {
      reviewForm.appendChild(statsDiv);
    } else {
      // If all else fails, append to body
      document.body.appendChild(statsDiv);
    }
  }
  
  // Create pronoun details HTML
  let pronounHtml = '';
  if (stats.pronouns.total > 0) {
    pronounHtml = `
      <h4>Pronouns (${stats.pronouns.total}):</h4>
      <div class="stats-details">
        <div class="stats-column">
          <p><strong>By Type:</strong></p>
          <ul>
            <li>Personal: ${stats.pronouns.byType.personal}</li>
            <li>Demonstrative: ${stats.pronouns.byType.demonstrative}</li>
            <li>Interrogative: ${stats.pronouns.byType.interrogative}</li>
            <li>Relative: ${stats.pronouns.byType.relative}</li>
            <li>Indefinite: ${stats.pronouns.byType.indefinite}</li>
          </ul>
        </div>
      </div>
    `;
  } else {
    pronounHtml = '<p>No pronouns found.</p>';
  }
  
  // Create preposition details HTML
  let prepositionHtml = '';
  if (stats.prepositions.total > 0) {
    prepositionHtml = `
      <h4>Prepositions (${stats.prepositions.total}):</h4>
      <div class="stats-details">
        <div class="stats-column">
          <p><strong>By Type:</strong></p>
          <ul>
            <li>Simple: ${stats.prepositions.byType.simple}</li>
            <li>Compound: ${stats.prepositions.byType.compound}</li>
          </ul>
        </div>
      </div>
    `;
  } else {
    prepositionHtml = '<p>No prepositions found.</p>';
  }
  
  // Create indefinite article details HTML
  let articleHtml = '';
  if (stats.indefiniteArticles.total > 0) {
    articleHtml = `
      <h4>Indefinite Articles (${stats.indefiniteArticles.total}):</h4>
      <ul>
        <li>"a": ${stats.indefiniteArticles.a}</li>
        <li>"an": ${stats.indefiniteArticles.an}</li>
      </ul>
    `;
  } else {
    articleHtml = '<p>No indefinite articles found.</p>';
  }
  
  // Display the stats with detailed information
  statsDiv.innerHTML = `
    <div class="stats-box">
      <h3>Text Statistics:</h3>
      
      <h4>Basic Counts:</h4>
      <ul>
        <li><strong>Word count:</strong> ${stats.wordCount}</li>
        <li><strong>Letter count:</strong> ${stats.letterCount}</li>
        <li><strong>Space count:</strong> ${stats.spaceCount}</li>
        <li><strong>Newline count:</strong> ${stats.newlineCount}</li>
        <li><strong>Special character count:</strong> ${stats.specialCharCount}</li>
        <li><strong>Total character count:</strong> ${stats.characterCount}</li>
        <li><strong>Sentence count:</strong> ${stats.sentenceCount}</li>
      </ul>
      
      <div class="stats-section pronouns-section">
        ${pronounHtml}
      </div>
      
      <div class="stats-section prepositions-section">
        ${prepositionHtml}
      </div>
      
      <div class="stats-section articles-section">
        ${articleHtml}
      </div>
    </div>
  `;
  
  // Make sure it's really visible
  statsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // Double-check that the stats are visible
  setTimeout(() => {
    const checkStats = document.getElementById('text-stats');
    if (checkStats) {
      checkStats.style.display = 'block';
      console.log('Stats should be visible now');
    }
  }, 100);
}

// Initialize the functionality when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, setting up form listeners");
  
  // Find all forms that might be review forms
  const forms = document.querySelectorAll('form');
  
  if (forms.length === 0) {
    console.warn("No forms found on the page");
  } else {
    console.log(`Found ${forms.length} forms`);
  }
  
  // Set up listeners for all forms
  forms.forEach((form, index) => {
    console.log(`Setting up listener for form ${index}`);
    
    form.addEventListener('submit', function(event) {
      // Prevent the default form submission
      event.preventDefault();
      console.log(`Form ${index} submitted`);
      
      // Find text input elements in the form
      const textInputs = form.querySelectorAll('textarea, input[type="text"]');
      let allText = '';
      
      textInputs.forEach(input => {
        allText += ' ' + input.value;
      });
      
      console.log(`Text to analyze: ${allText.substring(0, 50)}...`);
      
      // Only proceed if we have text to analyze
      if (allText.trim()) {
        // Analyze the text
        const stats = analyzeText(allText);
        console.log("Analysis complete:", stats);
        
        // Display the statistics
        displayTextStats(stats);
        
        // Add a notification that stats have been displayed
        alert("Text analysis complete! Statistics are displayed below.");
      } else {
        console.warn("No text found to analyze");
      }
    });
  });
  
  // Set up the Analyze Text button functionality
  const analyzeButton = document.getElementById('analyze-button');
  if (analyzeButton) {
    console.log("Analyze button found, setting up listener");
    
    analyzeButton.addEventListener('click', function() {
      // Find the review text area - FIXED: using the correct ID from reviews.html
      const reviewTextarea = document.getElementById('reviewContent');
      
      if (reviewTextarea) {
        const text = reviewTextarea.value;
        console.log(`Analyzing text: ${text.substring(0, 50)}...`);
        
        if (text.trim()) {
          // Analyze the text
          const stats = analyzeText(text);
          console.log("Analysis complete:", stats);
          
          // Display the statistics
          displayTextStats(stats);
        } else {
          alert("Please write something in the review box before analyzing.");
          console.warn("No text to analyze");
        }
      } else {
        console.warn("Review textarea not found with ID 'reviewContent'");
        alert("Review textarea not found. Please make sure the page is set up correctly.");
      }
    });
  } else {
    console.log("Analyze button not found on this page");
  }
});

