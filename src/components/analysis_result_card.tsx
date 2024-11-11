import { AlertModal } from "./modals/alert_modal";
import InfringingProductCard from "@/components/infringing_product_card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useAnalysisController from "@/controller/analysis_controller";
import { toast } from "@/hooks/use-toast";
import useHistoryStore, { AnalysisProps } from "@/stores/history_store";
import useSearchStore from "@/stores/search_store";
import useUserStore from "@/stores/user_store";
import { format } from "date-fns";
import { StarOffIcon, StarIcon } from "lucide-react";
import React, { useMemo, useState } from "react";

type AnalysusResultCardProps = {
  analysis: AnalysisProps;
  onError: (e: Error) => void;
};

enum OperateAnalysis {
  Save,
  Drop,
}

const AnalysisResultCard = ({ analysis, onError }: AnalysusResultCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const historyData = useHistoryStore((state) => state.data);
  const historyStore = useHistoryStore();
  const userStore = useUserStore();
  const currentAnalysis = useSearchStore((state) => state.current);
  const { saveAnalysisMutation } = useAnalysisController(userStore.user_id);

  const analysisDate = useMemo(() => {
    return currentAnalysis?.analysisDate
      ? format(currentAnalysis.analysisDate, "yyyy-MM-dd HH:mm")
      : null;
  }, [currentAnalysis?.analysisDate]);

  const isSaved = useMemo(
    () =>
      historyData.some(
        (element) => element.analysisId === currentAnalysis.analysisId
      ),
    [currentAnalysis, historyData]
  );

  const handleClickDrop = () => {
    setIsModalOpen(true);
  };

  const handleClickSave = () => {
    doSaveOrDropAnalysis(OperateAnalysis.Save);
  };
  const handleClickModalNo = () => {
    setIsModalOpen(false);
  };
  const handleClickModalYes = () => {
    setIsModalOpen(false);
    doSaveOrDropAnalysis(OperateAnalysis.Drop);
  };

  const doSaveOrDropAnalysis = (action: OperateAnalysis) => {
    const isSave = action == OperateAnalysis.Save ? 1 : 0;

    saveAnalysisMutation.mutate(
      {
        user_id: userStore.user_id,
        analysis_id: currentAnalysis.analysisId,
        status: isSave,
      },
      {
        onSuccess: (data) => {
          toast({
            title: `Analysis ${isSave ? "Saved" : "Dropped"}.`,
          });

          if (isSave) {
            historyStore.add(currentAnalysis);
          } else {
            historyStore.remove(currentAnalysis.analysisId);
            setIsModalOpen(false);
          }
        },
        onError: onError,
      }
    );
  };

  return (
    <Card className="mb-8 bg-zinc-900 border-zinc-800">
      <AlertModal
        open={isModalOpen}
        onClickNo={handleClickModalNo}
        onClickYes={handleClickModalYes}
      />
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-zinc-100">Analysis Results</CardTitle>
          <p className="text-sm text-zinc-400">Analysis Date: {analysisDate}</p>
        </div>
        {isSaved ? (
          <button
            type="button"
            onClick={handleClickDrop}
            className={
              "flex items-center gap-2 px-4 py-2 bg-rose-800 text-zinc-100 rounded-md hover:bg-rose-700 transition-colors"
            }
          >
            <StarOffIcon size={20} fill="currentColor" /> Drop
          </button>
        ) : (
          <button
            type="button"
            onClick={handleClickSave}
            className={
              "flex items-center gap-2 px-4 py-2 bg-zinc-800 text-lime-400 rounded-md hover:bg-zinc-600 transition-colors"
            }
          >
            <StarIcon size={20} /> Save
          </button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-zinc-300">
                Patent ID:
              </span>
              <p className="text-zinc-100">{analysis.patentId}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-zinc-300">
                Company:
              </span>
              <p className="text-zinc-100">{analysis.companyName}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-zinc-100">
              Top Infringing Products
            </h3>
            <div className="space-y-6">
              {analysis.topInfringingProducts.map((product, index) => (
                <InfringingProductCard product={product} key={index} />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResultCard;
