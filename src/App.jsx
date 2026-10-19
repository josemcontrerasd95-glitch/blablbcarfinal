import React, { useEffect, useMemo, useState } from 'react'
import { Car, Route, Luggage, Cloud, CloudOff, Loader2, AlertTriangle, X, Trash2 } from 'lucide-react'
import TransactionForm from './components/TransactionForm'
import Dashboard from './components/Dashboard'
import TransactionHistory from './components/TransactionHistory'
import SummaryFooter from './components/SummaryFooter'
import { MESES } from './data/mockData'
import {
  fetchMovements,
  addMovement,
  updateMovementPagado,
  clearAllMovements,
  generateId,
  isCloudEnabled,
} from './utils/storage'

const monthKeyOf = (fecha) => fecha.slice(0, 7) // "YYYY-MM"
const currentMonthKey = () => new Date().toISOString().slice(0, 7)

// El "curso" es un año académico de septiembre a agosto (p. ej. "2025-2026").
const cursoKeyOf = (fecha) => {
  const d = new Date(fecha + 'T00:00:00')
  const year = d.getFullYear()
  const month = d.getMonth() // 0 = enero ... 8 = septiembre
  return month >= 8 ? `${year}-${year + 1}` : `${year - 1}-${year}`
}
const currentCursoKey = () => cursoKeyOf(new Date().toISOString().slice(0, 10))

// Devuelve las 12 claves "YYYY-MM" (septiembre a agosto) que forman ese curso.
const monthsOfCurso = (cursoKey) => {
  const [startYear] = cursoKey.split('-').map(Number)
  const months = []
  for (let m = 8; m <= 11; m++) months.push(`${startYear}-${String(m + 1).padStart(2, '0')}`)
  for (let m = 0; m <= 7; m++) months.push(`${startYear + 1}-${String(m + 1).padStart(2, '0')}`)
  return months
}

const shiftCurso = (cursoKey, delta) => {
  const [start] = cursoKey.split('-').map(Number)
  return `${start + delta}-${start + delta + 1}`
}

// Dentro de un curso, elige el último mes con movimientos; si no hay
// ninguno, cae en el mes actual (si pertenece a ese curso) o en septiembre.
const pickMonthForCurso = (movementsList, cursoKey) => {
  const monthsInCurso = monthsOfCurso(cursoKey)
  const keysWithData = [...new Set(movementsList.map((m) => monthKeyOf(m.fecha)))]
    .filter((k) => monthsInCurso.includes(k))
    .sort()
  if (keysWithData.length > 0) return keysWithData[keysWithData.length - 1]
  return monthsInCurso.includes(currentMonthKey()) ? currentMonthKey() : monthsInCurso[0]
}

const cloudEnabled = isCloudEnabled()

