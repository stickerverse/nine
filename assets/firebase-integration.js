// Firebase Sticker Editor Integration
document.addEventListener("DOMContentLoaded", () => {
  console.log("Firebase Integration script loaded");
  
  const editorContainer = document.querySelector(".firebase-editor-container");
  if (!editorContainer) {
    console.error("Firebase editor container not found");
    return;
  }

  const primaryIframe = document.getElementById("firebase-editor-primary");
  const fallbackIframe = document.getElementById("firebase-editor-fallback");
  const directLinkDiv = document.getElementById("firebase-editor-direct-link");
  
  if (!primaryIframe) {
    console.error("Primary Firebase editor iframe not found");
    return;
  }
  
  console.log("Firebase iframe found:", primaryIframe.src);

  // Add loading state
  editorContainer.classList.add("loading");
  console.log("Added loading state to container");

  // Track loading time for analytics
  const startTime = Date.now();
  
  // Setup the fallback iframe with a different embedding approach
  const setupFallbackIframe = () => {
    if (fallbackIframe) {
      console.log("Setting up fallback iframe");
      
      // Use a different embedding strategy (without sandbox)
      fallbackIframe.src = "https://project-56164022233021019721.web.app/";
      fallbackIframe.style.display = "block";
      primaryIframe.style.display = "none";
      
      // Listen for fallback load event
      fallbackIframe.addEventListener("load", () => {
        console.log("Fallback iframe loaded");
        editorContainer.classList.remove("loading");
      });
      
      // Setup fallback timeout
      setTimeout(() => {
        if (editorContainer.classList.contains("loading")) {
          console.log("Fallback iframe failed to load, showing direct link");
          fallbackIframe.style.display = "none";
          if (directLinkDiv) {
            directLinkDiv.style.display = "block";
          }
          editorContainer.classList.remove("loading");
        }
      }, 5000); // 5 second timeout for fallback
    }
  };

  // Primary iframe load event
  primaryIframe.addEventListener("load", () => {
    // Calculate loading time
    const loadTime = Date.now() - startTime;
    console.log(`Firebase Sticker Editor loaded in ${loadTime}ms`);

    // Check if the iframe content is actually available
    let iframeLoaded = true;
    
    try {
      // This will fail if the iframe hasn't really loaded content
      // or if there's a cross-origin issue
      if (primaryIframe.contentWindow) {
        console.log("Primary iframe contentWindow is available");
      }
    } catch (e) {
      console.log("Primary iframe content check failed:", e.message);
      iframeLoaded = false;
    }
    
    if (iframeLoaded) {
      // Remove loading state with a small delay for visual smoothness
      setTimeout(() => {
        editorContainer.classList.remove("loading");
        console.log("Removed loading state from container");

        // Add a fade-in animation
        primaryIframe.style.opacity = "0";
        setTimeout(() => {
          primaryIframe.style.transition = "opacity 0.5s ease";
          primaryIframe.style.opacity = "1";
          console.log("Faded in iframe");
        }, 50);
      }, 300);
    } else {
      // If primary iframe failed to load properly, try the fallback
      setupFallbackIframe();
    }
  });
  
  // Add error handling for the iframe
  primaryIframe.addEventListener("error", (e) => {
    console.error("Error loading primary iframe:", e);
    setupFallbackIframe();
  });

  // Handle iframe resize on window resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(adjustIframeHeight, 100);
  });

  function adjustIframeHeight() {
    const activeIframe = primaryIframe.style.display !== "none" ? primaryIframe : fallbackIframe;
    if (!activeIframe) return;
    
    // Adjust iframe height based on window size
    if (window.innerWidth <= 480) {
      activeIframe.style.height = "500px";
      console.log("Set iframe height to 500px (mobile)");
    } else if (window.innerWidth <= 768) {
      activeIframe.style.height = "600px";
      console.log("Set iframe height to 600px (tablet)");
    } else {
      activeIframe.style.height = "700px";
      console.log("Set iframe height to 700px (desktop)");
    }
  }

  // Initialize height
  adjustIframeHeight();

  // Setup communication with the iframe if needed
  window.addEventListener("message", (event) => {
    // Verify the origin for security
    if (event.origin === "https://project-56164022233021019721.web.app") {
      console.log("Received message from Firebase app:", event.data);

      // Example: if the iframe sends a message to adjust its height
      if (event.data && event.data.type === "resize" && event.data.height) {
        const activeIframe = primaryIframe.style.display !== "none" ? primaryIframe : fallbackIframe;
        if (activeIframe) {
          activeIframe.style.height = `${event.data.height}px`;
          console.log(`Adjusted iframe height to ${event.data.height}px based on message`);
        }
      }

      // Example: if the iframe wants to send the user to checkout
      if (event.data && event.data.type === "checkout") {
        // Navigate to checkout page or open modal
        console.log("User completed design, ready for checkout");
        // Example: window.location.href = '/checkout.html';
      }
    }
  });

  // Fallback for iframe loading issues
  setTimeout(() => {
    if (editorContainer.classList.contains("loading")) {
      console.log("Primary iframe load timeout reached, trying fallback");
      setupFallbackIframe();
    }
  }, 6000); // 6 seconds timeout for primary iframe

  // Scroll to editor when header link is clicked
  const editorLinks = document.querySelectorAll('a[href="#sticker-editor"]');
  editorLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      editorContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});
