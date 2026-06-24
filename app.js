/* ============================================================
   Stream Tools by Sosa — interactive board + settings + reel
   ============================================================ */
(() => {
  'use strict';

  const ASSET = {
    logos:        'assets/logos/nfl/',
    previews:     'assets/team_previews/',
    instrumentals:'assets/instrumentals/',
    x:            'assets/x.png',
    borders:      'assets/borders/',
  };

  /* ============================================================
     THEME PRESETS — mirrors server/themes.js from the overlay
     (Flowstate excluded per request). Royal Purple is the default.
     ============================================================ */
  const THEMES = {
    royal:    { label:'Royal Purple', accent:'#8b5cf6', accent2:'#a78bfa', bg:'#100a1a', bg2:'#0b0714', glow:'139,92,246' },
    midnight: { label:'Midnight',     accent:'#3b82f6', accent2:'#60a5fa', bg:'#0a0e1a', bg2:'#070a14', glow:'59,130,246' },
    ice:      { label:'Ice',          accent:'#22d3ee', accent2:'#67e8f9', bg:'#06121a', bg2:'#040d13', glow:'34,211,238' },
    emerald:  { label:'Emerald',      accent:'#10b981', accent2:'#34d399', bg:'#06120c', bg2:'#040d09', glow:'16,185,129' },
    sunset:   { label:'Sunset',       accent:'#f97316', accent2:'#fbbf24', bg:'#1a1006', bg2:'#130b04', glow:'249,115,22' },
    crimson:  { label:'Crimson',      accent:'#ef4444', accent2:'#f87171', bg:'#1a0606', bg2:'#130404', glow:'239,68,68'  },
    gold:     { label:'Gold Rush',    accent:'#eab308', accent2:'#fde047', bg:'#15110a', bg2:'#0f0c07', glow:'234,179,8'  },
    mono:     { label:'Monochrome',   accent:'#e5e5e5', accent2:'#ffffff', bg:'#0a0a0a', bg2:'#050505', glow:'160,160,160'},
  };
  const THEME_ORDER = ['royal','midnight','ice','emerald','sunset','crimson','gold','mono'];
  const DEFAULT_THEME = 'royal';
  const BORDER_COUNT  = 6;

  /* ---------- element refs ---------- */
  const board        = document.getElementById('board');
  const overlay      = document.getElementById('revealOverlay');
  const outerGlow    = document.getElementById('outerGlow');
  const previewVideo = document.getElementById('previewVideo');
  const ghostLogo    = document.getElementById('ghostLogo');
  const revealLogo   = document.getElementById('revealLogo');
  const marqueeField = document.getElementById('marqueeField');
  const whoosh       = document.getElementById('whoosh');
  const music        = document.getElementById('music');
  const themeGrid    = document.getElementById('themeGrid');
  const borderGrid   = document.getElementById('borderGrid');
  const timeRange    = document.getElementById('timeRange');
  const timeValue    = document.getElementById('timeValue');
  const resetBtn     = document.getElementById('resetBtn');

  /* ---------- state ---------- */
  let busy = false;
  let timers = [];
  let activeCell = null;
  let videoSeconds = parseFloat(timeRange.value);
  let currentBorder = 1;

  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  const later = (fn, ms) => { timers.push(setTimeout(fn, ms)); };

  /* ============================================================
     SETTINGS — themes
     ============================================================ */
  function applyTheme(key){
    const t = THEMES[key]; if (!t) return;
    const r = document.documentElement.style;
    // SOLID color for the border tint — a gradient does NOT fill through a mask
    r.setProperty('--border-tint',  t.accent);
    r.setProperty('--theme-accent', t.accent);
    // theme drives ONLY the board cell background, not the whole site
    r.setProperty('--bg-color', t.bg);
    [...themeGrid.children].forEach(d => d.classList.toggle('active', d.dataset.theme === key));
    try { localStorage.setItem('st_theme', key); } catch(e){}
  }
  THEME_ORDER.forEach(key => {
    const t = THEMES[key];
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'theme-dot';
    dot.dataset.theme = key;
    dot.title = t.label;
    dot.setAttribute('role','radio');
    dot.setAttribute('aria-label', t.label);
    dot.style.background = `linear-gradient(135deg, ${t.accent}, ${t.accent2})`;
    dot.addEventListener('click', () => applyTheme(key));
    themeGrid.appendChild(dot);
  });

  /* ============================================================
     SETTINGS — border style
     ============================================================ */
  function applyBorder(n){
    currentBorder = n;
    const url = `url('${ASSET.borders}border${n}.png')`;
    document.documentElement.style.setProperty('--border-img', url);
    [...borderGrid.children].forEach(b => b.classList.toggle('active', +b.dataset.border === n));
    try { localStorage.setItem('st_border', n); } catch(e){}
  }
  for (let i = 1; i <= BORDER_COUNT; i++){
    const sw = document.createElement('button');
    sw.type = 'button';
    sw.className = 'border-swatch';
    sw.dataset.border = i;
    sw.title = `Border ${i}`;
    sw.setAttribute('role','radio');
    sw.setAttribute('aria-label',`Border style ${i}`);
    sw.style.setProperty('--swatch-img', `url('${ASSET.borders}border${i}.png')`);
    sw.addEventListener('click', () => applyBorder(i));
    borderGrid.appendChild(sw);
  }

  /* ============================================================
     SETTINGS — video time slider
     ============================================================ */
  function updateRangeFill(){
    const min = +timeRange.min, max = +timeRange.max, v = +timeRange.value;
    const pct = ((v - min) / (max - min)) * 100;
    timeRange.style.setProperty('--fill', pct + '%');
  }
  timeRange.addEventListener('input', () => {
    videoSeconds = parseFloat(timeRange.value);
    timeValue.textContent = videoSeconds.toFixed(1) + 's';
    updateRangeFill();
    try { localStorage.setItem('st_time', String(videoSeconds)); } catch(e){}
  });

  /* ============================================================
     SETTINGS — reset
     ============================================================ */
  resetBtn.addEventListener('click', () => {
    if (busy){ clearTimers(); teardown(true, true); }
    document.querySelectorAll('.cell.sold').forEach(c => c.classList.remove('sold'));
  });

  /* ---------- restore saved settings ---------- */
  try {
    const sT = localStorage.getItem('st_theme');
    const sB = localStorage.getItem('st_border');
    const sV = localStorage.getItem('st_time');
    applyTheme(sT && THEMES[sT] ? sT : DEFAULT_THEME);
    applyBorder(sB ? +sB : 1);
    if (sV){ timeRange.value = sV; }
  } catch(e){
    applyTheme(DEFAULT_THEME); applyBorder(1);
  }
  videoSeconds = parseFloat(timeRange.value);
  timeValue.textContent = videoSeconds.toFixed(1) + 's';
  updateRangeFill();

  /* ============================================================
     BUILD THE 8x4 BOARD
     ============================================================ */
  NFL_TEAMS.forEach(team => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cell';
    cell.style.setProperty('--team', team.color);
    cell.setAttribute('aria-label', `${team.city} ${team.name}`);
    cell.dataset.id = team.id;

    const img = document.createElement('img');
    img.className = 'team-logo';
    img.alt = `${team.city} ${team.name}`;
    img.src = ASSET.logos + team.logo;
    img.onerror = () => {
      const fb = document.createElement('span');
      fb.className = 'team-fallback';
      fb.textContent = team.abbr;
      img.replaceWith(fb);
    };
    cell.appendChild(img);

    // pre-place the sold X overlay (hidden until .sold), matching the original
    const soldX = document.createElement('div');
    soldX.className = 'sold-x';
    const xImg = document.createElement('img');
    xImg.src = ASSET.x;
    xImg.alt = '';
    xImg.onerror = () => { xImg.style.display = 'none'; };
    soldX.appendChild(xImg);
    cell.appendChild(soldX);

    cell.addEventListener('click', () => {
      // ignore clicks while an animation is playing OR if already sold
      if (busy || cell.classList.contains('sold')) return;
      triggerReveal(team, cell);
    });
    board.appendChild(cell);
  });

  /* ============================================================
     REVEAL SEQUENCE — phased animation matching the overlay
     ============================================================ */
  function triggerReveal(team, cell){
    busy = true;
    activeCell = cell;

    // team color drives outer glow + spotlight + reveal logo glow
    overlay.style.setProperty('--team', team.color);
    outerGlow.style.setProperty('--team', team.color);

    // P0 — spotlight + outer team-color glow + whoosh.
    board.classList.add('spotlight');
    cell.classList.add('spotlit');
    outerGlow.classList.add('team-pulse');
    safePlay(whoosh, 0.455);

    // music starts 700ms after the whoosh, plays instantly (no fade-in)
    later(() => startMusic(), 700);

    // P1 — black backdrop snaps up + ghost slide + marquee
    later(() => {
      overlay.classList.add('active');
      ghostLogo.src = ASSET.logos + team.logo;
      ghostLogo.onerror = () => { ghostLogo.style.display = 'none'; };
      void ghostLogo.offsetWidth;
      ghostLogo.classList.add('slide');
      buildMarquee(team);
      marqueeField.classList.add('play');
      cell.classList.add('lifted');
    }, 350);

    // P2 — logo flies to center OVER BLACK (no video yet)
    later(() => {
      revealLogo.classList.remove('slide-off');
      revealLogo.src = ASSET.logos + team.logo;
      revealLogo.onerror = () => { revealLogo.style.display = 'none'; };
      void revealLogo.offsetWidth;
      revealLogo.classList.add('fly');
    }, 760);

    // ----- timeline anchors -----
    const flyDoneAt = 760 + 1050;                 // logo has landed (~1810ms)
    const blackHold = 1000;                        // ~1s black w/ logo+marquee only
    const videoInAt = flyDoneAt + blackHold;       // video begins fading in
    const total     = videoInAt + videoSeconds * 1000;

    // P3 — video fades in (black stays underneath; video rises over 0.6s)
    later(() => {
      previewVideo.src = ASSET.previews + team.video;
      previewVideo.currentTime = 0;
      safePlay(previewVideo);
      previewVideo.classList.add('show');
    }, videoInAt);

    // P4a — marquee fades 2.5s after video comes in
    later(() => marqueeField.classList.add('fade-out'), videoInAt + 2500);

    // P4b — logo slides off LEFT 3.5s after video comes in
    later(() => {
      revealLogo.classList.remove('fly');
      revealLogo.classList.add('slide-off');
    }, videoInAt + 3500);

    // P5 — teardown
    later(() => teardown(false), total);
  }

  /* build the diagonal scrolling team-name marquee (matches the original) */
  function buildMarquee(team){
    const inner = marqueeField.querySelector('.mfield-inner');
    inner.innerHTML = '';
    const teamText = `${team.city} ${team.name}`.toUpperCase();
    const rowCount = 7;
    for (let i = 0; i < rowCount; i++){
      const row = document.createElement('div');
      row.className = `mrow ${i % 2 === 0 ? 'dir-left' : 'dir-right'}`;
      row.style.top = `${(i / (rowCount - 1)) * 100}%`;

      const fontSize = 32 + (i % 3) * 10;
      const duration = 16 + (i % 4) * 5;
      const chunk = `${teamText}  •  `.repeat(8);

      const track = document.createElement('div');
      track.className = 'track';
      track.textContent = chunk + chunk;
      track.style.fontSize = `${fontSize}px`;
      track.style.letterSpacing = '8px';
      const accent = (team.accent && team.accent.toLowerCase() !== '#000000')
        ? team.accent : team.color;
      track.style.color = accent;
      track.style.opacity = '0.4';
      track.style.animationDuration = `${duration}s`;

      row.appendChild(track);
      inner.appendChild(row);
    }
  }

  function teardown(immediate, skipSold){
    overlay.classList.remove('active');
    previewVideo.classList.remove('show');
    revealLogo.classList.remove('fly','slide-off');
    ghostLogo.classList.remove('slide');
    ghostLogo.style.display = '';
    marqueeField.classList.remove('play','fade-out');
    outerGlow.classList.remove('team-pulse');

    const cellToMark = activeCell;

    const finish = () => {
      board.classList.remove('spotlight');
      document.querySelectorAll('.cell.spotlit,.cell.lifted')
        .forEach(c => c.classList.remove('spotlit','lifted'));
      try { previewVideo.pause(); previewVideo.removeAttribute('src'); previewVideo.load(); } catch(e){}
      fadeOutMusic();
      revealLogo.style.display = '';
      const inner = marqueeField.querySelector('.mfield-inner');
      if (inner) inner.innerHTML = '';

      // mark sold — the pre-built .sold-x becomes visible via CSS
      if (!skipSold && cellToMark){ cellToMark.classList.add('sold'); }

      busy = false;
      activeCell = null;
    };

    if (immediate) finish();
    else later(finish, 320);
  }

  /* ============================================================
     AUDIO — with retry/skip on 404 so missing instrumental
     filenames in teams.js don't silently fail the music
     ============================================================ */
  function safePlay(el, vol){
    if (vol != null) el.volume = vol;
    const p = el.play();
    if (p && p.catch) p.catch(() => {});
  }
  function startMusic(){
    if (!Array.isArray(INSTRUMENTALS) || !INSTRUMENTALS.length){
      console.warn('[Stream Tools] No instrumentals listed in teams.js');
      return;
    }
    tryPlayMusic([...INSTRUMENTALS].sort(() => Math.random() - 0.5), 0);
  }
  function tryPlayMusic(queue, depth){
    if (depth >= queue.length){
      console.warn('[Stream Tools] No instrumental could be loaded. Check that filenames in INSTRUMENTALS (teams.js) match files in assets/instrumentals/');
      return;
    }
    const pick = queue[depth];
    music.src = ASSET.instrumentals + pick;
    music.volume = 1.0;

    const onErr = () => {
      music.removeEventListener('error', onErr);
      music.removeEventListener('canplay', onOk);
      console.warn('[Stream Tools] Could not load instrumental:', pick, '— trying next.');
      tryPlayMusic(queue, depth + 1);
    };
    const onOk = () => {
      music.removeEventListener('error', onErr);
      music.removeEventListener('canplay', onOk);
      music.volume = 1.0;
      safePlay(music);
    };
    music.addEventListener('error',   onErr, { once:true });
    music.addEventListener('canplay', onOk,  { once:true });
    music.load();
  }
  function fadeOutMusic(){
    let v = music.volume;
    const ramp = setInterval(() => {
      v = Math.max(0, v - 0.08);
      music.volume = v;
      if (v <= 0){ clearInterval(ramp); try { music.pause(); } catch(e){} }
    }, 50);
  }

  /* ============================================================
     YOUTUBE CAROUSEL
     ============================================================ */
  const player = document.getElementById('reelPlayer');
  const dotsWrap = document.getElementById('reelDots');
  const prevBtn = document.getElementById('reelPrev');
  const nextBtn = document.getElementById('reelNext');

  function toId(url){
    if (!url) return null;
    const s = String(url).trim();
    if (/^[\w-]{11}$/.test(s)) return s;
    const m = s.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/);
    return m ? m[1] : null;
  }

  const ids = (typeof YOUTUBE_VIDEOS !== 'undefined' ? YOUTUBE_VIDEOS : [])
    .map(toId).filter(Boolean);
  let idx = 0;

  function loadVideo(i, autoplay){
    if (!ids.length) return;
    idx = (i + ids.length) % ids.length;
    const ap = autoplay ? '&autoplay=1' : '';
    player.src = `https://www.youtube-nocookie.com/embed/${ids[idx]}?rel=0&modestbranding=1${ap}`;
    [...dotsWrap.children].forEach((d, k) => d.classList.toggle('on', k === idx));
  }

  if (ids.length){
    ids.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('role','tab');
      dot.setAttribute('aria-label', `Video ${i+1}`);
      dot.addEventListener('click', () => loadVideo(i, true));
      dotsWrap.appendChild(dot);
    });
    prevBtn.addEventListener('click', () => loadVideo(idx - 1, true));
    nextBtn.addEventListener('click', () => loadVideo(idx + 1, true));
    loadVideo(0, false);
  } else {
    const screen = player.closest('.reel-screen');
    if (screen){
      screen.innerHTML =
        '<div style="position:absolute;inset:0;display:grid;place-items:center;'+
        'color:#645c80;font-family:\'Space Mono\',monospace;font-size:13px;'+
        'letter-spacing:1px;text-align:center;padding:20px;">'+
        'Drop YouTube links into YOUTUBE_VIDEOS in teams.js</div>';
    }
    prevBtn.disabled = nextBtn.disabled = true;
    prevBtn.style.opacity = nextBtn.style.opacity = '.35';
  }

  document.addEventListener('keydown', e => {
    if (!ids.length) return;
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowLeft')  loadVideo(idx - 1, true);
    if (e.key === 'ArrowRight') loadVideo(idx + 1, true);
  });
})();
