import './style.css';
import { LEVELS, START, END, Run, pathLength, distance, scoreRun, trialLevels, parseSave } from './engine';
import type { Point, Level, Save } from './engine';
import { Painter } from './art';
import { Soundscape } from './audio';
const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const icon = '<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 3C14 10 14 14 20 20C26 14 26 10 20 3ZM37 20C30 14 26 14 20 20C26 26 30 26 37 20ZM20 37C26 30 26 26 20 20C14 26 14 30 20 37ZM3 20C10 26 14 26 20 20C14 14 10 14 3 20Z" stroke="currentColor"/><circle cx="20" cy="20" r="5" stroke="currentColor"/><circle cx="20" cy="20" r="18" stroke="currentColor" opacity=".35"/></svg>';
$('app').innerHTML = `
<div id="home" class="home"><div class="home-shade"></div><header class="home-header"><div class="wordmark">${icon}<span>VIGHNAHARTA<small>PATH OF BEGINNINGS</small></span></div><span class="edition">A GANESH CHATURTHI ADVENTURE</span><button id="home-settings" class="glass">Settings</button></header><div class="hero-content"><div class="eyebrow">SIX PATHS. ONE BEAUTIFUL BEGINNING.</div><h1>Even the smallest<br>steps can bring<br><em>the light.</em></h1><p>Draw a path for Mushak. Gather the festival’s offerings.<br>Watch your journey become a living rangoli.</p><div class="hero-actions"><button class="gold" id="play">Begin the journey <span>→</span></button><button class="glass" id="continue" hidden>Continue</button></div><div class="home-links"><button id="sprint">◷ Festival sprint <small>90 seconds</small></button><button id="map">✧ Your journey</button><button id="help-home">How to play ↗</button></div></div><div class="home-footer"><span>DRAW · DISCOVER · CREATE</span><span>Original festival puzzle · Mouse, touch & keyboard</span><button id="about">The story & credits</button></div><div class="motes" aria-hidden="true">${Array.from({ length: 16 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div></div>
<div id="play-screen" hidden><header class="game-header"><button id="back" class="wordmark">${icon}<span>VIGHNAHARTA<small>PATH OF BEGINNINGS</small></span></button><div class="chapter-heading"><small id="act"></small><h2 id="level-name"></h2></div><div class="top-actions"><button id="fullscreen" aria-label="Toggle fullscreen">⛶</button><button id="settings" aria-label="Game settings">Settings</button><button id="help">?</button></div></header><main class="game-layout"><section class="board-column"><div class="hud"><div><small>OFFERINGS</small><b id="offer-count">0 / 4</b></div><div><small>LOTUS SEALS</small><b id="node-count">0 / 2</b></div><div class="energy"><div><small>PATH ENERGY</small><span id="energy-text"></span></div><div class="meter"><i id="meter-fill"></i></div></div><div><small id="clock-label">CHAPTER</small><b id="clock-value">01 / 06</b></div><div><small>SCORE</small><b id="score">0</b></div></div><div class="board-frame"><canvas id="canvas" width="1500" height="900" tabindex="0" aria-label="Mushak path drawing courtyard" aria-describedby="status"></canvas><div id="combo" aria-hidden="true"></div><div id="pause-banner" hidden>Journey paused</div></div><div class="game-toolbar"><p id="status" role="status" aria-live="polite"></p><div class="tools"><button id="undo" title="Undo last waypoint">↶ Undo</button><button id="clear">Clear</button><button id="hint" aria-pressed="false">✧ Guide</button><button id="pause" hidden>Pause</button><button id="retry">↻ Retry</button><button class="gold" id="go">Guide Mushak →</button></div></div></section><aside class="journal"><div class="eyebrow">THE FESTIVAL JOURNAL</div><h3 id="journal-title"></h3><p id="story"></p><div class="objective"><small>YOUR NEXT STEP</small><p id="tip"></p></div><div id="seal-progress" class="seal-progress"></div><div class="legend"><span><i class="legend-dot gold-dot"></i>Offerings build your combo</span><span><i class="legend-dot pink-dot"></i>Light every lotus seal</span><span><i class="legend-dot green-dot"></i>Durva shields one shadow</span></div><div class="journal-bottom"><small>YOUR ROUTES BECOME THE RANGOLI</small><div id="mini-rangoli"></div><button id="best-route" hidden>Show my best route</button></div></aside></main><div class="play-footer"><span>Drag & release to run · Tap to place waypoints · Enter to place keyboard points</span><span id="save-state">Saved on this device</span></div></div>
<div id="finale" hidden><div class="finale-top"><span class="eyebrow">EVERY SMALL STEP BELONGED</span><h2>गणपति बप्पा मोरया</h2><p>Six paths. Your very own festival rangoli.</p></div><canvas id="final-canvas" width="1500" height="900" aria-label="Rangoli created from your completed paths"></canvas><div class="finale-bottom"><div><small>FESTIVAL SCORE</small><b id="final-score"></b></div><div><small>STARS EARNED</small><b id="final-stars"></b></div><button id="save-art" class="glass">Save your rangoli ↓</button><button id="play-again" class="gold">A new beginning →</button></div></div>
<dialog id="dialog" aria-labelledby="dialog-title"><button id="dialog-close" class="dialog-close" aria-label="Close">×</button><div id="dialog-body"></div></dialog>`;
const canvas = $<HTMLCanvasElement>('canvas'), context = canvas.getContext('2d')!;
context.scale(1.5, 1.5);
const painter = new Painter(context);
const finalCanvas = $<HTMLCanvasElement>('final-canvas'), finalContext = finalCanvas.getContext('2d')!;
finalContext.scale(1.5, 1.5);
const finalPainter = new Painter(finalContext);
const audio = new Soundscape();
let saving = true;
let save: Save;
try {
    save = parseSave(localStorage.getItem('vighnaharta-festival-v1'));
}
catch {
    save = parseSave(null);
    saving = false;
}
if (matchMedia('(prefers-reduced-motion: reduce)').matches)
    save.motion = false;
