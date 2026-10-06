```javascript
// =====================================================
// IRONFIT GYM - FINAL FULL SCRIPT
// =====================================================

// =====================================================
// API CONFIGURATION
// =====================================================
const API_BASE = "https://ironfit-gym.onrender.com";

// =====================================================
// HELPER - ESCAPE HTML
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
// MOBILE MENU
// =====================================================
const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

function closeMobileMenu() {
    if (!navbar) return;

    navbar.classList.remove("active");

    if (menuBtn) {
        const icon = menuBtn.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    }
}

if (menuBtn && navbar) {

    menuBtn.addEventListener("click", () => {

        navbar.classList.toggle("active");

        const icon = menuBtn.querySelector("i");

        if (icon) {

            const active =
                navbar.classList.contains("active");

            icon.classList.toggle(
                "fa-xmark",
                active
            );

            icon.classList.toggle(
                "fa-bars",
                !active
            );
        }
    });

    document
        .querySelectorAll("#navbar a")
        .forEach(link => {

            link.addEventListener(
                "click",
                closeMobileMenu
            );

        });
}

// =====================================================
// DARK / LIGHT MODE
// =====================================================
const themeBtn =
    document.getElementById("themeBtn");

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

    const icon =
        themeBtn.querySelector("i");

    if (!icon) return;

    const isLight =
        document.body.classList.contains("light");

    if (isLight) {

        icon.className =
            "fa-solid fa-sun";

        themeBtn.title =
            "Switch to Dark Mode";

        themeBtn.setAttribute(
            "aria-label",
            "Switch to Dark Mode"
        );

    } else {

        icon.className =
            "fa-solid fa-moon";

        themeBtn.title =
            "Switch to Light Mode";

        themeBtn.setAttribute(
            "aria-label",
            "Switch to Light Mode"
        );
    }
}

let savedTheme = "dark";

try {
    savedTheme =
        localStorage.getItem("theme") || "dark";
} catch (error) {
    console.warn(
        "LocalStorage unavailable."
    );
}

applyTheme(savedTheme);
updateThemeIcon();

if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        () => {

            const isLight =
                document.body.classList.contains(
                    "light"
                );

            const newTheme =
                isLight ? "dark" : "light";

            applyTheme(newTheme);

            try {
                localStorage.setItem(
                    "theme",
                    newTheme
                );
            } catch (error) {
                console.warn(
                    "Could not save theme."
                );
            }

            updateThemeIcon();
        }
    );
}

// =====================================================
// SEARCH SYSTEM
// =====================================================
const searchBtn =
    document.getElementById("searchBtn");

const searchBox =
    document.getElementById("searchBox");

const searchInput =
    document.getElementById("searchInput");

const closeSearch =
    document.getElementById("closeSearch");

const searchResults =
    document.getElementById("searchResults");

const searchData = [

    {
        title: "Home",
        icon: "fa-house",
        target: "home"
    },

    {
        title: "About Us",
        icon: "fa-circle-info",
        target: "about"
    },

    {
        title: "Programs",
        icon: "fa-dumbbell",
        target: "programs"
    },

    {
        title: "Trainers",
        icon: "fa-user",
        target: "trainers"
    },

    {
        title: "Pricing",
        icon: "fa-tag",
        target: "pricing"
    },

    {
        title: "Gallery",
        icon: "fa-images",
        target: "gallery"
    },

    {
        title: "Blog",
        icon: "fa-newspaper",
        target: "blog"
    },

    {
        title: "Book a Session",
        icon: "fa-calendar-check",
        target: "booking"
    },

    {
        title: "Check Booking Status",
        icon: "fa-magnifying-glass",
        target: "booking-status"
    },

    {
        title: "Contact",
        icon: "fa-phone",
        target: "contact"
    }

];

function openSearch() {

    if (!searchBox) return;

    searchBox.classList.add("active");

    if (searchInput) {

        searchInput.value = "";

        setTimeout(() => {
            searchInput.focus();
        }, 100);
    }

    showSearchResults("");
}

function closeSearchBox() {

    if (!searchBox) return;

    searchBox.classList.remove("active");

    if (searchInput) {
        searchInput.value = "";
    }

    if (searchResults) {
        searchResults.innerHTML = "";
    }
}

function showSearchResults(query) {

    if (!searchResults) return;

    const text =
        String(query || "")
            .trim()
            .toLowerCase();

    const filtered =
        searchData.filter(item =>
            item.title
                .toLowerCase()
                .includes(text)
        );

    if (filtered.length === 0) {

        searchResults.innerHTML = `
            <div class="no-search-results">
                <i class="fa-solid fa-face-frown"></i>
                <span>No results found.</span>
            </div>
        `;

        return;
    }

    searchResults.innerHTML =
        filtered
            .map(item => `

                <button
                    type="button"
                    class="search-result-item"
                    data-target="${escapeHTML(item.target)}"
                >

                    <i class="fa-solid ${escapeHTML(item.icon)}"></i>

                    <span>
                        ${escapeHTML(item.title)}
                    </span>

                </button>

            `)
            .join("");

    document
        .querySelectorAll(".search-result-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const target =
                        button.dataset.target;

                    closeSearchBox();

                    const section =
                        document.getElementById(target);

                    if (section) {

                        setTimeout(() => {

                            section.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                        }, 150);

                    }
                }
            );

        });
}

if (searchBtn) {
    searchBtn.addEventListener(
        "click",
        openSearch
    );
}

if (closeSearch) {
    closeSearch.addEventListener(
        "click",
        closeSearchBox
    );
}

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            showSearchResults(
                searchInput.value
            );

        }
    );
}

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            closeSearchBox();
        }

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            openSearch();
        }

    }
);

// =====================================================
// BOOKING FORM
// =====================================================
const bookingForm =
    document.getElementById("bookingForm");

const bookingMessage =
    document.getElementById("bookingMessage");

const dateInput =
    document.getElementById("date");

function getTodayString() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

if (dateInput) {
    dateInput.min =
        getTodayString();
}

function showBookingMessage(
    message,
    type = "error"
) {

    if (!bookingMessage) return;

    bookingMessage.textContent =
        message;

    if (type === "success") {

        bookingMessage.style.color =
            "#22c55e";

    } else if (type === "loading") {

        bookingMessage.style.color =
            "#ff3b30";

    } else {

        bookingMessage.style.color =
            "#ef4444";
    }
}

if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const name =
                document
                    .getElementById("name")
                    ?.value
                    .trim();

            const phone =
                document
                    .getElementById("phone")
                    ?.value
                    .trim();

            const email =
                document
                    .getElementById("email")
                    ?.value
                    .trim();

            const program =
                document
                    .getElementById("program")
                    ?.value;

            const date =
                document
                    .getElementById("date")
                    ?.value;

            const time =
                document
                    .getElementById("time")
                    ?.value;

            const message =
                document
                    .getElementById("message")
                    ?.value
                    .trim();

            // -----------------------------------------
            // FRONTEND VALIDATION
            // -----------------------------------------

            if (
                !name ||
                !phone ||
                !email ||
                !program ||
                !date ||
                !time
            ) {

                showBookingMessage(
                    "Please complete all required fields."
                );

                return;
            }

            if (date < getTodayString()) {

                showBookingMessage(
                    "Please select today or a future date."
                );

                return;
            }

            // -----------------------------------------
            // SEND BOOKING
            // -----------------------------------------

            showBookingMessage(
                "Sending booking...",
                "loading"
            );

            try {

                const response =
                    await fetch(
                        `${API_BASE}/api/bookings`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    name,
                                    phone,
                                    email,
                                    program,
                                    date,
                                    time,
                                    message
                                })
                        }
                    );

                let data = {};

                try {

                    data =
                        await response.json();

                } catch (jsonError) {

                    data = {};
                }

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Booking failed. Please try again."
                    );
                }

                showBookingMessage(
                    "Booking submitted successfully! ✅",
                    "success"
                );

                bookingForm.reset();

                if (dateInput) {
                    dateInput.min =
                        getTodayString();
                }

            } catch (error) {

                console.error(
                    "Booking error:",
                    error
                );

                showBookingMessage(
                    error.message ||
                    "Unable to connect to the server."
                );
            }
        }
    );
}

// =====================================================
// CHECK BOOKING STATUS
// =====================================================
const statusForm =
    document.getElementById("statusForm");

const statusResult =
    document.getElementById("statusResult");

if (statusForm) {

    statusForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const email =
                document
                    .getElementById("statusEmail")
                    ?.value
                    .trim();

            const phone =
                document
                    .getElementById("statusPhone")
                    ?.value
                    .trim();

            if (!email || !phone) {

                if (statusResult) {

                    statusResult.innerHTML = `
                        <div class="status-card">
                            <p>
                                Please enter your email and phone.
                            </p>
                        </div>
                    `;
                }

                return;
            }

            if (statusResult) {

                statusResult.innerHTML = `
                    <div class="status-card">
                        <p>
                            <i class="fa-solid fa-spinner fa-spin"></i>
                            Checking booking...
                        </p>
                    </div>
                `;
            }

            try {

                const url =
                    `${API_BASE}/api/bookings/status?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;

                const response =
                    await fetch(url);

                let data = {};

                try {

                    data =
                        await response.json();

                } catch (jsonError) {

                    data = {};
                }

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Booking not found."
                    );
                }

                if (statusResult) {

                    const status =
                        data.status ||
                        "Pending";

                    statusResult.innerHTML = `

                        <div class="status-card">

                            <h3>
                                <i class="fa-solid fa-calendar-check"></i>
                                Booking Details
                            </h3>

                            <p>
                                <strong>Name:</strong>
                                ${escapeHTML(data.name)}
                            </p>

                            <p>
                                <strong>Program:</strong>
                                ${escapeHTML(data.program)}
                            </p>

                            <p>
                                <strong>Date:</strong>
                                ${escapeHTML(data.date)}
                            </p>

                            <p>
                                <strong>Time:</strong>
                                ${escapeHTML(data.time)}
                            </p>

                            <span class="status-badge status-${escapeHTML(
                                status.toLowerCase()
                            )}">
                                ${escapeHTML(status)}
                            </span>

                        </div>

                    `;
                }

            } catch (error) {

                console.error(
                    "Status error:",
                    error
                );

                if (statusResult) {

                    statusResult.innerHTML = `

                        <div class="status-card">

                            <p>
                                <i class="fa-solid fa-circle-exclamation"></i>
                                ${escapeHTML(
                                    error.message ||
                                    "Booking not found."
                                )}
                            </p>

                        </div>

                    `;
                }
            }
        }
    );
}

