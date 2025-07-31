// Firebase Integration for Sticker Customizer
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyAqAMSmpYzF7tmJcJH-v1ZjwapSrjhOzKw",
    authDomain: "stickercustom123.firebaseapp.com",
    projectId: "stickercustom123",
    storageBucket: "stickercustom123.firebasestorage.app",
    messagingSenderId: "605457770186",
    appId: "1:605457770186:web:c4822f99c346c0cddbf633",
  };

  // Load Firebase SDK
  const loadFirebaseScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Function to integrate sticker customizer
  const integrateStickerCustomizer = () => {
    // Variable to track if we need to use alternative media container
    let useAltMedia = false;
    let productMedia = null;

    // Check if we're on a product page
    const isProductPage = window.location.pathname.includes("/products/");
    if (!isProductPage) {
      console.log("Not a product page, skipping customizer integration");
      return;
    }

    // Find product media container
    console.log("Searching for product-media element...");
    productMedia = document.querySelector("product-media");
    if (!productMedia) {
      console.warn(
        "Product media container not found, cannot integrate customizer"
      );
      console.error(
        "Available elements:",
        document.body.innerHTML.substring(0, 200) + "..."
      );

      // Try alternative selector methods
      const altProductMedia = document.querySelector(".product__media");
      if (altProductMedia) {
        console.log(
          "Found alternative product media container with class selector"
        );
        // Continue with this element instead
        useAltMedia = true;
        productMedia = altProductMedia;
      } else {
        return;
      }
    }

    // Get product information
    const productTitleElement = document.querySelector(".product-meta__title");
    const productTitle = productTitleElement?.innerText || "Custom Sticker";
    const productTitleLower = productTitle.toLowerCase();
    const path = window.location.pathname.toLowerCase();

    // Check if this is a customizable sticker product
    const isCustomizableProduct =
      productTitleLower.includes("sticker") ||
      productTitleLower.includes("die cut") ||
      productTitleLower.includes("holographic") ||
      productTitleLower.includes("vinyl") ||
      path.includes("die-cut-stickers") ||
      path.includes("circle-stickers") ||
      path.includes("square-stickers") ||
      path.includes("holographic-stickers") ||
      path.includes("qr-code-stickers");

    if (!isCustomizableProduct) {
      console.log(
        "Not a customizable product, skipping customizer integration"
      );
      return;
    }

    // Add class to body to indicate customizer is present
    document.body.classList.add("product-page-with-customizer");

    // Create iframe for Firebase app
    const customizerContainer = document.createElement("div");
    customizerContainer.className = "sticker-customizer-firebase-container";
    customizerContainer.style.cssText = `
      position: relative;
      width: 100%;
      height: 1000px;
      border: none;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    `;

    // Create loading indicator
    const loadingIndicator = document.createElement("div");
    loadingIndicator.className = "sticker-customizer-loading";
    loadingIndicator.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 1000px;
      width: 100%;
      background-color: #f9f9f9;
      z-index: 5;
    `;
    loadingIndicator.innerHTML = `
      <div class="sticker-customizer-loading__spinner"></div>
      <div class="sticker-customizer-loading__text">Loading sticker customizer...</div>
    `;
    customizerContainer.appendChild(loadingIndicator);

    // Get product details to pass to the customizer
    const productData = {
      title: productTitle,
      url: window.location.href,
      pageType: "product",
      productId: window.location.pathname.split("/").pop(),
    };

    // Build the URL with product data
    const customizerUrl = new URL(
      "https://my-web-app--stickercustom123.us-central1.hosted.app/"
    );
    customizerUrl.searchParams.append(
      "product",
      encodeURIComponent(productTitle)
    );
    customizerUrl.searchParams.append(
      "productData",
      encodeURIComponent(JSON.stringify(productData))
    );
    customizerUrl.searchParams.append("source", "stickerine");

    // Create iframe for the Firebase app
    const customizerFrame = document.createElement("iframe");
    customizerFrame.src = customizerUrl.toString();
    customizerFrame.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
      display: block; /* Show iframe immediately but loading indicator is on top */
    `;
    customizerFrame.title = "Sticker Customizer";
    customizerFrame.id = "sticker-customizer-frame";
    customizerFrame.setAttribute("allowfullscreen", "true");
    customizerFrame.setAttribute("allow", "camera; microphone");

    // Handle iframe loading
    customizerFrame.onload = function () {
      // Add a small delay to ensure the iframe content is fully rendered
      setTimeout(() => {
        // Fade out loading indicator
        loadingIndicator.style.opacity = "0";
        loadingIndicator.style.transition = "opacity 0.3s ease";

        // Remove loading indicator after fade
        setTimeout(() => {
          loadingIndicator.style.display = "none";
        }, 300);
      }, 500);

      // Notify the iframe that it's embedded in our site
      try {
        customizerFrame.contentWindow.postMessage(
          {
            type: "parent-ready",
            origin: window.location.origin,
            productData: productData,
          },
          "https://my-web-app--stickercustom123.us-central1.hosted.app"
        );
      } catch (e) {
        console.warn("Could not send message to iframe:", e);
      }
    };

    // Append iframe to container
    customizerContainer.appendChild(customizerFrame);

    // Replace product media with our customizer
    try {
      console.log("Replacing product media with customizer container");
      productMedia.innerHTML = "";
      productMedia.appendChild(customizerContainer);

      // Modify product media styles to fit customizer
      productMedia.style.cssText = `
        --largest-image-aspect-ratio: 1.0;
        position: relative;
        overflow: visible;
        margin-bottom: 30px;
        width: 100%;
      `;
      console.log("Customizer container added successfully");
    } catch (error) {
      console.error("Error replacing product media with customizer:", error);

      // If there was an error, try an alternative method
      try {
        const productContainer =
          document.querySelector(".product__media") ||
          document.querySelector(".product-container");
        if (productContainer) {
          console.log("Using fallback product container");
          productContainer.innerHTML = "";
          productContainer.appendChild(customizerContainer);
        } else {
          // Last resort: insert after the header
          const header =
            document.querySelector("header") ||
            document.querySelector(".header");
          if (header && header.parentNode) {
            console.log("Using last resort insertion after header");
            header.parentNode.insertBefore(
              customizerContainer,
              header.nextSibling
            );
          }
        }
      } catch (fallbackError) {
        console.error(
          "All customizer insertion attempts failed:",
          fallbackError
        );
      }
    }

    // Add a class to the parent container for easier styling
    if (productMedia.parentNode) {
      productMedia.parentNode.classList.add("has-sticker-customizer");
    }

    // Set up message listener for communication with the iframe
    const messageHandler = (event) => {
      // Security check - only accept messages from our Firebase app
      if (
        event.origin !==
        "https://my-web-app--stickercustom123.us-central1.hosted.app"
      ) {
        return;
      }

      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        // Handle different message types from the customizer
        switch (data.type) {
          case "customizer-ready":
            console.log("Customizer application is ready");
            loadingIndicator.style.display = "none";
            customizerFrame.style.display = "block";
            break;

          case "add-to-cart":
            console.log("Adding customized product to cart:", data);
            // Implement cart functionality here
            showMessage(
              "Your custom design has been added to the cart!",
              "success"
            );

            // Optional: Trigger Shopify cart add event
            if (window.Shopify && window.Shopify.onItemAdded) {
              window.Shopify.onItemAdded({
                variant_id: data.variantId || null,
                quantity: data.quantity || 1,
                properties: {
                  _customDesign: true,
                  _designId: data.designId || null,
                  _customOptions: JSON.stringify(data.options || {}),
                },
              });
            }
            break;

          case "design-saved":
            console.log("Design saved:", data.designId);
            showMessage("Your design has been saved!", "success");
            break;

          case "error":
            console.error("Error in customizer:", data.message);
            showMessage(
              data.message || "An error occurred in the customizer.",
              "error"
            );
            break;

          default:
            console.log("Unknown message from customizer:", data);
        }
      } catch (error) {
        console.error("Error processing message from customizer:", error);
      }
    };

    // Helper function to show messages to the user
    const showMessage = (text, type = "info") => {
      const message = document.createElement("div");
      message.className = `sticker-customizer-message sticker-customizer-message--${type}`;
      message.textContent = text;

      // Insert message after the customizer
      productMedia.parentNode.insertBefore(message, productMedia.nextSibling);

      // Remove message after a few seconds
      setTimeout(() => {
        message.style.opacity = "0";
        setTimeout(() => {
          if (message.parentNode) {
            message.parentNode.removeChild(message);
          }
        }, 500);
      }, 5000);
    };

    // Add event listener for messages from the iframe
    window.addEventListener("message", messageHandler);

    // Clean up function to remove event listener when navigating away
    const cleanup = () => {
      window.removeEventListener("message", messageHandler);
    };

    // Clean up when page is unloaded
    window.addEventListener("beforeunload", cleanup);

    console.log("Firebase Sticker Customizer integrated successfully");
  };

  // Initialize Firebase directly if the SDK is already loaded via the script tag
  const initializeFirebaseApp = () => {
    try {
      // Log useful debugging information
      console.log("Initializing Firebase for sticker customizer...");
      console.log("Current page path:", window.location.pathname);

      if (window.firebase) {
        // Legacy Firebase SDK (v8 and below)
        if (!window.firebase.apps || !window.firebase.apps.length) {
          window.firebase.initializeApp(firebaseConfig);
        }
        console.log("Firebase initialized with legacy SDK");
      } else if (window.firebase?.app) {
        // Check if Firebase is already initialized
        try {
          window.firebase.app();
          console.log("Firebase already initialized");
        } catch (e) {
          window.firebase.initializeApp(firebaseConfig);
          console.log("Firebase initialized with modern SDK");
        }
      } else if (
        typeof firebase !== "undefined" &&
        typeof firebase.initializeApp === "function"
      ) {
        // Modern Firebase SDK (v9) - alternative access method
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized with modern SDK (global method)");
      } else {
        throw new Error("Firebase SDK not found");
      }

      // Integrate the customizer after Firebase initialization
      integrateStickerCustomizer();
    } catch (error) {
      console.error("Error initializing Firebase:", error);

      // Try loading Firebase SDK if not found
      loadFirebaseScript()
        .then(() => {
          console.log("Firebase SDK loaded dynamically");
          window.firebase.initializeApp(firebaseConfig);
          integrateStickerCustomizer();
        })
        .catch((err) => {
          console.error("Failed to load Firebase SDK:", err);
        });
    }
  };

  // Start the initialization process
  initializeFirebaseApp();
});
