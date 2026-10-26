# CLAUDE.md

Este archivo ofrece guía a Claude Code (claude.ai/code) al trabajar con código en este repositorio.

## Resumen

Aplicación de una sola página para una rifa ("rifa") que vende puestos numerados (`puestos`). Los compradores eligen exactamente 1 puesto de una cuadrícula de 100 y envían sus datos. Los textos de la interfaz y los identificadores están en español.

## Ejecución

Sin paso de build, sin gestor de paquetes, sin tests. La app son cuatro archivos estáticos que se sirven tal cual.

Como `app.js` se carga como `<script type="module">` e importa desde un CDN, abrir `index.html` vía `file://` falla — hay que servirlo por HTTP:

```bash
python -m http.server 8000     # luego abrir http://localhost:8000
```

Las dependencias se obtienen en tiempo de ejecución desde jsDelivr (`@supabase/supabase-js/+esm`); no existe `node_modules`.

## Arquitectura

El navegador habla directamente con Supabase — no hay backend propio. `supabase.js` crea y exporta el cliente singleton (la URL y la clave publicable están hardcodeadas; cualquier control de acceso debe vivir en las políticas RLS de Supabase, ya que la clave se envía a todos los visitantes). `app.js` contiene toda la lógica y el manejo del DOM.

Dos tablas, inferidas de las consultas en `app.js`:

- `puestos` — `numero` (int, se muestra con padding a 3 dígitos), `estado`, `comprador_id` FK
- `compradores` — `id`, `nombre`, `cedula`, `telefono`

### Acoplamiento a tener en cuenta

Los valores de `estado` se usan directamente como nombres de clase CSS: `div.className = "puesto " + p.estado` en `app.js` se combina con `.disponible` / `.vendido` en `style.css`. Agregar un nuevo estado en la base de datos requiere una clase CSS correspondiente, o esos puestos se renderizan sin estilo.

La selección del lado del cliente también reutiliza la clase `vendido`, por lo que un puesto que el usuario apenas seleccionó es visualmente indistinguible de uno ya vendido hasta que `cargarPuestos()` recarga desde la base de datos.

### Flujo de compra

`compradorForm.onsubmit` exige exactamente 1 selección y luego realiza dos escrituras secuenciales: insertar en `compradores`, y luego `update puestos set estado='vendido', comprador_id=…` para el `numero` seleccionado. Estas no son transaccionales y no hay verificación de que el puesto siga disponible — un fallo después de la primera escritura deja un registro de `comprador` huérfano, y compradores concurrentes pueden sobrescribirse la reclamación entre sí.

La cuadrícula renderiza todas las filas de `puestos` sin paginación; `style.css` la organiza en 10 columnas fijas, dimensionadas para 100 puestos.

**Importante:** la cantidad de puestos que se muestra no está fijada en el código — depende de cuántas filas existan en la tabla `puestos` de Supabase. El cambio de código ajusta la UI (1 puesto por compra, cuadrícula de 10 columnas), pero para que realmente aparezcan solo 100 puestos hay que dejar únicamente esas 100 filas (`numero` 1–100) en la tabla de Supabase.
