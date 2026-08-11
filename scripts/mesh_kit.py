"""
Shared geometry helpers for the parametric species model builders.

Everything here produces **watertight** (closed, manifold, outward-facing)
meshes. That is a hard requirement, not a nicety: the web viewer fills the
cross-section using a stencil pass that counts back faces against front faces,
and an open surface has no inside to count -- it yields stray fill and holes in
the cut face. `verify_and_export` refuses to write a file that would break it.

Output is Z-up (trimesh convention); the viewer rotates it to Y-up on load.
"""
import argparse
import os
import sys

import numpy as np
import trimesh
from trimesh.visual.material import PBRMaterial

TAU = np.pi * 2


def revolve(profile_r, profile_z, seg=96, warp=None):
    """
    Revolve a 2D profile (r, z) about the z-axis into a closed surface.

    A profile endpoint sitting on the axis (r == 0) becomes a single pole vertex
    with a triangle fan, rather than `seg` coincident vertices -- that is what
    keeps the result manifold. Use it for anything with rotational symmetry:
    caps, stipes, boles, bosses.

    A profile that runs up the outside and back down the inside, meeting itself
    at the base, revolves into a closed *hollow* shell -- which is how the
    genuinely hollow species (morels) get an interior worth sectioning.

    `warp(j, theta) -> (dr, dz)` optionally breaks the rotational symmetry,
    displacing profile point j at angle theta. Use it for pits, ridges and
    scales. It must return 0 at any profile point sitting on the axis, or the
    pole stops being a single point and the mesh tears.
    """
    pr = np.asarray(profile_r, dtype=float)
    pz = np.asarray(profile_z, dtype=float)
    pole_start = pr[0] <= 1e-12
    pole_end = pr[-1] <= 1e-12

    ring_idx = list(range(1 if pole_start else 0, len(pr) - (2 if pole_end else 1) + 1))
    nring = len(ring_idx)

    verts = []
    if pole_start:
        verts.append([0.0, 0.0, pz[0]])
    base = len(verts)
    for a in np.linspace(0, TAU, seg, endpoint=False):
        ca, sa = np.cos(a), np.sin(a)
        for j in ring_idx:
            r, z = pr[j], pz[j]
            if warp is not None:
                dr, dz = warp(j, a)
                r, z = r + dr, z + dz
            verts.append([r * ca, r * sa, z])
    if pole_end:
        verts.append([0.0, 0.0, pz[-1]])
    end_i = len(verts) - 1

    def vid(i, k):
        return base + (i % seg) * nring + k

    faces = []
    for i in range(seg):
        i2 = (i + 1) % seg
        if pole_start:
            faces.append([0, vid(i, 0), vid(i2, 0)])
        for k in range(nring - 1):
            a_, b_ = vid(i, k), vid(i, k + 1)
            c_, d_ = vid(i2, k), vid(i2, k + 1)
            faces.append([a_, b_, d_])
            faces.append([a_, d_, c_])
        if pole_end:
            faces.append([end_i, vid(i2, nring - 1), vid(i, nring - 1)])

    return trimesh.Trimesh(vertices=np.array(verts), faces=np.array(faces), process=False)