let screen: 'home' | 'game' | 'finale' = 'home', mode: 'campaign' | 'sprint' = 'campaign', levelIndex = 0, activeLevels = LEVELS, path: Point[] = [{ ...START }], run: Run | null = null, hint = false, hinted = false, ghost = false, paused = false, drawing = false, pointerId: number | null = null, cursor: Point | null = null, planning = 0, clock = 0, last = 0, finalTime = 0, deadline = 0, sprintScore = 0, sprintIndex = 0, busy = false, dialogPause = false, trialSeed = 0, sprintEnded = false;
let earnedPaths: Point[][] = save.records.map(r => r?.path || []), victoryPaths: Point[][] = [];
const dialog = $<HTMLDialogElement>('dialog');
function current(): Level { return activeLevels[levelIndex]; }
function persist() { try {
    localStorage.setItem('vighnaharta-festival-v1', JSON.stringify(save));
}
catch {
    saving = false;
} $('save-state').textContent = saving ? 'Progress saved on this device' : 'Saving unavailable · progress stays in this session'; $('continue').hidden = !save.records.some(Boolean); document.body.classList.toggle('no-motion', !save.motion); audio.settings(save.sound, save.volume); }
function status(t: string) { $('status').textContent = t; }
function show(content: string, closable = true) { if (dialog.open)
    dialog.close(); dialogPause = screen === 'game' && run?.phase === 'moving' && !paused; if (dialogPause)
    paused = true; $('dialog-close').hidden = !closable; $('dialog-body').innerHTML = content; dialog.showModal(); refresh(); }
function dismiss() { dialog.close(); if (dialogPause) {
    paused = false;
    dialogPause = false;
} refresh(); }
$('dialog-close').onclick = dismiss;
dialog.addEventListener('cancel', e => { e.preventDefault(); e.stopPropagation(); if (!$('dialog-close').hidden)
    dismiss(); });
function home() { if (dialog.open)
    dismiss(); screen = 'home'; $('home').hidden = false; $('play-screen').hidden = true; $('finale').hidden = true; run = null; drawing = false; paused = false; audio.intensity = 0; persist(); }
