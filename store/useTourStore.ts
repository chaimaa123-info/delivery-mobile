import { create } from 'zustand';


interface Colis {
    code: string;
    numero: number;
  }

interface TourState {
  colis: string[];
  historique: string[][]; // Tableau de tournées (chaque tournée est un tableau de colis)
  addColis: (code: string) => void;
  setColis: (codes: string[]) => void;
  validerTournee: () => void;
  resetColis: () => void;
  setHistorique: (hist: string[][]) => void; // ✅ AJOUTÉ
}
let compteur = 1; // Compteur global pour numéroter les colis

export const useTourStore = create<TourState>((set) => ({
  colis: [],
  historique: [],
  addColis: (code) => set((state) => ({ colis: [...state.colis, code] })),
  setColis: (codes) => set(() => ({ colis: codes })),
  validerTournee: () => set((state) => ({
    historique: [...state.historique, state.colis],
    colis: [],
  })),
  resetColis: () => set({ colis: [] }),
  setHistorique: (hist) => set(() => ({ historique: hist })), // ✅ AJOUTÉ
}));
