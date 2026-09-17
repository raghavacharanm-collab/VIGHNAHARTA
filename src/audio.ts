export class Soundscape {
    context: AudioContext | null = null;
    master: GainNode | null = null;
    enabled = true;
    volume = .55;
    beat = 0;
    timer: ReturnType<typeof setInterval> | null = null;
    intensity = 0;
    start() { try {
        if (!this.context) {
            this.context = new AudioContext();
            this.master = this.context.createGain();
            this.master.connect(this.context.destination);
            this.master.gain.value = this.volume * .36;
        }
        void this.context.resume();
        if (!this.timer)
            this.timer = setInterval(() => this.music(), 420);
    }
    catch { } }
    settings(enabled: boolean, volume: number) { this.enabled = enabled; this.volume = volume; if (this.context && this.master)
        this.master.gain.setTargetAtTime(enabled ? volume * .36 : 0, this.context.currentTime, .05); }
    note(freq: number, length = .3, type: OscillatorType = 'sine', gain = .12, delay = 0) { const c = this.context; if (!c || !this.master || !this.enabled)
        return; const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + delay; o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + length); o.connect(g); g.connect(this.master); o.start(t); o.stop(t + length + .01); }
    bell(n = 0) { this.note(523.25 * Math.pow(2, n / 12), .65, 'sine', .32); this.note(1046.5 * Math.pow(2, n / 12), .22, 'sine', .07); }
    drum() { const c = this.context; if (!c || !this.master || !this.enabled)
        return; const o = c.createOscillator(), g = c.createGain(), t = c.currentTime; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(48, t + .15); g.gain.setValueAtTime(.36, t); g.gain.exponentialRampToValueAtTime(.0001, t + .25); o.connect(g); g.connect(this.master); o.start(); o.stop(t + .27); }
    music() { if (document.hidden || !this.enabled)
        return; const notes = [261.63, 293.66, 329.63, 392, 440, 392, 329.63, 293.66]; if (this.beat % 2 === 0)
        this.note(notes[Math.floor(this.beat / 2) % notes.length], .8, 'sine', .065); if (this.beat % 8 === 0) {
        this.note(130.81, 2.9, 'sine', .09);
        this.note(196, 2.7, 'sine', .045);
    } if (this.intensity > 0 && this.beat % 4 === 0)
        this.drum(); this.beat++; }
    celebrate() { [0, 4, 7, 12, 7, 12].forEach((n, i) => { this.note(523.25 * Math.pow(2, n / 12), 1, 'sine', .22, i * .15); }); this.drum(); }
}
