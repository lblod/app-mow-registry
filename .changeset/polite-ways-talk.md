---
"app-mow-registry": patch
---

Add hacky workaround to ensure road-marking and traffic-light concepts can be correctly consumed:
- Addition of a migration which adds default zonalities to traffic-light and road-marking concepts
- Add `zonality` relationship to traffic-light and road-marking concepts in JSON-API definitions
