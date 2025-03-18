function searchProducts() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let products = document.querySelectorAll(".product-item");
    let found = false;

    products.forEach(product => {
        let name = product.dataset.name.toLowerCase();
        if (name.includes(input)) {
            product.style.display = "block";
            found = true;
        } else {
            product.style.display = "none";
        }
    });

    if (!found && input !== "") {
        alert("No matching products found.");
    }
}