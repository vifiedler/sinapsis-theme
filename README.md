# Sinapsis theme

Tema de WordPress para la biblioteca Sinapsis. El contenido se administra en
entradas y sus campos se gestionan con Secure Custom Fields (SCF).

## Estructura

- `index.php`: loop principal de entradas de la biblioteca.
- `template-parts/content.php`: tarjeta reutilizable para el loop.
- `template-parts/content-single.php`: detalle de una entrada.
- `inc/scf-functions.php`: lectura segura de campos SCF y normalización de imágenes.
- `assets/librerias/`: estilos propios del proyecto.

SCF ya expone los campos en la API REST. El tema no registra endpoints propios:
las plantillas PHP consumen los mismos campos mediante las funciones de SCF y
mantienen la presentación desacoplada de la fuente de datos.

## Campos utilizados

Los loops reconocen los campos existentes en la exportación del proyecto:
`descripcion`, `link`, `imagen`, `instalacion`, `codigo-ejemplo` y `dificultad`.

## Estado de interacción

La primera iteración no incluye scripts funcionales propios del catálogo. El
botón `Mostrar` utiliza elementos HTML nativos `details/summary` para abrir la
ficha a ancho completo, y la zona de favoritos es una maqueta visual preparada
para conectar drag and drop en una fase posterior.

El tema sí carga Bootstrap 5.3.8 y jQuery 4.0.0 como dependencias base para la
interfaz y las próximas iteraciones. No se aplica todavía lógica propia sobre
esas dependencias.
