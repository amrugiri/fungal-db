"""
Build the parametric .glb morphology models for the macroscopic species.

Each entry maps a species slug to a body plan from morphotypes.py. Proportions
come from that species' own database record -- capDiameter and stipeLength in
cm -- rather than being eyeballed, so the relative shapes carry real
information: a king oyster is mostly stipe, a shaggy ink cap is tall and narrow,
an oyster mushroom barely has a stipe at all. `units_per_cm` fixes cap radius at
1.0 model unit and scales everything else against it.

All models are *parametric / illustrative*, not photogrammetry scans, and every
part is verified watertight before export (see mesh_kit).

Agaricus bisporus and Auricularia auricula-judae have their own dedicated
scripts (build_mushroom.py, build_wood_ear.py) -- they are the most bespoke of
the set and were built before this registry existed.

Usage:
    .img-venv/bin/python scripts/build_species.py              # all
    .img-venv/bin/python scripts/build_species.py lentinula-edodes ...
"""
import sys

import numpy as np

import morphotypes as mt
import shaders as sh
from mesh_kit import (check_parts, write_glb, default_out, srgb,
                      patch_glb_material, hex_rgb, shade_vertices)


def convex(height, power=0.75):
    """Standard convex pileus profile."""
    return lambda rr: height * (1 - rr ** 2) ** power


def bell(height, steep=2.6):
    """Tall ovoid cap: rounded over the top, dropping steeply at the margin."""
    return lambda rr: height * (1 - rr ** steep) ** 0.62


def shaggy(amplitude, rings=9.0, around=10.0, n=40):
    """Upturned scales, as a radial ripple over the cap's upper surface."""
    def warp(j, theta):
        if j >= n:
            return (0.0, 0.0)
        f = j / (n - 1)
        env = np.sin(np.pi * f) ** 0.7          # zero at apex and margin
        return (amplitude * env * np.cos(around * theta) * np.cos(rings * np.pi * f), 0.0)
    return warp


# ---------------------------------------------------------------------------
# slug -> (builder, [solidParts node names])
# ---------------------------------------------------------------------------
def _lentinula():
    u = mt.units_per_cm(8)
    return mt.gilled(
        dome_z=convex(0.44), under_rise=0.20, rim_thick=0.035,
        stipe_len=4 * u, stipe_r=0.17, stipe_flare=0.10,
        n_gills=64, gill_depth=0.10,
        # Deliberate deviation: the record's capColor #8b6914 renders as an
        # olive-gold that contradicts its own fruiting-body text ("Brown scaly
        # cap with white gills"). Following the prose.
        cap_color=srgb("#7a5326"),
        stipe_color=srgb("#d8cbb0"),
        gill_color=srgb("#efe6d2"),
    )


def _volvariella():
    u = mt.units_per_cm(6)
    return mt.gilled(
        dome_z=convex(0.52, 0.68), under_rise=0.22, rim_thick=0.028,
        stipe_len=8 * u, stipe_r=0.15, stipe_flare=0.22,
        n_gills=58, gill_depth=0.11,
        cap_color=srgb("#e8dcc8"),      # DB capColor
        stipe_color=srgb("#f0e8d8"),
        gill_color=srgb("#e3c2b4"),     # pink at maturity
        volva=(0.42, 0.34, -8 * u, srgb("#b8ae9c")),
    )


def _coprinus():
    u = mt.units_per_cm(5)
    return mt.gilled(
        dome_z=bell(1.95, 2.6), under_rise=1.35, rim_thick=0.03,
        stipe_len=10 * u, stipe_r=0.13, stipe_flare=0.35,
        n_gills=72, gill_depth=0.42, gill_inner=0.24, gill_outer=0.9,
        cap_color=srgb("#f5f5f0"),      # DB capColor
        stipe_color=srgb("#f7f4ee"),
        gill_color=srgb("#cfc7c7"),     # greying before deliquescence
        annulus=(0.19, 0.028, -0.55, srgb("#efece5")),
        cap_warp=shaggy(0.085, rings=6.0, around=8.0),
    )


