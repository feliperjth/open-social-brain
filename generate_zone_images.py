#!/usr/bin/env python3
"""
Open Social Brain — Zone Image Generator v6 (MNI152 base images)
=================================================================
Base visual:   Proyecciones del template MNI152 T1 1mm (mismo espacio que nilearn).
Posicion:      Calculada DIRECTAMENTE desde la affine del template — sin calibracion.
               pixel = inv(affine) @ [x_mni, y_mni, z_mni, 1]  → coordenada exacta.
Marcador:      Artistico (halo + mira + etiqueta) sobre la proyeccion generada.
"""

import os, re
import numpy as np
from nilearn import datasets
from PIL import Image, ImageDraw, ImageFont
from scipy.ndimage import gaussian_filter

# ── Rutas ────────────────────────────────────────────────────────────────────
BASE_DIR = r"g:\Mi unidad\Analisis de Datos Script Oficiales\Atlas_Cerebro_3D"
OUT_DIR  = os.path.join(BASE_DIR, "Imagenes", "zones")
os.makedirs(OUT_DIR, exist_ok=True)

OUT_W, OUT_H = 560, 420
ACCENT = (85, 194, 183)
WHITE  = (240, 245, 243)

def _font(size):
    try:
        return ImageFont.truetype("C:/Windows/Fonts/courbd.ttf", size)
    except Exception:
        return ImageFont.load_default()

FONTS = {"bold": _font(12), "small": _font(10)}

def slug(name):
    return re.sub(r"[^a-z0-9-]", "", name.lower().replace(" ", "-"))

# ── Coordenadas MNI por zona ──────────────────────────────────────────────────
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


# ── Template MNI152 ───────────────────────────────────────────────────────────
def load_template():
    print("  Cargando template MNI152 T1 1mm (descarga ~25 MB si es primera vez)...")
    tpl   = datasets.load_mni152_template(resolution=1)
    data  = np.asarray(tpl.dataobj, dtype=np.float32)
    affine = tpl.affine
    inv_a  = np.linalg.inv(affine)
    return data, inv_a


def mni_to_vox(inv_a, x, y, z):
    """Convierte coordenadas MNI (mm) a indices de voxel (float)."""
    v = inv_a @ [x, y, z, 1.0]
    return float(v[0]), float(v[1]), float(v[2])


# ── Proyecciones ─────────────────────────────────────────────────────────────
def _style(arr: np.ndarray) -> np.ndarray:
    """Normaliza y aplica contraste a una proyeccion 2D."""
    a = arr.astype(np.float32)
    nonzero = a[a > 0]
    if len(nonzero) == 0:
        return a
    lo = float(np.percentile(nonzero, 1))
    hi = float(np.percentile(nonzero, 99))
    a  = np.clip(a, lo, hi)
    a  = (a - lo) / (hi - lo + 1e-9)
    a  = np.power(a, 0.65)          # gamma: realza estructuras tenues
    return a


