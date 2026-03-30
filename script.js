// ════════════════════════════════════════════════════════════
//  STEP 1 of 2 — Paste your Google Apps Script Web App URL
// ════════════════════════════════════════════════════════════
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxzaHnN5HcerwnD_usD6DNMV7fnTsuYGlplnV79DDZs3Y3u-XAFvZsTINZbC8KXP0pirg/exec';

// ════════════════════════════════════════════════════════════
//  STEP 2 of 2 — Paste your WhatsApp phone + Callmebot key
// ════════════════════════════════════════════════════════════
const WA_PHONE = '9158786236'; // e.g. 917798900022
const WA_APIKEY = '';

// ── Custom cursor ──────────────────────────────────────────
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
document.querySelectorAll('a, button, .cat-card, .pillar, .mat-tab, .gallery-item, .mfg-location-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('big'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
});

// ── Sticky nav ─────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Scroll reveal ───────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// ── Timeline bars ───────────────────────────────────────────
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.timeline-bar-fill').forEach((bar, i) => {
        setTimeout(() => bar.classList.add('animate'), i * 120);
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.mfg-timeline-box').forEach(el => barObserver.observe(el));

// ── Materials tabs ──────────────────────────────────────────
function showMat(cat, btn) {
  document.querySelectorAll('.mat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.mat-swatch').forEach(s => {
    s.classList.toggle('visible', s.dataset.cat === cat);
  });
}

// ── Form submit — Google Sheet + WhatsApp ───────────────────
async function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const name = document.getElementById('fName').value.trim();
  const contact = document.getElementById('fContact').value.trim();
  const category = document.getElementById('fCategory').value || 'Not specified';
  const budget = document.getElementById('fBudget').value || 'Not specified';
  const message = document.getElementById('fMessage').value.trim() || '(no message)';

  if (!name || !contact) {
    showStatus('error', '⚠ Please fill in your name and contact details.');
    return;
  }
  if (SHEET_URL === 'YOUR_GOOGLE_SHEET_WEBAPP_URL') {
    showStatus('warn', '⚙ Not configured yet — see the setup guide on this page.');
    return;
  }

  btn.textContent = 'Sending…';
  btn.disabled = true;

  let sheetOk = false;
  let waOk = false;

  // ── 1. Save to Google Sheet ──────────────────────────────
  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',   // Google Apps Script requires no-cors
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, contact, category, budget, message })
    });
    sheetOk = true;     // no-cors means we can't read the response, assume ok
  } catch (err) {
    console.error('Sheet error:', err);
  }

  // ── 2. Send WhatsApp via Callmebot ───────────────────────
  if (WA_PHONE !== 'YOUR_PHONE_WITH_COUNTRY_CODE') {
    try {
      const waMsg = encodeURIComponent(
        `🪵 New Nyasa Haus Enquiry!\nName: ${name}\nContact: ${contact}\nCategory: ${category}\nBudget: ${budget}\nMessage: ${message}`
      );
      const waUrl = `https://api.callmebot.com/whatsapp.php?phone=${WA_PHONE}&text=${waMsg}&apikey=${WA_APIKEY}`;
      // Use an image trick to avoid CORS — Callmebot supports GET via img src
      const img = new Image();
      img.src = waUrl;
      waOk = true;
    } catch (err) {
      console.error('WhatsApp error:', err);
    }
  }

  // ── 3. Show result ───────────────────────────────────────
  if (sheetOk || waOk) {
    showStatus('success', '✓ Enquiry received! We\'ll be in touch very soon.');
    document.getElementById('fName').value = '';
    document.getElementById('fContact').value = '';
    document.getElementById('fCategory').value = '';
    document.getElementById('fBudget').value = '';
    document.getElementById('fMessage').value = '';
  } else {
    showStatus('error', '✗ Something went wrong. Please call us directly on +91 77989 00022.');
  }
  btn.textContent = 'Send Enquiry →';
  btn.disabled = false;
}

