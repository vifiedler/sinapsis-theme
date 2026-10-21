# Sinapsis theme

Tema de WordPress para la biblioteca Sinapsis. El contenido se administra en
entradas y sus campos se gestionan con Secure Custom Fields (SCF).

## Estructura

- `index.php`: wrapper del loop principal.
- `template-parts/content.php`: estructura del catálogo.
- `template-parts/content-library-loop.php`: punto de montaje del catálogo REST.
- `template-parts/content-single.php`: estructura del detalle REST.
- `inc/scf-functions.php`: lectura segura de campos SCF y normalización de imágenes.
- `inc/rest-fields.php`: representación REST de los campos SCF.
- `assets/librerias/css/`: estilos propios del proyecto.
- `assets/librerias/js/sinapsis-site.js`: interacción visual, drag and drop y favoritos.
- `assets/librerias/js/sinapsis-rest.js`: cliente REST mediante `fetch()`,
  respuestas JSON validadas y renderizado.

El cliente REST calcula los contadores de Plugins y Librerías a partir de las
categorías de cada entrada. Los enlaces de la barra lateral filtran el catálogo
sin recargar la página. El buscador consulta el endpoint de entradas con el
parámetro REST `search` y combina sus resultados con el filtro seleccionado.

Las peticiones dinámicas del catálogo, detalle, favoritos y recomendaciones
usan `fetch()` con la cabecera `Accept: application/json`. El cliente valida
el código HTTP y el encabezado `Content-Type` antes de ejecutar `response.json()`;
una respuesta HTML o cualquier otro formato se muestra como error y no se
procesa como datos válidos.

SCF ya expone los campos en la API REST. El tema no registra endpoints propios:
las plantillas PHP consumen los mismos campos mediante las funciones de SCF y
mantienen la presentación desacoplada de la fuente de datos.

## Campos utilizados

Los loops reconocen los campos existentes en la exportación del proyecto:
`descripcion`, `link`, `imagen`, `instalacion`, `codigo-ejemplo` y `dificultad`.

## JavaScript y datos

El tema separa las responsabilidades en dos archivos:

- `assets/librerias/js/sinapsis-site.js`: interacción de interfaz, drag and
  drop y favoritos locales. No hace peticiones REST.
- `assets/librerias/js/sinapsis-rest.js`: cliente REST, transformación de JSON
  y renderizado del catálogo/detalle. No administra favoritos ni eventos de
  drag and drop.

Bootstrap 5.3.8 y jQuery 4.0.0 se cargan como dependencias base. La
configuración REST se entrega únicamente al cliente mediante
`sinapsisRestConfig`; no se mantienen nombres heredados de Breakdown.