function refresh() { const level = current(); const n = run?.collected.filter(Boolean).length || 0; const nodes = run?.nodes.filter(Boolean).length || 0; const moving = run?.phase === 'moving'; const plan = !run && !busy; const energy = Math.max(0, level.energy - pathLength(path)); $('act').textContent = mode === 'sprint' ? 'FESTIVAL SPRINT · DAILY ROUTES' : level.act; $('level-name').textContent = level.name; $('offer-count').textContent = `${n} / ${level.offerings.length}`; $('node-count').textContent = `${nodes} / ${level.nodes.length}`; $('energy-text').textContent = `${Math.round(energy)} / ${level.energy}`; $('meter-fill').style.width = energy / level.energy * 100 + '%'; $('meter-fill').classList.toggle('low', energy / level.energy < .2); $('clock-label').textContent = mode === 'sprint' ? 'TIME LEFT' : 'CHAPTER'; if (mode === 'campaign')
    $('clock-value').textContent = `0${levelIndex + 1} / 06`; $('score').textContent = ((mode === 'sprint' ? sprintScore : 0) + (run?.offeringScore || 0)).toLocaleString(); for (const id of ['undo', 'clear', 'hint'])
    $<HTMLButtonElement>(id).disabled = !plan; $<HTMLButtonElement>('undo').disabled = !plan || path.length < 2; $<HTMLButtonElement>('clear').disabled = !plan || path.length < 2; $<HTMLButtonElement>('go').disabled = !plan || path.length < 2; $('go').hidden = !!moving; $('pause').hidden = !moving; $('pause').textContent = paused ? 'Resume' : 'Pause'; $('pause-banner').hidden = !paused || dialog.open; $('hint').setAttribute('aria-pressed', String(hint)); $('journal-title').textContent = level.name; $('story').textContent = level.story; $('tip').textContent = level.tip; $('seal-progress').innerHTML = level.nodes.map((_, i) => `<span class="${run?.nodes[i] ? 'lit' : ''}">✿</span>`).join(''); $('mini-rangoli').innerHTML = Array.from({ length: 6 }, (_, i) => `<i class="${save.records[i] ? 'lit' : ''}" style="--n:${i}"></i>`).join(''); $('best-route').hidden = mode !== 'campaign' || !save.records[levelIndex]?.path?.length; $('best-route').textContent = ghost ? 'Hide my best route' : 'Show my best route'; }
function load(index: number) { if (dialog.open)
    dismiss(); levelIndex = index; screen = 'game'; run = null; path = [{ ...START }]; hint = false; hinted = false; ghost = false; busy = false; paused = false; planning = 0; pointerId = null; drawing = false; cursor = null; painter.sparks = []; painter.floaters = []; $('home').hidden = true; $('finale').hidden = true; $('play-screen').hidden = false; $('combo').textContent = ''; audio.intensity = 0; status(current().tip); refresh(); }
function begin(index = 0) { audio.start(); mode = 'campaign'; activeLevels = LEVELS; load(index); }
$('play').onclick = () => begin(0);
$('continue').onclick = () => begin(save.unlocked);
$('back').onclick = () => { show(`<div class="eyebrow">TAKE A BREATH</div><h2 id="dialog-title">Return to the beginning?</h2><p>Your completed chapters stay saved. This attempt will restart.</p><div class="dialog-actions"><button class="gold" id="leave">Return to title</button><button id="stay">Keep playing</button></div>`); $('leave').onclick = home; $('stay').onclick = dismiss; };
function map() { show(`<div class="eyebrow">YOUR FESTIVAL JOURNEY</div><h2 id="dialog-title">Every path leaves a little light.</h2><div class="chapter-grid">${LEVELS.map((l, i) => `<button class="chapter-card" data-chapter="${i}" ${i > save.unlocked ? 'disabled' : ''}><span class="chapter-index">0${i + 1}</span><small>${l.act}</small><b>${l.name}</b><span class="chapter-stars">${save.records[i] ? '★'.repeat(save.records[i]!.stars) + '☆'.repeat(3 - save.records[i]!.stars) : i > save.unlocked ? 'LOCKED' : 'BEGIN →'}</span></button>`).join('')}</div><p class="muted">${save.records.filter(Boolean).length} of 6 paths completed · ${save.records.reduce((s, r) => s + (r?.score || 0), 0).toLocaleString()} best festival points</p>${save.records.filter(Boolean).length === 6 ? '<button class="gold" id="see-finale">See my rangoli →</button>' : ''}`); document.querySelectorAll<HTMLButtonElement>('[data-chapter]').forEach(b => b.onclick = () => begin(Number(b.dataset.chapter))); if ($('see-finale'))
    $('see-finale').onclick = finale; }
