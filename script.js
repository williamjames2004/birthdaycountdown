
/* ========================================
   RESPONSIVE BACKGROUND SLIDESHOW
======================================== */

const landscapeImages = [
    "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg",
    "6.jpg", "7.jpg", "8.jpeg", "9.jpg", "10.jpeg",
    "11.jpeg", "12.jpg", "13.jpeg", "14.jpg", "15.jpg",
    "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpeg"
].map(file => `assets/landscape/${file}`);

const portraitImages = [
    "1.jpg", "2.jpg", "3.jpeg", "4.jpeg", "5.jpeg",
    "6.jpeg", "7.jpeg", "8.jpeg", "9.jpeg", "10.jpeg",
    "11.jpeg", "12.jpeg", "13.jpg", "14.jpeg", "15.jpeg",
    "16.jpeg", "17.jpeg", "18.jpeg", "19.jpeg", "20.jpg"
].map(file => `assets/potrait/${file}`);

const slides = document.querySelectorAll(".landscape-slide");

let currentSlide = 0;
let imageOrder = [];
let imageIndex = 0;
let previousImage = "";
let slideshowTimer;

let isPortrait =
    window.matchMedia("(orientation: portrait)").matches;


function getImages() {
    return isPortrait ? portraitImages : landscapeImages;
}


function shuffleImages() {

    imageOrder = [...getImages()];

    for (let i = imageOrder.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [imageOrder[i], imageOrder[j]] =
            [imageOrder[j], imageOrder[i]];

    }

    // Avoid repeating the previous image
    if (imageOrder.length > 1 && imageOrder[0] === previousImage) {

        const j = 1 + Math.floor(
            Math.random() * (imageOrder.length - 1)
        );

        [imageOrder[0], imageOrder[j]] =
            [imageOrder[j], imageOrder[0]];

    }

    imageIndex = 0;
}


function showNextImage() {

    clearTimeout(slideshowTimer);

    if (imageIndex >= imageOrder.length) {
        shuffleImages();
    }

    const image = imageOrder[imageIndex++];
    const nextSlide = 1 - currentSlide;

    const preload = new Image();

    preload.onload = () => {

        // Handle orientation changes during image loading
        if (
            isPortrait !==
            window.matchMedia("(orientation: portrait)").matches
        ) {
            handleOrientationChange();
            return;
        }

        slides[nextSlide].style.backgroundImage =
            `url("${image}")`;

        slides[nextSlide].classList.add("active");
        slides[currentSlide].classList.remove("active");

        currentSlide = nextSlide;
        previousImage = image;

        // Display each image for 10 seconds
        slideshowTimer = setTimeout(showNextImage, 10000);

    };

    preload.onerror = () => {

        console.error("Unable to load image:", image);

        if (imageIndex >= imageOrder.length) {
            shuffleImages();
        }

        showNextImage();

    };

    preload.src = image;
}


function handleOrientationChange() {

    const newIsPortrait =
        window.matchMedia("(orientation: portrait)").matches;

    if (newIsPortrait === isPortrait) return;

    isPortrait = newIsPortrait;

    clearTimeout(slideshowTimer);

    previousImage = "";

    shuffleImages();
    showNextImage();

}


// Detect phone rotation and browser resizing
window.addEventListener("resize", handleOrientationChange);
window.addEventListener("orientationchange", handleOrientationChange);

// Start slideshow
shuffleImages();
showNextImage();


/* ========================================
   TARGET DATE
======================================== */

// November 19, 2026 at 6:29 PM
// Uses the visitor's local timezone.
// Change this to Sri's actual birthday date before deployment.

const targetDate =
    new Date(2026, 10, 20, 0, 0, 0).getTime();


/* ========================================
   ELEMENT REFERENCES
======================================== */

const music = document.getElementById("bgMusic");
const lastTenMusic = document.getElementById("lastTenMusic");

const musicPopup = document.getElementById("musicPopup");
const musicButton = document.getElementById("musicButton");

const birthdayPopup =
    document.getElementById("birthdayPopup");

const birthdayGreeting =
    document.getElementById("birthdayGreeting");

const tagElement =
    birthdayGreeting.querySelector(".tag");

const lastTenElement =
    birthdayGreeting.querySelector(".lastten");

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");


/* ========================================
   GLOBAL STATES
======================================== */

let musicStarted = false;
let birthdayShown = false;
let birthdayReached = false;

let countdownTimer;

let lastTenStarted = false;
let lastTenAttempted = false;

