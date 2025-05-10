// Utility: Load cart from localStorage
function loadCart() {
  return JSON.parse(localStorage.getItem('cartItems')) || [];
}

// Utility: Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cartItems', JSON.stringify(cart));
}

// Add to Cart logic
function addToCart(product) {
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
  }
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = loadCart();
  // Filter out the item to delete
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  renderCart();
}

// Render Cart with Interactive Controls
function renderCart() {
  const cart = loadCart();
  const tbody = document.querySelector('#cart-container table tbody');
  tbody.innerHTML = ''; // Clear existing content

  cart.forEach(item => {
    const row = document.createElement('tr');
    
    // Build cart row HTML with buttons
    row.innerHTML = `
      <td><img src="${item.image}" width="50"/></td>
      <td>${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary decrement">-</button>
        <span class="mx-2">${item.quantity}</span>
        <button class="btn btn-sm btn-outline-secondary increment">+</button>
      </td>
      <td>
        <button class="btn btn-danger btn-sm delete">
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
}

// Initialize product cards with Add to Cart buttons
function setupProductCards() {
  document.querySelectorAll('.product-item').forEach((item, index) => {
    // Extract product details
    const name = item.querySelector('h5').textContent;
    const price = parseFloat(
      item.querySelector('h6').textContent.replace(/[^\d.]/g, '')
    );
    const image = item.querySelector('img').src;

    // Create button dynamically
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-dark mt-2';
    btn.textContent = 'Add to Cart';
    
    // Unique ID for product identification
    const product = {
      id: `${name.toLowerCase().replace(/\s/g, '-')}-${index}`,
      name,
      price,
      image
    };
    
    btn.onclick = () => addToCart(product);
    item.appendChild(btn);
  });
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
  setupProductCards();
  renderCart();
});