import { API } from "@/configs/api";
import { AnalysisProps } from "@/stores/history_store";
import { SearchProps } from "@/stores/search_store";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";
import _ from "lodash";

export type SaveAnalysisProps = {
  user_id: number;
  analysis_id: number;
  status: number;
};

const useAnalysisController = (user_id: number) => {
  const { data: savedAnalysis, refetch: refetchSavedAnalysis } = useQuery<
    AnalysisProps[]
  >({
    queryKey: [API.SAVED_ANALYSES],
    queryFn: () => {
      const client = applyCaseMiddleware(axios.create());
      return client
        .get(`${API.SAVED_ANALYSES}?user_id=${user_id}`)
        .then((res) => res.data);
    },
    enabled: !!user_id,
  });

  const saveAnalysisMutation = useMutation({
    mutationFn: (form: SaveAnalysisProps) => {
      const client = applyCaseMiddleware(axios.create());
      return client
        .post(`${API.SAVE_ANALYSIS}`, { ...form })
        .then((res) => res.data);
    },
  });

  const checkPatentMutation = useMutation({
    mutationFn: (search: SearchProps) => {
      const client = applyCaseMiddleware(axios.create());
      return client
        .post(
          `${API.PATENT_CHECK}?publication_number=${search.patentId}&company_name=${search.companyName}`
        )
        .then((res) => res.data);
    },
  });

  return {
    savedAnalysis,
    refetchSavedAnalysis,
    saveAnalysisMutation,
    checkPatentMutation,
  };
};

export default useAnalysisController;
