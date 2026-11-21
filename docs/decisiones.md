# Decisiones
## Alcance
- ¿Qué países? Solo Argentina; precios en pesos.
## Precios
- ¿Qué precio se muestra? El final: base × (1 + IVA 21% + percepción de Ganancias 30%). Las tasas se editan en data/impuestos.json.
- ¿Y los planes con anuncios? Se muestran y se pueden excluir con el filtro "sin anuncios".
## Disponibilidad
- ¿Qué pasa si un título sale de una plataforma? Cada disponibilidad tiene fecha "hasta"; vencida, deja de contar como disponible.
- ¿Cómo se filtra por idioma? Pasa si el idioma está en el audio o en los subtítulos.
## Técnicas
- ¿Base de datos? No: el catálogo es chico y lo edita una persona. JSON versionado en git.
- ¿Framework? No: servidor Node nativo; el mismo servicio sirve el frontend estático.
