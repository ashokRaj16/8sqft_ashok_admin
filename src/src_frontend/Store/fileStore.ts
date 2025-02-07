import {create} from 'zustand';

interface PdfStore {
  pdfUrl: string | null;
  setPdfUrl: (url: string) => void;
}

const usePdfStore = create<PdfStore>((set) => ({
  pdfUrl: null,
  setPdfUrl: (url: string) => set({ pdfUrl: url }),
}));

export default usePdfStore;
