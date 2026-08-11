"""
Reusable body plans for the parametric species models.

Fungal fruiting bodies fall into a handful of construction types, and these are
they. Each builder returns [(node_name, mesh), ...] with materials already
attached, ready for mesh_kit.verify_and_export.

Node names matter: the viewer's model registry lists them in `solidParts` to
decide what gets a filled cut face, so they must stay stable once referenced.

Proportions are driven from each species' own database record (capDiameter and
stipeLength, in cm) via `units_per_cm`, so a king oyster really is mostly stipe
and a shaggy ink cap really is that tall, rather than everything defaulting to
button-mushroom shape.
"""
import numpy as np
import trimesh

from mesh_kit import TAU, revolve, shell_cap, solid_blade, lumpy_sphere, spine, finalize


def units_per_cm(cap_diameter_cm):
    """Model units per cm, fixing the cap radius at 1.0 unit."""
    return 2.0 / cap_diameter_cm


# --------------------------------------------------------------------------
# Gilled agarics: a cap of revolution over radial lamellae and a central stipe.
# --------------------------------------------------------------------------
def gilled(dome_z, under_rise, rim_thick, stipe_len, stipe_r, stipe_flare,
           n_gills, gill_depth, cap_color, stipe_color, gill_color,
           annulus=None, volva=None, cap_warp=None, gill_inner=0.34,
           gill_outer=0.95, seg=96, cap_rough=0.85, lod=1.0):
    """
    dome_z(rr)      -> height of the cap's upper surface above the rim
    under_rise      -> how far the underside lifts toward the centre (flesh depth)
    annulus         -> (major_r, minor_r, z, color) or None
    volva           -> (radius, height, z, color) or None -- the basal cup
    """
    R = 1.0
    seg = max(int(seg * lod), 16)
    n_up, n_dn = max(int(34*lod), 10), max(int(30*lod), 9)
    r_dome = np.linspace(0.0, R, n_up)
    z_dome = dome_z(r_dome)

    def under(rr):
        return -rim_thick + under_rise * (1 - (np.clip(rr, 0, R) / R) ** 1.6)

    # Margin: a short vertical run tying the dome's rim to the underside's rim.
    # Without it the two sheets never meet and the cap is not closed.
    r_under = np.linspace(R, 0.0, n_dn)
    rim_z = np.linspace(z_dome[-1], -rim_thick, 4)[1:-1]
    cap = revolve(
        np.concatenate([r_dome, np.full(len(rim_z), R), r_under]),
        np.concatenate([z_dome, rim_z, under(r_under)]),
        seg=seg, warp=cap_warp,
    )

    zs = np.linspace(under(0.0) * 0.9, -stipe_len, max(int(26*lod), 8))
    rad = stipe_r * (1.0 + stipe_flare * (np.linspace(0, 1, len(zs)) ** 3))
    stipe = revolve(np.concatenate([[0.0], rad, [0.0]]),
                    np.concatenate([[zs[0]], zs, [zs[-1]]]), seg=max(int(64*lod), 14))

    ri = np.linspace(gill_inner, gill_outer, 8)
    top_z = under(ri)
    depth = gill_depth * (1 - (ri - gill_inner) / (gill_outer - gill_inner) * 0.4)
    blades = [solid_blade(TAU * k / n_gills, ri, top_z, top_z - depth, 0.012)
              for k in range(n_gills)]
    gills = trimesh.util.concatenate(blades)

    parts = [
        ("pileus_cap", finalize(cap, cap_color, cap_rough)),
        ("stipe_stem", finalize(stipe, stipe_color, 0.9)),
        ("lamellae_gills", finalize(gills, gill_color, 0.95)),
    ]
    if annulus:
        major, minor, z, color = annulus
        ring = trimesh.creation.torus(major_radius=major, minor_radius=minor,
                                      major_sections=64, minor_sections=16)
        ring.apply_translation([0, 0, z])
        parts.append(("annulus_ring", finalize(ring, color, 0.9)))
    if volva:
        vr, vh, vz, color = volva
        # A cup: up the outside, across the rim, back down the inside, closed on
        # the axis at both ends so the whole thing is one hollow closed shell.
        t = np.linspace(0, 1, 14)
        out_r = vr * (0.50 + 0.50 * np.sin(t * np.pi * 0.5) ** 0.7)
        out_z = vz + vh * t
        in_r = (out_r * 0.80)[::-1]
        in_z = (out_z + 0.06 * vh)[::-1]
        cup = revolve(
            np.concatenate([[0.0], out_r, in_r, [0.0]]),
            np.concatenate([[out_z[0]], out_z, in_z, [in_z[-1]]]), seg=48)
        parts.append(("volva_cup", finalize(cup, color, 0.9)))
    return parts


