/* ======================================================
   ✅ THEME TOGGLE FUNCTIONALITY
====================================================== */

const toggleBtn = document.getElementById("theme-toggle");
const icon = toggleBtn.querySelector("i");

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    icon.classList.replace("bx-moon", "bx-sun");
  }
});

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

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    navButtons.forEach((el) => el.classList.remove("active"));
    btn.classList.add("active");
    menuIcon.classList.remove("bx-x");
    navbar.classList.remove("active");
  });
});

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
  menuIcon.classList.remove("bx-x");
  navbar.classList.remove("active");
});

/* ======================================================
   ✅ SCROLL EFFECTS
====================================================== */

ScrollReveal({
  reset: false,
  distance: "60px",
  duration: 2000,
  delay: 200,
});

ScrollReveal().reveal(".top-scroll", { origin: `top` });
ScrollReveal().reveal(".bottom-scroll", { origin: `bottom` });
ScrollReveal().reveal(".left-scroll", { origin: `left` });
ScrollReveal().reveal(".right-scroll", { origin: `right` });

/*=========================================================
✅ SLIDING EFFECT FOR MULTIPLE VIDEO SLIDERS
=========================================================*/

function initializeVideoSlider({ sliderId, dotsId, leftClass, rightClass }) {
  const slider = document.getElementById(sliderId);
  const leftBtn = slider.parentElement.querySelector(leftClass);
  const rightBtn = slider.parentElement.querySelector(rightClass);
  const dotsContainer = document.getElementById(dotsId);
  const videoItems = slider.querySelectorAll(".video-box");

  let currentIndex = 0;
  const totalItems = videoItems.length;
  const maxDots = 5;

  function applyLayoutFixes() {
    const isMobile = window.innerWidth < 780;

    if (isMobile) {
      slider.style.overflowX = totalItems > 2 ? "auto" : "hidden";
      slider.style.scrollSnapType = totalItems > 2 ? "x mandatory" : "none";
      videoItems.forEach((item) => {
        item.style.minWidth = "100%";
        item.style.scrollSnapAlign = "start";
      });
    } else {
      slider.style.overflowX = totalItems > 2 ? "auto" : "hidden";
      videoItems.forEach((item) => {
        item.style.minWidth = "";
        item.style.scrollSnapAlign = "";
      });
    }
  }

  function scrollToVideo(index) {
    const target = videoItems[index];
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
      currentIndex = index;
      updateDots();
      updateButtons();
    }
  }

  function updateButtons() {
    const isMobile = window.innerWidth < 780;
    const isScrollable = slider.scrollWidth > slider.clientWidth;

    if (isMobile || totalItems <= 2 || !isScrollable) {
      leftBtn.style.display = "none";
      rightBtn.style.display = "none";
      return;
    }

    const scrollLeft = Math.round(slider.scrollLeft);
    const maxScrollLeft = Math.round(slider.scrollWidth - slider.clientWidth);

    leftBtn.style.display = scrollLeft <= 5 ? "none" : "flex";
    rightBtn.style.display = scrollLeft >= maxScrollLeft - 5 ? "none" : "flex";
  }

  function updateDots() {
    dotsContainer.innerHTML = "";
    const isMobile = window.innerWidth < 780;

    let start = 0;
    let end = totalItems;

    if (!isMobile && totalItems > maxDots) {
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

  // Detect scroll to update index, buttons, and dots
  slider.addEventListener("scroll", () => {
  const sliderRect = slider.getBoundingClientRect();
  let closestIndex = 0;
  let minDistance = Infinity;

  videoItems.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const distance = Math.abs(rect.left - sliderRect.left);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  });

  // ✅ Detect if scrolled fully to the right
  const scrollLeft = Math.round(slider.scrollLeft);
  const maxScrollLeft = Math.round(slider.scrollWidth - slider.clientWidth);

  if (scrollLeft >= maxScrollLeft - 5) {
    closestIndex = videoItems.length - 1;
  }

  if (closestIndex !== currentIndex) {
    currentIndex = closestIndex;
    updateDots();
  }

  updateButtons(); // Always update arrows
});


  leftBtn.addEventListener("click", () => {
    if (currentIndex > 0) scrollToVideo(currentIndex - 1);
  });

  rightBtn.addEventListener("click", () => {
    if (currentIndex < totalItems - 1) scrollToVideo(currentIndex + 1);
  });

  // Touch swipe for mobile
  let startX = 0;
  slider.addEventListener("touchstart", (e) => {
    if (window.innerWidth < 780) startX = e.touches[0].clientX;
  });

  slider.addEventListener("touchend", (e) => {
    if (window.innerWidth < 780) {
      const deltaX = e.changedTouches[0].clientX - startX;
      if (deltaX > 50 && currentIndex > 0) scrollToVideo(currentIndex - 1);
      else if (deltaX < -50 && currentIndex < totalItems - 1)
        scrollToVideo(currentIndex + 1);
    }
  });

  // Initial render
  applyLayoutFixes();
  scrollToVideo(0);

  window.addEventListener("resize", () => {
    applyLayoutFixes();
    updateButtons();
    updateDots();
  });
}


