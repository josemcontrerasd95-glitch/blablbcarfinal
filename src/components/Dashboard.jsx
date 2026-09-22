import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Globe2, CalendarDays, Compass, ChevronLeft, ChevronRight, MapPinned } from 'lucide-react'
import { MESES } from '../data/mockData'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null
  const item = payload[0]
  return (
    <div className="bg-white rounded-xl shadow-soft border border-road-100 px-3.5 py-2.5 text-xs">
      <p className="font-semibold text-road-700 flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.payload.color }} />
        {item.name}
      </p>
      <p className="font-medium text-road-500 mt-0.5">{item.value.toFixed(2)} €</p>
    </div>
  )
}

export default function Dashboard({
  mode,
  onModeChange,
  combinedData,
  balance,
  selectedCurso,
  onCursoChange,
  availableMonths,
  selectedMonthKey,
  onMonthChange,
}) {
  const [startYear, endYear] = selectedCurso.split('-')
  const isPositive = balance >= 0

  return (
    <div className="card p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-road-700 flex items-center justify-center text-white shadow-soft shrink-0">
            <Compass size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-road-900">Gastos e ingresos por categoría</h2>
            <div className="flex items-center gap-1 mt-0.5">
              <button
                type="button"
                onClick={() => onCursoChange(-1)}
                aria-label="Curso anterior"
                className="w-6 h-6 rounded-full flex items-center justify-center text-road-400 hover:text-road-700 hover:bg-road-100 transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              <p className="text-sm text-road-500 font-medium min-w-[112px] text-center">
                Curso {startYear} – {endYear}
              </p>
              <button
                type="button"
                onClick={() => onCursoChange(1)}
                aria-label="Curso siguiente"
                className="w-6 h-6 rounded-full flex items-center justify-center text-road-400 hover:text-road-700 hover:bg-road-100 transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-road-50 rounded-2xl p-1.5 border border-road-100 w-full sm:w-auto">
          <button
            onClick={() => onModeChange('global')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'global' ? 'bg-white text-road-800 shadow-soft' : 'text-road-400 hover:text-road-600'
            }`}
          >
            <Globe2 size={14} />
            Curso completo
          </button>
          <button
            onClick={() => onModeChange('mensual')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              mode === 'mensual' ? 'bg-white text-road-800 shadow-soft' : 'text-road-400 hover:text-road-600'
            }`}
          >
            <CalendarDays size={14} />
            Mes a mes
          </button>
        </div>
      </div>

      {mode === 'mensual' && (
        <div className="mb-6 flex flex-wrap gap-2">
          {availableMonths.map((mKey) => {
            const [year, month] = mKey.split('-')
            const label = MESES[parseInt(month, 10) - 1].slice(0, 3)
            const active = mKey === selectedMonthKey
            return (
              <button
                key={mKey}
                onClick={() => onMonthChange(mKey)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  active
                    ? 'bg-road-700 border-road-700 text-white shadow-soft'
                    : 'bg-white border-road-200 text-road-500 hover:border-road-400'
                }`}
              >
                {label} {year}
              </button>
            )
          })}
        </div>
      )}

      {combinedData.length === 0 ? (
        <div className="h-72 flex flex-col items-center justify-center text-center gap-3 rounded-2xl border-2 border-dashed border-road-200 bg-road-50/60">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-road-400 shadow-soft">
            <MapPinned size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold text-road-600">Todavía no hay ningún movimiento en este periodo</p>
            <p className="text-xs text-road-400 mt-1">Añade un gasto o un ingreso desde el formulario para ver el gráfico</p>
          </div>
        </div>
      ) : (
        <div className="relative h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={combinedData}
                dataKey="value"
                nameKey="name"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={2.5}
                stroke="#ffffff"
                strokeWidth={2}
              >
                {combinedData.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={9}
                wrapperStyle={{ fontSize: 12, paddingTop: 14 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 top-0 flex flex-col items-center justify-center pointer-events-none" style={{ bottom: '22%' }}>
            <span className={`text-2xl font-bold ${isPositive ? 'text-income-600' : 'text-expense-600'}`}>
              {isPositive ? '+' : ''}
              {balance.toFixed(2)} €
            </span>
            <span className="text-[10px] text-road-400 font-medium uppercase tracking-wide">Balance</span>
          </div>
        </div>
      )}
    </div>
  )
}
