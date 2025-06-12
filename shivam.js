// Enhanced AOS initialization with mobile optimization
AOS.init({
  duration: window.innerWidth < 768 ? 600 : 1000, // Faster on mobile
  once: true,
  offset: window.innerWidth < 768 ? 50 : 100, // Smaller offset on mobile
  easing: 'ease-out-cubic',
  disable: window.innerWidth < 480 ? true : false, // Disable on very small screens
});

// Re-initialize AOS on window resize for responsive behavior
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    AOS.refreshHard(); // Refresh AOS calculations
  }, 150);
});

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const sunIcon = document.querySelector(".theme-icon-sun");
const moonIcon = document.querySelector(".theme-icon-moon");

// Check if theme elements exist before adding event listeners
if (themeToggle && sunIcon && moonIcon) {
  themeToggle.addEventListener("click", () => {
    if (body.getAttribute("data-theme") === "light") {
      body.removeAttribute("data-theme");
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
      // Store theme preference in memory instead of localStorage
      window.themePreference = "dark";
    } else {
      body.setAttribute("data-theme", "light");
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
      // Store theme preference in memory instead of localStorage
      window.themePreference = "light";
    }
  });

  // Load saved theme from memory
  if (window.themePreference === "light") {
    body.setAttribute("data-theme", "light");
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
  }
}

// Mobile Menu - Enhanced responsive functionality
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const closeMenu = document.getElementById("close-menu");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

// Improved mobile menu handling
function toggleMobileMenu(show) {
  if (!mobileMenu) return;
  
  if (show) {
    mobileMenu.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scroll
  } else {
    mobileMenu.classList.remove("active");
    document.body.style.overflow = ""; // Restore scroll
  }
}

// Menu button click handler
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isActive = mobileMenu.classList.contains("active");
    toggleMobileMenu(!isActive);
  });
}

// Close button click handler
if (closeMenu && mobileMenu) {
  closeMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMobileMenu(false);
  });
}

// Close mobile menu when clicking on navigation links
if (mobileNavLinks.length > 0 && mobileMenu) {
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      toggleMobileMenu(false);
    });
  });
}

// Close mobile menu when clicking outside of it
document.addEventListener("click", (e) => {
  if (mobileMenu && mobileMenu.classList.contains("active")) {
    if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      toggleMobileMenu(false);
    }
  }
});

// Close mobile menu on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenu && mobileMenu.classList.contains("active")) {
    toggleMobileMenu(false);
  }
});

// Handle window resize - close mobile menu if window becomes large
window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024 && mobileMenu && mobileMenu.classList.contains("active")) {
    toggleMobileMenu(false);
  }
});

// Enhanced typing animation with responsive text sizing
const texts = [
  "Founder & CEO of ThunderGit",
  "Full-Stack Developer", 
  "Tech Entrepreneur",
  "Product Visionary",
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById("typing-text");

function typeText() {
  if (!typingElement) return;
  
  const currentText = texts[textIndex];
  
  if (isDeleting) {
    typingElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingElement.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
  }

  // Responsive typing speed - slower on mobile for better readability
  const isMobile = window.innerWidth < 768;
  let typeSpeed = isDeleting ? (isMobile ? 75 : 50) : (isMobile ? 150 : 100);

  if (!isDeleting && charIndex === currentText.length) {
    typeSpeed = isMobile ? 2500 : 2000; // Longer pause on mobile
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
    typeSpeed = isMobile ? 750 : 500;
  }

  setTimeout(typeText, typeSpeed);
}

// Start typing animation with device-specific delay
if (typingElement) {
  const isMobile = window.innerWidth < 768;
  setTimeout(typeText, isMobile ? 1500 : 1000);
}

// 3D Hero Background with responsive handling
const canvas = document.getElementById("hero-canvas");
let scene, camera, renderer, particles;

function initThreeJS() {
  if (!canvas || typeof THREE === 'undefined') return;
  
  scene = new THREE.Scene();
  
  // Get canvas container dimensions for responsive sizing
  const container = canvas.parentElement;
  const containerWidth = container ? container.offsetWidth : window.innerWidth;
  const containerHeight = container ? container.offsetHeight : window.innerHeight;
  
  camera = new THREE.PerspectiveCamera(
    75,
    containerWidth / containerHeight,
    0.1,
    1000
  );
  
  renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true,
    antialias: window.devicePixelRatio < 2 
  });

  renderer.setSize(containerWidth, containerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create particles with responsive count
  const particlesGeometry = new THREE.BufferGeometry();
  const isMobile = window.innerWidth < 768;
  const particlesCount = isMobile ? 500 : 1000; // Reduce particles on mobile
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );

  const particlesMaterial = new THREE.PointsMaterial({
    size: isMobile ? 0.008 : 0.005, // Larger particles on mobile
    color: 0x888888,
    transparent: true,
    opacity: 0.5,
  });

  particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  camera.position.z = 3;
}

// Animation loop
function animate() {
  if (!renderer || !scene || !camera) return;
  
  requestAnimationFrame(animate);
  
  if (particles) {
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.001;
  }
  
  renderer.render(scene, camera);
}

