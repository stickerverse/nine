// Profile Management Script
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
    
    // Get references
    const db = firebase.firestore();
    const auth = firebase.auth();
    
    // References to elements
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    const userAvatarElement = document.getElementById('user-avatar');
    const logoutButton = document.getElementById('logout-btn');
    const profileNavLinks = document.querySelectorAll('.profile-nav a');
    const profileSections = document.querySelectorAll('.profile-section');
    
    // Account form
    const accountForm = document.getElementById('account-form');
    const profileNameInput = document.getElementById('profile-name');
    const profileEmailInput = document.getElementById('profile-email');
    const profilePhoneInput = document.getElementById('profile-phone');
    const profileBirthdayInput = document.getElementById('profile-birthday');
    
    // Password form
    const passwordForm = document.getElementById('password-form');
    
    // Orders section
    const ordersListElement = document.getElementById('orders-list');
    const noOrdersElement = document.getElementById('no-orders');
    
    // Designs section
    const designsGridElement = document.getElementById('designs-grid');
    const noDesignsElement = document.getElementById('no-designs');
    
    // Addresses section
    const addressesListElement = document.getElementById('addresses-list');
    const addAddressButton = document.getElementById('add-address-btn');
    const addressFormContainer = document.getElementById('address-form-container');
    const addressForm = document.getElementById('address-form');
    const cancelAddressButton = document.getElementById('cancel-address-btn');
    
    // Payment methods section
    const paymentMethodsListElement = document.getElementById('payment-methods-list');
    const addPaymentButton = document.getElementById('add-payment-btn');
    const paymentFormContainer = document.getElementById('payment-form-container');
    const paymentForm = document.getElementById('payment-form');
    const cancelPaymentButton = document.getElementById('cancel-payment-btn');
    
    // Check if user is authenticated
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in, load profile data
            loadUserProfile(user);
            loadOrders(user);
            loadSavedDesigns(user);
            loadAddresses(user);
            loadPaymentMethods(user);
        } else {
            // User is not signed in, redirect to login
            window.location.href = '/login.html';
        }
    });
    
    // Load user profile
    function loadUserProfile(user) {
        userNameElement.textContent = user.displayName || 'User';
        userEmailElement.textContent = user.email;
        
        if (user.photoURL) {
            userAvatarElement.src = user.photoURL;
        }
        
        // Load additional profile data from Firestore
        db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    
                    // Update profile form
                    profileNameInput.value = userData.name || user.displayName || '';
                    profileEmailInput.value = user.email;
                    profilePhoneInput.value = userData.phone || '';
                    profileBirthdayInput.value = userData.birthday || '';
                }
            })
            .catch((error) => {
                console.error('Error loading user data:', error);
            });
    }
    
    // Load orders
    function loadOrders(user) {
        db.collection('orders')
            .where('userId', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .get()
            .then((snapshot) => {
                if (snapshot.empty) {
                    ordersListElement.style.display = 'none';
                    noOrdersElement.style.display = 'block';
                    return;
                }
                
                ordersListElement.innerHTML = ''; // Clear loading indicator
                noOrdersElement.style.display = 'none';
                
                snapshot.forEach((doc) => {
                    const order = doc.data();
                    const orderDate = new Date(order.createdAt.seconds * 1000);
                    
                    const orderCard = document.createElement('div');
                    orderCard.className = 'order-card';
                    
                    const orderStatusClass = getStatusClass(order.status);
                    
                    orderCard.innerHTML = `
                        <div class="order-header">
                            <div class="order-info">
                                <span class="order-number">Order #${doc.id}</span>
                                <span class="order-date">${orderDate.toLocaleDateString()}</span>
                            </div>
                            <div class="order-status ${orderStatusClass}">${order.status}</div>
                        </div>
                        
                        <div class="order-items">
                            ${order.items.map(item => `
                                <div class="order-item">
                                    <div class="order-item-image">
                                        <img src="${item.imageUrl || 'assets/placeholder-product.png'}" alt="${item.name}">
                                    </div>
                                    <div class="order-item-details">
                                        <div class="order-item-name">${item.name}</div>
                                        <div class="order-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="order-total">
                            <span>Total</span>
                            <span>$${order.total.toFixed(2)}</span>
                        </div>
                        
                        <div class="order-actions">
                            <button class="btn btn-outline" data-order-id="${doc.id}">Track Order</button>
                            ${order.status === 'processing' ? `<button class="btn btn-outline" data-order-id="${doc.id}" data-action="cancel">Cancel Order</button>` : ''}
                        </div>
                    `;
                    
                    ordersListElement.appendChild(orderCard);
                });
            })
            .catch((error) => {
                console.error('Error loading orders:', error);
                ordersListElement.innerHTML = '<div class="error-message">Failed to load orders. Please try again later.</div>';
            });
    }
    
    // Get status class for order
    function getStatusClass(status) {
        switch(status.toLowerCase()) {
            case 'processing': return 'processing';
            case 'shipped': return 'shipped';
            case 'delivered': return 'delivered';
            case 'cancelled': return 'cancelled';
            default: return '';
        }
    }
    
    // Load saved designs
    function loadSavedDesigns(user) {
        db.collection('designs')
            .where('userId', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .get()
            .then((snapshot) => {
                if (snapshot.empty) {
                    designsGridElement.style.display = 'none';
                    noDesignsElement.style.display = 'block';
                    return;
                }
                
                designsGridElement.innerHTML = ''; // Clear loading indicator
                noDesignsElement.style.display = 'none';
                
                snapshot.forEach((doc) => {
                    const design = doc.data();
                    const designDate = new Date(design.createdAt.seconds * 1000);
                    
                    const designCard = document.createElement('div');
                    designCard.className = 'design-card';
                    
                    designCard.innerHTML = `
                        <div class="design-image">
                            <img src="${design.imageUrl || 'assets/placeholder-design.png'}" alt="${design.name}">
                        </div>
                        <div class="design-info">
                            <h3 class="design-title">${design.name}</h3>
                            <p class="design-date">${designDate.toLocaleDateString()}</p>
                        </div>
                        <div class="design-actions">
                            <button data-design-id="${doc.id}" data-action="edit">Edit</button>
                            <button data-design-id="${doc.id}" data-action="order">Order</button>
                            <button data-design-id="${doc.id}" data-action="delete">Delete</button>
                        </div>
                    `;
                    
                    designsGridElement.appendChild(designCard);
                });
            })
            .catch((error) => {
                console.error('Error loading designs:', error);
                designsGridElement.innerHTML = '<div class="error-message">Failed to load designs. Please try again later.</div>';
            });
    }
    
    // Load addresses
    function loadAddresses(user) {
        db.collection('users').doc(user.uid).collection('addresses')
            .get()
            .then((snapshot) => {
                addressesListElement.innerHTML = '';
                
                if (snapshot.empty) {
                    addressesListElement.innerHTML = '<p>No addresses saved yet.</p>';
                    return;
                }
                
                snapshot.forEach((doc) => {
                    const address = doc.data();
                    
                    const addressCard = document.createElement('div');
                    addressCard.className = `address-card${address.isDefault ? ' default' : ''}`;
                    
                    addressCard.innerHTML = `
                        ${address.isDefault ? '<div class="default-badge">Default</div>' : ''}
                        <div class="address-name">${address.name}</div>
                        <div class="address-details">
                            ${address.line1}<br>
                            ${address.line2 ? address.line2 + '<br>' : ''}
                            ${address.city}, ${address.state} ${address.zip}<br>
                            ${address.country}
                        </div>
                        <div class="address-actions">
                            <button data-address-id="${doc.id}" data-action="edit">Edit</button>
                            <button data-address-id="${doc.id}" data-action="delete">Delete</button>
                            ${!address.isDefault ? `<button data-address-id="${doc.id}" data-action="default">Set as Default</button>` : ''}
                        </div>
                    `;
                    
                    addressesListElement.appendChild(addressCard);
                });
                
                // Add event listeners
                document.querySelectorAll('.address-actions button').forEach(button => {
                    button.addEventListener('click', handleAddressAction);
                });
            })
            .catch((error) => {
                console.error('Error loading addresses:', error);
                addressesListElement.innerHTML = '<div class="error-message">Failed to load addresses. Please try again later.</div>';
            });
    }
    
    // Handle address actions (edit, delete, set as default)
    function handleAddressAction(event) {
        const action = event.target.getAttribute('data-action');
        const addressId = event.target.getAttribute('data-address-id');
        const userId = auth.currentUser.uid;
        
        switch(action) {
            case 'edit':
                // Load address data into form
                db.collection('users').doc(userId).collection('addresses').doc(addressId)
                    .get()
                    .then((doc) => {
                        if (doc.exists) {
                            const address = doc.data();
                            
                            document.getElementById('address-id').value = addressId;
                            document.getElementById('address-form-title').textContent = 'Edit Address';
                            document.getElementById('address-name').value = address.name || '';
                            document.getElementById('address-line1').value = address.line1 || '';
                            document.getElementById('address-line2').value = address.line2 || '';
                            document.getElementById('address-city').value = address.city || '';
                            document.getElementById('address-state').value = address.state || '';
                            document.getElementById('address-zip').value = address.zip || '';
                            document.getElementById('address-country').value = address.country || 'US';
                            document.getElementById('address-default').checked = address.isDefault;
                            
                            addressFormContainer.style.display = 'block';
                            window.scrollTo(0, addressFormContainer.offsetTop - 50);
                        }
                    });
                break;
                
            case 'delete':
                if (confirm('Are you sure you want to delete this address?')) {
                    db.collection('users').doc(userId).collection('addresses').doc(addressId)
                        .delete()
                        .then(() => {
                            alert('Address deleted successfully');
                            loadAddresses(auth.currentUser);
                        })
                        .catch((error) => {
                            console.error('Error deleting address:', error);
                            alert('Failed to delete address. Please try again.');
                        });
                }
                break;
                
            case 'default':
                db.collection('users').doc(userId).collection('addresses').doc(addressId)
                    .update({ isDefault: true })
                    .then(() => {
                        // Remove default from other addresses
                        return db.collection('users').doc(userId).collection('addresses')
                            .where('isDefault', '==', true)
                            .where(firebase.firestore.FieldPath.documentId(), '!=', addressId)
                            .get();
                    })
                    .then((snapshot) => {
                        // Batch update to remove isDefault from other addresses
                        const batch = db.batch();
                        snapshot.forEach(doc => {
                            batch.update(doc.ref, { isDefault: false });
                        });
                        return batch.commit();
                    })
                    .then(() => {
                        alert('Default address updated');
                        loadAddresses(auth.currentUser);
                    })
                    .catch((error) => {
                        console.error('Error updating default address:', error);
                        alert('Failed to update default address. Please try again.');
                    });
                break;
        }
    }
    
    // Load payment methods
    function loadPaymentMethods(user) {
        db.collection('users').doc(user.uid).collection('paymentMethods')
            .get()
            .then((snapshot) => {
                paymentMethodsListElement.innerHTML = '';
                
                if (snapshot.empty) {
                    paymentMethodsListElement.innerHTML = '<p>No payment methods saved yet.</p>';
                    return;
                }
                
                snapshot.forEach((doc) => {
                    const paymentMethod = doc.data();
                    
                    // Get card type
                    const cardType = getCardType(paymentMethod.cardNumber);
                    
                    const paymentCard = document.createElement('div');
                    paymentCard.className = `payment-card${paymentMethod.isDefault ? ' default' : ''}`;
                    
                    paymentCard.innerHTML = `
                        ${paymentMethod.isDefault ? '<div class="default-badge">Default</div>' : ''}
                        <img src="assets/${cardType.toLowerCase()}.svg" alt="${cardType}" class="card-brand">
                        <div class="card-number">**** **** **** ${paymentMethod.cardNumber.slice(-4)}</div>
                        <div class="card-holder">${paymentMethod.cardHolder}</div>
                        <div class="card-expiry">Expires: ${paymentMethod.expiryMonth}/${paymentMethod.expiryYear}</div>
                        <div class="payment-actions">
                            <button data-payment-id="${doc.id}" data-action="edit">Edit</button>
                            <button data-payment-id="${doc.id}" data-action="delete">Delete</button>
                            ${!paymentMethod.isDefault ? `<button data-payment-id="${doc.id}" data-action="default">Set as Default</button>` : ''}
                        </div>
                    `;
                    
                    paymentMethodsListElement.appendChild(paymentCard);
                });
                
                // Add event listeners
                document.querySelectorAll('.payment-actions button').forEach(button => {
                    button.addEventListener('click', handlePaymentAction);
                });
            })
            .catch((error) => {
                console.error('Error loading payment methods:', error);
                paymentMethodsListElement.innerHTML = '<div class="error-message">Failed to load payment methods. Please try again later.</div>';
            });
    }
    
    // Get card type based on card number
    function getCardType(cardNumber) {
        const number = cardNumber.replace(/\s+/g, '');
        
        // Very basic detection - would be more robust in production
        if (number.startsWith('4')) {
            return 'Visa';
        } else if (/^5[1-5]/.test(number)) {
            return 'Mastercard';
        } else if (/^3[47]/.test(number)) {
            return 'Amex';
        } else {
            return 'Card';
        }
    }
    
    // Handle payment actions (edit, delete, set as default)
    function handlePaymentAction(event) {
        const action = event.target.getAttribute('data-action');
        const paymentId = event.target.getAttribute('data-payment-id');
        const userId = auth.currentUser.uid;
        
        switch(action) {
            case 'edit':
                // Load payment data into form
                db.collection('users').doc(userId).collection('paymentMethods').doc(paymentId)
                    .get()
                    .then((doc) => {
                        if (doc.exists) {
                            const paymentMethod = doc.data();
                            
                            // Form doesn't store actual card info for security,
                            // just the display information
                            document.getElementById('payment-form-title').textContent = 'Edit Payment Method';
                            document.getElementById('card-holder').value = paymentMethod.cardHolder || '';
                            
                            // Not showing full card number, only last 4 digits as placeholder
                            document.getElementById('card-number').placeholder = `**** **** **** ${paymentMethod.cardNumber.slice(-4)}`;
                            document.getElementById('card-expiry').placeholder = `${paymentMethod.expiryMonth}/${paymentMethod.expiryYear}`;
                            document.getElementById('payment-default').checked = paymentMethod.isDefault;
                            
                            // Store payment ID in a hidden field
                            const paymentIdField = document.createElement('input');
                            paymentIdField.type = 'hidden';
                            paymentIdField.id = 'payment-id';
                            paymentIdField.name = 'payment-id';
                            paymentIdField.value = paymentId;
                            paymentForm.appendChild(paymentIdField);
                            
                            paymentFormContainer.style.display = 'block';
                            window.scrollTo(0, paymentFormContainer.offsetTop - 50);
                        }
                    });
                break;
                
            case 'delete':
                if (confirm('Are you sure you want to delete this payment method?')) {
                    db.collection('users').doc(userId).collection('paymentMethods').doc(paymentId)
                        .delete()
                        .then(() => {
                            alert('Payment method deleted successfully');
                            loadPaymentMethods(auth.currentUser);
                        })
                        .catch((error) => {
                            console.error('Error deleting payment method:', error);
                            alert('Failed to delete payment method. Please try again.');
                        });
                }
                break;
                
            case 'default':
                db.collection('users').doc(userId).collection('paymentMethods').doc(paymentId)
                    .update({ isDefault: true })
                    .then(() => {
                        // Remove default from other payment methods
                        return db.collection('users').doc(userId).collection('paymentMethods')
                            .where('isDefault', '==', true)
                            .where(firebase.firestore.FieldPath.documentId(), '!=', paymentId)
                            .get();
                    })
                    .then((snapshot) => {
                        // Batch update to remove isDefault from other payment methods
                        const batch = db.batch();
                        snapshot.forEach(doc => {
                            batch.update(doc.ref, { isDefault: false });
                        });
                        return batch.commit();
                    })
                    .then(() => {
                        alert('Default payment method updated');
                        loadPaymentMethods(auth.currentUser);
                    })
                    .catch((error) => {
                        console.error('Error updating default payment method:', error);
                        alert('Failed to update default payment method. Please try again.');
                    });
                break;
        }
    }
    
    // Navigation between profile sections
    profileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            profileNavLinks.forEach(navLink => {
                navLink.parentNode.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.parentNode.classList.add('active');
            
            // Get section ID
            const sectionId = this.getAttribute('data-section');
            
            // Hide all sections
            profileSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show selected section
            document.getElementById(`${sectionId}-section`).classList.add('active');
        });
    });
    
    // Handle logout
    logoutButton.addEventListener('click', function() {
        auth.signOut()
            .then(() => {
                window.location.href = '/';
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    });
    
    // Handle account form submission
    if (accountForm) {
        accountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const user = auth.currentUser;
            const userId = user.uid;
            
            // Update profile in Firebase Auth
            user.updateProfile({
                displayName: profileNameInput.value
            }).then(() => {
                // Update profile in Firestore
                return db.collection('users').doc(userId).update({
                    name: profileNameInput.value,
                    phone: profilePhoneInput.value,
                    birthday: profileBirthdayInput.value,
                    updatedAt: new Date()
                });
            }).then(() => {
                alert('Profile updated successfully');
                // Refresh displayed name
                userNameElement.textContent = profileNameInput.value;
            }).catch((error) => {
                console.error('Error updating profile:', error);
                alert('Failed to update profile. Please try again.');
            });
        });
    }
    
    // Handle password form submission
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = document.getElementById('confirm-new-password').value;
            
            // Check if new passwords match
            if (newPassword !== confirmNewPassword) {
                alert('New passwords do not match');
                return;
            }
            
            // Reauthenticate user
            const user = auth.currentUser;
            const credential = firebase.auth.EmailAuthProvider.credential(
                user.email, 
                currentPassword
            );
            
            user.reauthenticateWithCredential(credential)
                .then(() => {
                    // User reauthenticated, now update password
                    return user.updatePassword(newPassword);
                })
                .then(() => {
                    alert('Password updated successfully');
                    passwordForm.reset();
                })
                .catch((error) => {
                    console.error('Error updating password:', error);
                    
                    if (error.code === 'auth/wrong-password') {
                        alert('Current password is incorrect');
                    } else {
                        alert('Failed to update password. Please try again.');
                    }
                });
        });
    }
    
    // Handle add address button
    if (addAddressButton) {
        addAddressButton.addEventListener('click', function() {
            // Reset form
            addressForm.reset();
            document.getElementById('address-form-title').textContent = 'Add New Address';
            
            // Remove any existing address ID field
            const existingAddressId = document.getElementById('address-id');
            if (existingAddressId) {
                existingAddressId.value = '';
            }
            
            // Show form
            addressFormContainer.style.display = 'block';
            window.scrollTo(0, addressFormContainer.offsetTop - 50);
        });
    }
    
    // Handle cancel address button
    if (cancelAddressButton) {
        cancelAddressButton.addEventListener('click', function() {
            addressFormContainer.style.display = 'none';
        });
    }
    
    // Handle address form submission
    if (addressForm) {
        addressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userId = auth.currentUser.uid;
            const addressId = document.getElementById('address-id').value;
            
            const addressData = {
                name: document.getElementById('address-name').value,
                line1: document.getElementById('address-line1').value,
                line2: document.getElementById('address-line2').value,
                city: document.getElementById('address-city').value,
                state: document.getElementById('address-state').value,
                zip: document.getElementById('address-zip').value,
                country: document.getElementById('address-country').value,
                isDefault: document.getElementById('address-default').checked,
                updatedAt: new Date()
            };
            
            // Check if this is a new address or update
            let savePromise;
            
            if (addressId) {
                // Update existing address
                savePromise = db.collection('users').doc(userId).collection('addresses').doc(addressId).update(addressData);
            } else {
                // Add new address
                addressData.createdAt = new Date();
                savePromise = db.collection('users').doc(userId).collection('addresses').add(addressData);
            }
            
            savePromise
                .then(() => {
                    // If this is set as default, update other addresses
                    if (addressData.isDefault) {
                        let query = db.collection('users').doc(userId).collection('addresses')
                            .where('isDefault', '==', true);
                        
                        if (addressId) {
                            query = query.where(firebase.firestore.FieldPath.documentId(), '!=', addressId);
                        }
                        
                        return query.get().then((snapshot) => {
                            // Batch update to remove isDefault from other addresses
                            const batch = db.batch();
                            snapshot.forEach(doc => {
                                batch.update(doc.ref, { isDefault: false });
                            });
                            return batch.commit();
                        });
                    }
                    
                    return Promise.resolve();
                })
                .then(() => {
                    alert('Address saved successfully');
                    addressFormContainer.style.display = 'none';
                    loadAddresses(auth.currentUser);
                })
                .catch((error) => {
                    console.error('Error saving address:', error);
                    alert('Failed to save address. Please try again.');
                });
        });
    }
    
    // Handle add payment button
    if (addPaymentButton) {
        addPaymentButton.addEventListener('click', function() {
            // Reset form
            paymentForm.reset();
            document.getElementById('payment-form-title').textContent = 'Add Payment Method';
            
            // Remove any existing payment ID field
            const existingPaymentId = document.getElementById('payment-id');
            if (existingPaymentId) {
                existingPaymentId.parentNode.removeChild(existingPaymentId);
            }
            
            // Show form
            paymentFormContainer.style.display = 'block';
            window.scrollTo(0, paymentFormContainer.offsetTop - 50);
        });
    }
    
    // Handle cancel payment button
    if (cancelPaymentButton) {
        cancelPaymentButton.addEventListener('click', function() {
            paymentFormContainer.style.display = 'none';
        });
    }
    
    // Handle payment form submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userId = auth.currentUser.uid;
            const paymentIdField = document.getElementById('payment-id');
            const paymentId = paymentIdField ? paymentIdField.value : null;
            
            const cardNumber = document.getElementById('card-number').value.replace(/\s+/g, '');
            const cardExpiry = document.getElementById('card-expiry').value.split('/');
            
            // In a real app, we would tokenize this info through Stripe/Braintree
            // For this demo, we'll just store it directly (not secure!)
            const paymentData = {
                cardHolder: document.getElementById('card-holder').value,
                cardNumber: cardNumber,
                expiryMonth: cardExpiry[0] ? cardExpiry[0].trim() : '',
                expiryYear: cardExpiry[1] ? cardExpiry[1].trim() : '',
                cardType: getCardType(cardNumber),
                isDefault: document.getElementById('payment-default').checked,
                updatedAt: new Date()
            };
            
            // Check if this is a new payment method or update
            let savePromise;
            
            if (paymentId) {
                // Update existing payment method
                savePromise = db.collection('users').doc(userId).collection('paymentMethods').doc(paymentId).update(paymentData);
            } else {
                // Add new payment method
                paymentData.createdAt = new Date();
                savePromise = db.collection('users').doc(userId).collection('paymentMethods').add(paymentData);
            }
            
            savePromise
                .then(() => {
                    // If this is set as default, update other payment methods
                    if (paymentData.isDefault) {
                        let query = db.collection('users').doc(userId).collection('paymentMethods')
                            .where('isDefault', '==', true);
                        
                        if (paymentId) {
                            query = query.where(firebase.firestore.FieldPath.documentId(), '!=', paymentId);
                        }
                        
                        return query.get().then((snapshot) => {
                            // Batch update to remove isDefault from other payment methods
                            const batch = db.batch();
                            snapshot.forEach(doc => {
                                batch.update(doc.ref, { isDefault: false });
                            });
                            return batch.commit();
                        });
                    }
                    
                    return Promise.resolve();
                })
                .then(() => {
                    alert('Payment method saved successfully');
                    paymentFormContainer.style.display = 'none';
                    loadPaymentMethods(auth.currentUser);
                })
                .catch((error) => {
                    console.error('Error saving payment method:', error);
                    alert('Failed to save payment method. Please try again.');
                });
        });
    }
});
