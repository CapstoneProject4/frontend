
// Toggle the navigation drawer
function toggleDrawer() {
    const drawer = document.getElementById("drawer");
    const drawerOverlay = document.getElementById("drawer-overlay");
    const body = document.body;

    drawer.classList.toggle("open");
    body.classList.toggle("drawer-open");
}

// Close drawer when clicking outside
document.getElementById('drawer-overlay').addEventListener('click', function() {
    document.getElementById('drawer').classList.remove('open');
    document.body.classList.remove('drawer-open');
});  
fetch("../../components/footer.html")
.then(response => response.text())
.then(data => document.getElementById("footer").innerHTML = data)
.catch(error => console.error("Error loading footer:", error));


const selectedStory = JSON.parse(localStorage.getItem("selectedStory"));

if (selectedStory) {
    document.getElementById("story-title").textContent = selectedStory.title;
    document.getElementById("story-content").textContent = selectedStory.content;
    document.getElementById("story-image").src = selectedStory.image;
    document.getElementById("story-image").alt = selectedStory.title;

    // Handle additional story details dynamically
    const detailsContainer = document.getElementById("story-details");
    detailsContainer.innerHTML = ""; // Clear previous content

    // Author
    if (selectedStory.author) {
        const author = document.createElement("p");
        author.innerHTML = `<strong>Author:</strong> ${selectedStory.author}`;
        detailsContainer.appendChild(author);
    }

    // Source
    if (selectedStory.source) {
        const source = document.createElement("p");
        source.innerHTML = `<strong>Source:</strong> ${selectedStory.source}`;
        detailsContainer.appendChild(source);
    }

    // Published Date
    if (selectedStory.publishedAt) {
        const publishedDate = document.createElement("p");
        publishedDate.innerHTML = `<strong>Published On:</strong> ${new Date(selectedStory.publishedAt).toLocaleDateString()}`;
        detailsContainer.appendChild(publishedDate);
    }

    // Category
    if (selectedStory.category) {
        const category = document.createElement("p");
        category.innerHTML = `<strong>Category:</strong> ${selectedStory.category}`;
        detailsContainer.appendChild(category);
    }

    // Handle paragraphs dynamically
    const paragraphsContainer = document.getElementById("story-paragraphs");
    paragraphsContainer.innerHTML = ""; // Clear previous content

    if (selectedStory.paragraph1) {
        const p1 = document.createElement("p");
        p1.textContent = selectedStory.paragraph1;
        paragraphsContainer.appendChild(p1);
    }

    if (selectedStory.paragraph2) {
        const p2 = document.createElement("p");
        p2.textContent = selectedStory.paragraph2;
        paragraphsContainer.appendChild(p2);
    }

    if (selectedStory.paragraph3) {
        const p3 = document.createElement("p");
        p3.textContent = selectedStory.paragraph3;
        paragraphsContainer.appendChild(p3);
    }

    // Add "Read More" button if article has a URL
    if (selectedStory.url) {
        const readMoreBtn = document.createElement("a");
        readMoreBtn.href = selectedStory.url;
        readMoreBtn.textContent = "Read Full Article";
        readMoreBtn.target = "_blank"; // Open in new tab
        readMoreBtn.classList.add("read-more-btn");
        detailsContainer.appendChild(readMoreBtn);
    }
} else {
    document.querySelector(".storypage").innerHTML = "<p>Story not found.</p>";
}

