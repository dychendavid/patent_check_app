import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useHistoryStore from "@/stores/history_store";
import useSearchStore from "@/stores/search_store";
import { FileText, Loader, Search } from "lucide-react";
import Link from "next/link";
import { BaseSyntheticEvent, useState } from "react";

type AnalyzeFormCardProps = {
  onClickSearch: (e: BaseSyntheticEvent) => void;
  onClickViewHistory: (e: BaseSyntheticEvent) => void;
};

const AnalyzeFormCard = ({
  onClickSearch,
  onClickViewHistory,
}: AnalyzeFormCardProps) => {
  const [patentId, setPatentId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchStore = useSearchStore();
  const historyStore = useHistoryStore();
  const handleClickSubmit = (e: BaseSyntheticEvent) => {
    setIsLoading(true);
    searchStore.setFormInfo(patentId, companyName);
    onClickSearch(e);
    setIsLoading(false);
  };

  // console.log("dataLength", dataLength);

  return (
    <Card className="mb-8 bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-zinc-100">Analysis Input</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleClickSubmit} className="space-y-4">
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
              value={patentId}
              onChange={(e) => setPatentId(e.target.value)}
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
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-100 focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 placeholder-zinc-500"
              placeholder="e.g., Walmart"
              required
              disabled={isLoading}
            />
          </div>
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
              onClick={onClickViewHistory}
            >
              <FileText size={20} />
              View Saved Reports ({historyStore.data?.length})
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AnalyzeFormCard;
