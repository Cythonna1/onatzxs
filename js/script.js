
// create the smooth scroller FIRST!
let smoother = ScrollSmoother.create({
  smooth: 4,
  effects: true,
  normalizeScroll: true
});

gsap.registerPlugin(ScrollTrigger);


const heroTitle = document.querySelector(".hero__center");
const heroText  = document.querySelector("#portfolioText");

if (heroTitle && heroText) {
  const tlHero = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "+=300",        // controls how long the effect lasts
      scrub: true,
      pin: heroTitle,      // pin ONLY the text
      pinSpacing: false,   // 🔥 KEY FIX
      anticipatePin: 1,
      // markers: true
    }
  });

  // Hold phase (~100px)
  tlHero.to({}, { duration: 0.5 });

  // Fade out phase (~100px)
  tlHero.to(heroText, {
    opacity: 0,
    y: -60,
    filter: "blur(8px)",
    ease: "none"
  });
}


gsap.registerPlugin(ScrollTrigger);

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  let line = "";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const w = ctx.measureText(testLine).width;
    if (w > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

async function mosaicRevealAbout() {
  const about = document.querySelector("#about");
  const p = about?.querySelector(".who-html");
  const canvas = about?.querySelector(".who-canvas");
  if (!about || !p || !canvas) return;

  // Wait for fonts so canvas matches text metrics
  if (document.fonts?.ready) await document.fonts.ready;

  const c = canvas.getContext("2d");
  const off = document.createElement("canvas");
  const offCtx = off.getContext("2d", { willReadFrequently: true });

  const state = {
    blocks: 100,
    threshold: 0.65,
    opacity: 1
  };

  let rect, cs, font, lineHeight, dpr;

  function measure() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    rect = p.getBoundingClientRect();
    cs = getComputedStyle(p);

    font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    lineHeight =
      parseFloat(cs.lineHeight) ||
      parseFloat(cs.fontSize) * 1.4;

    // size canvas in device pixels
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    // map drawing coordinates to CSS pixels
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function render() {
    if (!rect) return;

    const w = rect.width;
    const h = rect.height;

    // blocks across => low-res buffer size
    const blocks = Math.max(8, Math.round(state.blocks));
    const lowW = blocks;
    const lowH = Math.max(8, Math.round(blocks * (h / w)));

    off.width = lowW;
    off.height = lowH;

    // draw text into low-res buffer
    offCtx.setTransform(1, 0, 0, 1, 0, 0);
    offCtx.clearRect(0, 0, lowW, lowH);

    // scale so "CSS pixel" coords work in low-res buffer
    offCtx.scale(lowW / w, lowH / h);

    offCtx.fillStyle = cs.color || "#fff";
    offCtx.font = font;
    offCtx.textBaseline = "top";

    const pad = 0;
    const text = p.innerText; // cleaner than textContent
    wrapText(offCtx, text, pad, pad, w - pad * 2, lineHeight);

    // OPTIONAL threshold look (comment out for pure mosaic)
    const img = offCtx.getImageData(0, 0, lowW, lowH);
    const data = img.data;
    const t = state.threshold;

    for (let i = 0; i < data.length; i += 4) {
      const lum =
        (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
      const v = lum > t ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = v;
      // alpha stays as is
    }
    offCtx.putImageData(img, 0, 0);

    // upscale to main canvas (pixelated)
    c.save();
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, h);
    c.globalAlpha = state.opacity;
    c.imageSmoothingEnabled = false;
    c.drawImage(off, 0, 0, w, h);
    c.restore();
  }

  // Initial states
  gsap.set(p, { opacity: 0 });
  gsap.set(canvas, { opacity: 1 });

  measure();
  render();

  // Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: about,
      start: "top 70%",
      once: true,
      onRefresh: () => {
        measure();
        render();
      }
      // markers: true
    },
    onUpdate: render,
    onComplete: () => {
      // crossfade to crisp HTML
      gsap.to(canvas, { opacity: 0, duration: 0.35, ease: "power2.out" });
      gsap.to(p, { opacity: 1, duration: 0.35, ease: "power2.out" });
    }
  });

  // AE-style blocks → clean
  tl.to(state, { blocks: 10, duration: 0.2, ease: "none" }, 0);      // very chunky
  tl.to(state, { blocks: 120, duration: 0.45, ease: "power2.out" }, 0.1);
  tl.to(state, { blocks: 480, duration: 0.6, ease: "power2.out" }, 0.35);
  tl.to(state, { blocks: 1600, duration: 0.8, ease: "power2.out" }, 0.7); // very fine
  // Threshold easing (optional)
  tl.to(state, { threshold: 0.50, duration: 0.8, ease: "power2.out" }, 0);
  tl.to(state, { threshold: 0.30, duration: 0.8, ease: "power2.out" }, 0.7);

  // If window resizes before reveal triggers, keep canvas correct
  window.addEventListener("resize", () => {
    measure();
    render();
    ScrollTrigger.refresh();
  });
}

