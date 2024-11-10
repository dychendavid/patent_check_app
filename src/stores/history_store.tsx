import { create } from "zustand";

export type InfringementProductProps = {
  productName: string;
  infringementLikelihood: string;
  relevantClaims: string[];
  explanation: string;
  specificFeatures: string[];
};

export type AnalysisProps = {
  analysisId: number;
  patentId: string;
  companyName: string;
  analysisDate: string;
  overallRiskAssesment: string;
  topInfringingProducts: InfringementProductProps[];
};

type HistoryStore = {
  data: AnalysisProps[];
  add: (analysis: AnalysisProps) => void;
  remove: (key: number) => void;
  setData: (data: AnalysisProps[]) => void;
};

const useHistoryStore = create<HistoryStore>((set, get) => ({
  data: [],
  add: (analysis: AnalysisProps) => {
    set((state) => ({
      data: [...state.data, analysis],
    }));
  },
  remove: (analysisId: number) => {
    set((state) => ({
      data: state.data.filter((element) => element.analysisId != analysisId),
    }));
  },
  setData: (data: AnalysisProps[]) => {
    set({ data });
  },
}));

export default useHistoryStore;