function showStatus(type, msg) {
  const box = document.getElementById('formStatus');
  const c = {
    success: { bg: '#e6f4ea', border: '#4a8a4a', color: '#2a5a2a' },
    error: { bg: '#fde8e8', border: '#c0392b', color: '#7a1a1a' },
    warn: { bg: '#fffbe6', border: '#c8963c', color: '#7a4a10' }
  }[type];
  box.style.cssText = `display:block;padding:12px 16px;border-radius:3px;font-size:0.85rem;
      background:${c.bg};border:1px solid ${c.border};color:${c.color};margin-bottom:8px;`;
  box.textContent = msg;
  if (type !== 'warn') setTimeout(() => { box.style.display = 'none'; }, 7000);
}

// ── Image Collection Modal Logic ────────────────────────────
const collectionData = {
  residential: {
    title: "Residential <em>Collection</em>",
    images: [
      "1 PAGE PHOTOS/CHAIRS .jpeg",
      "1 PAGE PHOTOS/COFFEE TABLE .jpeg",
      "1 PAGE PHOTOS/CONSOLE TABLE .jpeg",
      "1 PAGE PHOTOS/DINING TABLE .jpeg",
      "1 PAGE PHOTOS/SOFA .jpeg"
    ]
  },
  office: {
    title: "Office <em>Collection</em>",
    images: [
      "OUR PRODUCTS/CONFERENCE TABLE/IMG 1.jpg",
      "OUR PRODUCTS/CONFERENCE TABLE/IMG 2.jpg",
      "OUR PRODUCTS/CONFERENCE TABLE/IMG 3.jpg",
      "OUR PRODUCTS/CONFERENCE TABLE/IMG 4.jpg",
      "OUR PRODUCTS/EXECUTIVE DESK/IMG 1.jpg",
      "OUR PRODUCTS/EXECUTIVE DESK/IMG 2.jpg",
      "OUR PRODUCTS/EXECUTIVE DESK/IMG 3.jpg",
      "OUR PRODUCTS/MODULAR  WORKSTATIONS/IMG 1.jpg",
      "OUR PRODUCTS/MODULAR  WORKSTATIONS/IMG 2.jpg",
      "OUR PRODUCTS/MODULAR  WORKSTATIONS/IMG 3.jpg",
      "OUR PRODUCTS/MODULAR  WORKSTATIONS/IMG 4.jpg"
    ]
  },
  commercial: {
    title: "Commercial <em>Collection</em>",
    images: [
      "OUR PRODUCTS/CAFETERIA FURNITURE/IMG 1.jpg",
      "OUR PRODUCTS/CAFETERIA FURNITURE/IMG 2.jpg",
      "OUR PRODUCTS/CAFETERIA FURNITURE/IMG 3.jpg",
      "OUR PRODUCTS/CAFETERIA FURNITURE/IMG 4.jpg",
      "OUR PRODUCTS/LOUNGE AREA - 1 .jpeg",
      "OUR PRODUCTS/LOUNGE AREA .jpeg"
    ]
  }
};

const modal = document.getElementById('collection-modal');
const modalGallery = document.getElementById('modal-gallery');
const modalTitle = document.getElementById('modal-title');

function openCollection(category) {
  if (!collectionData[category]) return;
  const data = collectionData[category];

  modalTitle.innerHTML = data.title;
  modalGallery.innerHTML = '';

  data.images.forEach((src, idx) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = category + ' furniture ' + (idx + 1);
    img.style.opacity = '0';
    img.style.transform = 'translateY(20px)';
    img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    modalGallery.appendChild(img);

    setTimeout(() => {
      img.style.opacity = '1';
      img.style.transform = 'translateY(0)';
    }, 100 + (idx * 150));
  });

  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // prevent background scrolling

  // Push state to support mobile swipe-back
  history.pushState({ modalOpen: true }, '', '#collection');
}

function closeCollection(isPopState = false) {
  if (!modal.classList.contains('active')) return;

  modal.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => {
    modalGallery.innerHTML = '';
  }, 400); // Wait for transition

  // If closed manually (not via swipe-back), pop the history state
  if (!isPopState) {
    history.back();
  }
}

// Intercept swipe-back / browser back button
window.addEventListener('popstate', (e) => {
  if (modal.classList.contains('active')) {
    closeCollection(true);
  }
});