$('map').onclick = map;
function help() { show(`<div class="eyebrow">ONE SMALL GESTURE</div><h2 id="dialog-title">Draw the way. Bring the light.</h2><div class="how-grid"><div><span>01</span><b>Draw & release</b><p>Drag from Mushak to the shrine. Releasing at the shrine starts your run. Or tap to place waypoints, then choose Guide Mushak.</p></div><div><span>02</span><b>Gather & discover</b><p>Collect offerings quickly for combos. Light every lotus seal. Amber switches open gates. Blue pools connect your path. Green durva protects against one moving shadow.</p></div><div><span>03</span><b>Create your rangoli</b><p>Six completed routes become one festival artwork. Shorter, quicker, unassisted routes earn more points and stars.</p></div></div><p class="muted">Keyboard: Tab to the board. Arrows move your pen, Shift + arrows for precision. Enter places a point. Space runs. Backspace undoes. Escape pauses. On touch screens, use a finger; landscape gives more space.</p><button class="gold" id="ready">Let’s begin →</button>`); $('ready').onclick = () => { dismiss(); if (screen === 'home')
    begin(); }; }
$('help').onclick = help;
$('help-home').onclick = help;
function settings() { show(`<div class="eyebrow">MAKE YOURSELF AT HOME</div><h2 id="dialog-title">A little room to breathe.</h2><div class="settings-row"><label for="audio-toggle">Music & sound</label><input type="checkbox" id="audio-toggle" ${save.sound ? 'checked' : ''}></div><div class="settings-row"><label for="volume">Volume</label><input id="volume" type="range" min="0" max="1" step=".05" value="${save.volume}"></div><div class="settings-row"><label for="motion-toggle">Ambient motion & particles</label><input type="checkbox" id="motion-toggle" ${save.motion ? 'checked' : ''}></div><p class="muted">Progress stays in this browser. No account or personal information needed. ${mode === 'sprint' && screen === 'game' ? 'The sprint clock continues while menus are open.' : ''}</p>`); $<HTMLInputElement>('audio-toggle').onchange = e => { save.sound = (e.target as HTMLInputElement).checked; audio.start(); persist(); }; $<HTMLInputElement>('volume').oninput = e => { save.volume = Number((e.target as HTMLInputElement).value); persist(); }; $<HTMLInputElement>('motion-toggle').onchange = e => { save.motion = (e.target as HTMLInputElement).checked; persist(); }; }
$('settings').onclick = settings;
$('home-settings').onclick = settings;
$('fullscreen').onclick = async () => { try {
    if (document.fullscreenElement)
        await document.exitFullscreen();
    else
        await document.documentElement.requestFullscreen();
}
catch {
    status('Fullscreen is unavailable in this browser. The game still works in the window.');
} };
$('about').onclick = () => show(`<div class="eyebrow">THE STORY BEHIND THE PATH</div><h2 id="dialog-title">A festival made by you.</h2><p>As Ganesh Chaturthi approaches, the courtyards wait for their lamps to be lit. Mushak carries the offerings, but you draw the way. Each journey becomes a strand of the final rangoli.</p><p>Inspired by Vighnaharta, the remover of obstacles, the game celebrates care, patience, and new beginnings. Ganesha’s shrine is a destination of respect.</p><p class="muted">Created for Raghava Charan’s game-design entry, with AI-assisted development. Original generated cover artwork; locally drawn game art; original synthesized music and effects. No downloaded songs, tracking, or player accounts. See ASSETS.md and the code guide in the source package.</p>`);
function startSprint() { audio.start(); const seed = Number(new Date().toISOString().slice(0, 10).replaceAll('-', '')); trialSeed = seed; mode = 'sprint'; activeLevels = trialLevels(seed); sprintScore = 0; sprintIndex = 0; sprintEnded = false; deadline = performance.now() + 90000; load(0); }
$('sprint').onclick = () => { show(`<div class="eyebrow">THE FESTIVAL SPRINT</div><h2 id="dialog-title">Three paths. Ninety seconds.</h2><p>Three daily routes, one shared clock. Finish as many as you can and beat your personal best. Mistakes cost time, never your completed round points.</p><div class="sprint-best"><small>YOUR PERSONAL BEST</small><b>${save.sprintBest.toLocaleString()}</b></div><p class="muted">Daily layouts vary by date. This is a local personal score, not an online leaderboard. The clock keeps running through pauses and menus.</p><button class="gold" id="start-sprint">Start the clock →</button>`); $('start-sprint').onclick = () => { dismiss(); startSprint(); }; };
function addPoint(p: Point) {
    if (run || busy || !Number.isFinite(p.x) || !Number.isFinite(p.y))
        return;
    p = { x: Math.max(22, Math.min(978, p.x)), y: Math.max(22, Math.min(578, p.y)) };
    const last = path[path.length - 1];
    const d = distance(last, p);
    if (d < 3)
        return;
    const remaining = current().energy - pathLength(path);
    if (remaining < 1) {
        status('Your path energy is full. Undo a point or clear to try a shorter route.');
        return;
    }
    if (d > remaining)
        p = { x: last.x + (p.x - last.x) * remaining / d, y: last.y + (p.y - last.y) * remaining / d };
    const entrance = current().portals[0], exit = current().portals[1];
    if (entrance && exit && !path.some(p => p.jump) && distance(p, entrance) < 27) {
        const required = distance(last, entrance);
        if (required <= remaining) {
            path.push({ ...entrance }, { ...exit, jump: true });
            drawing = false;
            status('The lotus gate connects your path. Continue drawing from the blue OUT pool.');
            painter.burst(exit, '#9ee9f5', 12);
            audio.bell(7);
            refresh();
            return;
        }
    }
    path.push(p);
    if (path.length > 2500)
        path.splice(path.length - 1, 1);
    refresh();
}
function undo() { if (run || busy)
    return; if (path.length > 1) {
    const p = path.pop();
    if (p?.jump && path.length > 1)
        path.pop();
} refresh(); }
$('undo').onclick = undo;
$('clear').onclick = () => { if (run || busy)
    return; path = [{ ...START }]; cursor = null; status(current().tip); refresh(); };
