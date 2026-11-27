# NOIR

Web didáctica e interactiva de recomendación de outfits. Temática oscura: negro, blanco, dorado y plateado.

## Recorrido

1. `index.html` muestra la animación del logo NOIR con un sonido envolvente (se puede activar o silenciar con el botón `♫ Sonido`; si el navegador bloquea el audio automático, aparece una pista para activarlo con un toque).
2. Al terminar la animación, la web entra en `select.html`: **solo el logo y dos opciones, Hombre y Mujer**. No hay menú superior ni otros enlaces.
3. Al elegir un género queda registrada la elección. Para entrar en la otra colección hay que volver a empezar: cualquier enlace a Hombre/Mujer lleva al inicio, se reproduce otra vez la animación y vuelve aparecer la selección.
4. `men.html` / `women.html` muestran los 225 looks de cada colección con filtros por estilo.
5. `style.html?c=<estilo>&g=<hombre|mujer>` muestra las 25 cards del estilo elegido.

## Funciones interactivas

- **Sonido de entrada**: acorde grave, campanadas y brillo sonoro sincronizados con la animación del logo; conmutador y control de audio bloqueado.
- **Favoritos en cada card**: botón `♡` sobre la imagen que guarda o quita el look sin abrir el detalle; contador en la cabecera y panel propio con `localStorage`.
- **Nombres nuevos**: cada estilo tiene 25 nombres propios y distintos (por ejemplo, «Años cincuenta», «Luna de encaje» o «Café de esquina»).
- **Buscador lateral** con los 12 estilos agrupados en masculinos, femeninos y mixtos; filtro por texto y miniaturas aleatorias.
- **Cards clicables** con detalle: imagen, categoría, paleta de colores (hex copiable al hacer clic), cuándo usarlo, cómo combinarlo, qué evitar, prendas clave y consejo.
- **Botón al azar** en todas las páginas.
- **Mosaico aleatorio** y **consejo NOIR** cambiante en el inicio.

## Estructura

- `assets/css/styles.css`: diseño, animaciones, sonido visual, cards y responsive.
- `assets/js/data.js`: 12 estilos con paleta, descripción, nombres propios y datos didácticos; genera 25 outfits por estilo.
- `assets/js/app.js`: audio del splash, selección de género, favoritos, buscador, modal, azar y galería.
- `assets/js/manifest.js`: manifiesto de 450 imágenes locales.
- `scripts/fetch-images-ddg.mjs` / `scripts/fetch-yandex.mjs`: descarga y filtrado de imágenes por estilo.

## Cómo verla

Abre `index.html` en el navegador o levanta un servidor local:

```bash
npx serve .
```

## Estilos

- **Masculinos:** Old Money, Streetwear, Clean Fit.
- **Femeninos:** Coquette, Kawaii, Preppy.
- **Mixtos:** Vintage, Gótico, Hippie, Casual, Formal, Alternativo.
