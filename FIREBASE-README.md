# Firebase Integration for Stickerine.com

This repository contains the Firebase integration for the Stickerine.com website. It provides functionality for user authentication, Firestore database access, and Firebase Storage.

## Setup Options

There are two approaches to integrating Firebase in your website:

### 1. CDN Approach (Recommended for existing websites)

This approach uses the Firebase CDN scripts and compatibility mode, which makes it easier to integrate with existing websites.

```html
<!-- Add these scripts to your HTML file -->
<script src="https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.1.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.1.0/firebase-storage-compat.js"></script>

<!-- Add the Firebase initialization script -->
<script src="assets/firebase-init.js"></script>
```

### 2. ES Module Approach (Recommended for modern applications)

This approach uses ES modules, which offers better tree-shaking and code splitting.

```html
<!-- In your HTML file -->
<script type="module">
  import firebaseApp from './assets/firebase-module.js';
  
  // Initialize Firebase
  firebaseApp.initialize();
  
  // Get services
  const auth = firebaseApp.getAuth();
  const db = firebaseApp.getDb();
  const storage = firebaseApp.getStorage();
  
  // Use Firebase services...
</script>
```

## Testing Firebase Integration

A test page is available at `/firebase-test.html` which allows you to test all Firebase functionality:

1. Firebase Core SDK initialization
2. Firebase Authentication (register, login, logout)
3. Firestore database operations
4. Firebase Storage file uploads

## Usage Examples

### Authentication

```javascript
// Using CDN approach
const auth = window.firebaseAuth;

// Register a new user
auth.createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // User registered successfully
    const user = userCredential.user;
    console.log("New user registered:", user.email);
  })
  .catch((error) => {
    console.error("Registration error:", error);
  });

// Login a user
auth.signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // User logged in successfully
    const user = userCredential.user;
    console.log("User logged in:", user.email);
  })
  .catch((error) => {
    console.error("Login error:", error);
  });

// Logout a user
auth.signOut()
  .then(() => {
    console.log("User logged out");
  })
  .catch((error) => {
    console.error("Logout error:", error);
  });

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User is signed in:", user.email);
  } else {
    console.log("User is signed out");
  }
});
```

### Firestore Database

```javascript
// Using CDN approach
const db = window.firebaseDb;

// Add a document to a collection
db.collection("users").add({
  name: "John Doe",
  email: "john@example.com",
  createdAt: new Date()
})
.then((docRef) => {
  console.log("Document written with ID:", docRef.id);
})
.catch((error) => {
  console.error("Error adding document:", error);
});

// Get documents from a collection
db.collection("users").get()
.then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
})
.catch((error) => {
  console.error("Error getting documents:", error);
});

// Real-time updates
db.collection("users")
  .onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        console.log("New user:", change.doc.data());
      }
      if (change.type === "modified") {
        console.log("Modified user:", change.doc.data());
      }
      if (change.type === "removed") {
        console.log("Removed user:", change.doc.data());
      }
    });
  });
```

### Firebase Storage

```javascript
// Using CDN approach
const storage = window.firebaseStorage;

// Upload a file
const file = document.getElementById('fileInput').files[0];
const storageRef = storage.ref('images/' + file.name);

storageRef.put(file)
  .then((snapshot) => {
    console.log('Uploaded file!');
    return snapshot.ref.getDownloadURL();
  })
  .then((downloadURL) => {
    console.log('File available at', downloadURL);
  })
  .catch((error) => {
    console.error('Upload failed:', error);
  });

// Download a file URL
storage.ref('images/example.jpg').getDownloadURL()
  .then((url) => {
    // Use the URL, e.g., for an image
    document.getElementById('myImage').src = url;
  })
  .catch((error) => {
    console.error('Error getting download URL:', error);
  });
```

## Files

- `assets/firebase-init.js`: CDN-based Firebase initialization script
- `assets/firebase-module.js`: ES Module-based Firebase integration
- `firebase-test.html`: Test page for Firebase functionality

## Security Rules

Don't forget to set up security rules for your Firestore database and Storage bucket in the Firebase console or in your `firestore.rules` and `storage.rules` files.

## Troubleshooting

If you're experiencing issues with Firebase:

1. Check the browser console for error messages
2. Verify that the Firebase scripts are loading correctly
3. Ensure your Firebase project configuration is correct
4. Check if your Firebase project has the necessary services enabled
5. Ensure your security rules allow the operations you're trying to perform
