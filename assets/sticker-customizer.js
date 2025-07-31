// Sticker Customizer Script
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on a product page that needs the customizer
  const productOptionsSection = document.querySelector('product-options-section');
  if (!productOptionsSection) return;

  // Create the customizer container
  const customizerContainer = document.createElement('div');
  customizerContainer.className = 'sticker-customizer';
  customizerContainer.innerHTML = `
    <h3 class="sticker-customizer__title">Design Your Die Cut Sticker</h3>
    <div class="sticker-customizer__preview-container">
      <div class="sticker-customizer__preview">
        <div class="sticker-customizer__preview-image">
          <img src="" id="preview-image" alt="Your sticker preview" class="placeholder">
          <svg class="sticker-customizer__die-cut-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M50,10 C72,10 90,28 90,50 C90,72 72,90 50,90 C28,90 10,72 10,50 C10,28 28,10 50,10 Z" fill="none" stroke="#FF5722" stroke-width="1" stroke-dasharray="5,5"/>
          </svg>
        </div>
        <div class="sticker-customizer__preview-upload">
          <label for="sticker-image-upload" class="button button--primary">Upload Your Design</label>
          <input type="file" id="sticker-image-upload" accept="image/*" style="display:none">
          <p class="sticker-customizer__help-text">For best results, use a PNG with transparent background</p>
        </div>
      </div>
      <div class="sticker-customizer__controls">
        <div class="sticker-customizer__control-group">
          <h4 class="sticker-customizer__control-title">Shape</h4>
          <div class="sticker-customizer__shape-options">
            <label class="sticker-customizer__option">
              <input type="radio" name="shape" value="custom" checked>
              <span class="sticker-customizer__option-content">
                <svg viewBox="0 0 100 100" width="24" height="24">
                  <path d="M50,10 C70,10 90,30 90,50 C90,70 70,90 50,90 C30,90 10,70 10,50 C10,30 30,10 50,10 Z" fill="none" stroke="#000" stroke-width="2"/>
                </svg>
                <span>Custom Die Cut</span>
              </span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="shape" value="square">
              <span class="sticker-customizer__option-content">
                <svg viewBox="0 0 100 100" width="24" height="24">
                  <rect x="15" y="15" width="70" height="70" fill="none" stroke="#000" stroke-width="2"/>
                </svg>
                <span>Square</span>
              </span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="shape" value="circle">
              <span class="sticker-customizer__option-content">
                <svg viewBox="0 0 100 100" width="24" height="24">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#000" stroke-width="2"/>
                </svg>
                <span>Circle</span>
              </span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="shape" value="rounded-corner">
              <span class="sticker-customizer__option-content">
                <svg viewBox="0 0 100 100" width="24" height="24">
                  <rect x="15" y="15" width="70" height="70" rx="15" ry="15" fill="none" stroke="#000" stroke-width="2"/>
                </svg>
                <span>Rounded Corner</span>
              </span>
            </label>
          </div>
        </div>
        
        <div class="sticker-customizer__control-group">
          <h4 class="sticker-customizer__control-title">Material</h4>
          <div class="sticker-customizer__material-options">
            <label class="sticker-customizer__option">
              <input type="radio" name="material" value="vinyl" checked>
              <span class="sticker-customizer__option-content sticker-customizer__option-content--material">
                <div class="sticker-customizer__material-icon vinyl"></div>
                <span>Vinyl</span>
              </span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="material" value="holographic">
              <span class="sticker-customizer__option-content sticker-customizer__option-content--material">
                <div class="sticker-customizer__material-icon holographic"></div>
                <span>Holographic</span>
              </span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="material" value="transparent">
              <span class="sticker-customizer__option-content sticker-customizer__option-content--material">
                <div class="sticker-customizer__material-icon transparent"></div>
                <span>Transparent</span>
              </span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="material" value="glitter">
              <span class="sticker-customizer__option-content sticker-customizer__option-content--material">
                <div class="sticker-customizer__material-icon glitter"></div>
                <span>Glitter</span>
              </span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="material" value="mirror">
              <span class="sticker-customizer__option-content sticker-customizer__option-content--material">
                <div class="sticker-customizer__material-icon mirror"></div>
                <span>Mirror</span>
              </span>
            </label>
          </div>
        </div>
        
        <div class="sticker-customizer__control-group">
          <h4 class="sticker-customizer__control-title">Finish</h4>
          <div class="sticker-customizer__select-wrapper">
            <select class="sticker-customizer__select" id="finish-select">
              <option value="glossy" selected>Glossy</option>
              <option value="matte">Matte</option>
            </select>
          </div>
        </div>
        
        <div class="sticker-customizer__control-group">
          <h4 class="sticker-customizer__control-title">Size, Inch (WxH)</h4>
          <div class="sticker-customizer__size-options sticker-customizer__radio-list">
            <label class="sticker-customizer__option">
              <input type="radio" name="size" value="2x2" checked>
              <span class="sticker-customizer__option-content">2" x 2"</span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="size" value="3x3">
              <span class="sticker-customizer__option-content">3" x 3"</span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="size" value="4x4">
              <span class="sticker-customizer__option-content">4" x 4"</span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="size" value="5x5">
              <span class="sticker-customizer__option-content">5" x 5"</span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="size" value="6x6">
              <span class="sticker-customizer__option-content">6" x 6"</span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="size" value="7x7">
              <span class="sticker-customizer__option-content">7" x 7"</span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="size" value="8x8">
              <span class="sticker-customizer__option-content">8" x 8"</span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="size" value="9x9">
              <span class="sticker-customizer__option-content">9" x 9"</span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="size" value="10x10">
              <span class="sticker-customizer__option-content">10" x 10"</span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="size" value="custom">
              <span class="sticker-customizer__option-content">Custom size</span>
            </label>
          </div>
          
          <div class="sticker-customizer__custom-size" style="display: none; margin-top: 10px;">
            <div class="sticker-customizer__custom-size-inputs">
              <input type="number" id="custom-width" min="1" max="24" step="0.1" placeholder="Width" class="sticker-customizer__input">
              <span class="sticker-customizer__dimension-separator">×</span>
              <input type="number" id="custom-height" min="1" max="24" step="0.1" placeholder="Height" class="sticker-customizer__input">
              <span class="sticker-customizer__dimension-unit">inches</span>
            </div>
          </div>
        </div>
        
        <div class="sticker-customizer__control-group">
          <h4 class="sticker-customizer__control-title">Quantity</h4>
          <div class="sticker-customizer__quantity-options sticker-customizer__radio-list">
            <label class="sticker-customizer__option">
              <input type="radio" name="quantity" value="50" checked>
              <span class="sticker-customizer__option-content">
                <span>50 pcs</span>
                <span class="sticker-customizer__price">$28</span>
              </span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="quantity" value="100">
              <span class="sticker-customizer__option-content">
                <span>100 pcs</span>
                <span class="sticker-customizer__price">$37</span>
              </span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="quantity" value="200">
              <span class="sticker-customizer__option-content">
                <span>200 pcs</span>
                <span class="sticker-customizer__price">$64</span>
                <span class="sticker-customizer__discount">-30%</span>
              </span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="quantity" value="300">
              <span class="sticker-customizer__option-content">
                <span>300 pcs</span>
                <span class="sticker-customizer__price">$96</span>
                <span class="sticker-customizer__discount">-20%</span>
              </span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="quantity" value="500">
              <span class="sticker-customizer__option-content">
                <span>500 pcs</span>
                <span class="sticker-customizer__price">$136</span>
                <span class="sticker-customizer__discount">-30%</span>
              </span>
            </label>
            <label class="sticker-customizer__option">
              <input type="radio" name="quantity" value="1000">
              <span class="sticker-customizer__option-content">
                <span>1000 pcs</span>
                <span class="sticker-customizer__price">$220</span>
                <span class="sticker-customizer__discount">-40%</span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
    
    <div class="sticker-customizer__actions">
      <button id="customizer-add-to-cart" class="sticker-customizer__add-button button button--primary">Add to Cart</button>
      <button id="customizer-upload-file" class="sticker-customizer__upload-button button button--secondary">Upload File</button>
    </div>
  `;

  // Insert the customizer before the product-custom-option div
  const productCustomOption = productOptionsSection.querySelector('.product-custom-option');
  if (productCustomOption) {
    productOptionsSection.insertBefore(customizerContainer, productCustomOption);
  } else {
    // Fallback: insert at the beginning of the product-options-section
    productOptionsSection.prepend(customizerContainer);
  }
  
  // Add extra CSS for the customizer
  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  styleLink.href = '../assets/sticker-customizer-extra.css';
  document.head.appendChild(styleLink);

  // Handle image upload
  const imageUploadInput = document.getElementById('sticker-image-upload');
  const previewImage = document.getElementById('preview-image');

  if (imageUploadInput && previewImage) {
    imageUploadInput.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          previewImage.src = e.target.result;
          // Remove placeholder styling
          previewImage.classList.remove('placeholder');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Handle die cut shape selection
  const dieOptions = document.querySelectorAll('.sticker-customizer__die-cut-option');
  const dieOverlay = document.querySelector('.sticker-customizer__die-cut-overlay path');
  
  dieOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove active class from all options
      dieOptions.forEach(opt => opt.classList.remove('active'));
      // Add active class to selected option
      this.classList.add('active');
      
      // Update die-cut overlay shape
      const shape = this.getAttribute('data-shape');
      if (shape === 'circle') {
        dieOverlay.setAttribute('d', 'M50,10 C72,10 90,28 90,50 C90,72 72,90 50,90 C28,90 10,72 10,50 C10,28 28,10 50,10 Z');
      } else if (shape === 'square') {
        dieOverlay.setAttribute('d', 'M10,10 L90,10 L90,90 L10,90 Z');
      } else if (shape === 'custom') {
        dieOverlay.setAttribute('d', 'M50,10 C70,10 90,30 90,50 C90,70 70,90 50,90 C30,90 10,70 10,50 C10,30 30,10 50,10 Z');
      }
      
      // Update any related Option Calculator fields if they exist
      updateOptionCalculatorFields();
    });
  });
  
  // Handle size option selection
  const sizeOptions = document.querySelectorAll('.sticker-customizer__size-option');
  const customSizeSection = document.querySelector('.sticker-customizer__custom-size');
  
  sizeOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove active class from all options
      sizeOptions.forEach(opt => opt.classList.remove('active'));
      // Add active class to selected option
      this.classList.add('active');
      
      const size = this.getAttribute('data-size');
      // Show/hide custom size inputs
      if (size === 'custom') {
        customSizeSection.style.display = 'block';
      } else {
        customSizeSection.style.display = 'none';
      }
      
      // Update preview size visualization
      updatePreviewSize(size);
      
      // Update any related Option Calculator fields if they exist
      updateOptionCalculatorFields();
    });
  });
  
  // Custom size input handlers
  const customWidthInput = document.getElementById('custom-width');
  const customHeightInput = document.getElementById('custom-height');
  
  if (customWidthInput && customHeightInput) {
    [customWidthInput, customHeightInput].forEach(input => {
      input.addEventListener('input', function() {
        // Validate input
        if (this.value < 1) this.value = 1;
        if (this.value > 24) this.value = 24;
        
        // Update preview and calculator
        if (customWidthInput.value && customHeightInput.value) {
          updatePreviewSize('custom', customWidthInput.value, customHeightInput.value);
          updateOptionCalculatorFields();
        }
      });
    });
  }
  
  // Function to update preview size visualization
  function updatePreviewSize(size, width, height) {
    const previewContainer = document.querySelector('.sticker-customizer__preview-image');
    if (!previewContainer) return;
    
    // Reset transformations
    previewContainer.style.transform = '';
    
    if (size === 'custom' && width && height) {
      // For custom sizes, adjust the preview container's aspect ratio
      const aspectRatio = width / height;
      if (aspectRatio > 1) {
        // Wider than tall
        previewContainer.style.transform = `scaleX(${aspectRatio})`;
      } else if (aspectRatio < 1) {
        // Taller than wide
        previewContainer.style.transform = `scaleY(${1/aspectRatio})`;
      }
    } else {
      // For standard sizes, just adjust scale for visual feedback
      const scaleMap = {
        '2': 0.8,
        '3': 1,
        '4': 1.2,
        '5': 1.3
      };
      const scale = scaleMap[size] || 1;
      previewContainer.style.transform = `scale(${scale})`;
    }
  }
  
  // Function to update the Option Calculator fields based on customizer selections
  function updateOptionCalculatorFields() {
    // Find the active shape and size
    const activeShape = document.querySelector('.sticker-customizer__die-cut-option.active');
    const activeSize = document.querySelector('.sticker-customizer__size-option.active');
    
    if (!activeShape || !activeSize) return;
    
    const shape = activeShape.getAttribute('data-shape');
    const size = activeSize.getAttribute('data-size');
    
    // Look for related Option Calculator fields to update
    // This is a generic approach; would need to be customized based on the specific Option Calculator structure
    const optionInputs = document.querySelectorAll('.product-custom-option input, .product-custom-option select');
    
    optionInputs.forEach(input => {
      const label = input.closest('label') || input.parentElement.querySelector('label');
      if (!label) return;
      
      const labelText = label.textContent.toLowerCase();
      
      // Match fields based on label text
      if (labelText.includes('shape') || labelText.includes('type')) {
        // Update shape field
        if (input.tagName === 'SELECT') {
          // For select dropdown
          Array.from(input.options).forEach(option => {
            if (option.text.toLowerCase().includes(shape)) {
              option.selected = true;
            }
          });
        } else if (input.type === 'radio') {
          // For radio buttons
          if (label.textContent.toLowerCase().includes(shape)) {
            input.checked = true;
          }
        }
      } else if (labelText.includes('size') || labelText.includes('dimension')) {
        // Update size field
        if (size === 'custom') {
          const customWidth = document.getElementById('custom-width').value;
          const customHeight = document.getElementById('custom-height').value;
          
          if (input.tagName === 'SELECT') {
            // Try to find a custom option
            Array.from(input.options).forEach(option => {
              if (option.text.toLowerCase().includes('custom')) {
                option.selected = true;
              }
            });
          } else if (input.type === 'text' || input.type === 'number') {
            // If it's a dimension input field
            if (labelText.includes('width')) {
              input.value = customWidth;
            } else if (labelText.includes('height')) {
              input.value = customHeight;
            } else {
              input.value = `${customWidth}" × ${customHeight}"`;
            }
          }
        } else {
          if (input.tagName === 'SELECT') {
            // For select dropdown
            Array.from(input.options).forEach(option => {
              if (option.text.includes(`${size}"`)) {
                option.selected = true;
              }
            });
          } else if (input.type === 'radio') {
            // For radio buttons
            if (label.textContent.includes(`${size}"`)) {
              input.checked = true;
            }
          } else if (input.type === 'text' || input.type === 'number') {
            input.value = `${size}"`;
          }
        }
      }
    });
    
    // Trigger change events to update prices if needed
    optionInputs.forEach(input => {
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    });
  }
});
