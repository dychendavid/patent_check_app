import AnalysisResultCard from "@/components/analysis_result_card";
import AnalyzeFormCard from "@/components/analyze_form_card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Toaster } from "@/components/ui/toaster";
import useAnalysisController, {
  SaveAnalysisProps,
} from "@/controller/analysis_controller";
import { useToast } from "@/hooks/use-toast";
import useHistoryStore from "@/stores/history_store";
import useSearchStore from "@/stores/search_store";
import useUserStore from "@/stores/user_store";
import { AxiosError } from "axios";
import { AlertTriangle, Loader } from "lucide-react";
import { useRouter } from "next/router";
import React, { useState, useEffect, BaseSyntheticEvent } from "react";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader className="w-8 h-8 animate-spin text-zinc-300" />
    <span className="ml-2 text-zinc-300">Analyzing patent data...</span>
  </div>
);

enum OperateAnalysis {
  Save,
  Drop,
}

enum DialogAction {
  ViewHistory,
  DoSearch,
  DoDrop,
}

const AnalyzeFormPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [error, setError] = useState("");
  const [dialogAction, setDialogAction] = useState<DialogAction>();

  const historyStore = useHistoryStore();
  const userStore = useUserStore();
  const searchStore = useSearchStore();
  const router = useRouter();

  const {
    saveAnalysisMutation,
    savedAnalysis,
    refetchSavedAnalysis,
    checkPatentMutation,
  } = useAnalysisController(userStore.user_id);
  const { toast } = useToast();

  useEffect(() => {
    historyStore.setData(savedAnalysis);
  }, [savedAnalysis]);

  const handleClickSearch = (e: BaseSyntheticEvent) => {
    e.preventDefault();

    if (!isSaved) {
      setDialogAction(DialogAction.DoSearch);
      setIsOpenDialog(true);
      return;
    }

    doSearch();
  };

  const handleClickConfirm = (e: BaseSyntheticEvent) => {
    switch (dialogAction) {
      case DialogAction.DoSearch:
        doSearch();
        break;

      case DialogAction.ViewHistory:
        router.push("/histories", null, { shallow: true });
        break;

      case DialogAction.DoDrop:
        doSaveOrDropAnalysis(OperateAnalysis.Drop);
        break;
    }
  };

  const doSearch = () => {
    searchStore.setCurrentAnalysis(null);
    setError("");
    setIsOpenDialog(false);
    setIsLoading(true);

    checkPatentMutation.mutate(searchStore, {
      onSuccess: (data) => {
        searchStore.setCurrentAnalysis(data);
        setIsSaved(false);
      },
      onError: (e: Error) => {
        const defaultError = "Failed to perform analysis. Please try again.";
        if (e instanceof AxiosError) {
          const msg = e.response.data.detail.message || defaultError;

          setError(msg);
        } else {
          setError(e.message);
        }
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  const doSaveOrDropAnalysis = (action: OperateAnalysis) => {
    // setIsLoading(true);
    const data: SaveAnalysisProps = {
      user_id: userStore.user_id,
      analysis_id: searchStore.current.analysisId,
      status: action == OperateAnalysis.Save ? 1 : 0,
    };

    saveAnalysisMutation.mutate(data, {
      onSuccess: (data) => {
        toast({
          title: `Analysis ${
            action == OperateAnalysis.Save ? "Saved" : "Dropped"
          }.`,
        });
        console.log("action");
        if (action == OperateAnalysis.Drop) {
          historyStore.remove(searchStore.current.analysisId);
          setIsOpenDialog(false);
          setIsSaved(false);
        } else {
          historyStore.add(searchStore.current);
          setIsSaved(true);
        }
      },
      onError: (e: Error) => {
        const defaultError = "Failed to perform analysis. Please try again.";
        if (e instanceof AxiosError) {
          const msg = e.response.data.detail.message || defaultError;

          setError(msg);
        } else {
          setError(e.message);
        }
      },
      onSettled: () => {
        // setIsLoading(false);
      },
    });
  };

  const handleClickSaveAnalysis = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    doSaveOrDropAnalysis(OperateAnalysis.Save);
  };

  const handleClickDropAnalysis = (e: BaseSyntheticEvent) => {
    setDialogAction(DialogAction.DoDrop);
    setIsOpenDialog(true);
  };
  const handleClickViewHistory = (e: BaseSyntheticEvent) => {
    if (!isSaved) {
      e.preventDefault();
      setDialogAction(DialogAction.ViewHistory);
      setIsOpenDialog(true);
      return;
    }
  };
  return (
    <>
      <AlertDialog open={isOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsOpenDialog(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleClickConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        <div className="max-w-4xl mx-auto p-6 bg-zinc-950 min-h-screen">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-zinc-100">
              Patent Infringement Check
            </h1>
            <p className="text-zinc-400">
              Check potential patent infringements by company products
            </p>
          </div>

          <AnalyzeFormCard
            onClickSearch={handleClickSearch}
            onClickViewHistory={handleClickViewHistory}
          />

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
              onClickSaveAnalysis={handleClickSaveAnalysis}
              onClickDropAnalysis={handleClickDropAnalysis}
            />
          )}
        </div>
        <Toaster />
      </AlertDialog>
    </>
  );
};

export default AnalyzeFormPage;
