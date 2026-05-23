#!/usr/bin/env python3
"""
Open Social Brain — Zone Image Generator v3  (MNI-calibrated)
================================================================
Proyecta coordenadas MNI reales del atlas CerebrA a cada vista cerebral.

Supuestos de orientacion (estandar neuroanatomia):
  Lateral  : hemisferio derecho, anterior=DERECHA imagen, superior=ARRIBA
  Medial   : superficie interna hemisferio derecho, misma orientacion
  Ventral  : vista inferior, anterior=ARRIBA imagen, derecha(+x)=DERECHA imagen
  Dorsal   : vista superior, anterior=ARRIBA imagen, derecha(+x)=DERECHA imagen
  Coronal  : seccion frontal, derecha(+x)=DERECHA imagen, superior(+z)=ARRIBA
"""

import os, re
from PIL import Image, ImageDraw, ImageFont

# ── Rutas ───────────────────────────────────────────────────────────────────
BASE_DIR = r"g:\Mi unidad\Analisis de Datos Script Oficiales\Atlas_Cerebro_3D"
IMG_DIR  = os.path.join(BASE_DIR, "Imagenes")
OUT_DIR  = os.path.join(IMG_DIR, "zones")
os.makedirs(OUT_DIR, exist_ok=True)

BASE_IMGS = {
    "lateral":  os.path.join(IMG_DIR, "Lateral.png"),
    "medial":   os.path.join(IMG_DIR, "Medial.png"),
    "ventral":  os.path.join(IMG_DIR, "Ventral.png"),
    "dorsal":   os.path.join(IMG_DIR, "Dorsal.png"),
    "coronal":  os.path.join(IMG_DIR, "Coronal.png"),
}

OUT_W, OUT_H = 560, 420   # 4:3, mantiene proporcion de las imagenes fuente

# ── Paleta ──────────────────────────────────────────────────────────────────
ACCENT = (85, 194, 183)
WHITE  = (240, 245, 243)

# ── Tipografia ───────────────────────────────────────────────────────────────
def load_fonts():
    try:
        return {
            "bold":  ImageFont.truetype("C:/Windows/Fonts/courbd.ttf", 12),
            "small": ImageFont.truetype("C:/Windows/Fonts/cour.ttf",   10),
        }
    except Exception:
        d = ImageFont.load_default()
        return {"bold": d, "small": d}

FONTS = load_fonts()

def slug(name: str) -> str:
    return re.sub(r"[^a-z0-9-]", "", name.lower().replace(" ", "-"))

# ── Limites detectados del cerebro en cada imagen (fraccion 0-1) ─────────────
# Detectados empiricamente con threshold de pixel > 20 sobre fondo negro
BRAIN_BOUNDS = {
    #           x_left  x_right  y_top   y_bot
    "lateral":  (0.14,  0.90,    0.08,   0.86),
    "medial":   (0.14,  0.86,    0.08,   0.87),
    "ventral":  (0.21,  0.78,    0.03,   0.88),
    "dorsal":   (0.26,  0.76,    0.06,   0.84),
    "coronal":  (0.15,  0.86,    0.06,   0.85),
}

# ── Extensiones MNI de cada vista (mm) ─────────────────────────────────────
# Basado en el template MNI ICBM 152 estandar.
# Lateral/Medial: eje horizontal = Y (AP),  eje vertical = Z (SI)
# Ventral/Dorsal: eje horizontal = X (LR),  eje vertical = Y (AP)
# Coronal:        eje horizontal = X (LR),  eje vertical = Z (SI)
MNI_EXTENTS = {
    # vista:   (h_min, h_max, v_min, v_max)  h=horizontal, v=vertical en imagen
    # Lateral: h=Y (AP: occipital→izquierda, frontal→derecha), v=Z (SI: inf→abajo, sup→arriba)
    # Rango real visible en la imagen lateral: y≈-90..+70, z≈-25..+85
    "lateral":  (-90,   70,   -25,   85),
    # Medial:  misma orientacion que lateral
    "medial":   (-90,   70,   -25,   85),
    # Ventral: h=X (izquierda→derecha), v=Y (posterior→abajo)
    "ventral":  (-80,   80,   -105,  85),
    # Dorsal:  h=X (izquierda→derecha), v=Y (posterior→abajo)
    "dorsal":   (-70,   70,   -105,  85),
    # Coronal: h=X (izquierda→derecha), v=Z (inferior→abajo)
    "coronal":  (-80,   80,   -55,   85),
}

def mni_to_frac(view: str, x_mni: float, y_mni: float, z_mni: float):
    """
    Proyecta coordenadas MNI a fraccion (0-1) en la imagen.
    Retorna (img_x_frac, img_y_frac).
    """
    bx0, bx1, by0, by1 = BRAIN_BOUNDS[view]
    h_min, h_max, v_min, v_max = MNI_EXTENTS[view]

    if view in ("lateral", "medial"):
        # Horizontal: Y (posterior=izquierda de imagen, anterior=derecha)
        h_val = y_mni
        h_frac = (h_val - h_min) / (h_max - h_min)   # posterior→izquierda, anterior→derecha
        # Vertical: Z (superior=arriba de imagen → by0)
        v_val = z_mni
        v_frac = (v_max - v_val) / (v_max - v_min)   # superior→arriba

    elif view in ("ventral", "dorsal"):
        # Horizontal: X (derecha positiva → derecha de imagen)
        h_val = x_mni
        h_frac = (h_val - h_min) / (h_max - h_min)   # derecha→derecha
        # Vertical: Y (anterior positivo → arriba de imagen)
        v_val = y_mni
        v_frac = (v_max - v_val) / (v_max - v_min)   # anterior→arriba

    elif view == "coronal":
        # Horizontal: X (derecha positiva → derecha de imagen)
        h_val = x_mni
        h_frac = (h_val - h_min) / (h_max - h_min)
        # Vertical: Z (superior positivo → arriba de imagen)
        v_val = z_mni
        v_frac = (v_max - v_val) / (v_max - v_min)

    else:
        return 0.5, 0.5

    # Mapear fraccion de cerebro a fraccion de imagen
    img_x = bx0 + h_frac * (bx1 - bx0)
    img_y = by0 + v_frac * (by1 - by0)

    # Clamp dentro del area del cerebro
    img_x = max(bx0, min(bx1, img_x))
    img_y = max(by0, min(by1, img_y))

    return img_x, img_y