def _eryngii_stipe(f):
    """
    Waisted, measured off the reference photograph on the species page: broad
    where it meets the pileus, pinched about a third of the way down, swelling
    into a bulbous belly, then tapering sharply to a narrow base. The default
    taper misses all four of those.
    """
    return float(np.interp(
        f,
        [0.00, 0.10, 0.26, 0.48, 0.66, 0.84, 0.94, 1.00],
        [0.99, 0.90, 0.85, 0.97, 1.03, 0.94, 0.70, 0.40],
    ))


def _eryngii():
    # Deliberate deviation: the record's 14 cm stipe against a 5 cm cap gives a
    # long thin stem unlike the specimen photographed on this species' own page,
    # where the stipe runs roughly one cap-diameter long and is thick enough to
    # be the bulk of the fruiting body. Proportions taken from that image.
    parts = mt.gilled(
        dome_z=convex(0.26, 1.15), under_rise=0.20, rim_thick=0.085,
        stipe_len=2.05, stipe_r=0.52, stipe_flare=0.0,
        stipe_profile=_eryngii_stipe,
        n_gills=30, gill_depth=0.075, gill_inner=0.55,
        decurrent=0.42,                 # lamellae run well down the stipe
        cap_color=srgb("#d4c4a8"),      # DB capColor
        stipe_color=srgb("#f4efe2"),
        gill_color=srgb("#ece5d6"),
    )
    return parts



# ---------------------------------------------------------------------------
# Per-vertex shading. Gradients live in shaders.py; the table below says which
# one each part of each species gets. Clustered and tiered species are shaded
# inside their builders instead, before replication, so a gradient belongs to
# each individual rather than smearing across the whole cluster.
# ---------------------------------------------------------------------------
def _shade(parts, shaders):
    return [(name, shade_vertices(mesh, shaders[name])) for name, mesh in parts]


def _ostreatus():
    """
    Single laterally attached fan. The reference photograph shows a strongly
    undulate margin and very dense lamellae converging on one attachment point,
    neither of which the default fan expressed.
    """
    one = mt.shelf(
        stipe_len=2 * mt.units_per_cm(9), stipe_r=0.10,
        n_gills=78, gill_depth=0.095, lobes=0.26, pitch_deg=-26,
        cap_color=srgb("#c4b08a"),      # DB capColor
        gill_color=srgb("#efe8d8"),
        stipe_color=srgb("#e8e0cc"),
    )
    return _shade(one, {
        "pileus_cap": sh.from_heel("#6f6552", "#ddd3bd", power=2.2),
        "lamellae_gills": sh.from_heel("#e3d9c2", "#f6f1e4", power=0.7),
        "stipe_stem": sh.from_heel("#ddd2b8", "#f2ebda", power=0.6),
    })



GILL_PALE = "#f2ecdd"

