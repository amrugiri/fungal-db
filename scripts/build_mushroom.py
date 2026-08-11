"""
Procedurally build an Agaricus bisporus (button mushroom) as real 3D geometry
and export it as a web-ready .glb (cap, stipe, radial gills, annulus ring).

This is a *parametric / illustrative* model built from the described anatomy of
the species -- NOT a photogrammetry scan. It has genuine 3D depth: you can orbit
it, look up into the gills, and slice it with a clipping plane.

Usage:
    .img-venv/bin/python scripts/build_mushroom.py [-o public/models/agaricus-bisporus.glb]

Shared helpers (and the watertight requirement they enforce) live in mesh_kit.py.
"""
import numpy as np
import trimesh

from mesh_kit import TAU, revolve, finalize, srgb, verify_and_export

# ---- shape parameters ------------------------------------------------------
# Change these and re-run to get a different gilled species' base model.
R = 1.0          # cap radius
H_DOME = 0.52    # cap height above the rim
RIM_THICK = 0.02 # thickness of the cap margin
N_GILLS = 60
GILL_THICK = 0.012
SEG = 96         # radial segments for surfaces of revolution

CAP_COLOR = srgb("#dbc4aa")
STEM_COLOR = srgb("#f3ede2")
GILL_COLOR = srgb("#c4a29b")
RING_COLOR = srgb("#ede5d6")


def solid_blade(angle, ri, top_z, bot_z, thickness):
    """
    One lamella as a closed prism: the blade's (r, z) outline extruded
    tangentially. Real gills are thin but not zero-thickness, and giving them
    volume is what lets them show up as filled slivers in the cross-section.
    """
    ca, sa = np.cos(angle), np.sin(angle)
    nx, ny = -sa, ca  # tangential normal: perpendicular to the blade's plane
    half = thickness * 0.5
    m = len(ri)

    verts = []
    for sign in (1.0, -1.0):
        ox, oy = nx * sign * half, ny * sign * half
        for row_z in (top_z, bot_z):
            for j in range(m):
                verts.append([ri[j] * ca + ox, ri[j] * sa + oy, row_z[j]])

    def V(side, row, j):
        return side * (2 * m) + row * m + j

    faces = []
    quad = lambda a_, b_, c_, d_: faces.extend([[a_, b_, d_], [a_, d_, c_]])
    for side in (0, 1):                                   # the two flat faces
        for j in range(m - 1):
            quad(V(side, 0, j), V(side, 0, j + 1), V(side, 1, j), V(side, 1, j + 1))
    for row in (0, 1):                                    # top and bottom edges
        for j in range(m - 1):
            quad(V(0, row, j), V(0, row, j + 1), V(1, row, j), V(1, row, j + 1))
    for j in (0, m - 1):                                  # inner and outer edges
        quad(V(0, 0, j), V(0, 1, j), V(1, 0, j), V(1, 1, j))

    return trimesh.Trimesh(vertices=np.array(verts), faces=np.array(faces), process=False)


# ---- 1. CAP: dome over a concave underside, joined around the rim -----------
r_dome = np.linspace(0.0, R, 40)
z_dome = H_DOME * (1 - (r_dome / R) ** 2) ** 0.75          # smooth flattened dome


def cap_underside_z(rr):
    """Underside rises from the rim toward the centre (flesh thickest at centre)."""
    return -RIM_THICK + 0.20 * (1 - (np.clip(rr, 0, R) / R) ** 1.6)


r_under = np.linspace(R, 0.0, 40)
z_under = cap_underside_z(r_under)

# The margin: a short vertical run at r = R tying the dome's rim to the
# underside's rim. Without it the two sheets never meet.
rim_z = np.linspace(0.0, -RIM_THICK, 4)[1:-1]
cap_r = np.concatenate([r_dome, np.full(len(rim_z), R), r_under])
cap_z = np.concatenate([z_dome, rim_z, z_under])
cap = finalize(revolve(cap_r, cap_z, seg=SEG), CAP_COLOR, 0.85)

# ---- 2. STIPE: closed at both ends -----------------------------------------
zs = np.linspace(0.16, -0.78, 24)                          # inside cap down to base
rad = 0.30 + 0.06 * (np.linspace(0, 1, len(zs)) ** 3)      # slightly bulbous base
stem_r = np.concatenate([[0.0], rad, [0.0]])
stem_z = np.concatenate([[zs[0]], zs, [zs[-1]]])
stem = finalize(revolve(stem_r, stem_z, seg=64), STEM_COLOR, 0.9)

# ---- 3. GILLS: radial blades with real thickness ---------------------------
r_in, r_out = 0.33, 0.94
ri = np.linspace(r_in, r_out, 8)
top_z = cap_underside_z(ri)
depth = 0.11 * (1 - (ri - r_in) / (r_out - r_in) * 0.4)    # deeper near the stipe
bot_z = top_z - depth
gills = finalize(
    trimesh.util.concatenate(
        [solid_blade(TAU * k / N_GILLS, ri, top_z, bot_z, GILL_THICK) for k in range(N_GILLS)]
    ),
    GILL_COLOR, 0.95,
)

# ---- 4. ANNULUS: ring on the upper stipe -----------------------------------
ring = trimesh.creation.torus(major_radius=0.34, minor_radius=0.045,
                              major_sections=64, minor_sections=16)
ring.apply_translation([0, 0, -0.06])
ring = finalize(ring, RING_COLOR, 0.9)

verify_and_export(
    [
        ("pileus_cap", cap),
        ("stipe_stem", stem),
        ("lamellae_gills", gills),
        ("annulus_ring", ring),
    ],
    "agaricus-bisporus.glb",
)
