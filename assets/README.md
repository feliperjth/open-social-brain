# Modelo neuroanatómico real

Coloca aquí un archivo llamado `brain_atlas.glb` para que el atlas lo cargue automáticamente al abrir la app.

También puedes cargar cualquier `.glb` o `.gltf` desde el botón **Cargar modelo 3D**.

## Convención para atlas por regiones

Si el modelo está segmentado, nombra las mallas con palabras reconocibles:

- `dlpfc`, `prefrontal`, `ba9`, `ba46`
- `premotor`, `ba6`
- `auditory`, `heschl`, `ba41`, `ba42`
- `default`, `dmn`, `precuneus`, `pcc`
- `visual`, `v1`, `calcarine`, `ba17`
- `hippocampus`
- `insula`
- `parietal`, `angular`
- `amygdala`
- `cerebellum`

El visor resaltará esas mallas y las vinculará con el panel anatómico-funcional.

La tabla completa de nombres anatómicos usada por la app está en `cerebra_labels.csv`.

## CerebrA convertido desde MINC2

El archivo `brain_atlas.glb` puede generarse desde:

`mni_icbm152_CerebrA_tal_nlin_sym_09c.mnc`

Comando usado:

```powershell
python ..\convert_cerebra_to_glb.py "G:\Mi unidad\Proyectos Paradigmas Intro C Cognitivas\mni_icbm152_CerebrA_tal_nlin_sym_09c.mnc" brain_atlas.glb --step-size 2
```

La app reconoce las regiones principales mediante IDs CerebrA:

- DLPFC aproximada: 1, 38, 42, 52, 89, 93
- Corteza premotora aproximada: 16, 35, 67, 86
- Auditiva primaria / temporal superior: 14, 45, 65, 96
- Red por defecto anatómica: 15, 31, 33, 47, 66, 82, 84, 98
- Visual: 6, 12, 34, 43, 57, 63, 85, 94
- Hipocampo: 48, 99
- Ínsula: 23, 74
- Parietal posterior: 9, 10, 51, 60, 61, 102
- Amígdala: 19, 70
- Cerebelo/vermis: 2, 20, 39, 46, 50, 53, 71, 90, 97, 101
