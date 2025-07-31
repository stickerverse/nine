/**
 * Firebase Payment Integration for Stickerine.com
 * This file handles payment processing, saved payment methods, and order creation
 */

// Initialize Stripe
let stripe;
let elements;
let cardNumberElement;
let cardExpiryElement;
let cardCvcElement;

/**
 * Initialize Stripe Elements for payment form
 */
function initializeStripeElements() {
    // Get Stripe publishable key from Firebase config
    fetch('/.well-known/stripe-key')
        .then(response => response.json())
        .then(data => {
            stripe = Stripe(data.publishableKey);
            elements = stripe.elements();

            // Create and mount card elements
            const style = {
                base: {
                    color: "#333",
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSmoothing: "antialiased",
                    fontSize: "16px",
                    "::placeholder": {
                        color: "#aab7c4"
                    }
                },
                invalid: {
                    color: "#dc3545",
                    iconColor: "#dc3545"
                }
            };

            // Create card elements
            cardNumberElement = elements.create('cardNumber', { style: style });
            cardExpiryElement = elements.create('cardExpiry', { style: style });
            cardCvcElement = elements.create('cardCvc', { style: style });

            // Mount card elements
            cardNumberElement.mount('#card-number-element');
            cardExpiryElement.mount('#card-expiry-element');
            cardCvcElement.mount('#card-cvc-element');

            // Handle validation errors
            cardNumberElement.addEventListener('change', function(event) {
                showCardError(event.error);
            });
            cardExpiryElement.addEventListener('change', function(event) {
                showCardError(event.error);
            });
            cardCvcElement.addEventListener('change', function(event) {
                showCardError(event.error);
            });
        })
        .catch(error => {
            console.error('Error loading Stripe:', error);
            document.getElementById('card-errors').textContent = 'Could not load payment processor. Please try again later.';
        });
}

/**
 * Show card validation errors
 * @param {Object} error - The error object from Stripe
 */
function showCardError(error) {
    const errorElement = document.getElementById('card-errors');
    if (error) {
        errorElement.textContent = error.message;
    } else {
        errorElement.textContent = '';
    }
}

/**
 * Create a payment method with Stripe
 * @returns {Promise} - Promise that resolves with the payment method object
 */
function validateCardDetails() {
    return new Promise((resolve, reject) => {
        const cardName = document.getElementById('card-name').value;
        
        if (!cardName) {
            reject({ message: 'Please enter the name on the card.' });
            return;
        }

        stripe.createPaymentMethod({
            type: 'card',
            card: cardNumberElement,
            billing_details: {
                name: cardName
            }
        })
        .then(function(result) {
            if (result.error) {
                reject(result.error);
            } else {
                resolve(result.paymentMethod);
            }
        })
        .catch(function(error) {
            reject(error);
        });
    });
}

/**
 * Load saved addresses for a user
 * @param {string} userId - The current user's ID
 */
function loadSavedAddresses(userId) {
    const addressesList = document.getElementById('addresses-list');
    const noAddresses = document.getElementById('no-addresses');
    
    // Clear previous addresses
    addressesList.innerHTML = '';
    
    firebase.firestore().collection('users').doc(userId).collection('addresses')
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                noAddresses.style.display = 'block';
                return;
            }
            
            noAddresses.style.display = 'none';
            
            querySnapshot.forEach((doc) => {
                const addressData = doc.data();
                addAddressToUI(addressData, doc.id);
            });
        })
        .catch((error) => {
            console.error("Error loading addresses: ", error);
            addressesList.innerHTML = '<p class="error-message">Error loading addresses. Please refresh the page or try again later.</p>';
        });
}

/**
 * Add an address to the UI
 * @param {Object} addressData - The address data to display
 * @param {string} addressId - The ID of the address in Firestore
 */
