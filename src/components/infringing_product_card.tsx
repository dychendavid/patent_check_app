import { InfringementProductProps } from "@/stores/history_store";
import React from "react";

type InfringingProductCardProps = {
  product: InfringementProductProps;
  key: number;
};

const InfringingProductCard = ({
  product,
  key,
}: InfringingProductCardProps) => {
  return (
    <div
      key={key}
      className="border border-zinc-700 rounded-lg p-4 hover:bg-zinc-800 transition-colors bg-zinc-900"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-medium text-zinc-100">
          {product.productName}
        </h4>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            product.infringementLikelihood === "High"
              ? "bg-red-900/50 text-red-200"
              : product.infringementLikelihood === "Medium"
              ? "bg-yellow-900/50 text-yellow-200"
              : "bg-slate-700/50 text-slate-200"
          }`}
        >
          {product.infringementLikelihood} Risk
        </span>
      </div>
      <p className="text-zinc-400 mb-3">{product.explanation}</p>
      <div className="mb-3">
        <span className="text-sm font-medium text-zinc-300">
          Relevant Claims:
        </span>
        <div className="flex flex-wrap gap-2 mt-1">
          {product.relevantClaims.map((claim) => (
            <span
              key={claim}
              className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded-md text-sm"
            >
              Claim {claim}
            </span>
          ))}
        </div>
      </div>
      <div>
        <span className="text-sm font-medium text-zinc-300">
          Specific Features:
        </span>
        <ul className="list-disc list-inside mt-1 text-zinc-400">
          {product.specificFeatures.map((feature, idx) => (
            <li key={idx} className="hover:text-zinc-300">
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InfringingProductCard;
