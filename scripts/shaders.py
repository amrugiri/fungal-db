"""
Per-vertex shading for the species models.

One flat colour per part cannot express what actually makes a fruiting body
recognisable: a pileus darkens toward its centre, a stipe is fibrillose, a
perennial bracket is concentrically zoned, and Hypsizygus marmoreus is named for
its marbling. These are the reusable gradients that carry that.

Every function here takes an (N,3) vertex array in the model's own build frame
(Z up, cap radius ~1.0) and returns (N,3) sRGB in 0-1. Colour is written as
sRGB because three.js converts COLOR_0 from sRGB on load.

A note on tone: the viewer's key light is bright enough that mid-tones on an
upward-facing surface wash out noticeably, so the darker end of each pair is
pitched darker than the reference photograph reads.
"""
import numpy as np

from mesh_kit import hex_rgb


# ---------------------------------------------------------------------------
# colour helpers
# ---------------------------------------------------------------------------
def scale(h, f):
    """Lighten (f>1) or darken (f<1) a hex colour, staying in gamut."""
    return np.clip(hex_rgb(h) * f, 0.0, 1.0)


def pair(h, dark=0.42, light=1.22):
    """A (darker, lighter) pair derived from one base colour."""
    return scale(h, dark), scale(h, light)


def _mix(a, b, t):
    return a + (b - a) * np.clip(t, 0, 1)[:, None]


def _noise(V, freqs, phases):
    """Smooth multi-frequency variation in [-1, 1]."""
    out = np.zeros(len(V))
    for (fx, fy, fz), (px, py, pz) in zip(freqs, phases):
        out += (np.sin(V[:, 0] * fx + px)
                * np.cos(V[:, 1] * fy + py)
                * np.cos(V[:, 2] * fz + pz))
    return out / max(len(freqs), 1)


# ---------------------------------------------------------------------------
# gradients
# ---------------------------------------------------------------------------
def radial(inner, outer, power=2.2, streak=0.0, k=16):
    """
    Pileus gradient: dark at the centre, paling toward the margin. `power` sets
    how much of the cap stays dark -- higher keeps the colour out to the rim.
    """
    ci, co = hex_rgb(inner), hex_rgb(outer)

    def fn(V):
        r = np.clip(np.hypot(V[:, 0], V[:, 1]), 0, 1) ** power
        c = _mix(ci, co, r)
        if streak:
            th = np.arctan2(V[:, 1], V[:, 0])
            c = c * (1.0 + streak * np.cos(k * th))[:, None]
        return c
    return fn


def fibrillose(base, streak, n=34, soil=None, soil_below=-1.2, soil_span=0.8):
    """Stipe: fine longitudinal fibrils, optionally soiling toward the base."""
    cb, cs = hex_rgb(base), hex_rgb(streak)
    csoil = hex_rgb(soil) if soil else None

    def fn(V):
        th = np.arctan2(V[:, 1], V[:, 0])
        f = 0.5 + 0.5 * np.cos(n * th + 1.7 * np.sin(3 * th))
        c = _mix(cb, cs, f * 0.55)
        if csoil is not None:
            t = np.clip((soil_below - V[:, 2]) / soil_span, 0, 1)
            c = _mix(c, csoil, t * 0.6)
        return c
    return fn


def banded(inner, outer, bands=7, power=1.0, contrast=0.5):
    """
    Concentric zonation -- the growth banding of a perennial bracket, measured
    outward from the point of attachment rather than from the centre.
    """
    ci, co = hex_rgb(inner), hex_rgb(outer)

    def fn(V):
        heel = V[np.argmin(V[:, 0])]
        d = np.linalg.norm(V - heel, axis=1)
        t = np.clip(d / max(d.max(), 1e-6), 0, 1)
        c = _mix(ci, co, t ** power)
        ring = 0.5 + 0.5 * np.cos(bands * np.pi * t)
        return np.clip(c * (1.0 - contrast * 0.5 + contrast * ring)[:, None], 0, 1)
    return fn


def from_heel(near, far, power=1.0):
    """Gradient outward from the attachment point (shelf and bracket forms)."""
    cn, cf = hex_rgb(near), hex_rgb(far)

    def fn(V):
        heel = V[np.argmin(V[:, 0])]
        d = np.linalg.norm(V - heel, axis=1)
        return _mix(cn, cf, (np.clip(d / max(d.max(), 1e-6), 0, 1)) ** power)
    return fn


def marbled(base, blotch, seed=0, coarse=3.2, fine=7.5, amount=1.0):
    """Mottled or marbled surface -- Hypsizygus marmoreus is named for this."""
    cb, cbl = hex_rgb(base), hex_rgb(blotch)
    rng = np.random.default_rng(seed)
    ph = rng.uniform(0, 6.283, (2, 3))

    def fn(V):
        n = _noise(V, [(coarse, coarse * 1.1, coarse * 0.9),
                       (fine, fine * 0.9, fine * 1.2)], ph)
        return _mix(cb, cbl, np.clip(0.5 + 0.5 * n * 1.6, 0, 1) * amount)
    return fn


def axial(low, high, power=1.0, lo=None, hi=None):
    """Gradient along the vertical axis."""
    cl, ch = hex_rgb(low), hex_rgb(high)

    def fn(V):
        a = V[:, 2].min() if lo is None else lo
        b = V[:, 2].max() if hi is None else hi
        t = np.clip((V[:, 2] - a) / max(b - a, 1e-6), 0, 1) ** power
        return _mix(cl, ch, t)
    return fn


def flat(color, variation=0.0, seed=1, freq=6.0):
    """Near-uniform, with just enough variation to avoid a plastic look."""
    c = hex_rgb(color)
    rng = np.random.default_rng(seed)
    ph = rng.uniform(0, 6.283, (1, 3))

    def fn(V):
        if variation <= 0:
            return np.tile(c, (len(V), 1))
        n = _noise(V, [(freq, freq * 1.1, freq * 0.9)], ph)
        return np.clip(np.tile(c, (len(V), 1)) * (1.0 + variation * n)[:, None], 0, 1)
    return fn


def tipped(base, tip, power=1.5):
    """Pendant spines and teeth: paler along their length toward the tip."""
    cb, ct = hex_rgb(base), hex_rgb(tip)

    def fn(V):
        t = np.clip((V[:, 2].max() - V[:, 2]) / max(float(np.ptp(V[:, 2])), 1e-6), 0, 1) ** power
        return _mix(cb, ct, t)
    return fn