SHADERS = {
    "lentinula-edodes": {
        "pileus_cap": sh.radial("#2f1d08", "#8a6230", power=2.4, streak=0.05),
        "stipe_stem": sh.fibrillose("#d8cbb0", "#b8a888", soil="#a89878", soil_below=-0.6),
        "lamellae_gills": sh.radial("#e4dac2", GILL_PALE, power=1.0),
    },
    "volvariella-volvacea": {
        "pileus_cap": sh.radial("#3a352c", "#c9bda8", power=2.2),
        "stipe_stem": sh.fibrillose("#f0e8d8", "#ded2ba", soil="#c4b79c", soil_below=-2.0),
        "lamellae_gills": sh.radial("#c99a90", "#e8cabc", power=1.0),
        "volva_cup": sh.flat("#a89a86", variation=0.10),
    },
    "coprinus-comatus": {
        "pileus_cap": sh.radial("#cec4b0", "#fffdf8", power=1.4),
        "stipe_stem": sh.fibrillose("#f7f4ee", "#e6dfd0"),
        "lamellae_gills": sh.radial("#8a8080", "#cfc7c7", power=1.0),
        "annulus_ring": sh.flat("#efece5", variation=0.06),
    },
    "pleurotus-eryngii": {
        "pileus_cap": sh.radial("#3d2a14", "#9c7f52", power=2.8, streak=0.045),
        "stipe_stem": sh.fibrillose("#f8f4ea", "#e2d9c4", soil="#d6c5a0", soil_below=-1.35),
        "lamellae_gills": sh.radial("#e6dcc4", "#f4eedf", power=1.0),
    },
    "ganoderma-lucidum": {
        # Concentric growth zonation is the character of a perennial conk.
        "pileus_crust": sh.banded("#3a0c04", "#a8421f", bands=13, power=1.6, contrast=0.72),
        "pore_surface": sh.from_heel("#c6bda6", "#e8e1d0"),
        "stipe_stem": sh.flat("#5a2418", variation=0.10),
    },
    "grifola-frondosa": {
        "pileus_fronds": sh.marbled("#4f4433", "#a99a80", seed=3, amount=0.95),
        "pore_surface": sh.flat("#efe9dc", variation=0.07),
        "stipe_stem": sh.flat("#e8e0cf", variation=0.08),
    },
    "hericium-erinaceus": {
        "context_mass": sh.marbled("#ece6da", "#fffdf6", seed=5, amount=0.8),
        "hymenial_spines": sh.tipped("#f2ece0", "#ffffff", power=1.2),
    },
    "tremella-fuciformis": {
        "gelatinous_lobes": sh.marbled("#ede9e4", "#ffffff", seed=7, coarse=5.0, fine=11.0),
    },
    "calvatia-gigantea": {
        "peridium_wall": sh.marbled("#eee8da", "#fffdf7", seed=9, coarse=4.0, fine=9.0),
        "gleba_mass": sh.flat("#ede8d8", variation=0.05),
    },
    "ustilago-maydis": {
        "smut_galls": sh.marbled("#241c14", "#6b5a45", seed=11, coarse=2.6, fine=6.0),
        "host_husk": sh.axial("#b4ad8a", "#dcd6b8", power=1.0),
    },
    "cyclocybe-aegerita": {
        "pileus_cap": sh.radial("#25150a", "#8a5f36", power=2.4),
        "stipe_stem": sh.fibrillose("#ece2cc", "#d4c7ab", soil="#b8a888", soil_below=-2.2),
        "lamellae_gills": sh.radial("#b8a68a", "#d8c8a8", power=1.0),
        "annulus_ring": sh.flat("#e2d6bc", variation=0.06),
    },
    "calocybe-indica": {
        "pileus_cap": sh.radial("#e0dace", "#fffefa", power=1.6),
        "stipe_stem": sh.fibrillose("#f7f4ec", "#e6e0d2"),
        "lamellae_gills": sh.radial("#e2dccc", GILL_PALE, power=1.0),
    },
    "stropharia-rugosoannulata": {
        "pileus_cap": sh.radial("#2a0710", "#8e2647", power=2.4, streak=0.05),
        "stipe_stem": sh.fibrillose("#f0ebdd", "#ddd5c2", soil="#c2b69c", soil_below=-2.4),
        "lamellae_gills": sh.radial("#3d3038", "#8a7a80", power=1.0),
        "annulus_ring": sh.flat("#ece4d2", variation=0.07),
    },
    "agaricus-subrufescens": {
        "pileus_cap": sh.radial("#3a2612", "#b08a5e", power=2.2, streak=0.07, k=24),
        "stipe_stem": sh.fibrillose("#f2ece0", "#e0d6c4", soil="#c9bda4", soil_below=-1.5),
        "lamellae_gills": sh.radial("#6b5148", "#a4867a", power=1.0),
        "annulus_ring": sh.flat("#efe7d6", variation=0.06),
    },
    "sparassis-crispa": {
        "crisped_lobes": sh.marbled("#eae0c8", "#fffdf4", seed=13, coarse=4.4, fine=10.0),
        "rooting_base": sh.axial("#c2b498", "#e6dcc4"),
    },
    "schizophyllum-commune": {
        "pileus_cap": sh.from_heel("#8a7f6a", "#ddd3bd", power=1.2),
        "split_folds": sh.from_heel("#a89478", "#d8c8ae", power=0.9),
    },
    "cordyceps-militaris": {
        "clavate_stroma": sh.axial("#a83400", "#f57a1a", power=0.9),
        "perithecia": sh.flat("#8f2c00", variation=0.12),
    },
    "aspergillus-oryzae": {
        "conidiophore_stipe": sh.flat("#efe6d0", variation=0.06),
        "vesicle_phialides": sh.flat("#e8dca8", variation=0.08),
        "conidial_chains": sh.marbled("#8a9a22", "#e4ee6a", seed=17, coarse=6.0, fine=13.0),
    },
    "aspergillus-sojae": {
        "conidiophore_stipe": sh.flat("#d8c8a8", variation=0.06),
        "vesicle_phialides": sh.flat("#b8a878", variation=0.08),
        "conidial_chains": sh.marbled("#2a1c10", "#6a5430", seed=21, coarse=5.0, fine=11.0),
    },
    "cantharellus-cibarius": {
        "funnel_body": sh.radial("#b87810", "#f2c44a", power=1.5),
        "false_gills": sh.from_heel("#a86c0c", "#e8b428", power=0.8),
    },
    "neurospora-intermedia": {
        "hyphal_filaments": sh.flat("#f0dfc4", variation=0.07),
        "septa_cross_walls": sh.flat("#e0cba8", variation=0.05),
        "macroconidia": sh.marbled("#d94a00", "#ff8a2b", seed=21, coarse=5.0, fine=12.0),
        "perithecium": sh.axial("#2e1c0e", "#5c3a1e"),
    },
    "trichoderma-reesei": {
        "conidiophore_stipe": sh.flat("#eae3cc", variation=0.06),
        "phialide_whorls": sh.flat("#d8dcb4", variation=0.07),
        "conidial_heads": sh.marbled("#5f8038", "#a8c470", seed=23, coarse=7.0, fine=15.0),
    },
    "rhizopus-oryzae": {
        "stolons_rhizoids": sh.flat("#e8dcc8", variation=0.07),
        "sporangia": sh.marbled("#1c1610", "#5a4a38", seed=25, coarse=8.0, fine=17.0),
        "columellae": sh.flat("#cbbba0", variation=0.06),
    },
    "rhizopus-oligosporus": {
        "stolons_rhizoids": sh.flat("#e4d8c0", variation=0.07),
        "sporangia": sh.marbled("#171208", "#4e4030", seed=27, coarse=8.0, fine=17.0),
        "columellae": sh.flat("#c8b8a0", variation=0.06),
    },
}