def shell_cap(phi_max, r_mid, off_in, off_out, nf=30, nt=120):
    """
    Closed shell over a spherical-cap patch -- a curved sheet with thickness.

    This is the primitive for anything built like a sheet rather than a solid of
    revolution: cups, ears, brackets, shelf fungi. The patch is swept in polar
    angle phi from the pole out to `phi_max(theta)`, so a theta-varying limit
    gives a non-circular, lobed outline (an ear rather than a disc).

    phi_max(theta) -> outline, the polar angle at the margin
    r_mid(f, theta) -> mid-surface radius, f in [0,1] from pole to margin.
                       Must not depend on theta at f == 0, where the patch
                       converges to a single pole vertex.
    off_in / off_out -> radial offsets of the two faces (off_out > off_in);
                        their difference is the sheet thickness.

    Closed by construction: outer face + inner face (reversed) + a band joining
    them around the margin.
    """
    thetas = np.linspace(0, TAU, nt, endpoint=False)

    def point(f, th, off):
        ph = f * phi_max(th)
        r = r_mid(f, th) + off
        return [r * np.sin(ph) * np.cos(th), r * np.sin(ph) * np.sin(th), r * np.cos(ph)]

    verts = [point(0.0, 0.0, off_out)]          # outer pole
    out_start = len(verts)
    for k in range(1, nf + 1):
        for th in thetas:
            verts.append(point(k / nf, th, off_out))
    in_pole = len(verts)
    verts.append(point(0.0, 0.0, off_in))       # inner pole
    in_start = len(verts)
    for k in range(1, nf + 1):
        for th in thetas:
            verts.append(point(k / nf, th, off_in))

    def O(k, j):
        return out_start + (k - 1) * nt + (j % nt)

    def I(k, j):
        return in_start + (k - 1) * nt + (j % nt)

    faces = []
    for j in range(nt):                                     # outer pole fan
        faces.append([0, O(1, j), O(1, j + 1)])
    for k in range(1, nf):                                  # outer quads
        for j in range(nt):
            faces.append([O(k, j), O(k + 1, j), O(k + 1, j + 1)])
            faces.append([O(k, j), O(k + 1, j + 1), O(k, j + 1)])
    for j in range(nt):                                     # inner pole fan
        faces.append([in_pole, I(1, j + 1), I(1, j)])
    for k in range(1, nf):                                  # inner quads
        for j in range(nt):
            faces.append([I(k, j), I(k + 1, j + 1), I(k + 1, j)])
            faces.append([I(k, j), I(k, j + 1), I(k + 1, j + 1)])
    for j in range(nt):                                     # margin band
        faces.append([O(nf, j), O(nf, j + 1), I(nf, j + 1)])
        faces.append([O(nf, j), I(nf, j + 1), I(nf, j)])

    return trimesh.Trimesh(vertices=np.array(verts), faces=np.array(faces), process=False)