// =====================================================
// BACK TO TOP BUTTON
// =====================================================
const topBtn =
    document.getElementById("topBtn");

function updateTopButton() {

    if (!topBtn) return;

    if (window.scrollY > 500) {

        topBtn.classList.add("show");

    } else {

        topBtn.classList.remove("show");
    }
}

window.addEventListener(
    "scroll",
    updateTopButton
);

updateTopButton();

if (topBtn) {

    topBtn.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );
}

// =====================================================
// IMAGE LOAD EFFECT
// =====================================================
document
    .querySelectorAll("img")
    .forEach(img => {

        if (img.complete) {

            img.style.opacity = "1";

        } else {

            img.addEventListener(
                "load",
                () => {
                    img.style.opacity = "1";
                }
            );

            img.addEventListener(
                "error",
                () => {
                    img.style.opacity = "1";
                    console.warn(
                        "Image failed to load:",
                        img.src
                    );
                }
            );
        }
    });

// =====================================================
// CLOSE SEARCH WHEN CLICKING OUTSIDE
// =====================================================
if (searchBox) {

    searchBox.addEventListener(
        "click",
        event => {

            if (
                event.target === searchBox
            ) {
                closeSearchBox();
            }

        }
    );
}

// =====================================================
// PAGE LOAD
// =====================================================
document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "IRONFIT GYM website loaded successfully! 💪"
        );

        console.log(
            "API:",
            API_BASE
        );

    }
);
```