BUILDERS = {
    "lentinula-edodes": (_lentinula,
                         ["pileus_cap", "stipe_stem", "lamellae_gills"]),
    "volvariella-volvacea": (_volvariella,
                             ["pileus_cap", "stipe_stem", "lamellae_gills", "volva_cup"]),
    "coprinus-comatus": (_coprinus,
                         ["pileus_cap", "stipe_stem", "lamellae_gills", "annulus_ring"]),
    "pleurotus-eryngii": (_eryngii,
                          ["pileus_cap", "stipe_stem", "lamellae_gills"]),
    "pleurotus-ostreatus": (_ostreatus,
                            ["pileus_cap", "lamellae_gills", "stipe_stem"]),
    "ganoderma-lucidum": (lambda: mt.bracket(
        stalk_len=2 * mt.units_per_cm(10), stalk_r=0.075,
        crust_color=srgb("#a63d2a"),    # DB capColor, varnished
        pore_color=srgb("#ded6c4"),
        stalk_color=srgb("#6b2f22"),
    ), ["pileus_crust", "pore_surface", "stipe_stem"]),
    "grifola-frondosa": (lambda: mt.frondose(
        n_fronds=9, stipe_len=3 * mt.units_per_cm(9),
        cap_color=srgb("#9a8b72"),      # DB capColor
        stipe_color=srgb("#e8e0cf"),
        pore_color=srgb("#efe9dc"),
    ), ["pileus_fronds", "pore_surface", "stipe_stem"]),
    "hericium-erinaceus": (lambda: mt.toothed(
        n_spines=190, spine_len=0.46,
        mass_color=srgb("#f5f0e8"),     # DB capColor
        spine_color=srgb("#faf7f1"),
    ), ["context_mass", "hymenial_spines"]),
    "tremella-fuciformis": (lambda: mt.ruffled(
        n_lobes=7, color=srgb("#f8f4f0"),   # DB capColor
    ), ["gelatinous_lobes"]),
    "calvatia-gigantea": (lambda: mt.puffball(
        sterile_frac=0.30,
        peridium_color=srgb("#f5f0e6"),     # DB capColor
        gleba_color=srgb("#ede8d8"),        # white while edible
    ), ["peridium_wall", "gleba_mass"]),
    "morchella-spp": (lambda: mt.morel(
        # Proportions measured from the reference photograph on this species'
        # page: an ovoid head about 1.25x its own width over a short stipe.
        cap_h=2.45, stipe_len=1.05, stipe_r=0.40,
        ridge_color="#f4e8c8",              # pale sterile ridges
        pit_color="#2b2114",                # dark fertile alveoli
        stipe_color="#f0e7d2",
        context_color="#e6dac2",
    ), ["ascocarp_body"]),
    "ustilago-maydis": (lambda: mt.gall(
        n_lobes=5,
        gall_color=srgb("#5a4a3a"),         # DB capColor
        husk_color=srgb("#cfc9a8"),
    ), ["smut_galls", "host_husk"]),
}