function addAddressToUI(addressData, addressId) {
    const addressesList = document.getElementById('addresses-list');
    const noAddresses = document.getElementById('no-addresses');
    
    noAddresses.style.display = 'none';
    
    const addressElement = document.createElement('div');
    addressElement.className = 'address-item';
    addressElement.innerHTML = `
        <input type="radio" name="address" id="address-${addressId}" value="${addressId}" ${addressData.default ? 'checked' : ''}>
        <label for="address-${addressId}">
            <strong>${addressData.firstName} ${addressData.lastName}</strong><br>
            ${addressData.address1}<br>
            ${addressData.address2 ? addressData.address2 + '<br>' : ''}
            ${addressData.city}, ${addressData.state} ${addressData.zip}<br>
            ${addressData.country}<br>
            ${addressData.phone}
        </label>
        <div class="address-actions">
            <button type="button" class="btn-link edit-address" data-id="${addressId}">Edit</button>
            <button type="button" class="btn-link delete-address" data-id="${addressId}">Delete</button>
        </div>
    `;
    
    addressesList.appendChild(addressElement);
    
    // Add event listeners to edit and delete buttons
    addressElement.querySelector('.edit-address').addEventListener('click', function() {
        editAddress(addressId, addressData);
    });
    
    addressElement.querySelector('.delete-address').addEventListener('click', function() {
        deleteAddress(addressId);
    });
}

/**
 * Save a new address to Firestore
 * @param {Object} addressData - The address data to save
 */
function saveNewAddress(addressData) {
    const userId = firebase.auth().currentUser.uid;
    
    firebase.firestore().collection('users').doc(userId).collection('addresses')
        .add(addressData)
        .then((docRef) => {
            console.log("Address saved with ID: ", docRef.id);
            addAddressToUI(addressData, docRef.id);
            
            // Clear the address form
            document.getElementById('first-name').value = '';
            document.getElementById('last-name').value = '';
            document.getElementById('address').value = '';
            document.getElementById('address2').value = '';
            document.getElementById('city').value = '';
            document.getElementById('state').value = '';
            document.getElementById('zip').value = '';
            document.getElementById('country').value = 'US';
            document.getElementById('phone').value = '';
            document.getElementById('save-address').checked = false;
        })
        .catch((error) => {
            console.error("Error saving address: ", error);
            alert("Error saving address: " + error.message);
        });
}

/**
 * Edit an address
 * @param {string} addressId - The ID of the address to edit
 * @param {Object} addressData - The current address data
 */
function editAddress(addressId, addressData) {
    document.getElementById('first-name').value = addressData.firstName;
    document.getElementById('last-name').value = addressData.lastName;
    document.getElementById('address').value = addressData.address1;
    document.getElementById('address2').value = addressData.address2 || '';
    document.getElementById('city').value = addressData.city;
    document.getElementById('state').value = addressData.state;
    document.getElementById('zip').value = addressData.zip;
    document.getElementById('country').value = addressData.country;
    document.getElementById('phone').value = addressData.phone;
    document.getElementById('save-address').checked = true;
    
    document.getElementById('new-address-form').style.display = 'block';
    document.getElementById('add-new-address').style.display = 'none';
    
    // Change the save button to an update button
    const saveButton = document.getElementById('save-new-address');
    saveButton.textContent = 'Update Address';
    saveButton.dataset.addressId = addressId;
    saveButton.dataset.isUpdate = 'true';
    
    // Change event listener for the save button
    saveButton.removeEventListener('click', saveNewAddressHandler);
    saveButton.addEventListener('click', function updateAddressHandler() {
        const updatedAddressData = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            address1: document.getElementById('address').value,
            address2: document.getElementById('address2').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            country: document.getElementById('country').value,
            phone: document.getElementById('phone').value,
            default: addressData.default
        };
        
        updateAddress(addressId, updatedAddressData);
        
        // Restore the save button
        saveButton.textContent = 'Save Address';
        delete saveButton.dataset.addressId;
        delete saveButton.dataset.isUpdate;
        
        // Restore event listener
        saveButton.removeEventListener('click', updateAddressHandler);
        saveButton.addEventListener('click', saveNewAddressHandler);
        
        document.getElementById('new-address-form').style.display = 'none';
        document.getElementById('add-new-address').style.display = 'block';
    });
}

