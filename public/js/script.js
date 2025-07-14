/* ======================================================
   ✅ THEME TOGGLE FUNCTIONALITY
====================================================== */

const toggleBtn = document.getElementById("theme-toggle");
const icon = toggleBtn.querySelector("i");

// Load saved theme on initial load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    icon.classList.replace("bx-moon", "bx-sun");
  }
});

// Toggle dark/light theme
toggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  icon.classList.replace(
    isDark ? "bx-moon" : "bx-sun",
    isDark ? "bx-sun" : "bx-moon"
  );
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

/* ======================================================
   ✅ RESPONSIVE NAV TOGGLE
====================================================== */

const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".my-nav");

// Toggle nav visibility on mobile
menuIcon.onclick = () => {
  menuIcon.classList.toggle("bx-x");
  navbar.classList.toggle("active");
};

/* ======================================================
   ✅ NAVIGATION LINK HIGHLIGHTING
====================================================== */

const navButtons = document.querySelectorAll(".my-nav a");
const gapElements = document.querySelectorAll(".gap");
const viewportHeight = window.innerHeight;

// ➤ Click: Set active nav link
navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    navButtons.forEach((el) => el.classList.remove("active"));
    btn.classList.add("active");

    // Close nav (mobile)
    menuIcon.classList.remove("bx-x");
    navbar.classList.remove("active");
  });
});

// ➤ Scroll: Highlight nav based on visible section
window.addEventListener("scroll", () => {
  gapElements.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const topGap = rect.top;

    if (topGap < viewportHeight / 1.5) {
      navButtons.forEach((el) => el.classList.remove("active"));
      if (navButtons[index]) {
        navButtons[index].classList.add("active");
      }
    }
  });

  // Auto-close nav on scroll (mobile)
  menuIcon.classList.remove("bx-x");
  navbar.classList.remove("active");
});

/* ======================================================
   ✅ SCROLL EFFECTS
====================================================== */

ScrollReveal({
  reset: true,
  distance: "60px",
  duration: 2000,
  delay: 200,
});

ScrollReveal().reveal(".top-scroll", { origin: `top` });
ScrollReveal().reveal(".bottom-scroll", { origin: `bottom` });
ScrollReveal().reveal(".left-scroll", { origin: `left` });
ScrollReveal().reveal(".right-scroll", { origin: `right` });

/*=========================================================
✅ SLIDING EFFECT IN PROJECTS
=========================================================*/

const slider = document.getElementById("videoSlider");
const leftBtn = document.querySelector(".slide-btn.left");
const rightBtn = document.querySelector(".slide-btn.right");
const dotsContainer = document.getElementById("videoDots");
const videoItems = document.querySelectorAll(".video-box");

let currentIndex = 0;
const totalItems = videoItems.length;
const maxDots = 5;

function scrollToVideo(index) {
  const target = videoItems[index];
  if (target) {
    target.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });

    currentIndex = index;
    updateDots();
    updateButtons();
  }
}

function updateButtons() {
  const isMobile = window.innerWidth < 780;
  leftBtn.style.display = isMobile || currentIndex === 0 ? "none" : "flex";
  rightBtn.style.display =
    isMobile || currentIndex === totalItems - 1 ? "none" : "flex";
}

function updateDots() {
  dotsContainer.innerHTML = "";

  let start = 0,
    end = totalItems;

  if (totalItems > maxDots) {
    if (currentIndex <= 2) {
      start = 0;
      end = maxDots;
    } else if (currentIndex >= totalItems - 3) {
      start = totalItems - maxDots;
      end = totalItems;
    } else {
      start = currentIndex - 2;
      end = currentIndex + 3;
    }
  }

  for (let i = start; i < end; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === currentIndex) dot.classList.add("active");
    dot.addEventListener("click", () => scrollToVideo(i));
    dotsContainer.appendChild(dot);
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = Array.from(videoItems).indexOf(entry.target);
        if (index !== currentIndex) {
          currentIndex = index;
          updateDots();
          updateButtons();
        }
      }
    });
  },
  {
    root: slider,
    threshold: 0.6, // Adjust sensitivity (0.6 = 60% in view)
  }
);

// Observe each video item
videoItems.forEach((item) => observer.observe(item));

leftBtn.addEventListener("click", () => {
  if (window.innerWidth >= 500 && currentIndex > 0) {
    scrollToVideo(currentIndex - 1);
  }
});

rightBtn.addEventListener("click", () => {
  if (window.innerWidth >= 500 && currentIndex < totalItems - 1) {
    scrollToVideo(currentIndex + 1);
  }
});

// Swipe support
let startX = 0;
slider.addEventListener("touchstart", (e) => {
  if (window.innerWidth < 500) {
    startX = e.touches[0].clientX;
  }
});

slider.addEventListener("touchend", (e) => {
  if (window.innerWidth < 500) {
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;

    if (deltaX > 50 && currentIndex > 0) {
      scrollToVideo(currentIndex - 1);
    } else if (deltaX < -50 && currentIndex < totalItems - 1) {
      scrollToVideo(currentIndex + 1);
    }
  }
});

/*=========================================================
✅ PAGE RELOAD
=========================================================*/

// Initial
window.addEventListener("DOMContentLoaded", () => {
  scrollToVideo(0);
  updateButtons();
  updateDots();
  window.scrollTo({ top: 0, behavior: "auto" });
});

window.addEventListener("resize", updateButtons);

/*=========================================================
✅ CONTACT FORM
=========================================================*/

const form = document.getElementById("contactForm");
const messageBox = document.getElementById("formMessage");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  messageBox.style.color = "#007bff"; // Blue during loading
  messageBox.innerHTML = `<span class="loader"></span> Sending...`;

  const formData = new FormData(form);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      messageBox.style.color = "green";
      messageBox.innerHTML = "✅ Message sent successfully!";
      form.reset();
    } else {
      messageBox.style.color = "red";
      messageBox.innerHTML = "❌ Something went wrong. Please try again.";
    }
  } catch (error) {
    messageBox.style.color = "red";
    messageBox.innerHTML = "❌ Failed to send message. Network error.";
  }

  // Auto-hide after 4 seconds
  setTimeout(() => {
    messageBox.innerHTML = "";
  }, 4000);
});