# --------------------------------------------------------------------------
# Shelf / bracket forms: an eccentric fan attached along one side.
# --------------------------------------------------------------------------
def _fan_outline(phi0, eccentricity, lobes):
    """
    Outline of a fan: `eccentricity` shortens one side so the body reaches out
    from its attachment rather than surrounding it, and `lobes` waves the margin.
    """
    def phi_max(theta):
        base = phi0 * (eccentricity + (1.0 - eccentricity) * (1 + np.cos(theta)) / 2)
        return base * (1.0 + lobes * np.sin(3 * theta + 0.5))
    return phi_max


def _fan(phi0, eccentricity, lobes, flatten, off_in, off_out, nf=26, nt=104,
         ruffle=0.0):
    """A thick fan-shaped sheet; `flatten` squashes the patch toward a shelf."""
    phi_max = _fan_outline(phi0, eccentricity, lobes)

    def r_mid(f, theta):
        if ruffle == 0.0:
            return 1.0
        env = (f ** 1.3) * ((1.0 - f) ** 0.7) / 0.22
        return 1.0 + ruffle * env * np.cos(6 * theta)

    mesh = shell_cap(phi_max, r_mid, off_in, off_out, nf=nf, nt=nt)
    mesh.apply_transform(np.diag([1.0, 1.0, flatten, 1.0]))
    return mesh


def _stub(length, radius, direction, origin, seg=40):
    """A short tapered stalk running from `origin` along `direction`."""
    t = np.linspace(0, 1, 12)
    rad = radius * (1.0 + 0.28 * t ** 2)
    zs = -length * t
    mesh = revolve(np.concatenate([[0.0], rad, [0.0]]),
                   np.concatenate([[zs[0]], zs, [zs[-1]]]), seg=seg)
    # revolve builds along -z; rotate that onto the requested direction.
    d = np.asarray(direction, dtype=float)
    d /= np.linalg.norm(d)
    axis = np.cross([0, 0, -1.0], d)
    if np.linalg.norm(axis) > 1e-9:
        angle = np.arccos(np.clip(np.dot([0, 0, -1.0], d), -1, 1))
        mesh.apply_transform(trimesh.transformations.rotation_matrix(angle, axis))
    mesh.apply_translation(origin)
    return mesh


def shelf(stipe_len, stipe_r, n_gills, gill_depth, cap_color, gill_color,
          stipe_color, thickness=0.09, phi0=1.15, eccentricity=0.20,
          flatten=0.62, tilt_deg=16, nf=26, nt=104):
    """
    Oyster-type basidiocarp: a laterally attached fan with decurrent gills
    running onto a rudimentary stipe at the narrow heel.

    The patch is used the right way up -- convex above, concave below -- so no
    flip is needed; a cap is exactly what shell_cap already describes. Strong
    eccentricity is what turns the circle into a fan.
    """
    phi_max = _fan_outline(phi0, eccentricity, 0.10)
    cap = _fan(phi0, eccentricity, 0.10, flatten, -thickness, 0.0)

    # Gills are built in the fan's own frame, where its underside is analytic:
    # the inner face of the patch at radius (1 - thickness), flattened in z.
    # Sampling the mesh instead would need a ray-tracing backend and would only
    # approximate what the parametrisation already states exactly.
    r_in = 1.0 - thickness
    blades = []
    for k in range(n_gills):
        a = TAU * k / n_gills
        ph = np.linspace(0.10, 0.96, 8) * phi_max(a)
        rho = r_in * np.sin(ph)                  # cylindrical radius
        top = flatten * r_in * np.cos(ph)        # underside height
        blades.append(solid_blade(a, rho, top, top - gill_depth, 0.011))
    gills = trimesh.util.concatenate(blades)

    # The heel: the short side of the outline, where the fungus meets its wood.
    ph_a = phi_max(np.pi)
    heel = np.array([-np.sin(ph_a) * r_in, 0.0, flatten * r_in * np.cos(ph_a)])
    stipe = _stub(stipe_len, stipe_r, [-0.42, 0.0, -0.91], heel)

    # The viewer maps build -y toward the camera, so a pitch about X presents
    # the upper surface instead of showing the fan edge-on.
    pitch = trimesh.transformations.rotation_matrix(np.radians(30), [1, 0, 0])
    tilt = trimesh.transformations.rotation_matrix(np.radians(tilt_deg), [0, 1, 0])
    for m in (cap, gills, stipe):
        m.apply_transform(pitch @ tilt)

    return [
        ("pileus_cap", finalize(cap, cap_color, 0.82)),
        ("lamellae_gills", finalize(gills, gill_color, 0.94)),
        ("stipe_stem", finalize(stipe, stipe_color, 0.9)),
    ]




