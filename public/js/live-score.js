document.addEventListener("DOMContentLoaded", () => {
    const liveScoresContainer = document.querySelector("#liveScores");
    const scrollLeftBtn = document.querySelector("#scrollLeft");
    const scrollRightBtn = document.querySelector("#scrollRight");
    
    if (!liveScoresContainer) {
        console.error("Error: #liveScores container not found.");
        return;
    }
    
    // Auto-scroll functionality
    let isHovering = false;
    let autoScrollInterval;
    const scrollSpeed = 1; // pixels per frame
    let scrollPosition = 0;
    const scrollDelay = 30; // milliseconds between scrolls
    
    // Check if content is wider than container to enable auto-scroll
    const shouldAutoScroll = () => {
        return liveScoresContainer.scrollWidth > liveScoresContainer.clientWidth;
    };
    
    // Start auto-scroll if needed
    const startAutoScroll = () => {
        if (shouldAutoScroll() && !isHovering) {
            liveScoresContainer.style.animationPlayState = "running";
        }
    };
    
    // Handle manual scrolling with buttons
    if (scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener("click", () => {
            liveScoresContainer.scrollBy({
                left: -300,
                behavior: "smooth"
            });
            
            // Pause auto-scroll when manually scrolling
            liveScoresContainer.style.animationPlayState = "paused";
            clearTimeout(window.resumeScrollTimeout);
            window.resumeScrollTimeout = setTimeout(() => {
                if (!isHovering) {
                    liveScoresContainer.style.animationPlayState = "running";
                }
            }, 4000);
        });
        
        scrollRightBtn.addEventListener("click", () => {
            liveScoresContainer.scrollBy({
                left: 300,
                behavior: "smooth"
            });
            
            // Pause auto-scroll when manually scrolling
            liveScoresContainer.style.animationPlayState = "paused";
            clearTimeout(window.resumeScrollTimeout);
            window.resumeScrollTimeout = setTimeout(() => {
                if (!isHovering) {
                    liveScoresContainer.style.animationPlayState = "running";
                }
            }, 4000);
        });
    }
    
    // Pause auto-scroll on hover
    liveScoresContainer.addEventListener("mouseenter", () => {
        isHovering = true;
        liveScoresContainer.style.animationPlayState = "paused";
    });
    
    liveScoresContainer.addEventListener("mouseleave", () => {
        isHovering = false;
        if (shouldAutoScroll()) {
            liveScoresContainer.style.animationPlayState = "running";
        }
    });
    
    // Initialize auto-scroll if needed
    if (shouldAutoScroll()) {
        // Calculate animation duration based on content width
        const contentWidth = liveScoresContainer.scrollWidth;
        const containerWidth = liveScoresContainer.clientWidth;
        const scrollDistance = contentWidth - containerWidth;
        
        // Adjust animation duration based on content amount (20s minimum, more for longer content)
        const scrollDuration = Math.max(20, scrollDistance / 50);
        liveScoresContainer.style.animationDuration = `${scrollDuration}s`;
        
        startAutoScroll();
    }
    
    // Mock API fetch implementation
    const apiKey = "b778a3ba40bdde749b267e9707948c28";
    const apiUrl = "https://v3.football.api-sports.io/fixtures?live=all";
    
    async function fetchLiveMatches() {
        try {
            // Uncomment to use actual API in production
            const response = await fetch(apiUrl, {
                headers: { "x-apisports-key": apiKey }
            });
            const data = await response.json();
            console.log(data);
            // For demo purposes, we'll use the existing matches
            updateMatchData(data.response);
            
            // Update match times
            updateMatchTimes();
        } catch (error) {
            console.error("Error fetching live matches:", error);
        }
    }

    // Update match data 
    function updateMatchData(matches) {
        const liveScoresContainer = document.querySelector("#liveScores");
        liveScoresContainer.innerHTML = ""; // Clear previous matches
    
        matches.forEach(match => {
            const matchElement = document.createElement("div");
            matchElement.classList.add("match-card");
    
            matchElement.innerHTML = `
                <div class="match-info">
                    <img src="${match.teams.home.logo}" alt="${match.teams.home.name}">
                    <span>${match.teams.home.name}</span>
                    <span>${match.goals.home} - ${match.goals.away}</span>
                    <span>${match.teams.away.name}</span>
                    <img src="${match.teams.away.logo}" alt="${match.teams.away.name}">
                    <div class="match-time"><span>${match.fixture.status.elapsed || 0}'</span></div>
                </div>
            `;
    
            liveScoresContainer.appendChild(matchElement);
        });
    }
    
    
    // Update match times to simulate real-time updates
    function updateMatchTimes() {
        const liveMatches = document.querySelectorAll(".match-card");
        
        liveMatches.forEach(match => {
            const timeElement = match.querySelector(".match-time span:last-child");
            const statusIndicator = match.querySelector(".status-indicator");
            
            if (timeElement && statusIndicator && statusIndicator.classList.contains("status-live")) {
                let currentMinute = parseInt(timeElement.textContent) || 0;
                
                // Increase minute counter
                if (currentMinute < 90) {
                    currentMinute++;
                    timeElement.textContent = `${currentMinute}'`;
                } else {
                    // End of match
                    timeElement.textContent = "FT";
                    statusIndicator.classList.remove("status-live");
                    statusIndicator.classList.add("status-finished");
                    statusIndicator.innerHTML = "<span>FT</span>";
                    
                    // Remove red dot
                    const redDot = match.querySelector(".red-dot");
                    if (redDot) redDot.remove();
                }
            }
        });
    }
    
    // Update match data every 60 seconds
    fetchLiveMatches();
   // setInterval(fetchLiveMatches, 60000);
    
    // Update match times every second for a more real-time feel
    // setInterval(() => {
    //     const liveMatches = document.querySelectorAll(".status-live");
    //     if (liveMatches.length > 0) {
    //         updateMatchTimes();
    //     }
    // }, 60000);
    
    // Recalculate auto-scroll requirements on window resize
    window.addEventListener("resize", () => {
        if (shouldAutoScroll()) {
            startAutoScroll();
        } else {
            liveScoresContainer.style.animationPlayState = "paused";
        }
    });
});