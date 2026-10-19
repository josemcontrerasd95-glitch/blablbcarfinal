// La app arranca sin movimientos: el historial lo construye el propio usuario
// desde el formulario.
// tipo: 'gasto' | 'ingreso'
// gasto.categoria: 'gasolina' | 'revision' | 'pasajero' | 'imprevistos'
// ingreso.categoria: 'blablacar' | 'particular'
// si categoria === 'particular' => nombre, pagado

export const initialMovements = []

export const GASTO_CATEGORIAS = [
  { value: 'gasolina', label: 'Gasolina', shortLabel: 'Gasolina' },
  { value: 'revision', label: 'Revisión', shortLabel: 'Revisión' },
  { value: 'pasajero', label: 'Pasajero (BlaBlaCar)', shortLabel: 'Pasajero' },
  { value: 'imprevistos', label: 'Imprevistos', shortLabel: 'Imprevistos' },
]

export const INGRESO_CATEGORIAS = [
  { value: 'blablacar', label: 'BlaBlaCar' },
  { value: 'particular', label: 'Particular' },
]

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
