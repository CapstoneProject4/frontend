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


// Football/Soccer News Fetcher
const API_KEY = "ce82bfefafb94d3f96eee7652a5b719a";
const container = document.getElementById("news-container");

// Fetch football news from News API
async function fetchFootballNews() {
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=football OR soccer&language=en&sortBy=publishedAt&apiKey=${API_KEY}`);
        const data = await response.json();

        if (data.status === "ok") {
            displayNews(data.articles);
        } else {
            handleError("Error fetching news", data);
        }
    } catch (error) {
        handleError("Network or API error", error);
    }
}

// Error handling function
function handleError(message, details) {
    console.error(message, details);
    container.innerHTML = `
        <div class="error-message">
            <p>Unable to load news at the moment. Please try again later.</p>
            <small>Technical details: ${message}</small>
        </div>
    `;
}

// Display fetched football news
function displayNews(articles) {
    // Clear existing content
    container.innerHTML = ""; 

    // Filter out incomplete articles more comprehensively
    const validArticles = articles.filter(article => 
        article.urlToImage && 
        article.title && 
        article.description
    );

    // Limit to first 10 articles to prevent overwhelming the page
    validArticles.slice(0, 10).forEach((article) => {
        const story = {
            title: sanitizeHTML(article.title),
            content: sanitizeHTML(article.description),
            paragraph1: sanitizeHTML(article.content || "Read more on the full article."),
            image: article.urlToImage,
            url: article.url,
            source: article.source.name || 'Unknown Source'
        };

        const card = document.createElement("div");
        card.className = "news-card";
        card.innerHTML = `
            <img class="thumbnail" src="${story.image}" alt="${story.title}" loading="lazy">
            <div class="news-content">
                <h3>${story.title}</h3>
                <p class="article-description">${story.content}</p>
                <div class="article-meta">
                    <span class="source-name">${story.source}</span>
                </div>
            </div>
        `;

        card.addEventListener("click", () => {
            localStorage.setItem("selectedStory", JSON.stringify(story));
            window.location.href = "story.html";
        });

        container.appendChild(card);
        container.appendChild(document.createElement("hr"));
    });

    // Add "No news found" message if no articles
    if (validArticles.length === 0) {
        container.innerHTML = `
            <div class="no-news-message">
                <p>No football/soccer news found at the moment.</p>
            </div>
        `;
    }
}

// HTML Sanitization to prevent XSS
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Call fetchFootballNews on page load
document.addEventListener('DOMContentLoaded', fetchFootballNews);

// Optional: Refresh news every 15 minutes
setInterval(fetchFootballNews, 15 * 60 * 1000);

fetch("../../components/footer.html")
.then(response => response.text())
.then(data => document.getElementById("footer").innerHTML = data)
.catch(error => console.error("Error loading footer:", error));


