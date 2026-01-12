// Navigation scroll effect
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// Mobile navigation toggle
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Close mobile nav when clicking a link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// Reveal on scroll animation
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  const windowHeight = window.innerHeight;

  reveals.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const revealPoint = 100;

    if (elementTop < windowHeight - revealPoint) {
      element.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll(); // Initial check

// Lazy load images with Intersection Observer
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll("img.lazy");

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.addEventListener("load", () => {
            img.classList.add("loaded");
          });
          img.classList.remove("lazy");
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: "50px 0px",
    }
  );

  lazyImages.forEach((img) => imageObserver.observe(img));
}

lazyLoadImages();

// Lightbox Gallery
const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxClose = lightbox.querySelector(".lightbox-close");
const lightboxPrev = lightbox.querySelector(".lightbox-prev");
const lightboxNext = lightbox.querySelector(".lightbox-next");
const lightboxCurrent = lightbox.querySelector(".lightbox-current");
const lightboxTotal = lightbox.querySelector(".lightbox-total");
const screenshotItems = document.querySelectorAll(".screenshot-item");

let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

// Get image sources
function getImageSources() {
  return Array.from(screenshotItems).map((item) => {
    const img = item.querySelector("img");
    return img.src || img.dataset.src;
  });
}

// Open lightbox
function openLightbox(index) {
  currentIndex = index;
  const sources = getImageSources();
  lightboxImage.src = sources[currentIndex];
  lightboxImage.alt = screenshotItems[currentIndex].querySelector("img").alt;
  lightboxCurrent.textContent = currentIndex + 1;
  lightboxTotal.textContent = sources.length;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close lightbox
function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

// Navigate to previous image
function prevImage() {
  const sources = getImageSources();
  currentIndex = (currentIndex - 1 + sources.length) % sources.length;
  lightboxImage.src = sources[currentIndex];
  lightboxImage.alt = screenshotItems[currentIndex].querySelector("img").alt;
  lightboxCurrent.textContent = currentIndex + 1;
}

// Navigate to next image
function nextImage() {
  const sources = getImageSources();
  currentIndex = (currentIndex + 1) % sources.length;
  lightboxImage.src = sources[currentIndex];
  lightboxImage.alt = screenshotItems[currentIndex].querySelector("img").alt;
  lightboxCurrent.textContent = currentIndex + 1;
}

// Click handlers
screenshotItems.forEach((item) => {
  item.addEventListener("click", () => {
    const index = parseInt(item.dataset.index);
    openLightbox(index);
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", prevImage);
lightboxNext.addEventListener("click", nextImage);

// Close on background click
lightbox.addEventListener("click", (e) => {
  if (
    e.target === lightbox ||
    e.target === lightbox.querySelector(".lightbox-content")
  ) {
    closeLightbox();
  }
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") prevImage();
  if (e.key === "ArrowRight") nextImage();
});

// Touch swipe support for mobile
lightbox.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true }
);

lightbox.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  },
  { passive: true }
);

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextImage(); // Swipe left = next
    } else {
      prevImage(); // Swipe right = prev
    }
  }
}

