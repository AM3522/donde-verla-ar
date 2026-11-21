# Spec
**Objetivo:** consultar dónde ver un título en Argentina, en qué idioma y a qué precio.
**Roles:** visitante (consulta y arma listas) y editor (edita data/*.json). **Alcance:** ver idea.md.

## Reglas de negocio
- RN1: un título está disponible en una plataforma si su registro no tiene "hasta" o "hasta" es hoy o posterior.
- RN2: precio final = base × (1 + 0,21 + 0,30), redondeado al peso.
- RN3: por plataforma se muestra el plan más barato que cumple los filtros (por ejemplo, sin anuncios).
- RN4: el filtro de idioma pasa si el idioma está en el audio o en los subtítulos de esa disponibilidad.
- RN5: la combinación más barata para una lista es la de mayor cobertura; si empatan, la de menor costo (suma del plan más barato de cada plataforma); si vuelven a empatar, la de menos plataformas.
- RN6: una lista vacía o con títulos inexistentes se rechaza con error 400 y un mensaje claro.

## Historias de usuario
- HU1: Dado el catálogo, cuando busco "eterna", entonces veo la ficha de El Eternauta.
- HU2: Dado un título, cuando abro su ficha, entonces veo plataformas, idiomas y precio final (RN1, RN2, RN3).
- HU3: Dado el listado, cuando filtro por idioma o "sin anuncios", entonces solo veo opciones que cumplen (RN3, RN4).
- HU4: Dado el sitio, cuando miro "Planes y precios", entonces veo precio base y final de cada plan (RN2).
- HU5: Dada una lista de títulos, cuando calculo, entonces veo qué plataformas contratar y el costo mensual (RN5, RN6).
- HU6: Dado un título con "hasta" vencido, cuando lo consulto, entonces no figura como disponible (RN1).

## Casos borde
- Título sin plataformas vigentes: se muestra "No está disponible hoy".
- Empate de cobertura y costo: gana la combinación con menos plataformas.

## Pendientes
Ninguno.
