// Toggle the navigation drawer
function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const body = document.body;

    drawer.classList.toggle('open');
    body.classList.toggle('drawer-open');
}

// Close drawer when clicking outside
document.getElementById('drawer-overlay').addEventListener('click', function() {
    document.getElementById('drawer').classList.remove('open');
    document.body.classList.remove('drawer-open');
});

// API configuration
const apiKey = "854d271e80bbf4289dcbc0b32cd16782";
const apiUrl = "https://v3.football.api-sports.io/fixtures?live=all";

// Function to fetch live matches
async function fetchLiveMatches() {
    try {
        // Show loading indicator
        document.querySelector('.live-scores').innerHTML = '<div class="loading">Loading live matches...</div>';
        
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "x-apisports-key": apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        if (data.errors.length > 0) {
            throw new Error(`API Error: ${data.errors[0]}`);
        }

        displayMatches(data.response);
    } catch (error) {
        console.error("Error fetching matches:", error);
        document.querySelector('.live-scores').innerHTML = 
            `<div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                Failed to load live matches. Please try again later.
            </div>`;
    }
}

// Function to display matches grouped by league
function displayMatches(matches) {
    const liveScoresContainer = document.querySelector('.live-scores');
    liveScoresContainer.innerHTML = '';
    
    // If no live matches
    if (!matches || matches.length === 0) {
        liveScoresContainer.innerHTML = 
            `<div class="no-matches">
                <i class="fas fa-info-circle"></i>
                No live matches currently in progress.
            </div>`;
        return;
    }

    // Group matches by league
    const leagueGroups = groupMatchesByLeague(matches);
    
    // Create match cards for each league
    Object.keys(leagueGroups).forEach(leagueId => {
        const league = leagueGroups[leagueId].league;
        const leagueMatches = leagueGroups[leagueId].matches;
        
        leagueMatches.forEach(match => {
            const matchCard = createMatchCard(match, league);
            liveScoresContainer.appendChild(matchCard);
        });
    });

    // Start auto-refresh timer
  //  startAutoRefresh();
}

// Group matches by league
function groupMatchesByLeague(matches) {
    const groups = {};
    
    matches.forEach(match => {
        const leagueId = match.league.id;
        
        if (!groups[leagueId]) {
            groups[leagueId] = {
                league: match.league,
                matches: []
            };
        }
        
        groups[leagueId].matches.push(match);
    });
    
    return groups;
}

// Create a match card element
function createMatchCard(match, league) {
    const matchCard = document.createElement('div');
    matchCard.className = 'match-card';
    
    // Determine match status and time
    const elapsed = match.fixture.status.elapsed;
    const statusShort = match.fixture.status.short;
    let timeDisplay = `${elapsed}'`;
    
    if (statusShort === 'HT') {
        timeDisplay = 'HT';
    } else if (statusShort === 'ET') {
        timeDisplay = `ET ${elapsed}'`;
    } else if (statusShort === 'P') {
        timeDisplay = 'Pen';
    }
    
    // Generate stats value (viewers/engagement - simulated)
    const statsValue = Math.floor(Math.random() * 600) + 200;
    
    matchCard.innerHTML = `
        <div class="league-name">${league.name}</div>
        <div class="match-content">
            <div class="teams">
                <div class="team">
                    <img src="${match.teams.home.logo || '/api/placeholder/24/24'}" alt="${match.teams.home.name} Logo" class="team-logo">
                    <span class="team-name">${match.teams.home.name}</span>
                </div>
                <div class="team">
                    <img src="${match.teams.away.logo || '/api/placeholder/24/24'}" alt="${match.teams.away.name} Logo" class="team-logo">
                    <span class="team-name">${match.teams.away.name}</span>
                </div>
            </div>
            <div class="score">
                <span class="score-home">${match.goals.home !== null ? match.goals.home : 0}</span>
                <span class="score-away">${match.goals.away !== null ? match.goals.away : 0}</span>
            </div>
            <div class="match-info">
                <div class="match-time">${timeDisplay}</div>
                <div class="match-stats">
                    <i class="fas fa-chart-bar"></i>
                    <span class="stat-number">${statsValue}</span>
                </div>
            </div>
        </div>
    `;
    
    return matchCard;
}

// Auto-refresh matches every 60 seconds
let refreshTimer;
function startAutoRefresh() {
    // if (refreshTimer) {
    //     clearTimeout(refreshTimer);
    // }
    
    // refreshTimer = setTimeout(() => {
    //     fetchLiveMatches();
    // }, 60000); // 60 seconds
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchLiveMatches();

    // Add refresh button functionality if needed
    const refreshButton = document.createElement('button');
    refreshButton.className = 'refresh-button';
    refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
    refreshButton.addEventListener('click', fetchLiveMatches);
    
    const activeHeader = document.querySelector('.active');
    activeHeader.after(refreshButton);
});