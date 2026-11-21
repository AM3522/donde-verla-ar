# Plan técnico
- **Arquitectura:** servidor Node (http nativo) con API JSON y frontend estático en public/. Un solo servicio.
- **Datos:** data/*.json versionados (sin base de datos; ver decisiones.md).
- **API:** GET /api/salud, /api/plataformas, /api/titulos?q&tipo&plataforma&idioma&sinAnuncios=1, /api/titulos/:id; POST /api/combinacion {ids, idioma, sinAnuncios}.
- **Dónde vive cada regla:** todas en src/reglas.js (funciones puras, sin I/O); el servidor solo las llama.
- **CORS:** acepta únicamente FRONTEND_URL si está definida.
- **Secretos:** hoy no hay; .env está en .gitignore por si se agregan.
- **Preguntas para el analista:** ver preguntas-abiertas.md.
