import { create } from 'zustand'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { getUser, saveUser, removeUser } from '../services/persistentUser'

const savedUser = getUser()

if (savedUser) {
  blogService.setToken(savedUser.token)
}

const useUserStore = create((set) => ({
  user: savedUser,

  login: async (credentials) => {
    const user = await loginService.login(credentials)
    saveUser(user)
    blogService.setToken(user.token)
    set({ user })
  },

  logout: () => {
    removeUser()
    blogService.setToken(null)
    set({ user: null })
  }
}))

export default useUserStore