def build_projections(data: np.ndarray, inv_a: np.ndarray):
    """
    Genera proyecciones 2D del template MNI152 para cada vista.
    Devuelve dict: {vista: (arr_HxW_float, pixel_fn)}
    donde pixel_fn(x,y,z) -> (col, row) en la proyeccion.

    Convencion de imagen resultante:
      lateral/medial : anterior=IZQUIERDA  superior=ARRIBA  (estandar neurologico)
      dorsal         : anterior=ARRIBA     derecha=DERECHA
      ventral        : anterior=ARRIBA     derecha=IZQUIERDA (vista desde abajo)
      coronal        : superior=ARRIBA     derecha=DERECHA   (estandar neurologico)
    """
    # Midline en espacio voxel (donde MNI x=0)
    i0, j0, k0 = mni_to_vox(inv_a, 0, 0, 0)
    i_mid = int(round(i0))

    result = {}

    # ── LATERAL: hemisferio derecho, proyeccion maximo a lo largo de x (eje i) ──
    # Con affine[0,0]<0 (convencion radiologica), hemisferio derecho (x>0) esta
    # en i < i_mid. Tomamos solo esa mitad.
    rh   = data[:i_mid + 1, :, :]          # shape (i_mid+1, n_j, n_k)
    proj = rh.max(axis=0)                  # shape (n_j, n_k)
    nj, nk = proj.shape

    # Orientar: filas = k (SI, superior→arriba), cols = j (AP, anterior→izquierda)
    # arr[k, j] => imagen[row, col]:  row = (nk-1)-k,  col = (nj-1)-j
    lat_arr = _style(proj.T[::-1, ::-1])   # shape (nk, nj)

    def lat_px(x, y, z, _inv=inv_a, _nj=nj, _nk=nk):
        _, j, k = mni_to_vox(_inv, x, y, z)
        col = int(round((_nj - 1) - j))
        row = int(round((_nk - 1) - k))
        return (max(0, min(_nj - 1, col)),
                max(0, min(_nk - 1, row)))

    result["lateral"] = (lat_arr, lat_px)

    # ── MEDIAL: slab fino cerca de la linea media del hemisferio derecho ──────
    slab_start = max(0, i_mid - 6)
    slab_end   = i_mid + 1
    med_proj   = data[slab_start:slab_end, :, :].max(axis=0)
    med_arr    = _style(med_proj.T[::-1, ::-1])   # mismo sistema de coords

    result["medial"] = (med_arr, lat_px)   # misma funcion de pixel que lateral

    # ── DORSAL: proyeccion desde arriba a lo largo de z (eje k) ──────────────
    dor_proj = data.max(axis=2)            # shape (n_i, n_j)
    ni, nj2  = dor_proj.shape

    # Orientar: filas = j (AP, anterior→arriba = row 0 = j maximo)
    #           cols  = i (x: con affine negativo i=0 → x=+90=derecha)
    # Para neurologia: derecha (+x) a la derecha de imagen → invertir i
    # (i=0 = x>0 = derecha del cerebro → debe quedar a la DERECHA = col grande)
    dor_arr = _style(dor_proj.T[::-1, ::-1])  # shape (nj2, ni): fila=j flip, col=i flip

    def dor_px(x, y, z, _inv=inv_a, _ni=ni, _nj=nj2):
        i, j, _ = mni_to_vox(_inv, x, y, z)
        col = int(round((_ni - 1) - i))   # flip i → derecha del cerebro a la derecha
        row = int(round((_nj - 1) - j))   # flip j → anterior arriba
        return (max(0, min(_ni - 1, col)),
                max(0, min(_nj - 1, row)))

    result["dorsal"] = (dor_arr, dor_px)

    # ── VENTRAL: misma proyeccion axial, pero vista desde abajo ──────────────
    # Desde abajo: izq/der se invierten respecto a dorsal.
    ven_arr = _style(dor_proj.T[::-1, :])  # shape (nj2, ni): col=i SIN flip

    def ven_px(x, y, z, _inv=inv_a, _ni=ni, _nj=nj2):
        i, j, _ = mni_to_vox(_inv, x, y, z)
        col = int(round(i))                # sin flip → der del cerebro a la izquierda
        row = int(round((_nj - 1) - j))   # anterior arriba
        return (max(0, min(_ni - 1, col)),
                max(0, min(_nj - 1, row)))

    result["ventral"] = (ven_arr, ven_px)

    # ── CORONAL: proyeccion desde el frente a lo largo de y (eje j) ──────────
    cor_proj = data.max(axis=1)            # shape (n_i, n_k)
    ni2, nk2 = cor_proj.shape

    # Orientar: filas = k (SI, superior→arriba = row 0 = k maximo)
    #           cols  = i (x: flip → derecha a la derecha)
    cor_arr = _style(cor_proj.T[::-1, ::-1])  # shape (nk2, ni2)

    def cor_px(x, y, z, _inv=inv_a, _ni=ni2, _nk=nk2):
        i, _, k = mni_to_vox(_inv, x, y, z)
        col = int(round((_ni - 1) - i))
        row = int(round((_nk - 1) - k))
        return (max(0, min(_ni - 1, col)),
                max(0, min(_nk - 1, row)))

    result["coronal"] = (cor_arr, cor_px)

    return result


# ── Array → PIL Image estiilzada ─────────────────────────────────────────────
def arr_to_pil(arr: np.ndarray, W: int, H: int) -> Image.Image:
    """
    Convierte un array float [0-1] a PIL RGB con fondo negro y cerebro blanco.
    Aplica un suave glow para dar profundidad.
    """
    u8 = (arr * 255).astype(np.uint8)
    gray = Image.fromarray(u8, mode="L")

    # Glow suave: suma version desenfocada
    blur  = gray.filter(__import__("PIL.ImageFilter", fromlist=["GaussianBlur"])
                        .GaussianBlur(radius=1.8))
    glow  = Image.blend(gray, blur, alpha=0.35)

    # Escalar a salida
    pil = glow.convert("RGB").resize((W, H), Image.LANCZOS)
    return pil


