"""A hotel desk-bell 'ding' (synthesised, no samples). Usage: python make_ding.py out.wav"""
import sys, wave
import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
D = 3.2
t = np.arange(int(SR * D)) / SR
f0 = 1480.0
# a struck bell: inharmonic partials, each with its own decay, a slow beat between twin partials
parts = [(1.0, 1.0, 2.4), (2.32, 0.55, 1.3), (4.25, 0.28, 0.7), (6.63, 0.14, 0.35), (0.5, 0.12, 1.6)]
x = np.zeros_like(t)
for ratio, amp, dec in parts:
    f = f0 * ratio
    x += amp * np.exp(-t / dec) * (np.sin(2 * np.pi * f * t) + 0.6 * np.sin(2 * np.pi * (f * 1.0025) * t))
# the strike: a tiny bright click
n = int(0.015 * SR)
click = np.random.default_rng(3).standard_normal(n) * np.exp(-np.arange(n) / (0.002 * SR))
click = sosfilt(butter(2, 3000, "high", fs=SR, output="sos"), click)
x[:n] += 0.6 * click
x *= np.clip(t / 0.002, 0, 1)
x /= np.abs(x).max() / 0.9
st = np.stack([x, np.concatenate([np.zeros(int(0.004 * SR)), x[: -int(0.004 * SR)]])], axis=1)
pcm = (st * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(pcm.tobytes())
print("wrote", sys.argv[1])
