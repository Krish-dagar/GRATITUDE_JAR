// ─── STATE ────────────────────────────────────────────────────────────────────
let notes = [];
try { notes = JSON.parse(localStorage.getItem('gj_notes')) || []; } catch(e) {}

let listOpen = false;

// ─── PARTICLES ────────────────────────────────────────────────────────────────
(function spawnParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = '0';
    p.style.width = p.style.height = (Math.random() * 4 + 2) + 'px';
    p.style.animationDuration = (Math.random() * 8 + 6) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.opacity = '0';
    container.appendChild(p);
  }
})();

// ─── CHAR COUNT ───────────────────────────────────────────────────────────────
function updateCharCount() {
  const v = document.getElementById('noteInput').value.length;
  document.getElementById('charCount').textContent = v;
}

// ─── ADD NOTE ─────────────────────────────────────────────────────────────────
function addNote() {
  const input = document.getElementById('noteInput');
  const text = input.value.trim();
  if (!text) { showToast('✦ Write something first!'); return; }

  notes.push({ text, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) });
  save();
  input.value = '';
  updateCharCount();
  updateBadge();
  renderList();
  showToast('✦ Added to your jar!');
  triggerParticleBurst();
  document.getElementById('notesBadge').classList.add('bump');
  setTimeout(() => document.getElementById('notesBadge').classList.remove('bump'), 400);
  if (notes.length >= 1) document.getElementById('jarNotes').style.opacity = '1';
}

// ─── SHOW RANDOM NOTE ─────────────────────────────────────────────────────────
function showRandomNote() {
  if (notes.length === 0) { showToast('Your jar is empty — add something!'); return; }
  const i = Math.floor(Math.random() * notes.length);
  const reveal = document.getElementById('noteReveal');
  const noteText = document.getElementById('noteText');
  noteText.style.opacity = '0';
  reveal.classList.add('visible');
  setTimeout(() => {
    noteText.textContent = '\u201c' + notes[i].text + '\u201d';
    noteText.style.transition = 'opacity 0.4s ease';
    noteText.style.opacity = '1';
  }, 200);
}

function closeReveal() {
  document.getElementById('noteReveal').classList.remove('visible');
}

// ─── TOGGLE LIST ──────────────────────────────────────────────────────────────
function toggleList() {
  listOpen = !listOpen;
  const list = document.getElementById('notesList');
  const btn = document.getElementById('toggleBtn');
  list.classList.toggle('open', listOpen);
  btn.textContent = listOpen ? 'Hide' : 'Show All';
}

// ─── RENDER LIST ──────────────────────────────────────────────────────────────
function renderList() {
  const list = document.getElementById('notesList');
  list.innerHTML = '';
  if (notes.length === 0) {
    list.innerHTML = '<li class="empty-jar">Your jar awaits its first grateful thought\u2026</li>';
    return;
  }
  [...notes].reverse().forEach((note, ri) => {
    const i = notes.length - 1 - ri;
    const li = document.createElement('li');
    li.className = 'note-item';
    li.style.animationDelay = (ri * 0.04) + 's';
    li.innerHTML = `
      <span class="note-item-text">${escHtml(note.text)}</span>
      <button class="note-item-delete" onclick="deleteNote(${i})" title="Remove">&#x2715;</button>
    `;
    list.appendChild(li);
  });
}

function deleteNote(i) {
  notes.splice(i, 1);
  save();
  updateBadge();
  renderList();
  showToast('Note removed');
  if (notes.length === 0) document.getElementById('jarNotes').style.opacity = '0';
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
function save() {
  try { localStorage.setItem('gj_notes', JSON.stringify(notes)); } catch(e) {}
}

function updateBadge() {
  const n = notes.length;
  document.getElementById('notesBadge').textContent = n + (n === 1 ? ' note' : ' notes');
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

function triggerParticleBurst() {
  const particles = document.querySelectorAll('.particle');
  particles.forEach(p => {
    p.style.animationDelay = (Math.random() * 0.5) + 's';
    p.style.left = (30 + Math.random() * 40) + '%';
  });
}

// ─── THEME SWITCHER ───────────────────────────────────────────────────────────
const themes = ['theme-gold','theme-rose','theme-sage','theme-ocean','theme-dusk','theme-slate'];

// [lidBase, lidTop, bodyFill, bodyStroke, note1, note2, note3, labelStroke, textFill, mutedText, lineStroke]
const jarPalettes = {
  'theme-gold':  ['#c8922a','#e8b84b','#fdf8f0','#e2d4b8','#f5e6c8','#e8d4a8','#f0d8b0','#e2d4b8','#6b5840','#a8916e','#e2d4b8'],
  'theme-rose':  ['#c0455a','#e07080','#fdf4f5','#eeccd2','#fadde2','#f5c8d0','#f8d4da','#eeccd2','#7a3040','#b07080','#eeccd2'],
  'theme-sage':  ['#3d8c5a','#5fb87a','#f3f8f4','#c4deca','#c8ecd4','#aad8bc','#b8e4c8','#c4deca','#3a6048','#78a888','#c4deca'],
  'theme-ocean': ['#1a6fa8','#3a9cd8','#f0f6fb','#b8d4e8','#c0dcf0','#a8cce4','#b0d4ec','#b8d4e8','#2a5070','#6090b0','#b8d4e8'],
  'theme-dusk':  ['#9b72e8','#c4a0ff','#1a1630','#2e2850','#2a1f4a','#3a2a60','#322055','#2e2850','#a898d0','#7060a0','#2e2850'],
  'theme-slate': ['#4a5a8a','#6a7ebc','#f2f4f7','#c8d0e0','#d0d8f0','#bec8e8','#c8d0ec','#c8d0e0','#3a4868','#7888aa','#c8d0e0'],
};

function paintJar(theme) {
  const p = jarPalettes[theme] || jarPalettes['theme-gold'];
  const set = (id, attr, val) => { const el = document.getElementById(id); if (el) el.setAttribute(attr, val); };
  set('jarLidBase', 'fill',   p[0]);
  set('jarLidTop',  'fill',   p[1]);
  set('jarBody',    'fill',   p[2]);
  set('jarBody',    'stroke', p[3]);
  set('jarNote1',   'fill',   p[4]);
  set('jarNote2',   'fill',   p[5]);
  set('jarNote3',   'fill',   p[6]);
  set('jarLabel',   'stroke', p[7]);
  set('jarText1',   'fill',   p[8]);
  set('jarLine',    'stroke', p[10]);
  set('jarText2',   'fill',   p[9]);
  const jarLabel = document.getElementById('jarLabel');
  if (jarLabel) jarLabel.setAttribute('fill', theme === 'theme-dusk' ? '#2a2050' : 'white');
}

function applyTheme(theme) {
  themes.forEach(t => document.body.classList.remove(t));
  document.body.classList.add(theme);
  document.querySelectorAll('.swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.theme === theme);
  });
  paintJar(theme);
  try { localStorage.setItem('gj_theme', theme); } catch(e) {}
}

document.querySelectorAll('.swatch').forEach(s => {
  s.addEventListener('click', () => applyTheme(s.dataset.theme));
});

// Restore saved theme
(function() {
  try {
    const saved = localStorage.getItem('gj_theme');
    if (saved && themes.includes(saved)) applyTheme(saved);
  } catch(e) {}
})();

// ─── INIT ─────────────────────────────────────────────────────────────────────
updateBadge();
renderList();
if (notes.length > 0) document.getElementById('jarNotes').style.opacity = '1';
paintJar('theme-gold');
