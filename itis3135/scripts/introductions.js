// Fetches every classmate's introduction from the class server and builds a searchable, sortable card grid.
const API_URL = "https://intro-form.tommyhost.ing/";
const grid = document.getElementById("intro-grid");
const statusEl = document.getElementById("status");
const searchEl = document.getElementById("search");
const sortEl = document.getElementById("sort");
let people = [];

// Returns the value as trimmed text, or an empty string if it is missing or not text.
function text(value) {
    return typeof value === "string" ? value.trim() : "";
}

// Turn one API record into a simple object we can search, sort, and draw.
function toPerson(username, record) {
    const d = record.introductionData || {};
    const first = text(d.nickname) || text(d.firstName);
    const fullName = [text(d.firstName), text(d.middleName), text(d.lastName)].filter(Boolean).join(" ") || username;
    return {
        name: first && text(d.lastName) ? first + " " + text(d.lastName) : fullName,
        adjective: text(d.adjectives),
        animal: text(d.animal),
        divider: text(d.prettyNameDivider) || "|",
        img: typeof d.img === "string" && d.img.startsWith("data:image/") ? d.img : "",
        caption: text(d.caption),
        quote: text(d.quote),
        quoteAuthor: text(d.quoteAuthor),
        funnyItem: text(d.funnyItem),
        updated: text(record.lastUpdated),
        site: typeof record.baseSiteUrl === "string" && record.baseSiteUrl.startsWith("http") ? record.baseSiteUrl : ""
    };
}

function makeCard(p) {
    const li = document.createElement("li");
    li.className = "intro-card";

    if (p.img) {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = p.img;
        img.alt = "Photo of " + p.name;
        img.loading = "lazy";
        img.addEventListener("error", () => figure.remove());
        figure.append(img);
        if (p.caption) {
            const cap = document.createElement("figcaption");
            cap.textContent = p.caption;
            figure.append(cap);
        }
        li.append(figure);
    }

    const h4 = document.createElement("h4");
    h4.className = "name";
    h4.textContent = p.name;
    li.append(h4);

    const tag = document.createElement("p");
    tag.className = "tag";
    tag.textContent = [p.adjective, p.animal].filter(Boolean).join(" " + p.divider + " ");
    li.append(tag);

    if (p.quote) {
        const bq = document.createElement("blockquote");
        bq.textContent = "“" + p.quote + "”" + (p.quoteAuthor ? " — " + p.quoteAuthor : "");
        li.append(bq);
    }

    if (p.funnyItem) {
        const fun = document.createElement("p");
        fun.className = "fun";
        fun.textContent = p.funnyItem;
        li.append(fun);
    }

    if (p.site) {
        const a = document.createElement("a");
        a.href = p.site;
        a.textContent = "Visit their site";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        const wrap = document.createElement("p");
        wrap.append(a);
        li.append(wrap);
    }
    return li;
}

function render() {
    const q = searchEl.value.trim().toLowerCase();
    const sort = sortEl.value;

    const shown = people
        .filter((p) => [p.name, p.adjective, p.animal, p.quote].join(" ").toLowerCase().includes(q))
        .sort((a, b) => {
            if (sort === "name") return a.name.localeCompare(b.name);
            if (sort === "animal") return a.animal.localeCompare(b.animal) || a.name.localeCompare(b.name);
            return b.updated.localeCompare(a.updated); // ISO timestamps sort correctly as text
        });

    grid.replaceChildren(...shown.map(makeCard));
    statusEl.textContent = shown.length
        ? "Showing " + shown.length + " of " + people.length + " introductions."
        : "No introductions match your search.";
}

async function loadIntroductions() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Server returned " + response.status);
        const all = await response.json();
        people = [];
        Object.keys(all).forEach((username) => {
            try {
                people.push(toPerson(username, all[username] || {}));
            } catch (recordError) {
                // Skip one bad record instead of losing the whole page.
            }
        });
        render();
    } catch (err) {
        // Shown on the page rather than the console so nothing red appears there.
        statusEl.textContent = "Could not load introductions right now (" + err.message + "). Please refresh and try again.";
    }
}

searchEl.addEventListener("input", render);
sortEl.addEventListener("change", render);
loadIntroductions();