let lastTenDisplayed = null;

let quoteMode = "before";

let beforeQuotes = [];
let birthdayQuotes = [];
let afterQuotes = [];

let previousQuoteIndices = {
    before: -1,
    after: -1
};


/* ========================================
   LOAD QUOTES
======================================== */

async function loadQuotes(file) {

    try {

        const response = await fetch(`quotes/${file}`);

        if (!response.ok) {
            throw new Error(`Unable to load ${file}`);
        }

        const text = await response.text();

        return text
            .split(/\r?\n/)
            .map(quote => quote.trim())
            .filter(quote => quote.length > 0);

    } catch (error) {

        console.error(error);

        return [];

    }
}


async function loadAllQuotes() {

    [
        beforeQuotes,
        birthdayQuotes,
        afterQuotes
    ] = await Promise.all([

        loadQuotes("beforebd.txt"),
        loadQuotes("bd.txt"),
        loadQuotes("afterbd.txt")

    ]);

    // Display a quote according to the current stage
    updateQuote();

}


/* ========================================
   DISPLAY QUOTE WITH ANIMATION
======================================== */

function displayQuote(quote) {

    if (!quote) return;

    tagElement.classList.remove("quote-animate");

    // Restart CSS animation
    void tagElement.offsetWidth;

    tagElement.textContent = quote;

    tagElement.classList.add("quote-animate");

}


/* ========================================
   RANDOM QUOTE SELECTION
======================================== */

function getRandomQuote(quotes, type) {

    if (quotes.length === 0) return "";

    if (quotes.length === 1) {
        return quotes[0];
    }

    let randomIndex;

    do {

        randomIndex = Math.floor(
            Math.random() * quotes.length
        );

    } while (
        randomIndex === previousQuoteIndices[type]
    );

    previousQuoteIndices[type] = randomIndex;

    return quotes[randomIndex];

}


/* ========================================
   BEFORE AND AFTER BIRTHDAY QUOTES
======================================== */

function updateQuote() {

    if (quoteMode === "before") {

        const quote = getRandomQuote(
            beforeQuotes,
            "before"
        );

        if (quote) {
            displayQuote(quote);
        }

    }

    else if (quoteMode === "after") {

        const quote = getRandomQuote(
            afterQuotes,
            "after"
        );

        if (quote) {
            displayQuote(quote);
        }

    }

}


// Change before/after birthday quotes every 5 seconds
setInterval(() => {

    if (
        quoteMode === "before" ||
        quoteMode === "after"
    ) {
        updateQuote();
    }

}, 5000);


/* ========================================
   FINAL 10 SECONDS QUOTES
======================================== */

function updateLastTenQuote(diff) {

    // Remaining seconds: 10, 9, 8 ... 1
    const remainingSeconds = Math.ceil(diff / 1000);

    const quoteIndex = 10 - remainingSeconds;

    // Display birthday quotes sequentially
    if (birthdayQuotes[quoteIndex]) {

        displayQuote(birthdayQuotes[quoteIndex]);

    }

    // Update numerical countdown only when the second changes
    if (lastTenDisplayed !== remainingSeconds) {

        lastTenElement.textContent = remainingSeconds;

        lastTenDisplayed = remainingSeconds;

    }

}


/* ========================================
   MUSIC START
======================================== */

musicButton.addEventListener("click", async () => {

    musicButton.disabled = true;

    musicButton.innerHTML =
        '<span>♫ Opening your little universe...</span>';

    try {

        await music.play();

    } catch (error) {

        console.warn("Music could not start:", error);

        musicButton.innerHTML =
            '<span>♫ Continue to your surprise ♡</span>';

        musicButton.disabled = false;

        return;

    }

    musicStarted = true;

    // Hide music start screen
    musicPopup.classList.add("hidden");

    // Start the correct audio/countdown stage
    updateCountdown();

    // Show birthday popup if birthday has already arrived
    if (Date.now() >= targetDate) {
        showBirthdayPopup();
    }

});


/* ========================================
   LAST 10 SECONDS AUDIO MANAGEMENT
======================================== */

