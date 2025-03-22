const selectedStory = JSON.parse(localStorage.getItem('selectedStory'));

if (selectedStory) {
    document.getElementById('story-title').textContent = selectedStory.title;
    document.getElementById('story-content').textContent = selectedStory.content;
    document.getElementById('story-image').src = selectedStory.image;
    document.getElementById('story-image').alt = selectedStory.title;

   
    document.getElementById('story-paragraph1').textContent = selectedStory.paragraph1;
    document.getElementById('story-paragraph2').textContent = selectedStory.paragraph2;
    document.getElementById('story-paragraph3').textContent = selectedStory.paragraph3;
}

        else {
            document.querySelector(".storypage").innerHTML = "<p>Story not found.</p>";
        }
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