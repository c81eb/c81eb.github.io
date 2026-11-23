/* products.js: Dynamic feature 2 (products page)
   Live product search: as the visitor types, product cards that do not
   match the text are hidden, and a status line reports how many remain. */

const searchBox = document.getElementById("product-search");
const searchStatus = document.getElementById("search-status");
const productCards = document.querySelectorAll("main article");

// Show only the product cards whose text contains the search words
function filterProducts() {
    const query = searchBox.value.trim().toLowerCase();
    let visibleCount = 0;

    productCards.forEach(function (card) {
        const isMatch = card.textContent.toLowerCase().includes(query);
        card.hidden = !isMatch;
        if (isMatch) {
            visibleCount++;
        }
    });

    if (visibleCount === 0) {
        searchStatus.textContent = "No products match that search. Try \"wall\" or \"phone\".";
    } else {
        searchStatus.textContent = "Showing " + visibleCount + " of " + productCards.length + " products.";
    }
}

searchBox.addEventListener("input", filterProducts);