document.addEventListener("DOMContentLoaded", () => {
    const liveScoresContainer = document.querySelector(".live-scores");
    const apiKey = "854d271e80bbf4289dcbc0b32cd16782";
    const apiUrl = "https://v3.football.api-sports.io/fixtures?live=all";

    if (!liveScoresContainer) {
        console.error("Error: live-scores container not found.");
        return;
    }

    async function fetchLiveMatches() {
        try {
            const response = await fetch(apiUrl, {
                headers: { "x-apisports-key": apiKey }
            });
            const data = await response.json();
            console.log("API Response:", data); // Debugging

            if (!data.response || data.response.length === 0) {
                liveScoresContainer.innerHTML = "<p>No live matches currently.</p>";
                return;
            }

            displayMatches(data.response);
        } catch (error) {
            console.error("Error fetching live matches:", error);
        }
    }

    function displayMatches(matches) {
        liveScoresContainer.innerHTML = ""; // Clear previous matches
        matches.forEach(match => {
            const matchElement = document.createElement("div");
            matchElement.classList.add("match");

            matchElement.innerHTML = `
            
                <div class="teams">
                    <img class="team-logo" src="${match.teams.home.logo}" alt="${match.teams.home.name}">
                    <span class="score">${match.goals.home} - ${match.goals.away}</span>
                    <img class="team-logo" src="${match.teams.away.logo}" alt="${match.teams.away.name}">
                </div>
                <p class="match-time">${match.fixture.status.elapsed || 0}'</p>
            `;
            liveScoresContainer.appendChild(matchElement);
        });
    }

     // fetchLiveMatches();
    // setInterval(fetchLiveMatches, 30000); // Refresh every 30 seconds
});
