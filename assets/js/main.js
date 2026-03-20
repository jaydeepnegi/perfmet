const hamburger = document.getElementById('hamburger');
const navList   = document.getElementById('nav-list');
const overlay   = document.getElementById('overlay');
const isMobile  = () => window.innerWidth <= 768;

hamburger.addEventListener('click', () => {
  const open = navList.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  overlay.style.display = open ? 'block' : 'none';
  requestAnimationFrame(() => overlay.classList.toggle('visible', open));
});

overlay.addEventListener('click', closeDrawer);
function closeDrawer(){
  navList.classList.remove('open');
  hamburger.classList.remove('open');
  overlay.classList.remove('visible');
  setTimeout(() => overlay.style.display = 'none', 250);
}

/* L1 toggle — mobile only (desktop uses CSS hover) */
document.querySelectorAll('[data-toggle="l1"]').forEach(btn => {
  btn.addEventListener('click', e => {
    if (!isMobile()) return;
    e.stopPropagation();
    const item = btn.closest('.nav-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.nav-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelectorAll('.sub-item.open').forEach(s => s.classList.remove('open'));
    });
    if (!isOpen) item.classList.add('open');
  });
});

/* L2 toggle — mobile only (on mobile, tapping L2 link opens L3 accordion)
   On desktop the L2 link navigates normally; L3 opens via CSS hover. */
document.querySelectorAll('[data-toggle="l2"]').forEach(link => {
  link.addEventListener('click', e => {
    if (!isMobile()) return; // desktop: let the href fire normally
    e.preventDefault();      // mobile: toggle accordion instead of navigate
    e.stopPropagation();
    const item = link.closest('.sub-item');
    const isOpen = item.classList.contains('open');
    item.closest('.dropdown').querySelectorAll('.sub-item.open').forEach(s => s.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

window.addEventListener('resize', () => { if (!isMobile()) closeDrawer(); });


const swiper = new Swiper(".heroSwiper", {
  loop: true,
  speed: 1000,
  effect: "fade",

  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

 var Productswiper = new Swiper(".mySwiper", {

        loop: true,
       autoplay: {
        delay: 1500,
        disableOnInteraction: false,
      },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
         breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
      },
      });

      

    /**
     * createLogoAnimation(container, options)
     * ----------------------------------------
     * Mounts an infinitely-looping SVG logo animation into `container`.
     * Uses NO ids — all selection is scoped to the SVG element itself,
     * so any number of instances can coexist on the same page.
     *
     * @param {HTMLElement} container  - The element to mount into
     * @param {object}      options
     *   @param {number}  options.width     - SVG render width in px  (default 240)
     *   @param {number}  options.height    - SVG render height in px (default 300)
     *   @param {number}  options.interval  - Replay interval in ms   (default 3800)
     */
    function createLogoAnimation(container, options = {}) {
      const {
        width    = 240,
        height   = 300,
        interval = 3800,
      } = options;

      const NS = 'http://www.w3.org/2000/svg';

      /* ── Build a fresh SVG DOM tree ── */
      function buildSVG() {
        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('width',   width);
        svg.setAttribute('height',  height);
        svg.setAttribute('viewBox', '-60 0 1150 1321');
        svg.setAttribute('xmlns',   NS);
        svg.style.overflow = 'visible';
        svg.style.display  = 'block';

        // Black body
        const body = document.createElementNS(NS, 'path');
        body.setAttribute('class', 'logo-body');
        body.setAttribute('d',
          'M0,0v1007.1h97.1s-1.15-78.63-1.15-120.62' +
          'c0-225.11,182.49-407.59,407.59-407.59' +
          's407.59,182.49,407.59,407.59l-.15,120.62h96.1V0H0Z'
        );
        body.style.fill = '#020605';

        // Pulse ring (behind circle)
   
        // Blue circle
        const circ = document.createElementNS(NS, 'circle');
        circ.setAttribute('class', 'logo-blue');
        circ.setAttribute('cx', '502.55');
        circ.setAttribute('cy', '877.33');
        circ.setAttribute('r',  '327.11');
        circ.style.fill            = '#3f63b1';
        circ.style.transformBox    = 'fill-box';
        circ.style.transformOrigin = 'center';

        // Dot positions [cx, cy]
        const dotData = [
          [594.21, 110.98],
          [761.50, 110.98],
          [924.87, 110.98],
          [763.47, 269.10],
          [926.84, 269.10],
          [926.84, 437.16],
        ];

        const dotEls = dotData.map(([cx, cy]) => {
          const d = document.createElementNS(NS, 'circle');
          d.setAttribute('class', 'logo-dot');
          d.setAttribute('cx', cx);
          d.setAttribute('cy', cy);
          d.setAttribute('r',  '55');
          d.style.fill            = '#ffffff';
          d.style.transformBox    = 'fill-box';
          d.style.transformOrigin = 'center';
          return d;
        });

        svg.appendChild(body);
        
        svg.appendChild(circ);
        dotEls.forEach(d => svg.appendChild(d));

        return { svg, body,  circ, dotEls };
      }

      /* ── Apply animations (called after SVG is in DOM) ── */
      function animate({ svg, body,  circ, dotEls }) {
        // Stagger config per dot: [popDelay, floatDuration, floatDelay]
        const dotCfg = [
          [0.90, 3.0, 1.40],
          [1.05, 3.2, 1.55],
          [1.20, 3.4, 1.70],
          [1.35, 3.1, 1.85],
          [1.50, 3.3, 2.00],
          [1.65, 3.5, 2.15],
        ];

        body.style.opacity   = '0';
        body.style.animation = 'logo-slideIn 0.8s cubic-bezier(.4,0,.2,1) forwards';

        circ.style.opacity   = '0';
        circ.style.animation = 'logo-popIn 0.6s cubic-bezier(.34,1.56,.64,1) 0.7s forwards';




        dotEls.forEach((d, i) => {
          const [pd, fd, fstart] = dotCfg[i];
          d.style.opacity   = '0';
          d.style.animation =
            `logo-dotPop 0.45s cubic-bezier(.34,1.56,.64,1) ${pd}s forwards, ` +
            `logo-floatY ${fd}s ease-in-out ${fstart}s infinite`;
        });
      }

      /* ── Play one cycle ── */
      function play() {
        // Remove previous SVG
        const old = container.querySelector('svg');
        if (old) old.remove();

        const parts = buildSVG();
        container.appendChild(parts.svg);

        // Force reflow so animation restarts cleanly
        void parts.svg.getBoundingClientRect();

        animate(parts);
      }

      // First play
      play();

      // Loop forever
      const timer = setInterval(play, interval);

      // Return a cleanup function (useful in SPAs / React useEffect)
      return () => {
        clearInterval(timer);
        const old = container.querySelector('svg');
        if (old) old.remove();
      };
    }

    /* ── Init all .logo-container elements on the page ── */
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.logo-container').forEach(el => {
        const size = parseInt(el.dataset.logoSize, 10) || 240;
        createLogoAnimation(el, {
          width:    size,
          height:   Math.round(size * 1.25),
          interval: 3800,
        });
      });
    });