function manageAudio(diff) {

    // Birthday time has arrived
    if (diff <= 0) {

        if (lastTenStarted) {

            lastTenMusic.pause();
            lastTenMusic.currentTime = 0;

            lastTenStarted = false;

        }

        music.volume = 1;

        return;
    }

    // Final 10 seconds
    if (diff <= 10000 && musicStarted) {

        // Reduce main music volume
        music.volume = 0.25;

        // Start special music only once
        if (!lastTenAttempted) {

            const elapsedSeconds =
                (10000 - diff) / 1000;

            lastTenMusic.currentTime = elapsedSeconds;
            lastTenMusic.volume = 1;

            lastTenStarted = true;
            lastTenAttempted = true;

            lastTenMusic.play().catch(error => {

                console.warn(
                    "Last 10 seconds music could not start:",
                    error
                );

                lastTenStarted = false;

            });

        }

    } else {

        // Before final 10 seconds
        music.volume = 1;

    }

}


/* ========================================
   SHOW BIRTHDAY POPUP
======================================== */

function showBirthdayPopup() {

    // Do not show before music starts or show twice
    if (birthdayShown || !musicStarted) return;

    birthdayShown = true;

    birthdayPopup.classList.add("show");

    // Birthday confetti celebration
    if (typeof confetti === "function") {

        confetti({

            particleCount: 150,
            spread: 110,

            origin: {
                y: 0.65
            },

            colors: [
                "#ffb5d5",
                "#d8b4fe",
                "#ffd994",
                "#ffffff",
                "#d88ac7"
            ]

        });

        setTimeout(() => {

            confetti({

                particleCount: 90,
                spread: 130,

                origin: {
                    y: 0.65
                },

                colors: [
                    "#ffb5d5",
                    "#d8b4fe",
                    "#ffd994",
                    "#ffffff"
                ]

            });

        }, 600);

    }

}


/* ========================================
   BIRTHDAY ARRIVES
======================================== */

function celebrateBirthday() {

    if (birthdayReached) return;

    birthdayReached = true;

    quoteMode = "after";

    // Stop last 10 seconds audio
    lastTenMusic.pause();
    lastTenMusic.currentTime = 0;

    lastTenStarted = false;

    // Restore main music volume
    music.volume = 1;

    // Clear numerical countdown
    lastTenElement.textContent = "";

    lastTenDisplayed = null;

    // Remove original greeting messages
    birthdayGreeting
        .querySelectorAll(".greeting")
        .forEach(element => element.remove());

    // Create animated birthday heading
    const heading = document.createElement("h4");

    heading.className = "birthday-heading";
    heading.textContent = "Happy birthday ஸ்ரீ 💗";

    // Insert heading before quote element
    birthdayGreeting.insertBefore(
        heading,
        tagElement
    );

    // Immediately display after-birthday quote
    updateQuote();

    // Show birthday popup when music has started
    showBirthdayPopup();

}


/* ========================================
   UPDATE COUNTDOWN
======================================== */

function updateCountdown() {

    const now = Date.now();
    const diff = targetDate - now;

    // Birthday has arrived
    if (diff <= 0) {

        daysElement.textContent = "00";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";

        manageAudio(diff);

        celebrateBirthday();

        clearInterval(countdownTimer);

        return;

    }

    // Manage audio transition
    manageAudio(diff);

    // Final 10 seconds
    if (diff <= 10000) {

        if (quoteMode !== "birthday") {
            quoteMode = "birthday";
        }

        updateLastTenQuote(diff);

    }

    else {

        // Before birthday
        if (quoteMode !== "before") {

            quoteMode = "before";

            updateQuote();

        }

        lastTenElement.textContent = "";

        lastTenDisplayed = null;

    }

    // Calculate normal countdown
    const days = Math.floor(diff / 86400000);

    const hours = Math.floor(
        (diff % 86400000) / 3600000
    );

    const minutes = Math.floor(
        (diff % 3600000) / 60000
    );

    const seconds = Math.floor(
        (diff % 60000) / 1000
    );

    // Update countdown display
    daysElement.textContent =
        String(days).padStart(2, "0");

    hoursElement.textContent =
        String(hours).padStart(2, "0");

    minutesElement.textContent =
        String(minutes).padStart(2, "0");

    secondsElement.textContent =
        String(seconds).padStart(2, "0");

}


/* ========================================
   START COUNTDOWN AND QUOTES
======================================== */

loadAllQuotes();

updateCountdown();

// Check countdown frequently to keep timing accurate
countdownTimer = setInterval(updateCountdown, 250);


/* ========================================
   CLOSE BIRTHDAY POPUP
======================================== */

// Close when clicking outside popup content
birthdayPopup.addEventListener("click", event => {

    if (event.target === birthdayPopup) {

        birthdayPopup.classList.remove("show");

    }

});


// Close using Escape key
document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        birthdayPopup.classList.remove("show");

    }

});