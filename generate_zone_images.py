#!/usr/bin/env python3
"""
Open Social Brain — Zone Image Generator v5 (hybrid)
=====================================================
Posición del marcador:  nilearn plot_glass_brain (coordenadas MNI exactas)
Base visual:            PNG originales de alta calidad (Lateral/Medial/etc.)

Flujo por zona:
  1. Renderizar glass brain con marcador rojo en imagen temporal
  2. Detectar centroide del marcador y bounding-box del cerebro en esa imagen
  3. Calcular fracción (fx, fy) dentro de los límites del cerebro nilearn
  4. Mapear esa fracción a píxel en la PNG original usando su propio bounding-box
  5. Dibujar marcador artístico (halo + mira + etiqueta) sobre la PNG original
"""

import os, re, io
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from nilearn import plotting
from PIL import Image, ImageDraw, ImageFont

# ── Rutas ────────────────────────────────────────────────────────────────────
BASE_DIR = r"g:\Mi unidad\Analisis de Datos Script Oficiales\Atlas_Cerebro_3D"
IMG_DIR  = os.path.join(BASE_DIR, "Imagenes")
OUT_DIR  = os.path.join(IMG_DIR, "zones")
os.makedirs(OUT_DIR, exist_ok=True)

BASE_IMGS = {
    "lateral": os.path.join(IMG_DIR, "Lateral.png"),
    "medial":  os.path.join(IMG_DIR, "Medial.png"),
    "ventral": os.path.join(IMG_DIR, "Ventral.png"),
    "dorsal":  os.path.join(IMG_DIR, "Dorsal.png"),
    "coronal": os.path.join(IMG_DIR, "Coronal.png"),
}

OUT_W, OUT_H = 560, 420

# ── Paleta ────────────────────────────────────────────────────────────────────
ACCENT     = (85, 194, 183)
ACCENT_HEX = "#55c2b7"
WHITE      = (240, 245, 243)

# ── Tipografía ────────────────────────────────────────────────────────────────
def _font(size):
    try:
        return ImageFont.truetype("C:/Windows/Fonts/courbd.ttf", size)
    except Exception:
        return ImageFont.load_default()

FONTS = {"bold": _font(12), "small": _font(10)}

def slug(name: str) -> str:
    return re.sub(r"[^a-z0-9-]", "", name.lower().replace(" ", "-"))

# ── Coordenadas MNI por zona (x, y, z, vista) ────────────────────────────────
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

# nilearn display_mode por vista
VIEW_MODE = {
    "lateral": "r",
    "medial":  "l",
    "dorsal":  "z",
    "ventral": "z",
    "coronal": "y",
}


# ── Detección de bounding-box del cerebro en imagen ──────────────────────────
def _detect_brain_bbox(arr: np.ndarray, threshold: int = 22):
    """
    Devuelve (x0, x1, y0, y1) en píxeles donde hay contenido brillante
    (el cerebro) sobre fondo negro.
    """
    bright = arr.max(axis=2) > threshold
    rows = np.where(bright.any(axis=1))[0]
    cols = np.where(bright.any(axis=0))[0]
    if len(rows) == 0 or len(cols) == 0:
        H, W = arr.shape[:2]
        return (int(W * 0.1), int(W * 0.9), int(H * 0.1), int(H * 0.9))
    return (int(cols[0]), int(cols[-1]), int(rows[0]), int(rows[-1]))


# ── Posición nilearn: fracción del marcador dentro del glass brain ────────────
def _nilearn_fraction(x_mni: float, y_mni: float, z_mni: float, view: str):
    """
    Renderiza un glass brain con marcador rojo interno, detecta dónde
    queda el marcador dentro del contorno del cerebro y devuelve (fx, fy)
    como fracción [0-1] × [0-1] del bounding-box del cerebro en nilearn.
    """
    mode = VIEW_MODE[view]

    fig = plt.figure(figsize=(8, 6), facecolor="black")
    display = plotting.plot_glass_brain(
        None, display_mode=mode, colorbar=False, figure=fig,
        black_bg=True, annotate=False, draw_cross=False, alpha=0.75,
    )
    # Marcador rojo vivo para detección confiable
    display.add_markers([(x_mni, y_mni, z_mni)], marker_color="#ff1111", marker_size=550)

    buf = io.BytesIO()
    plt.savefig(buf, format="png", facecolor="black",
                dpi=110, bbox_inches="tight", pad_inches=0.03)
    plt.close(fig)
    buf.seek(0)

    arr = np.array(Image.open(buf).convert("RGB"))

    # Separar rojo (marcador) del gris (contorno cerebro)
    is_red   = (arr[:,:,0] > 140) & (arr[:,:,1] < 90) & (arr[:,:,2] < 90)
    is_brain = (arr.max(axis=2) > 18) & ~is_red

    # Bounding-box del cerebro en esta imagen nilearn
    brain_rows = np.where(is_brain.any(axis=1))[0]
    brain_cols = np.where(is_brain.any(axis=0))[0]

    if len(brain_rows) == 0 or len(brain_cols) == 0 or is_red.sum() == 0:
        return 0.5, 0.5

    bx0, bx1 = float(brain_cols[0]), float(brain_cols[-1])
    by0, by1 = float(brain_rows[0]), float(brain_rows[-1])

    ys, xs = np.where(is_red)
    mx, my = float(xs.mean()), float(ys.mean())

    fx = float(np.clip((mx - bx0) / max(bx1 - bx0, 1), 0.0, 1.0))
    fy = float(np.clip((my - by0) / max(by1 - by0, 1), 0.0, 1.0))
    return fx, fy


