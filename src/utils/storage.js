// Persistencia sencilla en localStorage: guarda y recupera los movimientos
// del navegador del usuario para que no se pierdan al recargar la página.

const STORAGE_KEY = 'roadtrip-finanzas:movements'
const STORAGE_VERSION = 1

export function loadMovements() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.movements)) {
      return null
    }
    return parsed.movements
  } catch (err) {
    console.error('No se pudieron cargar los datos guardados:', err)
    return null
  }
}

export function saveMovements(movements) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: STORAGE_VERSION, movements })
    )
    return true
  } catch (err) {
    console.error('No se pudieron guardar los datos:', err)
    return false
  }
}

export function clearMovements() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (err) {
    console.error('No se pudieron borrar los datos:', err)
    return false
  }
}

// Genera IDs únicos sin depender de un contador en memoria, para que
// funcione correctamente al recargar la página con datos ya guardados.
export function generateId() {
  return `mov-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
