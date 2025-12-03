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
  address?: string; // Changed from description to address for BANSOS
  description?: string; // Keep description for extra details like "Keluarga Prasejahtera"
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

// Initial Mock Data for BANSOS
const INITIAL_CRITERIA: Criterion[] = [
  { id: 1, name: 'Penghasilan Keluarga', weight: 0.35, type: 'cost', description: 'Penghasilan total per bulan (Juta Rp)' },
  { id: 2, name: 'Jumlah Tanggungan', weight: 0.25, type: 'benefit', description: 'Jumlah anggota keluarga yang ditanggung' },
  { id: 3, name: 'Kondisi Rumah', weight: 0.20, type: 'cost', description: 'Skor kondisi fisik (1=Sangat Buruk, 10=Sangat Baik)' }, // Changed to Cost because "Buruk" (1) should be prioritized? Wait. Prompt said "Kondisi rumah (benefit)". Usually for aid, "Buruk" needs aid. If it's "Benefit", then Higher Score = Better Condition = Priority? NO. Usually Aid goes to the needy.
  // Let's strictly follow prompt: "Kondisi rumah (benefit)".
  // If Benefit: Higher Value = Higher Priority for Aid? OR Higher Value = Better House?
  // VIKOR ranks "Best" as rank 1.
  // If we want to give aid to "Worst House", and we use "Benefit", then we must score "Worst House" with HIGH value (e.g. "Tingkat Kerusakan").
  // Let's interpret "Kondisi rumah (benefit)" as "Tingkat Kelayakan Penerima" based on house? Or maybe "Skor Kerusakan"?
  // Let's stick to the prompt's "Benefit" type. I will name it "Tingkat Kebutuhan Renovasi" or just "Skor Kondisi Rumah (1=Mewah, 10=Gubuk)" so 10 is "Benefit" (Good for receiving aid).
  // Actually, let's just follow the prompt literally: "Kondisi rumah (benefit)".
  // I will assume input 1-10 where 10 is "Layak Dapat Bansos" (i.e. Bad Condition).
  
  { id: 4, name: 'Status Pekerjaan', weight: 0.10, type: 'cost', description: 'Skor kestabilan (1=Tidak Tetap, 5=PNS)' }, 
  // Prompt: "Status pekerjaan (cost)". Lower is "better" for VIKOR result (rank 1).
  // So if VIKOR seeks the "Best Alternative", and we want the "Best Candidate for Aid", then Rank 1 = Most Needy.
  // So for Cost attribute (Status Pekerjaan): Lower value = Better Rank.
  // So 1 (Unemployed) is Lower than 5 (PNS). Since it's Cost, 1 is preferred over 5. This makes sense for Aid.
  
  { id: 5, name: 'Pendidikan Terakhir', weight: 0.10, type: 'benefit', description: 'Skor Pendidikan (1=SD, 5=S2)' },
  // Prompt: "Pendidikan terakhir (benefit)". Higher = Better Rank.
  // This is weird for Bansos (usually low education needs more aid?).
  // Maybe the prompt implies "Scholarship Bansos"? Or maybe "Productive Aid" where education helps?
  // I will follow the prompt blindly: Benefit.
];

const INITIAL_ALTERNATIVES: Alternative[] = [
  { 
    id: 1, 
    name: 'Budi Santoso', 
    address: 'Jl. Merpati No. 12, RT 01/RW 05',
    description: 'Buruh Harian Lepas',
    values: { 1: 1.5, 2: 4, 3: 8, 4: 1, 5: 2 } // Low income, 4 kids, Bad house (8/10 need), Job(1), Edu(2)
  },
  { 
    id: 2, 
    name: 'Siti Aminah', 
    address: 'Gg. Kancil No. 5, RT 02/RW 01',
    description: 'Janda, Penjual Kue',
    values: { 1: 2.5, 2: 2, 3: 6, 4: 2, 5: 3 }
  },
  { 
    id: 3, 
    name: 'Rahmat Hidayat', 
    address: 'Jl. Kenari Blok A, No. 88',
    description: 'Supir Angkot',
    values: { 1: 3.0, 2: 5, 3: 7, 4: 2, 5: 2 }
  },
  { 
    id: 4, 
    name: 'Joko Widodo (Contoh)', 
    address: 'Komp. Mewah Indah',
    description: 'Pengusaha Sukses',
    values: { 1: 25.0, 2: 2, 3: 2, 4: 5, 5: 5 } // High income, Good house (2/10 need), Job(5), Edu(5)
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
      name: 'vikor-bansos-storage', // Changed storage key
    }
  )
);
