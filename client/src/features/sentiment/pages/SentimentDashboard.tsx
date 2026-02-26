import React from "react";
import SummaryOverview from "../components/SummaryOverview";
import StatsCards from "../components/StatsCards";
import SentimentDistribution from "../components/SentimentDistribution";
import SentimentInsights from "../components/SentimentInsights";
import ReportGeneration from "../components/ReportGeneration";

const SentimentDashboard: React.FC = () => {
  // Dummy reviews (later replace with API)
  const reviews = [
    { id: 1, sentiment: "very_positive" },
    { id: 2, sentiment: "positive" },
    { id: 3, sentiment: "neutral" },
    { id: 4, sentiment: "negative" },
    { id: 5, sentiment: "very_positive" },
    { id: 6, sentiment: "neutral" },
    { id: 7, sentiment: "very_negative" },
  { id: 8, sentiment: "very_negative" },
  { id: 9, sentiment: "very_negative" },

  ];

  // Total
  const totalReviews = reviews.length;

  // 5-Level Counts
  const veryPositiveCount = reviews.filter(
    (r) => r.sentiment === "very_positive"
  ).length;

  const positiveCount = reviews.filter(
    (r) => r.sentiment === "positive"
  ).length;

  const neutralCount = reviews.filter(
    (r) => r.sentiment === "neutral"
  ).length;

  const negativeCount = reviews.filter(
    (r) => r.sentiment === "negative"
  ).length;

  const veryNegativeCount = reviews.filter(
    (r) => r.sentiment === "very_negative"
  ).length;

  // Safe Percentages (avoid NaN)
  const veryPositivePercent =
    totalReviews > 0
      ? Math.round((veryPositiveCount / totalReviews) * 100)
      : 0;

  const positivePercent =
    totalReviews > 0
      ? Math.round((positiveCount / totalReviews) * 100)
      : 0;

  const neutralPercent =
    totalReviews > 0
      ? Math.round((neutralCount / totalReviews) * 100)
      : 0;

  const negativePercent =
    totalReviews > 0
      ? Math.round((negativeCount / totalReviews) * 100)
      : 0;

  const veryNegativePercent =
    totalReviews > 0
      ? Math.round((veryNegativeCount / totalReviews) * 100)
      : 0;

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
<div className="min-h-screen p-8 space-y-8 bg-gradient-to-br from-[#2d0a6b] via-[#5b247a] to-[#e94e77]">
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

      <ReportGeneration />
    </div>
  );
};

export default SentimentDashboard;
