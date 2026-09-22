// La app arranca sin movimientos: el historial lo construye el propio usuario
// desde el formulario.
// tipo: 'gasto' | 'ingreso'
// gasto.categoria: 'gasolina' | 'revision' | 'imprevistos'
// ingreso.categoria: 'blablacar' | 'particular'
// si categoria === 'particular' => nombre, pagado

export const initialMovements = []

export const GASTO_CATEGORIAS = [
  { value: 'gasolina', label: 'Gasolina' },
  { value: 'revision', label: 'Revisión' },
  { value: 'imprevistos', label: 'Imprevistos' },
]

export const INGRESO_CATEGORIAS = [
  { value: 'blablacar', label: 'BlaBlaCar' },
  { value: 'particular', label: 'Particular' },
]

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
