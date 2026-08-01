/* ==========================================================
   WANDERLY — interactions
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Sticky nav + mobile menu ---------- */
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  burger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    burger.classList.toggle("open", isOpen);
    burger.setAttribute("aria-expanded", isOpen);
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- 2. Custom cursor (desktop only) ---------- */
  const cursorDot = document.getElementById("cursorDot");
  if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    window.addEventListener("mousemove", e => {
      cursorDot.style.left = e.clientX + "px";
      cursorDot.style.top = e.clientY + "px";
    });
    document.querySelectorAll("a, button, .dest-card, .gallery-item").forEach(el => {
      el.addEventListener("mouseenter", () => cursorDot.classList.add("grow"));
      el.addEventListener("mouseleave", () => cursorDot.classList.remove("grow"));
    });
  }

  /* ---------- 3. Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add("in"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------- 4. Hero: mute/unmute + scroll cue ---------- */
  const heroVideo = document.getElementById("heroVideo");
  const muteToggle = document.getElementById("muteToggle");
  const muteIcon = document.getElementById("muteIcon");

  muteToggle.addEventListener("click", () => {
    heroVideo.muted = !heroVideo.muted;
    muteIcon.textContent = heroVideo.muted ? "🔇" : "🔊";
    muteToggle.lastChild.textContent = heroVideo.muted ? " Unmute footage" : " Mute footage";
  });

  document.getElementById("scrollCue").addEventListener("click", () => {
    document.getElementById("journeys").scrollIntoView({ behavior: "smooth" });
  });

  /* ---------- 5. Destination card videos: play on hover / when visible ---------- */
  function wireHoverVideo(card, video) {
    card.addEventListener("mouseenter", () => video.play().catch(() => {}));
    card.addEventListener("mouseleave", () => { video.pause(); video.currentTime = 0; });
  }
  document.querySelectorAll(".dest-card, .gallery-item").forEach(card => {
    const video = card.querySelector("video");
    if (video) wireHoverVideo(card, video);
  });

  // Also autoplay whichever card is centered in view on touch devices
  const rail = document.getElementById("rail");
  const railObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector("video");
      if (!video) return;
      if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { root: rail, threshold: [0.6] });
  document.querySelectorAll(".dest-card").forEach(c => railObserver.observe(c));

  /* ---------- 6. Journey rail: drag-to-scroll ---------- */
  let isDown = false, startX, scrollLeft;

  rail.addEventListener("mousedown", (e) => {
    isDown = true;
    rail.classList.add("dragging");
    startX = e.pageX - rail.offsetLeft;
    scrollLeft = rail.scrollLeft;
  });
  ["mouseleave", "mouseup"].forEach(evt => rail.addEventListener(evt, () => { isDown = false; }));
  rail.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - rail.offsetLeft;
    rail.scrollLeft = scrollLeft - (x - startX) * 1.4;
  });

  /* ---------- 7. Flight path: draw on scroll + plane marker ---------- */
  const pathEl = document.getElementById("flightPathLine");
  const planeMarker = document.getElementById("planeMarker");
  const pathLength = pathEl.getTotalLength();
  pathEl.style.strokeDasharray = pathLength;
  pathEl.style.strokeDashoffset = pathLength;

  function updateFlightPath() {
    const railRect = rail.getBoundingClientRect();
    const railScrollable = rail.scrollWidth - rail.clientWidth;
    const railProgress = railScrollable > 0 ? rail.scrollLeft / railScrollable : 0;

    const winH = window.innerHeight;
    const sectionProgress = Math.min(Math.max((winH - railRect.top) / (winH + railRect.height), 0), 1);

    const progress = Math.max(railProgress, sectionProgress * 0.9);
    const drawOffset = pathLength * (1 - progress);
    pathEl.style.strokeDashoffset = drawOffset;

    const point = pathEl.getPointAtLength(pathLength * progress);
    planeMarker.setAttribute("transform", `translate(${point.x - 10}, ${point.y - 14})`);
  }
  updateFlightPath();
  window.addEventListener("scroll", updateFlightPath, { passive: true });
  rail.addEventListener("scroll", updateFlightPath, { passive: true });
  window.addEventListener("resize", updateFlightPath);

  /* ---------- 8. Testimonial carousel ---------- */
  const storyTrack = document.getElementById("storyTrack");
  const storyDotsWrap = document.getElementById("storyDots");
  const slides = storyTrack.children.length;
  let storyIndex = 0;

  for (let i = 0; i < slides; i++) {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Go to story ${i + 1}`);
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToStory(i));
    storyDotsWrap.appendChild(dot);
  }

  function goToStory(i) {
    storyIndex = (i + slides) % slides;
    storyTrack.style.transform = `translateX(-${storyIndex * 100}%)`;
    [...storyDotsWrap.children].forEach((d, idx) => d.classList.toggle("active", idx === storyIndex));
  }

  let storyTimer = setInterval(() => goToStory(storyIndex + 1), 6000);
  const storyCarousel = document.querySelector(".story-carousel");
  storyCarousel.addEventListener("mouseenter", () => clearInterval(storyTimer));
  storyCarousel.addEventListener("mouseleave", () => {
    storyTimer = setInterval(() => goToStory(storyIndex + 1), 6000);
  });

  /* ---------- 9. Gallery lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxVideo = document.getElementById("lightboxVideo");
  const lightboxClose = document.getElementById("lightboxClose");

  document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      const src = item.getAttribute("data-video");
      lightboxVideo.querySelector("source")?.remove();
      lightboxVideo.src = src;
      lightbox.classList.add("open");
      lightboxVideo.play().catch(() => {});
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    document.body.style.overflow = "";
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

  /* ---------- 10. Newsletter form ---------- */
  const joinForm = document.getElementById("joinForm");
  const formMsg = document.getElementById("formMsg");

  joinForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("joinName").value.trim();
    const email = document.getElementById("joinEmail").value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailOk) {
      formMsg.textContent = "Please add your name and a valid email address.";
      formMsg.style.color = "#D9553B";
      return;
    }

    formMsg.textContent = `You're on the list, ${name.split(" ")[0]}. Watch your inbox.`;
    formMsg.style.color = "#6B4F42";
    joinForm.reset();
  });

  /* ---------- 11. Back to top ---------- */
  document.getElementById("toTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

});