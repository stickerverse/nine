// Product Customizer Integration
document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on a product page
  const isProductPage = window.location.pathname.includes("/products/");
  if (!isProductPage) return;

  // Check if this is a customizable sticker product
  const productTitle =
    document.querySelector(".product-meta__title")?.innerText?.toLowerCase() ||
    "";
  const isCustomizableProduct =
    productTitle.includes("sticker") ||
    productTitle.includes("die cut") ||
    productTitle.includes("holographic") ||
    productTitle.includes("vinyl") ||
    productTitle.includes("qr code") ||
    window.location.pathname.includes("die-cut-stickers") ||
    window.location.pathname.includes("circle-stickers") ||
    window.location.pathname.includes("square-stickers") ||
    window.location.pathname.includes("holographic-stickers") ||
    window.location.pathname.includes("qr-code-stickers");

  if (!isCustomizableProduct) return;

  // Get the main product media container
  const productMedia = document.querySelector("product-media");
  if (!productMedia) return;

  // Add class to indicate this page has customizer
  document.body.classList.add("page-with-customizer");

  // Create Firebase sticker customizer container
  const customizerContainer = document.createElement("div");
  customizerContainer.className = "sticker-customizer-firebase-container";
  customizerContainer.style.position = "relative";
  customizerContainer.style.width = "100%"; // Keep width at 100% of parent
  customizerContainer.style.height = "1200px";
  customizerContainer.style.borderRadius = "8px";
  customizerContainer.style.backgroundColor = "#f9f9f9";
  customizerContainer.style.marginBottom = "20px";
  customizerContainer.style.marginTop = "0";
  customizerContainer.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
  customizerContainer.style.overflow = "visible"; // Change to visible to avoid cut-off

  // Create loading indicator
  const loadingIndicator = document.createElement("div");
  loadingIndicator.className = "sticker-customizer-loading";
  loadingIndicator.style.position = "absolute";
  loadingIndicator.style.top = "60px"; // Start below the custom title
  loadingIndicator.style.left = "0";
  loadingIndicator.style.width = "100%";
  loadingIndicator.style.height = "calc(100% - 60px)"; // Adjust height for title space
  loadingIndicator.style.display = "flex";
  loadingIndicator.style.alignItems = "center";
  loadingIndicator.style.justifyContent = "center";
  loadingIndicator.style.backgroundColor = "#f9f9f9";
  loadingIndicator.style.zIndex = "5";
  loadingIndicator.innerHTML = `
    <div class="sticker-customizer-loading__spinner" style="border: 4px solid rgba(0, 0, 0, 0.1); border-left-color: #000; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-right: 15px;"></div>
    <div class="sticker-customizer-loading__text" style="font-size: 16px; color: #333; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;">Loading sticker customizer...</div>
  `;

  // Add the spin animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // Get product title for customizer
  const productName =
    document.querySelector(".product-meta__title")?.innerText ||
    "Custom Stickers";

  // Create iframe for the Firebase app
  const customizerFrame = document.createElement("iframe");

  // Default product name from the page
  let customizerProductName = productName;

  // Override product name based on page URL
  if (window.location.pathname.includes("holographic-stickers")) {
    customizerProductName = "Holographic Stickers";
  } else if (window.location.pathname.includes("qr-code-stickers")) {
    customizerProductName = "QR Code Stickers";
  } else if (window.location.pathname.includes("die-cut-stickers")) {
    customizerProductName = "Die Cut Stickers";
  } else if (window.location.pathname.includes("circle-stickers")) {
    customizerProductName = "Circle Stickers";
  } else if (window.location.pathname.includes("square-stickers")) {
    customizerProductName = "Square Stickers";
  }

  // Create custom title element to place on top of the customizer
  const customTitle = document.createElement("div");
  customTitle.className = "sticker-customizer-custom-title";
  customTitle.innerHTML = `<h2>${customizerProductName}</h2>`;
  customTitle.style.position = "absolute";
  customTitle.style.top = "0";
  customTitle.style.left = "0";
  customTitle.style.width = "100%";
  customTitle.style.padding = "15px 20px";
  customTitle.style.boxSizing = "border-box";
  customTitle.style.textAlign = "center";
  customTitle.style.zIndex = "10"; // Ensure it appears above the iframe
  customTitle.style.backgroundColor = "#ffffff";
  customTitle.style.borderBottom = "1px solid #e0e0e0";
  customTitle.style.fontFamily = "Tomorrow, sans-serif";
  customTitle.style.fontSize = "22px";
  customTitle.style.fontWeight = "bold";

  // Build URL with product information
  const customizerUrl = new URL(
    "https://my-web-app--stickercustom123.us-central1.hosted.app/"
  );
  customizerUrl.searchParams.append(
    "product",
    encodeURIComponent(customizerProductName)
  );
  customizerUrl.searchParams.append("source", "stickerine");
  // Add parameter to hide the built-in title if the customizer supports it
  customizerUrl.searchParams.append("hideTitle", "true");
  customizerUrl.searchParams.append(
    "productData",
    encodeURIComponent(
      JSON.stringify({
        title: customizerProductName, // Use the custom product name here
        url: window.location.href,
        pageType: "product",
        hideBuiltInTitle: true, // Signal to customizer to hide its own title
        productId: window.location.pathname.split("/").pop(),
      })
    )
  );

  customizerFrame.src = customizerUrl.toString();
  customizerFrame.style.position = "absolute";
  customizerFrame.style.top = "60px"; // Add space for the custom title
  customizerFrame.style.left = "0";
  customizerFrame.style.width = "100%";
  customizerFrame.style.height = "calc(100% - 60px)"; // Adjust height to account for the title
  customizerFrame.style.border = "none";
  customizerFrame.style.display = "block";
  customizerFrame.style.maxWidth = "100%"; // Ensure iframe doesn't exceed container width
  customizerFrame.style.overflow = "hidden"; // Hide any overflow
  customizerFrame.setAttribute("allowfullscreen", "true");
  customizerFrame.setAttribute("allow", "camera; microphone");
  customizerFrame.setAttribute("title", customizerProductName + " Customizer");

  // Add our custom title to the container first
  customizerContainer.appendChild(customTitle);

  // Show loading indicator until iframe loads
  customizerContainer.appendChild(loadingIndicator);
  customizerContainer.appendChild(customizerFrame);

  // Replace product media content with our customizer
  productMedia.innerHTML = "";
  productMedia.appendChild(customizerContainer);

  // Style the product media container properly
  productMedia.style.cssText = `
    --largest-image-aspect-ratio: 1.0;
    position: relative;
    overflow: visible;
    margin-bottom: 30px;
    width: 100%;
    max-width: 100%;
    padding: 0;
    box-sizing: border-box;
  `;

  // Add responsive styling
  const responsiveStyle = document.createElement("style");
  responsiveStyle.textContent = `
    .sticker-customizer-firebase-container {
      box-sizing: border-box;
      padding: 0;
      overflow: hidden !important;
      width: 100% !important;
      max-width: 100% !important;
    }
    
    @media screen and (max-width: 990px) {
      .sticker-customizer-firebase-container {
        margin-left: 0 !important;
        margin-right: 0 !important;
        width: 100% !important;
      }
    }
  `;
  document.head.appendChild(responsiveStyle);

  // Add class to parent for easier styling
  if (productMedia.parentNode) {
    productMedia.parentNode.classList.add("has-sticker-customizer");

    // Apply styles to parent container
    productMedia.parentNode.style.width = "100%";
    productMedia.parentNode.style.maxWidth = "100%";
    productMedia.parentNode.style.boxSizing = "border-box";
    productMedia.parentNode.style.padding = "0";
    productMedia.parentNode.style.overflow = "hidden";
  }

  // Adjust container positioning based on page type
  if (
    window.location.pathname.includes("qr-code-stickers") ||
    window.location.pathname.includes("holographic-stickers")
  ) {
    // Apply specific fixes for QR code and holographic pages
    customizerContainer.style.width = "100%";
    customizerContainer.style.maxWidth = "100%";
    customizerContainer.style.marginLeft = "0";
    customizerContainer.style.marginRight = "0";
    customizerContainer.style.boxSizing = "border-box";
    customizerContainer.style.overflow = "hidden";
  }

  // Handle iframe loading
  customizerFrame.onload = function () {
    // Fade out loading indicator
    loadingIndicator.style.transition = "opacity 0.3s ease";
    loadingIndicator.style.opacity = "0";

    // Remove loading indicator after fade
    setTimeout(() => {
      loadingIndicator.style.display = "none";
      customizerFrame.style.display = "block";
    }, 300);
  };

  // Initially hide iframe until loaded
  customizerFrame.style.display = "none";

  // Add resize listener to ensure iframe stays contained
  window.addEventListener("resize", function () {
    // Adjust iframe width if needed
    if (window.innerWidth < customizerContainer.offsetWidth) {
      customizerContainer.style.width = window.innerWidth + "px";
      customizerFrame.style.width = window.innerWidth + "px";
    }
  });

  // Handle communication between iframe and parent
  window.addEventListener(
    "message",
    function (event) {
      // Verify the origin of the message
      if (
        event.origin !==
        "https://my-web-app--stickercustom123.us-central1.hosted.app"
      )
        return;

      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        // Handle different message types
        if (data.type === "customizer-ready") {
          console.log("Customizer application ready");
          loadingIndicator.style.display = "none";
          customizerFrame.style.display = "block";
        }

        if (data.type === "add-to-cart") {
          // Handle add to cart event from the customizer
          console.log("Adding customized product to cart:", data);

          // Example: Show confirmation message
          const message = document.createElement("div");
          message.className =
            "sticker-customizer-message sticker-customizer-message--success";
          message.textContent =
            "Your custom sticker design has been added to cart!";

          // Insert message after the customizer
          productMedia.parentNode.insertBefore(
            message,
            productMedia.nextSibling
          );

          // Remove message after a few seconds
          setTimeout(() => {
            message.style.opacity = "0";
            setTimeout(() => {
              if (message.parentNode) {
                message.parentNode.removeChild(message);
              }
            }, 500);
          }, 5000);
        }
      } catch (e) {
        console.error("Error processing message from customizer:", e);
      }
    },
    false
  );
});
