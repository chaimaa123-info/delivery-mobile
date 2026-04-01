import { create } from 'zustand';

export interface Colis {
  id: number;
  code: string;
  barcode: string;
  telephone: string;
  adresse: string;
  type_envoi: string;
  etape: string;
  methode_retour_fond: string;
  statut: string;
  montant_livraison: string;
  montant_retourne: string;
  poids: string;
  expediteur: string;
  destinatairee: string;
  mobile: string;
  street: string;
  demande: string;
  statutLivraison?: 'livré' | 'refusé' | 'reporté' | 'en attente';
}

interface TourState {
  colis: Colis[];
  historique: Colis[];
  scannedBarcode: string;
  setScannedBarcode: (code: string) => void;
  addColis: (colis: Colis) => void;
  setColis: (colisList: Colis[]) => void;
  validerTournee: () => void;
  resetColis: () => void;
  setHistorique: (hist: Colis[]) => void;
  addToHistorique: (colis: Colis) => void;
  removeColis: (code: string) => void;
  updateStatutColis: (
    barcode: string,
    statut: 'livré' | 'refusé' | 'reporté' | 'en attente'
  ) => void;
   mapAddresses: string[];
  setMapAddresses: (street: string[]) => void;

rescannedCodes: Record<string, string | null>;
setRescannedCode: (colisId: string, code: string | null) => void;



}

export const useTourStore = create<TourState>((set) => ({
  colis: [],
  historique: [],
  scannedBarcode: '',

  setScannedBarcode: (code: string) => set({ scannedBarcode: code }),

  addColis: (colis) =>
    set((state) => {
      const exists = state.colis.some((c) => c.barcode === colis.barcode);
      if (exists) return state;
      return { colis: [...state.colis, colis] };
    }),

  setColis: (colisList) => set(() => ({ colis: colisList })),

  validerTournee: () =>
    set((state) => ({
      historique: [
        ...state.historique,
        ...state.colis.map((c) => ({
          ...c,
          statutLivraison: 'livré' as const,
        })),
      ],
      colis: [],
    })),

  resetColis: () => set({ colis: [] }),

  removeColis: (code: string) =>
    set((state) => ({
      colis: state.colis.filter((c) => c.code !== code),
    })),

  setHistorique: (hist) => set(() => ({ historique: hist })),

  addToHistorique: (colis) =>
    set((state) => ({
      historique: [...state.historique, colis],
    })),

  

  updateStatutColis: (barcode, statut) =>
  set((state) => ({
    colis: state.colis.map((c) =>
      c.barcode === barcode ? { ...c, statutLivraison: statut } : c
    ),
  })),

   mapAddresses: [],
  setMapAddresses: (street: string[]) => set({ mapAddresses: street }),

  rescannedCodes: {} as Record<string, string | null>,

setRescannedCode: (colisId: string, code: string | null) =>
  set((state) => ({
    rescannedCodes: {
      ...state.rescannedCodes,
      [colisId]: code,
    },
  })),

}));
