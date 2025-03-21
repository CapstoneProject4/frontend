// Toggle the navigation drawer
function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    drawer.classList.toggle('open');
    document.body.classList.toggle('drawer-open');
}

// Close drawer when clicking outside (optional but recommended)
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.querySelector('.drawer-overlay');
    if (overlay) {
        overlay.addEventListener('click', toggleDrawer);
    }
});