def bracket(stalk_len, stalk_r, crust_color, pore_color, stalk_color,
            thickness=0.20, phi0=1.05, eccentricity=0.30, flatten=0.30, nf=24, nt=96):
    """
    Perennial polypore: a lacquered upper crust over a pale pore surface,
    on a lateral stalk. The two plies distinguish the surfaces -- the pore
    layer is where the hymenium sits, and it is a different colour and texture
    from the varnished top.
    """
    # Used the right way up, like the oyster: the crust ply is the outer
    # (upper) face and the poroid ply the inner (lower) one, which is where a
    # bracket's hymenium actually sits. Only a slight droop is applied.
    phi_max = _fan_outline(phi0, eccentricity, 0.07)
    crust = _fan(phi0, eccentricity, 0.07, flatten, 0.0, thickness * 0.62, nf=nf, nt=nt)
    pores = _fan(phi0, eccentricity, 0.07, flatten, -thickness * 0.38, 0.0, nf=nf, nt=nt)

    ph_a = phi_max(np.pi)
    heel = np.array([-np.sin(ph_a), 0.0, flatten * np.cos(ph_a)])
    stalk = _stub(stalk_len, stalk_r, [-0.72, 0.0, -0.69], heel)

    pitch = trimesh.transformations.rotation_matrix(np.radians(34), [1, 0, 0])
    tilt = trimesh.transformations.rotation_matrix(np.radians(12), [0, 1, 0])
    for m in (crust, pores, stalk):
        m.apply_transform(pitch @ tilt)

    return [
        ("pileus_crust", finalize(crust, crust_color, 0.22)),   # varnished
        ("pore_surface", finalize(pores, pore_color, 0.95)),    # matte hymenium
        ("stipe_stem", finalize(stalk, stalk_color, 0.35)),
    ]


# --------------------------------------------------------------------------
# Clustered and irregular forms.
# --------------------------------------------------------------------------
def frondose(n_fronds, stipe_len, cap_color, stipe_color, pore_color):
    """
    Maitake-type rosette: many overlapping spoon-shaped caps arising from a
    branched basal stipe. Each frond is its own closed fan.
    """
    fronds, pores = [], []
    rng = np.random.default_rng(7)
    for k in range(n_fronds):
        a = TAU * k / n_fronds + rng.uniform(-0.15, 0.15)
        lift = 0.10 + 0.42 * (k % 3) / 2.0
        reach = 0.62 + 0.26 * ((k + 1) % 3) / 2.0
        top = _fan(0.95, 0.30, 0.12, 0.40, 0.0, 0.055, nf=12, nt=48)
        bot = _fan(0.95, 0.30, 0.12, 0.40, -0.05, 0.0, nf=12, nt=48)
        M = (trimesh.transformations.rotation_matrix(a, [0, 0, 1])
             @ trimesh.transformations.rotation_matrix(np.radians(108), [1, 0, 0])
             @ trimesh.transformations.rotation_matrix(np.pi, [1, 0, 0]))
        for m, bucket in ((top, fronds), (bot, pores)):
            m.apply_transform(M)
            m.apply_transform(np.diag([reach, reach, reach, 1.0]))
            m.apply_translation([0.30 * np.cos(a), 0.30 * np.sin(a), lift])
            bucket.append(m)

    caps = trimesh.util.concatenate(fronds)
    pore = trimesh.util.concatenate(pores)
    zs = np.linspace(0.18, -stipe_len, 14)
    rad = 0.20 * (1.0 + 0.5 * np.linspace(0, 1, len(zs)) ** 2)
    base = revolve(np.concatenate([[0.0], rad, [0.0]]),
                   np.concatenate([[zs[0]], zs, [zs[-1]]]), seg=48)

    return [
        ("pileus_fronds", finalize(caps, cap_color, 0.86)),
        ("pore_surface", finalize(pore, pore_color, 0.95)),
        ("stipe_stem", finalize(base, stipe_color, 0.9)),
    ]


