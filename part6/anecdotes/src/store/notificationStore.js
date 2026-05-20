import { create } from 'zustand'

export const useNotificationStore = create((set) => ({
  notification: '',

  setNotification: (message) => {
    set({ notification: message })

    setTimeout(() => {
      set({ notification: '' })
    }, 5000)
  }
}))