window.addEventListener("load", () => {
  mosaicRevealAbout();
});




document.addEventListener("DOMContentLoaded", () => {
  // ---------- 1) Reveal system (fixes "about is gone") ----------
  const revealTargets = document.querySelectorAll(".hidden");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          // optional: stop observing once revealed
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((el) => io.observe(el));

  // ---------- 2) Horizontal scroll section ----------
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const pin = document.querySelector(".projects-pin");
  const track = document.querySelector(".projects-track");

  if (!pin || !track) return;

  const getScrollDistance = () => track.scrollWidth - window.innerWidth;

  // If there isn't enough width to scroll, don't pin
  if (getScrollDistance() <= 0) return;

  gsap.to(track, {
    x: () => -getScrollDistance(),
    ease: "none",
    scrollTrigger: {
      trigger: pin,
      start: "top top",
      end: () => "+=" + getScrollDistance(),
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // Good practice when content changes sizes (images load, resize, etc.)
  window.addEventListener("load", () => ScrollTrigger.refresh());
});

const GRID_SIZE = 10;
const STEP_DURATION = 0.28;



document.querySelectorAll(".project-image.pixelate").forEach((wrap) => {
  const grid = wrap.querySelector(".pixel-grid");
  const imgDefault = wrap.querySelector(".img-default");
  const imgHover = wrap.querySelector(".img-hover");

  if (!grid || !imgDefault || !imgHover) {
    console.warn("Missing elements in:", wrap, { grid, imgDefault, imgHover });
    return;
  }

  // build pixels once
  if (!grid.dataset.built) {
    const size = 100 / GRID_SIZE;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const p = document.createElement("div");
        p.className = "pixel";
        p.style.width = `${size}%`;
        p.style.height = `${size}%`;
        p.style.left = `${c * size}%`;
        p.style.top = `${r * size}%`;
        grid.appendChild(p);
      }
    }
    grid.dataset.built = "1";
  }

  const pixels = Array.from(grid.querySelectorAll(".pixel"));
  gsap.set(pixels, { display: "none" });

  const cover = () =>
    gsap.to(pixels, {
      display: "block",
      duration: 0,
      stagger: { from: "random", each: STEP_DURATION / pixels.length },
    });

  const uncover = () =>
    gsap.to(pixels, {
      display: "none",
      duration: 0,
      stagger: { from: "random", each: STEP_DURATION / pixels.length },
    });

  const reveal = () => {
    gsap.killTweensOf(pixels);

    cover().eventCallback("onComplete", () => {
      // swap
      imgDefault.style.opacity = "0";
      imgHover.style.opacity = "1";

      uncover();
    });
  };

  const hide = () => {
    gsap.killTweensOf(pixels);

    cover().eventCallback("onComplete", () => {
      imgHover.style.opacity = "0";
      imgDefault.style.opacity = "1";

      uncover();
    });
  };

  wrap.addEventListener("mouseenter", reveal);
  wrap.addEventListener("mouseleave", hide);
});

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

function scrambleReveal(el, opts = {}) {
  const finalText = el.textContent.trim();

  // start hidden-ish
  gsap.set(el, { opacity: 0, y: 12 });

  return gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: opts.duration ?? 4,
    ease: "power2.out",
    scrambleText: {
      text: finalText,
      chars: opts.chars ?? "upperAndLowerCase",
      speed: opts.speed ?? 0.1,
      revealDelay: opts.revealDelay ?? 0.15,
      tweenLength: true
    }
  });
}

window.addEventListener("load", () => {
  const about = document.querySelector("#about");
  const title = document.querySelector("#aboutTitle");
  const copy  = document.querySelector("#aboutCopy");
  if (!about || !title || !copy) return;

  // timeline triggers once when About enters
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: about,
      start: "top 70%",
      once: true
      // markers: true
    }
  });

  tl.add(scrambleReveal(title, { duration: 1.5, chars: "upperCase", speed: 0.7 }), 0);
  tl.add(scrambleReveal(copy,  { duration: 3, chars: "▀ ▄ ▀", speed: 0.5, revealDelay: 0.05 }), 0.15);
});



gsap.registerPlugin(ScrambleTextPlugin);

const blurbs = [
  "ONAT ZEKOVSKI"
];

let curIndex = 0;

// optional: start from something scrambled
gsap.set("#portfolioText", { textContent: blurbs[0] });

