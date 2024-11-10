import { AnalysisProps } from "./history_store";
import { create } from "zustand";

export type SearchProps = {
  patentId?: string;
  companyName?: string;
  current?: AnalysisProps;
  setCurrentAnalysis: (analysis: AnalysisProps) => void;
  setFormInfo: (patentId: string, companyName: string) => void;
};

const useSearchStore = create<SearchProps>((set, get) => ({
  setCurrentAnalysis: (analysis: AnalysisProps) => {
    set({
      current: analysis,
    });
  },
  setFormInfo(patentId: string, companyName: string) {
    set({
      patentId,
      companyName,
    });
  },
}));

export default useSearchStore;
