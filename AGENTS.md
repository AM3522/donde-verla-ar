# AGENTS.md
**Proyecto:** wiki "Dónde verla" (docs/idea.md). **Fuente de verdad:** docs/spec.md; si el código y la spec difieren, manda la spec.
**Documentos:** docs/{idea,decisiones,glosario,preguntas-abiertas,spec,plan,tasks,informe}.md
**Stack:** Node 20+, JavaScript ESM, http nativo, HTML/CSS/JS sin framework, tests con node:test.
**Reglas generales:** las reglas de negocio viven solo en src/reglas.js; sin secretos en el código; un commit por tarea; todos los tests pasan antes de commitear.
**Ciclo por tarea:** tester escribe tests (rojo) → desarrollador implementa sin tocar los tests (verde) → revisor aprueba → commit.
**Agentes:** ver .cursor/rules/agentes.mdc (analista, arquitecto, backend, frontend, tester, revisor).