// Responsive resize handler
function handleResize() {
  if (!camera || !renderer || !canvas) return;
  
  const container = canvas.parentElement;
  const containerWidth = container ? container.offsetWidth : window.innerWidth;
  const containerHeight = container ? container.offsetHeight : window.innerHeight;
  
  // Update camera
  camera.aspect = containerWidth / containerHeight;
  camera.updateProjectionMatrix();
  
  // Update renderer
  renderer.setSize(containerWidth, containerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// Initialize and start animation
if (canvas) {
  initThreeJS();
  animate();
  
  // Handle resize with debouncing
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 100);
  });
  
  // Handle orientation change on mobile
  window.addEventListener("orientationchange", () => {
    setTimeout(handleResize, 500);
  });
}

// Progress Bars Animation
const progressBars = document.querySelectorAll(".progress-fill");
if (progressBars.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const width = progressBar.getAttribute("data-width");
        if (width) {
          progressBar.style.width = width;
          progressBar.classList.add("animate");
        }
      }
    });
  });

  progressBars.forEach((bar) => observer.observe(bar));
}

// Enhanced smooth scrolling with mobile optimization
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);
    
    if (target) {
      // Close mobile menu if open
      if (mobileMenu && mobileMenu.classList.contains("active")) {
        toggleMobileMenu(false);
      }
      
      // Calculate offset for fixed headers
      const headerHeight = document.querySelector("header")?.offsetHeight || 0;
      const targetPosition = target.offsetTop - headerHeight - 20; // Extra 20px padding
      
      // Smooth scroll with mobile optimization
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
      
      // Fallback for older browsers
      if (!window.CSS || !CSS.supports("scroll-behavior", "smooth")) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
});

// Responsive touch handling for mobile devices
if ('ontouchstart' in window) {
  // Add touch-specific optimizations
  let touchStartX = 0;
  let touchStartY = 0;
  
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Close mobile menu on right swipe (if menu is open)
    if (mobileMenu && mobileMenu.classList.contains("active")) {
      if (deltaX > 50 && Math.abs(deltaY) < 100) {
        toggleMobileMenu(false);
      }
    }
  }, { passive: true });
}

// Chat Widget
const chatToggle = document.getElementById("chat-toggle");
const chatPopup = document.getElementById("chat-popup");
const chatClose = document.getElementById("chat-close");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatMessages = document.getElementById("chat-messages");

if (chatToggle && chatPopup) {
  chatToggle.addEventListener("click", () => {
    chatPopup.classList.toggle("hidden");
  });
}

if (chatClose && chatPopup) {
  chatClose.addEventListener("click", () => {
    chatPopup.classList.add("hidden");
  });
}

function addMessage(message, isUser = false) {
  if (!chatMessages) return;
  
  const messageDiv = document.createElement("div");
  messageDiv.className = `mb-4 ${isUser ? "text-right" : ""}`;

  const messageBubble = document.createElement("div");
  messageBubble.className = `p-3 rounded-lg max-w-xs inline-block ${
    isUser ? "bg-blue-500 text-white" : ""
  }`;
  messageBubble.style.backgroundColor = isUser
    ? "#3b82f6"
    : "var(--bg-tertiary)";
  messageBubble.innerHTML = `<p class="text-sm">${message}</p>`;

  messageDiv.appendChild(messageBubble);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

if (chatSend && chatInput) {
  chatSend.addEventListener("click", () => {
    const message = chatInput.value.trim();
    if (message) {
      addMessage(message, true);
      chatInput.value = "";

      // Simulate response
      setTimeout(() => {
        addMessage("Thanks for your message! I'll get back to you soon.");
      }, 1000);
    }
  });

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      chatSend.click();
    }
  });
}

// Notification System
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  if (notification) {
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }
}

// Form Submissions
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const button = e.target.querySelector('button[type="submit"]');
    if (!button) return;
    
    const originalText = button.textContent;

    button.textContent = "Sending...";
    button.disabled = true;

    setTimeout(() => {
      button.textContent = "Message Sent!";
      showNotification("Your message has been sent successfully!");

      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        e.target.reset();
      }, 2000);
    }, 1000);
  });
}

const newsletterForm = document.getElementById("newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const button = e.target.querySelector('button[type="submit"]');
    if (!button) return;
    
    const originalText = button.textContent;

    button.textContent = "Subscribing...";
    button.disabled = true;

    setTimeout(() => {
      button.textContent = "Subscribed!";
      showNotification("Successfully subscribed to newsletter!");

      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        e.target.reset();
      }, 2000);
    }, 1000);
  });
}

// Register Service Worker for PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(
    'data:application/javascript,console.log("SW registered")'
  );
}

// Analytics (Simulated)
function trackEvent(action, category) {
  console.log(`Event tracked: ${category} - ${action}`);
  // In real implementation, send to Google Analytics or other service
}

// Track page views and interactions
document.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    trackEvent("click", "button");
  }
});

// Performance monitoring
window.addEventListener("load", () => {
  const loadTime = performance.now();
  console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
});

// Lazy loading for images (if any are added)
const lazyImages = document.querySelectorAll("img[data-src]");
if (lazyImages.length > 0) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => imageObserver.observe(img));
}