import React from "react";
import { useState } from "react";

import SummaryOverview from "../components/sentiment_analysis/SummaryOverview";
import SentimentDistribution from "../components/sentiment_analysis/SentimentDistribution";
import AnalysisDataFetch from "../components/sentiment_analysis/AnalysisDataFetch";

import type { SentimentCount } from "../components/sentiment_analysis/types";

const SentimentDashboard: React.FC = () => {
    

  // Dummy reviews (later replace with API)
  const [name,setName] = useState("");
  const [reviews,setReviews] = useState<SentimentCount[]>([])

  



 // Convert array → lookup object
const sentimentMap = Object.fromEntries(
  reviews.map((r) => [r.sentiment, r._count.sentiment])
);

// Counts
const veryPositiveCount = sentimentMap["VERY_GOOD"] ?? 0;
const positiveCount = sentimentMap["GOOD"] ?? 0;
const neutralCount = sentimentMap["NEUTRAL"] ?? 0;
const negativeCount = sentimentMap["POOR"] ?? 0;
const veryNegativeCount = sentimentMap["VERY_POOR"] ?? 0;

// Total
const totalReviews =
  veryPositiveCount +
  positiveCount +
  neutralCount +
  negativeCount +
  veryNegativeCount;

// Percent helper
const percent = (value: number) =>
  totalReviews > 0 ? Math.round((value / totalReviews) * 100) : 0;

// Percentages
const veryPositivePercent = percent(veryPositiveCount);
const positivePercent = percent(positiveCount);
const neutralPercent = percent(neutralCount);
const negativePercent = percent(negativeCount);
const veryNegativePercent = percent(veryNegativeCount);

// Chart Data
const sentimentData = [
  { name: "Very Positive", value: veryPositiveCount },
  { name: "Positive", value: positiveCount },
  { name: "Neutral", value: neutralCount },
  { name: "Negative", value: negativeCount },
  { name: "Very Negative", value: veryNegativeCount },
];
  // Chart Colors (IMPORTANT: must be OUTSIDE return)
  const COLORS = [
    "#16a34a", // Very Positive
    "#22c55e", // Positive
    "#facc15", // Neutral
    "#f97316", // Negative
    "#ef4444", // Very Negative
  ];

  return (
    

<div className="min-h-screen p-8 space-y-8 bg-linear-to-br from-[#2d0a6b] via-[#5b247a] to-[#e94e77]">

        {/* mention trainer to get analysis */}

      <AnalysisDataFetch name={name} setName={setName} setSentimentArray={setReviews}/>

      {/* Summary (Centered Percentages) */}
      <SummaryOverview
        veryPositivePercent={veryPositivePercent}
        positivePercent={positivePercent}
        neutralPercent={neutralPercent}
        negativePercent={negativePercent}
        veryNegativePercent={veryNegativePercent}
      />

      

      {/* Pie Chart Distribution */}
      <SentimentDistribution
        sentimentData={sentimentData}
        colors={COLORS}
      />

    
      

    </div>
  );
};

export default SentimentDashboard;