# ── Marcador artistico ───────────────────────────────────────────────────────
def draw_marker(img: Image.Image, px: int, py: int, label: str) -> Image.Image:
    out = img.copy().convert("RGBA")
    W, H = out.size

    offset_x = -122 if px > W * 0.55 else 18
    offset_y =  -28 if py > H * 0.55 else 10
    tx = max(4, min(W - 144, px + offset_x))
    ty = max(4, min(H - 22,  py + offset_y))

    try:
        bbox = FONTS["bold"].getbbox(label)
        tw   = bbox[2] - bbox[0] + 10
    except Exception:
        tw   = len(label) * 7 + 10

    # Sombra etiqueta
    shadow = Image.new("RGBA", out.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    pad = 3
    sd.rounded_rectangle([tx - pad, ty - pad, tx + tw + pad, ty + 16 + pad],
                          radius=3, fill=(0, 0, 0, 180))
    out = Image.alpha_composite(out, shadow)

    draw = ImageDraw.Draw(out)

    # Linea guia
    r = 9
    cx_l, cy_l = tx + tw // 2, ty + 8
    dx, dy = cx_l - px, cy_l - py
    L = (dx**2 + dy**2) ** 0.5
    if L > 0:
        sx, sy = int(px + r * dx / L), int(py + r * dy / L)
        draw.line([sx, sy, cx_l, cy_l], fill=(*ACCENT, 160), width=1)

    # Halo
    halo = Image.new("RGBA", out.size, (0, 0, 0, 0))
    hd   = ImageDraw.Draw(halo)
    hd.ellipse([px - 20, py - 20, px + 20, py + 20], fill=(*ACCENT, 40))
    out  = Image.alpha_composite(out, halo)
    draw = ImageDraw.Draw(out)

    # Circulo + miras + punto
    draw.ellipse([px - r, py - r, px + r, py + r],
                 outline=(*ACCENT, 235), width=2)
    for ddx, ddy in [(-r - 6, 0), (r + 6, 0), (0, -r - 6), (0, r + 6)]:
        draw.line([px, py, px + ddx, py + ddy], fill=(*ACCENT, 155), width=1)
    draw.ellipse([px - 2, py - 2, px + 2, py + 2], fill=(*ACCENT, 255))

    # Etiqueta
    draw.text((tx + 2, ty), label, font=FONTS["bold"], fill=(*WHITE, 228))

    return out.convert("RGB")


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    print("Open Social Brain — Generator v6 (MNI152 base images)")
    print()

    # 1. Cargar template y calcular proyecciones (una sola vez)
    data, inv_a = load_template()
    print("  Generando proyecciones por vista...")
    projections = build_projections(data, inv_a)
    print(f"  Proyecciones listas: {list(projections.keys())}\n")

    # 2. Generar imagen por zona
    ok = err = 0
    for name, vals in ZONE_MNI.items():
        x, y, z, view = vals
        try:
            proj_arr, pixel_fn = projections[view]

            # a) Imagen base desde la proyeccion MNI
            base = arr_to_pil(proj_arr, OUT_W, OUT_H)

            # b) Pixel exacto via affine
            proj_H, proj_W = proj_arr.shape
            col_raw, row_raw = pixel_fn(x, y, z)

            # Escalar desde resolucion de proyeccion a OUT_W x OUT_H
            px = int(col_raw / proj_W * OUT_W)
            py = int(row_raw / proj_H * OUT_H)
            px = max(4, min(OUT_W - 4, px))
            py = max(4, min(OUT_H - 4, py))

            # c) Dibujar marcador y guardar
            result = draw_marker(base, px, py, name.upper())
            result.save(os.path.join(OUT_DIR, slug(name) + ".jpg"),
                        "JPEG", quality=87, optimize=True)

            print(f"  OK  {name:<36} [{view}]  px=({px},{py})")
            ok += 1

        except Exception as e:
            import traceback
            print(f"  ERR {name}: {e}")
            traceback.print_exc()
            err += 1

    print(f"\nResultado: {ok} OK, {err} errores -> {OUT_DIR}")


if __name__ == "__main__":
    main()
