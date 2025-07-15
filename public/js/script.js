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
      isMobile || currentIndex >= totalItems - 2 ? "none" : "flex";
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
      threshold: 0.6,
    }
  );

  videoItems.forEach((item) => observer.observe(item));

  leftBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      scrollToVideo(currentIndex - 1);
    }
  });

  rightBtn.addEventListener("click", () => {
    if (currentIndex < totalItems - 1) {
      scrollToVideo(currentIndex + 1);
    }
  });

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

  slider.scrollLeft = 0;
  scrollToVideo(0);
  updateButtons();
  updateDots();

  window.addEventListener("resize", updateButtons);
}

/*=====================================================
✅ MORE PROJECTS BUTTON FUNCTIONALITY
=======================================================*/

const moreBtn = document.getElementById("moreProjectsBtn");
const bottomSliderWrapper = document.getElementById("bottomSliderWrapper");

moreBtn.addEventListener("click", (e) => {
  e.preventDefault();
  bottomSliderWrapper.classList.remove("hidden");

  // Optionally scroll to that section
  bottomSliderWrapper.scrollIntoView({ behavior: "smooth" });

  // Optional: Hide the button
  moreBtn.style.display = "none";
});

/*=========================================================
✅ PAGE RELOAD & INITIALIZATION
=========================================================*/

window.onload = () => {
  // Disable browser scroll restoration
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  // Clear hash in URL
  if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
  }

  // Scroll to top immediately
  window.scrollTo({ top: 0, behavior: "auto" });
};

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
