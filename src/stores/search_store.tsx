import { AnalysisProps } from "./history_store";
import { create } from "zustand";

export type SearchProps = {
  patentId?: string;
  companyName?: string;
  current?: AnalysisProps;
};

type SearchActions = {
  setCurrentAnalysis: (analysis: AnalysisProps) => void;
  setFormInfo: (patentId: string, companyName: string) => void;
};

type SearchStore = SearchProps & SearchActions;

const useSearchStore = create<SearchStore>((set, get) => ({
  patentId: "",
  companyName: "",
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
