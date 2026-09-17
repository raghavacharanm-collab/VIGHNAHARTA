export type Point = {
    x: number;
    y: number;
    jump?: boolean;
};
export type Wall = {
    x: number;
    y: number;
    w: number;
    h: number;
    gate?: number;
};
export type Offering = Point & {
    kind: 'modak' | 'flower' | 'durva';
};
export type Hazard = Point & {
    ax: number;
    ay: number;
    speed: number;
    phase: number;
    r: number;
};
export type Level = {
    name: string;
    act: string;
    story: string;
    tip: string;
    theme: number;
    energy: number;
    walls: Wall[];
    offerings: Offering[];
    nodes: Point[];
    switches: Point[];
    portals: Point[];
    hazards: Hazard[];
    hint: Point[];
};
export const START: Point = { x: 80, y: 300 }, END: Point = { x: 920, y: 300 }, RADIUS = 13;
const p = (x: number, y: number): Point => ({ x, y }), w = (x: number, y: number, width: number, height: number, gate?: number): Wall => ({ x, y, w: width, h: height, gate });
const offerings = (coords: number[][]): Offering[] => coords.map(([x, y], i) => ({ x, y, kind: i % 3 === 1 ? 'flower' : 'modak' }));
export const LEVELS: Level[] = [
    { name: 'The First Light', act: 'I · THE AWAKENING', story: 'The festival lamps have fallen silent. A small companion carries the first offering. Draw the beginning of something beautiful.', tip: 'Draw from Mushak to the shrine. Gather offerings and light the two lotus seals.', theme: 0, energy: 1600,
        walls: [w(320, 180, 85, 210), w(540, 430, 90, 210), w(730, 160, 80, 180)], offerings: offerings([[200, 390], [430, 240], [645, 390], [820, 280]]), nodes: [p(200, 390), p(645, 390)], switches: [], portals: [], hazards: [], hint: [START, p(200, 390), p(390, 320), p(430, 240), p(620, 285), p(645, 390), p(820, 280), END] },
    { name: 'An Open Heart', act: 'I · THE AWAKENING', story: 'Some paths open only when you give. Touch the amber bell seal, and a forgotten doorway will answer.', tip: 'The amber switch opens its matching gate. Light every lotus seal before the shrine.', theme: 0, energy: 1700,
        walls: [w(500, 100, 70, 230), w(500, 500, 70, 230), w(500, 300, 70, 170, 0), w(730, 420, 75, 180)], offerings: offerings([[220, 430], [400, 300], [620, 200], [805, 330]]), nodes: [p(220, 430), p(620, 200)], switches: [p(220, 430)], portals: [], hazards: [], hint: [START, p(220, 430), p(400, 300), p(570, 300), p(620, 200), p(805, 240), p(805, 330), END] },
    { name: 'Across the Lotus', act: 'II · THE CROSSING', story: 'Distance is not always measured in footsteps. Two lotus pools hold the memory of a single path.', tip: 'Draw into the blue portal. Your path continues from its paired pool without using energy.', theme: 1, energy: 1300,
        walls: [w(500, 300, 95, 590), w(220, 175, 65, 170), w(780, 440, 70, 170)], offerings: offerings([[210, 400], [340, 300], [700, 210], [820, 280]]), nodes: [p(210, 400), p(700, 210)], switches: [], portals: [p(350, 300), p(660, 300)], hazards: [], hint: [START, p(210, 400), p(350, 300), { x: 660, y: 300, jump: true }, p(700, 210), p(820, 280), END] },
    { name: 'The Breath of Courage', act: 'II · THE CROSSING', story: 'Restless shadows cross the courtyard. Gather the green durva blessing. Courage is the grace to keep going.', tip: 'Green durva grants one shield against a moving shadow. Walls still block your way.', theme: 1, energy: 1700,
        walls: [w(270, 160, 80, 190), w(700, 440, 80, 190)], offerings: [...offerings([[200, 380], [520, 300], [790, 250]]), { x: 370, y: 300, kind: 'durva' }], nodes: [p(200, 380), p(790, 250)], switches: [], portals: [], hazards: [{ x: 520, y: 300, ax: 0, ay: 65, speed: 1.2, phase: 0, r: 23 }], hint: [START, p(200, 380), p(370, 300), p(520, 300), p(790, 250), END] },
    { name: 'The Festival Wakes', act: 'III · THE RETURN', story: 'Bells answer across the water. Every offering, every opened gate, every small act brings the celebration closer.', tip: 'Open the gate, cross the paired pools, and gather the last offerings on the far bank.', theme: 2, energy: 1900,
        walls: [w(360, 100, 65, 235), w(360, 500, 65, 235), w(360, 300, 65, 170, 0), w(610, 300, 70, 590)], offerings: offerings([[200, 420], [460, 300], [750, 210], [820, 420]]), nodes: [p(200, 420), p(820, 420)], switches: [p(200, 420)], portals: [p(480, 300), p(720, 200)], hazards: [], hint: [START, p(200, 420), p(290, 300), p(480, 300), { x: 720, y: 200, jump: true }, p(750, 210), p(820, 420), END] },
    { name: 'One Beautiful Beginning', act: 'III · THE RETURN', story: 'The final lamps wait for you. Nothing you drew was lost. Your journey is about to become the festival itself.', tip: 'Two bell seals. Two gates. Light both lotus seals and bring your final path home.', theme: 2, energy: 2000,
        walls: [w(360, 100, 65, 235), w(360, 500, 65, 235), w(360, 300, 65, 170, 0), w(670, 100, 65, 235), w(670, 500, 65, 235), w(670, 300, 65, 170, 1)], offerings: [...offerings([[190, 190], [470, 300], [530, 430], [790, 210]]), { x: 800, y: 310, kind: 'durva' }], nodes: [p(190, 190), p(530, 430)], switches: [p(190, 190), p(530, 430)], portals: [], hazards: [{ x: 820, y: 310, ax: 0, ay: 55, speed: 1.1, phase: 1, r: 20 }], hint: [START, p(190, 190), p(280, 300), p(470, 300), p(530, 430), p(580, 300), p(750, 300), p(790, 210), p(800, 310), END] }
];
export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
export const inBounds = (p: Point) => p.x >= 22 && p.x <= 978 && p.y >= 22 && p.y <= 578;
export const pathLength = (path: Point[]) => path.slice(1).reduce((sum, p, i) => sum + (p.jump ? 0 : distance(path[i], p)), 0);
export function hits(p: Point, w: Wall, r = RADIUS) { return Math.hypot(p.x - Math.max(w.x - w.w / 2, Math.min(p.x, w.x + w.w / 2)), p.y - Math.max(w.y - w.h / 2, Math.min(p.y, w.y + w.h / 2))) <= r; }
export function hazardAt(h: Hazard, t: number) { return { x: h.x + Math.sin(t * h.speed + h.phase) * h.ax, y: h.y + Math.sin(t * h.speed + h.phase) * h.ay }; }
export type Event = {
    kind: 'offering' | 'node' | 'switch' | 'portal' | 'shield' | 'fail' | 'win';
    point: Point;
    value?: number;
    message?: string;
};
export class Run {
    level: Level;
    path: Point[];
    player = { ...START };
    index = 1;
    time = 0;
    distance = 0;
    collected: boolean[];
    nodes: boolean[];
    switches: boolean[];
    shield = 0;
    shieldUsed = 0;
    invincible = 0;
    portalUsed = false;
    phase: 'moving' | 'won' | 'failed' = 'moving';
    events: Event[] = [];
    combo = 0;
    maxCombo = 0;
    lastCollection = -100;
    offeringScore = 0;
    reason = '';
    constructor(level: Level, path: Point[]) { this.level = level; this.path = path.map(p => ({ ...p })); this.collected = level.offerings.map(() => false); this.nodes = level.nodes.map(() => false); this.switches = level.switches.map(() => false); if (!path.length || distance(path[0], START) > 1 || pathLength(path) > level.energy + .1)
        this.fail('This path exceeds its energy or does not start at Mushak.'); }
    emit(kind: Event['kind'], point: Point, value?: number, message?: string) { this.events.push({ kind, point: { ...point }, value, message }); }
    fail(message: string) { this.phase = 'failed'; this.reason = message; this.emit('fail', this.player, undefined, message); }
    inspect() {
        const p = this.player;
        this.level.switches.forEach((v, i) => { if (!this.switches[i] && distance(p, v) < 28) {
            this.switches[i] = true;
            this.emit('switch', v);
        } });
        this.level.nodes.forEach((v, i) => { if (!this.nodes[i] && distance(p, v) < 29) {
            this.nodes[i] = true;
            this.emit('node', v);
        } });
        this.level.offerings.forEach((v, i) => { if (!this.collected[i] && distance(p, v) < 25) {
            this.collected[i] = true;
            this.combo = this.time - this.lastCollection <= 2.5 ? this.combo + 1 : 1;
            this.lastCollection = this.time;
            this.maxCombo = Math.max(this.maxCombo, this.combo);
            const score = 200 + Math.min(this.combo - 1, 4) * 50;
            this.offeringScore += score;
            if (v.kind === 'durva')
                this.shield = 1;
            this.emit('offering', v, score);
        } });
        if (!inBounds(p) || this.level.walls.some(w => (w.gate === undefined || !this.switches[w.gate]) && hits(p, w))) {
            this.fail('Leave a little space around the stonework.');
            return;
        }
        if (this.invincible <= 0 && this.level.hazards.some(h => distance(p, hazardAt(h, this.time)) < RADIUS + h.r)) {
            if (this.shield) {
                this.shield = 0;
                this.shieldUsed++;
                this.invincible = 1.6;
                this.emit('shield', p);
            }
            else {
                this.fail('A restless shadow crossed your path. Try another route, or gather durva.');
                return;
            }
        }
        if (distance(p, END) < 32) {
            if (this.nodes.every(Boolean)) {
                this.phase = 'won';
                this.emit('win', p);
            }
            else
                this.fail('The shrine awaits every lotus seal. Light the missing seals first.');
        }
    }
    step(delta: number) {
        if (this.phase !== 'moving')
            return;
        let left = Math.min(.1, Math.max(0, delta));
        while (left > 0 && this.phase === 'moving') {
            const dt = Math.min(left, 1 / 120);
            left -= dt;
            this.time += dt;
            this.invincible = Math.max(0, this.invincible - dt);
            let travel = 205 * dt;
            while (travel > 0 && this.phase === 'moving') {
                const dest = this.path[this.index];
                if (!dest) {
                    this.fail('Your path stops before the shrine. Extend it and try again.');
                    break;
                }
                if (dest.jump) {
                    const [a, b] = this.level.portals;
                    if (!a || !b || this.portalUsed || distance(this.player, a) > 30 || distance(dest, b) > 1) {
                        this.fail('A portal connection is missing. Draw into the blue pool first.');
                        break;
                    }
                    this.player = { x: b.x, y: b.y };
                    this.portalUsed = true;
                    this.index++;
                    this.emit('portal', b);
                    this.inspect();
                    continue;
                }
                const d = distance(this.player, dest);
                if (d < .001) {
                    this.index++;
                    continue;
                }
                const step = Math.min(travel, d, 2);
                this.player = { x: this.player.x + (dest.x - this.player.x) * step / d, y: this.player.y + (dest.y - this.player.y) * step / d };
                this.distance += step;
                travel -= step;
                this.inspect();
                if (step === d)
                    this.index++;
            }
        }
    }
}
export function scoreRun(run: Run, hinted = false, planningTime = 0) { const n = run.collected.filter(Boolean).length; const efficiency = Math.max(0, Math.round((1 - pathLength(run.path) / run.level.energy) * 1200)); const timeBonus = Math.max(0, Math.round(500 - (run.time + planningTime) * 6)); const stars = run.phase !== 'won' ? 0 : n === run.collected.length && !hinted ? 3 : n >= Math.ceil(run.collected.length / 2) ? 2 : 1; return { score: run.offeringScore + efficiency + timeBonus + 1000, efficiency, timeBonus, stars, combo: run.maxCombo }; }
export function mirrorLevel(level: Level): Level { const flip = <T extends Point>(v: T): T => ({ ...v, y: 600 - v.y }); return { ...level, walls: level.walls.map(flip), offerings: level.offerings.map(flip), nodes: level.nodes.map(flip), switches: level.switches.map(flip), portals: level.portals.map(flip), hazards: level.hazards.map(h => ({ ...flip(h), ay: -h.ay })), hint: level.hint.map(flip) }; }
export function trialLevels(seed: number) { let n = seed >>> 0; return [1, 3, 5].map(i => { n = (Math.imul(n, 1664525) + 1013904223) >>> 0; return n % 2 ? mirrorLevel(LEVELS[i]) : LEVELS[i]; }); }
export type RecordData = {
    score: number;
    stars: number;
    path: Point[];
};
export type Save = {
    unlocked: number;
    records: (RecordData | null)[];
    sprintBest: number;
    sound: boolean;
    motion: boolean;
    volume: number;
};
export const emptySave = (): Save => ({ unlocked: 0, records: [], sprintBest: 0, sound: true, motion: true, volume: .55 });
export function parseSave(raw: string | null): Save { try {
    const v = JSON.parse(raw || 'null');
    if (!v || typeof v !== 'object')
        return emptySave();
    const num = (x: unknown, max: number) => typeof x === 'number' && Number.isFinite(x) ? Math.max(0, Math.min(max, x)) : 0;
    return { unlocked: Math.floor(num(v.unlocked, 5)), sprintBest: Math.round(num(v.sprintBest, 100000)), sound: v.sound !== false, motion: v.motion !== false, volume: typeof v.volume === 'number' ? num(v.volume, 1) : .55, records: Array.isArray(v.records) ? v.records.slice(0, 6).map((r: any) => r && typeof r === 'object' ? { score: Math.round(num(r.score, 100000)), stars: Math.floor(num(r.stars, 3)), path: Array.isArray(r.path) ? r.path.slice(0, 2500).filter((p: any) => p && Number.isFinite(p.x) && Number.isFinite(p.y) && inBounds(p)).map((p: Point) => ({ x: p.x, y: p.y, ...(p.jump ? { jump: true } : {}) })) : [] } : null) : [] };
}
catch {
    return emptySave();
} }
