/* script.js — full behavior (updated for Jotform embed + plan CTA):
   - topbar hides + header fades/hides on scroll
   - mobile nav toggle + outside click close
   - FAQ accordion
   - scroll reveal animations
   - copy email button
   - plan CTA logic (Preview Starter keeps “Request free preview”; others “Let’s Get Started”)
   - Jotform embed support (no mailto submit; form is handled by Jotform)
*/
(() => {
  const qs = (s, p = document) => p.querySelector(s);
  const qsa = (s, p = document) => [...p.querySelectorAll(s)];

  // Year in footer
  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Copy email
  const emailTextEl = qs("#emailText");
  const copyBtn = qs("#copyEmailBtn");
  if (copyBtn && emailTextEl) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(emailTextEl.textContent.trim());
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy email"), 1200);
      } catch {
        copyBtn.textContent = "Copy failed";
        setTimeout(() => (copyBtn.textContent = "Copy email"), 1200);
      }
    });
  }

  // Mobile nav toggle
  const navToggle = qs("#navToggle");
  const navMenu = qs("#navMenu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    // Close menu on link click
    qsa("#navMenu a").forEach(a => {
      a.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!navMenu.classList.contains("is-open")) return;
      const clickInside = navMenu.contains(e.target) || navToggle.contains(e.target);
      if (!clickInside) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // FAQ accordion
  qsa(".faq__q").forEach(btn => {
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      qsa(".faq__q").forEach(b => b.setAttribute("aria-expanded", "false"));
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  // Reveal animations
  const targets = qsa(".section, .card, .priceCard, .testimonial, .step, .panel, .strip, .quote, .callout");
  targets.forEach(el => el.classList.add("reveal"));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => io.observe(el));

  // ===== Plan CTA logic + Jotform embed support =====
  // Assumes your HTML includes:
  // - pricing CTAs with class .js-planCta and data-plan="Preview Starter|Launch Plan|Growth Plan|Authority Plan"
  // - #contactCtaLabel above the Jotform embed (optional)
  // - #jotformFrame iframe (optional)
  const contactCtaLabel = qs("#contactCtaLabel");
  const jotformFrame = qs("#jotformFrame");

  // Keep your actual form URL here (same as your provided link)
  const BASE_FORM_URL = "https://form.jotform.com/260375550677060";

  const setCtaByPlan = (planName) => {
    const plan = (planName || "Preview Starter").toString();
    const isPreview = plan.toLowerCase().includes("preview");

    // ✅ Label rule requested
    const labelText = isPreview ? "Request free preview" : "Let's Get Started";

    if (contactCtaLabel) contactCtaLabel.textContent = labelText;

    // Optional: attempt prefill by query param (harmless if Jotform ignores it)
    if (jotformFrame) {
      jotformFrame.src = `${BASE_FORM_URL}?selectedPlan=${encodeURIComponent(plan)}`;
    }
  };

  // Default behavior when arriving at contact via normal links
  setCtaByPlan("Preview Starter");

  // Pricing CTAs drive the label change
  qsa(".js-planCta").forEach(cta => {
    cta.addEventListener("click", () => {
      const plan = cta.getAttribute("data-plan") || "Preview Starter";
      setCtaByPlan(plan);
    });
  });

  // Any other #contact link defaults to Preview Starter behavior
  qsa('a[href="#contact"]:not(.js-planCta)').forEach(a => {
    a.addEventListener("click", () => setCtaByPlan("Preview Starter"));
  });

  // ===== Topbar + Header disappearing on scroll =====
  const topbar = qs(".topbar");
  const header = qs(".header");
  if (topbar && header) {
    let lastY = window.scrollY || 0;
    let ticking = false;

    const apply = () => {
      const y = window.scrollY || 0;

      // Ribbon disappears after small scroll
      if (y > 60) topbar.classList.add("is-hidden");
      else topbar.classList.remove("is-hidden");

      // Header fades once scrolling starts
      if (y > 20) header.classList.add("is-fading");
      else header.classList.remove("is-fading");

      // Header hides when scrolling down deeper; reappears on scroll up
      const goingDown = y > lastY;
      if (goingDown && y > 220) header.classList.add("is-hidden");
      if (!goingDown) header.classList.remove("is-hidden");

      lastY = y;
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    }, { passive: true });

    apply();
  }
})();
