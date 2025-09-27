// Filter functionality for Men's products
document.addEventListener("DOMContentLoaded", function () {
    // Select DOM elements
    const products = document.querySelectorAll(".product-item");
    const productContainer = document.getElementById("product-container");
    const checkboxes = document.querySelectorAll("#filter-box .form-check-input");
    const priceRange = document.getElementById("customRange1");
    const priceDisplay = document.getElementById("updated-price-range");
    const sortOptions = document.querySelectorAll('input[name="sort"]');
    const clearFiltersBtn = document.getElementById("clear-filters");
  
    // Initialize filter state to show all products
    checkboxes.forEach((checkbox) => (checkbox.checked = false)); // Uncheck all checkboxes
    if (priceRange) {
        priceRange.value = 10000; // Set a high price to include all products
    }
    if (priceDisplay) {
        priceDisplay.textContent = `$${priceRange ? priceRange.value : 10000}`;
    }
  
    // Filter products
    const updateFilters = () => {
      const selectedCategories = [];
      const selectedBrands = [];
  
      // Categorize checkboxes into categories and brands
      checkboxes.forEach((checkbox) => {
        const label = checkbox.nextElementSibling.textContent.trim().toLowerCase();
        if (checkbox.checked) {
          if (["all", "bags", "backpacks", "wallets"].includes(label)) {
            selectedCategories.push(label);
          } else {
            selectedBrands.push(label);
          }
        }
      });
  
      const maxPrice = parseFloat(priceRange ? priceRange.value : 10000);
  
      // Filter products
      let visibleCount = 0;
      products.forEach((product) => {
        const title = product.querySelector("h5")?.textContent.toLowerCase() || "";
        const brandElement = product.querySelector("p");
        const brand = brandElement
          ? brandElement.textContent.toLowerCase().replace("brand: ", "")
          : "unknown";
        const priceText = product
          .querySelector("h6")
          ?.textContent.match(/\d+(\.\d+)?/);
        const price = priceText ? parseFloat(priceText[0]) : Infinity;
  
        // Check if product matches category filter
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes("all") ||
          selectedCategories.some((cat) => {
            if (cat === "bags") {
              return title.includes("bag") || title.includes("briefcase") || title.includes("travel");
            }
            return title.includes(cat);
          });
        
        // Check if product matches brand filter
        const matchesBrand =
          selectedBrands.length === 0 || selectedBrands.includes(brand);
        
        // Check if product matches price filter
        const matchesPrice = price <= maxPrice;
  
        if (matchesCategory && matchesBrand && matchesPrice) {
          product.style.display = "block";
          visibleCount++;
        } else {
          product.style.display = "none";
        }
      });
  
      // Show "No products" message if no products are visible
      const noProductsMessage = document.getElementById("no-products-message");
      if (noProductsMessage) {
        noProductsMessage.style.display = visibleCount === 0 ? "block" : "none";
      }
    };
  
    // Sort products
    const sortProducts = (sortValue) => {
      const productsArray = Array.from(products);
      productsArray.sort((a, b) => {
        const priceA = parseFloat(
          a.querySelector("h6")?.textContent.match(/\d+(\.\d+)?/)?.[0] || 0
        );
        const priceB = parseFloat(
          b.querySelector("h6")?.textContent.match(/\d+(\.\d+)?/)?.[0] || 0
        );
  
        switch (sortValue) {
          case "low-to-high":
            return priceA - priceB;
          case "high-to-low":
            return priceB - priceA;
          case "newest-first":
            return 0; // Placeholder
          case "oldest-first":
            return 0; // Placeholder
          case "best-selling":
            return 0; // Placeholder
          default:
            return 0;
        }
      });
  
      // Re-append sorted products
      if (productContainer) {
        productContainer.innerHTML = "";
        productsArray.forEach((product) => productContainer.appendChild(product));
      }
      updateFilters();
    };
  
    // Event listeners
    checkboxes.forEach((checkbox) =>
      checkbox.addEventListener("change", updateFilters)
    );
    
    if (priceRange) {
        priceRange.addEventListener("input", () => {
            if (priceDisplay) {
                priceDisplay.textContent = `$${priceRange.value}`;
            }
            updateFilters();
        });
    }
    
    sortOptions.forEach((option) =>
      option.addEventListener("change", () => sortProducts(option.value))
    );
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", () => {
            checkboxes.forEach((checkbox) => (checkbox.checked = false));
            if (priceRange) {
                priceRange.value = 10000; // Reset to high value
            }
            if (priceDisplay) {
                priceDisplay.textContent = `$${priceRange ? priceRange.value : 10000}`;
            }
            sortOptions.forEach((option) => (option.checked = false));
            updateFilters();
        });
    }
  
    // Initial filter
    updateFilters();
});

// Filter via owl carousel
function filterProducts() {
    const filterValue = this.getAttribute("data-filter");
    const products = document.querySelectorAll(".product-item");

    products.forEach((product) => {
        if (filterValue === "all") {
            product.style.display = "block";
        } else {
            const category = product.getElementsByClassName("pic")[0]?.getAttribute("data-category")?.toLowerCase();
            if (category === filterValue) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        }
    });
}

  