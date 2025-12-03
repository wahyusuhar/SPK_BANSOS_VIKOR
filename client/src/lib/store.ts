import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export type CriterionType = 'benefit' | 'cost';

export interface Criterion {
  id: number;
  name: string;
  weight: number;
  type: CriterionType;
  description?: string;
}

export interface Alternative {
  id: number;
  name: string;
  description?: string;
  values: Record<number, number>; // criterionId -> value
}

interface AppState {
  criteria: Criterion[];
  alternatives: Alternative[];
  addCriterion: (c: Omit<Criterion, 'id'>) => void;
  updateCriterion: (id: number, c: Partial<Criterion>) => void;
  deleteCriterion: (id: number) => void;
  addAlternative: (a: Omit<Alternative, 'id'>) => void;
  updateAlternative: (id: number, a: Partial<Alternative>) => void;
  deleteAlternative: (id: number) => void;
  resetData: () => void;
}

// Initial Mock Data
const INITIAL_CRITERIA: Criterion[] = [
  { id: 1, name: 'Harga', weight: 0.3, type: 'cost', description: 'Harga laptop dalam juta Rupiah' },
  { id: 2, name: 'RAM', weight: 0.2, type: 'benefit', description: 'Kapasitas RAM dalam GB' },
  { id: 3, name: 'Penyimpanan', weight: 0.2, type: 'benefit', description: 'Kapasitas SSD dalam GB' },
  { id: 4, name: 'Prosesor (Benchmark)', weight: 0.2, type: 'benefit', description: 'Skor benchmark CPU (ribuan)' },
  { id: 5, name: 'Berat', weight: 0.1, type: 'cost', description: 'Berat laptop dalam Kg' },
];

const INITIAL_ALTERNATIVES: Alternative[] = [
  { 
    id: 1, 
    name: 'MacBook Air M2', 
    description: 'Laptop ringan dengan performa efisien',
    values: { 1: 16, 2: 8, 3: 256, 4: 15, 5: 1.24 }
  },
  { 
    id: 2, 
    name: 'ASUS ROG Zephyrus', 
    description: 'Laptop gaming performa tinggi',
    values: { 1: 25, 2: 16, 3: 1000, 4: 22, 5: 1.7 }
  },
  { 
    id: 3, 
    name: 'Lenovo ThinkPad X1', 
    description: 'Laptop bisnis tangguh',
    values: { 1: 20, 2: 16, 3: 512, 4: 18, 5: 1.12 }
  },
  { 
    id: 4, 
    name: 'Acer Swift 3', 
    description: 'Laptop budget tipis',
    values: { 1: 10, 2: 8, 3: 512, 4: 10, 5: 1.2 }
  },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      criteria: INITIAL_CRITERIA,
      alternatives: INITIAL_ALTERNATIVES,
      
      addCriterion: (c) => set((state) => ({
        criteria: [...state.criteria, { ...c, id: Math.max(0, ...state.criteria.map(x => x.id)) + 1 }]
      })),
      
      updateCriterion: (id, c) => set((state) => ({
        criteria: state.criteria.map((item) => item.id === id ? { ...item, ...c } : item)
      })),
      
      deleteCriterion: (id) => set((state) => ({
        criteria: state.criteria.filter((item) => item.id !== id)
      })),
      
      addAlternative: (a) => set((state) => ({
        alternatives: [...state.alternatives, { ...a, id: Math.max(0, ...state.alternatives.map(x => x.id)) + 1 }]
      })),
      
      updateAlternative: (id, a) => set((state) => ({
        alternatives: state.alternatives.map((item) => item.id === id ? { ...item, ...a } : item)
      })),
      
      deleteAlternative: (id) => set((state) => ({
        alternatives: state.alternatives.filter((item) => item.id !== id)
      })),
      
      resetData: () => set({ criteria: INITIAL_CRITERIA, alternatives: INITIAL_ALTERNATIVES })
    }),
    {
      name: 'vikor-storage',
    }
  )
);
