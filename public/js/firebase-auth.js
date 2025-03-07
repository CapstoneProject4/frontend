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
try {
    const app = initializeApp(firebaseConfig);
    console.log("🔥 Firebase has been initialized successfully:", app);
    
    // Initialize Auth
    const auth = getAuth(app);
    console.log("✅ Firebase Authentication is ready:", auth);

    // Wait until DOM is fully loaded
    document.addEventListener("DOMContentLoaded", () => {
        // Get Elements
        const signupBtn = document.getElementById("signup");
        const signinBtn = document.getElementById("signin");
        const signoutBtn = document.getElementById("signout");
        const googleSigninBtn = document.getElementById("google-signin");

        if (!signupBtn || !signinBtn || !signoutBtn || !googleSigninBtn) {
            console.error("❌ One or more buttons not found in the DOM.");
            return;
        }

        // Sign Up
        signupBtn.addEventListener("click", () => {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            createUserWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    console.log("✅ User signed up:", userCredential.user);
                })
                .catch(error => {
                    console.error("❌ Error:", error.message);
                });
        });

        // Sign In
        signinBtn.addEventListener("click", () => {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            signInWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    console.log("✅ User signed in:", userCredential.user);
                })
                .catch(error => {
                    console.error("❌ Error:", error.message);
                });
        });

        // Sign Out
        signoutBtn.addEventListener("click", () => {
            signOut(auth)
                .then(() => {
                    console.log("✅ User signed out");
                })
                .catch(error => {
                    console.error("❌ Error:", error.message);
                });
        });

        // Google Sign-In
        const provider = new GoogleAuthProvider();
        googleSigninBtn.addEventListener("click", () => {
            signInWithPopup(auth, provider)
                .then(result => {
                    console.log("✅ User signed in with Google:", result.user);
                })
                .catch(error => {
                    console.error("❌ Error:", error.message);
                });
        });

        // Monitor Authentication State
        onAuthStateChanged(auth, user => {
            if (user) {
                console.log("✅ User is logged in:", user);
            } else {
                console.log("ℹ️ No user is logged in");
            }
        });
    });

} catch (error) {
    console.error("❌ Firebase initialization failed:", error);
}
