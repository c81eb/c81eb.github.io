/* hours.js: Dynamic feature 1 (hours page)
   Reads the hours table, highlights today's row, and tells the visitor
   whether the kiosk is open right now.
   The table is the single source of truth: each <tr> in the table body stores
   its days (0 = Sunday ... 6 = Saturday) and its open/close hours (24-hour
   time) in data-days, data-open and data-close attributes.
   Note: this uses the visitor's own clock, not the kiosk's time zone. */

const statusElement = document.getElementById("open-status");
const hoursRows = document.querySelectorAll("tbody tr");

// Find the table row whose data-days list includes today's day number
function findTodaysRow(dayNumber) {
    for (const row of hoursRows) {
        const rowDays = row.dataset.days.split(" ").map(Number);
        if (rowDays.includes(dayNumber)) {
            return row;
        }
    }
    return null;
}

// Turn a 24-hour number (e.g. 20) into friendly text (e.g. "8 PM")
function formatHour(hour) {
    const suffix = hour >= 12 ? "PM" : "AM";
    const twelveHour = hour % 12 === 0 ? 12 : hour % 12;
    return twelveHour + " " + suffix;
}

// Highlight today's row and write the open/closed message
function updateOpenStatus() {
    const now = new Date();
    const todaysRow = findTodaysRow(now.getDay());

    if (!todaysRow || !statusElement) {
        return;
    }

    todaysRow.classList.add("today");

    const openHour = Number(todaysRow.dataset.open);
    const closeHour = Number(todaysRow.dataset.close);
    const currentHour = now.getHours() + now.getMinutes() / 60;

    if (currentHour >= openHour && currentHour < closeHour) {
        statusElement.textContent =
            "We're open right now until " + formatHour(closeHour) + ". Come stick around!";
    } else if (currentHour < openHour) {
        statusElement.textContent =
            "We're closed right now, but we open today at " + formatHour(openHour) + ".";
    } else {
        statusElement.textContent =
            "We're closed for today. See you tomorrow!";
    }
}

updateOpenStatus();