import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useAnalysisController from "@/controller/analysis_controller";
import { AnalysisProps } from "@/stores/history_store";
import useSearchStore from "@/stores/search_store";
import useUserStore from "@/stores/user_store";
import { format } from "date-fns";
import { ArrowLeft, FileTextIcon, Router } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const HistoriesPage = () => {
  const searchStore = useSearchStore();
  const userStore = useUserStore();
  const router = useRouter();
  const { savedAnalysis, refetchSavedAnalysis } = useAnalysisController(
    userStore.user_id
  );
  const handleSelectAnalysis = (analysis: AnalysisProps) => {
    searchStore.setCurrentAnalysis(analysis);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-zinc-950 min-h-screen">
      <Card className="mb-8 bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-zinc-100">Saved Analysiss</CardTitle>
            <p className="text-sm text-zinc-400">
              {savedAnalysis?.length} saved Analysis
              {savedAnalysis?.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            className="flex items-center gap-2 px-4 py-2 bg-zinc-700 text-zinc-100 rounded-md hover:bg-zinc-600 transition-colors"
            href={"/"}
          >
            <ArrowLeft size={20} />
            Back
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {savedAnalysis?.map((analysis, index) => (
              <Link href={"/"} key={index}>
                <div
                  key={index}
                  className="border border-zinc-700 rounded-lg p-4 hover:bg-zinc-800 transition-colors cursor-pointer bg-zinc-900"
                  onClick={() => handleSelectAnalysis(analysis)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-zinc-100">
                        {analysis.companyName}
                      </h4>
                      <p className="text-sm text-zinc-400">
                        Patent ID: {analysis.patentId}
                      </p>
                      <p className="text-sm text-zinc-500">
                        Analysis Date:
                        {format(analysis.analysisDate, "yyyy-MM-dd HH:mm")}
                      </p>
                    </div>
                    <button
                      className="px-4 py-2 bg-zinc-700 text-zinc-100 rounded-md hover:bg-zinc-600 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectAnalysis(analysis);
                        router.push("/");
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </Link>
            ))}
            {savedAnalysis?.length === 0 && (
              <div className="text-center py-8 text-zinc-500">
                No saved Analysiss found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoriesPage;
