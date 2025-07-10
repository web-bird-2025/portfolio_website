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
