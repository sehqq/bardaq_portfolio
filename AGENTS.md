# Project Rules & Design-to-Code Workflow

1. **Figma First:** Перед генерацией разметки всегда запрашивай стили, переменные и размеры через figma MCP по переданному node-id.
2. **Design Tokens:** Цвета, радиусы и шрифты выноси только в tailwind.config / CSS-переменные. Никаких хардкодных hex-значений в классах.
3. **Piecemeal Workflow:** Верстай строго по одной секции за раз (Hero -> Features -> CTA -> Footer).
4. **Code Quality:** Семантические теги HTML5, строгая типизация (TypeScript), адаптив mobile-first.
5. **Auto-Review:** После генерации компонента используй puppeteer MCP для проверки отображения на localhost:5173.