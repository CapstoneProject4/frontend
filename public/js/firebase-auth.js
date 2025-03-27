// Import Firebase functions
import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyA34S3iN5GTdAOD0EHoK6dJ6gm2CUzlJlc",
    authDomain: "tipsarena-42368.firebaseapp.com",
    projectId: "tipsarena-42368",
    storageBucket: "tipsarena-42368.firebasestorage.app",
    messagingSenderId: "1074219030083",
    appId: "1:1074219030083:web:50876e5cfbdfbd6cb7e6f6",
    measurementId: "G-E7BBX22YQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("🔥 Firebase initialized successfully:", app);

// Initialize Authentication
const auth = getAuth(app);
console.log("✅ Firebase Authentication ready:", auth);

onAuthStateChanged(auth, (user) => {
    const authButtons = document.querySelector(".auth-buttons");
    
    if (authButtons) {
        if (user) {
            // User is signed in, show profile icon and logout button
            authButtons.innerHTML = `
                <div class="user-profile">
                    <img src="${user.photoURL || '../../assets/profile.png'}" alt="Profile" class="profile-icon">
                   
                </div>
            `;

            // // Add logout event listener
            // document.querySelector(".btn-logout").addEventListener("click", () => {
            //     signOut(auth).then(() => {
            //         console.log("User signed out.");
            //     }).catch((error) => {
            //         console.error("Logout error:", error);
            //     });
            // });

        } else {
            // No user signed in, show sign-up and login buttons
            authButtons.innerHTML = `
                <a href="../src/pages/auth/signup.html" class="btn-signup">Sign Up</a>
                <a href="../src/pages/auth/login.html" class="btn-login">Login</a>
            `;
        }
    } else {
        console.error("❌ Auth buttons container not found.");
    }
});


// Wait until the page has fully loaded
window.addEventListener("load", () => {
    console.log("✅ DOM fully loaded. Attaching event listeners...");

    // Get elements
    const signupBtn = document.getElementById("signup");
    const signinBtn = document.getElementById("signin");
    const signoutBtn = document.getElementById("signout");
    const googleSigninBtn = document.getElementById("google-signin");

    // Input fields
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    // Ensure elements exist before adding event listeners
    if (!signupBtn && !signinBtn && !signoutBtn && !googleSigninBtn) {
        console.error("❌ One or more buttons not found in the DOM. Check your HTML file.");
        return;
    }

    // Sign Up
    if (signupBtn) {
        signupBtn.addEventListener("click", (event) => {
            event.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;

            createUserWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    console.log("✅ User signed up:", userCredential.user);
                    window.location.href = "../../../../public/index.html"; // Redirect
                })
                .catch(error => console.error("❌ Error:", error.message));
        });
    }

    // Sign In
    if (signinBtn) {
        signinBtn.addEventListener("click", (event) => {
            event.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;

            signInWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    console.log("✅ User signed in:", userCredential.user);
                    window.location.href = "../../../../public/index.html"; // Redirect
                })
                .catch(error => console.error("❌ Error:", error.message));
        });
    }

    // Sign Out
    if (signoutBtn) {
        signoutBtn.addEventListener("click", () => {
            signOut(auth)
                .then(() => {
                    console.log("✅ User signed out");
                    window.location.href = "../../../../public/index.html"; // Redirect
                })
                .catch(error => console.error("❌ Error:", error.message));
        });
    }

    // Google Sign-In
    if (googleSigninBtn) {
        const provider = new GoogleAuthProvider();
        googleSigninBtn.addEventListener("click", () => {
            signInWithPopup(auth, provider)
                .then(result => {
                    console.log("✅ User signed in with Google:", result.user);
                    window.location.href = "../../../../public/index.html"; // Redirect
                })
                .catch(error => console.error("❌ Error:", error.message));
        });
    }

    // Monitor Authentication State
    onAuthStateChanged(auth, user => {
        if (user) {
            console.log("✅ User is logged in:", user);
        } else {
            console.log("ℹ️ No user is logged in");
        }
    });
});