export default function App() {
  const [movements, setMovements] = useState([])
  const [mode, setMode] = useState('global') // 'global' | 'mensual'
  const [selectedCurso, setSelectedCurso] = useState(currentCursoKey)
  const [selectedMonthKey, setSelectedMonthKey] = useState(currentMonthKey)

  const [loading, setLoading] = useState(true)
  const [justSaved, setJustSaved] = useState(false)
  const [syncError, setSyncError] = useState(null)

  // Carga inicial: trae los movimientos de Supabase (o de este navegador si
  // Supabase no está configurado) y se sitúa en el curso/mes más reciente.
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await fetchMovements()
        if (cancelled) return
        setMovements(data)
        if (data.length > 0) {
          const latest = [...data].sort((a, b) => (a.fecha < b.fecha ? 1 : -1))[0]
          const curso = cursoKeyOf(latest.fecha)
          setSelectedCurso(curso)
          setSelectedMonthKey(pickMonthForCurso(data, curso))
        }
      } catch (err) {
        if (!cancelled) {
          setSyncError(
            cloudEnabled
              ? 'No se pudieron cargar tus movimientos desde la nube. Comprueba tu conexión o la configuración de Supabase.'
              : 'No se pudieron cargar tus movimientos guardados en este dispositivo.'
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const flashSaved = () => {
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 1600)
  }

  // Añade un movimiento: se muestra al instante (optimista) y, si falla el
  // guardado remoto, se retira y se avisa.
  const handleAddMovement = async (movementInput) => {
    const movement = { id: generateId(), ...movementInput }
    setMovements((prev) => [...prev, movement])
    setSelectedCurso(cursoKeyOf(movement.fecha))
    setSelectedMonthKey(monthKeyOf(movement.fecha))
    setSyncError(null)

    try {
      await addMovement(movement)
      flashSaved()
    } catch (err) {
      setMovements((prev) => prev.filter((m) => m.id !== movement.id))
      setSyncError('No se ha podido guardar ese movimiento. Vuelve a intentarlo.')
    }
  }

  // Cambia el estado Pendiente <-> Pagado de un ingreso "Particular".
  const handleTogglePagado = async (id) => {
    const current = movements.find((m) => m.id === id)
    if (!current) return
    const newPagado = !current.pagado

    setMovements((prev) => prev.map((m) => (m.id === id ? { ...m, pagado: newPagado } : m)))
    setSyncError(null)

    try {
      await updateMovementPagado(id, newPagado)
      flashSaved()
    } catch (err) {
      setMovements((prev) => prev.map((m) => (m.id === id ? { ...m, pagado: current.pagado } : m)))
      setSyncError('No se ha podido actualizar el estado de pago. Vuelve a intentarlo.')
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm('¿Seguro que quieres borrar todos los movimientos guardados? Esta acción no se puede deshacer.')) return

    const previous = movements
    setMovements([])
    setSyncError(null)

    try {
      await clearAllMovements()
      setSelectedCurso(currentCursoKey())
      setSelectedMonthKey(currentMonthKey())
    } catch (err) {
      setMovements(previous)
      setSyncError('No se han podido borrar los datos. Vuelve a intentarlo.')
    }
  }

  // Navega al curso anterior/siguiente (delta = -1 o 1) y reajusta el mes.
  const handleCursoChange = (delta) => {
    setSelectedCurso((prev) => {
      const next = shiftCurso(prev, delta)
      setSelectedMonthKey(pickMonthForCurso(movements, next))
      return next
    })
  }

  // Los 12 meses (septiembre a agosto) del curso seleccionado, para el selector "mes a mes".
  const availableMonths = useMemo(() => monthsOfCurso(selectedCurso), [selectedCurso])

  // Movimientos visibles según el modo (global = todo el curso seleccionado, mensual = mes seleccionado)
  const visibleMovements = useMemo(() => {
    if (mode === 'global') return movements.filter((m) => cursoKeyOf(m.fecha) === selectedCurso)
    return movements.filter((m) => monthKeyOf(m.fecha) === selectedMonthKey)
  }, [movements, mode, selectedCurso, selectedMonthKey])

  // Un único donut combinado: gastos en tonos de rojo, ingresos en tonos de verde.
  const combinedData = useMemo(() => {
    const totals = { gasolina: 0, revision: 0, pasajero: 0, imprevistos: 0, blablacar: 0, particular: 0 }
    visibleMovements.forEach((m) => {
      totals[m.categoria] = (totals[m.categoria] ?? 0) + m.importe
    })
    return [
      { key: 'gasolina', name: 'Gasolina', value: Number(totals.gasolina.toFixed(2)), color: '#a3241d' },
      { key: 'revision', name: 'Revisión', value: Number(totals.revision.toFixed(2)), color: '#c62f27' },
      { key: 'pasajero', name: 'Pasajero', value: Number(totals.pasajero.toFixed(2)), color: '#e0483e' },
      { key: 'imprevistos', name: 'Imprevistos', value: Number(totals.imprevistos.toFixed(2)), color: '#f4a9a2' },
      { key: 'blablacar', name: 'BlaBlaCar', value: Number(totals.blablacar.toFixed(2)), color: '#1c6636' },
      { key: 'particular', name: 'Particular', value: Number(totals.particular.toFixed(2)), color: '#5bc47f' },
    ].filter((d) => d.value > 0)
  }, [visibleMovements])

  // Totales para el footer de resumen y para el centro del donut
  const summary = useMemo(() => {
    const ingresos = visibleMovements.filter((m) => m.tipo === 'ingreso').reduce((s, m) => s + m.importe, 0)
    const gastos = visibleMovements.filter((m) => m.tipo === 'gasto').reduce((s, m) => s + m.importe, 0)
    const pendientes = visibleMovements
      .filter((m) => m.categoria === 'particular' && !m.pagado)
      .reduce((s, m) => s + m.importe, 0)
    return { ingresos, gastos, pendientes }
  }, [visibleMovements])

  const summaryLabel = useMemo(() => {
    if (mode === 'global') {
      const [start, end] = selectedCurso.split('-')
      return `el curso ${start} – ${end}`
    }
    const [year, month] = selectedMonthKey.split('-')
    return `${MESES[parseInt(month, 10) - 1]} ${year}`
  }, [mode, selectedCurso, selectedMonthKey])

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="relative overflow-hidden bg-road-800">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full bg-road-400 blur-3xl" />
          <div className="absolute top-10 right-0 w-72 h-72 rounded-full bg-road-500 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-white">
              <Car size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                RoadTrip Finanzas
              </h1>
              <p className="text-road-200 text-sm flex items-center gap-1.5 mt-0.5">
                <Route size={14} />
                Control de gastos e ingresos de tus viajes en coche
              </p>
            </div>
            <Luggage size={26} className="text-road-200 ml-auto hidden sm:block" />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                cloudEnabled ? 'bg-income-500/20 text-income-50' : 'bg-white/10 text-road-100'
              }`}
              title={
                cloudEnabled
                  ? 'Tus datos se guardan en Supabase y están disponibles en cualquier dispositivo en el que inicies esta app.'
                  : 'Supabase no está configurado todavía: tus datos solo se guardan en este navegador. Mira el README para activar la sincronización.'
              }
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : cloudEnabled ? (
                <Cloud size={14} />
              ) : (
                <CloudOff size={14} />
              )}
              {loading
                ? 'Cargando tus movimientos...'
                : cloudEnabled
                ? justSaved
                  ? 'Sincronizado en la nube'
                  : 'Sincronización activa (todos tus dispositivos)'
                : 'Guardado solo en este dispositivo'}
            </span>
            {movements.length > 0 && (
              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/10 text-road-100 hover:bg-expense-500/80 hover:text-white transition-colors"
              >
                <Trash2 size={14} />
                Borrar todos los datos
              </button>
            )}
          </div>

          {!cloudEnabled && !loading && (
            <p className="mt-2.5 text-[11px] text-road-200/80 max-w-xl">
              Para tener tus datos en el móvil y el ordenador a la vez, configura Supabase (VITE_SUPABASE_URL y
              VITE_SUPABASE_ANON_KEY) — instrucciones en el README.
            </p>
          )}

          {syncError && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-expense-500/15 border border-expense-400/30 text-expense-50 text-xs px-3.5 py-2.5 max-w-xl">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <p className="flex-1">{syncError}</p>
              <button onClick={() => setSyncError(null)} className="shrink-0 hover:text-white" aria-label="Cerrar aviso">
                <X size={14} />
              </button>
            </div>
          )}
        </div>
        <div className="road-divider" />
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 -mt-2 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[380px,1fr] gap-6 items-start">
          <TransactionForm onAddMovement={handleAddMovement} />

          <div className="space-y-6">
            <Dashboard
              mode={mode}
              onModeChange={setMode}
              combinedData={combinedData}
              balance={summary.ingresos - summary.gastos}
              selectedCurso={selectedCurso}
              onCursoChange={handleCursoChange}
              availableMonths={availableMonths}
              selectedMonthKey={selectedMonthKey}
              onMonthChange={setSelectedMonthKey}
            />
            <TransactionHistory movements={visibleMovements} onTogglePagado={handleTogglePagado} />
          </div>
        </div>
      </main>

      {/* Footer de resumen fijo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 fixed bottom-4 left-0 right-0 z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <SummaryFooter
            label={summaryLabel}
            ingresos={summary.ingresos}
            gastos={summary.gastos}
            pendientes={summary.pendientes}
          />
        </div>
      </div>
    </div>
  )
}
