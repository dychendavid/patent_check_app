import InfringingProductCard from "@/components/infringing_product_card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SaveAnalysisProps } from "@/controller/analysis_controller";
import { useToast } from "@/hooks/use-toast";
import useHistoryStore, { AnalysisProps } from "@/stores/history_store";
import useSearchStore from "@/stores/search_store";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { Save, StarsIcon, StarOffIcon, StarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

type AnalysusResultCardProps = {
  analysis: AnalysisProps;
  onClickSaveAnalysis: any;
  onClickDropAnalysis: any;
};

const AnalysisResultCard = ({
  analysis,
  onClickSaveAnalysis,
  onClickDropAnalysis,
}: AnalysusResultCardProps) => {
  const historyStore = useHistoryStore();
  const searchStore = useSearchStore();
  const [isSaved, setIsSaved] = useState(true);

  const analysisDate =
    searchStore.current?.analysisDate &&
    format(searchStore.current.analysisDate, "yyyy-MM-dd HH:mm");

  useEffect(() => {
    let found = !!historyStore.data?.find(
      (element) => element.analysisId == searchStore.current?.analysisId
    );
    setIsSaved(found);
    // from history must show drop
    // from saerch must show save
    // historyStore.data changed from user toggle save/drop
    // searchStore.current changed from search/histroy
  }, [historyStore.data, searchStore.current?.analysisId]);

  return (
    <Card className="mb-8 bg-zinc-900 border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-zinc-100">Analysis Results</CardTitle>
          <p className="text-sm text-zinc-400">Analysis Date: {analysisDate}</p>
        </div>
        {isSaved ? (
          <button
            type="button"
            onClick={onClickDropAnalysis}
            className={
              "flex items-center gap-2 px-4 py-2 bg-rose-800 text-zinc-100 rounded-md hover:bg-rose-700 transition-colors"
            }
          >
            <StarOffIcon size={20} /> Drop it
          </button>
        ) : (
          <button
            type="button"
            onClick={onClickSaveAnalysis}
            className={
              "flex items-center gap-2 px-4 py-2 bg-zinc-800 text-lime-400 rounded-md hover:bg-zinc-600 transition-colors"
            }
          >
            <StarIcon size={20} /> Save Report
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