def toothed(n_spines, spine_len, mass_color, spine_color):
    """
    Hericium: an irregular cushion whose entire lower surface hangs in pendant
    spines. There is no cap and no gills -- the teeth are the hymenophore.
    """
    core = lumpy_sphere(0.62, [((2.1, 1.7, 2.4), 0.16), ((3.6, 4.1, 3.2), 0.07)], seed=3)
    core.apply_transform(np.diag([1.0, 0.88, 0.86, 1.0]))

    rng = np.random.default_rng(11)
    teeth = []
    for _ in range(n_spines):
        # Sample the lower hemisphere, where the teeth actually hang from.
        u = rng.uniform(0, TAU)
        v = rng.uniform(0.12, 1.0)
        phi = np.arccos(1 - v)          # biased toward the underside
        d = np.array([np.sin(phi) * np.cos(u), np.sin(phi) * np.sin(u), -np.cos(phi)])
        p = d * 0.55
        length = spine_len * rng.uniform(0.55, 1.0)
        t = spine(length, 0.032 * rng.uniform(0.8, 1.2), seg=10)
        t.apply_translation(p)
        teeth.append(t)

    return [
        ("context_mass", finalize(core, mass_color, 0.9)),
        ("hymenial_spines", finalize(trimesh.util.concatenate(teeth), spine_color, 0.9)),
    ]


def ruffled(n_lobes, color):
    """
    Tremella: a rosette of thin, heavily undulating gelatinous lobes. Built from
    the same sheet primitive as the wood ear, but with far stronger ruffling and
    several lobes radiating from a common base.
    """
    rng = np.random.default_rng(5)
    lobes = []
    for k in range(n_lobes):
        a = TAU * k / n_lobes + rng.uniform(-0.2, 0.2)
        lobe = _fan(1.15, 0.55, 0.16, 0.85, -0.022, 0.022, nf=16, nt=64, ruffle=0.20)
        M = (trimesh.transformations.rotation_matrix(a, [0, 0, 1])
             @ trimesh.transformations.rotation_matrix(np.radians(72 + 26 * (k % 3)), [1, 0, 0]))
        lobe.apply_transform(M)
        s = 0.72 + 0.22 * ((k + 1) % 3) / 2.0
        lobe.apply_transform(np.diag([s, s, s, 1.0]))
        lobe.apply_translation([0.20 * np.cos(a), 0.20 * np.sin(a), 0.30 + 0.10 * (k % 2)])
        lobes.append(lobe)
    return [("gelatinous_lobes", finalize(trimesh.util.concatenate(lobes), color, 0.34))]


def puffball(sterile_frac, peridium_color, gleba_color):
    """
    Calvatia: a near-spherical body narrowing to a sterile base. Modelled as a
    thin outer peridium over a solid gleba, so sectioning it shows the spore
    mass inside its wall rather than an empty shell.
    """
    t = np.linspace(0, np.pi, 44)
    # Globose above, pinched into a sterile base below.
    prof_r = np.sin(t) * (1.0 - 0.42 * np.clip(np.cos(t), 0, 1) ** 1.6)
    prof_z = -np.cos(t) * (1.0 - sterile_frac * np.clip(np.cos(t), 0, 1))

    wall = 0.055
    outer = revolve(prof_r, prof_z, seg=88)
    inner = revolve(prof_r * (1 - wall), prof_z * (1 - wall * 0.6), seg=88)
    return [
        ("peridium_wall", finalize(outer, peridium_color, 0.88)),
        ("gleba_mass", finalize(inner, gleba_color, 0.95)),
    ]