$('hint').onclick = () => { hint = !hint; if (hint)
    hinted = true; status(hint ? 'Follow the dotted guide. Assisted attempts earn up to two stars.' : current().tip); refresh(); };
$('best-route').onclick = () => { ghost = !ghost; if (ghost)
    hinted = true; refresh(); };
function startRun() { if (run || busy || path.length < 2)
    return; drawing = false; run = new Run(current(), path); paused = false; cursor = null; audio.start(); audio.intensity = 1; status('Mushak is following your path. Watch the lotus seals light up.'); refresh(); }
$('go').onclick = startRun;
$('pause').onclick = () => { paused = !paused; refresh(); };
$('retry').onclick = () => { const spent = planning; load(levelIndex); planning = spent; };
const getPoint = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * 1000, y: (e.clientY - r.top) / r.height * 600 }; };
canvas.addEventListener('pointerdown', e => { if (run || busy || dialog.open || pointerId !== null)
    return; audio.start(); canvas.focus({ preventScroll: true }); pointerId = e.pointerId; canvas.setPointerCapture(e.pointerId); const p = getPoint(e); if (path.length > 1 && distance(p, START) < 25)
    path = [{ ...START }]; drawing = true; cursor = null; if (distance(p, path[path.length - 1]) > 12)
    addPoint(p); e.preventDefault(); });
canvas.addEventListener('pointermove', e => { if (pointerId === e.pointerId && drawing)
    addPoint(getPoint(e)); });
canvas.addEventListener('pointerup', e => { if (pointerId !== e.pointerId)
    return; const wasDrawing = drawing; drawing = false; pointerId = null; if (canvas.hasPointerCapture(e.pointerId))
    canvas.releasePointerCapture(e.pointerId); if (wasDrawing && path.length > 1 && distance(path[path.length - 1], END) < 32)
    startRun(); });
