#!/usr/bin/env python3
"""
Open Social Brain — Zone Image Generator v4 (nilearn glass brain)
Genera imágenes con proyección glass brain sobre fondo negro.
Coordenadas MNI perfectamente calibradas: el marcador se pinta por nilearn
directamente en las coordenadas MNI, sin necesidad de calibración manual.
"""

import os, re, io
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from nilearn import plotting
from PIL import Image, ImageDraw, ImageFont

# ── Rutas ───────────────────────────────────────────────────────────────────
BASE_DIR = r"g:\Mi unidad\Analisis de Datos Script Oficiales\Atlas_Cerebro_3D"
OUT_DIR  = os.path.join(BASE_DIR, "Imagenes", "zones")
os.makedirs(OUT_DIR, exist_ok=True)

# ── Paleta (igual al app.js) ─────────────────────────────────────────────────
ACCENT_HEX = "#55c2b7"
ACCENT_RGB = (85, 194, 183)
OUT_W, OUT_H = 560, 420
LABEL_H = 40          # franja inferior para el nombre de la zona

# ── Tipografía ───────────────────────────────────────────────────────────────
def _font(size):
    try:
        return ImageFont.truetype("C:/Windows/Fonts/courbd.ttf", size)
    except Exception:
        return ImageFont.load_default()

def slug(name: str) -> str:
    return re.sub(r"[^a-z0-9-]", "", name.lower().replace(" ", "-"))

# ── Vista → modo nilearn ─────────────────────────────────────────────────────
# nilearn plot_glass_brain coloca el marcador en las coordenadas MNI exactas.
#   'r' = hemisferio derecho (sagital, vista lateral derecha)
#   'l' = hemisferio izquierdo (sagital, aproxima vista medial derecha por simetría)
#   'z' = axial  (vista desde arriba → dorsal)
#   'y' = coronal
VIEW_MODE = {
    "lateral": "r",
    "medial":  "l",
    "dorsal":  "z",
    "ventral": "z",   # se invierte eje X para simular vista desde abajo
    "coronal": "y",
}

# ── Coordenadas MNI por zona (x, y, z, vista) ───────────────────────────────
ZONE_MNI = {
    # ── FRONTAL ───────────────────────────────────────────────────────────
    "Superior Frontal":           (15,  30,  52, "lateral"),
    "Rostral Middle Frontal":     (38,  45,  24, "lateral"),
    "Caudal Middle Frontal":      (41,  18,  38, "lateral"),
    "Precentral":                 (36,  -8,  55, "lateral"),
    "Pars Triangularis":          (51,  26,  14, "lateral"),
    "Pars Opercularis":           (53,  14,  23, "lateral"),
    "Pars Orbitalis":             (45,  45,  -8, "lateral"),
    "Paracentral":                ( 5, -26,  73, "medial"),
    "Lateral Orbitofrontal":      (28,  44, -15, "ventral"),
    "Medial Orbitofrontal":       ( 7,  48, -14, "medial"),

    # ── TEMPORAL ─────────────────────────────────────────────────────────
    "Superior Temporal":          (62, -24,   6, "lateral"),
    "Middle Temporal":            (64, -40,  -6, "lateral"),
    "Inferior Temporal":          (54, -44, -22, "ventral"),
    "Fusiform":                   (38, -42, -24, "ventral"),
    "Parahippocampal":            (22, -30, -22, "ventral"),
    "Entorhinal":                 (24,  -4, -28, "ventral"),
    "Transverse Temporal":        (48, -20,  12, "lateral"),

    # ── PARIETAL ─────────────────────────────────────────────────────────
    "Postcentral":                (42, -26,  52, "lateral"),
    "Superior Parietal":          (22, -56,  62, "dorsal"),
    "Inferior Parietal":          (52, -52,  44, "lateral"),
    "Supramarginal":              (58, -44,  34, "lateral"),
    "Precuneus":                  ( 8, -60,  50, "medial"),

    # ── OCCIPITAL ────────────────────────────────────────────────────────
    "Lateral Occipital":          (36, -80,  20, "lateral"),
    "Cuneus":                     (10, -80,  28, "medial"),
    "Lingual":                    (14, -68,  -6, "medial"),
    "Pericalcarine":              (10, -82,   6, "medial"),

    # ── LIMBICO ──────────────────────────────────────────────────────────
    "Insula":                     (38,   6,   4, "lateral"),
    "Caudal Anterior Cingulate":  ( 6,  18,  33, "medial"),
    "Rostral Anterior Cingulate": ( 5,  38,   8, "medial"),
    "Posterior Cingulate":        ( 6, -42,  26, "medial"),
    "Isthmus Cingulate":          ( 8, -50,  14, "medial"),
    "Hippocampus":                (26, -24, -16, "coronal"),
    "Amygdala":                   (22,  -4, -22, "coronal"),

    # ── SUBCORTEZA ───────────────────────────────────────────────────────
    "Thalamus":                   (12, -18,   4, "coronal"),
    "Caudate":                    (14,   8,  10, "coronal"),
    "Putamen":                    (26,   4,   2, "coronal"),
    "Pallidum":                   (18,  -2,   2, "coronal"),
    "Accumbens Area":             (10,  12,  -4, "coronal"),
    "Ventral Diencephalon":       ( 4, -10,  -2, "coronal"),
    "Basal Forebrain":            (14,   2,  -8, "coronal"),
    "Brainstem":                  ( 0, -25, -30, "coronal"),

    # ── CEREBELO ─────────────────────────────────────────────────────────
    "Cerebellum Gray Matter":     (20, -60, -30, "lateral"),
    "Cerebellum White Matter":    (16, -52, -28, "lateral"),
    "Vermal lobules I-V":         ( 0, -40, -18, "medial"),
    "Vermal lobules VI-VII":      ( 0, -62, -22, "medial"),
    "Vermal lobules VIII-X":      ( 0, -64, -36, "medial"),

    # ── VENTRICULOS / OTRAS ──────────────────────────────────────────────
    "Lateral Ventricle":          (20,   0,  12, "coronal"),
    "Inferior Lateral Ventricle": (26, -18, -12, "coronal"),
    "Third Ventricle":            ( 0, -12,   0, "coronal"),
    "Fourth Ventricle":           ( 0, -38, -30, "coronal"),
    "Optic Chiasm":               ( 0,   4, -16, "ventral"),
}


