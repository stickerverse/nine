// Firebase Authentication Integration
document.addEventListener('DOMContentLoaded', function() {
    // Firebase configuration (using the same config from sticker customizer)
    const firebaseConfig = {
        apiKey: "AIzaSyAqAMSmpYzF7tmJcJH-v1ZjwapSrjhOzKw",
        authDomain: "stickercustom123.firebaseapp.com",
        projectId: "stickercustom123",
        storageBucket: "stickercustom123.firebasestorage.app",
        messagingSenderId: "605457770186",
        appId: "1:605457770186:web:c4822f99c346c0cddbf633"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    // Get references to authentication elements
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const googleSignInButton = document.getElementById('google-signin');
    const forgotPasswordLink = document.getElementById('forgot-password');
    const authMessage = document.getElementById('auth-message');
    
    // Display auth messages
    function showMessage(message, type = 'error') {
        authMessage.textContent = message;
        authMessage.className = `auth-message ${type}`;
        authMessage.style.display = 'block';
        
        // Auto hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                authMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    // Check if user is already signed in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            console.log('User is signed in:', user.email);
            
            // If on login or signup page, redirect to home
            const currentPath = window.location.pathname;
            if (currentPath.includes('login.html') || currentPath.includes('signup.html')) {
                window.location.href = '/';
            }
        } else {
            // User is signed out
            console.log('No user is signed in');
        }
    });
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in 
                    showMessage('Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                })
                .catch((error) => {
                    console.error('Login error:', error);
                    showMessage(error.message);
                });
        });
    }
    
    // Handle signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Check if passwords match
            if (password !== confirmPassword) {
                showMessage('Passwords do not match');
                return;
            }
            
            // Create user
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Update profile with name
                    return userCredential.user.updateProfile({
                        displayName: name
                    }).then(() => {
                        // Create user document in Firestore
                        return firebase.firestore().collection('users').doc(userCredential.user.uid).set({
                            name: name,
                            email: email,
                            createdAt: new Date(),
                            orders: []
                        });
                    }).then(() => {
                        showMessage('Account created successfully! Redirecting...', 'success');
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 1500);
                    });
                })
                .catch((error) => {
                    console.error('Signup error:', error);
                    showMessage(error.message);
                });
        });
    }
    
    // Handle Google sign in
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', function() {
            const provider = new firebase.auth.GoogleAuthProvider();
            
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    // Create or update user document in Firestore
                    firebase.firestore().collection('users').doc(result.user.uid).set({
                        name: result.user.displayName,
                        email: result.user.email,
                        photoURL: result.user.photoURL,
                        lastLogin: new Date()
                    }, { merge: true }).then(() => {
                        showMessage('Login successful! Redirecting...', 'success');
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 1500);
                    });
                })
                .catch((error) => {
                    console.error('Google sign in error:', error);
                    showMessage(error.message);
                });
        });
    }
    
    // Handle Forgot Password
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            
            if (!email) {
                showMessage('Please enter your email address');
                return;
            }
            
            firebase.auth().sendPasswordResetEmail(email)
                .then(() => {
                    showMessage('Password reset email sent! Check your inbox.', 'success');
                })
                .catch((error) => {
                    console.error('Password reset error:', error);
                    showMessage(error.message);
                });
        });
    }
});
