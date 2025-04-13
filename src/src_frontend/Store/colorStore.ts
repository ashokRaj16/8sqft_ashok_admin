import { create } from 'zustand'

interface colorStore {
    color: string | null;
    setColor: (url: string) => void;
  }
const useColorStore = create<colorStore>((set) => ({
  color: null,
  setColor: (color) => set({ color }),
}))
export default useColorStore
