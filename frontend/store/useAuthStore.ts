import { create } from 'zustand'

type Token = {
  access: string
  refresh: string
}

interface AuthStore {
  token: Token | null
  setToken: (token: Token) => void
}

const useAuthStore = create<AuthStore>((set) => ({
  token: null, 
  setToken: (token) => set({ token }),
}))

export default useAuthStore