# ---------------------------------------------------------------------------
# Second cohort. Same rule as above: proportions from each species' own
# capDiameter / stipeLength record, colour from its capColor unless the record's
# own prose contradicts it.
# ---------------------------------------------------------------------------
def _flammulina():
    """Enoki: a 1.5 cm cap on a 12 cm stipe is the whole point of the species."""
    u = mt.units_per_cm(1.5)
    one = mt.gilled(
        dome_z=convex(0.30, 0.62), under_rise=0.14, rim_thick=0.05,
        stipe_len=12*u*0.34, stipe_r=0.30, stipe_flare=0.05,
        n_gills=7, gill_depth=0.09, gill_inner=0.42, lod=0.34,
        cap_color=srgb("#f2edd8"), stipe_color=srgb("#e8dcc0"),
        gill_color=srgb("#f4efe2"),
    )
    one = _shade(one, {
        "pileus_cap": sh.radial("#cbbfa2", "#f6f2e2", power=1.8),
        "stipe_stem": sh.fibrillose("#ece0c4", "#d6c8a8", soil="#c0ad88", soil_below=-2.2),
        "lamellae_gills": sh.radial("#e8dfc8", "#f6f2e6", power=1.0),
    })
    return mt.cluster(one, n=9, spread=0.42, base_z=-12*u*0.34, seed=3, splay_deg=17)


def _hypsizygus():
    u = mt.units_per_cm(3)
    one = mt.gilled(
        dome_z=convex(0.40), under_rise=0.18, rim_thick=0.04,
        stipe_len=6*u, stipe_r=0.20, stipe_flare=0.12,
        n_gills=11, gill_depth=0.09, lod=0.45,
        cap_color=srgb("#8b7355"), stipe_color=srgb("#efe8da"),
        gill_color=srgb("#f2ece0"),
    )
    one = _shade(one, {
        # marmoreus: the mottled pileus is the character it is named for
        "pileus_cap": sh.marbled("#3f3123", "#9e8a6c", seed=31, coarse=5.5, fine=12.0),
        "stipe_stem": sh.fibrillose("#efe8da", "#dcd2be"),
        "lamellae_gills": sh.radial("#e6dece", "#f4efe2", power=1.0),
    })
    return mt.cluster(one, n=7, spread=0.50, base_z=-6*u, seed=5, splay_deg=15)


def _pholiota():
    u = mt.units_per_cm(3)
    one = mt.gilled(
        dome_z=convex(0.46, 0.62), under_rise=0.18, rim_thick=0.035,
        stipe_len=5*u, stipe_r=0.17, stipe_flare=0.10,
        n_gills=11, gill_depth=0.09, lod=0.44,
        cap_color=srgb("#c4782a"), stipe_color=srgb("#e0d2b4"),
        gill_color=srgb("#e6d9bd"),
        cap_rough=0.14,          # nameko is conspicuously viscid
    )
    one = _shade(one, {
        "pileus_cap": sh.radial("#5c2b06", "#d98a34", power=2.2, streak=0.05),
        "stipe_stem": sh.fibrillose("#e0d2b4", "#c9b895", soil="#ab9770", soil_below=-1.4),
        "lamellae_gills": sh.radial("#c4a878", "#e6d9bd", power=1.0),
    })
    return mt.cluster(one, n=8, spread=0.46, base_z=-5*u, seed=7, splay_deg=16)


