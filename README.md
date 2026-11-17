# StayDesk · página de lanzamiento

Página de presentación de **StayDesk**, una app de operaciones para hoteles de Florida: recepción, housekeeping,
ingeniería y chat con huéspedes ven el mismo estado de cada habitación, en inglés y en español.

- **En vivo:** https://staydeskhotel.com (dominio propio, servido por Vercel; www redirige aquí)
- **Link de Vercel:** https://staydesk-web-seven.vercel.app
- **Track del Claude Build Challenge:** Hospitality · Nivel 1 (Launch)

## Lighthouse

Medido en el link en vivo de Vercel, ventana Incógnito, dispositivo Mobile (Chrome DevTools), 16 de noviembre de 2026:

| Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|
| 94 | 95 | 100 | 100 |

Captura: [`docs/lighthouse-mobile.png`](docs/lighthouse-mobile.png). La primera medición dio 82 en Accesibilidad (contraste de etiquetas y roles ARIA); se corrigió en el commit «Accesibilidad: contraste de etiquetas y roles ARIA de los pasos».

## Qué hay aquí

| Archivo | Qué es |
|---|---|
| `index.html` | Toda la página: HTML, CSS y JavaScript en un solo archivo, sin dependencias ni paso de compilación. |
| `img/` | Capturas de la app, el logo y `og.jpg` (la imagen que sale al pegar el link en un chat). |
| `media/` | Los dos videos (presentación de 2 minutos y antes/después), sus portadas y los audios de la demo de voz. |
| `vercel.json` | Encabezados de seguridad y de caché para Vercel. |

### Secciones

1. **Promesa** (hero): "Your whole hotel, in one app", con el botón para pedir el piloto.
2. **Videos**: la app en dos minutos, y cómo creció del primer prototipo a la versión 25.8.
3. **Cómo funciona**: la habitación 214 recorre una mañana (salida → limpieza → inspección → lista), con animación.
4. **Funciones** y las dos demos en desarrollo (voz en español → orden en inglés, y botón de ayuda).
5. **Preguntas** y **llamado a la acción** con el correo info@staydeskhotel.com.

El botón **ES / EN** cambia todo el texto de la página; el diccionario en español está dentro de `index.html`.

## Verlo en tu computadora

No hace falta instalar nada. Desde esta carpeta:

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Publicar

El dominio staydeskhotel.com apunta a Vercel desde el DNS de Netlify (registro A `@` y CNAME `www`). Los registros del correo (MX, SPF y DKIM de Zoho) no se tocaron.

El repositorio está conectado a Vercel: cada `git push` a `main` publica la página sola en un minuto más o menos.

```bash
git add .
git commit -m "Describe el cambio"
git push
```

## Límites honestos

- Es la página de presentación, no la app. La app (StayDesk 25.8) es un prototipo de un solo hotel que hoy guarda los
  datos en cada navegador; todavía no tiene servidor ni cuentas reales (eso es el Nivel 2 y el Nivel 3 del reto).
- Las capturas y los videos usan datos de ejemplo inventados. No aparece ningún huésped ni empleado real.
- Probada en Chrome de computadora. No se ha probado en Safari, Firefox ni en teléfonos reales.
