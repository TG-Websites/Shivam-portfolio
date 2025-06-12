 
      // Initialize AOS
      AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
      });

      // Theme Toggle
      const themeToggle = document.getElementById("theme-toggle");
      const body = document.body;
      const sunIcon = document.querySelector(".theme-icon-sun");
      const moonIcon = document.querySelector(".theme-icon-moon");

      themeToggle.addEventListener("click", () => {
        if (body.getAttribute("data-theme") === "light") {
          body.removeAttribute("data-theme");
          sunIcon.classList.add("hidden");
          moonIcon.classList.remove("hidden");
          localStorage.setItem("theme", "dark");
        } else {
          body.setAttribute("data-theme", "light");
          sunIcon.classList.remove("hidden");
          moonIcon.classList.add("hidden");
          localStorage.setItem("theme", "light");
        }
      });

      // Load saved theme
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light") {
        body.setAttribute("data-theme", "light");
        sunIcon.classList.remove("hidden");
        moonIcon.classList.add("hidden");
      }

      // Mobile Menu
      const menuBtn = document.getElementById("menu-btn");
      const mobileMenu = document.getElementById("mobile-menu");
      const closeMenu = document.getElementById("close-menu");
      const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

      menuBtn.addEventListener("click", () => {
        mobileMenu.classList.add("active");
      });

      closeMenu.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
      });

      mobileNavLinks.forEach((link) => {
        link.addEventListener("click", () => {
          mobileMenu.classList.remove("active");
        });
      });

      // Typing Animation
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
        const currentText = texts[textIndex];

        if (isDeleting) {
          typingElement.textContent = currentText.substring(0, charIndex - 1);
          charIndex--;
        } else {
          typingElement.textContent = currentText.substring(0, charIndex + 1);
          charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
          typeSpeed = 2000;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          typeSpeed = 500;
        }

        setTimeout(typeText, typeSpeed);
      }

      // Start typing animation
      setTimeout(typeText, 1000);

      // 3D Hero Background
      const canvas = document.getElementById("hero-canvas");
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      // Create particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 1000;
      const posArray = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
      }

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(posArray, 3)
      );

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x888888,
        transparent: true,
        opacity: 0.5,
      });

      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      camera.position.z = 3;

      // Animation loop
      function animate() {
        requestAnimationFrame(animate);
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.001;
        renderer.render(scene, camera);
      }

      animate();

      // Handle resize
      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      // Progress Bars Animation
      const progressBars = document.querySelectorAll(".progress-fill");
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const progressBar = entry.target;
            const width = progressBar.getAttribute("data-width");
            progressBar.style.width = width;
            progressBar.classList.add("animate");
          }
        });
      });

      progressBars.forEach((bar) => observer.observe(bar));

      // Smooth scrolling for navigation links
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        });
      });

      // Chat Widget
      const chatToggle = document.getElementById("chat-toggle");
      const chatPopup = document.getElementById("chat-popup");
      const chatClose = document.getElementById("chat-close");
      const chatInput = document.getElementById("chat-input");
      const chatSend = document.getElementById("chat-send");
      const chatMessages = document.getElementById("chat-messages");

      chatToggle.addEventListener("click", () => {
        chatPopup.classList.toggle("hidden");
      });

      chatClose.addEventListener("click", () => {
        chatPopup.classList.add("hidden");
      });

      function addMessage(message, isUser = false) {
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

      // Notification System
      function showNotification(message, type = "success") {
        const notification = document.getElementById("notification");
        notification.classList.add("show");

        setTimeout(() => {
          notification.classList.remove("show");
        }, 3000);
      }

      // Form Submissions
      document
        .getElementById("contact-form")
        .addEventListener("submit", (e) => {
          e.preventDefault();

          const button = e.target.querySelector('button[type="submit"]');
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

      document
        .getElementById("newsletter-form")
        .addEventListener("submit", (e) => {
          e.preventDefault();

          const button = e.target.querySelector('button[type="submit"]');
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
    