# ── Coordenadas MNI reales por zona (hemisferio derecho / bilateral) ─────────
# Fuente: atlas CerebrA / Destrieux, template MNI ICBM 152.
# Zona midline (x~0) aparece en el centro de vistas coronales/ventrales/dorsales.
# (x_mni, y_mni, z_mni) en mm
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

# ── Dibujador de marcador ────────────────────────────────────────────────────
def draw_marker(img: Image.Image, px: int, py: int, label: str) -> Image.Image:
    out = img.copy().convert("RGBA")
    W, H = out.size

    # Determinar posicion del texto (cuadrante con mas espacio)
    offset_x = -116 if px > W * 0.55 else 18
    offset_y = -28  if py > H * 0.55 else 10
    tx = max(4, min(W - 136, px + offset_x))
    ty = max(4, min(H - 22,  py + offset_y))

    # Ancho del texto
    try:
        bbox = FONTS["bold"].getbbox(label)
        tw = bbox[2] - bbox[0] + 10
    except Exception:
        tw = len(label) * 7 + 10

    # Sombra de texto
    shadow = Image.new("RGBA", out.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    pad = 3
    sd.rounded_rectangle([tx-pad, ty-pad, tx+tw+pad, ty+16+pad],
                          radius=3, fill=(0, 0, 0, 170))
    out = Image.alpha_composite(out, shadow)

    draw = ImageDraw.Draw(out)

    # Linea guia
    r = 9
    cx, cy = tx + tw // 2, ty + 8
    dx, dy = cx - px, cy - py
    L = (dx**2 + dy**2) ** 0.5
    if L > 0:
        sx, sy = int(px + r * dx / L), int(py + r * dy / L)
        draw.line([sx, sy, cx, cy], fill=(*ACCENT, 170), width=1)

    # Halo
    halo = Image.new("RGBA", out.size, (0, 0, 0, 0))
    hd = ImageDraw.Draw(halo)
    hd.ellipse([px-16, py-16, px+16, py+16], fill=(*ACCENT, 38))
    out = Image.alpha_composite(out, halo)
    draw = ImageDraw.Draw(out)

    # Circulo principal + miras + punto
    draw.ellipse([px-r, py-r, px+r, py+r], outline=(*ACCENT, 230), width=2)
    for dx2, dy2 in [(-r-5, 0), (r+5, 0), (0, -r-5), (0, r+5)]:
        draw.line([px, py, px+dx2, py+dy2], fill=(*ACCENT, 155), width=1)
    draw.ellipse([px-2, py-2, px+2, py+2], fill=(*ACCENT, 255))

    # Etiqueta
    draw.text((tx+2, ty), label, font=FONTS["bold"], fill=(*WHITE, 228))

    return out.convert("RGB")


# ── Generacion ───────────────────────────────────────────────────────────────
def make_zone_image(name: str, x_mni: float, y_mni: float, z_mni: float, view: str):
    base_path = BASE_IMGS.get(view)
    if not base_path or not os.path.exists(base_path):
        print(f"  SKIP — imagen no encontrada para vista '{view}': {name}")
        return

    base = Image.open(base_path).convert("RGB").resize((OUT_W, OUT_H), Image.LANCZOS)

    img_xf, img_yf = mni_to_frac(view, x_mni, y_mni, z_mni)
    px = int(img_xf * OUT_W)
    py = int(img_yf * OUT_H)

    result = draw_marker(base, px, py, name.upper())
    fname = slug(name) + ".jpg"
    result.save(os.path.join(OUT_DIR, fname), "JPEG", quality=87, optimize=True)
    return img_xf, img_yf


# ── Main ────────────────────────────────────────────────────────────────────
def main():
    print("Open Social Brain — Generador MNI-calibrado")
    print(f"Generando {len(ZONE_MNI)} imagenes...")
    print()

    # Tabla de verificacion
    print(f"{'Zona':<32} {'Vista':<8} {'MNI (x,y,z)':<18} {'Img (fx,fy)'}")
    print("-" * 78)

    ok = 0
    for name, vals in ZONE_MNI.items():
        x, y, z, view = vals
        result = make_zone_image(name, x, y, z, view)
        if result:
            fx, fy = result
            print(f"  {name:<30} {view:<8} ({x:>4},{y:>4},{z:>4})    ({fx:.2f}, {fy:.2f})")
            ok += 1

    print()
    print(f"OK: {ok} imagenes generadas en {OUT_DIR}")

if __name__ == "__main__":
    main()