def morel(cap_h, stipe_len, stipe_r, n_ridges, cap_color):
    """
    Morchella: a pitted, ridged conical cap fused to the stipe, and -- the
    diagnostic feature -- hollow from the top of the cap right through the base.

    The profile runs up the outside and back down the inside, meeting at the
    bottom, so revolving it yields one closed hollow shell. That is what makes
    the cross-section worth looking at for this genus. Because it is a single
    continuous shell, cap and stipe necessarily share one material.
    """
    n = 34
    t = np.linspace(0, 1, n)
    # Outside: conical cap over a slightly waisted stipe.
    cap_r = 1.0 * np.sin(np.pi * 0.5 * (1 - t) ** 0.85)
    out_r = np.concatenate([cap_r, stipe_r * (1.0 + 0.22 * np.linspace(0, 1, 14) ** 2)])
    out_z = np.concatenate([cap_h * (1 - t), -stipe_len * np.linspace(0, 1, 14)])

    wall = 0.10
    in_r = np.clip(out_r - wall, 0.02, None)[::-1]
    in_z = (out_z + np.concatenate([np.full(n, -wall * 0.8), np.full(14, 0.0)]))[::-1]

    prof_r = np.concatenate([[0.0], out_r, in_r, [0.0]])
    prof_z = np.concatenate([[out_z[0]], out_z, in_z, [in_z[-1]]])

    def warp(j, theta):
        """Pits and ridges, only over the cap portion and dying out at the apex."""
        if j < 1 or j > n:
            return (0.0, 0.0)
        f = (j - 1) / max(n - 1, 1)
        env = np.sin(np.pi * np.clip(f, 0, 1)) ** 0.8
        return (0.16 * env * np.cos(n_ridges * theta) * np.cos(7.5 * np.pi * f), 0.0)

    body = revolve(prof_r, prof_z, seg=96, warp=warp)
    return [("ascocarp_body", finalize(body, cap_color, 0.86))]


def gall(n_lobes, gall_color, husk_color):
    """
    Ustilago galls: swollen tumours replacing host kernels. Irregular, fused
    lobes rather than anything with a fungal body plan of its own.
    """
    rng = np.random.default_rng(19)
    lobes = []
    for k in range(n_lobes):
        r = 0.42 + 0.20 * rng.random()
        lobe = lumpy_sphere(r, [((2.4, 2.8, 2.2), 0.20), ((5.1, 4.4, 5.6), 0.08)],
                            seed=40 + k)
        a = TAU * k / n_lobes
        lobe.apply_translation([0.36 * np.cos(a) * rng.uniform(0.7, 1.2),
                                0.30 * np.sin(a) * rng.uniform(0.7, 1.2),
                                0.34 + 0.30 * rng.random()])
        lobes.append(lobe)

    t = np.linspace(0, 1, 18)
    husk_r = 0.55 * (1 - 0.55 * t ** 1.8)
    husk = revolve(np.concatenate([[0.0], husk_r, [0.0]]),
                   np.concatenate([[0.0], t * 0.60, [0.60]]), seg=48)
    return [
        ("smut_galls", finalize(trimesh.util.concatenate(lobes), gall_color, 0.92)),
        ("host_husk", finalize(husk, husk_color, 0.9)),
    ]


# --------------------------------------------------------------------------
# Habit helpers. Many cultivated species fruit in clusters or tiers rather than
# as the solitary basidiocarp the builders above produce, and the habit is
# often the first thing you recognise them by.
# --------------------------------------------------------------------------
def cluster(parts, n, spread, base_z=0.0, seed=1, splay_deg=14, scale_var=0.20):
    """
    Caespitose habit: n individuals from a shared base, leaning outward.
    Members pivot about the base rather than translating, so the stipes fan out
    from one point the way a real cluster does.
    """
    rng = np.random.default_rng(seed)
    grouped = {}
    for k in range(n):
        a = TAU * k / n + rng.uniform(-0.35, 0.35)
        r = spread * (0.25 + 0.75 * rng.random())
        s = 1.0 - scale_var * rng.random()
        lean = np.radians(splay_deg) * (r / max(spread, 1e-6))
        axis = [-np.sin(a), np.cos(a), 0.0]
        M = (trimesh.transformations.translation_matrix([r*np.cos(a), r*np.sin(a), 0.0])
             @ trimesh.transformations.rotation_matrix(lean, axis, point=[0, 0, base_z])
             @ np.diag([s, s, s, 1.0]))
        for name, mesh in parts:
            m = mesh.copy(); m.apply_transform(M)
            grouped.setdefault(name, []).append(m)
    return [(nm, trimesh.util.concatenate(ms)) for nm, ms in grouped.items()]