def solid_blade(angle, ri, top_z, bot_z, thickness, r_offset=0.0):
    """
    One lamella as a closed prism: the blade's (r, z) outline extruded
    tangentially. Real gills are thin but not zero-thickness, and giving them
    volume is what lets them show up as filled slivers in the cross-section.

    `top_z` / `bot_z` are per-sample heights along `ri`, so a blade can follow
    whatever underside the cap actually has -- including the tilted, eccentric
    undersides of the shelf-forming species.
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
                verts.append([ri[j] * ca + ox + r_offset * ca,
                              ri[j] * sa + oy + r_offset * sa, row_z[j]])

    def V(side, row, j):
        return side * (2 * m) + row * m + j

    faces = []

    def quad(a_, b_, c_, d_):
        faces.extend([[a_, b_, d_], [a_, d_, c_]])

    for side in (0, 1):                                   # the two flat faces
        for j in range(m - 1):
            quad(V(side, 0, j), V(side, 0, j + 1), V(side, 1, j), V(side, 1, j + 1))
    for row in (0, 1):                                    # top and bottom edges
        for j in range(m - 1):
            quad(V(0, row, j), V(0, row, j + 1), V(1, row, j), V(1, row, j + 1))
    for j in (0, m - 1):                                  # inner and outer edges
        quad(V(0, 0, j), V(0, 1, j), V(1, 0, j), V(1, 1, j))

    return trimesh.Trimesh(vertices=np.array(verts), faces=np.array(faces), process=False)


def lumpy_sphere(radius, bumps, seed, subdivisions=3):
    """
    An icosphere pushed around by a few low-frequency lobes -- the base for
    anything irregular and swollen rather than symmetric (smut galls, the core
    of a tooth fungus). Stays watertight because only vertex positions move.

    `bumps` is [(freq_vector, amplitude), ...]; each contributes a smooth
    sinusoidal swelling, so the result is organic without being noisy.
    """
    mesh = trimesh.creation.icosphere(subdivisions=subdivisions, radius=1.0)
    v = mesh.vertices.copy()
    rng = np.random.default_rng(seed)
    disp = np.zeros(len(v))
    for freq, amp in bumps:
        phase = rng.uniform(0, TAU, 3)
        disp += amp * np.sin(v[:, 0] * freq[0] + phase[0]) \
                    * np.cos(v[:, 1] * freq[1] + phase[1]) \
                    * np.cos(v[:, 2] * freq[2] + phase[2])
    scale = (1.0 + disp)[:, None]
    mesh.vertices = v * scale * radius
    return mesh


def spine(length, base_r, seg=12, taper=2.0):
    """A pendant tooth: a tapered cone closed at both ends, tip pointing -z."""
    t = np.linspace(0.0, 1.0, 10)
    r = base_r * (1.0 - t) ** taper
    z = -length * t
    return revolve(np.concatenate([[0.0], r]), np.concatenate([[z[0]], z]), seg=seg)


def srgb(hex_color, alpha=1.0):
    """
    Convert an sRGB hex colour to the linear factor glTF actually wants.

    glTF baseColorFactor is defined in LINEAR space, but every colour humans
    quote -- including the capColor on each database record -- is sRGB. Passing
    the sRGB value through unconverted renders everything washed out and
    oversaturated (a dark yellow-brown shiitake cap comes out acid yellow).
    """
    h = hex_color.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i:i + 2], 16) / 255.0
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return out + [alpha]


def finalize(mesh, color, roughness):
    """Orient faces outward and attach a PBR material. color is LINEAR [r,g,b,a]."""
    trimesh.repair.fix_normals(mesh)
    mesh.visual = trimesh.visual.TextureVisuals(
        material=PBRMaterial(baseColorFactor=color, roughnessFactor=roughness,
                             metallicFactor=0.0)
    )
    return mesh


def default_out(name):
    return os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                        "public", "models", name)


def check_parts(parts, indent=""):
    """Report on every part and return the names of any that are not closed."""
    failed = []
    for name, mesh in parts:
        ok = mesh.is_watertight and mesh.is_winding_consistent
        try:
            bodies = mesh.body_count        # needs scipy; purely informational
        except Exception:
            bodies = "?"
        print(f"{indent}{'OK  ' if ok else 'FAIL'} {name:<18} tris={len(mesh.faces):>6} "
              f"watertight={mesh.is_watertight} winding={mesh.is_winding_consistent} "
              f"bodies={bodies}")
        if not ok:
            failed.append(name)
    return failed


def write_glb(parts, out_path):
    """Assemble the parts into a scene and write a .glb. Assumes already checked."""
    scene = trimesh.Scene()
    for name, mesh in parts:
        scene.add_geometry(mesh, node_name=name, geom_name=name)
    scene.rezero()

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    # include_normals is essential, not cosmetic: glTF without a NORMAL
    # attribute makes three.js fall back to flat shading, which facets every
    # curved surface and puts a hard starburst wherever a pole fan converges.
    scene.export(out_path, include_normals=True)
    print(f"    -> {os.path.basename(out_path)}  "
          f"{round(os.path.getsize(out_path) / 1024, 1)} KB")


def verify_and_export(parts, default_name):
    """
    Check every part is closed, then assemble and export a .glb.

    `parts` is [(node_name, mesh), ...]. Node names matter -- the viewer's
    model registry lists them in `solidParts` to decide what gets a filled cut
    face, so they must stay stable once referenced.
    """
    parser = argparse.ArgumentParser()
    parser.add_argument("-o", "--out", default=default_out(default_name))
    args = parser.parse_args()

    failed = check_parts(parts)
    if failed:
        sys.exit(f"\nRefusing to export: {', '.join(failed)} not closed. "
                 "The viewer's stencil cross-section needs watertight parts.")
    write_glb(parts, args.out)
