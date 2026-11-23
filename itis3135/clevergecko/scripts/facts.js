/* facts.js: Dynamic feature 3 (home page)
   Gecko fact of the day. A fact is chosen by day of the year, so it changes
   daily, and a button lets the visitor swap in a different random fact. */

const geckoFacts = [
    "Gecko toes are covered in microscopic hairs called setae, which is why they can cling to walls.",
    "A gecko can peel its foot off a surface by changing the angle of its toe hairs.",
    "Gecko toe pads are self-cleaning, so they keep their grip even after a walk through dust.",
    "Many gecko species have no eyelids and clean their eyes with their tongues.",
    "Geckos can drop their tails to escape a predator and grow a new one later.",
    "Geckos are among the few lizards that make sounds, from chirps to clicks.",
    "There are well over 1,500 species of gecko living on every continent except Antarctica."
];

const factElement = document.getElementById("gecko-fact");
const factButton = document.getElementById("new-fact");
let currentFactIndex = 0;

// Count which day of the year it is (1 to 366)
function getDayOfYear(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((date - startOfYear) / millisecondsPerDay);
}

// Put the fact at the given position in the array onto the page
function showFact(index) {
    currentFactIndex = index;
    factElement.textContent = geckoFacts[index];
}

// Pick a random fact that is different from the one currently showing
function showRandomFact() {
    let newIndex = currentFactIndex;
    while (newIndex === currentFactIndex) {
        newIndex = Math.floor(Math.random() * geckoFacts.length);
    }
    showFact(newIndex);
}

if (factElement && factButton) {
    showFact(getDayOfYear(new Date()) % geckoFacts.length);
    factButton.addEventListener("click", showRandomFact);
}