# Dónde verla

Wiki de series y películas para Argentina: resumen, plataformas donde están, idiomas (audio y subtítulos) y precio de los planes. Además calcula la combinación de plataformas más barata para una lista de títulos.

**Enlace público:** (https://donde-verla-ar.onrender.com)

## Probarlo en tu compu
```bash
npm test      # 24 pruebas, sin instalar nada
npm start     # http://localhost:3000
```
Requiere Node 20 o superior. No tiene dependencias.

## Estructura
- `docs/`: idea, decisiones, glosario, preguntas abiertas, spec (RN y HU), plan, tareas e informe.
- `AGENTS.md` y `.cursor/rules/`: reglamento y roles de los agentes.
- `src/reglas.js`: reglas de negocio. `src/servidor.js`: API y archivos estáticos.
- `data/`: plataformas, precios, impuestos y catálogo (se editan a mano).
- `public/`: frontend. `test/`: pruebas.

## Publicar en internet (Render, un solo servicio)
1. Subí el repo a GitHub.
2. En Render: New, Web Service, elegí el repo. Build Command vacío, Start Command `npm start`.
3. Copiá la URL pública en este README y hacé un commit.
4. Si publicás el frontend aparte (Netlify), poné la URL de Render en `public/config.js` y en Render definí `FRONTEND_URL` con la URL de Netlify (CORS).

El plan gratuito de Render duerme el servicio: el primer pedido puede tardar unos 30 segundos.

## Actualizar datos
Editá `data/plataformas.json` (precios base), `data/impuestos.json` y `data/titulos.json` (campo `hasta` para fechas de salida). Los catálogos e idiomas cargados son un punto de partida: verificalos antes de entregar.
