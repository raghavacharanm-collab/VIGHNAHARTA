import { END, hazardAt } from './engine';
import type { Point, Level, Run } from './engine';
const courtyard = new Image();
courtyard.src = new URL('../public/courtyard.png', import.meta.url).href;
const GOLD = '#e8bc72', CREAM = '#fff0d2';
function ellipse(c: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, color: string, rotation = 0) { c.fillStyle = color; c.beginPath(); c.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2); c.fill(); }
function line(c: CanvasRenderingContext2D, points: Point[], color: string, width: number) { if (!points.length)
    return; c.beginPath(); c.moveTo(points[0].x, points[0].y); for (const p of points.slice(1))
    c.lineTo(p.x, p.y); c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(); }
function label(c: CanvasRenderingContext2D, text: string, x: number, y: number, color = '#a6b5aa', size = 11) { c.font = `500 ${size}px system-ui`; c.textAlign = 'center'; c.fillStyle = color; c.fillText(text, x, y); }
export function mandala(c: CanvasRenderingContext2D, x: number, y: number, r: number, petals = 12, alpha = 1) { c.save(); c.translate(x, y); c.globalAlpha = alpha; for (let i = 0; i < petals; i++) {
    c.save();
    c.rotate(i * Math.PI * 2 / petals);
    c.strokeStyle = GOLD;
    c.lineWidth = 1;
    c.beginPath();
    c.ellipse(0, -r * .52, r * .15, r * .42, 0, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.ellipse(0, -r * .60, r * .07, r * .28, 0, 0, Math.PI * 2);
    c.stroke();
    ellipse(c, 0, -r * .99, 2.5, 2.5, GOLD);
    c.restore();
} for (const v of [.19, .28, .87, 1.1]) {
    c.beginPath();
    c.arc(0, 0, r * v, 0, Math.PI * 2);
    c.strokeStyle = GOLD;
    c.stroke();
} c.restore(); }
function diya(c: CanvasRenderingContext2D, x: number, y: number, time: number) { const g = c.createRadialGradient(x, y - 8, 0, x, y - 8, 35); g.addColorStop(0, '#efbc5b35'); g.addColorStop(1, '#efbc5b00'); c.fillStyle = g; c.fillRect(x - 35, y - 43, 70, 70); ellipse(c, x, y, 9, 4, '#c28345'); ellipse(c, x, y - 7, 3, 6 + Math.sin(time * 3 + x), '#ffe1a0'); ellipse(c, x, y - 5, 1.4, 3, '#fffbea'); }
function shrine(c: CanvasRenderingContext2D, t: number) {
    c.save();
    c.translate(END.x, END.y);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, 90);
    g.addColorStop(0, '#cda86425');
    g.addColorStop(1, '#cda86400');
    c.fillStyle = g;
    c.fillRect(-100, -110, 200, 220);
    mandala(c, 0, 0, 57, 12, .22);
    c.fillStyle = '#766044';
    c.fillRect(-39, 32, 78, 7);
    c.fillStyle = '#a88855';
    c.fillRect(-33, 26, 66, 6);
    c.fillStyle = '#806541';
    c.fillRect(-29, -28, 8, 53);
    c.fillRect(21, -28, 8, 53);
    c.fillStyle = '#c2a069';
    c.beginPath();
    c.moveTo(-41, -28);
    c.lineTo(0, -75);
    c.lineTo(41, -28);
    c.closePath();
    c.fill();
    c.strokeStyle = '#f1d291';
    c.lineWidth = 2;
    c.stroke();
    c.fillStyle = '#5c5140';
    c.beginPath();
    c.moveTo(-29, -30);
    c.lineTo(0, -62);
    c.lineTo(29, -30);
    c.fill();
    ellipse(c, 0, -77, 3, 6, GOLD);
    // Small, respectful elephant-headed silhouette inside the shrine.
    ellipse(c, 0, 7, 11, 15, GOLD);
    ellipse(c, 0, -12, 10, 12, GOLD);
    ellipse(c, -11, -10, 7, 10, '#c39b61');
    ellipse(c, 11, -10, 7, 10, '#c39b61');
    c.strokeStyle = GOLD;
    c.lineWidth = 6;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(2, -5);
    c.bezierCurveTo(12, 13, 3, 18, -2, 11);
    c.stroke();
    ellipse(c, -14, 21, 11, 4, GOLD);
    ellipse(c, 14, 21, 11, 4, GOLD);
    diya(c, -43, 31, t);
    diya(c, 43, 31, t);
    label(c, 'THE SHRINE', 0, 65, '#dfc38d', 10);
    c.restore();
}
function mouse(c: CanvasRenderingContext2D, p: Point, angle: number, t: number, moving: boolean) { c.save(); c.translate(p.x, p.y); ellipse(c, 0, 8, 20, 9, '#00000035'); c.rotate(angle); c.strokeStyle = '#c8a8a1'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(-13, 2); c.bezierCurveTo(-38, 17, -39, -14, -28, -10); c.stroke(); ellipse(c, -3, 0, 16, 11, '#b9b9af'); ellipse(c, 3, 1, 12, 8, '#dfded1'); ellipse(c, 11, -7, 7, 8, '#ccc8bd'); ellipse(c, 11, -7, 4, 5, '#c3958c'); ellipse(c, 16, 0, 10, 7, '#e0ded1'); ellipse(c, 23, 1, 2.2, 2, '#ce9b8a'); ellipse(c, 16, -3, 1.8, 2, '#192323'); ellipse(c, 16.5, -3.6, .6, .7, 'white'); const foot = moving ? Math.sin(t * 18) * 3 : 0; ellipse(c, -6, 9 + foot, 4, 2, '#d4b4a4'); ellipse(c, 8, 8 - foot, 4, 2, '#d4b4a4'); c.strokeStyle = '#dfaf58'; c.lineWidth = 3; c.beginPath(); c.moveTo(4, -9); c.lineTo(2, 9); c.stroke(); c.restore(); }
export type Spark = Point & {
    vx: number;
    vy: number;
    life: number;
    max: number;
    color: string;
    size: number;
};
export class Painter {
    c: CanvasRenderingContext2D;
    sparks: Spark[] = [];
    floaters: {
        p: Point;
        text: string;
        life: number;
    }[] = [];
    bg: HTMLCanvasElement | null = null;
    bgTheme = -1;
    constructor(c: CanvasRenderingContext2D) { this.c = c; }
    burst(p: Point, color = GOLD, count = 15) { for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2, s = 25 + Math.random() * 80;
        this.sparks.push({ ...p, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: .6 + Math.random() * .5, max: 1, color, size: 1 + Math.random() * 3 });
    } if (this.sparks.length > 400)
        this.sparks.splice(0, this.sparks.length - 400); }
    float(p: Point, text: string) { this.floaters.push({ p: { ...p }, text, life: 1.3 }); }
    environment(theme: number) {
        if (this.bgTheme === theme && this.bg)
            return;
        this.bgTheme = theme;
        this.bg = document.createElement('canvas');
        this.bg.width = 1500;
        this.bg.height = 900;
        const c = this.bg.getContext('2d')!;
        c.scale(1.5, 1.5);
        const palettes = [['#123c31', '#112c29', '#87955d'], ['#102e3b', '#122631', '#648f99'], ['#392f36', '#222632', '#ac8b69']];
        const colors = palettes[theme];
        const g = c.createRadialGradient(510, 290, 80, 500, 300, 650);
        g.addColorStop(0, colors[0]);
        g.addColorStop(1, colors[1]);
        c.fillStyle = g;
        c.fillRect(0, 0, 1000, 600);
        c.strokeStyle = '#d1c18d0c';
        c.lineWidth = 1;
        for (let x = -600; x < 1000; x += 65) {
            line(c, [{ x, y: 0 }, { x: x + 600, y: 600 }], '#d1c18d0c', 1);
            line(c, [{ x: x + 600, y: 0 }, { x, y: 600 }], '#d1c18d0c', 1);
        }
        c.strokeStyle = '#c9ad642c';
        c.strokeRect(13, 13, 974, 574);
        c.strokeStyle = '#c9ad6415';
        c.strokeRect(20, 20, 960, 560);
        for (const [x, y] of [[50, 50], [950, 50], [50, 550], [950, 550]]) {
            ellipse(c, x, y, 85, 52, '#071d2144');
            for (let i = 0; i < 8; i++) {
                const a = i * 2.4, rx = x + Math.cos(a) * 40, ry = y + Math.sin(a) * 23;
                ellipse(c, rx, ry, 17, 7, colors[2] + '26', a);
            }
            mandala(c, x, y, 26, 8, .3);
        }
        for (let i = 0; i < 110; i++) {
            const x = (i * 137.13 + 41) % 1000, y = (i * 193.77 + 21) % 600;
            ellipse(c, x, y, .6 + (i % 3) * .25, .7, '#c7d4b212');
        }
        for (let x = 80; x < 980; x += 70) {
            c.strokeStyle = '#93875c40';
            c.beginPath();
            c.moveTo(x - 35, 0);
            c.quadraticCurveTo(x, 32, x + 35, 0);
            c.stroke();
            for (let j = -2; j <= 2; j++)
                ellipse(c, x + j * 9, 13 - Math.abs(j) * 2, 3.5, 5, j % 2 ? '#d9a04466' : '#ce733866');
        }
    }
    paint(level: Level, path: Point[], run: Run | null, time: number, dt: number, opts: {
        hint: boolean;
        ghost: Point[] | null;
        cursor: Point | null;
        motion: boolean;
        plan: boolean;
    }) {
        const c = this.c, t = opts.motion ? time : 0;
        this.environment(level.theme);
        c.clearRect(0, 0, 1000, 600);
        if (this.bg)
            c.drawImage(this.bg, 0, 0, 1000, 600);
        if (courtyard.complete && courtyard.naturalWidth) {
            c.drawImage(courtyard, -45, -30, 1090, 660);
            c.fillStyle = ['#0c251b20', '#0b27484a', '#391c3540'][level.theme];
            c.fillRect(0, 0, 1000, 600);
        }
        for (let i = 0; i < 15; i++) {
            const x = (i * 163 + 37) % 960 + 20, y = (i * 113 + 23) % 540 + 30;
            ellipse(c, x + Math.sin(t * .4 + i) * 9, y + Math.cos(t * .6 + i) * 5, 1.3, 1.3, `rgba(241,210,136,${.1 + (Math.sin(t + i) + 1) * .16})`);
        }
        for (const wall of level.walls) {
            const open = wall.gate !== undefined && run?.switches[wall.gate];
            if (open) {
                c.save();
                c.setLineDash([4, 8]);
                c.strokeStyle = '#edc57430';
                c.strokeRect(wall.x - wall.w / 2, wall.y - wall.h / 2, wall.w, wall.h);
                c.restore();
                continue;
            }
            const x = wall.x - wall.w / 2, y = wall.y - wall.h / 2;
            const gate = wall.gate !== undefined;
            c.fillStyle = '#00000035';
            c.beginPath();
            c.roundRect(x + 5, y + 7, wall.w, wall.h, 10);
            c.fill();
            const gradient = c.createLinearGradient(x, y, x + wall.w, y + wall.h);
            gradient.addColorStop(0, gate ? '#ac8043' : level.theme === 1 ? '#547077' : '#647363');
            gradient.addColorStop(1, gate ? '#62482f' : level.theme === 2 ? '#514953' : '#344c44');
            c.fillStyle = gradient;
            c.strokeStyle = gate ? '#e5bf6a99' : '#b8c4a544';
            c.lineWidth = 1.2;
            c.beginPath();
            c.roundRect(x, y, wall.w, wall.h, 9);
            c.fill();
            c.stroke();
            c.fillStyle = '#c3cdad18';
            c.fillRect(x + 4, y + 4, wall.w - 8, 5);
            if (gate) {
                for (let yy = y + 8; yy < y + wall.h - 5; yy += 16) {
                    line(c, [{ x: x + 7, y: yy }, { x: x + wall.w - 7, y: yy }], '#e2c58940', 3);
                }
                label(c, String(wall.gate! + 1), wall.x, wall.y + 5, '#fff1c3', 18);
            }
            else {
                for (let yy = y + 26; yy < y + wall.h - 4; yy += 30) {
                    line(c, [{ x: x + 6, y: yy }, { x: x + wall.w - 6, y: yy }], '#b8c4a51b', 1);
                }
                mandala(c, wall.x, wall.y, Math.min(18, wall.w / 3), 6, .23);
                for (let j = 0; j < 3; j++)
                    ellipse(c, x + 7 + j * 8, y + 8, 9, 4, '#abc58124', j);
            }
        }
        if (opts.ghost) {
            c.save();
            c.setLineDash([3, 8]);
            line(c, opts.ghost, '#d8e6d138', 2);
            c.restore();
        }
        if (opts.hint) {
            c.save();
            c.setLineDash([5, 9]);
            this.route(level.hint, '#f0e2b47a', 2);
            c.restore();
        }
        this.route(path, '#f9c97418', 15);
        this.route(path, GOLD, 3);
        if (path.length > 1) {
            const p = path[path.length - 1];
            ellipse(c, p.x, p.y, 4, 4, CREAM);
        }
        level.portals.forEach((p, i) => { c.save(); c.translate(p.x, p.y); for (let j = 3; j >= 0; j--) {
            c.beginPath();
            c.ellipse(0, 0, 13 + j * 5, 11 + j * 4, t * .15 + i, 0, Math.PI * 2);
            c.strokeStyle = `rgba(117,213,239,${.6 - j * .12})`;
            c.lineWidth = 2;
            c.stroke();
        } ellipse(c, 0, 0, 15, 10, '#71d0e226'); label(c, i === 0 ? 'IN' : 'OUT', 0, 4, '#b4eeff', 9); label(c, 'LOTUS GATE', 0, 43, '#87bdc5', 8); c.restore(); });
        level.switches.forEach((p, i) => { const on = run?.switches[i]; c.save(); c.translate(p.x, p.y); c.rotate(Math.PI / 4); c.fillStyle = on ? '#f2c875' : '#8d673b'; c.strokeStyle = '#f2d293'; c.lineWidth = 2; c.fillRect(-13, -13, 26, 26); c.strokeRect(-16, -16, 32, 32); c.restore(); label(c, on ? '✓' : String(i + 1), p.x, p.y + 5, on ? '#403522' : '#fff1c3', 14); });
        level.nodes.forEach((p, i) => { const active = run?.nodes[i]; c.save(); c.translate(p.x, p.y); for (let k = 0; k < 6; k++) {
            c.save();
            c.rotate(k * Math.PI / 3);
            ellipse(c, 0, -16, 6, 11, active ? '#ecd69ccc' : '#e9c88925');
            c.restore();
        } c.beginPath(); c.arc(0, 0, 29 + (active ? 0 : Math.sin(t * 2) * 1.5), 0, Math.PI * 2); c.strokeStyle = active ? '#efd5a166' : '#eacb8133'; c.lineWidth = 1; c.stroke(); c.restore(); });
        level.offerings.forEach((p, i) => { if (run?.collected[i])
            return; const y = p.y + Math.sin(t * 2 + i) * 2; ellipse(c, p.x, y + 11, 13, 5, '#00000035'); if (p.kind === 'flower') {
            for (let j = 0; j < 6; j++)
                ellipse(c, p.x + Math.cos(j * Math.PI / 3) * 7, y + Math.sin(j * Math.PI / 3) * 7, 6, 4, '#edaa87', j * Math.PI / 3);
            ellipse(c, p.x, y, 4, 4, '#ffe4a7');
        }
        else if (p.kind === 'durva') {
            for (let j = -1; j <= 1; j++) {
                line(c, [{ x: p.x, y: y + 10 }, { x: p.x + j * 9, y: y - 11 }], '#b2d69d', 3);
            }
            ellipse(c, p.x, y, 22, 22, '#b3df9820');
        }
        else {
            c.fillStyle = '#f9db97';
            c.beginPath();
            c.moveTo(p.x, y - 13);
            c.bezierCurveTo(p.x - 5, y - 4, p.x - 13, y, p.x - 10, y + 8);
            c.quadraticCurveTo(p.x, y + 17, p.x + 11, y + 8);
            c.bezierCurveTo(p.x + 13, y, p.x + 3, y - 5, p.x, y - 13);
            c.fill();
            line(c, [{ x: p.x, y: y - 7 }, { x: p.x - 2, y: y + 8 }], '#c6974266', 1);
        } });
        level.hazards.forEach(h => { const p = hazardAt(h, run?.time || 0); c.save(); c.translate(p.x, p.y); c.rotate(t * 2); for (let i = 0; i < 5; i++) {
            c.rotate(Math.PI * .4);
            ellipse(c, 0, -8, h.r * .55, h.r * .85, '#b692be48', .4);
        } ellipse(c, 0, 0, h.r * .45, h.r * .45, '#d9bfe160'); c.restore(); c.save(); c.setLineDash([2, 8]); line(c, [{ x: h.x - h.ax, y: h.y - h.ay }, { x: h.x + h.ax, y: h.y + h.ay }], '#c9a4d93a', 1); c.restore(); });
        shrine(c, t);
        const player = run?.player || { x: 80, y: 300 };
        if (run?.shield || run && run.invincible > 0) {
            c.beginPath();
            c.arc(player.x, player.y, 27, 0, Math.PI * 2);
            c.strokeStyle = '#c7efa4a0';
            c.lineWidth = 2;
            c.stroke();
            ellipse(c, player.x, player.y, 25, 25, '#b8de7a13');
        }
        const next = run?.path[run.index];
        const angle = next ? Math.atan2(next.y - player.y, next.x - player.x) : 0;
        mouse(c, player, angle, t, run?.phase === 'moving');
        if (opts.plan && path.length === 1) {
            c.save();
            c.setLineDash([4, 5]);
            c.beginPath();
            c.arc(80, 300, 33 + Math.sin(t * 2) * 2, 0, Math.PI * 2);
            c.strokeStyle = '#edc77d99';
            c.stroke();
            c.restore();
            label(c, 'DRAW FROM HERE', 80, 355, '#e8d2a6', 9);
        }
        for (const x of [120, 300, 500, 700, 880])
            diya(c, x, 575, t);
        if (opts.cursor) {
            c.strokeStyle = CREAM;
            c.lineWidth = 2;
            c.strokeRect(opts.cursor.x - 7, opts.cursor.y - 7, 14, 14);
        }
        this.effects(dt, opts.motion);
    }
    route(points: Point[], color: string, width: number) { let section: Point[] = []; for (const p of points) {
        if (p.jump) {
            line(this.c, section, color, width);
            section = [];
        }
        section.push(p);
    } line(this.c, section, color, width); }
    effects(dt: number, motion: boolean) { const c = this.c; this.sparks = this.sparks.filter(p => p.life > 0); for (const p of this.sparks) {
        p.life -= dt;
        if (motion) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += 25 * dt;
        }
        c.globalAlpha = Math.max(0, Math.min(1, p.life * 2));
        ellipse(c, p.x, p.y, p.size, p.size * .65, p.color, p.life * 2);
    } c.globalAlpha = 1; this.floaters = this.floaters.filter(p => p.life > 0); for (const f of this.floaters) {
        f.life -= dt;
        if (motion)
            f.p.y -= 20 * dt;
        c.globalAlpha = Math.max(0, Math.min(1, f.life));
        label(c, f.text, f.p.x, f.p.y - 20, CREAM, 15);
    } c.globalAlpha = 1; }
    rangoli(paths: Point[][], time: number, dt: number, motion: boolean) { const c = this.c; c.fillStyle = '#102922'; c.fillRect(0, 0, 1000, 600); const t = motion ? time : 10; const zoom = 1 + Math.max(0, 1 - t / 5) * 1.5; c.save(); c.translate(500, 300); c.scale(zoom, zoom); mandala(c, 0, 0, 242, 24, .16); const colors = ['#eab565', '#e19577', '#8abfb4', '#bcb0d2', '#d8c081', '#b7ce92']; for (let i = 0; i < 6; i++) {
        const path = paths[i] || [];
        c.save();
        c.rotate(i * Math.PI / 3 - Math.PI / 2);
        c.globalAlpha = Math.min(1, Math.max(0, (t - i * .3) * 1.5));
        for (const mirror of [-1, 1]) {
            const mapped = path.map(p => ({ x: 45 + p.x * .19, y: (p.y - 300) * .17 * mirror, jump: p.jump }));
            this.route(mapped, colors[i] + '20', 9);
            this.route(mapped, colors[i], 1.7);
        }
        c.restore();
    } c.globalAlpha = 1; mandala(c, 0, 0, 45, 12, .9); ellipse(c, 0, 0, 15, 15, '#f2d29b'); for (let i = 0; i < 24; i++) {
        const a = i * Math.PI / 12;
        diya(c, Math.cos(a) * 255, Math.sin(a) * 255, t);
    } c.restore(); if (motion && Math.random() < .3)
        this.burst({ x: Math.random() * 1000, y: -5 }, colors[Math.floor(Math.random() * 6)], 1); this.effects(dt, motion); label(c, 'YOUR PATHS. ONE CELEBRATION.', 500, 30, GOLD, 11); }
}