def _cyclocybe():
    u = mt.units_per_cm(5)
    return mt.gilled(
        dome_z=convex(0.42), under_rise=0.19, rim_thick=0.04,
        stipe_len=8*u, stipe_r=0.16, stipe_flare=0.14,
        n_gills=22, gill_depth=0.10,
        cap_color=srgb("#6b4423"), stipe_color=srgb("#ece2cc"),
        gill_color=srgb("#cbb99a"),
        annulus=(0.24, 0.030, -8*u*0.30, srgb("#e2d6bc")),   # persistent veil
    )


def _calocybe():
    u = mt.units_per_cm(10)
    return mt.gilled(
        dome_z=convex(0.44), under_rise=0.20, rim_thick=0.045,
        stipe_len=8*u, stipe_r=0.26, stipe_flare=0.16,
        n_gills=24, gill_depth=0.10,
        cap_color=srgb("#f5f2e8"), stipe_color=srgb("#f7f4ec"),
        gill_color=srgb("#f2ece0"),
    )


def _stropharia():
    u = mt.units_per_cm(12)
    return mt.gilled(
        dome_z=convex(0.40), under_rise=0.19, rim_thick=0.05,
        stipe_len=10*u, stipe_r=0.24, stipe_flare=0.20,
        n_gills=26, gill_depth=0.10,
        cap_color=srgb("#7a1f3d"), stipe_color=srgb("#f0ebdd"),
        gill_color=srgb("#6e5a63"),                          # greying to purple-black
        annulus=(0.36, 0.045, -10*u*0.30, srgb("#ece4d2")),  # thick, rugose
    )


def _subrufescens():
    u = mt.units_per_cm(8)
    return mt.gilled(
        dome_z=convex(0.44), under_rise=0.20, rim_thick=0.04,
        stipe_len=7*u, stipe_r=0.20, stipe_flare=0.24,
        n_gills=24, gill_depth=0.10,
        cap_color=srgb("#a67c52"), stipe_color=srgb("#f2ece0"),
        gill_color=srgb("#8c6f63"),
        annulus=(0.30, 0.034, -7*u*0.30, srgb("#efe7d6")),
        cap_warp=shaggy(0.022, rings=11.0, around=22.0),     # fibrillose surface
    )


def _citrinopileatus():
    one = mt.shelf(stipe_len=2*mt.units_per_cm(7), stipe_r=0.10,
                   n_gills=20, gill_depth=0.09, nf=16, nt=64,
                   cap_color=srgb("#f0c93a"), gill_color=srgb("#f6efd8"),
                   stipe_color=srgb("#f2ead2"))
    one = _shade(one, {
        "pileus_cap": sh.from_heel("#a06a05", "#ffe066", power=1.6),
        "lamellae_gills": sh.from_heel("#e8dcae", "#f8f2d8", power=0.7),
        "stipe_stem": sh.from_heel("#e4d8a8", "#f4ecd0", power=0.6),
    })
    return mt.imbricate(one, n=4, rise=0.46, spread=0.20, seed=11, yaw=2.1, step=0.30)


def _djamor():
    one = mt.shelf(stipe_len=2*mt.units_per_cm(8), stipe_r=0.10,
                   n_gills=20, gill_depth=0.09, nf=16, nt=64,
                   cap_color=srgb("#e87a9a"), gill_color=srgb("#f6dfe6"),
                   stipe_color=srgb("#f4e2e6"))
    one = _shade(one, {
        "pileus_cap": sh.from_heel("#a82c4e", "#f7a8c0", power=1.6),
        "lamellae_gills": sh.from_heel("#eeccd6", "#faeaf0", power=0.7),
        "stipe_stem": sh.from_heel("#eed6dc", "#f8eef2", power=0.6),
    })
    return mt.imbricate(one, n=4, rise=0.44, spread=0.20, seed=13, yaw=2.1, step=0.30)