canvas.addEventListener('pointercancel', () => { drawing = false; pointerId = null; });
canvas.addEventListener('lostpointercapture', () => { drawing = false; pointerId = null; });
canvas.addEventListener('keydown', e => { if (dialog.open || run || busy)
    return; if (e.key.startsWith('Arrow')) {
    e.preventDefault();
    cursor ??= { ...path[path.length - 1] };
    const s = e.shiftKey ? 5 : 20;
    cursor.x = Math.max(22, Math.min(978, cursor.x + (e.key === 'ArrowRight' ? s : e.key === 'ArrowLeft' ? -s : 0)));
    cursor.y = Math.max(22, Math.min(578, cursor.y + (e.key === 'ArrowDown' ? s : e.key === 'ArrowUp' ? -s : 0)));
}
else if (e.key === 'Enter') {
    e.preventDefault();
    if (cursor) {
        addPoint(cursor);
        if (path.at(-1)?.jump)
            cursor = { ...path.at(-1)! };
    }
}
else if (e.key === ' ') {
    e.preventDefault();
    startRun();
}
else if (e.key === 'Backspace') {
    e.preventDefault();
    undo();
} });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !dialog.open && run?.phase === 'moving') {
    paused = !paused;
    refresh();
} });
document.addEventListener('visibilitychange', () => { if (document.hidden && run?.phase === 'moving') {
    paused = true;
    status('Paused while you were away. Resume when ready.');
    refresh();
} });
function complete() {
    if (!run || busy)
        return;
    busy = true;
    audio.intensity = 0;
    const r = run;
    const result = scoreRun(r, hinted, planning);
    if (mode === 'sprint') {
        sprintScore += result.score;
        sprintIndex++;
        if (sprintIndex === 3) {
            sprintEnd(true);
            return;
        }
        show(`<div class="eyebrow">KEEP THE LIGHT MOVING</div><h2 id="dialog-title">Path ${sprintIndex} complete.</h2><div class="big-score">+${result.score.toLocaleString()}</div><p>${r.collected.filter(Boolean).length} offerings · ×${r.maxCombo} best combo</p><button class="gold" id="sprint-next">Next path →</button>`, false);
        $('sprint-next').onclick = () => load(levelIndex + 1);
        return;
    }
    const old = save.records[levelIndex];
    if (!old || result.score > old.score)
        save.records[levelIndex] = { score: result.score, stars: Math.max(old?.stars || 0, result.stars), path: path.map(p => ({ ...p })) };
    else
        old.stars = Math.max(old.stars, result.stars);
    save.unlocked = Math.max(save.unlocked, Math.min(5, levelIndex + 1));
    earnedPaths[levelIndex] = path.map(p => ({ ...p }));
    persist();
    audio.celebrate();
    show(`<div class="eyebrow">YOUR PATH JOINS THE RANGOLI</div><div class="result-stars">${'★'.repeat(result.stars)}<span>${'☆'.repeat(3 - result.stars)}</span></div><h2 id="dialog-title">A little more light.</h2><p>${current().name} is complete. Your route is now part of the festival.</p><div class="big-score">${result.score.toLocaleString()}<small>CHAPTER POINTS</small></div><div class="breakdown"><div><b>${r.collected.filter(Boolean).length}/${r.collected.length}</b><small>OFFERINGS</small></div><div><b>×${r.maxCombo}</b><small>BEST COMBO</small></div><div><b>+${result.efficiency}</b><small>PATH BONUS</small></div><div><b>+${result.timeBonus}</b><small>TIME BONUS</small></div></div><p class="muted">${hinted ? 'You used a guide. Try your own path for three stars.' : result.stars === 3 ? 'Every offering, every seal. A beautiful path of your own.' : 'Gather every offering without a guide for three stars.'}</p><div class="dialog-actions"><button class="gold" id="next">${levelIndex === 5 ? 'Reveal your rangoli' : 'Next courtyard'} →</button><button id="replay">Improve my path</button><button id="result-home">Title</button></div>`, false);
    $('next').onclick = () => { if (levelIndex === 5)
        finale();
    else
        load(levelIndex + 1); };
    $('replay').onclick = () => load(levelIndex);
    $('result-home').onclick = home;
}
function failed() { if (!run || busy)
    return; busy = true; audio.intensity = 0; audio.note(220, .4, 'sine', .12); show(`<div class="eyebrow">A FRESH PATH AWAITS</div><h2 id="dialog-title">Try a little differently.</h2><p>${run.reason}</p><div class="dialog-actions"><button class="gold" id="edit">Edit this path →</button><button id="fresh">Start fresh</button><button id="fail-home">Title</button></div>`, false); $('edit').onclick = () => { dismiss(); run = null; busy = false; paused = false; status('Your path is still here. Undo the last point or draw again from Mushak.'); refresh(); }; $('fresh').onclick = () => { const spent = planning; load(levelIndex); planning = spent; }; $('fail-home').onclick = home; }
