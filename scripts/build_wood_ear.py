"""
Procedurally build an Auricularia auricula-judae (wood ear / jelly ear) as real
3D geometry and export it as a web-ready .glb.

This is a *parametric / illustrative* model built from the described anatomy of
the species -- NOT a photogrammetry scan.

Morphology it encodes (Auricularia is nothing like a gilled mushroom, so none of
the cap/stipe/gill machinery applies):
  * Ear-shaped (auriculate) gelatinous cup, sessile -- no stipe at all, matching
    the database record's stipeLength = 0.
  * Built as a thin curved *sheet* with an undulating, lobed margin, rather than
    a solid of revolution: the outline limit varies with angle, which is what
    makes it an ear rather than a disc.
  * Two plies, because the two faces are the diagnostic feature of the species:
      - hymenial (inner/concave, fertile): darker reddish-brown, smooth and
        glossy, thrown into vein-like folds.
      - abhymenial (outer/convex, sterile): paler greyish-brown and finely
        tomentose (downy), so it reads matte.
    Real context is more finely stratified than two layers; this is a schematic
    of the fertile/sterile division. It differentiates the two *surfaces* -- the
    cross-section fills from a single model-level context colour, so the plies
    read as one continuous band there, not two.
  * Sessile attachment boss where the fruiting body meets its hardwood substrate.

Thickness is held near life proportion: fresh basidiocarps run roughly 1-3 mm
thick across a 3-8 cm ear, i.e. about 0.03 of the width, which is what THICKNESS
is set to below.

Usage:
    .img-venv/bin/python scripts/build_wood_ear.py [-o public/models/auricularia-auricula-judae.glb]
"""
import numpy as np
import trimesh

from mesh_kit import shell_cap, finalize, srgb, verify_and_export

# ---- shape parameters ------------------------------------------------------
PHI0 = 1.02        # base polar half-angle of the cup (radians)
THICKNESS = 0.055  # gelatinous sheet thickness, ~0.03 of the ear's width
VEIN = 0.10        # depth of the hymenial folds
FACE_DEG = 55      # tip of the cup's opening toward the viewer (see orientation)
YAW_DEG = 12       # slight turn, so the pose is not dead symmetric
NF, NT = 28, 112   # grid: radial x angular

# Fresh material is dark reddish-brown; the DB record's capColor (#3d2817) sits
# between these two faces.
HYMENIUM_COLOR = srgb("#866559")    # fertile face: darker, wet-looking
ABHYMENIUM_COLOR = srgb("#b3a093")  # sterile face: paler, downy
ATTACH_COLOR = srgb("#9e8b7e")       # attachment boss


def phi_max(theta):
    """
    Outline of the ear. The cos(theta) term makes one side markedly longer than
    the other (auriculate rather than circular); the higher harmonics give the
    lobed, undulating margin typical of the species.
    """
    return PHI0 * (
        1.0
        + 0.22 * np.cos(theta)
        + 0.07 * np.cos(2 * theta + 0.7)
        + 0.06 * np.sin(3 * theta + 0.4)
        + 0.035 * np.sin(5 * theta)
    )


def r_mid(f, theta):
    """
    Mid-surface radius, carrying the vein-like folds of the hymenium.

    The envelope vanishes at both the pole (f=0) and the margin (f=1): it must
    be theta-independent at f=0 where the patch converges to a single vertex,
    and folds dying out at the margin keep the rim clean.
    """
    envelope = (f ** 1.4) * ((1.0 - f) ** 0.8) / 0.235   # normalised to ~1 at peak
    folds = (
        0.55 * np.cos(4 * theta + 0.3)
        + 0.30 * np.cos(7 * theta + 2.0)
        + 0.15 * np.cos(11 * theta)
    )
    return 1.0 + VEIN * envelope * folds


# ---- the two plies of the gelatinous sheet ---------------------------------
# They share the mid-surface exactly. That interface is interior, and the
# stencil pass counts with depth testing off, so coincident opposite-facing
# polygons cancel cleanly rather than fighting.
hymenium = shell_cap(phi_max, r_mid, -THICKNESS * 0.5, 0.0, nf=NF, nt=NT)
abhymenium = shell_cap(phi_max, r_mid, 0.0, THICKNESS * 0.5, nf=NF, nt=NT)

# ---- orientation -----------------------------------------------------------
# The patch is built as a dome around +z (concave side facing the origin), so
# `flip` turns it over into a cup opening toward +z.
#
# The viewer converts this Z-up file to its own Y-up frame with a -90 deg X
# rotation, which sends build +z to straight up and build -y toward the camera.
# A cup left opening at +z is therefore seen edge-on from the default view, with
# the fertile face hidden. `face` tips the opening toward build -y so the
# hymenium presents to the viewer, still angled upward like a fruiting body
# projecting from a trunk. `squash` is applied first, in the ear's own plane,
# so the outline is oval rather than circular.
squash = np.diag([1.0, 0.9, 1.0, 1.0])
flip = trimesh.transformations.rotation_matrix(np.pi, [1, 0, 0])
face = trimesh.transformations.rotation_matrix(np.radians(FACE_DEG), [1, 0, 0])
yaw = trimesh.transformations.rotation_matrix(np.radians(YAW_DEG), [0, 1, 0])
M = yaw @ face @ flip @ squash

# ---- sessile attachment boss ----------------------------------------------
# Placed on the margin at theta = pi, the ear's short side -- where the
# shortest lobe meets the substrate.
th_a = np.pi
ph_a = phi_max(th_a)
rim = np.array([
    np.sin(ph_a) * np.cos(th_a),
    np.sin(ph_a) * np.sin(th_a),
    np.cos(ph_a),
])
# Pulled slightly toward the cup's axis so the boss merges into the sheet
# instead of floating off the edge.
attach_pt = trimesh.transform_points([rim * 0.93], M)[0]

boss = trimesh.creation.icosphere(subdivisions=3, radius=1.0)
boss.apply_transform(np.diag([0.15, 0.115, 0.085, 1.0]))
boss.apply_translation(attach_pt)

for mesh in (hymenium, abhymenium):
    mesh.apply_transform(M)

# ---- seat on z = 0 ---------------------------------------------------------
min_z = min(m.bounds[0][2] for m in (hymenium, abhymenium, boss))
for mesh in (hymenium, abhymenium, boss):
    mesh.apply_translation([0, 0, -min_z])

verify_and_export(
    [
        ("hymenial_layer", finalize(hymenium, HYMENIUM_COLOR, 0.38)),
        ("abhymenial_layer", finalize(abhymenium, ABHYMENIUM_COLOR, 0.92)),
        ("attachment_base", finalize(boss, ATTACH_COLOR, 0.88)),
    ],
    "auricularia-auricula-judae.glb",
)
