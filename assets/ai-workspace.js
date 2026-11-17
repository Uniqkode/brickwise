import {createReview, reviewProgress, reportToMarkdown} from './review-state.js?v=6.2';

/* Prepared reviews stay local. Only the connected-service action sends input. */
const brand = window.BRAND;
if (brand?.ai) {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]));
  const arrow = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5"/></svg>';
  const check = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m4 10 4 4 8-8"/></svg>';
  const storageKey = 'b2b:' + brand.slug + ':analyses';
  const newId = () => brand.slug + '-' + (crypto.randomUUID?.() || Date.now() + '-' + Math.random().toString(36).slice(2));
  const reportText = report => reportToMarkdown(report, brand.name, brand.ai.scope);

  function readHistory() {
    try {
      const rows = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(rows) ? rows.filter(row => row && typeof row.id === 'string' && typeof row.title === 'string' &&
        Array.isArray(row.findings) && row.findings.length <= 20 && Array.isArray(row.sources) && row.sources.length <= 24 &&
        row.findings.every(finding => finding && ['title', 'source', 'quote', 'action'].every(key => typeof finding[key] === 'string')) &&
        row.sources.every(source => source && ['id', 'name', 'excerpt'].every(key => typeof source[key] === 'string'))).slice(0, 50) : [];
    } catch { return []; }
  }
  function download(text, filename) {
    const url = URL.createObjectURL(new Blob([text], {type:'text/markdown;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function renderHistory() {
    const target = $('[data-ai-history]');
    if (!target) return;
    const rows = readHistory();
    target.innerHTML = rows.length ? rows.map((row, index) => `<article class="ai-history-item"><div><h3>${esc(row.title)}</h3><p>${row.mode === 'live' ? 'Connected AI' : 'Prepared example'} · ${row.findings.length} finding${row.findings.length === 1 ? '' : 's'} · Queued for human review</p></div><button class="text-button" type="button" data-ai-history-export="${index}">Download report ${arrow}</button></article>`).join('') : '<p>Queue a review in the desk to keep its report here.</p>';
    $$('[data-ai-history-export]', target).forEach(button => button.addEventListener('click', () => {
      const report = rows[Number(button.dataset.aiHistoryExport)];
      if (report) download(reportText(report), brand.slug + '-analysis-' + report.id + '.md');
    }));
  }
  const slider = $('[data-workload-slider]');
  slider?.addEventListener('input', () => {
    const organizations = Number(slider.value), workload = brand.ai.workload;
    const volume = organizations * workload.units * workload.cycles * workload.items;
    $('#workload-organization-output').value = String(organizations);
    $('[data-workload-calculated]').textContent = volume.toLocaleString('en-NG') + ' ' + workload.unit;
    const tokens = $('[data-workload-tokens]');
    if (tokens) tokens.textContent = (volume * 500).toLocaleString('en-NG') + ' input tokens, assuming 500 per page';
  });

  $$('[data-ai-workbench]').forEach((root, deskIndex) => {
    const prefix = 'review-desk-' + deskIndex;
    const status = $('[data-ai-status]', root), output = $('[data-ai-output]', root);
    const drafts = new Map();
    let caseName = 'primary', current, requestVersion = 0, controller;
    const sample = name => name === 'alternate' ? {
      title:brand.ai.alternate.name, sources:[brand.ai.alternate.source], findings:[brand.ai.alternate.finding],
      summary:'The follow-up records a completed valve replacement. Check the service evidence and retain the responsible reviewer’s decision.'
    } : {title:brand.ai.outputTitle, sources:brand.ai.sources, findings:brand.ai.findings, summary:brand.ai.summary};
    const prepare = name => createReview(sample(name), newId());

    function updateProgress() {
      const progress = reviewProgress(current);
      root.classList.toggle('is-queued', current.accepted);
      $('[data-review-progress-label]', root).textContent = `${progress.checked} of ${progress.total} evidence checks`;
      const bar = $('[data-review-progress]', root);
      bar.setAttribute('aria-valuemax', progress.total); bar.setAttribute('aria-valuenow', progress.checked);
      $('[data-review-progress-fill]', root).style.transform = `scaleX(${progress.fraction})`;
      $('[data-review-state]', root).textContent = current.accepted ? 'Queued for review' : progress.canQueue ? 'Ready to queue' : 'Draft brief';
      $('[data-review-state]', root).dataset.state = current.accepted ? 'queued' : progress.canQueue ? 'ready' : 'draft';
      const accept = $('[data-ai-accept]', root);
      accept.disabled = !progress.canQueue;
      accept.innerHTML = current.accepted ? check + ' Queued for review' : 'Queue for human review ' + arrow;
      $('[data-finding-count]', root).textContent = `${progress.total} finding${progress.total === 1 ? '' : 's'}`;
      $$('[data-review-check]', root).forEach(input => {
        const finding = current.findings[Number(input.dataset.reviewCheck)];
        const visited = current.visited.includes(finding.source);
        input.disabled = current.accepted || !visited;
        input.checked = current.checked[Number(input.dataset.reviewCheck)] === true;
        input.closest('.desk-check').classList.toggle('is-checked', input.checked);
        input.closest('.desk-check').querySelector('span').textContent = input.checked ? 'Evidence checked' : visited ? 'Mark evidence as checked' : 'Open the source to check it';
      });
      $('[data-review-notes]', root).disabled = current.accepted;
      $('[data-note-count]', root).textContent = `${current.notes.length}/700`;
      $('[data-review-hint]', root).textContent = current.accepted ? 'Saved in this browser. Your team makes the final maintenance decision.' : progress.canQueue ? 'All sources checked. Your brief is ready for the responsible reviewer.' : 'Open each source, check the finding, then queue your brief.';
      const queued = [...drafts.values()].filter(draft => draft.accepted).length;
      $('[data-queue-count]', root).textContent = `${queued} of 2 cases queued`;
      $$('[data-case-button]', root).forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.caseButton === caseName && current.mode === 'sample'));
        const state = $('[data-case-state]', button);
        state.textContent = drafts.get(button.dataset.caseButton)?.accepted ? 'Queued' : button.dataset.caseButton === 'primary' ? 'Needs a closer look' : 'Follow-up ready';
        state.classList.toggle('is-done', !!drafts.get(button.dataset.caseButton)?.accepted);
      });
    }

    function showSource(id, quote = '') {
      const source = current.sources.find(item => item.id === id);
      if (!source) return;
      if (!current.visited.includes(id)) current.visited.push(id);
      $('[data-ai-filename]', root).textContent = source.name;
      const text = $('[data-ai-excerpt]', root), content = source.excerpt;
      const at = quote ? content.toLowerCase().indexOf(quote.toLowerCase()) : -1;
      text.innerHTML = at >= 0 ? esc(content.slice(0, at)) + '<mark>' + esc(content.slice(at, at + quote.length)) + '</mark>' + esc(content.slice(at + quote.length)) : esc(content);
      $('[data-evidence-panel]', root).setAttribute('aria-labelledby', prefix + '-source-' + id);
      $('.ai-source-document', root).classList.toggle('is-cited', !!quote);
      $$('[data-source]', root).forEach(button => {
        const active = button.dataset.source === id;
        button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1;
      });
      const photo = current.mode === 'sample' && id === 'S1';
      $('[data-sample-visual]', root).hidden = !photo;
      $('[data-note-visual]', root).hidden = photo || !!source.image;
      const userImage = $('[data-user-image]', root);
      userImage.hidden = !source.image;
      if (source.image) userImage.src = source.image; else userImage.removeAttribute('src');
      $('[data-source-heading]', root).textContent = id === 'S2' ? 'The technician’s field note' : id === 'S3' ? 'The follow-up service record' : 'Your source material';
      $('[data-note-quote]', root).textContent = source.excerpt;
      $('[data-note-reference]', root).textContent = source.kind;
      $('[data-source-id]', root).textContent = id;
      $$('[data-finding-index]', root).forEach(card => card.classList.toggle('is-source-active', !!quote && current.findings[Number(card.dataset.findingIndex)].source === id));
      $('[data-evidence-context]', root).textContent = current.mode === 'live' ? 'Entered evidence · verify every cited observation' : photo ? 'Illustrative image · the prepared observation is transcribed below' : 'Prepared source extract · read in context';
      $('[data-ai-zoom]', root).setAttribute('aria-pressed', 'false');
      $('[data-ai-zoom]', root).setAttribute('aria-label', 'Zoom into the sample image');
      $('[data-sample-visual]', root).classList.remove('is-zoomed');
      updateProgress();
    }

    function renderSources() {
      $('[data-ai-sources]', root).innerHTML = current.sources.map((source, index) => `<button type="button" role="tab" id="${prefix}-source-${esc(source.id)}" aria-controls="${prefix}-evidence" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-source="${esc(source.id)}"><span>${esc(source.id)}</span>${source.id === 'S1' && current.mode === 'sample' ? 'Photo observation' : esc(source.kind)}</button>`).join('');
      const buttons = $$('[data-source]', root);
      buttons.forEach((button, index) => {
        button.addEventListener('click', () => showSource(button.dataset.source));
        button.addEventListener('keydown', event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : buttons.length - 1)) % buttons.length;
          showSource(buttons[next].dataset.source); buttons[next].focus();
        });
      });
      $('[data-evidence-panel]', root).id = prefix + '-evidence';
    }

    function renderReport() {
      $('[data-ai-title]', root).textContent = current.title;
      $('[data-ai-mode]', root).textContent = current.mode === 'live' ? 'Connected analysis' : 'Prepared sample';
      $('[data-review-summary]', root).textContent = current.summary;
      $('[data-review-notes]', root).value = current.notes;
      output.innerHTML = current.findings.map((finding, index) => `<article class="desk-finding" data-finding-index="${index}"><div class="desk-finding-heading"><span class="desk-finding-number">${String(index + 1).padStart(2, '0')}</span><span class="desk-priority ${finding.level === 'Routine' ? 'is-routine' : ''}">${finding.level === 'Routine' ? 'Routine' : 'Needs review'}</span></div><h4>${esc(finding.title)}</h4><p>${esc(finding.action)}</p><button class="desk-citation" type="button" data-ai-citation="${index}" aria-label="Open source ${esc(finding.source)} for finding ${index + 1}"><span>${esc(finding.source)}</span>View the evidence ${arrow}</button><label class="desk-check"><input type="checkbox" data-review-check="${index}" aria-label="Evidence checked for finding ${index + 1}"><span>Open the source to check it</span></label></article>`).join('');
      $$('[data-ai-citation]', root).forEach(button => button.addEventListener('click', () => {
        const finding = current.findings[Number(button.dataset.aiCitation)];
        showSource(finding.source, finding.quote);
        status.textContent = `Source ${finding.source} opened. Read the highlighted observation before checking finding ${Number(button.dataset.aiCitation) + 1}.`;
      }));
      $$('[data-review-check]', root).forEach(input => input.addEventListener('change', () => {
        current.checked[Number(input.dataset.reviewCheck)] = input.checked; updateProgress();
      }));
      renderSources(); showSource(current.sources[0].id);
    }
    function chooseCase(name) {
      requestVersion++; controller?.abort(); caseName = name;
      if (!drafts.has(name)) drafts.set(name, prepare(name));
      current = drafts.get(name); renderReport();
      $('[data-ai-live-run]', root).disabled = false;
      status.textContent = current.accepted ? 'This prepared review is queued in this browser.' : 'Prepared brief ready. Follow a source to begin your evidence checks.';
    }
    $$('[data-case-button]', root).forEach(button => button.addEventListener('click', () => chooseCase(button.dataset.caseButton)));
    root.addEventListener('brickwise:open-source', event => { chooseCase('primary'); showSource(String(event.detail)); });
    $('[data-ai-run]', root).addEventListener('click', () => {
      requestVersion++; controller?.abort();
      current = {...current, id:newId(), accepted:false, checked:current.findings.map(() => false), visited:[]};
      if (current.mode === 'sample') drafts.set(caseName, current);
      renderReport(); $('[data-ai-live-run]', root).disabled = false;
      status.textContent = 'Started a fresh evidence check. Your reviewer note has been kept.';
    });
    $('[data-ai-pin]', root).addEventListener('click', () => {
      showSource('S1', current.findings.find(item => item.source === 'S1')?.quote);
      status.textContent = 'Drain connection selected. Check the prepared observation below the illustrative image.';
    });
    $('[data-ai-zoom]', root).addEventListener('click', event => {
      const button = event.currentTarget, zoomed = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(zoomed));
      button.setAttribute('aria-label', zoomed ? 'Reset sample image zoom' : 'Zoom into the sample image');
      $('[data-sample-visual]', root).classList.toggle('is-zoomed', zoomed);
    });
    $('[data-review-notes]', root).addEventListener('input', event => {
      current.notes = event.target.value.slice(0, 700);
      $('[data-note-count]', root).textContent = `${current.notes.length}/700`;
    });
    $('[data-ai-accept]', root).addEventListener('click', () => {
      if (!reviewProgress(current).canQueue) return;
      const retained = {...current, accepted:true, checked:[...current.checked], visited:[...current.visited], sources:current.sources.map(({image, ...source}) => source)};
      try { localStorage.setItem(storageKey, JSON.stringify([retained, ...readHistory()].slice(0, 50))); }
      catch { status.textContent = 'Browser storage is unavailable. Download this brief to keep a copy.'; return; }
      current.accepted = true; updateProgress(); renderHistory();
      status.textContent = 'Brief queued for human review in this browser, with your evidence checks and note.';
    });
    $('[data-ai-download]', root).addEventListener('click', () => {
      download(reportText(current), brand.slug + '-' + (current.mode === 'live' ? 'ai' : 'sample') + '-review.md');
      status.textContent = 'Review downloaded with its sources, evidence checks, note, and current status.';
    });

    const files = $('[data-ai-files]', root);
    files.addEventListener('change', () => {
      $('[data-ai-file-count]', root).textContent = files.files.length ? `${files.files.length} test image(s) selected. Sent only when you run the connected service.` : 'Up to 4 test images; 2 MB each.';
    });
    $('[data-ai-live-run]', root).addEventListener('click', async () => {
      const ownVersion = ++requestVersion;
      controller?.abort(); controller = new AbortController();
      const button = $('[data-ai-live-run]', root), endpoint = $('[data-ai-endpoint]', root).value.trim(), text = $('[data-ai-custom-text]', root).value.trim();
      try {
        const url = new URL(endpoint);
        if (url.search || url.hash || url.username || url.password || !['https:', 'http:'].includes(url.protocol) || (url.protocol === 'http:' && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) throw new Error('Use an HTTPS service base address without credentials, query parameters, or a fragment. Localhost is supported for development.');
        if (!text && files.files.length === 0) throw new Error('Add text or a test image for the connected service to analyze.');
        if (files.files.length > 4) throw new Error('Choose at most four test images.');
        button.disabled = true; status.textContent = 'Checking the configured service…';
        const origin = url.href.replace(/\/$/, '');
        const health = await fetch(origin + '/api/health', {signal:controller.signal}).then(response => response.json());
        if (ownVersion !== requestVersion) return;
        if (!health.configured) throw new Error('Configure the AI provider credentials and deployment on the server before running connected analysis.');
        const inputs = [];
        if (text) inputs.push({id:'S1', name:'User test material', kind:'text', text});
        for (const [index, file] of [...files.files].entries()) {
          if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) throw new Error('Use JPEG, PNG or WebP test images up to 2 MB each.');
          const image = await new Promise((resolve, reject) => {
            const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('The selected image could not be read.')); reader.readAsDataURL(file);
          });
          if (ownVersion !== requestVersion) return;
          inputs.push({id:'I' + (index + 1), name:file.name, kind:'image', image});
        }
        status.textContent = 'Sending the entered evidence to your configured AI service…';
        const headers = {'Content-Type':'application/json'}, token = $('[data-ai-service-token]', root).value.trim();
        if (token) headers.Authorization = 'Bearer ' + token;
        const response = await fetch(origin + '/api/analyze', {method:'POST', headers, body:JSON.stringify({brand:brand.slug, inputs}), signal:controller.signal});
        const data = await response.json();
        if (ownVersion !== requestVersion) return;
        if (!response.ok) throw new Error(data.error || 'The service could not complete this analysis.');
        const findings = data.report?.findings, ids = new Set(inputs.map(input => input.id));
        if (!Array.isArray(findings) || !findings.length || findings.length > 20 || findings.some(finding => !finding || !ids.has(finding.source) || ['title', 'quote', 'action'].some(key => typeof finding[key] !== 'string'))) throw new Error('The service returned no valid, source-linked findings to review.');
        current = createReview({title:String(data.report.title || brand.ai.outputTag), summary:String(data.report.summary || ''), findings,
          sources:inputs.map(input => ({id:input.id, name:input.name, kind:input.kind === 'image' ? 'Uploaded image' : 'Entered text', excerpt:input.text || 'Image supplied for this connected analysis.', image:input.image}))}, newId());
        current.mode = 'live'; renderReport();
        status.textContent = 'Connected analysis ready. Check the cited evidence before queueing your brief.';
      } catch (error) {
        if (ownVersion === requestVersion && error.name !== 'AbortError') status.textContent = error.message || 'The service is unavailable. Check its address and connection settings.';
      } finally { if (ownVersion === requestVersion) button.disabled = false; }
    });
    chooseCase('primary');
  });
  renderHistory();
}
