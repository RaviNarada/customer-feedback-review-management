import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SentimentInsights: React.FC = () => {
  return (
    <Card className="shadow-xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">
          💡 Sentiment Insights
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="list-disc pl-6 space-y-3 text-white/90 leading-relaxed">
          <li>
            Most students are giving positive and very positive feedback.
          </li>
          <li>
            Neutral reviews indicate balanced satisfaction levels.
          </li>
          <li>
            Negative and very negative feedback should be monitored closely.
          </li>
          <li>
            Overall sentiment trend helps trainers improve course quality.
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default SentimentInsights;
