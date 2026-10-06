// =====================================================
// IRONFIT GYM - FULL SCRIPT
// =====================================================

// =====================================================
// MOBILE MENU
// =====================================================
const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

if (menuBtn && navbar) {
    menuBtn.addEventListener("click", () => {
        navbar.classList.toggle("active");
        const icon = menuBtn.querySelector("i");

        if (icon) {
            const isActive = navbar.classList.contains("active");
            icon.classList.toggle("fa-xmark", isActive);
            icon.classList.toggle("fa-bars", !isActive);
        }
    });

    document.querySelectorAll("#navbar a").forEach(link => {
        link.addEventListener("click", () => {
            navbar.classList.remove("active");
            const icon = menuBtn.querySelector("i");
            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        });
    });
}

// =====================================================
// DARK / LIGHT MODE (FIXED)
// =====================================================
const themeBtn = document.getElementById("themeBtn");

function applyTheme(theme) {
    if (theme === "light") {
        document.body.classList.add("light");
        document.body.classList.remove("dark");
    } else {
        document.body.classList.add("dark");
        document.body.classList.remove("light");
    }
}

function updateThemeIcon() {
    if (!themeBtn) return;
    const icon = themeBtn.querySelector("i");
    if (!icon) return;

    const isLight = document.body.classList.contains("light");

    if (isLight) {
        icon.className = "fa-solid fa-sun";
        themeBtn.title = "Switch to Dark Mode";
        themeBtn.setAttribute("aria-label", "Switch to Dark Mode");
    } else {
        icon.className = "fa-solid fa-moon";
        themeBtn.title = "Switch to Light Mode";
        themeBtn.setAttribute("aria-label", "Switch to Light Mode");
    }
}

// 1. በፊት የተቀመጠ theme ካለ ከ LocalStorage ማንበብ
const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);
updateThemeIcon();

// 2. Button ሲጫን theme መቀየር
if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        const isCurrentlyLight = document.body.classList.contains("light");
        const newTheme = isCurrentlyLight ? "dark" : "light";

        applyTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        updateThemeIcon();
    });
}

// =====================================================
// SEARCH SYSTEM
// =====================================================
const searchBtn = document.getElementById("searchBtn");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");
const closeSearch = document.getElementById("closeSearch");
const searchResults = document.getElementById("searchResults");

const searchData = [
    { title: "Home", icon: "fa-house", target: "home" },
    { title: "About Us", icon: "fa-circle-info", target: "about" },
    { title: "Programs", icon: "fa-dumbbell", target: "programs" },
    { title: "Trainers", icon: "fa-user", target: "trainers" },
    { title: "Pricing", icon: "fa-tag", target: "pricing" },
    { title: "Gallery", icon: "fa-images", target: "gallery" },
    { title: "Blog", icon: "fa-newspaper", target: "blog" },
    { title: "Book a Session", icon: "fa-calendar-check", target: "booking" },
    { title: "Check Booking Status", icon: "fa-magnifying-glass", target: "booking-status" },
    { title: "Contact", icon: "fa-phone", target: "contact" }
];

function openSearch() {
    if (!searchBox) return;
    searchBox.classList.add("active");
    if (searchInput) {
        searchInput.value = "";
        searchInput.focus();
    }
    showSearchResults("");
}

function closeSearchBox() {
    if (!searchBox) return;
    searchBox.classList.remove("active");
    if (searchInput) searchInput.value = "";
    if (searchResults) searchResults.innerHTML = "";
}

