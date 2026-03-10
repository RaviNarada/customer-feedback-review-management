import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  veryPositiveCount: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  veryNegativeCount: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  veryPositiveCount,
  positiveCount,
  neutralCount,
  negativeCount,
  veryNegativeCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {/* Very Positive */}
      <Card className="shadow-xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
        <CardHeader>
          <CardTitle className="text-white font-medium">
            😍 Very Positive
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-300">
            {veryPositiveCount}
          </p>
        </CardContent>
      </Card>

      {/* Positive */}
      <Card className="shadow-xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
        <CardHeader>
          <CardTitle className="text-white font-medium">
            😊 Positive
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-400">
            {positiveCount}
          </p>
        </CardContent>
      </Card>

      {/* Neutral */}
      <Card className="shadow-xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
        <CardHeader>
          <CardTitle className="text-white font-medium">
            😐 Neutral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-yellow-300">
            {neutralCount}
          </p>
        </CardContent>
      </Card>

      {/* Negative */}
      <Card className="shadow-xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
        <CardHeader>
          <CardTitle className="text-white font-medium">
            😕 Negative
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-orange-300">
            {negativeCount}
          </p>
        </CardContent>
      </Card>

      {/* Very Negative */}
      <Card className="shadow-xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
        <CardHeader>
          <CardTitle className="text-white font-medium">
            😡 Very Negative
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-red-400">
            {veryNegativeCount}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
