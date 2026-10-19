import React from 'react'
import { Fuel, Wrench, AlertTriangle, Armchair, Users, User, CheckCircle2, Clock, ListChecks } from 'lucide-react'

const iconMap = {
  gasolina: Fuel,
  revision: Wrench,
  pasajero: Armchair,
  imprevistos: AlertTriangle,
  blablacar: Users,
  particular: User,
}

const labelMap = {
  gasolina: 'Gasolina',
  revision: 'Revisión',
  pasajero: 'Pasajero',
  imprevistos: 'Imprevistos',
  blablacar: 'BlaBlaCar',
  particular: 'Particular',
}

const formatFecha = (fecha) =>
  new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })

export default function TransactionHistory({ movements, onTogglePagado }) {
  const sorted = [...movements].sort((a, b) => (a.fecha < b.fecha ? 1 : -1))

  return (
    <div className="card p-6 sm:p-7">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-road-100 flex items-center justify-center text-road-700 shrink-0">
          <ListChecks size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-road-900">Historial de movimientos</h2>
          <p className="text-sm text-road-500">{sorted.length} movimiento{sorted.length !== 1 ? 's' : ''} en este periodo</p>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-10 text-road-400 text-sm">
          No hay movimientos registrados en este periodo todavía.
        </div>
      ) : (
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-road-400">
                <th className="px-2 pb-2 font-semibold">Fecha</th>
                <th className="px-2 pb-2 font-semibold">Categoría</th>
                <th className="px-2 pb-2 font-semibold">Detalle</th>
                <th className="px-2 pb-2 font-semibold text-right">Importe</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((m) => {
                const Icon = iconMap[m.categoria]
                const isGasto = m.tipo === 'gasto'
                return (
                  <tr key={m.id} className="border-t border-road-50 hover:bg-road-50/60 transition-colors">
                    <td className="px-2 py-3 text-road-600 whitespace-nowrap">{formatFecha(m.fecha)}</td>
                    <td className="px-2 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          isGasto ? 'bg-expense-50 text-expense-700' : 'bg-income-50 text-income-700'
                        }`}
                      >
                        <Icon size={13} />
                        {labelMap[m.categoria]}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-road-500">
                      {m.categoria === 'particular' ? (
                        <span className="inline-flex items-center gap-1.5">
                          {m.nombre}
                          <button
                            type="button"
                            onClick={() => onTogglePagado?.(m.id)}
                            title="Pulsa para cambiar el estado del pago"
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                              m.pagado
                                ? 'bg-income-100 text-income-700 hover:bg-income-200'
                                : 'bg-road-100 text-road-500 hover:bg-road-200'
                            }`}
                          >
                            {m.pagado ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                            {m.pagado ? 'Pagado' : 'Pendiente'}
                          </button>
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className={`px-2 py-3 text-right font-semibold whitespace-nowrap ${isGasto ? 'text-expense-600' : 'text-income-600'}`}>
                      {isGasto ? '-' : '+'}
                      {m.importe.toFixed(2)} €
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