# ── Generador ────────────────────────────────────────────────────────────────
def make_zone_image(name: str, x: float, y: float, z: float, view: str) -> bool:
    mode = VIEW_MODE[view]

    # --- Render glass brain con nilearn ------------------------------------
    fig = plt.figure(figsize=(5.6, 3.6), facecolor="black")

    display = plotting.plot_glass_brain(
        stat_map_img=None,
        display_mode=mode,
        colorbar=False,
        figure=fig,
        black_bg=True,
        annotate=False,
        draw_cross=False,
        alpha=0.72,
    )
    display.add_markers([(x, y, z)], marker_color=ACCENT_HEX, marker_size=280)

    # Invertir eje horizontal para vista ventral (de abajo hacia arriba)
    if view == "ventral":
        for ax in fig.get_axes():
            ax.invert_xaxis()

    # Guardar render en buffer PNG
    buf = io.BytesIO()
    plt.savefig(buf, format="png", facecolor="black",
                dpi=110, bbox_inches="tight", pad_inches=0.04)
    plt.close(fig)
    buf.seek(0)

    # --- Componer imagen final con franja de etiqueta ---------------------
    brain = Image.open(buf).convert("RGB")

    # Escalar brain para que quepa en OUT_W × (OUT_H - LABEL_H)
    avail_h = OUT_H - LABEL_H
    scale = min(OUT_W / brain.width, avail_h / brain.height)
    bw = int(brain.width  * scale)
    bh = int(brain.height * scale)
    brain = brain.resize((bw, bh), Image.LANCZOS)

    final = Image.new("RGB", (OUT_W, OUT_H), (0, 0, 0))
    x_off = (OUT_W - bw) // 2
    y_off = (avail_h - bh) // 2
    final.paste(brain, (x_off, y_off))

    draw = ImageDraw.Draw(final)

    # Separador teal
    sep_y = OUT_H - LABEL_H
    draw.line([(0, sep_y), (OUT_W, sep_y)], fill=(*ACCENT_RGB, 160), width=1)

    # Nombre de la zona (centrado, teal)
    font_name = _font(13)
    label = name.upper()
    bbox = draw.textbbox((0, 0), label, font=font_name)
    tw = bbox[2] - bbox[0]
    draw.text(((OUT_W - tw) // 2, sep_y + 8), label,
              font=font_name, fill=(*ACCENT_RGB, 240))

    # Indicador de vista (esquina inferior izquierda, gris)
    font_view = _font(9)
    draw.text((8, sep_y + 10), view.upper(), font=font_view,
              fill=(160, 160, 160, 200))

    out_path = os.path.join(OUT_DIR, slug(name) + ".jpg")
    final.save(out_path, "JPEG", quality=87, optimize=True)
    return True


# ── Main ────────────────────────────────────────────────────────────────────
def main():
    print("Open Social Brain — Generator v4 (nilearn glass brain)")
    print(f"Generando {len(ZONE_MNI)} imagenes...\n")

    ok = err = 0
    for name, vals in ZONE_MNI.items():
        x, y, z, view = vals
        try:
            make_zone_image(name, x, y, z, view)
            print(f"  OK  {name:<34} [{view}]")
            ok += 1
        except Exception as e:
            print(f"  ERR {name}: {e}")
            err += 1

    print(f"\nResultado: {ok} OK, {err} errores -> {OUT_DIR}")


if __name__ == "__main__":
    main()
