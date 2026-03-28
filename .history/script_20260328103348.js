/* ============================================================
   SAHL - script.js
   Scroll reveal · Nav scroll state · Mobile menu
   ============================================================ */

/* ── Scroll Reveal ──────────────────────────────────────────── */
(function () {
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings slightly
          const siblings = entry.target.closest(
            ".services__grid, .mv__grid, .diff__right, .about__stats",
          );
          let delay = 0;
          if (siblings) {
            const children = Array.from(siblings.querySelectorAll(".reveal"));
            delay = children.indexOf(entry.target) * 80;
          }
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  reveals.forEach((el) => observer.observe(el));
})();

/* ── Nav Scroll State ───────────────────────────────────────── */
(function () {
  const nav = document.getElementById("nav");
  const SCROLL_THRESHOLD = 60;

  function updateNav() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();
})();

/* ── Mobile Menu ────────────────────────────────────────────── */
(function () {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  // Close on nav link click
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", false);
    });
  });
})();

/* ── Hero content initial animation ────────────────────────── */
(function () {
  const heroContent = document.querySelector(".hero__content");
  if (heroContent) {
    // Hero enters immediately on load
    setTimeout(() => {
      heroContent.classList.add("visible");
    }, 200);
  }
})();
/* ── Contact Form Handler ─────────────────────────────────── */
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(form);
    formData.set("_replyto", formData.get("email"));
    formData.set("timestamp", new Date().toLocaleString());

    try {
      // Send to Formspree using a normal form submission so hidden autoresponse fields are processed correctly
      const response = await fetch("https://formspree.io/f/xlgpqykd", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = "✓ Message Sent!";
        submitBtn.style.opacity = "0.7";

        const successPanel = document.getElementById("contact-success");
        const successName = document.getElementById("success-name");
        const successEmail = document.getElementById("success-email");
        const successService = document.getElementById("success-service");
        const successMessage = document.getElementById("success-message");

        if (successName) successName.textContent = formData.get("name") || "there";
        if (successEmail) successEmail.textContent = formData.get("email") || "your email";
        if (successService) successService.textContent = formData.get("service") || "General inquiry";
        if (successMessage) successMessage.textContent = formData.get("message") || "No message provided.";

        if (successPanel) {
          successPanel.classList.remove("hidden");
          form.style.display = "none";
        }

        return;
      } else {
        alert("There was an issue sending your message. Please try again.");
      }
    } catch (error) {
      // Fallback: Log locally and show message
      console.log("Form Data:", data);
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "✓ Message Received!";
      form.reset();
      setTimeout(() => {
        submitBtn.textContent = originalText;
      }, 3000);
    }
  });
})();
