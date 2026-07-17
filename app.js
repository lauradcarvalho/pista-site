function renderEvents(filter='all'){
  const list = document.getElementById('event-list');
  if(!list) return;
  const filtered = filter==='all' ? events : events.filter(e=>e.type===filter);
  const countEl = document.getElementById('event-count');
  if(countEl) countEl.textContent = filtered.length + ' evento' + (filtered.length!==1?'s':'') + ' na agenda';
  if(filtered.length===0){
    list.innerHTML = '<div class="empty">Nenhum evento nessa categoria ainda. Sugira um pra gente incluir.</div>';
    return;
  }
  list.innerHTML = filtered.map(e => {
    const isDrift = e.type === 'drift';
    return `
    <div class="ev-row" data-type="${e.type}" data-id="${e.id}" onclick="openEventModal('${e.id}')">
      <div class="ev-main">
        <div class="ev-date">${e.day}<span class="m">${e.month}</span></div>
        <div class="ev-body">
          <div class="ev-name">${e.title}${e.confirmado ? '<span class="confirmed-text">CONFIRMADO</span>' : ''}</div>
          <div class="ev-local">${e.local}</div>
        </div>
        <div class="ev-presence">
          <span class="badge-outline ${isDrift ? 'drift' : 'arrancada'}">${isDrift ? '<span class="icon-diamond"></span>' : '<span class="icon-tree"><span></span><span></span><span></span></span>'}${isDrift ? 'DRIFT' : 'ARRANCADA'}</span>
          <button class="presence-link" onclick="event.stopPropagation(); window.open(FORM_LINKS.euVouCorrer, '_blank')">+ eu vou correr</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

// containerId: onde a lista de cards entra. limit: opcional, corta a lista (usado na prévia da home).
function renderPeople(containerId='people-list', countId='people-count', limit=null){
  const list = document.getElementById(containerId);
  if(!list) return;
  const shown = limit ? people.slice(0, limit) : people;
  const countEl = document.getElementById(countId);
  if(countEl) countEl.textContent = people.length + ' perfis';
  if(people.length === 0){
    list.innerHTML = '<div class="empty" style="grid-column:1/-1;width:100%;">Nenhuma pilota cadastrada ainda — seja a primeira a aparecer aqui.</div>';
    return;
  }
  list.innerHTML = shown.map(p => {
    const upcoming = eventsForPerson(p.id);
    const photoHtml = p.photo ? `<div class="pilot-photo"><img src="${p.photo}" alt="${p.name}"></div>` : '';
    return `
    <div class="pilot-card" onclick="openPersonModal('${p.id}')">
      ${photoHtml}
      <div class="pilot-info">
        <div class="pilot-name">${p.name}</div>
        <div class="pilot-team">${p.role}</div>
        <div class="pilot-cat">${p.cat}</div>
        ${upcoming.length ? `<div class="pilot-next">Corre em: ${upcoming.map(e=>e.day+'/'+e.month).join(', ')}</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

function wireFilters(){
  const filters = document.getElementById('filters');
  if(!filters) return;
  filters.addEventListener('click', (e) => {
    if(e.target.tagName !== 'BUTTON') return;
    document.querySelectorAll('#filters button').forEach(b=>b.classList.remove('active'));
    e.target.classList.add('active');
    renderEvents(e.target.dataset.filter);
  });
}

// ------------------------------------------------------------------
// MODAL DE DETALHES (evento ou pilota)
// ------------------------------------------------------------------
function ensureModal(){
  if(document.getElementById('modal-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'modal-overlay';
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-card" id="modal-card">
      <button class="modal-close" onclick="closeModal()" aria-label="Fechar">×</button>
      <div class="modal-body" id="modal-body"></div>
    </div>`;
  overlay.addEventListener('click', (e) => { if(e.target.id === 'modal-overlay') closeModal(); });
  document.body.appendChild(overlay);
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });
}

function closeModal(){
  const overlay = document.getElementById('modal-overlay');
  if(overlay) overlay.classList.remove('open');
}

function openEventModal(id){
  ensureModal();
  const e = events.find(ev => ev.id === id);
  if(!e) return;
  const isDrift = e.type === 'drift';
  const hasLineup = e.lineup && e.lineup.length > 0;
  const lineupHtml = hasLineup ? e.lineup.map(l => `
    <div class="lineup-cat">
      <div class="cat-name">${l.cat}</div>
      <div class="riders">${l.riders.map(rid => { const p = findPerson(rid); return p ? `<span class="rider-chip">${p.name}</span>` : ''; }).join('')}</div>
    </div>`).join('') : '<div class="source-note">Lineup ainda não divulgado.</div>';

  document.getElementById('modal-card').className = 'modal-card ' + e.type;
  document.getElementById('modal-body').innerHTML = `
    <div class="modal-eyebrow">${e.day} DE ${e.month} · ${e.local}</div>
    <div class="modal-title">${e.title}</div>
    <div class="modal-sub">${e.confirmado ? '<span class="confirmed-text" style="margin-left:0;">CONFIRMADO PELA ORGANIZAÇÃO</span>' : 'Data sujeita a confirmação'}</div>
    <div class="modal-row">
      <div class="modal-field">
        <div class="label">Categoria</div>
        <div class="value"><span class="badge-outline ${isDrift ? 'drift' : 'arrancada'}">${isDrift ? '<span class="icon-diamond"></span>' : '<span class="icon-tree"><span></span><span></span><span></span></span>'}${isDrift ? 'DRIFT' : 'ARRANCADA'}</span></div>
      </div>
      ${e.horario ? `<div class="modal-field"><div class="label">Horário</div><div class="value">${e.horario}</div></div>` : ''}
      ${e.fonte ? `<div class="modal-field"><div class="label">Fonte</div><div class="value">${e.fonte}</div></div>` : ''}
    </div>
    <div class="modal-lineup">
      <div class="modal-field"><div class="label" style="margin-bottom:10px;">Quem confirmou presença</div></div>
      ${lineupHtml}
    </div>
    <div class="modal-actions">
      <button class="btn-solid" style="border:none;" onclick="window.open(FORM_LINKS.euVouCorrer, '_blank')">+ Eu vou correr</button>
    </div>
  `;
  document.getElementById('modal-overlay').classList.add('open');
}

function openPersonModal(id){
  ensureModal();
  const p = findPerson(id);
  if(!p) return;
  const upcoming = eventsForPerson(p.id);

  document.getElementById('modal-card').className = 'modal-card';
  document.getElementById('modal-body').innerHTML = `
    ${p.photo ? `<div class="modal-photo"><img src="${p.photo}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;"></div>` : ''}
    <div class="modal-eyebrow">${p.role}</div>
    <div class="modal-title">${p.name}</div>
    <div class="modal-sub mono" style="color:var(--cyan);text-transform:uppercase;">${p.cat}</div>
    ${p.bio ? `<div class="modal-bio">${p.bio}</div>` : ''}
    <div class="modal-row" style="border-bottom:none;">
      ${p.instagram ? `<div class="modal-field"><div class="label">Instagram</div><div class="value">${p.instagram}</div></div>` : ''}
    </div>
    <div class="modal-field"><div class="label" style="margin-bottom:10px;">Próximos eventos</div></div>
    ${upcoming.length ? upcoming.map(e => `<div class="rider-chip" style="margin-bottom:6px;display:inline-block;">${e.day}/${e.month} — ${e.title}</div>`).join('') : '<div class="source-note">Nenhum evento confirmado no momento.</div>'}
  `;
  document.getElementById('modal-overlay').classList.add('open');
}
