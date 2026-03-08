import React from "react";
import {useState} from "react";
import SummaryOverview from "../components/SummaryOverview";
import StatsCards from "../components/StatsCards";
import SentimentDistribution from "../components/SentimentDistribution";
import SentimentInsights from "../components/SentimentInsights";
import ReportGeneration from "../components/ReportGeneration";
import AnalysisDataFetch from "../components/AnalysisDataFetch";
import type { SentimentCount } from "../components/types";

const SentimentDashboard: React.FC = () => {
    

  // Dummy reviews (later replace with API)
  const [name,setName] = useState("");
  const [name1,setName1] = useState("");
  const [reviews,setReviews] = useState<SentimentCount[]>([])

  

  // const reviews = [
  //   { id: 1, sentiment: "very_positive" },
  //   { id: 2, sentiment: "positive" },
  //   { id: 3, sentiment: "neutral" },
  //   { id: 4, sentiment: "negative" },
  //   { id: 5, sentiment: "very_positive" },
  //   { id: 6, sentiment: "neutral" },
  //   { id: 7, sentiment: "very_negative" },
  // { id: 8, sentiment: "very_negative" },
  // { id: 9, sentiment: "very_negative" },

  // ];

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

      {/* Stats Cards */}
      <StatsCards
        totalReviews={totalReviews}
        veryPositiveCount={veryPositiveCount}
        positiveCount={positiveCount}
        neutralCount={neutralCount}
        negativeCount={negativeCount}
        veryNegativeCount={veryNegativeCount}

      />

      {/* Pie Chart Distribution */}
      <SentimentDistribution
        sentimentData={sentimentData}
        colors={COLORS}
      />

      {/* Insights */}
      <SentimentInsights />

      <ReportGeneration name={name1} setName={setName1}/>
    </div>
  );
};

export default SentimentDashboard;