/**
 * Update an address in Firestore
 * @param {string} addressId - The ID of the address to update
 * @param {Object} updatedAddressData - The updated address data
 */
function updateAddress(addressId, updatedAddressData) {
    const userId = firebase.auth().currentUser.uid;
    
    firebase.firestore().collection('users').doc(userId).collection('addresses').doc(addressId)
        .update(updatedAddressData)
        .then(() => {
            console.log("Address updated: ", addressId);
            
            // Update the address in the UI
            const addressElement = document.querySelector(`#address-${addressId}`).closest('.address-item');
            addressElement.querySelector('label').innerHTML = `
                <strong>${updatedAddressData.firstName} ${updatedAddressData.lastName}</strong><br>
                ${updatedAddressData.address1}<br>
                ${updatedAddressData.address2 ? updatedAddressData.address2 + '<br>' : ''}
                ${updatedAddressData.city}, ${updatedAddressData.state} ${updatedAddressData.zip}<br>
                ${updatedAddressData.country}<br>
                ${updatedAddressData.phone}
            `;
        })
        .catch((error) => {
            console.error("Error updating address: ", error);
            alert("Error updating address: " + error.message);
        });
}

/**
 * Delete an address from Firestore
 * @param {string} addressId - The ID of the address to delete
 */
function deleteAddress(addressId) {
    const userId = firebase.auth().currentUser.uid;
    
    if (confirm('Are you sure you want to delete this address?')) {
        firebase.firestore().collection('users').doc(userId).collection('addresses').doc(addressId)
            .delete()
            .then(() => {
                console.log("Address deleted: ", addressId);
                
                // Remove the address from the UI
                const addressElement = document.querySelector(`#address-${addressId}`).closest('.address-item');
                addressElement.remove();
                
                // Check if there are any addresses left
                const addressesList = document.getElementById('addresses-list');
                if (addressesList.childElementCount === 0) {
                    document.getElementById('no-addresses').style.display = 'block';
                }
            })
            .catch((error) => {
                console.error("Error deleting address: ", error);
                alert("Error deleting address: " + error.message);
            });
    }
}

/**
 * Load saved payment methods for a user
 * @param {string} userId - The current user's ID
 */
function loadSavedPaymentMethods(userId) {
    const paymentMethodsList = document.getElementById('payment-methods-list');
    const noPayments = document.getElementById('no-payments');
    
    // Clear previous payment methods
    paymentMethodsList.innerHTML = '';
    
    firebase.firestore().collection('users').doc(userId).collection('paymentMethods')
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                noPayments.style.display = 'block';
                return;
            }
            
            noPayments.style.display = 'none';
            
            querySnapshot.forEach((doc) => {
                const paymentData = doc.data();
                addPaymentMethodToUI(paymentData, doc.id);
            });
        })
        .catch((error) => {
            console.error("Error loading payment methods: ", error);
            paymentMethodsList.innerHTML = '<p class="error-message">Error loading payment methods. Please refresh the page or try again later.</p>';
        });
}

/**
 * Add a payment method to the UI
 * @param {Object} paymentData - The payment method data to display
 * @param {string} paymentId - The ID of the payment method in Firestore
 */
function addPaymentMethodToUI(paymentData, paymentId) {
    const paymentMethodsList = document.getElementById('payment-methods-list');
    const noPayments = document.getElementById('no-payments');
    
    noPayments.style.display = 'none';
    
    const cardBrandIcon = getCardBrandIcon(paymentData.brand);
    
    const paymentElement = document.createElement('div');
    paymentElement.className = 'payment-item';
    paymentElement.innerHTML = `
        <input type="radio" name="payment" id="payment-${paymentId}" value="${paymentId}" ${paymentData.default ? 'checked' : ''}>
        <label for="payment-${paymentId}">
            <div class="payment-card">
                <div class="card-brand-icon">${cardBrandIcon}</div>
                <div class="card-details">
                    <strong>${paymentData.brand.charAt(0).toUpperCase() + paymentData.brand.slice(1)}</strong> ending in ${paymentData.last4}<br>
                    <span class="card-expiry">Expires ${paymentData.expiryMonth}/${paymentData.expiryYear}</span>
                </div>
            </div>
        </label>
        <div class="payment-actions">
            <button type="button" class="btn-link delete-payment" data-id="${paymentId}">Delete</button>
        </div>
    `;
    
    paymentMethodsList.appendChild(paymentElement);
    
    // Add event listener to delete button
    paymentElement.querySelector('.delete-payment').addEventListener('click', function() {
        deletePaymentMethod(paymentId);
    });
}

