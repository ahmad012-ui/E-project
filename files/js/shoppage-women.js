// Enhanced Filter functionality for Women's products
document.addEventListener("DOMContentLoaded", function () {
    // Initialize Owl Carousel
    $('#owl').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1000: {
                items: 4
            }
        }
    });

    // Select DOM elements
    const products = document.querySelectorAll(".product-item");
    const productContainer = document.getElementById("product-container");
    const categoryFilters = document.querySelectorAll(".category-filter");
    const brandFilters = document.querySelectorAll(".brand-filter");
    const priceRange = document.getElementById("customRange1");
    const priceDisplay = document.getElementById("updated-price-range");
    const sortOptions = document.querySelectorAll('input[name="sort"]');
    const clearFiltersBtn = document.getElementById("clear-filters");
    const carouselFilters = document.querySelectorAll(".carousel-filter");
    const noProductsMessage = document.getElementById("no-products-message");

    // Initialize filter state
    if (priceRange) {
        priceRange.value = 1000; // Set reasonable default
        if (priceDisplay) {
            priceDisplay.textContent = `$${priceRange.value}`;
        }
    }

    // Carousel filter functionality
    carouselFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Remove active class from all carousel items
            carouselFilters.forEach(item => item.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Reset all other filters
            categoryFilters.forEach(checkbox => checkbox.checked = false);
            brandFilters.forEach(checkbox => checkbox.checked = false);
            
            // Apply carousel filter
            if (filterValue === 'all') {
                // Show all products
                products.forEach(product => {
                    product.style.display = 'block';
                });
            } else {
                // Filter by category
                products.forEach(product => {
                    const productCategory = product.getAttribute('data-category');
                    if (productCategory === filterValue) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
            }
            
            updateProductVisibility();
        });
    });

    // Enhanced filter function
    const updateFilters = () => {
        const selectedCategories = [];
        const selectedBrands = [];

        // Get selected categories
        categoryFilters.forEach(checkbox => {
            if (checkbox.checked) {
                selectedCategories.push(checkbox.value);
            }
        });

        // Get selected brands
        brandFilters.forEach(checkbox => {
            if (checkbox.checked) {
                selectedBrands.push(checkbox.value);
            }
        });

        const maxPrice = parseFloat(priceRange ? priceRange.value : 1000);

        // Filter products
        let visibleCount = 0;
        products.forEach(product => {
            const productCategory = product.getAttribute('data-category');
            const productBrand = product.getAttribute('data-brand');
            const productPrice = parseFloat(product.getAttribute('data-price'));

            // Check category match
            const matchesCategory = selectedCategories.length === 0 || 
                                  selectedCategories.includes('all') || 
                                  selectedCategories.includes(productCategory);

            // Check brand match
            const matchesBrand = selectedBrands.length === 0 || 
                               selectedBrands.includes(productBrand);

            // Check price match
            const matchesPrice = productPrice <= maxPrice;

            // Show/hide product based on all criteria
            if (matchesCategory && matchesBrand && matchesPrice) {
                product.style.display = 'block';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });

        // Update no products message
        updateProductVisibility();
    };

    // Update product visibility and show/hide no products message
    const updateProductVisibility = () => {
        const visibleProducts = Array.from(products).filter(product => 
            product.style.display !== 'none'
        );
        
        if (noProductsMessage) {
            if (visibleProducts.length === 0) {
                noProductsMessage.style.display = 'block';
            } else {
                noProductsMessage.style.display = 'none';
            }
        }
    };

    // Sort products function
    const sortProducts = (sortValue) => {
        const productsArray = Array.from(products);
        
        productsArray.sort((a, b) => {
            const priceA = parseFloat(a.getAttribute('data-price'));
            const priceB = parseFloat(b.getAttribute('data-price'));
            const nameA = a.querySelector('.card-title')?.textContent || '';
            const nameB = b.querySelector('.card-title')?.textContent || '';

            switch (sortValue) {
                case "low-to-high":
                    return priceA - priceB;
                case "high-to-low":
                    return priceB - priceA;
                case "newest-first":
                    // For now, sort by name as placeholder
                    return nameA.localeCompare(nameB);
                case "oldest-first":
                    return nameB.localeCompare(nameA);
                case "best-selling":
                    // Placeholder - could be based on data attribute
                    return Math.random() - 0.5;
                default:
                    return 0;
            }
        });

        // Re-append sorted products to container
        if (productContainer) {
            productsArray.forEach(product => {
                productContainer.appendChild(product);
            });
        }
        
        // Reapply filters after sorting
        updateFilters();
    };

    // Handle "All" category checkbox
    const allCategoryCheckbox = document.getElementById('category-all');
    if (allCategoryCheckbox) {
        allCategoryCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Uncheck all other category checkboxes
                categoryFilters.forEach(checkbox => {
                    if (checkbox !== this) {
                        checkbox.checked = false;
                    }
                });
            }
            updateFilters();
        });
    }

    // Handle other category checkboxes
    categoryFilters.forEach(checkbox => {
        if (checkbox.id !== 'category-all') {
            checkbox.addEventListener('change', function() {
                if (this.checked && allCategoryCheckbox) {
                    // Uncheck "All" if any specific category is selected
                    allCategoryCheckbox.checked = false;
                }
                updateFilters();
            });
        }
    });

    // Event listeners for brand filters
    brandFilters.forEach(checkbox => {
        checkbox.addEventListener("change", updateFilters);
    });

    // Price range event listener
    if (priceRange) {
        priceRange.addEventListener("input", () => {
            if (priceDisplay) {
                priceDisplay.textContent = `$${priceRange.value}`;
            }
            updateFilters();
        });
    }

    // Sort options event listeners
    sortOptions.forEach(option => {
        option.addEventListener("change", () => {
            if (option.checked) {
                sortProducts(option.value);
            }
        });
    });

    // Clear filters functionality
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", () => {
            // Reset all filters
            categoryFilters.forEach(checkbox => checkbox.checked = false);
            brandFilters.forEach(checkbox => checkbox.checked = false);
            
            if (priceRange) {
                priceRange.value = 1000;
                if (priceDisplay) {
                    priceDisplay.textContent = `$${priceRange.value}`;
                }
            }
            
            sortOptions.forEach(option => option.checked = false);
            
            // Remove active class from carousel filters
            carouselFilters.forEach(item => item.classList.remove('active'));
            
            // Show all products
            products.forEach(product => {
                product.style.display = 'block';
            });
            
            updateProductVisibility();
        });
    }

    // Initial setup - show all products
    updateFilters();
});

// Add CSS for carousel overlay and active states
const style = document.createElement('style');
style.textContent = `
    .carousel-filter {
        position: relative;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .carousel-filter:hover {
        transform: scale(1.05);
    }
    
    .carousel-filter.active {
        border: 3px solid #007bff;
        border-radius: 8px;
    }
    
    .carousel-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0,0,0,0.8));
        color: white;
        padding: 20px;
        text-align: center;
    }
    
    .carousel-overlay h3 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: bold;
    }
    
    .product-item {
        transition: all 0.3s ease;
    }
    
    .card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
`;
document.head.appendChild(style);