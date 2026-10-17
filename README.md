# Sinapsis theme

Tema de WordPress para la biblioteca Sinapsis. El contenido se administra en
entradas y sus campos se gestionan con Secure Custom Fields (SCF).

## Estructura

- `index.php`: loop principal de entradas de la biblioteca.
- `template-parts/content.php`: tarjeta reutilizable para el loop.
- `template-parts/content-single.php`: detalle de una entrada.
- `inc/scf-functions.php`: lectura segura de campos SCF y normalización de imágenes.
- `assets/librerias/`: estilos y JavaScript propios del proyecto.

SCF ya expone los campos en la API REST. El tema no registra endpoints propios:
las plantillas PHP consumen los mismos campos mediante las funciones de SCF y
mantienen la presentación desacoplada de la fuente de datos.

## Campos utilizados

Los loops reconocen los campos existentes en la exportación del proyecto:
`descripcion`, `link`, `imagen`, `instalacion`, `codigo-ejemplo` y `dificultad`.

## Desarrollo

El tema conserva las herramientas de `_s` para validación:

```sh
composer lint:php
composer lint:wpcs
npm run lint:js
```