/**
 * Get a card brand icon
 * @param {string} brand - The card brand name
 * @returns {string} - HTML for the card brand icon
 */
function getCardBrandIcon(brand) {
    const icons = {
        visa: '<i class="fa-brands fa-cc-visa"></i>',
        mastercard: '<i class="fa-brands fa-cc-mastercard"></i>',
        amex: '<i class="fa-brands fa-cc-amex"></i>',
        discover: '<i class="fa-brands fa-cc-discover"></i>',
        jcb: '<i class="fa-brands fa-cc-jcb"></i>',
        diners: '<i class="fa-brands fa-cc-diners-club"></i>'
    };
    
    return icons[brand.toLowerCase()] || '<i class="fa-solid fa-credit-card"></i>';
}

/**
 * Save a new payment method to Firestore
 * @param {Object} paymentData - The payment method data to save
 */
function saveNewPaymentMethod(paymentData) {
    const userId = firebase.auth().currentUser.uid;
    
    firebase.firestore().collection('users').doc(userId).collection('paymentMethods')
        .add(paymentData)
        .then((docRef) => {
            console.log("Payment method saved with ID: ", docRef.id);
            addPaymentMethodToUI(paymentData, docRef.id);
            
            // Clear the payment form
            document.getElementById('card-name').value = '';
            document.getElementById('save-payment').checked = false;
            cardNumberElement.clear();
            cardExpiryElement.clear();
            cardCvcElement.clear();
        })
        .catch((error) => {
            console.error("Error saving payment method: ", error);
            alert("Error saving payment method: " + error.message);
        });
}

/**
 * Delete a payment method from Firestore
 * @param {string} paymentId - The ID of the payment method to delete
 */
function deletePaymentMethod(paymentId) {
    const userId = firebase.auth().currentUser.uid;
    
    if (confirm('Are you sure you want to delete this payment method?')) {
        firebase.firestore().collection('users').doc(userId).collection('paymentMethods').doc(paymentId)
            .delete()
            .then(() => {
                console.log("Payment method deleted: ", paymentId);
                
                // Remove the payment method from the UI
                const paymentElement = document.querySelector(`#payment-${paymentId}`).closest('.payment-item');
                paymentElement.remove();
                
                // Check if there are any payment methods left
                const paymentMethodsList = document.getElementById('payment-methods-list');
                if (paymentMethodsList.childElementCount === 0) {
                    document.getElementById('no-payments').style.display = 'block';
                }
            })
            .catch((error) => {
                console.error("Error deleting payment method: ", error);
                alert("Error deleting payment method: " + error.message);
            });
    }
}

/**
 * Process a payment with Stripe
 * @returns {Promise} - Promise that resolves with order data
 */