function sprintEnd(finished: boolean) { sprintEnded = true; if (dialog.open)
    dismiss(); busy = true; run = null; save.sprintBest = Math.max(save.sprintBest, sprintScore); persist(); audio.celebrate(); show(`<div class="eyebrow">${finished ? 'FESTIVAL SPRINT COMPLETE' : 'THE FINAL BELL'}</div><h2 id="dialog-title">${finished ? 'Three paths. One bright finish.' : 'Every light counts.'}</h2><div class="big-score">${sprintScore.toLocaleString()}<small>VALID COMPLETED-ROUND POINTS</small></div><p>${sprintIndex}/3 paths completed · Personal best ${save.sprintBest.toLocaleString()}</p><p class="muted">Daily route seed ${trialSeed}. This score is stored only on your device.</p><div class="dialog-actions"><button class="gold" id="sprint-again">One more run →</button><button id="sprint-home">Return to title</button></div>`, false); $('sprint-again').onclick = () => { dismiss(); startSprint(); }; $('sprint-home').onclick = home; }
function finale() { if (dialog.open)
    dismiss(); screen = 'finale'; $('home').hidden = true; $('play-screen').hidden = true; $('finale').hidden = false; finalTime = 0; victoryPaths = LEVELS.map((_, i) => earnedPaths[i]?.length ? earnedPaths[i] : save.records[i]?.path || []); $('final-score').textContent = save.records.reduce((s, r) => s + (r?.score || 0), 0).toLocaleString(); $('final-stars').textContent = `${save.records.reduce((s, r) => s + (r?.stars || 0), 0)} / 18`; audio.celebrate(); audio.intensity = 1; }
$('play-again').onclick = home;
$('save-art').onclick = () => { const a = document.createElement('a'); a.download = 'My-Vighnaharta-Rangoli.png'; a.href = finalCanvas.toDataURL('image/png'); a.click(); };
function events() { if (!run)
    return; for (const e of run.events.splice(0)) {
    if (e.kind === 'offering') {
        painter.burst(e.point, e.value! > 200 ? '#ecae82' : '#f5d38b', save.motion ? 14 : 0);
        painter.float(e.point, '+' + e.value);
        audio.bell(Math.min(run.combo, 5) * 2);
        $('combo').textContent = run.combo > 1 ? `×${run.combo} OFFERING COMBO` : '';
        refresh();
    }
    else if (e.kind === 'node' || e.kind === 'switch') {
        painter.burst(e.point, '#edd3a4', save.motion ? 24 : 0);
        audio.bell(7);
        refresh();
    }
    else if (e.kind === 'portal') {
        painter.burst(e.point, '#8ce0ef', save.motion ? 30 : 0);
        audio.bell(12);
    }
    else if (e.kind === 'shield') {
        painter.burst(e.point, '#c3e5a0', save.motion ? 30 : 0);
        painter.float(e.point, 'Protected');
        audio.bell(4);
    }
    else if (e.kind === 'win')
        complete();
    else if (e.kind === 'fail')
        failed();
} }
function frame(now: number) { const dt = Math.min(.05, Math.max(0, (now - last) / 1000)); last = now; clock += dt; if (screen === 'game') {
    if (mode === 'sprint' && !sprintEnded) {
        const left = Math.max(0, deadline - now);
        $('clock-value').textContent = (left / 1000).toFixed(1) + 's';
        $('clock-value').classList.toggle('urgent', left < 15000);
        if (left <= 0)
            sprintEnd(false);
    }
    if (!run && !busy && !dialog.open)
        planning += dt;
    if (run?.phase === 'moving' && !paused && !dialog.open) {
        run.step(dt);
        events();
    }
    painter.paint(current(), path, run, clock, dt, { hint, ghost: ghost ? save.records[levelIndex]?.path || null : null, cursor, motion: save.motion, plan: !run && !busy });
}
else if (screen === 'finale') {
    finalTime += dt;
    finalPainter.rangoli(victoryPaths, finalTime, dt, save.motion);
} requestAnimationFrame(frame); }
persist();
refresh();
requestAnimationFrame(frame);
