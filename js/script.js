

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





const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circle");

const colors = [
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
];

circles.forEach(function (circle, index) {
  circle.x = 0;
  circle.y = 0;
  circle.style.backgroundColor = colors[index % colors.length];
});

window.addEventListener("mousemove", function(e){
  coords.x = e.clientX;
  coords.y = e.clientY;
  
});

function animateCircles() {
  
  let x = coords.x;
  let y = coords.y;
  
  circles.forEach(function (circle, index) {
    circle.style.left = x - 12 + "px";
    circle.style.top = y - 12 + "px";
    
    circle.style.scale = (circles.length - index) / circles.length;
    
    circle.x = x;
    circle.y = y;

    const nextCircle = circles[index + 1] || circles[0];
    x += (nextCircle.x - x) * 0.3;
    y += (nextCircle.y - y) * 0.3;
  });
 
  requestAnimationFrame(animateCircles);
}

animateCircles();


// 1) Split paragraph into chars
const whoCopy = document.querySelector(".who-copy");
const st = SplitText.create(whoCopy, { type: "chars", charsClass: "char" });

// 2) Set default overlay content (pixel symbol)
st.chars.forEach((ch) => {
  ch.setAttribute("data-scr", "∙"); // try ":", "█", "·", "▦"
});

const RADIUS = 60;

whoCopy.addEventListener("pointermove", (e) => {
  st.chars.forEach((ch) => {
    const r = ch.getBoundingClientRect();
    const cx = r.left + r.width / 1;
    const cy = r.top + r.height / 1;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist < RADIUS) {
      ch.classList.add("pix-on");

      // optional: randomize pixel symbol a bit
      const pool = ["█", "▦"];
      ch.setAttribute("data-scr", pool[(Math.random() * pool.length) | 0]);
    } else {
      ch.classList.remove("pix-on");
    }
  });
});

whoCopy.addEventListener("pointerleave", () => {
  st.chars.forEach((ch) => ch.classList.remove("pix-on"));
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





