import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadState, saveState, resetState, ensureSession, answerWord as answerWordFn } from '../lib/storage'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, setState] = useState(() => ensureSession(loadState()))

  useEffect(() => {
    saveState(state)
  }, [state])

  // Re-check the session whenever the tab regains focus, in case the date rolled over.
  useEffect(() => {
    function onFocus() {
      setState((s) => ensureSession(s))
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [])

  const api = useMemo(
    () => ({
      state,
      answerWord: (word, selected) => setState((s) => answerWordFn(s, word, selected)),
      updateSettings: (patch) =>
        setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
      reset: () => setState(ensureSession(resetState())),
    }),
    [state],
  )

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
