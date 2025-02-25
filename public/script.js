import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    addDoc,
    updateDoc,
    getDoc,
    query,
    onSnapshot,
    collection,
    where,
    getDocs,
    Timestamp,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyB7t1wWHhPYBitqKC4SJ8lqP1WMLDefCxo",
    authDomain: "antocap-referrals.firebaseapp.com",
    projectId: "antocap-referrals",
    storageBucket: "antocap-referrals.appspot.com",
    messagingSenderId: "1071760453747",
    appId: "1:1071760453747:web:fafa7ac624ba7452e6fa06",
    measurementId: "G-EPLJB8MTRH",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Export properly
export { auth, db, doc, getDoc, query, collection, where, getDocs, storage, sendPasswordResetEmail };


// Ensure user is authenticated
export const ensureAuthenticated = () => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
        window.location.href = "/"; // Redirect to login page (adjust URL if necessary)
    } else {
        console.log("User is authenticated");
    }
};


// DOM Content Loaded Event Listener
document.addEventListener("DOMContentLoaded", () => {
    const loginSection = document.getElementById("login-section");
    const signupSection = document.getElementById("signup-section");
    const loginMessage = document.getElementById("login-message");
    const signupMessage = document.getElementById("signup-message");

    const showSignupButton = document.getElementById("show-signup");
    const showLoginButton = document.getElementById("show-login");

    // Password toggle functionality
    const togglePasswordVisibility = (inputId, toggleId) => {
        const input = document.getElementById(inputId);
        const toggleIcon = document.getElementById(toggleId);
        if (input && toggleIcon) {
            toggleIcon.addEventListener("click", () => {
                const type = input.type === "password" ? "text" : "password";
                input.type = type;
                toggleIcon.classList.toggle("fa-eye");
                toggleIcon.classList.toggle("fa-eye-slash");
            });
        }
    };

    togglePasswordVisibility("login-password", "toggle-login-password");
    togglePasswordVisibility("signup-password", "toggle-signup-password");
    togglePasswordVisibility("confirm-password", "toggle-confirm-password");

    if (showSignupButton) {
        showSignupButton.addEventListener("click", () => {
            loginSection.classList.add("hidden");
            signupSection.classList.remove("hidden");
        });
    }

    if (showLoginButton) {
        showLoginButton.addEventListener("click", () => {
            signupSection.classList.add("hidden");
            loginSection.classList.remove("hidden");
        });
    }

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                if (user) {
                    localStorage.setItem("userEmail", email);
                    // Redirect to dashboard after login
                    window.location.href = "/dashboard";
                }
            } catch (error) {
                if (loginMessage) {
                    loginMessage.textContent = error.message;
                    loginMessage.classList.add("error");
                }
            }
        });
    }

    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const firstName = document.getElementById("first-name").value.trim();
            const lastName = document.getElementById("last-name").value.trim();
            const email = document.getElementById("signup-email").value.trim();
            const password = document.getElementById("signup-password").value.trim();
            const confirmPassword = document.getElementById("confirm-password").value.trim();
            const referralCode = document.getElementById("referral-code").value.trim();

            if (password !== confirmPassword) {
                if (signupMessage) {
                    signupMessage.textContent = "Passwords do not match.";
                    signupMessage.classList.add("error");
                }
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                if (user) {
                    // Generate unique referral link
                    const referralLink = `${window.location.origin}/?ref=${user.uid}`;

                    // Save user data to Firestore
                    await setDoc(doc(db, "users", user.uid), {
                        firstName,
                        lastName,
                        email,
                        registeredAt: new Date(),
                    });

                    // Redirect to dashboard
                    window.location.href = "dashboard";
                }
            } catch (error) {
                if (signupMessage) {
                    signupMessage.textContent = error.message;
                    signupMessage.classList.add("error");
                }
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const hamburgerIcon = document.getElementById("hamburger-icon");
    const closeNav = document.getElementById("close-nav");
    const mobileNav = document.getElementById("mobile-nav");
    const overlay = document.getElementById("overlay");

    // Function to toggle mobile navigation
    const toggleNav = () => {
        const isOpen = !mobileNav.classList.contains("-translate-x-full");
        if (isOpen) {
            closeMobileNav();
        } else {
            openNav();
        }
    };

    // Function to open mobile navigation
    const openNav = () => {
        mobileNav.classList.remove("-translate-x-full");
        overlay.classList.remove("hidden");
    };

    // Function to close mobile navigation
    const closeMobileNav = () => {
        mobileNav.classList.add("-translate-x-full");
        overlay.classList.add("hidden");
    };

    // Event Listeners
    hamburgerIcon.addEventListener("click", toggleNav);
    closeNav.addEventListener("click", closeMobileNav);
    overlay.addEventListener("click", closeMobileNav);
    
    // Close mobile menu when clicking anywhere outside
    document.addEventListener("click", (event) => {
        if (
            !mobileNav.contains(event.target) && 
            !hamburgerIcon.contains(event.target) &&
            !mobileNav.classList.contains("-translate-x-full")
        ) {
            closeMobileNav();
        }
    });
});
