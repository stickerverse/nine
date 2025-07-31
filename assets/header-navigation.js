// Space-Themed Elastic Tabs Navigation JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize elastic tabs
  initElasticTabs();
  
  // Set active tab based on current page
  setActiveTab();
  
  // Add space particles effect
  addSpaceParticles();
});

function initElasticTabs() {
  const tabs = document.querySelectorAll('.tabs a');
  const selector = document.querySelector('.selector');
  
  if (!tabs.length || !selector) return;
  
  // Set initial position of selector
  const activeTab = document.querySelector('.tabs a.active');
  if (activeTab) {
    const activeRect = activeTab.getBoundingClientRect();
    const tabsRect = activeTab.parentElement.getBoundingClientRect();
    
    selector.style.width = activeRect.width + 'px';
    selector.style.left = (activeRect.left - tabsRect.left) + 'px';
  }
  
  // Add click event listeners
  tabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Move selector to active tab
      const rect = this.getBoundingClientRect();
      const parentRect = this.parentElement.getBoundingClientRect();
      
      selector.style.width = rect.width + 'px';
      selector.style.left = (rect.left - parentRect.left) + 'px';
      
      // Add animation class
      this.style.animation = 'none';
      this.offsetHeight; // Trigger reflow
      this.style.animation = 'tabSlide 0.5s ease-out';
      
      // Add space effect
      createSpaceEffect(this);
    });
  });
  
  // Add hover effects for selector
  tabs.forEach(tab => {
    tab.addEventListener('mouseenter', function() {
      if (!this.classList.contains('active')) {
        const rect = this.getBoundingClientRect();
        const parentRect = this.parentElement.getBoundingClientRect();
        
        selector.style.width = rect.width + 'px';
        selector.style.left = (rect.left - parentRect.left) + 'px';
        selector.style.opacity = '0.5';
      }
      
      // Add hover glow effect
      this.style.textShadow = '0 0 15px rgba(100, 150, 255, 0.8)';
    });
    
    tab.addEventListener('mouseleave', function() {
      if (!this.classList.contains('active')) {
        const activeTab = document.querySelector('.tabs a.active');
        if (activeTab) {
          const rect = activeTab.getBoundingClientRect();
          const parentRect = activeTab.parentElement.getBoundingClientRect();
          
          selector.style.width = rect.width + 'px';
          selector.style.left = (rect.left - parentRect.left) + 'px';
        }
        selector.style.opacity = '1';
      }
      
      // Remove hover glow effect
      this.style.textShadow = '';
    });
  });
}

function setActiveTab() {
  const currentPath = window.location.pathname;
  const tabs = document.querySelectorAll('.tabs a');
  
  // Remove active class from all tabs
  tabs.forEach(tab => tab.classList.remove('active'));
  
  // Set active tab based on current page
  if (currentPath.includes('collections/stickers') || currentPath.includes('index.html') || currentPath === '/' || currentPath === '') {
    const allStickersTab = document.querySelector('.tabs a[href*="collections/stickers"]');
    if (allStickersTab) allStickersTab.classList.add('active');
  } else if (currentPath.includes('products/die-cut-stickers')) {
    const dieCutTab = document.querySelector('.tabs a[href*="products/die-cut-stickers"]');
    if (dieCutTab) dieCutTab.classList.add('active');
  } else if (currentPath.includes('products/qr-code-stickers')) {
    const qrCodeTab = document.querySelector('.tabs a[href*="products/qr-code-stickers"]');
    if (qrCodeTab) qrCodeTab.classList.add('active');
  } else if (currentPath.includes('products/holographic-stickers')) {
    const holographicTab = document.querySelector('.tabs a[href*="products/holographic-stickers"]');
    if (holographicTab) holographicTab.classList.add('active');
  } else if (currentPath.includes('collections/deals')) {
    const dealsTab = document.querySelector('.tabs a[href*="collections/deals"]');
    if (dealsTab) dealsTab.classList.add('active');
  } else if (currentPath.includes('pages/contact')) {
    const contactTab = document.querySelector('.tabs a[href*="pages/contact"]');
    if (contactTab) contactTab.classList.add('active');
  }
  
  // Reinitialize tabs after setting active state
  setTimeout(() => {
    initElasticTabs();
  }, 100);
}

function addSpaceParticles() {
  const elasticTabs = document.querySelector('.elastic-tabs');
  if (!elasticTabs) return;
  
  // Create multiple floating particles
  for (let i = 0; i < 5; i++) {
    createParticle(elasticTabs, i);
  }
}

function createParticle(container, index) {
  const particle = document.createElement('div');
  particle.className = 'space-particle';
  particle.style.cssText = `
    position: absolute;
    width: 2px;
    height: 2px;
    background: rgba(100, 150, 255, 0.6);
    border-radius: 50%;
    pointer-events: none;
    z-index: 1;
    animation: particleFloat 4s infinite ease-in-out;
    animation-delay: ${index * 0.8}s;
  `;
  
  // Random position
  particle.style.left = Math.random() * 80 + 10 + '%';
  particle.style.top = Math.random() * 80 + 10 + '%';
  
  container.appendChild(particle);
  
  // Add CSS animation
  if (!document.querySelector('#particle-styles')) {
    const style = document.createElement('style');
    style.id = 'particle-styles';
    style.textContent = `
      @keyframes particleFloat {
        0%, 100% { 
          transform: translateY(0px) scale(1);
          opacity: 0.6;
        }
        50% { 
          transform: translateY(-15px) scale(1.5);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

function createSpaceEffect(element) {
  // Create a burst of particles when tab is clicked
  const rect = element.getBoundingClientRect();
  const container = element.closest('.elastic-tabs');
  
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 3px;
      height: 3px;
      background: linear-gradient(135deg, #4059e6, #6c5ce7);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
      animation: burstEffect 0.8s ease-out forwards;
    `;
    
    // Random direction
    const angle = (i / 8) * Math.PI * 2;
    const distance = 30 + Math.random() * 20;
    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;
    
    particle.style.setProperty('--end-x', endX + 'px');
    particle.style.setProperty('--end-y', endY + 'px');
    
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      particle.remove();
    }, 800);
  }
  
  // Add burst animation CSS
  if (!document.querySelector('#burst-styles')) {
    const style = document.createElement('style');
    style.id = 'burst-styles';
    style.textContent = `
      @keyframes burstEffect {
        0% {
          transform: translate(0, 0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(var(--end-x), var(--end-y)) scale(0);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Handle window resize
window.addEventListener('resize', function() {
  setTimeout(() => {
    initElasticTabs();
  }, 100);
});

// Add smooth scrolling for anchor links
document.addEventListener('click', function(e) {
  if (e.target.matches('.tabs a[href^="#"]')) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
});

// Add loading animation for page transitions
document.addEventListener('click', function(e) {
  if (e.target.matches('.tabs a[href*=".html"]') || e.target.matches('.tabs a[href*="/"]')) {
    const tab = e.target;
    tab.style.transform = 'scale(0.95)';
    setTimeout(() => {
      tab.style.transform = '';
    }, 150);
  }
});

// Add cosmic background effect
function addCosmicBackground() {
  const elasticTabs = document.querySelector('.elastic-tabs');
  if (!elasticTabs) return;
  
  // Add subtle cosmic background
  elasticTabs.style.background = `
    linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(20, 20, 40, 0.9)),
    radial-gradient(circle at 20% 80%, rgba(100, 150, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(150, 100, 255, 0.1) 0%, transparent 50%)
  `;
}

// Initialize cosmic background
document.addEventListener('DOMContentLoaded', addCosmicBackground); 