// Close on click outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeCollection();
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeCollection();
  }
});

// ── Smooth scroll ───────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ── Mobile Nav Toggle ───────────────────────────────────────
function toggleMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNavOverlay');
  hamburger.classList.toggle('active');
  mobileNav.classList.toggle('active');
  if (mobileNav.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}
// ═══════════════════════════════════════════════════════════════
//  PRODUCT CATEGORY CARDS — lazy-load + fullscreen viewer
// ═══════════════════════════════════════════════════════════════

let _prodViewerImages = [];
let _prodViewerIdx    = 0;

function expandCategory(id) {
  const lightbox = document.getElementById('lightbox-' + id);
  if (!lightbox) return;

  // Toggle close if already open
  if (lightbox.classList.contains('open')) {
    collapseCategory(id);
    return;
  }

  // Close any other open lightbox first (smooth)
  document.querySelectorAll('.prod-lightbox.open').forEach(el => {
    el.classList.remove('open');
  });
  document.querySelectorAll('.prod-card.expanded').forEach(el => {
    el.classList.remove('expanded');
  });
  const card = document.getElementById('card-' + id);
  if (card) {
    card.classList.add('expanded');
    setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  }
  lightbox.classList.add('open');

  // Lazy-load images only once
  const grid = document.getElementById('grid-' + id);
  if (!grid || grid.dataset.loaded === 'true') return;

  const images = JSON.parse(grid.dataset.images || '[]');
  grid.innerHTML = '<div class="prod-loading"><div class="prod-loading-ring"></div></div>';

  // Stagger image load for a modern cascading feel
  setTimeout(() => {
    grid.innerHTML = '';
    images.forEach((src, i) => {
      const img = document.createElement('img');
      img.alt = id + ' furniture ' + (i + 1);
      img.loading = 'lazy';
      img.onclick = () => openProdViewer(images, i);

      // Animate in with stagger
      setTimeout(() => {
        img.src = src;
        img.onload = () => img.classList.add('img-loaded');
        img.onerror = () => { img.src = ''; img.style.display = 'none'; };
        grid.appendChild(img);
      }, i * 40);
    });
    grid.dataset.loaded = 'true';
  }, 120);
}

function collapseCategory(id) {
  const lightbox = document.getElementById('lightbox-' + id);
  if (lightbox) lightbox.classList.remove('open');
  const card = document.getElementById('card-' + id);
  if (card) card.classList.remove('expanded');
}

// ── Full-screen image viewer ─────────────────────────────────
function openProdViewer(images, startIdx) {
  _prodViewerImages = images;
  _prodViewerIdx    = startIdx;
  const viewer = document.getElementById('prod-img-viewer');
  if (!viewer) return;
  _setProdViewerImg();
  viewer.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProdViewer() {
  const viewer = document.getElementById('prod-img-viewer');
  if (viewer) viewer.classList.remove('open');
  document.body.style.overflow = '';
}

function navProdViewer(dir) {
  _prodViewerIdx = (_prodViewerIdx + dir + _prodViewerImages.length) % _prodViewerImages.length;
  _setProdViewerImg();
}

function _setProdViewerImg() {
  const img = document.getElementById('prod-img-viewer-img');
  if (img) {
    img.style.opacity = '0';
    img.src = _prodViewerImages[_prodViewerIdx];
    img.onload = () => { img.style.transition = 'opacity 0.3s'; img.style.opacity = '1'; };
  }
}

// Close viewer on backdrop click
(function(){
  const v = document.getElementById('prod-img-viewer');
  if (v) v.addEventListener('click', e => { if (e.target === v) closeProdViewer(); });
})();

// Arrow key navigation for viewer
document.addEventListener('keydown', e => {
  const viewer = document.getElementById('prod-img-viewer');
  if (!viewer || !viewer.classList.contains('open')) return;
  if (e.key === 'ArrowRight') navProdViewer(1);
  if (e.key === 'ArrowLeft')  navProdViewer(-1);
  if (e.key === 'Escape')     closeProdViewer();
});
