



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



gsap.set("#shapeEnd", { opacity: 0 }); // keep it hidden; only use as target

gsap.to("#shapeStart", {
  duration: 1.2,
  ease: "power3.inOut",
  morphSVG: "#shapeEnd"
});














const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  });
  
  document.querySelectorAll('.hidden').forEach(section => {
    observer.observe(section);
  });
  
  
  function scrollToSection(targetSelector, duration = 1000) {
    const target = document.querySelector(targetSelector);
    if (!target) return;
  
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const startTime = performance.now();
  
    function animation(currentTime) {
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, targetPosition - startPosition, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
  
    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }
  
    requestAnimationFrame(animation);
  }
  
  document.querySelectorAll('.nav-links a[data-target]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('data-target');
      scrollToSection(target, 1200);
    });
  });

  window.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
  
    document.querySelectorAll('.hidden').forEach(el => observer.observe(el));
  });  
  
  
 


// Update live clock (GMT-5)
function updateClock() {
  const now = new Date();
  const offset = +2; // GMT-5
  const localTime = new Date(now.getTime() + offset * 3600000);
  const timeString = localTime.toUTCString().slice(17, 25);
  document.getElementById('clock').textContent = `${timeString} GMT+2`;
}
setInterval(updateClock, 1000);
updateClock();

// Scroll to top
document.querySelector('.scroll-top')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

  


const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circle");

const colors = [
  "#212529",
  "#212529",
  "#212529",
  "#212529",
  "#212529",
  "#212529",
  "#212529",
  "#212529",
  "#212529",
  "#212529",
  "#212529",
  "#212529",
  "#212529",
  "#212529",
  "#212529",
  "#212529",
  "#212529",
  "#212529",
  "#212529",
  "#212529",
  "#212529",
  "#212529",
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
    duration: 1.6,
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
      duration: 1.2,
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