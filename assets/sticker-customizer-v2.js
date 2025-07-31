document.addEventListener('DOMContentLoaded', function() {
  console.log('Sticker Customizer v2 loaded and ready to initialize');

  // Check if we're on the die-cut-stickers page
  const currentUrl = window.location.pathname;
  if (currentUrl.includes('die-cut-stickers')) {
    initializeCustomizer();
  }
});

  // Utility function to format price
  function formatPrice(price) {
    return '$' + parseFloat(price).toFixed(2);
  }
  
  // Utility function to update price calculation
  function calculatePrice(size, material, quantity) {
    // Base pricing
    const basePrices = {
      '2inch': 0.50,
      '3inch': 0.75,
      '4inch': 1.00,
      '5inch': 1.25,
      'custom': 1.50
    };
    
    // Material multipliers
    const materialMultipliers = {
      'vinyl': 1.0,
      'holographic': 1.5,
      'transparent': 1.2,
      'glitter': 1.8,
      'mirror': 2.0
    };
    
    // Quantity discounts
    let quantityDiscount = 1.0;
    if (quantity >= 1000) {
      quantityDiscount = 0.6;
    } else if (quantity >= 500) {
      quantityDiscount = 0.7;
    } else if (quantity >= 250) {
      quantityDiscount = 0.8;
    } else if (quantity >= 100) {
      quantityDiscount = 0.9;
    }
    
    // Calculate price
    const basePrice = basePrices[size] || basePrices['2inch'];
    const materialMultiplier = materialMultipliers[material] || materialMultipliers['vinyl'];
    
    return basePrice * materialMultiplier * quantity * quantityDiscount;
  }

  function initializeCustomizer() {
    // Create the customizer container
    const customizerContainer = document.createElement('div');
    customizerContainer.className = 'sticker-customizer';
    customizerContainer.innerHTML = `
      <h2 class="sticker-customizer__title">Customize Your Die-Cut Stickers</h2>
      <div class="sticker-customizer__layout">
        <div class="sticker-customizer__preview-column">
          <div class="sticker-customizer__preview shape-custom">
            <div class="sticker-customizer__upload-area">
              <input type="file" id="sticker-image-upload" accept="image/*" style="display: none;">
              <svg class="upload-icon" width="48" height="48">
                <use href="../assets/customizer-icons.svg#icon-upload"></use>
              </svg>
              <p class="upload-text">Upload your design</p>
              <img src="../assets/customizer-placeholder.png" alt="Sticker preview" class="sticker-preview-image">
              <img src="../assets/sticker-outline.svg" alt="" class="sticker-outline-overlay">
              <p class="uploaded-filename" style="display: none;"></p>
            </div>
            <button class="button button--secondary sticker-customizer__upload-button">
              Upload Design
            </button>
          </div>
        </div>
        
        <div class="sticker-customizer__options-column">
          <div class="sticker-customizer__control-group">
            <h3 class="sticker-customizer__control-title">Shape</h3>
            <div class="sticker-customizer__shape-options">
              <label class="sticker-customizer__option">
                <input type="radio" name="sticker-shape" value="custom" checked>
                <div class="sticker-customizer__option-content">
                  <svg width="24" height="24"><use href="../assets/customizer-icons.svg#icon-custom"></use></svg>
                  Custom Die Cut
                </div>
              </label>
              <label class="sticker-customizer__option">
                <input type="radio" name="sticker-shape" value="square">
                <div class="sticker-customizer__option-content">
                  <svg width="24" height="24"><use href="../assets/customizer-icons.svg#icon-square"></use></svg>
                  Square
                </div>
              </label>
              <label class="sticker-customizer__option">
                <input type="radio" name="sticker-shape" value="circle">
                <div class="sticker-customizer__option-content">
                  <svg width="24" height="24"><use href="../assets/customizer-icons.svg#icon-circle"></use></svg>
                  Circle
                </div>
              </label>
              <label class="sticker-customizer__option">
                <input type="radio" name="sticker-shape" value="rounded">
                <div class="sticker-customizer__option-content">
                  <svg width="24" height="24"><use href="../assets/customizer-icons.svg#icon-rounded"></use></svg>
                  Rounded
                </div>
              </label>
            </div>
          </div>
          
          <div class="sticker-customizer__control-group">
            <h3 class="sticker-customizer__control-title">Material</h3>
            <div class="sticker-customizer__material-options">
              <label class="sticker-customizer__option">
                <input type="radio" name="sticker-material" value="vinyl" checked>
                <div class="sticker-customizer__option-content">
                  <div class="sticker-customizer__material-icon vinyl"></div>
                  Vinyl
                </div>
              </label>
              <label class="sticker-customizer__option">
                <input type="radio" name="sticker-material" value="holographic">
                <div class="sticker-customizer__option-content">
                  <div class="sticker-customizer__material-icon holographic"></div>
                  Holographic
                </div>
              </label>
              <label class="sticker-customizer__option">
                <input type="radio" name="sticker-material" value="transparent">
                <div class="sticker-customizer__option-content">
                  <div class="sticker-customizer__material-icon transparent"></div>
                  Transparent
                </div>
              </label>
              <label class="sticker-customizer__option">
                <input type="radio" name="sticker-material" value="glitter">
                <div class="sticker-customizer__option-content">
                  <div class="sticker-customizer__material-icon glitter"></div>
                  Glitter
                </div>
              </label>
              <label class="sticker-customizer__option">
                <input type="radio" name="sticker-material" value="mirror">
                <div class="sticker-customizer__option-content">
                  <div class="sticker-customizer__material-icon mirror"></div>
                  Mirror
                </div>
              </label>
            </div>
          </div>
          
          <div class="sticker-customizer__control-group">
            <h3 class="sticker-customizer__control-title">Size</h3>
            <div class="sticker-customizer__select-wrapper">
              <select id="sticker-size" class="sticker-customizer__select">
                <option value="2inch">2 inch</option>
                <option value="3inch" selected>3 inch</option>
                <option value="4inch">4 inch</option>
                <option value="5inch">5 inch</option>
                <option value="custom">Custom Size</option>
              </select>
            </div>
            <div class="sticker-customizer__custom-size-inputs" style="display: none; margin-top: 10px;">
              <input type="number" id="custom-width" class="sticker-customizer__input" placeholder="Width" min="1" max="12" step="0.25">
              <span class="sticker-customizer__dimension-separator">×</span>
              <input type="number" id="custom-height" class="sticker-customizer__input" placeholder="Height" min="1" max="12" step="0.25">
              <span class="sticker-customizer__dimension-unit">inches</span>
            </div>
          </div>
          
          <div class="sticker-customizer__control-group">
            <h3 class="sticker-customizer__control-title">Quantity</h3>
            <div class="sticker-customizer__radio-list">
              <label class="sticker-customizer__option">
                <input type="radio" name="sticker-quantity" value="50" checked>
                <div class="sticker-customizer__option-content">
                  50
                  <span class="sticker-customizer__price">$37.50</span>
                </div>
              </label>
              <label class="sticker-customizer__option">
                <input type="radio" name="sticker-quantity" value="100">
                <div class="sticker-customizer__option-content">
                  100
                  <span class="sticker-customizer__price">$67.50</span>
                  <span class="sticker-customizer__discount">10% off</span>
                </div>
              </label>
              <label class="sticker-customizer__option">
                <input type="radio" name="sticker-quantity" value="250">
                <div class="sticker-customizer__option-content">
                  250
                  <span class="sticker-customizer__price">$150.00</span>
                  <span class="sticker-customizer__discount">20% off</span>
                </div>
              </label>
              <label class="sticker-customizer__option">
                <input type="radio" name="sticker-quantity" value="500">
                <div class="sticker-customizer__option-content">
                  500
                  <span class="sticker-customizer__price">$262.50</span>
                  <span class="sticker-customizer__discount">30% off</span>
                </div>
              </label>
              <label class="sticker-customizer__option">
                <input type="radio" name="sticker-quantity" value="1000">
                <div class="sticker-customizer__option-content">
                  1000
                  <span class="sticker-customizer__price">$450.00</span>
                  <span class="sticker-customizer__discount">40% off</span>
                </div>
              </label>
              <label class="sticker-customizer__option">
                <input type="radio" name="sticker-quantity" value="custom">
                <div class="sticker-customizer__option-content">
                  Custom
                </div>
              </label>
            </div>
            
            <div id="custom-quantity-input" style="display: none; margin-top: 10px;">
              <input type="number" id="sticker-quantity-custom" class="sticker-customizer__input" value="50" min="50">
              <span class="sticker-customizer__help-text">Minimum order: 50 stickers</span>
            </div>
          </div>
          
          <div class="sticker-customizer__control-group">
            <h3 class="sticker-customizer__control-title">Total Price</h3>
            <div class="sticker-customizer__price-display">
              <span class="calculated-price">$37.50</span>
              <span class="price-per-sticker">$0.75 per sticker</span>
            </div>
          </div>
          
          <div class="sticker-customizer__actions">
            <button id="add-to-cart" class="button button--primary sticker-customizer__add-button">Add to Cart</button>
          </div>
        </div>
      </div>
    `;

    // Set up event listeners
    setupShapeSelectors(customizerContainer);
    setupMaterialSelectors(customizerContainer);
    setupSizeSelector(customizerContainer);
    setupQuantitySelectors(customizerContainer);
    setupFileUpload(customizerContainer);
    setupAddToCartButton(customizerContainer);

    // Initialize pricing
    updatePrice(customizerContainer);

    // Insert the customizer into the DOM
    const targetElement = document.querySelector('.product-section');
    if (targetElement) {
      targetElement.parentNode.insertBefore(customizerContainer, targetElement);
    }
  }
  
  function setupShapeSelectors(container) {
    const shapeInputs = container.querySelectorAll('input[name="sticker-shape"]');
    shapeInputs.forEach(input => {
      input.addEventListener('change', function() {
        if (this.checked) {
          const shape = this.value;
          const previewContainer = container.querySelector('.sticker-customizer__preview');
          
          // Update preview container class for shape-specific styling
          previewContainer.className = 'sticker-customizer__preview';
          previewContainer.classList.add(`shape-${shape}`);
          
          // Update pricing
          updatePrice(container);
        }
      });
    });
  }
  
  function setupMaterialSelectors(container) {
    const materialInputs = container.querySelectorAll('input[name="sticker-material"]');
    materialInputs.forEach(input => {
      input.addEventListener('change', function() {
        if (this.checked) {
          const material = this.value;
          const previewContainer = container.querySelector('.sticker-customizer__preview');
          
          // Remove all material classes
          previewContainer.classList.remove('material-vinyl', 'material-holographic', 'material-transparent', 'material-glitter', 'material-mirror');
          
          // Add selected material class
          previewContainer.classList.add(`material-${material}`);
          
          // Update pricing
          updatePrice(container);
        }
      });
    });
  }
  
  function setupSizeSelector(container) {
    const sizeSelect = container.querySelector('#sticker-size');
    const customSizeInputs = container.querySelector('.sticker-customizer__custom-size-inputs');
    
    sizeSelect.addEventListener('change', function() {
      if (this.value === 'custom') {
        customSizeInputs.style.display = 'flex';
      } else {
        customSizeInputs.style.display = 'none';
      }
      
      // Update pricing
      updatePrice(container);
    });
    
    // Handle custom size inputs
    const customWidth = container.querySelector('#custom-width');
    const customHeight = container.querySelector('#custom-height');
    
    [customWidth, customHeight].forEach(input => {
      input.addEventListener('input', function() {
        // Validate input
        let value = parseFloat(this.value) || 1;
        if (value < 1) value = 1;
        if (value > 12) value = 12;
        this.value = value;
        
        // Update pricing
        updatePrice(container);
      });
    });
  }
  
  function setupQuantitySelectors(container) {
    const quantityInputs = container.querySelectorAll('input[name="sticker-quantity"]');
    const customQuantityInput = container.querySelector('#sticker-quantity-custom');
    const customQuantityContainer = container.querySelector('#custom-quantity-input');
    
    quantityInputs.forEach(input => {
      input.addEventListener('change', function() {
        if (this.checked) {
          if (this.value === 'custom') {
            customQuantityContainer.style.display = 'block';
          } else {
            customQuantityContainer.style.display = 'none';
          }
          
          // Update pricing
          updatePrice(container);
        }
      });
    });
    
    // Handle custom quantity input
    customQuantityInput.addEventListener('input', function() {
      // Validate input
      let quantity = parseInt(this.value) || 50;
      if (quantity < 50) quantity = 50;
      this.value = quantity;
      
      // Update pricing
      updatePrice(container);
    });
  }
  
  function setupFileUpload(container) {
    const fileInput = container.querySelector('#sticker-image-upload');
    const uploadButton = container.querySelector('.sticker-customizer__upload-button');
    const uploadArea = container.querySelector('.sticker-customizer__upload-area');
    
    uploadButton.addEventListener('click', function() {
      fileInput.click();
    });
    
    uploadArea.addEventListener('click', function() {
      fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          const previewImage = container.querySelector('.sticker-preview-image');
          previewImage.src = e.target.result;
          previewImage.classList.add('has-image');
          
          // Show filename
          const filenameDisplay = container.querySelector('.uploaded-filename');
          filenameDisplay.textContent = file.name;
          filenameDisplay.style.display = 'block';
          
          // Hide upload icon and text
          container.querySelector('.upload-icon').style.display = 'none';
          container.querySelector('.upload-text').style.display = 'none';
        };
        
        reader.readAsDataURL(file);
      }
    });
  }
  
  function setupAddToCartButton(container) {
    const addToCartButton = container.querySelector('#add-to-cart');
    
    addToCartButton.addEventListener('click', function() {
      // Check if design was uploaded
      const previewImage = container.querySelector('.sticker-preview-image');
      if (!previewImage || !previewImage.classList.contains('has-image')) {
        alert('Please upload your sticker design before adding to cart.');
        return;
      }
      
      // Get selected options
      const shape = container.querySelector('input[name="sticker-shape"]:checked').value;
      const material = container.querySelector('input[name="sticker-material"]:checked').value;
      const size = container.querySelector('#sticker-size').value;
      
      let quantity;
      const quantityType = container.querySelector('input[name="sticker-quantity"]:checked').value;
      if (quantityType === 'custom') {
        quantity = parseInt(container.querySelector('#sticker-quantity-custom').value) || 50;
      } else {
        quantity = parseInt(quantityType);
      }
      
      // Update Shopify form
      updateShopifyForm(shape, material, size, quantity);
    });
  }
  
  function updateShopifyForm(shape, material, size, quantity) {
    // Find the Shopify form and options
    const form = document.querySelector('form[action$="/cart/add"]');
    if (!form) {
      alert('Could not find the Add to Cart form. Please try again.');
      return;
    }
    
    // Try to map our options to the Shopify form options
    try {
      // Get all selects from the Option Calculator if it exists
      const optionSelects = document.querySelectorAll('.product-custom-option select');
      
      if (optionSelects.length > 0) {
        // Option Calculator exists, try to map our options
        optionSelects.forEach(select => {
          // Try to match our options to the Option Calculator options
          const selectLabel = select.closest('.product-custom-option')?.previousElementSibling?.textContent.toLowerCase() || '';
          
          if (selectLabel.includes('shape') || selectLabel.includes('type')) {
            // Try to find matching shape option
            for (let i = 0; i < select.options.length; i++) {
              const option = select.options[i];
              if (option.textContent.toLowerCase().includes(shape)) {
                select.selectedIndex = i;
                const event = new Event('change', { bubbles: true });
                select.dispatchEvent(event);
                break;
              }
            }
          }
          
          if (selectLabel.includes('material')) {
            // Try to find matching material option
            for (let i = 0; i < select.options.length; i++) {
              const option = select.options[i];
              if (option.textContent.toLowerCase().includes(material)) {
                select.selectedIndex = i;
                const event = new Event('change', { bubbles: true });
                select.dispatchEvent(event);
                break;
              }
            }
          }
          
          if (selectLabel.includes('size')) {
            // Try to find matching size option
            for (let i = 0; i < select.options.length; i++) {
              const option = select.options[i];
              if (option.textContent.toLowerCase().includes(size)) {
                select.selectedIndex = i;
                const event = new Event('change', { bubbles: true });
                select.dispatchEvent(event);
                break;
              }
            }
          }
        });
      } else {
        // No Option Calculator, try to find standard Shopify options
        const sizeOption = document.querySelector('select[name="options[Size]"], select[data-option-name="Size"]');
        if (sizeOption) {
          // Find matching size option
          for (let i = 0; i < sizeOption.options.length; i++) {
            if (sizeOption.options[i].value.toLowerCase().includes(size)) {
              sizeOption.selectedIndex = i;
              break;
            }
          }
        }
        
        const materialOption = document.querySelector('select[name="options[Material]"], select[data-option-name="Material"]');
        if (materialOption) {
          // Find matching material option
          for (let i = 0; i < materialOption.options.length; i++) {
            if (materialOption.options[i].value.toLowerCase().includes(material)) {
              materialOption.selectedIndex = i;
              break;
            }
          }
        }
      }
      
      // Update quantity
      const quantityInput = document.querySelector('input[name="quantity"]');
      if (quantityInput) {
        quantityInput.value = quantity;
        const event = new Event('change', { bubbles: true });
        quantityInput.dispatchEvent(event);
      }
      
      // Add custom properties for the design upload
      let propertiesInput = form.querySelector('input[name="properties[_Design Uploaded]"]');
      if (!propertiesInput) {
        propertiesInput = document.createElement('input');
        propertiesInput.type = 'hidden';
        propertiesInput.name = 'properties[_Design Uploaded]';
        form.appendChild(propertiesInput);
      }
      propertiesInput.value = 'Yes';
      
      // Add shape property
      let shapeInput = form.querySelector('input[name="properties[Shape]"]');
      if (!shapeInput) {
        shapeInput = document.createElement('input');
        shapeInput.type = 'hidden';
        shapeInput.name = 'properties[Shape]';
        form.appendChild(shapeInput);
      }
      shapeInput.value = shape.charAt(0).toUpperCase() + shape.slice(1);
      
      // Add material property
      let materialInput = form.querySelector('input[name="properties[Material]"]');
      if (!materialInput) {
        materialInput = document.createElement('input');
        materialInput.type = 'hidden';
        materialInput.name = 'properties[Material]';
        form.appendChild(materialInput);
      }
      materialInput.value = material.charAt(0).toUpperCase() + material.slice(1);
      
      // Submit the form after a short delay to allow all changes to take effect
      setTimeout(() => {
        form.submit();
      }, 300);
    } catch (error) {
      console.error('Error updating Shopify form:', error);
      
      // Fallback: Just submit the form with basic properties
      const propertiesInput = document.createElement('input');
      propertiesInput.type = 'hidden';
      propertiesInput.name = 'properties[_Design Uploaded]';
      propertiesInput.value = 'Yes';
      form.appendChild(propertiesInput);
      
      form.submit();
    }
  }
  
  function updatePrice(container) {
    // Get selected options
    const shape = container.querySelector('input[name="sticker-shape"]:checked').value;
    const material = container.querySelector('input[name="sticker-material"]:checked').value;
    const size = container.querySelector('#sticker-size').value;
    
    let quantity;
    const quantityType = container.querySelector('input[name="sticker-quantity"]:checked').value;
    if (quantityType === 'custom') {
      quantity = parseInt(container.querySelector('#sticker-quantity-custom').value) || 50;
    } else {
      quantity = parseInt(quantityType);
    }
    
    // Calculate price
    const price = calculatePrice(size, material, quantity);
    
    // Update price display
    container.querySelector('.calculated-price').textContent = formatPrice(price);
    container.querySelector('.price-per-sticker').textContent = formatPrice(price / quantity) + ' per sticker';
    
    // Update quantity option prices
    updateQuantityOptionPrices(container, size, material);
  }
  
  function updateQuantityOptionPrices(container, size, material) {
    // Standard quantities
    const quantities = [50, 100, 250, 500, 1000];
    
    // Get material multiplier
    const materialMultipliers = {
      'vinyl': 1.0,
      'holographic': 1.5,
      'transparent': 1.2,
      'glitter': 1.8,
      'mirror': 2.0
    };
    
    // Get base price
    const basePrices = {
      '2inch': 0.50,
      '3inch': 0.75,
      '4inch': 1.00,
      '5inch': 1.25,
      'custom': 1.50
    };
    
    const basePrice = basePrices[size] || basePrices['3inch'];
    const materialMultiplier = materialMultipliers[material] || materialMultipliers['vinyl'];
    
    // Update each quantity option price
    quantities.forEach((quantity, index) => {
      // Get discount
      let discount = 1.0;
      if (quantity >= 1000) {
        discount = 0.6;
      } else if (quantity >= 500) {
        discount = 0.7;
      } else if (quantity >= 250) {
        discount = 0.8;
      } else if (quantity >= 100) {
        discount = 0.9;
      }
      
      const price = basePrice * materialMultiplier * quantity * discount;
      
      // Find the corresponding price element and update it
      const quantityOption = container.querySelector(`input[name="sticker-quantity"][value="${quantity}"]`);
      if (quantityOption) {
        const priceElement = quantityOption.closest('.sticker-customizer__option')
          .querySelector('.sticker-customizer__price');
        
        if (priceElement) {
          priceElement.textContent = formatPrice(price);
        }
      }
    });
  }
