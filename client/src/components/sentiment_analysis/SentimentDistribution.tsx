import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  sentimentData: { name: string; value: number }[];
  colors: string[];
}

const SentimentDistribution: React.FC<Props> = ({ sentimentData, colors }) => {
  return (
    <Card className="shadow-xl rounded-5xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
      
      <CardHeader className="pb-2">
        <CardTitle className="text-5xl md:text-4xl font-bold text-white">
          📉 Sentiment Distribution (5‑Level Analysis)
        </CardTitle>
      </CardHeader>


     
      <CardContent className="pt-4 h-[600px] md:h-[660px]">
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                outerRadius="85%" // scales with container height/width
                label={{
                  fill: "#ffffff",
                  fontSize: 12,
                  fontWeight: 600,
                }}
                dataKey="value"
                isAnimationActive={false}
              >
                {sentimentData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>

              {/* Glass theme tooltip */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(45, 10, 107, 0.9)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  color: "#ffffff",
                  backdropFilter: "blur(10px)",
                }}
                itemStyle={{ color: "#ffffff" }}
                labelStyle={{ color: "#ffffff" }}
              />

              {/* Legend at the bottom */}
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  color: "#ffffff",
                  paddingTop: "8px",
                  fontWeight: 500,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentDistribution;