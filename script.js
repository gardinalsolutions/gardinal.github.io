(() => {
  const qs = (s, p = document) => p.querySelector(s);
  const qsa = (s, p = document) => Array.from(p.querySelectorAll(s));

  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const emailTextEl = qs("#emailText");
  const copyBtn = qs("#copyEmailBtn");
  const FALLBACK_EMAIL = "ravindugardinal@gmail.com";

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = (emailTextEl?.textContent || FALLBACK_EMAIL).trim();
      try {
        await navigator.clipboard.writeText(email);
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy email"), 1200);
      } catch {
        copyBtn.textContent = "Copy failed";
        setTimeout(() => (copyBtn.textContent = "Copy email"), 1200);
      }
    });
  }

  const navToggle = qs("#navToggle");
  const navMenu = qs("#navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    qsa("#navMenu a").forEach(a => {
      a.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (e) => {
      if (!navMenu.classList.contains("is-open")) return;
      const clickInside = navMenu.contains(e.target) || navToggle.contains(e.target);
      if (!clickInside) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  qsa(".faq__q").forEach(btn => {
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      qsa(".faq__q").forEach(b => b.setAttribute("aria-expanded", "false"));
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  const targets = qsa(".section, .card, .priceCard, .testimonial, .step, .panel, .strip, .quote, .callout, .hero__content, .hero__panel");
  targets.forEach(el => el.classList.add("reveal"));

  try {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      targets.forEach(el => io.observe(el));
    } else {
      targets.forEach(el => el.classList.add("is-visible"));
    }
  } catch {
    targets.forEach(el => el.classList.add("is-visible"));
  }

  const contactCtaLabel = qs("#contactCtaLabel");
  const jotformFrame = qs("#jotformFrame");
  const BASE_FORM_URL = "https://form.jotform.com/260375550677060";

  const setCtaByPlan = (planName) => {
    const plan = (planName || "Preview Starter").toString();
    const isPreview = plan.toLowerCase().includes("preview");
    const labelText = isPreview ? "Request free preview" : "Let's Get Started";
    if (contactCtaLabel) contactCtaLabel.textContent = labelText;
    if (jotformFrame) jotformFrame.src = `${BASE_FORM_URL}?selectedPlan=${encodeURIComponent(plan)}`;
  };

  if (contactCtaLabel || jotformFrame) setCtaByPlan("Preview Starter");

  qsa(".js-planCta").forEach(cta => {
    cta.addEventListener("click", () => {
      const plan = cta.getAttribute("data-plan") || "Preview Starter";
      setCtaByPlan(plan);
    });
  });

  qsa('a[href="#contact"]:not(.js-planCta)').forEach(a => {
    a.addEventListener("click", () => setCtaByPlan("Preview Starter"));
  });

  const topbar = qs(".topbar");
  const header = qs(".header");

  if (topbar && header) {
    let lastY = window.scrollY || 0;
    let ticking = false;

    const apply = () => {
      const y = window.scrollY || 0;

      if (y > 60) topbar.classList.add("is-hidden");
      else topbar.classList.remove("is-hidden");

      if (y > 20) header.classList.add("is-fading");
      else header.classList.remove("is-fading");

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