function processPayment() {
    return new Promise((resolve, reject) => {
        const userId = firebase.auth().currentUser.uid;
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        const selectedAddress = document.querySelector('input[name="address"]:checked');
        
        if (!selectedPayment) {
            reject(new Error('Please select a payment method.'));
            return;
        }
        
        if (!selectedAddress) {
            reject(new Error('Please select a shipping address.'));
            return;
        }
        
        // Get cart items from local storage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        if (cartItems.length === 0) {
            reject(new Error('Your cart is empty.'));
            return;
        }
        
        // Calculate order total
        let subtotal = 0;
        cartItems.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        
        // Apply shipping and tax
        const shipping = 4.99;
        const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
        const total = subtotal + shipping + tax;
        
        // Get the payment method ID
        const paymentId = selectedPayment.value;
        
        // Get the address ID
        const addressId = selectedAddress.value;
        
        // Create a payment intent on the server
        fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: Math.round(total * 100), // Convert to cents
                currency: 'usd',
                paymentId,
                addressId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                reject(new Error(data.error));
                return;
            }
            
            // Create the order in Firestore
            const orderData = {
                userId,
                items: cartItems,
                subtotal,
                shipping,
                tax,
                total,
                paymentId,
                addressId,
                paymentIntentId: data.paymentIntentId,
                status: 'processing',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            firebase.firestore().collection('orders')
                .add(orderData)
                .then((docRef) => {
                    console.log("Order created with ID: ", docRef.id);
                    
                    // Add the order to the user's orders
                    firebase.firestore().collection('users').doc(userId).collection('orders')
                        .doc(docRef.id)
                        .set({
                            orderId: docRef.id,
                            total,
                            status: 'processing',
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        })
                        .then(() => {
                            console.log("Order added to user's orders");
                            resolve({
                                orderId: docRef.id,
                                orderNumber: 'ORD-' + Math.floor(100000 + Math.random() * 900000)
                            });
                        })
                        .catch((error) => {
                            console.error("Error adding order to user's orders: ", error);
                            reject(error);
                        });
                })
                .catch((error) => {
                    console.error("Error creating order: ", error);
                    reject(error);
                });
        })
        .catch((error) => {
            console.error("Error creating payment intent: ", error);
            reject(error);
        });
    });
}

/**
 * Validate a promo code
 * @param {string} promoCode - The promo code to validate
 * @returns {Promise} - Promise that resolves with discount percentage if valid
 */
function validatePromoCode(promoCode) {
    return new Promise((resolve, reject) => {
        // Check if the promo code exists in Firebase
        firebase.firestore().collection('promoCodes')
            .where('code', '==', promoCode)
            .where('active', '==', true)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    resolve(false);
                    return;
                }
                
                const promoData = querySnapshot.docs[0].data();
                
                // Check if the promo code has expired
                if (promoData.expiresAt && promoData.expiresAt.toDate() < new Date()) {
                    resolve(false);
                    return;
                }
                
                resolve(promoData.discountPercentage);
            })
            .catch((error) => {
                console.error("Error validating promo code: ", error);
                reject(error);
            });
    });
}

// Save event handler reference for address handling
const saveNewAddressHandler = function() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const address1 = document.getElementById('address').value;
    const address2 = document.getElementById('address2').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    const country = document.getElementById('country').value;
    const phone = document.getElementById('phone').value;
    const saveAddress = document.getElementById('save-address').checked;
    
    if (!firstName || !lastName || !address1 || !city || !state || !zip || !country || !phone) {
        alert('Please fill in all required fields.');
        return;
    }

    const addressData = {
        firstName,
        lastName,
        address1,
        address2,
        city,
        state,
        zip,
        country,
        phone,
        default: document.getElementById('addresses-list').childElementCount === 0
    };

    saveAddress ? saveNewAddress(addressData) : addAddressToUI(addressData, 'temp-' + Date.now());
    
    document.getElementById('new-address-form').style.display = 'none';
    document.getElementById('add-new-address').style.display = 'block';
};

// Add reference to global scope for use in HTML
window.initializeStripeElements = initializeStripeElements;
window.validateCardDetails = validateCardDetails;
window.loadSavedAddresses = loadSavedAddresses;
window.addAddressToUI = addAddressToUI;
window.saveNewAddress = saveNewAddress;
window.editAddress = editAddress;
window.deleteAddress = deleteAddress;
window.loadSavedPaymentMethods = loadSavedPaymentMethods;
window.addPaymentMethodToUI = addPaymentMethodToUI;
window.saveNewPaymentMethod = saveNewPaymentMethod;
window.deletePaymentMethod = deletePaymentMethod;
window.processPayment = processPayment;
window.validatePromoCode = validatePromoCode;
