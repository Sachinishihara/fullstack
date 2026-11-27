import { create } from 'zustand'

let timeoutId

const useNotificationStore = create(set => ({
  message: '',

  showNotification: message => {
    clearTimeout(timeoutId)

    set({ message })

    timeoutId = setTimeout(() => {
      set({ message: '' })
    }, 5000)
  }
}))

export default useNotificationStore