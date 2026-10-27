/**
 * Interactive Client Project Cost & Timeline Estimator
 * Allows potential clients to configure their project and calculate scope, budget, and turnaround.
 */

(function initEstimator() {
  const choiceCards = document.querySelectorAll('.estimator-choice-card');
  const featureCheckboxes = document.querySelectorAll('.feature-addon-checkbox');
  const priceDisplay = document.getElementById('estimate-price-display');
  const timelineDisplay = document.getElementById('estimate-timeline-display');
  const applyEstimateBtn = document.getElementById('apply-estimate-to-form-btn');
  const contactForm = document.getElementById('project-contact-form');
  const projectTypeSelect = document.getElementById('form-project-type');
  const budgetSelect = document.getElementById('form-budget-range');
  const messageTextarea = document.getElementById('form-message');

  // Base State
  let selectedCategory = 'website'; // 'website', 'saas', 'ecommerce', '3dweb'
  let selectedScope = 'pro';       // 'mvp', 'pro', 'enterprise'
  let selectedSpeed = 'standard';  // 'standard', 'express'

  const pricingMatrix = {
    website: {
      mvp: { basePrice: 950, days: 10, label: 'Starter Website / Landing' },
      pro: { basePrice: 1950, days: 18, label: 'Professional Business Website' },
      enterprise: { basePrice: 3800, days: 28, label: 'Enterprise Multi-Section Web Platform' }
    },
    saas: {
      mvp: { basePrice: 2200, days: 18, label: 'SaaS MVP Prototype' },
      pro: { basePrice: 4200, days: 30, label: 'Full-Scale SaaS Web Application' },
      enterprise: { basePrice: 7500, days: 45, label: 'Enterprise Cloud Platform' }
    },
    ecommerce: {
      mvp: { basePrice: 1600, days: 14, label: 'Boutique Online Store' },
      pro: { basePrice: 2900, days: 24, label: 'High-Converting E-Commerce Engine' },
      enterprise: { basePrice: 5500, days: 38, label: 'Omnichannel Headless Commerce' }
    },
    '3dweb': {
      mvp: { basePrice: 1800, days: 14, label: '3D Interactive Landing Page' },
      pro: { basePrice: 3400, days: 25, label: '3D WebGL Product Visualizer' },
      enterprise: { basePrice: 6200, days: 40, label: 'Immersive 3D Spatial Experience' }
    }
  };

  const featureCosts = {
    cms: { price: 350, days: 3, name: 'CMS & Content Editor' },
    auth: { price: 450, days: 4, name: 'User Authentication & Roles' },
    payments: { price: 400, days: 3, name: 'Stripe / Multi-currency Payments' },
    threed: { price: 550, days: 5, name: '3D WebGL / Interactive Canvas' },
    i18n: { price: 300, days: 3, name: 'Multi-Language i18n' },
    api: { price: 450, days: 4, name: 'Third-Party API Integrations' }
  };

  function calculateEstimate() {
    const base = pricingMatrix[selectedCategory][selectedScope];
    let totalPrice = base.basePrice;
    let totalDays = base.days;
    let activeFeatures = [];

    featureCheckboxes.forEach(cb => {
      if (cb.checked) {
        const featureKey = cb.value;
        const feature = featureCosts[featureKey];
        if (feature) {
          totalPrice += feature.price;
          totalDays += feature.days;
          activeFeatures.push(feature.name);
        }
      }
    });

    if (selectedSpeed === 'express') {
      totalPrice = Math.round(totalPrice * 1.25);
      totalDays = Math.max(7, Math.round(totalDays * 0.65));
    }

    const weeks = Math.ceil(totalDays / 7);

    // Update UI
    if (priceDisplay) {
      priceDisplay.textContent = `$${totalPrice.toLocaleString()} - $${Math.round(totalPrice * 1.2).toLocaleString()}`;
    }
    if (timelineDisplay) {
      timelineDisplay.textContent = `${weeks} - ${weeks + 1} Weeks (${totalDays} Days)`;
    }

    return {
      category: selectedCategory,
      scope: selectedScope,
      speed: selectedSpeed,
      totalPrice: totalPrice,
      weeks: weeks,
      features: activeFeatures
    };
  }

  // Handle Radio/Choice Clicks
  choiceCards.forEach(card => {
    card.addEventListener('click', () => {
      const group = card.getAttribute('data-group');
      const value = card.getAttribute('data-value');

      document.querySelectorAll(`.estimator-choice-card[data-group="${group}"]`).forEach(c => {
        c.classList.remove('selected');
      });
      card.classList.add('selected');

      if (group === 'category') selectedCategory = value;
      if (group === 'scope') selectedScope = value;
      if (group === 'speed') selectedSpeed = value;

      calculateEstimate();
    });
  });

  // Handle Checkbox Changes
  featureCheckboxes.forEach(cb => {
    cb.addEventListener('change', calculateEstimate);
  });

  // Apply Estimate to Contact Form
  if (applyEstimateBtn && contactForm) {
    applyEstimateBtn.addEventListener('click', () => {
      const estimate = calculateEstimate();

      // Set category in form
      if (projectTypeSelect) {
        if (estimate.category === 'website') projectTypeSelect.value = 'website';
        else if (estimate.category === 'saas') projectTypeSelect.value = 'saas';
        else if (estimate.category === 'ecommerce') projectTypeSelect.value = 'ecommerce';
        else if (estimate.category === '3dweb') projectTypeSelect.value = '3dweb';
      }

      // Set budget range
      if (budgetSelect) {
        if (estimate.totalPrice < 2000) budgetSelect.value = '1k-3k';
        else if (estimate.totalPrice < 5000) budgetSelect.value = '3k-6k';
        else budgetSelect.value = '6k-plus';
      }

      // Pre-fill message
      if (messageTextarea) {
        messageTextarea.value = `Hi Shruti, I configured an estimate on your portfolio:
- Project Category: ${estimate.category.toUpperCase()} (${estimate.scope.toUpperCase()} Scope)
- Target Delivery: ~${estimate.weeks} Weeks (${estimate.speed} timeline)
- Desired Features: ${estimate.features.length ? estimate.features.join(', ') : 'Core essentials'}
- Estimated Budget Range: $${estimate.totalPrice} - $${Math.round(estimate.totalPrice * 1.2)}

Let's discuss our project goals and next steps!`;
      }

      // Smooth scroll to form
      contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      contactForm.style.boxShadow = '0 0 35px rgba(56, 189, 248, 0.4)';
      setTimeout(() => {
        contactForm.style.boxShadow = '';
      }, 2000);
    });
  }

  // Initial Calculation
  calculateEstimate();
})();
