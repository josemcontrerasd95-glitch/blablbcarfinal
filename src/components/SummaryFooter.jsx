import React from 'react'
import { TrendingUp, TrendingDown, Wallet, MapPin } from 'lucide-react'

export default function SummaryFooter({ label, ingresos, gastos, pendientes }) {
  const balance = ingresos - gastos
  const isPositive = balance >= 0

  return (
    <div className="card p-5 sm:p-6 sticky bottom-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
        <div className="flex items-center gap-3 lg:pr-6 lg:border-r lg:border-road-100">
          <div className="w-10 h-10 rounded-xl bg-road-100 flex items-center justify-center text-road-700 shrink-0">
            <MapPin size={18} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-road-400 uppercase tracking-wide">Resumen de</p>
            <p className="text-sm font-semibold text-road-800">{label}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-income-50 text-income-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
            <div>
              <p className="text-[11px] text-road-400 font-medium">Ingresos</p>
              <p className="text-sm font-bold text-income-600">+{ingresos.toFixed(2)} €</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-expense-50 text-expense-600 flex items-center justify-center">
              <TrendingDown size={16} />
            </div>
            <div>
              <p className="text-[11px] text-road-400 font-medium">Gastos</p>
              <p className="text-sm font-bold text-expense-600">-{gastos.toFixed(2)} €</p>
            </div>
          </div>

          {pendientes > 0 && (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-road-100 text-road-500 flex items-center justify-center text-xs font-bold">
                !
              </div>
              <div>
                <p className="text-[11px] text-road-400 font-medium">Pendiente de cobro</p>
                <p className="text-sm font-bold text-road-600">{pendientes.toFixed(2)} €</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 lg:pl-6 lg:border-l lg:border-road-100">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isPositive ? 'bg-income-500' : 'bg-expense-500'}`}>
            <Wallet size={18} className="text-white" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-road-400 uppercase tracking-wide">Balance final</p>
            <p className={`text-2xl font-bold ${isPositive ? 'text-income-600' : 'text-expense-600'}`}>
              {isPositive ? '+' : ''}
              {balance.toFixed(2)} €
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
