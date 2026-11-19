"""Original background score for the StayDesk video (no samples, no vocals).
0-20 s: tense, a clock ticking over a low drone (the frustration scene).
20 s: the beat drops in as the lines connect to StayDesk; calm, positive loop Am-F-C-G at 96 BPM.
93.4 s: a whoosh as the logo flies at the camera, then it rings out.
Usage: python compose_music.py out.wav
"""
import sys
import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
DUR = 95.8
N = int(SR * DUR)
t = np.arange(N) / SR
BPM = 96
BEAT = 60 / BPM
BAR = 4 * BEAT
DROP = 20.0          # Connect scene starts
OUTRO = 87.8         # Outro scene starts
FLY = 93.4         # logo flies at the camera
rng = np.random.default_rng(7)


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def lp(x, f):
    return sosfilt(butter(2, f, "low", fs=SR, output="sos"), x)


def hp(x, f):
    return sosfilt(butter(2, f, "high", fs=SR, output="sos"), x)


def place(buf, start, sig):
    i = int(start * SR)
    if i >= len(buf):
        return
    sig = sig[: len(buf) - i]
    buf[i : i + len(sig)] += sig


def env(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def saw(f, n, detune=0.0):
    tt = np.arange(n) / SR
    out = np.zeros(n)
    for d in (-detune, 0, detune):
        ph = (tt * f * (1 + d)) % 1
        out += 2 * ph - 1
    return out / 3


L = np.zeros(N)
R = np.zeros(N)

# ---------- section A: the frustration ----------
dn = int(DROP * SR)
drone = np.zeros(dn)
for m, a in ((33, 0.5), (45, 0.35), (46, 0.12)):  # A1, A2 and a dissonant B-flat
    drone += a * np.sin(2 * np.pi * hz(m) * t[:dn]) * (0.9 + 0.1 * np.sin(2 * np.pi * 0.21 * t[:dn]))
drone *= np.clip(t[:dn] / 3, 0, 1) * np.clip((DROP - t[:dn]) / 0.6, 0, 1)
L[:dn] += 0.35 * drone
R[:dn] += 0.35 * drone
# the clock: a tick on every eighth, louder on the beat, getting busier
tick = hp(rng.standard_normal(int(0.03 * SR)), 3000) * np.exp(-np.arange(int(0.03 * SR)) / (0.004 * SR))
k = 0
s = 0.4
while s < DROP - 0.4:
    g = (0.22 if k % 2 == 0 else 0.12) * (0.6 + 0.4 * s / DROP)
    place(L, s, g * tick)
    place(R, s + 0.003, g * tick)
    k += 1
    s += BEAT / 2 if s < 10 else BEAT / 4
# a pulsing low note that tightens toward the drop
for b in np.arange(4, DROP - 0.2, BEAT):
    n = int(0.25 * SR)
    p = np.sin(2 * np.pi * hz(33) * np.arange(n) / SR) * np.exp(-np.arange(n) / (0.08 * SR))
    place(L, b, 0.25 * p)
    place(R, b, 0.25 * p)
# riser into the drop
rs, re = DROP - 3.5, DROP
n = int((re - rs) * SR)
noise = rng.standard_normal(n)
sweep = np.zeros(n)
for i, f in enumerate(np.linspace(300, 6000, 20)):
    a, b2 = i * n // 20, (i + 1) * n // 20
    sweep[a:b2] = lp(noise, f)[a:b2]
sweep *= np.linspace(0, 1, n) ** 2 * 0.25
place(L, rs, sweep)
place(R, rs, sweep)

# ---------- section B: StayDesk, calm and moving ----------
CHORDS = [  # (bass, chord tones)
    (45, [57, 60, 64, 67]),  # Am7
    (41, [57, 60, 65, 69]),  # Fmaj7
    (48, [55, 60, 64, 67]),  # C
    (43, [55, 59, 62, 67]),  # G
]
start = DROP
bar_i = 0
while start < OUTRO + BAR:
    bass, tones = CHORDS[bar_i % 4]
    last = start >= OUTRO
    length = BAR if not last else (DUR - start)
    n = int(length * SR)
    # pad: detuned saws through a low-pass
    pad = sum(saw(hz(m), n, 0.004) for m in tones)
    pad = lp(pad, 1400) * env(n, 0.4 if bar_i else 1.0, 0.4 if not last else 3.5) * 0.10
    place(L, start, pad)
    place(R, start + 0.012, pad)
    # sub bass on each beat
    if not last:
        for bt in range(4):
            nb = int(BEAT * SR)
            sb = np.sin(2 * np.pi * hz(bass - 12) * np.arange(nb) / SR) * env(nb, 0.01, 0.15) * 0.30
            place(L, start + bt * BEAT, sb)
            place(R, start + bt * BEAT, sb)
        # plucked arpeggio on eighths
        seq = tones + [tones[2] + 12, tones[1] + 12, tones[3], tones[2]]
        for e8 in range(8):
            m = seq[e8 % len(seq)] + 12
            np_ = int(0.5 * SR)
            pl = (np.sin(2 * np.pi * hz(m) * np.arange(np_) / SR) + 0.3 * np.sin(4 * np.pi * hz(m) * np.arange(np_) / SR))
            pl *= np.exp(-np.arange(np_) / (0.12 * SR)) * 0.10
            pan = 0.35 if e8 % 2 else -0.35
            place(L, start + e8 * BEAT / 2, pl * (1 - pan))
            place(R, start + e8 * BEAT / 2 + 0.18, pl * 0.5 * (1 + pan))  # small echo on the right
        # drums: kick on 1 and 3, soft clap on 2 and 4, hats on eighths
        for bt in range(4):
            tb = start + bt * BEAT
            if bt in (0, 2):
                nk = int(0.35 * SR)
                kk = np.arange(nk) / SR
                kick = np.sin(2 * np.pi * (50 + 90 * np.exp(-kk * 30)) * kk) * np.exp(-kk * 9) * 0.55
                place(L, tb, kick)
                place(R, tb, kick)
            else:
                nc = int(0.2 * SR)
                clap = hp(lp(rng.standard_normal(nc), 4000), 900) * np.exp(-np.arange(nc) / (0.03 * SR)) * 0.10
                place(L, tb, clap)
                place(R, tb + 0.002, clap)
        for e8 in range(8):
            nh = int(0.05 * SR)
            hat = hp(rng.standard_normal(nh), 7000) * np.exp(-np.arange(nh) / (0.008 * SR)) * (0.05 if e8 % 2 else 0.035)
            place(L, start + e8 * BEAT / 2, hat * 0.8)
            place(R, start + e8 * BEAT / 2, hat)
    else:
        # the outro: one long chord under the logo, a whoosh as it flies, then a low hit
        n = int((FLY + 1.6 - start) * SR)
        noise = rng.standard_normal(n)
        w = np.zeros(n)
        segs = 24
        for i, f in enumerate(np.geomspace(200, 9000, segs)):
            a, b2 = i * n // segs, (i + 1) * n // segs
            w[a:b2] = lp(noise, f)[a:b2]
        shape = np.clip((np.arange(n) / SR - (FLY - 1.2 - start)) / 1.4, 0, 1) ** 2
        shape *= np.clip((start + n / SR - (np.arange(n) / SR + start)) / 0.25, 0, 1)
        place(L, start, w * shape * 0.35)
        place(R, start + 0.01, w * shape * 0.35)
        nk = int(2.0 * SR)
        kk = np.arange(nk) / SR
        boom = np.sin(2 * np.pi * (40 + 60 * np.exp(-kk * 12)) * kk) * np.exp(-kk * 2.2) * 0.6
        place(L, FLY + 1.45, boom)
        place(R, FLY + 1.45, boom)
        break
    start += BAR
    bar_i += 1

# fade in, fade out, gentle glue and normalise
mix = np.stack([L, R], axis=1)
mix *= np.clip(t / 0.8, 0, 1)[:, None] * np.clip((DUR - t) / 0.6, 0, 1)[:, None]
mix = np.tanh(mix * 1.2) / np.tanh(1.2)
mix /= np.abs(mix).max() / 0.89

import wave
pcm = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes(pcm.tobytes())
print("wrote", sys.argv[1], round(DUR, 1), "s")