/*=======================
✅ MORE PROJECTS TOGGLE
=========================*/
const moreBtn = document.getElementById("moreProjectsBtn");
const bottomSliderWrapper = document.getElementById("bottomSliderWrapper");
const imageSliderWrapper = document.getElementById("imageSliderWrapper");
const projectsSection = document.getElementById("projectsSection");
const bottomSliderHeading = bottomSliderWrapper.querySelector(".category");

let isExpanded = false;
let bottomSliderInitialized = false;
let imageSliderInitialized = false;

moreBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (!isExpanded) {
  bottomSliderWrapper.classList.remove("hidden");
  bottomSliderWrapper.offsetHeight; // force reflow
  bottomSliderWrapper.classList.add("show");
  imageSliderWrapper.classList.remove("hidden");
  imageSliderWrapper.offsetHeight; // force reflow
  imageSliderWrapper.classList.add("show");
  moreBtn.textContent = "Show Less";

  if (!bottomSliderInitialized) {
    initializeVideoSlider({
      sliderId: "videoSliderBottom",
      dotsId: "videoDotsBottom",
      leftClass: ".slide-btn.left",
      rightClass: ".slide-btn.right",
    });
    bottomSliderInitialized = true;
  }

  scrollToElement(bottomSliderHeading, 107);
} else {
  bottomSliderWrapper.classList.remove("show");
  bottomSliderWrapper.classList.add("hidden");
  imageSliderWrapper.classList.remove("show");
  imageSliderWrapper.classList.add("hidden");
  moreBtn.textContent = "More Projects";
  scrollToElement(projectsSection.querySelector(".category"), 107);
}


  isExpanded = !isExpanded;
});

function scrollToElement(targetElement, offset = 0) {
  const rect = targetElement.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const top = rect.top + scrollTop - offset;

  window.scrollTo({
    top,
    behavior: "smooth",
  });
}

/*==============================
✅ ON LOAD BEHAVIOR
===============================*/
window.addEventListener("DOMContentLoaded", () => {
  initializeVideoSlider({
    sliderId: "videoSliderTop",
    dotsId: "videoDotsTop",
    leftClass: ".slider-container:first-of-type .slide-btn.left",
    rightClass: ".slider-container:first-of-type .slide-btn.right",
  });

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
  }

  window.scrollTo({ top: 0, behavior: "auto" });
});

/*=========================================================
✅ CONTACT FORM
=========================================================*/

const form = document.getElementById("contactForm");
const messageBox = document.getElementById("formMessage");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  messageBox.style.color = "#007bff";
  messageBox.innerHTML = `<span class=\"loader\"></span> Sending...`;

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

  setTimeout(() => {
    messageBox.innerHTML = "";
  }, 4000);
});
