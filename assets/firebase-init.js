// Firebase SDK Integration for Stickerine.com (Non-module version)
// This script provides a compatibility layer for websites that don't use ES modules

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqAMSmpYzF7tmJcJH-v1ZjwapSrjhOzKw",
  authDomain: "stickercustom123.firebaseapp.com",
  projectId: "stickercustom123",
  storageBucket: "stickercustom123.firebasestorage.app",
  messagingSenderId: "605457770186",
  appId: "1:605457770186:web:c4822f99c346c0cddbf633",
};

// Global Firebase variables
window.firebaseReady = false;
window.firebaseCurrentUser = null;

// Initialize Firebase once loaded
function initializeFirebase() {
  return new Promise((resolve, reject) => {
    try {
      // Initialize Firebase if not already initialized
      if (!window.firebaseApp) {
        console.log("Initializing Firebase...");
        window.firebaseApp = window.firebase.initializeApp(firebaseConfig);
      }
      
      // Initialize services
      window.firebaseAuth = window.firebase.auth();
      window.firebaseDb = window.firebase.firestore();
      window.firebaseStorage = window.firebase.storage();
      
      // Setup auth state listener
      window.firebaseAuth.onAuthStateChanged((user) => {
        window.firebaseCurrentUser = user;
        
        // Dispatch an event for other scripts to listen to
        const event = new CustomEvent('firebaseAuthStateChanged', { detail: { user } });
        document.dispatchEvent(event);
        
        console.log("Auth state changed:", user ? `User logged in: ${user.email}` : "User logged out");
      });
      
      window.firebaseReady = true;
      console.log("Firebase initialized successfully");
      resolve(window.firebaseApp);
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      reject(error);
    }
  });
}

// Helper to check if Firebase is ready
function isFirebaseReady() {
  return window.firebaseReady;
}

// Helper to get the current authenticated user
function getCurrentUser() {
  return window.firebaseCurrentUser;
}

// Add global functions
window.initializeFirebase = initializeFirebase;
window.isFirebaseReady = isFirebaseReady;
window.getCurrentUser = getCurrentUser;

// Auto-initialize when Firebase SDK is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if Firebase SDK is already available
  if (window.firebase) {
    initializeFirebase()
      .then(() => {
        console.log("Firebase ready to use");
        
        // Dispatch an event for other scripts to listen to
        const event = new CustomEvent('firebaseReady', { detail: { firebase: window.firebase } });
        document.dispatchEvent(event);
      })
      .catch(error => {
        console.error("Firebase initialization error:", error);
      });
  } else {
    console.warn("Firebase SDK not loaded. Make sure to include the Firebase SDK script before this script.");
  }
});
