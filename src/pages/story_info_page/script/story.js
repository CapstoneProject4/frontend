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
            console.error("Error fetching news:", data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Display fetched football news
function displayNews(articles) {
    container.innerHTML = ""; // Clear existing content

    articles.forEach((article) => {
        if (!article.urlToImage || !article.title || !article.description) return; // Skip incomplete articles

        const story = {
            title: article.title,
            content: article.description,
            paragraph1: article.content || "Read more on the full article.",
            image: article.urlToImage,
            url: article.url // Store the URL for redirection
        };

        const card = document.createElement("div");
        card.className = "news-card";
        card.innerHTML = `
            <img class="thumbnail" src="${story.image}" alt="${story.title}">
            <div class="news-content">
                <h3>${story.title}</h3>
                <p>${story.content}</p>
            </div>
        `;

        card.addEventListener("click", () => {
            localStorage.setItem("selectedStory", JSON.stringify(story));
            window.location.href = "story.html";
        });

        container.appendChild(card);
        const hr = document.createElement("hr");
        container.appendChild(hr);
    });
}

// Call fetchFootballNews on page load
fetchFootballNews();

fetch("../../components/footer.html")
.then(response => response.text())
.then(data => document.getElementById("footer").innerHTML = data)
.catch(error => console.error("Error loading footer:", error));