def imbricate(parts, n, rise, spread, seed=2, scale_var=0.30, yaw=1.3, step=0.0):
    """
    Tiered shelves, each smaller and turned from the one below. `step` walks the
    tiers along -x as they rise, the way overlapping brackets emerge from a
    vertical substrate face; without it they stack concentrically into a blob.
    """
    rng = np.random.default_rng(seed)
    grouped = {}
    for k in range(n):
        f = k / max(n - 1, 1)
        s = 1.0 - scale_var * f * rng.uniform(0.7, 1.0)
        a = (f - 0.5) * yaw + rng.uniform(-0.20, 0.20)
        M = (trimesh.transformations.translation_matrix(
                [-step*k + spread*rng.uniform(-0.18, 0.18),
                 spread*rng.uniform(-0.18, 0.18), k*rise])
             @ trimesh.transformations.rotation_matrix(a, [0, 0, 1])
             @ np.diag([s, s, s, 1.0]))
        for name, mesh in parts:
            m = mesh.copy(); m.apply_transform(M)
            grouped.setdefault(name, []).append(m)
    return [(nm, trimesh.util.concatenate(ms)) for nm, ms in grouped.items()]


# --------------------------------------------------------------------------
# Further body plans.
# --------------------------------------------------------------------------
def cauliflower(n_lobes, lobe_color, base_color, base_len=0.55, seed=4):
    """
    Sparassis: a globose head built entirely from flattened, crisped lobes.
    There is no pileus and no hymenophore surface of its own -- the fertile
    tissue is on the underside of the lobes -- so the lobes are the organism.
    """
    rng = np.random.default_rng(seed)
    lobes = []
    for k in range(n_lobes):
        lobe = _fan(1.20, 0.50, 0.20, 0.80, -0.020, 0.020, nf=9, nt=34, ruffle=0.26)
        u = rng.uniform(0, TAU)
        v = rng.uniform(-0.35, 1.0)
        phi = np.arccos(np.clip(v, -1, 1))
        M = (trimesh.transformations.rotation_matrix(u, [0, 0, 1])
             @ trimesh.transformations.rotation_matrix(phi, [1, 0, 0]))
        lobe.apply_transform(M)
        s = 0.34 + 0.20 * rng.random()
        lobe.apply_transform(np.diag([s, s, s, 1.0]))
        d = 0.42 * rng.random() ** 0.5
        lobe.apply_translation([d*np.cos(u), d*np.sin(u), 0.52 + 0.42*np.cos(phi)*rng.uniform(0.4, 1.0)])
        lobes.append(lobe)

    t = np.linspace(0, 1, 14)
    rad = 0.30 * (1 + 0.45 * t ** 2)
    base = revolve(np.concatenate([[0.0], rad, [0.0]]),
                   np.concatenate([[0.10], 0.10 - base_len*t, [0.10 - base_len]]), seg=40)
    return [
        ("crisped_lobes", finalize(trimesh.util.concatenate(lobes), lobe_color, 0.80)),
        ("rooting_base", finalize(base, base_color, 0.90)),
    ]


