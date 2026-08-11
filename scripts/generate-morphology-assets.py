#!/usr/bin/env python3
"""Generate exterior + cross-section morphology reference images for species pages."""

from __future__ import annotations

import base64
import os
from pathlib import Path

from openai import OpenAI

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "morphology"

# Macroscopic species needing reference assets (morchella already present).
SPECIES = [
    {
        "slug": "auricularia-auricula-judae",
        "name": "Auricularia auricula-judae (wood ear)",
        "exterior": "Realistic 3D product render of a wood ear fungus (Auricularia auricula-judae), dark reddish-brown gelatinous ear-shaped fruiting body with wrinkled folds, soft jelly texture, studio lighting, isolated on pure white background, no text, no labels, scientific illustration quality.",
        "cross": "Realistic 3D anatomical cross-section of wood ear fungus Auricularia auricula-judae, cut through the gelatinous ear lobe showing translucent brown jelly tissue layers, studio lighting, isolated on pure white background, no text, no labels.",
    },
    {
        "slug": "calvatia-gigantea",
        "name": "Calvatia gigantea (giant puffball)",
        "exterior": "Realistic 3D product render of a giant puffball mushroom Calvatia gigantea, large smooth creamy-white sphere, slightly textured skin, studio lighting, isolated on pure white background, no text, no labels.",
        "cross": "Realistic 3D anatomical cross-section of giant puffball Calvatia gigantea cut in half, solid pure white marshmallow-like gleba interior, thin outer skin, studio lighting, isolated on pure white background, no text, no labels.",
    },
    {
        "slug": "coprinus-comatus",
        "name": "Coprinus comatus (shaggy mane)",
        "exterior": "Realistic 3D product render of shaggy mane mushroom Coprinus comatus, tall cylindrical white cap with shaggy brown scales, slender white stem, studio lighting, isolated on pure white background, no text, no labels.",
        "cross": "Realistic 3D anatomical sagittal cross-section of Coprinus comatus showing white flesh, dense gills under the shaggy cap, hollow stem interior, studio lighting, isolated on pure white background, no text, no labels.",
    },
    {
        "slug": "ganoderma-lucidum",
        "name": "Ganoderma lucidum (reishi)",
        "exterior": "Realistic 3D product render of reishi mushroom Ganoderma lucidum, glossy lacquered kidney-shaped bracket, deep reddish-brown to maroon varnished surface with concentric zones, short lateral stem, studio lighting, isolated on pure white background, no text, no labels.",
        "cross": "Realistic 3D anatomical cross-section of Ganoderma lucidum bracket showing corky brown context tissue and fine porous underside tubes, studio lighting, isolated on pure white background, no text, no labels.",
    },
    {
        "slug": "grifola-frondosa",
        "name": "Grifola frondosa (maitake)",
        "exterior": "Realistic 3D product render of maitake mushroom Grifola frondosa, overlapping frilly gray-brown leaf-like caps in a clustered rosette, studio lighting, isolated on pure white background, no text, no labels.",
        "cross": "Realistic 3D anatomical cross-section of Grifola frondosa cluster showing layered fronds and white flesh interior of overlapping caps, studio lighting, isolated on pure white background, no text, no labels.",
    },
    {
        "slug": "hericium-erinaceus",
        "name": "Hericium erinaceus (lion's mane)",
        "exterior": "Realistic 3D product render of lion's mane mushroom Hericium erinaceus, cascading white icicle-like spines hanging in a dense pompon mass, studio lighting, isolated on pure white background, no text, no labels.",
        "cross": "Realistic 3D anatomical cross-section of Hericium erinaceus showing dense white flesh core with hanging spines in cutaway view, studio lighting, isolated on pure white background, no text, no labels.",
    },
    {
        "slug": "lentinula-edodes",
        "name": "Lentinula edodes (shiitake)",
        "exterior": "Realistic 3D product render of shiitake mushroom Lentinula edodes, brown umbrella cap with white cracks, sturdy pale stem, studio lighting, isolated on pure white background, no text, no labels.",
        "cross": "Realistic 3D anatomical sagittal cross-section of shiitake Lentinula edodes showing white flesh, gills under the brown cap, solid stem, studio lighting, isolated on pure white background, no text, no labels.",
    },
    {
        "slug": "agaricus-bisporus",
        "name": "Agaricus bisporus (button mushroom)",
        "exterior": "Realistic 3D product render of white button mushroom Agaricus bisporus, smooth white cap, short thick stem, studio lighting, isolated on pure white background, no text, no labels.",
        "cross": "Realistic 3D anatomical sagittal cross-section of Agaricus bisporus showing white flesh, pink-brown gills, solid stem, studio lighting, isolated on pure white background, no text, no labels.",
    },
    {
        "slug": "pleurotus-ostreatus",
        "name": "Pleurotus ostreatus (oyster mushroom)",
        "exterior": "Realistic 3D product render of oyster mushrooms Pleurotus ostreatus, overlapping fan-shaped gray-beige caps in a shelf cluster, short lateral stems, studio lighting, isolated on pure white background, no text, no labels.",
        "cross": "Realistic 3D anatomical cross-section of Pleurotus ostreatus showing white flesh and radiating gills under the fan cap, studio lighting, isolated on pure white background, no text, no labels.",
    },
    {
        "slug": "pleurotus-eryngii",
        "name": "Pleurotus eryngii (king oyster)",
        "exterior": "Realistic 3D product render of king oyster mushroom Pleurotus eryngii, thick dense cylindrical pale stem with small brownish cap on top, studio lighting, isolated on pure white background, no text, no labels.",
        "cross": "Realistic 3D anatomical sagittal cross-section of Pleurotus eryngii showing dense white flesh throughout the thick stem and small cap with gills, studio lighting, isolated on pure white background, no text, no labels.",
    },
    {
        "slug": "tremella-fuciformis",
        "name": "Tremella fuciformis (snow fungus)",
        "exterior": "Realistic 3D product render of snow fungus Tremella fuciformis, translucent white lobed jelly brain-like fronds, studio lighting, isolated on pure white background, no text, no labels.",
        "cross": "Realistic 3D anatomical cross-section of Tremella fuciformis showing translucent gelatinous white lobes cut open, studio lighting, isolated on pure white background, no text, no labels.",
    },
    {
        "slug": "volvariella-volvacea",
        "name": "Volvariella volvacea (straw mushroom)",
        "exterior": "Realistic 3D product render of straw mushroom Volvariella volvacea, gray-brown egg-shaped cap emerging from a volva, short stem, studio lighting, isolated on pure white background, no text, no labels.",
        "cross": "Realistic 3D anatomical sagittal cross-section of Volvariella volvacea showing pink gills, volva base, and white flesh, studio lighting, isolated on pure white background, no text, no labels.",
    },
    {
        "slug": "ustilago-maydis",
        "name": "Ustilago maydis (huitlacoche)",
        "exterior": "Realistic 3D product render of huitlacoche corn smut Ustilago maydis, swollen dark gray-black galls on a corn cob segment, studio lighting, isolated on pure white background, no text, no labels.",
        "cross": "Realistic 3D anatomical cross-section of Ustilago maydis gall showing dark powdery spore mass inside silvery membrane, studio lighting, isolated on pure white background, no text, no labels.",
    },
]


def save_b64(path: Path, b64: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(base64.b64decode(b64))


def generate_one(client: OpenAI, prompt: str, path: Path) -> None:
    if path.exists() and path.stat().st_size > 10_000:
        print(f"skip {path}")
        return
    print(f"gen  {path}")
    result = client.images.generate(
        model="gpt-image-1.5",
        prompt=prompt,
        size="1024x1024",
        quality="medium",
    )
    b64 = result.data[0].b64_json
    if not b64:
        raise RuntimeError(f"No image data for {path}")
    save_b64(path, b64)


def main() -> None:
    if not os.environ.get("OPENAI_API_KEY"):
        raise SystemExit("OPENAI_API_KEY not set")
    client = OpenAI()
    only = os.environ.get("ONLY_SLUG")
    for sp in SPECIES:
        if only and sp["slug"] != only:
            continue
        folder = OUT / sp["slug"]
        generate_one(client, sp["exterior"], folder / "exterior.png")
        generate_one(client, sp["cross"], folder / "cross-section.png")
    print("done")


if __name__ == "__main__":
    main()
