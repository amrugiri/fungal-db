"""
PROTOTYPE -- microscopic morphology, for review before the other four moulds.

Builds Fusarium venenatum as real 3D geometry: a branching septate mycelium,
which is what "morphology" means for a filamentous fungus with no fruiting body
at all. Chosen as the prototype because it is the Quorn organism and the one
whose hyphal architecture the mycoprotein literature actually cares about --
fibre length and branching frequency are what give the biomass its meat-like
texture.

What it encodes:
  * Septate hyphae: cross-walls at regular intervals, modelled as slightly
    swollen collars so they read as real divisions rather than painted lines.
  * A branching habit with a realistic branch angle, from the database record's
    hyphaeBranchAngle (35 deg) and hyphaeThickness (0.018).
  * Apical dominance: leading tips run further than the laterals they throw off,
    and hyphal diameter tapers slightly toward each tip.

What it does NOT encode: conidia, chlamydospores, or the anastomoses that make
a real mycelium a network rather than a tree. Those matter for identification
and are the obvious next step if this approach is approved.

Scale: purely relative. The whole model is a fragment of mycelium a few hundred
micrometres across; the viewer normalises it like every other model, so nothing
here is dimensionally comparable to the macroscopic species.

Usage:
    .img-venv/bin/python scripts/build_hyphae.py [-o public/models/fusarium-venenatum.glb]
"""
import numpy as np
import trimesh

from mesh_kit import revolve, finalize, srgb, verify_and_export

# ---- parameters, from the species' 3D-model record -------------------------
BRANCH_ANGLE = 35.0     # hyphaeBranchAngle
THICKNESS = 0.080       # hyphaeThickness, scaled up for a legible mesh
SEPTUM_SPACING = 0.42   # distance between cross-walls
MAX_DEPTH = 3
SEED = 12

HYPHA_COLOR = srgb("#8b7355")   # DB hyphaeColor
SEPTUM_COLOR = srgb("#6a5540")  # cross-walls, read slightly darker


def segment(start, end, r_start, r_end, seg=10):
    """One length of hypha as a closed tapered tube between two points."""
    d = np.asarray(end, float) - np.asarray(start, float)
    length = np.linalg.norm(d)
    if length < 1e-6:
        return None
    t = np.linspace(0, 1, 8)
    rad = r_start + (r_end - r_start) * t
    mesh = revolve(np.concatenate([[0.0], rad, [0.0]]),
                   np.concatenate([[0.0], -length * t, [-length]]), seg=seg)
    # revolve builds along -z; swing it onto the segment's direction.
    d = d / length
    axis = np.cross([0, 0, -1.0], d)
    if np.linalg.norm(axis) > 1e-9:
        angle = np.arccos(np.clip(np.dot([0, 0, -1.0], d), -1, 1))
        mesh.apply_transform(trimesh.transformations.rotation_matrix(angle, axis))
    mesh.apply_translation(start)
    return mesh


def septum(centre, direction, radius):
    """A cross-wall: a short collar, slightly proud of the hypha."""
    ring = revolve(np.concatenate([[0.0], [radius * 1.22] * 4, [0.0]]),
                   np.array([0.0, 0.0, -0.012, -0.024, -0.036, -0.036]), seg=10)
    d = np.asarray(direction, float)
    d = d / np.linalg.norm(d)
    axis = np.cross([0, 0, -1.0], d)
    if np.linalg.norm(axis) > 1e-9:
        angle = np.arccos(np.clip(np.dot([0, 0, -1.0], d), -1, 1))
        ring.apply_transform(trimesh.transformations.rotation_matrix(angle, axis))
    ring.apply_translation(centre)
    return ring


rng = np.random.default_rng(SEED)
tubes, walls = [], []


def grow(origin, direction, length, radius, depth):
    """Extend one hypha, laying down septa and throwing lateral branches."""
    if depth > MAX_DEPTH or length < 0.18:
        return
    d = np.asarray(direction, float)
    d = d / np.linalg.norm(d)
    end = np.asarray(origin, float) + d * length
    tip_r = radius * 0.86
    tube = segment(origin, end, radius, tip_r)
    if tube is not None:
        tubes.append(tube)

    n_septa = max(int(length / SEPTUM_SPACING), 1)
    for i in range(1, n_septa + 1):
        f = i / (n_septa + 1)
        walls.append(septum(np.asarray(origin, float) + d * (length * f),
                            d, radius + (tip_r - radius) * f))

    # Laterals leave at the recorded branch angle, rotated about the parent axis.
    ref = np.array([0.0, 0.0, 1.0])
    if abs(np.dot(ref, d)) > 0.95:
        ref = np.array([1.0, 0.0, 0.0])
    u = np.cross(d, ref)
    u /= np.linalg.norm(u)
    v = np.cross(d, u)

    for k in range(2 if depth < 2 else 1):
        roll = rng.uniform(0, 2 * np.pi)
        theta = np.radians(BRANCH_ANGLE * rng.uniform(0.75, 1.25))
        side = np.cos(roll) * u + np.sin(roll) * v
        nd = np.cos(theta) * d + np.sin(theta) * side
        at = rng.uniform(0.45, 0.85)
        grow(np.asarray(origin, float) + d * (length * at), nd,
             length * rng.uniform(0.55, 0.75), radius * 0.82, depth + 1)

    # Apical dominance: the leading tip keeps going, only slightly deflected.
    wobble = np.radians(rng.uniform(6, 16))
    roll = rng.uniform(0, 2 * np.pi)
    nd = np.cos(wobble) * d + np.sin(wobble) * (np.cos(roll) * u + np.sin(roll) * v)
    grow(end, nd, length * 0.78, tip_r, depth + 1)


# Three founding hyphae radiating from a common origin, as a germinating
# fragment of submerged-culture mycelium would.
for i in range(3):
    a = 2 * np.pi * i / 3 + 0.4
    grow([0.0, 0.0, 0.0],
         [np.cos(a), np.sin(a), rng.uniform(-0.25, 0.45)],
         1.05, THICKNESS, 0)

verify_and_export(
    [
        ("hyphal_filaments", finalize(trimesh.util.concatenate(tubes), HYPHA_COLOR, 0.62)),
        ("septa_cross_walls", finalize(trimesh.util.concatenate(walls), SEPTUM_COLOR, 0.66)),
    ],
    "fusarium-venenatum.glb",
)
