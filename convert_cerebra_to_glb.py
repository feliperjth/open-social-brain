"""
Convert a CerebrA MINC/NIFTI label volume into a GLB atlas.

The output is a single GLB file containing one mesh per label. Mesh names use the
pattern cerebra_label_### so the web atlas can load a real neuroanatomical model
even before a full label-name table is attached.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import nibabel as nib
import numpy as np
import trimesh
from skimage import measure


PALETTE = np.array(
    [
        [0xD7, 0x83, 0x74, 205],
        [0x72, 0xA7, 0xFF, 210],
        [0x55, 0xC2, 0xB7, 210],
        [0xD9, 0xB6, 0x6F, 215],
        [0xC7, 0x95, 0xFF, 205],
        [0x9E, 0xDC, 0x82, 205],
        [0xFF, 0x8F, 0xB3, 205],
        [0xEF, 0x8F, 0x74, 205],
        [0xB9, 0x87, 0x5C, 210],
    ],
    dtype=np.uint8,
)


def parse_labels(text: str | None, available: np.ndarray) -> list[int]:
    if not text:
        return [int(value) for value in available if value != 0]

    wanted: set[int] = set()
    for part in text.split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            start, end = part.split("-", 1)
            wanted.update(range(int(start), int(end) + 1))
        else:
            wanted.add(int(part))
    return [label for label in sorted(wanted) if label in available and label != 0]


def mesh_for_label(data: np.ndarray, affine: np.ndarray, label: int, step_size: int) -> trimesh.Trimesh | None:
    mask = data == label
    if int(mask.sum()) < 8:
        return None

    padded = np.pad(mask.astype(np.float32), 1, mode="constant")
    verts, faces, _normals, _values = measure.marching_cubes(
        padded,
        level=0.5,
        step_size=step_size,
        allow_degenerate=False,
    )
    verts -= 1.0
    verts_h = np.c_[verts, np.ones(len(verts))]
    world = verts_h @ affine.T
    mesh = trimesh.Trimesh(vertices=world[:, :3], faces=faces, process=True)
    mesh.visual.face_colors = np.tile(PALETTE[label % len(PALETTE)], (len(mesh.faces), 1))
    return mesh


def convert(input_path: Path, output_path: Path, labels: str | None, step_size: int) -> None:
    img = nib.load(str(input_path))
    data = np.asarray(img.dataobj).round().astype(np.int16)
    available = np.unique(data)
    selected = parse_labels(labels, available)

    if not selected:
        raise ValueError("No non-zero labels were found for conversion.")

    scene = trimesh.Scene()
    for index, label in enumerate(selected, start=1):
        mesh = mesh_for_label(data, img.affine, label, step_size)
        if mesh is None:
            print(f"skip label {label}: too small")
            continue
        name = f"cerebra_label_{label:03d}"
        scene.add_geometry(mesh, geom_name=name, node_name=name)
        print(f"{index:03d}/{len(selected):03d} {name}: {len(mesh.vertices)} vertices, {len(mesh.faces)} faces")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    scene.export(str(output_path))
    print(f"wrote {output_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert CerebrA MINC/NIFTI labels to GLB.")
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--labels", help="Comma/range list, for example 1-102 or 10,24,33.")
    parser.add_argument("--step-size", type=int, default=2, help="Marching-cubes sampling step. 1 is detailed; 2-3 is web-friendly.")
    args = parser.parse_args()
    convert(args.input, args.output, args.labels, args.step_size)


if __name__ == "__main__":
    main()
