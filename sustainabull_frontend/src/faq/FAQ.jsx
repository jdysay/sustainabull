import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [activeSection, setActiveSection] = useState('basics');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const searchInputRef = useRef(null);

  const sections = [
    { id: 'basics', title: 'Game Basics', icon: '🏠' },
    { id: 'cows', title: 'Cow Management', icon: '🐮' },
    { id: 'inventory', title: 'Inventory System', icon: '🎒' },
    { id: 'shop', title: 'Shop & Economy', icon: '💰' },
    { id: 'stats', title: 'Health & Stats', icon: '❤️' },
  ];

  const faqItems = {
    basics: [
      {
        id: 'b1',
        question: "What is Sustain-A-Bull?",
        answer: "Welcome to Sustain-A-Bull where you sustain a bull to be more sustainable. Sustain-A-Bull is a simulation game where you manage a farm of cows, monitor their health and happiness, and work to travel sustainably.",
        tags: ['introduction', 'gameplay']
      },
      {
        id: 'b2',
        question: "How do I navigate the game?",
        answer: "Use the navigation buttons at the top and bottom of each screen. Shop (buy items), Leaderboard (view other users' progress), FAQ(view general help), Inventory (use items), Map (Begin trip), Cow Farm (view all cows).",
        tags: ['navigation', 'ui']
      },
      {
        id: 'b3',
        question: "How do I earn experience?",
        answer: "You gain XP by taking care of your cows, completing daily tasks, and making progress in the game.",
        tags: ['progress', 'xp']
      }
    ],
    cows: [
      {
        id: 'c1',
        question: "How do I view my cows?",
        answer: "Go to the Cow Farm page to see all your cows. Click any cow to see detailed stats and health information.",
        tags: ['viewing', 'stats']
      },
      {
        id: 'c2',
        question: "What do cow levels mean?",
        answer: "Level indicates your cow's overall development. Higher level cows have better stats and produce more resources.",
        tags: ['levels', 'progress']
      },
      {
        id: 'c3',
        question: "How do I improve my cows?",
        answer: "Use items from your inventory to boost their health.",
        tags: ['improvement', 'items']
      }
    ],
    inventory: [
    //   {
    //     id: 'i1',
    //     question: "How does the inventory work?",
    //     answer: "Your inventory stores all items you've purchased. Click 'Use' on an item, then select which cow to use it on.",
    //     tags: ['usage', 'management']
    //   },
    //   {
    //     id: 'i2',
    //     question: "What types of items are there?",
    //     answer: (
    //       <div>
    //         <p>We have several item categories:</p>
    //         <ul className="list-disc pl-5 space-y-1 mt-2">
    //           <li><strong>Health items</strong>: Improve wellness</li>
    //           <li><strong>Mood boosters</strong>: Increase happiness</li>
    //           <li><strong>Exercise equipment</strong>: Boost activity</li>
    //           <li><strong>CO₂ reducers</strong>: Lower emissions</li>
    //         </ul>
    //       </div>
    //     ),
    //     tags: ['categories', 'items']
    //   }
    // ],
    {
        id: 'i1',
        question: "How does the inventory work?",
        answer: "Your inventory stores all items you've purchased. Click 'Use' on an item, then select which cow to use it on.",
        tags: ['usage', 'management']
      }
    ],
    shop: [
      {
        id: 's1',
        question: "How do I earn coins?",
        answer: "Travel to different locations, complete trips, and take care of your cows to earn coins.",
        tags: ['currency', 'earnings']
      },
      {
        id: 's2',
        question: "What can I buy in the shop?",
        answer: "The shop offers items to feed your cow! Don't let it die.",
        tags: ['purchases', 'upgrades']
      }
    ],
    stats: [
      {
        id: 'st1',
        question: "What do the health stats mean?",
        answer: (
          <div className="space-y-2">
            <p>Each stat affects your cows differently:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Mood</strong>: Changes based off of food and CO₂ emissions</li>
              <li><strong>Hunger</strong>: Changes based off of eating frequency</li>
              <li><strong>Exercise</strong>: Changes based off of User travel frequency</li>
              <li><strong>CO₂ Emissions</strong>: Changes based off of environmental impact through travelling</li>
            </ul>
          </div>
        ),
        tags: ['statistics', 'meaning']
      },
      {
        id: 'st2',
        question: "How do stats affect gameplay?",
        answer: "Healthier, happier cows produce more resources and earn more coins. Balanced stats lead to farm prosperity.",
        tags: ['effects', 'gameplay']
      }
    ]
  };

  // Fuzzy search function
  const fuzzySearch = (query, text) => {
    if (!text) return false;
    const queryChars = query.toLowerCase().split('');
    const textChars = text.toLowerCase().split('');
    
    let queryIndex = 0;
    for (let i = 0; i < textChars.length; i++) {
      if (textChars[i] === queryChars[queryIndex]) {
        queryIndex++;
        if (queryIndex === queryChars.length) return true;
      }
    }
    return false;
  };

  // Highlight matching text
  const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    if (typeof text === 'string') {
      const regex = new RegExp(`(${query})`, 'gi');
      return text.split(regex).map((part, i) => 
        part.toLowerCase() === query.toLowerCase() 
          ? <span key={i} className="bg-yellow-200">{part}</span> 
          : part
      );
    }
    return text;
  };

  // Perform search across all FAQs
  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = [];
    
    Object.entries(faqItems).forEach(([section, items]) => {
      items.forEach(item => {
        const matchesQuestion = fuzzySearch(query, item.question);
        const matchesAnswer = typeof item.answer === 'string' 
          ? fuzzySearch(query, item.answer)
          : fuzzySearch(query, item.answer.props.children?.join(' '));
        const matchesTags = item.tags.some(tag => fuzzySearch(query, tag));
        
        if (matchesQuestion || matchesAnswer || matchesTags) {
          results.push({
            ...item,
            section,
            matches: {
              question: matchesQuestion,
              answer: matchesAnswer,
              tags: matchesTags
            }
          });
        }
      });
    });

    setSearchResults(results);
    addToRecentSearches(query);
  };

  // Recent searches functionality
  const addToRecentSearches = (query) => {
    if (!query.trim()) return;
    
    setRecentSearches(prev => {
      const newSearches = [query, ...prev.filter(q => q !== query)].slice(0, 5);
      localStorage.setItem('recentFAQSearch', JSON.stringify(newSearches));
      return newSearches;
    });
  };

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem('recentFAQSearch') || '[]');
    setRecentSearches(savedSearches);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  const handleRecentSearchClick = (query) => {
    setSearchQuery(query);
    performSearch(query);
    setShowRecentSearches(false);
    searchInputRef.current.focus();
  };

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const currentItems = searchQuery ? searchResults : faqItems[activeSection];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Cow Farm Tutorial & FAQ</h1>
        
        {/* Enhanced Search Bar */}
        <div className="relative mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs... (try 'health' or 'coins')"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowRecentSearches(true)}
              onBlur={() => setTimeout(() => setShowRecentSearches(false), 200)}
              ref={searchInputRef}
              className="w-full p-3 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
  
          {/* Recent searches dropdown */}
          {showRecentSearches && recentSearches.length > 0 && !searchQuery && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="p-2 text-sm text-gray-500">Recent searches</div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="w-full text-left p-2 hover:bg-gray-100"
                >
                  {search}
                </button>
              ))}
            </div>
          )}
  
          {/* Search suggestions */}
          {searchQuery && searchResults.length > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              Found {searchResults.length} results across {[...new Set(searchResults.map(r => r.section))].length} sections
            </div>
          )}
        </div>
  
        {/* Search Results */}
        {searchQuery ? (
          <div className="mb-8">
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-green-600 uppercase mb-1">
                          {sections.find(s => s.id === item.section)?.title}
                        </div>
                        <h3 className="font-bold text-lg mb-2">
                          {highlightText(item.question, searchQuery)}
                        </h3>
                        <div className="text-gray-700">
                          {typeof item.answer === 'string' 
                            ? highlightText(item.answer, searchQuery)
                            : item.answer}
                        </div>
                        {item.tags.length > 0 && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-500 mb-1">Related tags:</div>
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map(tag => (
                                <span 
                                  key={tag} 
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    tag.toLowerCase().includes(searchQuery.toLowerCase())
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No results found for "{searchQuery}". Try different keywords like:
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {['health', 'coins', 'inventory', 'shop', 'cows'].map(keyword => (
                    <button
                      key={keyword}
                      onClick={() => handleRecentSearchClick(keyword)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Regular FAQ Content */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              {/* Navigation tabs */}
              <div className="flex overflow-x-auto scrollbar-hide bg-gray-50">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setSearchQuery('');
                    }}
                    className={`px-4 py-3 font-medium whitespace-nowrap flex items-center ${
                      activeSection === section.id 
                        ? 'border-b-2 border-green-500 text-green-600 bg-white' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2 text-lg">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </div>
              
              {/* FAQ Content */}
              <div className="p-4 md:p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="mr-2">{sections.find(s => s.id === activeSection)?.icon}</span>
                  {sections.find(s => s.id === activeSection)?.title}
                </h2>
                
                <div className="space-y-4">
                  {currentItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="w-full flex justify-between items-center p-4 hover:bg-gray-50 focus:outline-none"
                      >
                        <h3 className="font-semibold text-lg text-left text-gray-800">Q: {item.question}</h3>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedItems[item.id] ? 'rotate-180' : ''}`}
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {expandedItems[item.id] && (
                        <div className="p-4 pt-0 border-t border-gray-200">
                          <div className="text-gray-600">
                            {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
                          </div>
                          {item.tags.length > 0 && (
                            <div className="mt-3">
                              <div className="text-xs text-gray-500 mb-1">Related tags:</div>
                              <div className="flex flex-wrap gap-1">
                                {item.tags.map(tag => (
                                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
  
            {/* Interactive Tutorial Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">🔄</span> Interactive Tutorial
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2">Try It Out:</h3>
                  <p className="text-blue-700 mb-3">Practice these actions in the game:</p>
                  <ol className="list-decimal pl-5 space-y-2 text-blue-700">
                    <li>Visit your Cow Farm and check a cow's stats</li>
                    <li>Go to Inventory and use an item on a cow</li>
                    <li>Visit the Shop to browse available upgrades</li>
                    <li>Monitor how items affect your cows' health stats</li>
                  </ol>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h3 className="font-medium text-green-800 mb-2">Pro Tip:</h3>
                  <p className="text-green-700">
                    Balanced cows (good mood, health, and exercise with low emissions) 
                    produce the most resources. Try to keep all stats in the green!
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
  
        <div className="flex justify-around mt-8 pt-4 border-t border-gray-200">
          <Link to="/home" className="mt-6 w-50 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition block text-center">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;