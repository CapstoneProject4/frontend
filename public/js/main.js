
document.addEventListener("DOMContentLoaded", async () => {
    console.log("TipsArena Enhanced Upcoming Matches Loaded!");
    const upcomingMatchesContainer = document.querySelector("#upcomingMatches");
    const filterButtons = document.querySelectorAll(".filter-btn");
    
    // Setup filter buttons
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove("active"));
                // Add active class to clicked button
                button.classList.add("active");
                
                // Filter matches based on selected option
                filterMatches(button.textContent.toLowerCase());
            });
        });
    }
    
    // Function to filter matches
    function filterMatches(filter) {
        // Show loading state
        upcomingMatchesContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⏳</div>
                <div class="empty-state-text">Loading matches...</div>
            </div>
        `;
        
        // In production, this would filter matches from the API
        // For now, we'll just use our sample data with a delay to simulate API call
        setTimeout(() => {
            fetchOddsFromAPI(filter);
        }, 500);
    }
    
    // Function to update the upcoming matches with data from API
    function updateUpcomingMatches(matches = []) {
        // Clear the container first
        upcomingMatchesContainer.innerHTML = "";
        
        if (matches.length === 0) {
            upcomingMatchesContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📅</div>
                    <div class="empty-state-text">No matches found</div>
                    <div class="empty-state-subtext">Try changing your filter or check back later for new matches.</div>
                </div>
            `;
            return;
        }
        
        // Add each match to the container
        matches.forEach(match => {
            const matchHTML = createMatchItemHTML(match);
            upcomingMatchesContainer.insertAdjacentHTML('beforeend', matchHTML);
        });
        
        // Add view more button
        upcomingMatchesContainer.insertAdjacentHTML('beforeend', `
            <div class="view-more-btn">
                View More Matches
            </div>
        `);
        
        // Add event listeners to the odds boxes
        setupOddsBoxes();
        
        // Add event listener to view more button
        setupViewMoreButton();
    }
    
    // Function to setup odds boxes click events
    function setupOddsBoxes() {
        const oddBoxes = document.querySelectorAll(".odd-box");
        oddBoxes.forEach(box => {
            box.addEventListener("click", function() {
                // Toggle active class
                const isAlreadyActive = this.classList.contains("active");
                
                // Remove active from siblings
                const parent = this.closest(".odds-container");
                parent.querySelectorAll(".odd-box").forEach(sibling => {
                    sibling.classList.remove("active");
                });
                
                // Add active class if it wasn't already active
                if (!isAlreadyActive) {
                    this.classList.add("active");
                }
            });
        });
    }
    
    // Function to setup view more button
    function setupViewMoreButton() {
        const viewMoreBtn = document.querySelector(".view-more-btn");
        if (viewMoreBtn) {
            viewMoreBtn.addEventListener("click", function() {
                // Show loading state
                this.textContent = "Loading...";
                
                // In production, this would load more matches from your API
                // For now, we'll just use a delay to simulate API call
                setTimeout(() => {
                    this.textContent = "No more matches available";
                    this.style.color = "#94a3b8";
                    this.style.cursor = "default";
                    this.style.pointerEvents = "none";
                }, 800);
            });
        }
    }
    
    // Function to create a match item HTML - simplified to only use odds API data
    function createMatchItemHTML(match) {
        // Create tag based on league
        const leagueTag = getLeagueTag(match.league);
        
        return `
            <div class="match-item">
                <div class="match-header">
                    <div class="league-info">
                        <div class="league-dot" style="background-color: ${match.leagueColor};"></div>
                        <div class="league-name">${match.league}</div>
                        ${leagueTag}
                    </div>
                    <div class="match-time-info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>${match.time}</span>
                        <span class="match-date">${match.date}</span>
                    </div>
                </div>
                
                <div class="match-teams">
                    <div class="team-names">
                        <div class="team-name">
                           
                            ${match.homeTeam}
                        </div>
                        <div class="team-name">
                          
                            ${match.awayTeam}
                        </div>
                    </div>
                    
                    <div class="odds-container">
                        <div class="odd-box">
                            <span class="odd-label">1</span>
                            ${match.homeOdds}
                        </div>
                        <div class="odd-box">
                            <span class="odd-label">X</span>
                            ${match.drawOdds}
                        </div>
                        <div class="odd-box">
                            <span class="odd-label">2</span>
                            ${match.awayOdds}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Helper function to get league tag HTML
    function getLeagueTag(leagueName) {
        if (leagueName.includes("Champions League")) {
            return '<span class="league-tag tag-cl">UCL</span>';
        } else if (leagueName.includes("Europa League")) {
            return '<span class="league-tag tag-el">UEL</span>';
        } else if (leagueName.includes("Premier League")) {
            return '<span class="league-tag tag-pl">EPL</span>';
        } else if (leagueName.includes("La Liga")) {
            return '<span class="league-tag tag-laliga">ESP</span>';
        } else if (leagueName.includes("Bundesliga")) {
            return '<span class="league-tag tag-bundesliga">GER</span>';
        } else if (leagueName.includes("Ligue 1")) {
            return '<span class="league-tag tag-pl">FRA</span>';
        } else if (leagueName.includes("Serie A")) {
            return '<span class="league-tag tag-el">ITA</span>';
        }
        
        return '';
    }
    
    // Function to fetch odds from API
    async function fetchOddsFromAPI(filter = "all") {
        console.log("Fetching upcoming matches & odds...");
        
        // For demo purposes, we'll use sample data
        // In production, replace this with actual API call
        const apiKey = "fa744bffa751a2232b88fce5458224f2"; // Your API key here
        
        // Sample data to mimic API response
        const sampleData = [
            {
                id: "1",
                sport_key: "soccer_uefa_champs_league",
                sport_title: "Champions League, Group B",
                commence_time: "2025-03-24T11:45:00Z",
                home_team: "Porto",
                away_team: "Liverpool FC",
                bookmakers: [{
                    markets: [{
                        outcomes: [
                            { name: "Porto", price: 3.74 },
                            { name: "Draw", price: 3.85 },
                            { name: "Liverpool FC", price: 1.95 }
                        ]
                    }]
                }]
            },
            {
                id: "2",
                sport_key: "soccer_turkey_super_lig",
                sport_title: "Super Lig",
                commence_time: "2025-03-24T16:45:00Z",
                home_team: "Galatasaray",
                away_team: "Besiktas",
                bookmakers: [{
                    markets: [{
                        outcomes: [
                            { name: "Galatasaray", price: 2.05 },
                            { name: "Draw", price: 3.40 },
                            { name: "Besiktas", price: 3.70 }
                        ]
                    }]
                }]
            },
            {
                id: "3",
                sport_key: "soccer_epl",
                sport_title: "Premier League",
                commence_time: "2025-03-25T14:00:00Z",
                home_team: "Arsenal",
                away_team: "Manchester City",
                bookmakers: [{
                    markets: [{
                        outcomes: [
                            { name: "Arsenal", price: 2.90 },
                            { name: "Draw", price: 3.45 },
                            { name: "Manchester City", price: 2.40 }
                        ]
                    }]
                }]
            },
            {
                id: "4",
                sport_key: "soccer_spain_la_liga",
                sport_title: "La Liga",
                commence_time: "2025-03-25T19:00:00Z",
                home_team: "Barcelona",
                away_team: "Real Madrid",
                bookmakers: [{
                    markets: [{
                        outcomes: [
                            { name: "Barcelona", price: 2.20 },
                            { name: "Draw", price: 3.50 },
                            { name: "Real Madrid", price: 3.00 }
                        ]
                    }]
                }]
            }
        ];
        
        // Format the data for our UI
        let formattedMatches = formatAPIData(sampleData);
        
        // Apply filters
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todayString = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const tomorrowString = tomorrow.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        if (filter === "today") {
            formattedMatches = formattedMatches.filter(match => match.date === todayString);
        } else if (filter === "tomorrow") {
            formattedMatches = formattedMatches.filter(match => match.date === tomorrowString);
        } else if (filter === "popular") {
            formattedMatches = formattedMatches.filter(match => 
                match.league.includes("Champions League") || 
                match.league.includes("Premier League") ||
                match.homeTeam === "Barcelona" || 
                match.awayTeam === "Real Madrid"
            );
        }
        
        // Update the UI with our matches
        updateUpcomingMatches(formattedMatches);
        
        
        // In production, uncomment this section and use actual API calls
        try {
            const leagues = [
                    // European Leagues
    "soccer_epl",                   // English Premier League
    "soccer_spain_la_liga",         // Spanish La Liga
    "soccer_germany_bundesliga",    // German Bundesliga
    "soccer_italy_serie_a",         // Italian Serie A
    "soccer_france_ligue_one",      // French Ligue 1
    "soccer_netherlands_eredivisie", // Dutch Eredivisie
    "soccer_portugal_primeira_liga", // Portuguese Primeira Liga
    "soccer_turkey_super_lig",      // Turkish Super Lig

    // Middle Eastern Leagues
    "soccer_saudi_arabia_league",   // Saudi Professional League

    // International Competitions - European
    "soccer_uefa_euro_qualification", // Euro 2024 Qualifiers
    "soccer_uefa_nations_league",   // UEFA Nations League
    "soccer_uefa_champs_league",    // UEFA Champions League
    "soccer_uefa_europa_league",    // UEFA Europa League
    "soccer_uefa_europa_conference_league", // UEFA Europa Conference League

    // International Competitions - Global and Regional
    "soccer_fifa_world_cup_qualification", // World Cup Qualifiers
    "soccer_fifa_world_cup",        // FIFA World Cup
    "soccer_copa_libertadores",     // Copa Libertadores
    "soccer_copa_america"    
            ];
            
            let allOdds = [];
            
            for (const league of leagues) {
                const oddsUrl = `https://api.the-odds-api.com/v4/sports/${league}/odds/?regions=eu&markets=h2h&apiKey=${apiKey}`;
                const response = await fetch(oddsUrl);
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    allOdds = allOdds.concat(data);
                }
            }
            
            // Sort matches by date/time
            allOdds.sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time));
            
            // Apply filters
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            if (filter === "today") {
                allOdds = allOdds.filter(match => {
                    const matchDate = new Date(match.commence_time);
                    return matchDate.getDate() === today.getDate() && 
                           matchDate.getMonth() === today.getMonth() &&
                           matchDate.getFullYear() === today.getFullYear();
                });
            } else if (filter === "tomorrow") {
                allOdds = allOdds.filter(match => {
                    const matchDate = new Date(match.commence_time);
                    return matchDate.getDate() === tomorrow.getDate() && 
                           matchDate.getMonth() === tomorrow.getMonth() &&
                           matchDate.getFullYear() === tomorrow.getFullYear();
                });
            } else if (filter === "popular") {
                allOdds = allOdds.filter(match => 
                    match.sport_key.includes("champions_league") || 
                    match.sport_key.includes("epl") ||
                    match.home_team === "Barcelona" || 
                    match.away_team === "Real Madrid"
                );
            }
            
            // Convert API data to our format and update matches
            const formattedMatches = formatAPIData(allOdds);
            updateUpcomingMatches(formattedMatches);
            
        } catch (error) {
            console.error("Error fetching odds data:", error);
            upcomingMatchesContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">❌</div>
                    <div class="empty-state-text">Failed to load matches</div>
                    <div class="empty-state-subtext">Please try again later.</div>
                </div>
            `;
        }
        
    }
    
    // Function to format API data for our UI
    function formatAPIData(apiMatches) {
        return apiMatches.map(match => {
            const homeTeam = match.home_team;
            const awayTeam = match.away_team;
            const matchDate = new Date(match.commence_time);
            const odds = match.bookmakers[0]?.markets[0]?.outcomes || [];
            
            const homeOdds = odds.find(o => o.name === homeTeam)?.price.toFixed(2) || "N/A";
            const drawOdds = odds.find(o => o.name === "Draw")?.price.toFixed(2) || "N/A";
            const awayOdds = odds.find(o => o.name === awayTeam)?.price.toFixed(2) || "N/A";
            
            // Determine league color based on league name
            let leagueColor = "#64748b"; // Default color
            if (match.sport_key.includes("champions_league")) {
                leagueColor = "#2563eb";
            } else if (match.sport_key.includes("epl")) {
                leagueColor = "#10b981";
            } else if (match.sport_key.includes("la_liga")) {
                leagueColor = "#d97706";
            } else if (match.sport_key.includes("bundesliga")) {
                leagueColor = "#ef4444";
            } else if (match.sport_key.includes("super_lig")) {
                leagueColor = "#ef4444";
            }
            
            return {
                homeTeam: homeTeam,
                awayTeam: awayTeam,
                league: match.sport_title || "Unknown League",
                leagueColor: leagueColor,
                time: matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: matchDate.toLocaleDateString([], { month: 'short', day: 'numeric' }),
                homeOdds: homeOdds,
                drawOdds: drawOdds,
                awayOdds: awayOdds
            };
        });
    }
    
    // Initialize with all matches
    fetchOddsFromAPI();
});