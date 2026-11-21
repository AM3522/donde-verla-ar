# Informe del proyecto: Dónde verla

## Plan
Wiki de series y películas para Argentina con ficha, plataformas, idiomas y precios de planes, más un comparador de la combinación más barata. Detalle en docs/plan.md y reglas en docs/spec.md (RN1-RN6, HU1-HU6).

## Por qué este orden de tareas
1. **Datos (T1-T2):** todo depende de ellos; sin precios ni catálogo no hay nada que probar.
2. **Reglas (T3-T5):** son lo más difícil (la RN5 recorre combinaciones y tiene desempates), así que van antes que la interfaz. Cada una se hizo en ciclo rojo-verde: primero el commit de tests (fallan) y después el de implementación (pasan).
3. **API (T6):** depende de las tres reglas y es lo único que el frontend necesita.
4. **Frontend (T7-T8):** va al final porque solo consume la API; primero estructura y estilos, después la lógica.
5. **Documentación final (T9):** cierra el trabajo con todo lo anterior marcado.

## Pruebas
- Automáticas (node --test): # tests 24 # pass 24 # fail 0 
- Archivos: test/precios.test.js (RN2), test/disponibilidad.test.js (RN1, RN3, RN4), test/combinacion.test.js (RN5, RN6), test/api.test.js (endpoints, HU1-HU5).
- Manuales sugeridas antes de entregar: abrir el sitio publicado, buscar "eterna", filtrar por Disney+ y por inglés, marcar tres títulos y calcular la combinación. Anotar acá fecha y resultado.

## Publicación
Backend y frontend en un solo servicio (ver README). Enlace público: completar en el README al publicar.
