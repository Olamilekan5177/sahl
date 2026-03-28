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
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      service: formData.get("service"),
      message: formData.get("message"),
      _replyto: formData.get("email"),
      _subject: "Thanks for contacting SAHL hq",
      _autoresponse:
        "Thanks for reaching out to SAHL hq! We've received your inquiry and will be in touch within 24 hours. Reply to this email if you'd like to add more details.",
      timestamp: new Date().toLocaleString(),
    };

    const replyToInput = document.getElementById("_replyto");
    if (replyToInput) replyToInput.value = data._replyto;

    try {
      // Send to FormSubmit.co - you need to set up your email
      const response = await fetch("https://formspree.io/f/xlgpqykd", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        // Show success message
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "✓ Message Sent!";
        submitBtn.style.opacity = "0.7";

        // Reset form
        form.reset();

        // Restore button text after 3 seconds
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.opacity = "1";
        }, 3000);
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