def _laetiporus():
    """Sessile: no stalk at all, so the bracket builder is given a stub of one."""
    one = mt.bracket(stalk_len=0.10, stalk_r=0.05,
                     crust_color=srgb("#f0a020"), pore_color=srgb("#f7d84a"),
                     stalk_color=srgb("#e8951c"),
                     thickness=0.16, phi0=1.05, eccentricity=0.26, flatten=0.26, nf=14, nt=56)
    one = _shade(one, {
        "pileus_crust": sh.banded("#c25a00", "#ffb84d", bands=6, power=0.9, contrast=0.4),
        "pore_surface": sh.from_heel("#e8c832", "#fdf0a0", power=0.8),
        "stipe_stem": sh.flat("#e08c14", variation=0.10),
    })
    return mt.imbricate(one, n=5, rise=0.34, spread=0.16, seed=17, scale_var=0.34, yaw=1.8, step=0.24)


BUILDERS.update({
    # Aspergillus oryzae uses the same conidial head as A. sojae, in its own
    # yellow-green livery — the structure is the genus character.
    "aspergillus-oryzae": (lambda: mt.conidiophore(
        stipe_len=3.8, stipe_r=0.09, vesicle_r=0.74, n_phialides=120, chain_len=7,
        hypha_color=srgb("#efe6d0"), vesicle_color=srgb("#e8dca8"),
        conidia_color=srgb("#c6d24a"), seed=8),
        ["conidiophore_stipe", "vesicle_phialides", "conidial_chains"]),
    "neurospora-intermedia": (lambda: mt.conidial_mycelium(
        hypha_color=srgb("#f0dfc4"), conidia_color=srgb("#ff6600"),
        perithecium_color=srgb("#4a2f1c"), include_perithecium=False),
        ["hyphal_filaments", "septa_cross_walls", "macroconidia"]),
    "trichoderma-reesei": (lambda: mt.branched_conidiophore(
        hypha_color=srgb("#eae3cc"), phialide_color=srgb("#d8dcb4"),
        conidia_color=srgb("#90b060")),
        ["conidiophore_stipe", "phialide_whorls", "conidial_heads"]),
    "flammulina-velutipes": (_flammulina,
        ["pileus_cap", "stipe_stem", "lamellae_gills"]),
    "hypsizygus-marmoreus": (_hypsizygus,
        ["pileus_cap", "stipe_stem", "lamellae_gills"]),
    "pholiota-nameko": (_pholiota,
        ["pileus_cap", "stipe_stem", "lamellae_gills"]),
    "cyclocybe-aegerita": (_cyclocybe,
        ["pileus_cap", "stipe_stem", "lamellae_gills", "annulus_ring"]),
    "calocybe-indica": (_calocybe,
        ["pileus_cap", "stipe_stem", "lamellae_gills"]),
    "stropharia-rugosoannulata": (_stropharia,
        ["pileus_cap", "stipe_stem", "lamellae_gills", "annulus_ring"]),
    "agaricus-subrufescens": (_subrufescens,
        ["pileus_cap", "stipe_stem", "lamellae_gills", "annulus_ring"]),
    "pleurotus-citrinopileatus": (_citrinopileatus,
        ["pileus_cap", "lamellae_gills", "stipe_stem"]),
    "pleurotus-djamor": (_djamor,
        ["pileus_cap", "lamellae_gills", "stipe_stem"]),
    "laetiporus-sulphureus": (_laetiporus,
        ["pileus_crust", "pore_surface", "stipe_stem"]),
    "sparassis-crispa": (lambda: mt.cauliflower(
        n_lobes=44, lobe_color=srgb("#f5f0e0"), base_color=srgb("#e0d6bf")),
        ["crisped_lobes", "rooting_base"]),
    "schizophyllum-commune": (lambda: mt.split_fan(
        n_folds=26, cap_color=srgb("#d4c4a8"), fold_color=srgb("#c9b49c")),
        ["pileus_cap", "split_folds"]),
    "cordyceps-militaris": (lambda: mt.clavate(
        n_clubs=6, club_len=2.0, club_r=0.30,
        stroma_color=srgb("#e85d04"), perithecia_color=srgb("#c44a02")),
        ["clavate_stroma", "perithecia"]),
    "aspergillus-sojae": (lambda: mt.conidiophore(
        stipe_len=2.4, stipe_r=0.13, vesicle_r=0.46, n_phialides=58, chain_len=3,
        hypha_color=srgb("#e0d2b8"), vesicle_color=srgb("#c4b48a"),
        conidia_color=srgb("#4a3820"), seed=21),
        ["conidiophore_stipe", "vesicle_phialides", "conidial_chains"]),
    # R. oligosporus bears smaller, fewer-spored sporangia than R. oryzae.
    "rhizopus-oligosporus": (lambda: mt.sporangiophore(
        hypha_color=srgb("#e4d8c0"), sporangium_color=srgb("#3d3025"),
        columella_color=srgb("#c8b8a0"), seed=21, sporangium_r=0.17, n_nodes=4),
        ["stolons_rhizoids", "sporangia", "columellae"]),
    "rhizopus-oryzae": (lambda: mt.sporangiophore(
        hypha_color=srgb("#e8dcc8"), sporangium_color=srgb("#4a3a2a"),
        columella_color=srgb("#cbbba0")),
        ["stolons_rhizoids", "sporangia", "columellae"]),
    "cantharellus-cibarius": (lambda: mt.chanterelle(
        stipe_len=5 * mt.units_per_cm(6),
        stipe_r=0.28,
        cap_color=srgb("#e6b84a"),
        ridge_color=srgb("#d4a43a")),
        ["funnel_body", "false_gills"]),
})


