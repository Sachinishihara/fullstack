import { create } from 'zustand'

let timeoutId

const useNotificationStore = create((set) => ({
  message: null,

  showMessage: (text, type = 'success') => {
    clearTimeout(timeoutId)
    set({ message: { text, type } })

    timeoutId = setTimeout(() => {
      set({ message: null })
    }, 5000)
  },

  clearMessage: () => {
    clearTimeout(timeoutId)
    set({ message: null })
  }
}))

export default useNotificationStore