function showSearchResults(query) {
    if (!searchResults) return;

    const text = query.trim().toLowerCase();
    const filtered = searchData.filter(item => item.title.toLowerCase().includes(text));

    if (filtered.length === 0) {
        searchResults.innerHTML = `<div class="no-search-results">No results found.</div>`;
        return;
    }

    searchResults.innerHTML = filtered.map(item => `
        <button type="button" class="search-result-item" data-target="${escapeHTML(item.target)}">
            <i class="fa-solid ${escapeHTML(item.icon)}"></i>
            <span>${escapeHTML(item.title)}</span>
        </button>
    `).join("");

    document.querySelectorAll(".search-result-item").forEach(button => {
        button.addEventListener("click", () => {
            const target = button.dataset.target;
            const section = document.getElementById(target);

            closeSearchBox();

            if (section) {
                setTimeout(() => {
                    section.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
            }
        });
    });
}

if (searchBtn) searchBtn.addEventListener("click", openSearch);
if (closeSearch) closeSearch.addEventListener("click", closeSearchBox);
if (searchInput) {
    searchInput.addEventListener("input", () => showSearchResults(searchInput.value));
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeSearchBox();
});

// =====================================================
// BOOKING FORM
// =====================================================
const bookingForm = document.getElementById("bookingForm");
const bookingMessage = document.getElementById("bookingMessage");

if (bookingForm) {
    const dateInput = document.getElementById("date");

    // Helper to get Today's Date String (YYYY-MM-DD)
    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    if (dateInput) {
        dateInput.min = getTodayString();
    }

    bookingForm.addEventListener("submit", async event => {
        event.preventDefault();

        if (bookingMessage) {
            bookingMessage.textContent = "Sending booking...";
            bookingMessage.style.color = "#ff3b30";
        }

        const formData = {
            name: document.getElementById("name")?.value.trim(),
            phone: document.getElementById("phone")?.value.trim(),
            email: document.getElementById("email")?.value.trim(),
            program: document.getElementById("program")?.value,
            date: document.getElementById("date")?.value,
            time: document.getElementById("time")?.value,
            message: document.getElementById("message")?.value.trim()
        };

        try {
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Booking failed.");
            }

            if (bookingMessage) {
                bookingMessage.textContent = "Booking submitted successfully! ✅";
                bookingMessage.style.color = "#22c55e";
            }

            bookingForm.reset();
            if (dateInput) dateInput.min = getTodayString();

        } catch (error) {
            console.error("Booking error:", error);
            if (bookingMessage) {
                bookingMessage.textContent = error.message || "Server connection failed.";
                bookingMessage.style.color = "#ef4444";
            }
        }
    });
}

// =====================================================
// CHECK BOOKING STATUS
// =====================================================
const statusForm = document.getElementById("statusForm");
const statusResult = document.getElementById("statusResult");

if (statusForm) {
    statusForm.addEventListener("submit", async event => {
        event.preventDefault();

        const email = document.getElementById("statusEmail")?.value.trim();
        const phone = document.getElementById("statusPhone")?.value.trim();

        if (!email || !phone) {
            if (statusResult) {
                statusResult.innerHTML = `
                    <div class="status-card">
                        <p>Please enter your email and phone.</p>
                    </div>
                `;
            }
            return;
        }

        if (statusResult) {
            statusResult.innerHTML = `
                <div class="status-card">
                    <p>Checking booking...</p>
                </div>
            `;
        }

        try {
            const response = await fetch(`/api/bookings/status?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Booking not found.");
            }

            if (statusResult) {
                statusResult.innerHTML = `
                    <div class="status-card">
                        <p><strong>Name:</strong> ${escapeHTML(data.name)}</p>
                        <p><strong>Program:</strong> ${escapeHTML(data.program)}</p>
                        <p><strong>Date:</strong> ${escapeHTML(data.date)}</p>
                        <p><strong>Time:</strong> ${escapeHTML(data.time)}</p>
                        <span class="status-badge">
                            ${escapeHTML(data.status || "Pending")}
                        </span>
                    </div>
                `;
            }

        } catch (error) {
            console.error("Status error:", error);
            if (statusResult) {
                statusResult.innerHTML = `
                    <div class="status-card">
                        <p>${escapeHTML(error.message || "Booking not found.")}</p>
                    </div>
                `;
            }
        }
    });
}

// =====================================================
// HELPER: ESCAPE HTML
// =====================================================
function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// =====================================================
// BACK TO TOP BUTTON
// =====================================================
const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {
    if (!topBtn) return;
    if (window.scrollY > 500) {
        topBtn.classList.add("show");
    } else {
        topBtn.classList.remove("show");
    }
});

if (topBtn) {
    topBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// =====================================================
// IMAGE LOAD EFFECT
// =====================================================
document.querySelectorAll("img").forEach(img => {
    if (img.complete) {
        img.style.opacity = "1";
    } else {
        img.addEventListener("load", () => {
            img.style.opacity = "1";
        });
    }
});

// =====================================================
// LOG LOAD STATUS
// =====================================================
console.log("IRONFIT GYM website JavaScript loaded successfully! ✅");