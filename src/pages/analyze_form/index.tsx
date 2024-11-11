import AnalysisResultCard from "@/components/analysis_result_card";
import AnalyzeFormCard from "@/components/analyze_form_card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/toaster";
import useAnalysisController from "@/controller/analysis_controller";
import useHistoryStore from "@/stores/history_store";
import useSearchStore from "@/stores/search_store";
import useUserStore from "@/stores/user_store";
import { AxiosError } from "axios";
import { AlertTriangle, Loader } from "lucide-react";
import React, { useState, useEffect } from "react";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader className="w-8 h-8 animate-spin text-zinc-300" />
    <span className="ml-2 text-zinc-300">Analyzing patent data...</span>
  </div>
);

const AnalyzeFormPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const historyStore = useHistoryStore();
  const userStore = useUserStore();
  const searchStore = useSearchStore();
  const { savedAnalysis } = useAnalysisController(userStore.user_id);

  useEffect(() => {
    if (savedAnalysis) {
      historyStore.setData(savedAnalysis);
      setIsLoading(false);
    }
  }, [savedAnalysis]);

  const onError = (e: Error) => {
    const defaultError = "Failed to perform analysis. Please try again.";
    if (e instanceof AxiosError) {
      const msg = e.response.data.detail.message || defaultError;

      setError(msg);
    } else {
      setError(e.message);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-zinc-950 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-zinc-100">
            Patent Infringement Check
          </h1>
          <p className="text-zinc-400">
            Check potential patent infringements by company products
          </p>
        </div>

        <AnalyzeFormCard onError={onError} />

        {error && (
          <Alert
            variant="destructive"
            className="mb-6 bg-red-900/50 border-red-800"
          >
            <AlertTriangle className="h-4 w-4 text-red-200" />
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {isLoading && <LoadingSpinner />}

        {searchStore.current && !isLoading && (
          <AnalysisResultCard
            analysis={searchStore.current}
            onError={onError}
          />
        )}
      </div>
      <Toaster />
    </>
  );
};

export default AnalyzeFormPage;
