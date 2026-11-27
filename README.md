# NOIR

Web didáctica e interactiva de recomendación de outfits. Temática oscura: negro, blanco, dorado y plateado.

## Recorrido

1. `index.html` muestra la animación del logo NOIR y, al terminar, redirige a `select.html`.
2. `select.html` es una pantalla propia con las opciones **Hombre** y **Mujer**, más un test de estilo de 3 preguntas.
3. `men.html` / `women.html` muestran los 225 looks de cada colección con filtros por estilo.
4. `style.html?c=<estilo>&g=<hombre|mujer>` muestra las 25 cards del estilo elegido.

## Funciones interactivas

- **Buscador lateral** con los 12 estilos agrupados en masculinos, femeninos y mixtos; filtro por texto y miniaturas aleatorias.
- **Cards clicables** con detalle: imagen, categoría, paleta de colores (hex copiable al hacer clic), cuándo usarlo, cómo combinarlo, qué evitar y consejo.
- **Favoritos** guardados en `localStorage`, con contador en la cabecera y panel propio.
- **Botón al azar** en todas las páginas.
- **Mosaico aleatorio** y **consejo NOIR** cambiante en el inicio.
- **Test de estilo** que recomienda un estilo según tus respuestas.

## Estructura

- `assets/css/styles.css`: diseño, animaciones y responsive.
- `assets/js/data.js`: 12 estilos con paleta, descripción y datos didácticos; genera 25 outfits por estilo.
- `assets/js/app.js`: buscador, modal, favoritos, test, azar y galería.
- `assets/js/manifest.js`: manifiesto de imágenes descargadas.
- `scripts/fetch-images-ddg.mjs`: descarga y filtra imágenes por estilo (reanudable).
- `scripts/fetch-images.mjs` / `scripts/fill-images.mjs`: descarga inicial con Bing.

## Cómo verla

Abre `index.html` en el navegador o levanta un servidor local:

```bash
npx serve .
```

## Estilos

- **Masculinos:** Old Money, Streetwear, Clean Fit.
- **Femeninos:** Coquette, Kawaii, Preppy.
- **Mixtos:** Vintage, Gótico, Hippie, Casual, Formal, Alternativo.