def clavate(n_clubs, club_len, club_r, stroma_color, perithecia_color,
            n_perithecia=150, seed=6):
    """
    Cordyceps: unbranched clavate stromata, no pileus and no gills. The fertile
    tissue is the perithecia embedded over the swollen upper half, which is what
    gives a mature stroma its pimpled outline.
    """
    rng = np.random.default_rng(seed)
    clubs, bumps = [], []
    for k in range(n_clubs):
        t = np.linspace(0, 1, 26)
        rad = club_r * (0.42 + 0.58 * np.sin(np.pi * np.clip(t*1.05, 0, 1)) ** 0.55)
        rad[-1] = 0.0
        prof_r = np.concatenate([[0.0], rad])
        prof_z = np.concatenate([[0.0], club_len * t])
        club = revolve(prof_r, prof_z, seg=32)

        a = TAU * k / n_clubs + rng.uniform(-0.3, 0.3)
        d = 0.30 * rng.random() ** 0.5
        lean = np.radians(rng.uniform(2, 15))
        M = (trimesh.transformations.translation_matrix([d*np.cos(a), d*np.sin(a), 0.0])
             @ trimesh.transformations.rotation_matrix(lean, [-np.sin(a), np.cos(a), 0.0]))
        club.apply_transform(M)
        clubs.append(club)

        for _ in range(n_perithecia // n_clubs):
            f = rng.uniform(0.42, 0.96)                  # upper half only
            th = rng.uniform(0, TAU)
            r_at = club_r * (0.42 + 0.58 * np.sin(np.pi * min(f*1.05, 1.0)) ** 0.55)
            p = trimesh.creation.icosphere(subdivisions=1, radius=1.0)
            p.apply_transform(np.diag([0.030, 0.030, 0.042, 1.0]))
            p.apply_translation([r_at*0.93*np.cos(th), r_at*0.93*np.sin(th), club_len*f])
            p.apply_transform(M)
            bumps.append(p)

    return [
        ("clavate_stroma", finalize(trimesh.util.concatenate(clubs), stroma_color, 0.78)),
        ("perithecia", finalize(trimesh.util.concatenate(bumps), perithecia_color, 0.72)),
    ]


def split_fan(n_folds, cap_color, fold_color, phi0=1.10, ecc=0.26, flatten=0.55,
              thickness=0.085, tilt_deg=-52):
    """
    Schizophyllum: a small sessile fan whose 'gills' are not true lamellae but
    folds split longitudinally down their length -- the character the genus is
    named for. Each fold is therefore modelled as two half-blades leaning apart,
    not one blade.
    """
    phi_max = _fan_outline(phi0, ecc, 0.16)
    cap = _fan(phi0, ecc, 0.16, flatten, -thickness, 0.0)
    r_in = 1.0 - thickness
    halves = []
    for k in range(n_folds):
        a = TAU * k / n_folds
        ph = np.linspace(0.12, 0.94, 7) * phi_max(a)
        rho = r_in * np.sin(ph)
        top = flatten * r_in * np.cos(ph)
        for side in (-1, 1):
            b = solid_blade(a, rho, top, top - 0.115, 0.011)
            # lean the two halves apart so the split reads from below
            b.apply_transform(trimesh.transformations.rotation_matrix(
                side * 0.115, [np.cos(a), np.sin(a), 0.0]))
            halves.append(b)
    folds = trimesh.util.concatenate(halves)

    pitch = trimesh.transformations.rotation_matrix(np.radians(tilt_deg), [1, 0, 0])
    cap.apply_transform(pitch); folds.apply_transform(pitch)
    return [
        ("pileus_cap", finalize(cap, cap_color, 0.90)),
        ("split_folds", finalize(folds, fold_color, 0.92)),
    ]


# --------------------------------------------------------------------------
# Microscopic body plans. These are NOT interchangeable with the branching
# hyphal model: an Aspergillus conidial head and a Rhizopus sporangium are the
# structures those genera are identified by, and a generic mycelium would be
# wrong for both.
# --------------------------------------------------------------------------
def conidiophore(stipe_len, stipe_r, vesicle_r, n_phialides, chain_len,
                 hypha_color, vesicle_color, conidia_color, seed=8):
    """
    Aspergillus: a foot cell in the substrate, an unbranched aseptate stipe, a
    globose vesicle, and phialides radiating over the WHOLE vesicle carrying
    basipetal chains of conidia. Phialides are placed on a Fibonacci sphere so
    they cover it evenly rather than banding.
    """
    rng = np.random.default_rng(seed)
    parts_h, parts_v, parts_c = [], [], []

    foot = revolve(np.concatenate([[0.0], np.full(8, stipe_r*1.35), [0.0]]),
                   np.concatenate([[0.0], np.linspace(0, -0.55, 8), [-0.55]]), seg=14)
    foot.apply_transform(trimesh.transformations.rotation_matrix(np.pi/2, [1, 0, 0]))
    parts_h.append(foot)

    t = np.linspace(0, 1, 10)
    stipe = revolve(np.concatenate([[0.0], stipe_r*(1 + 0.35*t**3), [0.0]]),
                    np.concatenate([[0.0], stipe_len*t, [stipe_len]]), seg=16)
    parts_h.append(stipe)

    ves = trimesh.creation.icosphere(subdivisions=2, radius=vesicle_r)
    ves.apply_translation([0, 0, stipe_len + vesicle_r*0.72])
    parts_v.append(ves)
    cz = stipe_len + vesicle_r*0.72

    golden = np.pi * (3 - np.sqrt(5))
    for i in range(n_phialides):
        y = 1 - 2*i/max(n_phialides-1, 1)
        rad = np.sqrt(max(1 - y*y, 0))
        th = golden * i
        d = np.array([rad*np.cos(th), rad*np.sin(th), y])
        if d[2] < -0.55:                       # the stipe occupies the base
            continue
        ph_len = vesicle_r * 0.62
        ph = revolve(np.concatenate([[0.0], np.linspace(vesicle_r*0.16, vesicle_r*0.07, 6), [0.0]]),
                     np.concatenate([[0.0], np.linspace(0, -ph_len, 6), [-ph_len]]), seg=8)
        axis = np.cross([0, 0, -1.0], d)
        if np.linalg.norm(axis) > 1e-9:
            ang = np.arccos(np.clip(np.dot([0, 0, -1.0], d), -1, 1))
            ph.apply_transform(trimesh.transformations.rotation_matrix(ang, axis))
        ph.apply_translation(d*vesicle_r*0.94 + [0, 0, cz])
        parts_v.append(ph)

        for j in range(chain_len):
            c = trimesh.creation.icosphere(subdivisions=1, radius=vesicle_r*0.115)
            off = vesicle_r*(0.94 + 0.62) + j*vesicle_r*0.245
            jit = (rng.random(3) - 0.5) * vesicle_r*0.06
            c.apply_translation(d*off + [0, 0, cz] + jit)
            parts_c.append(c)

    return [
        ("conidiophore_stipe", finalize(trimesh.util.concatenate(parts_h), hypha_color, 0.70)),
        ("vesicle_phialides", finalize(trimesh.util.concatenate(parts_v), vesicle_color, 0.66)),
        ("conidial_chains", finalize(trimesh.util.concatenate(parts_c), conidia_color, 0.60)),
    ]


def sporangiophore(hypha_color, sporangium_color, columella_color, seed=10):
    """
    Rhizopus: arching stolons that root at nodes by tufts of rhizoids, with
    sporangiophores rising opposite each node and bearing a globose sporangium
    over a columella. Coenocytic -- deliberately no septa anywhere.
    """
    rng = np.random.default_rng(seed)
    hy, sp, col = [], [], []
    nodes = [-1.5, 0.0, 1.5]

    for i in range(len(nodes)-1):
        x0, x1 = nodes[i], nodes[i+1]
        n = 16
        for k in range(n-1):
            f0, f1 = k/(n-1), (k+1)/(n-1)
            p0 = np.array([x0 + (x1-x0)*f0, 0, 0.55*np.sin(np.pi*f0)])
            p1 = np.array([x0 + (x1-x0)*f1, 0, 0.55*np.sin(np.pi*f1)])
            d = p1 - p0; L = np.linalg.norm(d)
            seg = revolve(np.concatenate([[0.0], np.full(4, 0.055), [0.0]]),
                          np.concatenate([[0.0], np.linspace(0, -L, 4), [-L]]), seg=10)
            axis = np.cross([0, 0, -1.0], d/L)
            if np.linalg.norm(axis) > 1e-9:
                ang = np.arccos(np.clip(np.dot([0, 0, -1.0], d/L), -1, 1))
                seg.apply_transform(trimesh.transformations.rotation_matrix(ang, axis))
            seg.apply_translation(p0)
            hy.append(seg)

    for nx in nodes:
        for r in range(7):                       # rhizoids: a rooting tuft
            a = TAU*r/7 + rng.uniform(-0.2, 0.2)
            L = 0.22 + 0.16*rng.random()
            rz = spine(L, 0.032, seg=8, taper=1.6)
            rz.apply_transform(trimesh.transformations.rotation_matrix(
                np.radians(rng.uniform(20, 55)), [np.cos(a), np.sin(a), 0.0]))
            rz.apply_translation([nx, 0, 0.0])
            hy.append(rz)

        H = 1.25 + 0.25*rng.random()             # sporangiophore, opposite the rhizoids
        t = np.linspace(0, 1, 8)
        stalk = revolve(np.concatenate([[0.0], 0.052*(1 - 0.2*t), [0.0]]),
                        np.concatenate([[0.0], H*t, [H]]), seg=12)
        stalk.apply_translation([nx, 0, 0.0])
        hy.append(stalk)

        s = trimesh.creation.icosphere(subdivisions=2, radius=0.30)
        s.apply_translation([nx, 0, H + 0.24])
        sp.append(s)
        c = trimesh.creation.icosphere(subdivisions=2, radius=0.17)
        c.apply_transform(np.diag([1.0, 1.0, 0.72, 1.0]))
        c.apply_translation([nx, 0, H + 0.14])
        col.append(c)

    return [
        ("stolons_rhizoids", finalize(trimesh.util.concatenate(hy), hypha_color, 0.70)),
        ("sporangia", finalize(trimesh.util.concatenate(sp), sporangium_color, 0.62)),
        ("columellae", finalize(trimesh.util.concatenate(col), columella_color, 0.68)),
    ]
