// Utility: Load cart from localStorage
function loadCart() {
  return JSON.parse(localStorage.getItem('cartItems')) || [];
}

// Utility: Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cartItems', JSON.stringify(cart));
}

// Add to Cart logic
function addToCart(product, button) {
  let cart = loadCart();

  // Check if product exists in cart
  const index = cart.findIndex(item => item.id === product.id);

  if (index > -1) {
    cart[index].quantity += 1; // Increment quantity if exists
  } else {
    product.quantity = 1; // Initialize quantity
    cart.push(product);
  }

  saveCart(cart);
  renderCart(); // Update cart UI
  updateCartCount(); // Update cart count
  showAddToCartAlert(); // Show success alert

  // Provide visual feedback on the button
  if (button) {
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.disabled = true;
    button.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      button.style.background = ''; // Reset to original via CSS
    }, 2000);
  }
}

// Show add to cart success alert
function showAddToCartAlert() {
  // Create alert element
  const alert = document.createElement('div');
  alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
  alert.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
  alert.innerHTML = `
    <i class="fa-solid fa-check-circle me-2"></i>
    <strong>Success!</strong> Item added to cart successfully.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  document.body.appendChild(alert);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, 3000);
}

// Update item quantity (+/-)
function updateQuantity(productId, change) {
  let cart = loadCart();
  const index = cart.findIndex(item => item.id === productId);

  if (index > -1) {
    cart[index].quantity += change;

    // Remove item if quantity drops to 0 or below
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart(); // Refresh cart display
    updateCartCount(); // Update cart count
  }
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = loadCart();
  // Filter out the item to delete
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  renderCart();
  updateCartCount(); // Update cart count
}

// Render Cart with Interactive Controls
function renderCart() {
  const cart = loadCart();
  const tbody = document.querySelector('#cart-container table tbody');
  const totalAmountElement = document.getElementById('total-amount');
  
  if (!tbody) return;
  
  tbody.innerHTML = ''; // Clear existing content
  
  if (cart.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4">
          <i class="fa-solid fa-shopping-cart fa-2x text-muted mb-2"></i>
          <p class="text-muted">Your cart is empty</p>
        </td>
      </tr>
    `;
    if (totalAmountElement) {
      totalAmountElement.textContent = '0.00';
    }
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const row = document.createElement('tr');
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    // Build cart row HTML with buttons
    row.innerHTML = `
      <td class="text-center">
        <input type="checkbox" class="form-check-input cart-item-checkbox" data-item-id="${item.id}" checked>
      </td>
      <td><img src="${item.image}" width="50" height="50" class="rounded" style="object-fit: cover;"/></td>
      <td>
        <div>
          <div class="fw-bold">${item.name}</div>
          <small class="text-muted">$${item.price.toFixed(1)} each</small>
        </div>
      </td>
      <td class="fw-bold">$${itemTotal.toFixed(1)}</td>
      <td>
        <div class="btn-group" role="group">
          <button class="btn btn-sm btn-outline-secondary decrement" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
          <span class="btn btn-sm btn-outline-secondary disabled">${item.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary increment">+</button>
        </div>
      </td>
      <td>
        <button class="btn btn-danger btn-sm delete" title="Remove item">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;

    // Attach event listeners to dynamic elements
    row.querySelector('.increment').addEventListener('click', () => {
      updateQuantity(item.id, 1); // Increase quantity
    });
    
    row.querySelector('.decrement').addEventListener('click', () => {
      updateQuantity(item.id, -1); // Decrease quantity
    });
    
    row.querySelector('.delete').addEventListener('click', () => {
      removeFromCart(item.id); // Remove item
    });

    tbody.appendChild(row);
  });
  
  // Update total
  if (totalAmountElement) {
    totalAmountElement.textContent = total.toFixed(2);
  }

  // Update select all checkbox and selected total after rendering
  updateSelectAllCheckbox();
  updateSelectedTotal();
}

// Initialize product cards with Add to Cart buttons
function setupProductCards() {
  document.querySelectorAll('.add-to-cart').forEach((btn) => {
    // Extract product details from data attributes
    const product = {
      id: btn.getAttribute('data-product-id'),
      name: btn.getAttribute('data-product-name'),
      price: parseFloat(btn.getAttribute('data-product-price')),
      image: btn.getAttribute('data-product-image')
    };

    // Attach click event listener
    btn.addEventListener('click', () => {
      // Get selected size/color if available
      const productId = product.id;
      const sizeRadio = document.querySelector(`input[name="size-${productId}"]:checked`);
      const colorRadio = document.querySelector(`input[name="color-${productId}"]:checked`);

      const selectedProduct = { ...product };

      if (sizeRadio) {
        selectedProduct.size = sizeRadio.value;
        selectedProduct.name += ` (${sizeRadio.value})`;
        selectedProduct.id += `-${sizeRadio.value.toLowerCase()}`; // Make unique ID for variations
      }

      if (colorRadio) {
        selectedProduct.color = colorRadio.value;
        selectedProduct.name += ` (${colorRadio.value})`;
        selectedProduct.id += `-${colorRadio.value.toLowerCase()}`;
      }

      addToCart(selectedProduct, btn);
    });
  });
}

// Update cart count in navbar
function updateCartCount() {
  const cart = loadCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Update cart count in navbar if it exists
  const cartCountElements = document.querySelectorAll('.cart-count, #cart-count');
  cartCountElements.forEach(element => {
    element.textContent = totalItems;
    element.style.display = totalItems > 0 ? 'inline' : 'none';
  });
  
  // Add cart count badge to cart button if it doesn't exist
  const cartButtons = document.querySelectorAll('[data-bs-target="#staticBackdrop"]');
  cartButtons.forEach(button => {
    let badge = button.querySelector('.cart-count');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-count position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger';
      badge.style.fontSize = '0.7rem';
      button.style.position = 'relative';
      button.appendChild(badge);
    }
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'inline' : 'none';
  });
}

// Handle select all checkbox functionality
function setupSelectAllCheckbox() {
  const selectAllCheckbox = document.getElementById('select-all-checkbox');
  if (!selectAllCheckbox) return;

  selectAllCheckbox.addEventListener('change', () => {
    const isChecked = selectAllCheckbox.checked;
    const itemCheckboxes = document.querySelectorAll('.cart-item-checkbox');

    itemCheckboxes.forEach(checkbox => {
      checkbox.checked = isChecked;
    });

    updateSelectedTotal();
  });
}

// Handle individual checkbox changes
function setupItemCheckboxes() {
  document.addEventListener('change', (event) => {
    if (event.target.classList.contains('cart-item-checkbox')) {
      updateSelectAllCheckbox();
      updateSelectedTotal();
    }
  });
}

// Update select all checkbox state based on individual checkboxes
function updateSelectAllCheckbox() {
  const selectAllCheckbox = document.getElementById('select-all-checkbox');
  const itemCheckboxes = document.querySelectorAll('.cart-item-checkbox');

  if (!selectAllCheckbox || itemCheckboxes.length === 0) return;

  const checkedCount = document.querySelectorAll('.cart-item-checkbox:checked').length;
  const totalCount = itemCheckboxes.length;

  selectAllCheckbox.checked = checkedCount === totalCount;
  selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < totalCount;
}

// Update total to show only selected items
function updateSelectedTotal() {
  const selectedCheckboxes = document.querySelectorAll('.cart-item-checkbox:checked');
  const cart = loadCart();
  const totalAmountElement = document.getElementById('total-amount');

  if (!totalAmountElement) return;

  let selectedTotal = 0;

  selectedCheckboxes.forEach(checkbox => {
    const itemId = checkbox.getAttribute('data-item-id');
    const cartItem = cart.find(item => item.id === itemId);

    if (cartItem) {
      selectedTotal += cartItem.price * cartItem.quantity;
    }
  });

  totalAmountElement.textContent = selectedTotal.toFixed(2);
}

// Get selected items for checkout
function getSelectedItemsForCheckout() {
  const selectedCheckboxes = document.querySelectorAll('.cart-item-checkbox:checked');
  const cart = loadCart();
  const selectedItems = [];

  selectedCheckboxes.forEach(checkbox => {
    const itemId = checkbox.getAttribute('data-item-id');
    const cartItem = cart.find(item => item.id === itemId);

    if (cartItem) {
      selectedItems.push(cartItem);
    }
  });

  return selectedItems;
}

// Modified checkout function to handle selective checkout
function setupCheckoutButton() {
  const checkoutButton = document.querySelector('.offcanvas-footer .btn-dark');
  if (!checkoutButton) return;

  checkoutButton.addEventListener('click', (event) => {
    const selectedItems = getSelectedItemsForCheckout();

    if (selectedItems.length === 0) {
      event.preventDefault();
      alert('Please select at least one item to checkout.');
      return;
    }

    // Store selected items in sessionStorage for checkout page
    sessionStorage.setItem('checkoutItems', JSON.stringify(selectedItems));

    // Continue with normal checkout flow
    window.location.href = 'checkout.html';
  });
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
  setupProductCards();
  renderCart();
  updateCartCount();
  setupSelectAllCheckbox();
  setupItemCheckboxes();
  setupCheckoutButton();
});