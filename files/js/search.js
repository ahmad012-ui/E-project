// Search functionality for NEXTAG website
document.addEventListener('DOMContentLoaded', function() {
    // Get search form and input elements
    const searchForms = document.querySelectorAll('form.d-flex');
    const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder="Search..."]');
    const searchResults = document.getElementById('search-card');
    
    // Product data - in a real application, this would come from a database
    const products = [
        // Men's products
        { name: "Backpack", price: 30.00, brand: "Gucci", category: "men", image: "img/pic1.webp" },
        { name: "Wallet", price: 250.30, brand: "Prada", category: "men", image: "img/wallet 222.jpg" },
        { name: "Travel Bag", price: 500.00, brand: "Fendi", category: "men", image: "img/download (1).jpeg" },
        { name: "Backpack", price: 280.00, brand: "Louis Vuitton", category: "men", image: "img/Commuter Backpack I Harber London.jpeg" },
        { name: "Fanny Pack", price: 100.00, brand: "Chanel", category: "men", image: "img/Fanny Pack 1.webp" },
        { name: "Travel Bag", price: 650.00, brand: "Gucci", category: "men", image: "img/GHURKA 'Cavalier No_97' bag.jpeg" },
        { name: "Travel bag", price: 350.00, brand: "Balenciaga", category: "men", image: "img/Gazeli Brown Leather Briefcase by Capra.jpeg" },
        { name: "Travel bag", price: 250.00, brand: "Dior", category: "men", image: "img/contact.jpeg" },
        { name: "Travel Bag", price: 300.00, brand: "YSL", category: "men", image: "img/Duffel bag 1.webp" },
        { name: "Travel Messenger bag", price: 250.00, brand: "Fendi", category: "men", image: "img/Messenger bag 2.webp" },
        { name: "Classic Leather Bags", price: 550.00, brand: "Prada", category: "men", image: "img/LEATHER GOODS MANUFACTURER_.jpeg" },
        { name: "Classic Leather Bag", price: 700.00, brand: "Louis Vuitton", category: "men", image: "img/travel.jpg" },
        
        // Women's products
        { name: "Women's Backpack", price: 30.00, brand: "Gucci", category: "women", image: "img/gallery 2.jpeg" },
        { name: "Handbag", price: 250.30, brand: "Prada", category: "women", image: "img/gallery 1.jpeg" },
        { name: "Hobo Bag", price: 500.00, brand: "Fendi", category: "women", image: "img/Hobo bags 2.webp" },
        { name: "Envelope Bag", price: 280.00, brand: "Louis Vuitton", category: "women", image: "img/Envelope bag 1.webp" },
        { name: "Hobo Bag", price: 100.00, brand: "Chanel", category: "women", image: "img/Hobo bags 1.webp" },
        { name: "Clutch Bag", price: 650.00, brand: "Gucci", category: "women", image: "img/pic15.webp" },
        { name: "Handbag", price: 350.00, brand: "Balenciaga", category: "women", image: "img/pic17.jpg" },
        { name: "Handbag", price: 250.00, brand: "Dior", category: "women", image: "img/pic18.webp" },
        { name: "Duffle Bag", price: 300.00, brand: "YSL", category: "women", image: "img/pic19.webp" },
        { name: "Wallet", price: 250.00, brand: "Fendi", category: "women", image: "img/women wallet.jpg" },
        { name: "Wallet", price: 550.00, brand: "Prada", category: "women", image: "img/wallet hd.jpeg" },
        { name: "Card Holders", price: 700.00, brand: "Louis Vuitton", category: "women", image: "img/card holders.jpeg" }
    ];

    // Function to perform search
    function performSearch(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            return [];
        }
        
        const term = searchTerm.toLowerCase().trim();
        return products.filter(product => 
            product.name.toLowerCase().includes(term) ||
            product.brand.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term)
        );
    }

    // Function to display search results
    function displaySearchResults(results) {
        if (!searchResults) return;
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="alert alert-info">No products found matching your search.</div>';
            searchResults.classList.add('has-results');
            return;
        }
        
        let html = '<div class="search-results"><h6>Search Results:</h6><div class="row">';
        
        results.forEach(product => {
            html += `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h6 class="card-title">${product.name}</h6>
                            <p class="card-text">Brand: ${product.brand}</p>
                            <p class="card-text">Price: $${product.price}</p>
                            <a href="${product.category === 'men' ? 'shoppage_men.html' : 'shop.page.women.html'}" class="btn btn-primary btn-sm">View Product</a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div></div>';
        searchResults.innerHTML = html;
        searchResults.classList.add('has-results');
    }

    // Add event listeners to all search forms
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchInput = form.querySelector('input[type="search"], input[placeholder="Search..."]');
            if (searchInput) {
                const searchTerm = searchInput.value;
                const results = performSearch(searchTerm);
                displaySearchResults(results);
                
                // Close the search offcanvas after showing results
                const offcanvas = document.getElementById('offcanvasTop');
                if (offcanvas) {
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
                    if (bsOffcanvas) {
                        bsOffcanvas.hide();
                    }
                }
            }
        });
    });

    // Add real-time search as user types
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value;
            if (searchTerm.length > 2) {
                const results = performSearch(searchTerm);
                displaySearchResults(results);
            } else if (searchTerm.length === 0) {
                if (searchResults) {
                    searchResults.innerHTML = '';
                    searchResults.classList.remove('has-results');
                }
            }
        });
    });

    // Clear search results when search input is cleared
    searchInputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (this.value === '') {
                if (searchResults) {
                    searchResults.innerHTML = '';
                    searchResults.classList.remove('has-results');
                }
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value === '') {
                if (searchResults) {
                    searchResults.innerHTML = '';
                    searchResults.classList.remove('has-results');
                }
            }
        });
    });
});
