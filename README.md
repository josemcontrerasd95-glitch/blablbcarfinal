# RoadTrip Finanzas 🚗

SPA en React + Vite + Tailwind CSS para controlar los gastos e ingresos asociados al uso de tu coche, con foco en viajes de BlaBlaCar.

## Funcionalidades del dashboard

- **Donut combinado**: un único gráfico circular con los gastos (tonos de rojo: gasolina, revisión, imprevistos) y los ingresos (tonos de verde: BlaBlaCar, particulares) del periodo seleccionado, con el balance en el centro.
- **Curso académico seleccionable**: por defecto va de septiembre a agosto. Usa las flechas junto al título del dashboard para navegar a cursos anteriores o posteriores; el desglose "Curso completo" y el selector de meses de "Mes a mes" se ajustan automáticamente a ese curso.
- **Estado de pago editable**: en el historial, la etiqueta "Pagado" / "Pendiente" de los ingresos de tipo "Particular" es un botón — púlsala para cambiar el estado sin tener que editar el movimiento.

## Puesta en marcha local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Build de producción

```bash
npm run build
npm run preview
```

## Despliegue en Vercel

```bash
npm install -g vercel
vercel
```

Vercel detecta Vite automáticamente (Build Command: `npm run build`, Output Directory: `dist`).

## Guardado de datos

La app arranca **sin movimientos**: el historial lo construyes tú desde el formulario.

Cada movimiento que añades se guarda automáticamente en el `localStorage` del navegador (clave `roadtrip-finanzas:movements`), así que al recargar la página o volver más tarde tus datos siguen ahí. No hace falta servidor ni base de datos.

- El indicador de la cabecera confirma que los datos se están guardando.
- El botón "Borrar todos los datos" permite reiniciar el historial (pide confirmación).

⚠️ Al ser `localStorage`, los datos son **locales a ese navegador y ese dispositivo**: no se sincronizan entre el móvil y el ordenador, y se perderían si borras los datos de navegación. Si en el futuro quieres tener los datos disponibles en varios dispositivos, habría que añadir un backend (por ejemplo, una base de datos como Supabase o Firebase) — puedo ayudarte a montarlo si lo necesitas.

## Estructura

```
src/
  data/mockData.js          → catálogos de categorías y meses
  utils/storage.js          → guardado/carga/borrado en localStorage
  components/TransactionForm.jsx     → formulario de alta de movimientos
  components/Dashboard.jsx           → donut combinado + selector de curso + filtros (global / mes a mes)
  components/TransactionHistory.jsx  → tabla de historial
  components/SummaryFooter.jsx       → balance inferior (rojo/verde)
  App.jsx                    → composición del dashboard
```
