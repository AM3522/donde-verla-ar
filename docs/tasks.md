# Tareas (ordenadas por dependencias)
| # | Tarea | Agente | Cubre | Depende de | Terminada cuando | Estado |
|---|---|---|---|---|---|---|
| T1 | Datos de plataformas, planes e impuestos | Backend | RN2, HU4 | — | Los JSON cargan y tienen precios | [ ] |
| T2 | Catálogo inicial de títulos | Analista | HU1, HU2 | — | 10 fichas con resumen, plataformas e idiomas | [ ] |
| T3 | Precio final | Tester + Backend | RN2 | T1 | Pasan sus tests | [ ] |
| T4 | Disponibilidad, plan más barato e idioma | Tester + Backend | RN1, RN3, RN4 | T1, T2 | Pasan sus tests | [ ] |
| T5 | Combinación más barata | Tester + Backend | RN5, RN6 | T4 | Pasan sus tests | [ ] |
| T6 | API HTTP con CORS | Tester + Backend | HU1-HU6 | T3, T4, T5 | Pasan sus tests | [ ] |
| T7 | Frontend: estructura y estilos | Frontend | HU1-HU4 | T6 | Se ve en celular y escritorio | [ ] |
| T8 | Frontend: fichas, filtros y combinación | Frontend | HU1-HU6 | T7 | Todo funciona contra la API | [ ] |
| T9 | README e informe | Revisor | — | T8 | Todo lo anterior marcado | [ ] |