function scrambleToNext() {
  curIndex = (curIndex + 1) % blurbs.length;

  gsap.to("#portfolioText", {
    scrambleText: {
      text: blurbs[curIndex],
      chars: "PORTFOLIO█",          // pixel-ish chars (change if you want)
      revealDelay: 0.2,
      tweenLength: true,
      // newClass: curIndex === 2 ? "border" : ""  // optional
    },
    ease: "power2.inOut",
    overwrite: "auto",
    duration: 2.5,
    onComplete: () => {
      // wait a bit then scramble again
      gsap.delayedCall(1.0, scrambleToNext);
    }
  });
}

// start when the page is ready
window.addEventListener("DOMContentLoaded", () => {
  // scramble in immediately from initial state
  gsap.fromTo(
    "#portfolioText",
    { opacity: 1 },
    {
      duration: 2.5,
      scrambleText: {
        text: blurbs[0],
        chars: "█PORTFOLIO█",
        revealDelay: 0.15,
        tweenLength: true
      },
      ease: "power2.out",
    }
  );
});




// --- SELECT DOTS ---
const topDots = gsap.utils.toArray("#dot-cloud-top rect");
const bottomDots = gsap.utils.toArray("#dot-cloud-bottom rect");

function introScatterToStatic(dots, scatter) {
  gsap.set(dots, {
    x: () => gsap.utils.random(-scatter, scatter),
    y: () => gsap.utils.random(-scatter, scatter),
    opacity: 0
  });

  return gsap.timeline()
    .to(dots, { opacity: 1, duration: 0.6, stagger: { each: 0.001, from: "random" } }, 0)
    .to(dots, { x: 0, y: 0, duration: 1.5, stagger: { each: 0.0015, from: "random" } }, 0);
}

window.addEventListener("load", () => {
  const tl = gsap.timeline({
    onComplete: () => enableMouseRepel([...topDots, ...bottomDots])
  });

  tl.add(introScatterToStatic(topDots, 150), 0);
  tl.add(introScatterToStatic(bottomDots, 150), 0);
});


// --- MOUSE REPEL (only active after intro finishes) ---
function enableMouseRepel(dots) {
  const RADIUS = 500;     // hover influence radius
  const STRENGTH = 300;    // how far dots push away
  const EASE_BACK = 0.6;  // return speed when mouse leaves/stops

  // Quick setters (fast)
  const setX = dots.map(d => gsap.quickTo(d, "x", { duration: 0.25, ease: "power2.out" }));
  const setY = dots.map(d => gsap.quickTo(d, "y", { duration: 0.25, ease: "power2.out" }));

  // Cache dot centers in viewport coords (recompute on resize/scroll)
  let centers = [];
  function cacheCenters() {
    centers = dots.map(el => {
      const r = el.getBoundingClientRect();
      return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    });
  }
  cacheCenters();

  // RAF throttle
  let mx = -9999, my = -9999, raf = null;

  function update() {
    raf = null;

    for (let i = 0; i < dots.length; i++) {
      const { cx, cy } = centers[i];
      const dx = cx - mx;
      const dy = cy - my;
      const dist = Math.hypot(dx, dy);

      if (dist < RADIUS) {
        // push away from cursor with a smooth falloff
        const t = 1 - dist / RADIUS; // 1 near cursor, 0 at edge
        const push = STRENGTH * (t * t); // quadratic falloff looks nicer

        const nx = dx / (dist || 1);
        const ny = dy / (dist || 1);

        setX[i](nx * push);
        setY[i](ny * push);
      } else {
        setX;
        setY;
      }
    }
  }

  function requestUpdate() {
    if (!raf) raf = requestAnimationFrame(update);
  }

  // IMPORTANT: attach mousemove to the section that contains the SVG
  // Pick your hero wrapper, or the svg itself:
  const target = document.querySelector(".hero") || document.querySelector("svg");

  target.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    requestUpdate();
  });

  target.addEventListener("mouseleave", () => {
    mx = -9999;
    my = -9999;
    requestUpdate();

    // Optional: force a smooth full reset
    gsap.to(dots, { x: 0, y: 0, duration: EASE_BACK, ease: "power2.out", overwrite: true });
  });

  window.addEventListener("resize", () => { cacheCenters(); requestUpdate(); });
  window.addEventListener("scroll", () => { cacheCenters(); requestUpdate(); }, { passive: true });
}


mm.add("(max-width: 768px)", () => {
  // ✅ MOBILE: kill the pinned horizontal trigger + reset transforms
  const st = ScrollTrigger.getById("projectsHorizontal");
  if (st) st.kill(true);

  gsap.set(".projects-track", { clearProps: "transform" });
  gsap.set(".projects-pin", { clearProps: "height,overflow" });
});


