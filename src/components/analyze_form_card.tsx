import { AlertModal } from "./modals/alert_modal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useAnalysisController from "@/controller/analysis_controller";
import useHistoryStore from "@/stores/history_store";
import useSearchStore, { SearchProps } from "@/stores/search_store";
import useUserStore from "@/stores/user_store";
import { FileText, Loader, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BaseSyntheticEvent, useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type AnalyzeFormCardProps = {
  onError: (e: Error) => void;
};

enum ModalActionType {
  Search,
  ViewHistory,
}

const AnalyzeFormCard = ({ onError }: AnalyzeFormCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalActionType>();
  const currentAnalysis = useSearchStore((state) => state.current);
  const searchStore = useSearchStore();
  const historyData = useHistoryStore((state) => state.data);
  const userStore = useUserStore();
  const router = useRouter();
  const { checkPatentMutation } = useAnalysisController(userStore.user_id);

  const isInDraft = useMemo(() => {
    if (!currentAnalysis) {
      return false;
    }

    return !historyData.some(
      (element) => element.analysisId === currentAnalysis.analysisId
    );
  }, [currentAnalysis, historyData]);

  const { register, handleSubmit } = useForm();

  const onSubmit: SubmitHandler<SearchProps> = (data) => {
    searchStore.setFormInfo(data.patentId, data.companyName);
    if (isInDraft) {
      setModalType(ModalActionType.Search);
      setIsModalOpen(true);
    } else {
      doSearch();
    }
  };

  const handleClickModalNo = () => {
    setIsModalOpen(false);
  };

  const handleClickModalYes = () => {
    setIsModalOpen(false);
    if (modalType == ModalActionType.Search) {
      doSearch();
    } else {
      router.push("/histories");
    }
  };

  const doSearch = () => {
    setIsLoading(true);

    checkPatentMutation.mutate(useSearchStore.getState(), {
      onSuccess: (data) => {
        searchStore.setCurrentAnalysis(data);
      },
      onError,
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  const handleClickViewHistory = (e: BaseSyntheticEvent) => {
    if (isInDraft) {
      e.preventDefault();
      setModalType(ModalActionType.ViewHistory);
      setIsModalOpen(true);
    } else {
      router.push("/histories");
    }
  };

  return (
    <Card className="mb-8 bg-zinc-900 border-zinc-800">
      <AlertModal
        open={isModalOpen}
        onClickNo={handleClickModalNo}
        onClickYes={handleClickModalYes}
      />
      <CardHeader>
        <CardTitle className="text-zinc-100">Analysis Input</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="patentId"
              className="block text-sm font-medium mb-1 text-zinc-300"
            >
              Patent ID
            </label>
            <input
              id="patentId"
              type="text"
              {...register("patentId")}
              className="w-full p-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-100 focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 placeholder-zinc-500"
              placeholder="e.g., US-RE49889-E1"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium mb-1 text-zinc-300"
            >
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              {...register("companyName")}
              className="w-full p-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-100 focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 placeholder-zinc-500"
              placeholder="e.g., Walmart"
              required
              disabled={isLoading}
            />
          </div>
          {true && (
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-700 text-zinc-100 rounded-md hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Analyze
                  </>
                )}
              </button>

              <Link
                className="flex items-center gap-2 px-4 py-2 bg-zinc-700 text-zinc-100 rounded-md hover:bg-zinc-600 transition-colors"
                href={"/histories"}
                onClick={handleClickViewHistory}
              >
                <FileText size={20} />
                View Saved Reports ({historyData?.length})
              </Link>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AnalyzeFormCard;