# Species that carry colour per-vertex rather than per-part. trimesh writes
# COLOR_0 but no material for these, so the file needs one attached afterwards.
# Every species now carries colour per-vertex.
VERTEX_COLOUR_SPECIES = set(SHADERS) | {
    "morchella-spp", "pleurotus-ostreatus",
    "flammulina-velutipes", "hypsizygus-marmoreus", "pholiota-nameko",
    "pleurotus-citrinopileatus", "pleurotus-djamor", "laetiporus-sulphureus",
    "cantharellus-cibarius",
}



def _has_vertex_colours(path):
    """True if every primitive in the .glb carries a COLOR_0 attribute."""
    import json as _json, struct as _struct
    with open(path, "rb") as fh:
        data = fh.read()
    n = _struct.unpack("<I", data[12:16])[0]
    doc = _json.loads(data[20:20 + n].decode("utf-8"))
    prims = [p for m in doc.get("meshes", []) for p in m.get("primitives", [])]
    return bool(prims) and all("COLOR_0" in p.get("attributes", {}) for p in prims)


def main(slugs):
    failures = []
    for slug in slugs:
        builder, _ = BUILDERS[slug]
        print(f"\n{slug}")
        parts = builder()
        if slug in SHADERS:
            parts = _shade(parts, SHADERS[slug])
        bad = check_parts(parts, indent="  ")
        if bad:
            failures.append((slug, bad))
            print(f"  SKIPPED: {', '.join(bad)} not closed")
            continue
        out = default_out(f"{slug}.glb")
        write_glb(parts, out)
        if slug in VERTEX_COLOUR_SPECIES:
            rough = {n: m.metadata.get("roughness", 0.85) for n, m in parts}
            patch_glb_material(out, roughness_by_node=rough)
            # Guard: patch_glb_material replaces every per-part material with one
            # white one, so a species listed here that failed to get its vertex
            # colours would ship untinted. Fail loudly instead of silently.
            if not _has_vertex_colours(out):
                failures.append((slug, ["COLOR_0 missing after shading"]))
                print(f"  FAILED: listed as vertex-coloured but exported no COLOR_0")

    if failures:
        print("\n" + "=" * 60)
        for slug, bad in failures:
            print(f"FAILED {slug}: {', '.join(bad)}")
        sys.exit(1)
    print(f"\nBuilt {len(slugs)} model(s).")


if __name__ == "__main__":
    main(sys.argv[1:] or list(BUILDERS))
