import React, { useState } from 'react'
import { Fuel, Wrench, AlertTriangle, Armchair, Users, Car, Plus, User, CheckCircle2, Clock } from 'lucide-react'
import { GASTO_CATEGORIAS, INGRESO_CATEGORIAS } from '../data/mockData'

const todayISO = () => new Date().toISOString().slice(0, 10)

const emptyForm = {
  fecha: todayISO(),
  tipo: 'gasto',
  categoria: 'gasolina',
  nombre: '',
  pagado: false,
  importe: '',
}

const gastoIcons = {
  gasolina: Fuel,
  revision: Wrench,
  pasajero: Armchair,
  imprevistos: AlertTriangle,
}

export default function TransactionForm({ onAddMovement }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const isGasto = form.tipo === 'gasto'
  const isParticular = form.tipo === 'ingreso' && form.categoria === 'particular'

  const handleTipoChange = (tipo) => {
    setForm((prev) => ({
      ...prev,
      tipo,
      categoria: tipo === 'gasto' ? 'gasolina' : 'blablacar',
      nombre: '',
      pagado: false,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const importeNum = parseFloat(form.importe)

    if (!form.fecha) return setError('Indica la fecha del movimiento.')
    if (!importeNum || importeNum <= 0) return setError('Indica un importe válido mayor que 0.')
    if (isParticular && !form.nombre.trim()) return setError('Indica el nombre de la persona.')

    setError('')
    onAddMovement({
      fecha: form.fecha,
      tipo: form.tipo,
      categoria: form.categoria,
      ...(isParticular ? { nombre: form.nombre.trim(), pagado: form.pagado } : {}),
      importe: importeNum,
    })

    setForm({ ...emptyForm, fecha: form.fecha, tipo: form.tipo, categoria: form.categoria })
  }

  return (
    <div className="card p-6 sm:p-7">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-road-700 flex items-center justify-center text-white shadow-soft shrink-0">
          <Car size={22} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-road-900">Nuevo movimiento</h2>
          <p className="text-sm text-road-500">Registra un gasto o un ingreso del coche</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Selector tipo Gasto / Ingreso */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleTipoChange('gasto')}
            className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-medium text-sm transition-all border-2 ${
              isGasto
                ? 'bg-expense-50 border-expense-500 text-expense-700 shadow-soft'
                : 'bg-white border-road-100 text-road-400 hover:border-expense-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-expense-500" />
            Gasto
          </button>
          <button
            type="button"
            onClick={() => handleTipoChange('ingreso')}
            className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-medium text-sm transition-all border-2 ${
              !isGasto
                ? 'bg-income-50 border-income-500 text-income-700 shadow-soft'
                : 'bg-white border-road-100 text-road-400 hover:border-income-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-income-500" />
            Ingreso
          </button>
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-xs font-semibold text-road-600 mb-1.5">Fecha</label>
          <input
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            className="w-full rounded-xl border border-road-200 px-3.5 py-2.5 text-sm text-road-800 focus:outline-none focus:ring-2 focus:ring-road-400 focus:border-transparent"
          />
        </div>

        {/* Categoría según tipo */}
        {isGasto ? (
          <div>
            <label className="block text-xs font-semibold text-road-600 mb-1.5">Categoría de gasto</label>
            <div className="grid grid-cols-2 gap-2">
              {GASTO_CATEGORIAS.map(({ value, label, shortLabel }) => {
                const Icon = gastoIcons[value]
                const active = form.categoria === value
                return (
                  <button
                    type="button"
                    key={value}
                    title={label}
                    onClick={() => setForm({ ...form, categoria: value })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-medium border transition-all ${
                      active
                        ? 'bg-expense-500 border-expense-500 text-white shadow-soft'
                        : 'bg-white border-road-100 text-road-500 hover:border-expense-300'
                    }`}
                  >
                    <Icon size={16} />
                    {shortLabel ?? label}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-road-600 mb-1.5">Origen del ingreso</label>
            <div className="grid grid-cols-2 gap-2">
              {INGRESO_CATEGORIAS.map(({ value, label }) => {
                const active = form.categoria === value
                const Icon = value === 'blablacar' ? Users : User
                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setForm({ ...form, categoria: value })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-all ${
                      active
                        ? 'bg-income-500 border-income-500 text-white shadow-soft'
                        : 'bg-white border-road-100 text-road-500 hover:border-income-300'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Campos condicionales de Particular */}
        {isParticular && (
          <div className="rounded-2xl bg-income-50 border border-income-200 p-4 space-y-3 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-semibold text-income-700 mb-1.5">Nombre de la persona</label>
              <input
                type="text"
                placeholder="Ej. Laura Gómez"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full rounded-xl border border-income-200 px-3.5 py-2.5 text-sm text-road-800 bg-white focus:outline-none focus:ring-2 focus:ring-income-400"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-income-700">Estado del pago</span>
              <button
                type="button"
                onClick={() => setForm({ ...form, pagado: !form.pagado })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  form.pagado ? 'bg-income-500 text-white' : 'bg-white text-road-500 border border-road-200'
                }`}
              >
                {form.pagado ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                {form.pagado ? 'Pagado' : 'Pendiente'}
              </button>
            </div>
          </div>
        )}

        {/* Importe */}
        <div>
          <label className="block text-xs font-semibold text-road-600 mb-1.5">Importe (€)</label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={form.importe}
              onChange={(e) => setForm({ ...form, importe: e.target.value })}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-road-800 focus:outline-none focus:ring-2 ${
                isGasto ? 'border-road-200 focus:ring-expense-400' : 'border-road-200 focus:ring-income-400'
              }`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-road-400 text-sm">EUR</span>
          </div>
        </div>

        {error && <p className="text-xs font-medium text-expense-600 bg-expense-50 border border-expense-200 rounded-lg px-3 py-2">{error}</p>}

        <button
          type="submit"
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm text-white shadow-soft transition-transform active:scale-[0.98] ${
            isGasto ? 'bg-expense-500 hover:bg-expense-600' : 'bg-income-500 hover:bg-income-600'
          }`}
        >
          <Plus size={18} />
          Añadir {isGasto ? 'gasto' : 'ingreso'}
        </button>
      </form>
    </div>
  )
}