# ── Marcador artístico sobre PIL Image ───────────────────────────────────────
def draw_marker(img: Image.Image, px: int, py: int, label: str) -> Image.Image:
    out = img.copy().convert("RGBA")
    W, H = out.size

    offset_x = -120 if px > W * 0.55 else 18
    offset_y =  -28 if py > H * 0.55 else 10
    tx = max(4, min(W - 140, px + offset_x))
    ty = max(4, min(H - 22,  py + offset_y))

    try:
        bbox = FONTS["bold"].getbbox(label)
        tw = bbox[2] - bbox[0] + 10
    except Exception:
        tw = len(label) * 7 + 10

    # Sombra de texto
    shadow = Image.new("RGBA", out.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    pad = 3
    sd.rounded_rectangle([tx - pad, ty - pad, tx + tw + pad, ty + 16 + pad],
                          radius=3, fill=(0, 0, 0, 175))
    out = Image.alpha_composite(out, shadow)

    draw = ImageDraw.Draw(out)

    # Línea guía
    r = 9
    cx_l, cy_l = tx + tw // 2, ty + 8
    dx, dy = cx_l - px, cy_l - py
    L = (dx**2 + dy**2) ** 0.5
    if L > 0:
        sx, sy = int(px + r * dx / L), int(py + r * dy / L)
        draw.line([sx, sy, cx_l, cy_l], fill=(*ACCENT, 165), width=1)

    # Halo
    halo = Image.new("RGBA", out.size, (0, 0, 0, 0))
    hd   = ImageDraw.Draw(halo)
    hd.ellipse([px - 18, py - 18, px + 18, py + 18], fill=(*ACCENT, 38))
    out  = Image.alpha_composite(out, halo)
    draw = ImageDraw.Draw(out)

    # Círculo + miras + punto central
    draw.ellipse([px - r, py - r, px + r, py + r],
                 outline=(*ACCENT, 230), width=2)
    for ddx, ddy in [(-r - 5, 0), (r + 5, 0), (0, -r - 5), (0, r + 5)]:
        draw.line([px, py, px + ddx, py + ddy], fill=(*ACCENT, 155), width=1)
    draw.ellipse([px - 2, py - 2, px + 2, py + 2], fill=(*ACCENT, 255))

    # Etiqueta
    draw.text((tx + 2, ty), label, font=FONTS["bold"], fill=(*WHITE, 228))

    return out.convert("RGB")


# ── Generación principal ──────────────────────────────────────────────────────
def make_zone_image(name: str, x: float, y: float, z: float, view: str) -> bool:
    # 1. Posición exacta vía nilearn
    fx, fy = _nilearn_fraction(x, y, z, view)

    # 2. Cargar PNG base original
    base_path = BASE_IMGS.get(view)
    if not base_path or not os.path.exists(base_path):
        print(f"  SKIP — PNG no encontrada para vista '{view}': {name}")
        return False

    base = Image.open(base_path).convert("RGB").resize((OUT_W, OUT_H), Image.LANCZOS)

    # 3. Detectar bounding-box del cerebro en la PNG base
    arr_base = np.array(base)
    bx0, bx1, by0, by1 = _detect_brain_bbox(arr_base, threshold=22)

    # 4. Mapear fracción nilearn → píxel sobre la PNG
    # Nilearn 'r'/'l' (sagital) pone anterior=IZQUIERDA; los PNG tienen anterior=DERECHA
    # → invertir eje horizontal solo para vistas sagitales
    if view in ("lateral", "medial"):
        fx = 1.0 - fx

    px = int(bx0 + fx * (bx1 - bx0))
    py = int(by0 + fy * (by1 - by0))
    px = max(bx0 + 4, min(bx1 - 4, px))
    py = max(by0 + 4, min(by1 - 4, py))

    # 5. Dibujar marcador artístico
    result = draw_marker(base, px, py, name.upper())

    # 6. Guardar
    out_path = os.path.join(OUT_DIR, slug(name) + ".jpg")
    result.save(out_path, "JPEG", quality=87, optimize=True)
    return True


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    print("Open Social Brain — Generator v5 (nilearn posición + PNG artístico)")
    print(f"Generando {len(ZONE_MNI)} imágenes...\n")

    ok = err = 0
    for name, vals in ZONE_MNI.items():
        x, y, z, view = vals
        try:
            make_zone_image(name, x, y, z, view)
            print(f"  OK  {name:<36} [{view}]")
            ok += 1
        except Exception as e:
            print(f"  ERR {name}: {e}")
            err += 1

    print(f"\nResultado: {ok} OK, {err} errores -> {OUT_DIR}")


if __name__ == "__main__":
    main()
