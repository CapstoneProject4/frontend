// API Configuration
const API_KEY = '854d271e80bbf4289dcbc0b32cd16782';
const API_URL = 'https://v3.football.api-sports.io';

// DOM Elements
const predictionDate = document.getElementById('predictionDate');
const predictionsContainer = document.querySelector('.predictions-container');
const predictionDateDisplay = document.querySelector('.predictions-date');
const filterButtons = document.querySelectorAll('.filter-btn');
const paginationContainer = document.querySelector('.pagination');

// Global variables
let currentPage = 1;
const itemsPerPage = 6;
let allFixtures = [];
let filteredFixtures = [];
let selectedCompetition = 'all';

// Map league IDs to competition names
const competitionMap = {
    'epl': 39,        // Premier League
    'laliga': 140,    // La Liga
    'bundesliga': 78, // Bundesliga
    'seriea': 135,    // Serie A
    'ligue1': 61,     // Ligue 1
    'ucl': 2,         // Champions League
    'uel': 3,         // Europa League
    'saudi': 307,     // Saudi Pro League
    'nations': 5,     // UEFA Nations League
    'euros': 4,       // European Championship
    'worldcup': 1,    // World Cup
    'acl': 17,        // AFC Champions League
    'copa': 15,       // Copa America
    'afcon': 8        // Africa Cup of Nations
};

// Competition icons mapping
const competitionIcons = {
    'epl': 'fa-futbol',
    'laliga': 'fa-futbol',
    'bundesliga': 'fa-futbol',
    'seriea': 'fa-futbol',
    'ligue1': 'fa-futbol',
    'ucl': 'fa-trophy',
    'uel': 'fa-trophy',
    'saudi': 'fa-futbol',
    'nations': 'fa-flag',
    'euros': 'fa-trophy',
    'worldcup': 'fa-globe',
    'acl': 'fa-trophy',
    'copa': 'fa-trophy',
    'afcon': 'fa-trophy',
    'default': 'fa-futbol'
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date as default
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    predictionDate.value = formattedDate;
    
    // Load initial fixtures
    loadFixtures(formattedDate);
    
    // Set up event listeners
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Date filter
    predictionDate.addEventListener('change', () => {
        const selectedDate = predictionDate.value;
        loadFixtures(selectedDate);
        
        // Format date for display
        const date = new Date(selectedDate);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        predictionDateDisplay.textContent = `For ${formattedDate}`;
    });
    
    // Competition filter
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update selected competition
            selectedCompetition = button.dataset.competition;
            
            // Filter fixtures and refresh display
            filterFixtures();
            currentPage = 1; // Reset to first page
            renderFixtures();
        });
    });
}

// Load fixtures from API
async function loadFixtures(date) {
    try {
        showLoader();
        
        // Fetch fixtures for the selected date
        const fixturesResponse = await fetchData('/fixtures', {
            date: date
        });
        
        if (fixturesResponse && fixturesResponse.response) {
            allFixtures = fixturesResponse.response;
            
            // Add odds data for each fixture
            for (let i = 0; i < allFixtures.length; i++) {
                const fixture = allFixtures[i];
                const fixtureId = fixture.fixture.id;
                
                // Fetch odds for this fixture
                const oddsResponse = await fetchData('/odds', {
                    fixture: fixtureId,
                    bookmaker: 1 // Default bookmaker
                });
                
                if (oddsResponse && oddsResponse.response && oddsResponse.response.length > 0) {
                    fixture.odds = oddsResponse.response[0].bookmakers;
                }
            }
            
            // Filter and render fixtures
            filterFixtures();
            renderFixtures();
        } else {
            showError('No fixtures found for this date');
        }
        
        hideLoader();
    } catch (error) {
        console.error('Error loading fixtures:', error);
        showError('Failed to load fixtures. Please try again later.');
        hideLoader();
    }
}

// Filter fixtures by selected competition
function filterFixtures() {
    if (selectedCompetition === 'all') {
        filteredFixtures = [...allFixtures];
    } else {
        const leagueId = competitionMap[selectedCompetition];
        filteredFixtures = allFixtures.filter(fixture => 
            fixture.league.id === leagueId
        );
    }
    
    renderPagination();
}

// Render fixtures on the page
function renderFixtures() {
    predictionsContainer.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedFixtures = filteredFixtures.slice(startIndex, endIndex);
    
    if (paginatedFixtures.length === 0) {
        predictionsContainer.innerHTML = `
            <div class="no-fixtures">
                <p>No fixtures found for the selected criteria.</p>
                <p>Try selecting a different date or competition.</p>
            </div>
        `;
        return;
    }
    
    // Create HTML for each fixture
    paginatedFixtures.forEach(fixture => {
        const card = createFixtureCard(fixture);
        predictionsContainer.appendChild(card);
    });
}

