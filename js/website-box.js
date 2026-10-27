/**
 * Signature "Website in the Website" Interactive 3D Showcase Box Controller
 * Powers device switching, 3D tilt physics, live iframe reloading, fullscreen modal, and project switching.
 */

(function initWebsiteBox() {
  // Elements
  const showcaseWrapper = document.getElementById('showcase-viewport-wrapper');
  const browser3DBox = document.getElementById('browser-3d-box');
  const iframeContainer = document.getElementById('iframe-device-container');
  const liveIframe = document.getElementById('live-website-iframe');
  const loaderOverlay = document.getElementById('box-loader-overlay');
  const urlHostSpan = document.getElementById('url-host-display');
  const urlPathSpan = document.getElementById('url-path-display');
  const reloadBtn = document.getElementById('omnibar-reload-btn');
  const copyLinkBtn = document.getElementById('omnibar-copy-btn');
  const openExternalBtn = document.getElementById('omnibar-external-btn');
  const fullscreenBtn = document.getElementById('fullscreen-toggle-btn');
  const tiltToggleBtn = document.getElementById('tilt-toggle-btn');
  const deviceButtons = document.querySelectorAll('.device-btn');
  const projectPillButtons = document.querySelectorAll('.project-pill-btn');
  const reflectionGlare = document.querySelector('.browser-reflection-glare');
  const toastNotice = document.getElementById('toast-notice');

  // Fullscreen Modal Elements
  const fullscreenModal = document.getElementById('fullscreen-modal-backdrop');
  const modalIframe = document.getElementById('modal-live-iframe');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalUrlText = document.getElementById('modal-url-display');
  const modalExternalBtn = document.getElementById('modal-external-btn');

  // State
  let isTiltEnabled = true;
  let currentProjectUrl = 'https://shinde028shruti.github.io/shruti/';
  let isInteractingWithIframe = false;

  // Projects Registry
  const projectsData = {
    'italiano': {
      title: 'Italiano - Premium Restaurant & E-Commerce',
      url: 'https://shinde028shruti.github.io/shruti/',
      host: 'shinde028shruti.github.io',
      path: '/shruti/',
      type: 'Webflow / E-Commerce',
      description: 'High-end culinary digital experience with custom animations, intuitive menu CMS, and interactive checkout.'
    },
    'apex-saas': {
      title: 'Apex SaaS - Cloud Telemetry & DevOps Dashboard',
      url: 'https://shinde028shruti.github.io/shruti/', // Can fallback or show live site
      host: 'apex-cloud.platform.dev',
      path: '/dashboard/telemetry',
      type: 'Next.js / TypeScript',
      description: 'Enterprise analytics dashboard featuring real-time WebSockets, microservices visualizer, and custom metrics.'
    },
    'novapay': {
      title: 'NovaPay - Global FinTech Payment Processing Gateway',
      url: 'https://shinde028shruti.github.io/shruti/',
      host: 'novapay-checkout.io',
      path: '/v2/checkout-pipeline',
      type: 'Full-Stack / FinTech',
      description: 'High-speed payment checkout engine with multi-currency handling, fraud analytics, and PCI compliance.'
    },
    'luxeliving': {
      title: 'LuxeLiving - 3D Architectural Visualizer',
      url: 'https://shinde028shruti.github.io/shruti/',
      host: 'luxeliving-3d.web.app',
      path: '/interactive-model',
      type: 'Three.js / WebGL',
      description: 'Interactive 3D real estate walkthrough allowing clients to configure textures, lighting, and spatial layouts in real-time.'
    }
  };

  // 1. Toast Notification Helper
  function showToast(message) {
    if (!toastNotice) return;
    toastNotice.querySelector('.toast-message').textContent = message;
    toastNotice.classList.add('visible');
    setTimeout(() => {
      toastNotice.classList.remove('visible');
    }, 3200);
  }

  // 2. Load Website into Box
  function loadWebsite(url, host, path, showLoader = true) {
    if (!liveIframe) return;

    currentProjectUrl = url;

    if (showLoader && loaderOverlay) {
      loaderOverlay.classList.remove('hidden');
    }

    if (urlHostSpan) urlHostSpan.textContent = host;
    if (urlPathSpan) urlPathSpan.textContent = path;
    if (openExternalBtn) openExternalBtn.href = url;
    if (modalExternalBtn) modalExternalBtn.href = url;
    if (modalUrlText) modalUrlText.textContent = url;

    // Set iframe source
    liveIframe.src = url;

    // Hide loader once loaded
    liveIframe.onload = () => {
      setTimeout(() => {
        if (loaderOverlay) loaderOverlay.classList.add('hidden');
      }, 300);
    };

    // Fallback timeout in case iframe load event is suppressed
    setTimeout(() => {
      if (loaderOverlay) loaderOverlay.classList.add('hidden');
    }, 2500);
  }

  // 3. Project Selection Handling
  projectPillButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      projectPillButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const projectKey = btn.getAttribute('data-project');
      const project = projectsData[projectKey];
      if (project) {
        loadWebsite(project.url, project.host, project.path);
        showToast(`Loaded ${project.title} into the Live Box!`);
      }
    });
  });

  // Global Function for external triggers (like "Preview in Live Box" buttons in gallery)
  window.loadProjectInLiveBox = function(projectKey) {
    const project = projectsData[projectKey];
    if (project) {
      // Update pills
      projectPillButtons.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-project') === projectKey);
      });
      loadWebsite(project.url, project.host, project.path);

      // Smooth scroll up to the showcase box
      if (showcaseWrapper) {
        showcaseWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      showToast(`Switched Live Box to: ${project.title}`);
    }
  };

  // 4. Device Switcher (Desktop / Tablet / Mobile)
  deviceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      deviceButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.getAttribute('data-device'); // 'desktop', 'tablet', 'mobile'
      iframeContainer.className = `iframe-device-container mode-${mode}`;

      showToast(`Switched viewport to ${mode.toUpperCase()} mode`);
    });
  });

  // 5. Reload Website Button
  if (reloadBtn) {
    reloadBtn.addEventListener('click', () => {
      reloadBtn.style.transform = 'rotate(360deg)';
      reloadBtn.style.transition = 'transform 0.6s ease';
      setTimeout(() => {
        reloadBtn.style.transform = 'none';
        reloadBtn.style.transition = 'none';
      }, 600);

      if (loaderOverlay) loaderOverlay.classList.remove('hidden');
      liveIframe.src = currentProjectUrl;
      showToast('Reloading live website inside the box...');
    });
  }

  // 6. Copy Link to Clipboard
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(currentProjectUrl).then(() => {
        showToast('✓ Live URL copied to clipboard!');
      }).catch(() => {
        showToast('URL: ' + currentProjectUrl);
      });
    });
  }

  // 7. Fullscreen Modal Toggle
  if (fullscreenBtn && fullscreenModal) {
    fullscreenBtn.addEventListener('click', () => {
      modalIframe.src = currentProjectUrl;
      fullscreenModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      showToast('Entered Fullscreen Presentation Mode (Press ESC to exit)');
    });
  }

  if (modalCloseBtn && fullscreenModal) {
    modalCloseBtn.addEventListener('click', () => {
      fullscreenModal.classList.remove('active');
      modalIframe.src = 'about:blank';
      document.body.style.overflow = '';
    });
  }

  // Close modal on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fullscreenModal && fullscreenModal.classList.contains('active')) {
      fullscreenModal.classList.remove('active');
      modalIframe.src = 'about:blank';
      document.body.style.overflow = '';
    }
  });

  // 8. 3D Perspective Tilt Physics with Cursor Tracking
  if (showcaseWrapper && browser3DBox) {
    // Check if user is over the iframe to pause tilt for effortless scrolling
    liveIframe.addEventListener('mouseenter', () => {
      isInteractingWithIframe = true;
      browser3DBox.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      browser3DBox.style.transition = 'transform 0.4s ease-out';
    });

    liveIframe.addEventListener('mouseleave', () => {
      isInteractingWithIframe = false;
      browser3DBox.style.transition = 'none';
    });

    showcaseWrapper.addEventListener('mousemove', (e) => {
      if (!isTiltEnabled || isInteractingWithIframe || window.innerWidth < 1024) return;

      const rect = showcaseWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (subtle & elegant)
      const rotateX = ((y - centerY) / centerY) * -6.5; // Max 6.5 degrees tilt
      const rotateY = ((x - centerX) / centerX) * 6.5;

      browser3DBox.style.transform = `perspective(1400px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;

      // Dynamic light reflection glare
      if (reflectionGlare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        reflectionGlare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.12) 0%, transparent 60%)`;
      }
    });

    showcaseWrapper.addEventListener('mouseleave', () => {
      if (!isTiltEnabled) return;
      browser3DBox.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      browser3DBox.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (reflectionGlare) {
        reflectionGlare.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 60%)';
      }
      setTimeout(() => {
        browser3DBox.style.transition = '';
      }, 600);
    });
  }

  // 9. Tilt Physics Toggle
  if (tiltToggleBtn && browser3DBox) {
    tiltToggleBtn.addEventListener('click', () => {
      isTiltEnabled = !isTiltEnabled;
      tiltToggleBtn.classList.toggle('active', isTiltEnabled);

      if (!isTiltEnabled) {
        browser3DBox.style.transform = 'none';
        tiltToggleBtn.innerHTML = '<i data-lucide="box"></i> 3D Tilt: Off';
        showToast('3D Tilt Effect Disabled (Static Viewport)');
      } else {
        tiltToggleBtn.innerHTML = '<i data-lucide="rotate-3d"></i> 3D Tilt: On';
        showToast('3D Dynamic Tilt Enabled (Moves with Cursor)');
      }
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Initialize with Shruti's website
  loadWebsite(
    'https://shinde028shruti.github.io/shruti/',
    'shinde028shruti.github.io',
    '/shruti/',
    false
  );
})();
