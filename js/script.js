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
  
  
  document.querySelectorAll('.project-card').forEach(card => {
    const inner = card.querySelector('.project-card-inner');
    let timeout;
  
    card.addEventListener('mousemove', e => {
      if (timeout) return;
      timeout = setTimeout(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / rect.height) * 10;
        const rotateY = ((x - rect.width / 2) / rect.width) * -10;
        inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        timeout = null;
          const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

          const ROTATION_MULTIPLIER = isSafari ? 25 : 50; // Safari calmer

          const rotateX = ((y - rect.height / 2) / rect.height) * ROTATION_MULTIPLIER;
          const rotateY = ((x - rect.width / 2) / rect.width) * -ROTATION_MULTIPLIER
      }, 20); // updates every 20ms (~50 FPS max)
    });
  
    card.addEventListener('mouseleave', () => {
      inner.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
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