// Create a prediction card for a fixture
function createFixtureCard(fixture) {
    // Extract fixture data
    const { teams, fixture: fixtureData, league, odds } = fixture;
    const homeTeam = teams.home;
    const awayTeam = teams.away;
    const time = new Date(fixtureData.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Determine competition key from league id
    let competitionKey = 'default';
    for (const [key, value] of Object.entries(competitionMap)) {
        if (value === league.id) {
            competitionKey = key;
            break;
        }
    }
    
    // Get prediction and odds
    const prediction = getPrediction(fixture);
    
    // Create card element
    const card = document.createElement('div');
    card.className = 'prediction-card';
    card.dataset.competition = competitionKey;
    
    // Card HTML
    card.innerHTML = `
        <div class="prediction-header">
            <div class="competition">
                <i class="fas ${competitionIcons[competitionKey] || competitionIcons.default}"></i>
                <span>${league.name}</span>
            </div>
            <div class="match-time">${time}</div>
        </div>
        <div class="prediction-content">
            <div class="teams">
                <div class="team">
                    <img src="${homeTeam.logo || '/api/placeholder/60/60'}" alt="${homeTeam.name}" class="team-logo">
                    <div class="team-name">${homeTeam.name}</div>
                </div>
                <div class="vs">VS</div>
                <div class="team">
                    <img src="${awayTeam.logo || '/api/placeholder/60/60'}" alt="${awayTeam.name}" class="team-logo">
                    <div class="team-name">${awayTeam.name}</div>
                </div>
            </div>
            ${prediction.html}
            <div class="prediction-tag">${prediction.tag}</div>
        </div>
    `;
    
    return card;
}

// Generate prediction based on odds
function getPrediction(fixture) {
    // Default prediction if no odds are available
    let predictionText = 'NO PREDICTION';
    let tag = 'Upcoming';
    let html = '<div class="prediction-result">NO PREDICTION</div>';
    
    // Check if odds data is available
    if (fixture.odds && fixture.odds.length > 0) {
        const bookmaker = fixture.odds[0];
        if (bookmaker && bookmaker.bets && bookmaker.bets.length > 0) {
            // Find match winner odds (usually bet ID 1)
            const matchWinnerBet = bookmaker.bets.find(bet => bet.id === 1);
            
            if (matchWinnerBet) {
                const values = matchWinnerBet.values;
                
                // Get home, draw, away odds
                const homeOdds = values.find(v => v.value === 'Home')?.odd;
                const drawOdds = values.find(v => v.value === 'Draw')?.odd;
                const awayOdds = values.find(v => v.value === 'Away')?.odd;
                
                // Determine prediction based on lowest odds (highest probability)
                if (homeOdds && drawOdds && awayOdds) {
                    const homeOddsNum = parseFloat(homeOdds);
                    const drawOddsNum = parseFloat(drawOdds);
                    const awayOddsNum = parseFloat(awayOdds);
                    
                    // Find the lowest odds (highest probability)
                    if (homeOddsNum < drawOddsNum && homeOddsNum < awayOddsNum) {
                        predictionText = 'HOME WIN';
                        tag = homeOddsNum < 1.5 ? 'Safe Bet' : 'Value Bet';
                    } else if (drawOddsNum < homeOddsNum && drawOddsNum < awayOddsNum) {
                        predictionText = 'DRAW';
                        tag = 'Value Bet';
                    } else if (awayOddsNum < homeOddsNum && awayOddsNum < drawOddsNum) {
                        predictionText = 'AWAY WIN';
                        tag = awayOddsNum < 1.8 ? 'Hot Tip' : 'Value Bet';
                    } else if (homeOddsNum < 2.0 && awayOddsNum < 2.0) {
                        predictionText = 'BTTS';
                        tag = 'Goal Fest';
                    } else if (homeOddsNum - awayOddsNum < 0.3) {
                        predictionText = 'HOME OR DRAW';
                        tag = 'Safe Option';
                    } else if (awayOddsNum - homeOddsNum < 0.3) {
                        predictionText = 'AWAY OR DRAW';
                        tag = 'Expert Pick';
                    }
                    
                    // Create HTML with odds
                    html = `
                        <div class="prediction-result">${predictionText}</div>
                        <div class="odds-container">
                            <div class="odds-item">
                                <span>1</span>
                                <span class="odd-value">${homeOdds}</span>
                            </div>
                            <div class="odds-item">
                                <span>X</span>
                                <span class="odd-value">${drawOdds}</span>
                            </div>
                            <div class="odds-item">
                                <span>2</span>
                                <span class="odd-value">${awayOdds}</span>
                            </div>
                        </div>
                    `;
                }
            }
        }
    }
    
    return {
        text: predictionText,
        tag: tag,
        html: html
    };
}

// Render pagination controls
function renderPagination() {
    const totalPages = Math.ceil(filteredFixtures.length / itemsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="page-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="page-btn page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }
    
    // Next button
    paginationHTML += `
        <button class="page-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
    
    // Add event listeners for pagination buttons
    document.querySelectorAll('.page-btn.page-number').forEach(button => {
        button.addEventListener('click', () => {
            currentPage = parseInt(button.dataset.page);
            renderFixtures();
            renderPagination();
        });
    });
    
    document.querySelector('.prev-btn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderFixtures();
            renderPagination();
        }
    });
    
    document.querySelector('.next-btn').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderFixtures();
            renderPagination();
        }
    });
}

// Fetch data from API
async function fetchData(endpoint, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_URL}${endpoint}?${queryParams}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': API_KEY,
                'x-rapidapi-host': 'v3.football.api-sports.io'
            }
        });
        
        const data = await response.json();
        
        // Check for API errors
        if (data.errors && Object.keys(data.errors).length > 0) {
            console.error('API Error:', data.errors);
            throw new Error(Object.values(data.errors).join(', '));
        }
        
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Show loader
function showLoader() {
    // Create loader if it doesn't exist
    if (!document.querySelector('.loader')) {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = '<div class="spinner"></div><p>Loading predictions...</p>';
        document.querySelector('main').appendChild(loader);
    } else {
        document.querySelector('.loader').style.display = 'flex';
    }
}

// Hide loader
function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

// Show error message
function showError(message) {
    predictionsContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
}