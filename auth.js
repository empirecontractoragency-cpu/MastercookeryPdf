// import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
// import { auth, provider } from "./firebase-config.js";

// BYPASS AUTHENTICATION
export function initAuth() {
    console.log("Auth Module: Bypassing Login...");

    // Simulate a logged-in user
    const dummyUser = {
        displayName: "Chef Sizwe",
        email: "themastercookery@gmail.com",
        photoURL: null
    };

    showApp(dummyUser);

    // Handle Logout (Just reload to "login" which is now hidden, effectively resetting state)
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to exit?")) {
                window.location.reload();
            }
        });
    }
}

function showApp(user) {
    const loginScreen = document.getElementById('login-screen');
    const appContent = document.getElementById('app-content');

    if (loginScreen) loginScreen.classList.add('hidden');
    if (appContent) appContent.classList.remove('hidden');

    const greeting = document.getElementById('greeting-name');
    const profileName = document.getElementById('user-name');

    if (greeting) greeting.textContent = user.displayName;
    if (profileName) profileName.textContent = user.displayName;
}
