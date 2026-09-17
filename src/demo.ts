import { LEVELS, Run, scoreRun } from './engine';
import type { Point } from './engine';
import { Painter } from './art';
import { Soundscape } from './audio';
const canvas = document.querySelector<HTMLCanvasElement>('#demo')!, c = canvas.getContext('2d')!, painter = new Painter(c), sound = new Soundscape(), cover = new Image();
cover.src = '/cover.png';
let start = 0, last = 0, index = -1, run: Run | null = null, score = 0, recording = false;
const duration = 106;
let recorder: MediaRecorder | null = null;
let chunks: Blob[] = [];
function text(s: string, x: number, y: number, size = 18, color = '#e9d6ac') { c.fillStyle = color; c.font = `${size >= 30 ? 'Georgia' : 'system-ui'} ${''}`; c.font = `${size}px ${size >= 30 ? 'Georgia' : 'system-ui'}`; c.fillText(s, x, y); }
function partial(path: Point[], ratio: number) { const steps = (path.length - 1) * Math.min(1, Math.max(0, ratio)), n = Math.floor(steps), arr = path.slice(0, n + 1).map(p => ({ ...p })); if (n < path.length - 1) {
    const a = path[n], b = path[n + 1], t = steps - n;
    if (!b.jump)
        arr.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
} return arr; }
function frame(now: number) { const dt = Math.min(.05, (now - last) / 1000); last = now; const t = recording ? (now - start) / 1000 : 0; c.fillStyle = '#102922'; c.fillRect(0, 0, 1280, 800); c.textAlign = 'left'; if (t < 8) {
    if (cover.complete)
        c.drawImage(cover, 0, 0, 1280, 800);
    c.fillStyle = '#08211dc0';
    c.fillRect(0, 0, 660, 800);
    text('VIGHNAHARTA', 70, 245, 53);
    text('PATH OF BEGINNINGS', 75, 290, 19);
    text('Draw the way. Bring the light.', 75, 365, 28);
    text('Six courtyards. One player-created rangoli.', 75, 410, 17);
    text('Mouse · Touch · Keyboard', 75, 475, 15);
    text('A Ganesh Chaturthi game', 75, 650, 14);
}
else if (t < 92) {
    const i = Math.min(5, Math.floor((t - 8) / 14)), local = (t - 8) % 14, l = LEVELS[i];
    if (i !== index) {
        index = i;
        run = null;
    }
    const path = partial(l.hint, local / 3.5);
    if (local >= 3.5 && !run)
        run = new Run(l, l.hint);
    if (run?.phase === 'moving') {
        run.step(dt);
        for (const e of run.events.splice(0)) {
            if (e.kind === 'offering') {
                painter.burst(e.point);
                sound.bell(4);
            }
            if (e.kind === 'node')
                sound.bell(7);
        }
        if ((run as Run).phase === 'won') {
            score += scoreRun(run, false, 3.5).score;
            sound.celebrate();
        }
    }
    c.save();
    c.translate(140, 115);
    painter.paint(l, path, run, t, dt, { hint: false, ghost: null, cursor: null, motion: true, plan: !run });
    c.restore();
    text(`0${i + 1} / 06   ·   ${l.act}`, 50, 35, 12);
    text(l.name, 50, 80, 31);
    c.textAlign = 'right';
    text(`Festival score  ${score.toLocaleString()}`, 1230, 52, 17);
    c.textAlign = 'left';
    text(l.tip, 140, 750, 15);
    if (run?.phase === 'won') {
        c.fillStyle = '#123027df';
        c.fillRect(425, 320, 430, 120);
        c.textAlign = 'center';
        text('PATH COMPLETE', 640, 360, 14);
        text('Your route joins the rangoli.', 640, 408, 26);
        c.textAlign = 'left';
    }
}
else {
    c.save();
    c.translate(140, 90);
    painter.rangoli(LEVELS.map(l => l.hint), t - 92, dt, true);
    c.restore();
    c.textAlign = 'center';
    text('गणपति बप्पा मोरया', 640, 60, 37);
    text('YOUR PATHS. ONE BEAUTIFUL BEGINNING.', 640, 735, 16);
    text(`Festival score ${score.toLocaleString()} · 18 stars · Play again`, 640, 770, 16);
    c.textAlign = 'left';
} text('Scripted gameplay demonstration · No leaderboard submission', 20, 792, 9, '#93a58b'); if (recording) {
    document.querySelector('#status')!.textContent = `Recording ${Math.min(duration, Math.floor(t))} / ${duration} seconds`;
    if (t >= duration) {
        recording = false;
        recorder?.stop();
        sound.intensity = 0;
    }
} requestAnimationFrame(frame); }
document.querySelector<HTMLButtonElement>('#record')!.onclick = () => { try {
    sound.start();
    sound.intensity = 1;
    const dest = sound.context!.createMediaStreamDestination();
    sound.master!.connect(dest);
    const stream = canvas.captureStream(30);
    for (const track of dest.stream.getAudioTracks())
        stream.addTrack(track);
    const mime = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m));
    if (!mime)
        throw Error('This browser does not support WebM recording.');
    chunks = [];
    recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4000000 });
    recorder.ondataavailable = e => { if (e.data.size)
        chunks.push(e.data); };
    recorder.onstop = async () => { const blob = new Blob(chunks, { type: mime }); const a = document.querySelector<HTMLAnchorElement>('#download')!; a.href = URL.createObjectURL(blob); a.hidden = false; document.querySelector('#status')!.textContent = `Demo ready · ${(blob.size / 1048576).toFixed(1)} MB · 106 seconds`; stream.getTracks().forEach(t => t.stop());
        try { const response = await fetch("/__save-demo", {method:"POST",headers:{"Content-Type":"video/webm"},body:blob}); if(response.ok) document.querySelector("#status")!.textContent += " · Saved to project folder"; } catch { /* The normal download remains available. */ }
    };
    start = performance.now();
    index = -1;
    score = 0;
    recording = true;
    recorder.start(1000);
    document.querySelector<HTMLButtonElement>('#record')!.disabled = true;
}
catch (e) {
    document.querySelector('#status')!.textContent = String(e);
} };
requestAnimationFrame(frame);
