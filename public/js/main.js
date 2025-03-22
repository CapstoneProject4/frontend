document.addEventListener("DOMContentLoaded", async () => {
    console.log("TipsArena Loaded!");

    const apiKey = 
     "";
   // "fa744bffa751a2232b88fce5458224f2"; // Replace with your actual API key

    // 🔹 Major Leagues & International Competitions
    const leagues = [
        "soccer_epl",
        "soccer_spain_la_liga",
        "soccer_germany_bundesliga",
        "soccer_italy_serie_a",
        "soccer_france_ligue_one",
        "soccer_uefa_champs_league",
        "soccer_fifa_world_cup",
        "soccer_uefa_euro",
        "soccer_uefa_nations_league",
        "soccer_africa_cup_of_nations",
        "soccer_copa_america",
        "soccer_fifa_world_cup_qualifiers",
        "soccer_uefa_euro_qualifiers",
        "soccer_africa_cup_of_nations_qualifiers",
        "soccer_copa_america_qualifiers"
    ];

    const liveScoresContainer = document.querySelector(".live-scores");
    const upcomingMatchesContainer = document.querySelector(".upcoming-matches");

    // 🏆 Function to Fetch Live Scores
    async function fetchLiveScores() {
        console.log("Fetching live matches...");
        liveScoresContainer.innerHTML = "<p>Loading live matches...</p>";

        let allMatches = [];

        try {
            for (const league of leagues) {
                const apiUrl = `https://api.the-odds-api.com/v4/sports/${league}/scores/?apiKey=${apiKey}&daysFrom=1`;
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (Array.isArray(data)) {
                    const liveMatches = data.filter(match => match.scores && match.scores.length > 0);
                    allMatches = allMatches.concat(liveMatches);
                }
            }

            liveScoresContainer.innerHTML = ""; 

            if (allMatches.length === 0) {
                liveScoresContainer.innerHTML = "<p>No live matches at the moment.</p>";
                return;
            }

            allMatches.forEach(match => {
                const homeTeam = match.home_team;
                const awayTeam = match.away_team;
                const score = match.scores ? `${match.scores[0]?.score} : ${match.scores[1]?.score}` : "- : -";
                const matchTime = match.commence_time ? new Date(match.commence_time).toLocaleTimeString() : "TBD";
                const leagueName = match.sport_title || "Unknown League";

                const matchCard = document.createElement("div");
                matchCard.classList.add("match-card");
                matchCard.innerHTML = `
                    <div class="league-name">${leagueName}</div>
                    <div class="teams">
                        <div class="team-name">${homeTeam}</div>
                        <div class="score">${score}</div>
                        <div class="team-name">${awayTeam}</div>
                    </div>
                    <div class="match-time">
                        <span>${matchTime}</span>
                    </div>
                `;

                liveScoresContainer.appendChild(matchCard);
            });

        } catch (error) {
            console.error("Error fetching live match data:", error);
            liveScoresContainer.innerHTML = "<p>Failed to load live matches.</p>";
        }
    }

    // ⚽ Function to Fetch Upcoming Matches & Odds
    async function fetchOdds() {
        console.log("Fetching upcoming matches & odds...");
        upcomingMatchesContainer.innerHTML = "<p>Loading odds data...</p>";

        let allOdds = [];

        try {
            for (const league of leagues) {
                const oddsUrl = `https://api.the-odds-api.com/v4/sports/${league}/odds/?regions=eu&markets=h2h&apiKey=${apiKey}`;
                const response = await fetch(oddsUrl);
                const data = await response.json();

                if (Array.isArray(data)) {
                    allOdds = allOdds.concat(data);
                }
            }

            upcomingMatchesContainer.innerHTML = ""; 

            if (allOdds.length === 0) {
                upcomingMatchesContainer.innerHTML = "<p>No upcoming matches available.</p>";
                return;
            }

            // 🕒 Sort matches by date/time (ascending order)
            allOdds.sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time));

            updateUpcomingMatches(allOdds);

        } catch (error) {
            console.error("Error fetching odds data:", error);
            upcomingMatchesContainer.innerHTML = "<p>Failed to load upcoming matches.</p>";
        }
    }

    // 🔢 Function to Update Upcoming Matches Section
    function updateUpcomingMatches(matches) {
        upcomingMatchesContainer.innerHTML = ""; 

        matches.forEach(match => {
            const homeTeam = match.home_team;
            const awayTeam = match.away_team;
            const commenceTime = new Date(match.commence_time).toLocaleString();
            const odds = match.bookmakers[0]?.markets[0]?.outcomes || [];

            const homeOdds = odds.find(o => o.name === homeTeam)?.price || "N/A";
            const drawOdds = odds.find(o => o.name === "Draw")?.price || "N/A";
            const awayOdds = odds.find(o => o.name === awayTeam)?.price || "N/A";

            const matchHTML = `
                <div class="match-item">
                    <div class="match-header">
                        <div class="league-info">
                            <div class="league-dot"></div>
                            <div class="league-name">${match.sport_title || "Unknown League"}</div>
                        </div>
                        <div class="match-time-info">${commenceTime}</div>
                    </div>
                    <div class="match-teams">
                        <div class="team-names">
                            <div class="team-name">${homeTeam}</div>
                            <div class="team-name">${awayTeam}</div>
                        </div>
                        <div class="odds-container">
                            <div class="odd-box">${homeOdds}</div>
                            <div class="odd-box">${drawOdds}</div>
                            <div class="odd-box">${awayOdds}</div>
                        </div>
                    </div>
                </div>
            `;

            upcomingMatchesContainer.innerHTML += matchHTML;
        });
    }

    // 🏁 Fetch Data on Page Load
  //  fetchLiveScores();
    fetchOdds();
});
