/* Public business details. Missing values are not replaced with invented details. */
const base = document.body.dataset.base || './';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const text = value => typeof value === 'string' ? value.trim() : '';
const https = value => {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; }
  catch { return null; }
};
const emailAddress = value => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(text(value)) ? text(value) : null;
const appendText = (parent, tag, value, className = '') => {
  const node = document.createElement(tag); node.textContent = value;
  if (className) node.className = className;
  parent.append(node); return node;
};

try {
  const response = await fetch(base + 'company-profile.json?v=7.5');
  if (!response.ok) throw new Error('Business profile unavailable.');
  const profile = await response.json();
  const email = profile.emailEnabled === true ? emailAddress(profile.contactEmail) : null;
  const phone = text(profile.phone), dial = phone.replace(/[^\d+]/g, '');
  const hasPhone = /^\+?\d{7,15}$/.test(dial);
  const booking = https(profile.bookingUrl), workspace = https(profile.workspaceUrl);
  const mailto = email ? 'mailto:' + encodeURIComponent(email) : null;
  const contact = base + 'contact/';
  $$('[data-company-field]').forEach(node => {
    const value = node.dataset.companyField === 'contactEmail' ? email || '' : node.dataset.companyField === 'domain' && !profile.domainReady ? '' : text(profile[node.dataset.companyField]);
    node.textContent = value;
    const row = node.closest('[data-company-row]');
    if (row) row.hidden = !value;
  });
  $$('[data-company-details]').forEach(section => { section.hidden = !$$('[data-company-row]', section).some(row => !row.hidden); });
  $$('[data-company-email]').forEach(link => { link.hidden = !mailto; if (mailto) { link.href = mailto; link.textContent = email; } });
  $$('[data-company-phone]').forEach(link => {
    link.hidden = !hasPhone;
    if (hasPhone) { link.href = 'tel:' + dial; link.textContent = phone; }
  });
  $$('[data-company-call]').forEach(link => { link.hidden = !hasPhone; if (hasPhone) link.href = 'tel:' + dial; });
  $$('[data-booking-link]').forEach(link => { link.href = booking || contact; });
  $$('[data-workspace-link]').forEach(link => {
    link.href = workspace || contact; link.textContent = workspace ? 'Log in' : 'Request access';
  });
  $$('[data-signup-link]').forEach(link => { link.href = https(profile.signupUrl) || booking || contact; });
  const team = Array.isArray(profile.team) ? profile.team.filter(person => text(person.name) && text(person.role)) : [];
  $$('[data-team-list]').forEach(list => {
    list.replaceChildren();
    team.forEach(person => {
      const card = document.createElement('article'); card.className = 'bw-person-card';
      if (text(person.portrait) && !/^(?:[a-z]+:|\/)/i.test(person.portrait) && !person.portrait.includes('..')) {
        const image = document.createElement('img'); image.src = base + person.portrait; image.alt = person.name; image.loading = 'lazy'; card.append(image);
      } else {
        appendText(card, 'span', person.name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase(), 'bw-person-initials');
      }
      const body = document.createElement('div'); card.append(body);
      appendText(body, 'span', person.role, 'bw-eyebrow'); appendText(body, 'h3', person.name);
      if (text(person.bio)) appendText(body, 'p', person.bio);
      const url = https(person.profileUrl);
      if (url) { const link = appendText(body, 'a', 'Professional profile ↗', 'text-link'); link.href = url; link.rel = 'noopener'; link.target = '_blank'; }
      list.append(card);
    });
    list.closest('[data-team-section]').hidden = !team.length;
  });
  const pricing = profile.pricing || {}, plans = Array.isArray(pricing.plans) ? pricing.plans : [];
  let annual = false;
  const number = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
  const currency = /^[A-Z]{3}$/.test(pricing.currency || '') ? pricing.currency : null;
  const money = value => {
    try { return new Intl.NumberFormat('en-NG', {style:'currency', currency, minimumFractionDigits:Number.isInteger(value) ? 0 : 2, maximumFractionDigits:2}).format(value); }
    catch { return String(value); }
  };
  function renderPrices() {
    $$('[data-plan-id]').forEach(card => {
      const plan = plans.find(item => item.id === card.dataset.planId);
      if (!plan) { card.hidden = true; return; }
      $('[data-plan-name]', card).textContent = text(plan.name);
      const amount = annual ? plan.annualPrice : plan.monthlyPrice;
      $('[data-plan-price]', card).textContent = currency && number(amount) ? money(amount) : text(plan.priceLabel) || 'Let’s talk';
      $('[data-plan-period]', card).textContent = currency && number(amount) ? (plan.billingUnit ? 'per ' + plan.billingUnit + ' / ' : '/ ') + (annual ? 'year' : 'month') : 'A plan shaped around your team';
      const features = [...(Array.isArray(plan.features) ? plan.features.filter(item => typeof item === 'string' && item.trim()) : [])];
      if (number(plan.buildings)) features.push(plan.buildings + ' buildings');
      if (number(plan.imagesPerMonth)) features.push(plan.imagesPerMonth.toLocaleString('en-NG') + ' inspection images per month');
      if (number(plan.users)) features.push(plan.users + ' team members');
      if (text(plan.overage)) features.push(plan.overage);
      const list = $('[data-plan-features]', card); list.replaceChildren();
      (features.length ? features : ['Discuss your inspection volume', 'Agree workspace and team access', 'Choose your integration requirements']).forEach(feature => appendText(list, 'li', feature));
    });
    $$('[data-price-billing]').forEach(button => { const active = button.dataset.priceBilling === (annual ? 'annual' : 'monthly'); button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  }
  $$('[data-billing-options]').forEach(group => { group.hidden = !plans.some(plan => number(plan.annualPrice)); });
  $$('[data-price-billing]').forEach(button => button.addEventListener('click', () => { annual = button.dataset.priceBilling === 'annual'; renderPrices(); }));
  $$('[data-pricing-note]').forEach(node => { node.textContent = text(pricing.taxNote); node.hidden = !node.textContent; });
  renderPrices();
  const usage = profile.usage || {};
  const metrics = [[usage.activeOrganizations, 'Organizations'], [usage.buildings, 'Buildings'], [usage.processedCount, text(usage.processedUnit) || 'Inspection records']].filter(([value]) => number(value));
  $$('[data-usage-section]').forEach(section => {
    section.hidden = !metrics.length || !text(usage.reportingDate);
    const list = $('[data-usage-list]', section); list.replaceChildren();
    metrics.forEach(([value, label]) => { const item = document.createElement('div'); appendText(item, 'strong', value.toLocaleString('en-NG')); appendText(item, 'span', label); list.append(item); });
    $('[data-usage-date]', section).textContent = text(usage.reportingDate);
  });
  const form = $('#contact-enquiry-form');
  if (form) {
    const url = https(profile.contactFormEndpoint);
    const endpoint = /^https:\/\/formspree\.io\/f\/[a-z0-9]+$/i.test(url || '') ? url : null;
    const button = $('[data-contact-submit]', form);
    button.disabled = !endpoint;
    $('[data-contact-status]', form).hidden = !!endpoint;
    if (endpoint) form.action = endpoint;
    form.addEventListener('submit', event => {
      if (!endpoint) event.preventDefault();
    });
  }
} catch (error) { console.error('Brickwise business profile:', error.message); }
