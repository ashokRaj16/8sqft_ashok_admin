import { create } from "zustand";

interface DialogStore {
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

const useDialogStore = create<DialogStore>((set) => ({
  isDialogOpen: false,
  openDialog: () => set({ isDialogOpen: true }),
  closeDialog: () => set({ isDialogOpen: false }),
}));

export default useDialogStore;
