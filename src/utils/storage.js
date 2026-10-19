// Persistencia de los movimientos.
//
// Si hay credenciales de Supabase configuradas (VITE_SUPABASE_URL y
// VITE_SUPABASE_ANON_KEY), los movimientos se guardan en la nube y están
// disponibles desde cualquier dispositivo.
//
// Si no hay credenciales configuradas, la app sigue funcionando igual que
// antes, guardando únicamente en el localStorage de este navegador, para
// que el proyecto funcione "de fábrica" sin tener que configurar nada.

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const STORAGE_KEY = 'roadtrip-finanzas:movements'
const STORAGE_VERSION = 1
const TABLE = 'movements'

export const isCloudEnabled = () => isSupabaseConfigured

// ---------------------------------------------------------------------------
// Modo local (localStorage) — usado como fallback cuando Supabase no está
// configurado, para que la app nunca se quede sin funcionar.
// ---------------------------------------------------------------------------

function loadLocal() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!parsed || parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.movements)) {
      return []
    }
    return parsed.movements
  } catch (err) {
    console.error('No se pudieron cargar los datos guardados en este dispositivo:', err)
    return []
  }
}

function saveLocal(movements) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, movements }))
  } catch (err) {
    console.error('No se pudieron guardar los datos en este dispositivo:', err)
    throw err
  }
}

// ---------------------------------------------------------------------------
// Conversión entre el formato de la app y las filas de la tabla "movements"
// ---------------------------------------------------------------------------

function rowToMovement(row) {
  return {
    id: row.id,
    fecha: row.fecha,
    tipo: row.tipo,
    categoria: row.categoria,
    importe: Number(row.importe),
    ...(row.nombre != null ? { nombre: row.nombre } : {}),
    ...(row.pagado != null ? { pagado: row.pagado } : {}),
  }
}

function movementToRow(movement) {
  return {
    id: movement.id,
    fecha: movement.fecha,
    tipo: movement.tipo,
    categoria: movement.categoria,
    importe: movement.importe,
    nombre: movement.nombre ?? null,
    pagado: movement.pagado ?? null,
  }
}

// ---------------------------------------------------------------------------
// API pública (usada por App.jsx) — siempre asíncrona, funcione con
// Supabase o con localStorage, para que el resto de la app no tenga que
// preocuparse de cuál de los dos está activo.
// ---------------------------------------------------------------------------

// Carga todos los movimientos guardados.
export async function fetchMovements() {
  if (!supabase) return loadLocal()

  const { data, error } = await supabase.from(TABLE).select('*').order('fecha', { ascending: true })
  if (error) {
    console.error('Error al cargar movimientos de Supabase:', error)
    throw error
  }
  return data.map(rowToMovement)
}

// Añade un movimiento nuevo (ya con su id generado).
export async function addMovement(movement) {
  if (!supabase) {
    const next = [...loadLocal(), movement]
    saveLocal(next)
    return movement
  }

  const { data, error } = await supabase.from(TABLE).insert(movementToRow(movement)).select().single()
  if (error) {
    console.error('Error al guardar el movimiento en Supabase:', error)
    throw error
  }
  return rowToMovement(data)
}

// Cambia el estado Pagado/Pendiente de un ingreso "Particular".
export async function updateMovementPagado(id, pagado) {
  if (!supabase) {
    const next = loadLocal().map((m) => (m.id === id ? { ...m, pagado } : m))
    saveLocal(next)
    return
  }

  const { error } = await supabase.from(TABLE).update({ pagado }).eq('id', id)
  if (error) {
    console.error('Error al actualizar el estado de pago en Supabase:', error)
    throw error
  }
}

// Borra un movimiento concreto.
export async function deleteMovement(id) {
  if (!supabase) {
    saveLocal(loadLocal().filter((m) => m.id !== id))
    return
  }

  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) {
    console.error('Error al borrar el movimiento en Supabase:', error)
    throw error
  }
}

// Borra todos los movimientos.
export async function clearAllMovements() {
  if (!supabase) {
    window.localStorage.removeItem(STORAGE_KEY)
    return
  }

  // "neq" con un id imposible para poder borrar todas las filas de golpe.
  const { error } = await supabase.from(TABLE).delete().neq('id', '__never__')
  if (error) {
    console.error('Error al borrar todos los movimientos en Supabase:', error)
    throw error
  }
}

// Genera IDs únicos sin depender de un contador en memoria.
export function generateId() {
  return `mov-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
