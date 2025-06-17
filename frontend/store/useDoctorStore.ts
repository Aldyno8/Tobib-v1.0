import { create } from 'zustand'

interface Doctor {
  username: string
  email: string
  specialization: string
  workplace: string
}

interface DoctorStore {
  doctors: Doctor[]
  setDoctors: (doctors: Doctor[]) => void
}

const useDoctorStore = create<DoctorStore>((set) => ({
  doctors: [],
  setDoctors: (doctors) => set({ doctors }),
}))

export default useDoctorStore
