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
from mesh_kit import check_parts, write_glb, default_out, srgb


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


def _eryngii():
    u = mt.units_per_cm(5)
    return mt.gilled(
        dome_z=convex(0.24, 1.1), under_rise=0.16, rim_thick=0.05,
        stipe_len=14 * u, stipe_r=0.60, stipe_flare=0.06,
        n_gills=54, gill_depth=0.07, gill_inner=0.60,
        cap_color=srgb("#d4c4a8"),      # DB capColor
        stipe_color=srgb("#f0e8d8"),
        gill_color=srgb("#ece5d6"),
    )


BUILDERS = {
    "lentinula-edodes": (_lentinula,
                         ["pileus_cap", "stipe_stem", "lamellae_gills"]),
    "volvariella-volvacea": (_volvariella,
                             ["pileus_cap", "stipe_stem", "lamellae_gills", "volva_cup"]),
    "coprinus-comatus": (_coprinus,
                         ["pileus_cap", "stipe_stem", "lamellae_gills", "annulus_ring"]),
    "pleurotus-eryngii": (_eryngii,
                          ["pileus_cap", "stipe_stem", "lamellae_gills"]),
    "pleurotus-ostreatus": (lambda: mt.shelf(
        stipe_len=2 * mt.units_per_cm(9), stipe_r=0.10,
        n_gills=56, gill_depth=0.09,
        cap_color=srgb("#c4b08a"),      # DB capColor
        gill_color=srgb("#efe8d8"),
        stipe_color=srgb("#e8e0cc"),
    ), ["pileus_cap", "lamellae_gills", "stipe_stem"]),
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
        # Deliberate deviation: the record's 9 cm stipe against a 5 cm cap
        # yields a lollipop unlike any Morchella. Read as overall height, which
        # puts the cap at roughly half the fruiting body -- the usual proportion.
        cap_h=2.4, stipe_len=2.0, stipe_r=0.46, n_ridges=9,
        cap_color=srgb("#c9a84c"),          # DB capColor
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
    return mt.imbricate(one, n=4, rise=0.46, spread=0.20, seed=11, yaw=2.1, step=0.30)


def _djamor():
    one = mt.shelf(stipe_len=2*mt.units_per_cm(8), stipe_r=0.10,
                   n_gills=20, gill_depth=0.09, nf=16, nt=64,
                   cap_color=srgb("#e87a9a"), gill_color=srgb("#f6dfe6"),
                   stipe_color=srgb("#f4e2e6"))
    return mt.imbricate(one, n=4, rise=0.44, spread=0.20, seed=13, yaw=2.1, step=0.30)


def _laetiporus():
    """Sessile: no stalk at all, so the bracket builder is given a stub of one."""
    one = mt.bracket(stalk_len=0.10, stalk_r=0.05,
                     crust_color=srgb("#f0a020"), pore_color=srgb("#f7d84a"),
                     stalk_color=srgb("#e8951c"),
                     thickness=0.16, phi0=1.05, eccentricity=0.26, flatten=0.26, nf=14, nt=56)
    return mt.imbricate(one, n=5, rise=0.34, spread=0.16, seed=17, scale_var=0.34, yaw=1.8, step=0.24)


BUILDERS.update({
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
        stipe_len=3.2, stipe_r=0.10, vesicle_r=0.62, n_phialides=96, chain_len=5,
        hypha_color=srgb("#e8dcc8"), vesicle_color=srgb("#dccdb2"),
        conidia_color=srgb("#7c6a3f")),
        ["conidiophore_stipe", "vesicle_phialides", "conidial_chains"]),
    "rhizopus-oryzae": (lambda: mt.sporangiophore(
        hypha_color=srgb("#e8dcc8"), sporangium_color=srgb("#4a3a2a"),
        columella_color=srgb("#cbbba0")),
        ["stolons_rhizoids", "sporangia", "columellae"]),
})


def main(slugs):
    failures = []
    for slug in slugs:
        builder, _ = BUILDERS[slug]
        print(f"\n{slug}")
        parts = builder()
        bad = check_parts(parts, indent="  ")
        if bad:
            failures.append((slug, bad))
            print(f"  SKIPPED: {', '.join(bad)} not closed")
            continue
        write_glb(parts, default_out(f"{slug}.glb"))

    if failures:
        print("\n" + "=" * 60)
        for slug, bad in failures:
            print(f"FAILED {slug}: {', '.join(bad)}")
        sys.exit(1)
    print(f"\nBuilt {len(slugs)} model(s).")


if __name__ == "__main__":
    main(sys.argv[1:] or list(BUILDERS))
