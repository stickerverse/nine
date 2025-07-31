// Firebase SDK Integration for Stickerine.com
// This script provides a modern integration with Firebase using the v9+ SDK

// Firebase Services
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqAMSmpYzF7tmJcJH-v1ZjwapSrjhOzKw",
  authDomain: "stickercustom123.firebaseapp.com",
  projectId: "stickercustom123",
  storageBucket: "stickercustom123.firebasestorage.app",
  messagingSenderId: "605457770186",
  appId: "1:605457770186:web:c4822f99c346c0cddbf633",
};

// Initialize Firebase services
let app, auth, db, storage;

// Create a class to handle Firebase initialization and service access
class FirebaseApp {
  constructor() {
    this.initialized = false;
    this.currentUser = null;
    this.authListeners = [];
  }

  // Initialize Firebase app and services
  initialize() {
    if (this.initialized) return;

    try {
      // Initialize Firebase app
      app = initializeApp(firebaseConfig);
      
      // Initialize services
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
      
      // Set up auth state listener
      onAuthStateChanged(auth, (user) => {
        this.currentUser = user;
        
        // Notify all registered auth listeners
        this.authListeners.forEach(listener => {
          listener(user);
        });
        
        console.log("Auth state changed:", user ? `User logged in: ${user.email}` : "User logged out");
      });
      
      this.initialized = true;
      console.log("Firebase initialized successfully");
      
      return true;
    } catch (error) {
      console.error("Firebase initialization error:", error);
      return false;
    }
  }
  
  // Get the initialized services
  getApp() {
    this.ensureInitialized();
    return app;
  }
  
  getAuth() {
    this.ensureInitialized();
    return auth;
  }
  
  getDb() {
    this.ensureInitialized();
    return db;
  }
  
  getStorage() {
    this.ensureInitialized();
    return storage;
  }
  
  // Get the current authenticated user
  getCurrentUser() {
    return this.currentUser;
  }
  
  // Add a listener for auth state changes
  onAuthStateChanged(callback) {
    this.authListeners.push(callback);
    
    // If we already have user info, call the callback immediately
    if (this.initialized && auth) {
      callback(this.currentUser);
    }
    
    // Return a function to unsubscribe
    return () => {
      const index = this.authListeners.indexOf(callback);
      if (index > -1) {
        this.authListeners.splice(index, 1);
      }
    };
  }
  
  // Make sure Firebase is initialized before accessing services
  ensureInitialized() {
    if (!this.initialized) {
      this.initialize();
    }
  }
}

// Create and export a singleton instance
const firebaseApp = new FirebaseApp();
export default firebaseApp;

// Auto-initialize when this script is loaded
firebaseApp.initialize();

// For backwards compatibility with existing code (non-module)
window.firebaseApp = firebaseApp;
