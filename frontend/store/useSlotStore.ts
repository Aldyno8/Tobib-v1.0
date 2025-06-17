import { format, parseISO } from 'date-fns'
import { create } from 'zustand'

interface Slot {
  id: number
  start_time: string
  end_time: string
  is_available: boolean
  slot_created_at: string
  doctor: number
}

interface SlotStore {
  slots: Slot[]
  selectedSlot: Slot | null
  setSlots: (slots: Slot[]) => void
  selectSlot: (slot: Slot | null) => void
  getFormattedSlotTime: (slot: Slot) => {
    date: string
    dateLabel: string
    timeRange: string
    fullDate: string
  }
}

const useSlotStore = create<SlotStore>((set, get) => ({
  slots: [
    {
      "id": 1,
      "start_time": "2025-05-01T06:00:00Z",
      "end_time": "2025-05-01T18:00:00Z",
      "is_available": true,
      "slot_created_at": "2025-05-22T21:11:51.499246Z",
      "doctor": 8
    },
    {
      "id": 4,
      "start_time": "2025-05-01T08:00:00Z",
      "end_time": "2025-05-01T11:00:00Z",
      "is_available": true,
      "slot_created_at": "2025-05-22T21:22:38.488366Z",
      "doctor": 6
    }
  ],
  selectedSlot: null,

  setSlots: (slots) => set({ slots }),

  selectSlot: (slot) => set({ selectedSlot: slot }),

  getFormattedSlotTime: (slot) => {
    const startDate = parseISO(slot.start_time)
    const endDate = parseISO(slot.end_time)
    
    return {
      date: format(startDate, 'yyyy-MM-dd'),
      dateLabel: format(startDate, 'EEE d MMM'),
      timeRange: `${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}`,
      fullDate: format(startDate, 'd MMMM yyyy')
    }
  }
}))

export default useSlotStore