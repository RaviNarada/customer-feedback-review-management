import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  veryPositivePercent: number;
  positivePercent: number;
  neutralPercent: number;
  negativePercent: number;
  veryNegativePercent: number;
}

const SummaryOverview: React.FC<Props> = ({
  veryPositivePercent,
  positivePercent,
  neutralPercent,
  negativePercent,
  veryNegativePercent,
}) => {
  return (
    <div className="w-full">
      <Card
        className="
          w-full shadow-2xl border border-white/20
          bg-white/10 backdrop-blur-md rounded-2xl text-white
          min-h-[350px] p-8
        "
      >
        {/* Two-column layout: left = heading card, right = stats grid */}
        <div className="flex flex-col gap-6 md:flex-row md:gap-8 h-full">
          {/* LEFT: Heading box */}
          <div
            className="
              md:w-[30%] w-full
             
              flex flex-col justify-center p-18
            "
          >
            <CardHeader className="pb-4 p-0">
              <CardTitle className="text-5xl md:text-6xl font-bold text-white">
                Summary Overview
              </CardTitle>
              <p className="text-white/90 text-sm md:text-base mt-3">
                Quick sentiment breakdown of student feedback
              </p>
            </CardHeader>
          </div>

          {/* RIGHT: Five sentiment boxes */}
          <div className="md:w-[72%] w-full">
            <CardContent className="p-0 h-full">
              <div
                className="
                  grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5 h-full
                "
              >
                {/* Very Positive */}
                <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-md flex flex-col justify-center items-center">
                  <p className="text-xl md:text-2xl text-white font-bold mb-3">
  Very Positive
</p>
                  <p className="text-3xl md:text-4xl font-bold text-green-300">
                    😍
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-green-300 mt-2">
                    {veryPositivePercent}%
                  </p>
                </div>

                {/* Positive */}
                <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-md flex flex-col justify-center items-center">
                  <p className="text-xl md:text-2xl text-white font-bold mb-3">Positive</p>
                  <p className="text-3xl md:text-4xl font-bold text-green-400">
                    😊
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-green-400 mt-2">
                    {positivePercent}%
                  </p>
                </div>

                {/* Neutral */}
                <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-md flex flex-col justify-center items-center">
                  <p className="text-xl md:text-2xl text-white font-bold mb-3">Neutral</p>
                  <p className="text-3xl md:text-4xl font-bold text-yellow-300">
                    😐
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-yellow-300 mt-2">
                    {neutralPercent}%
                  </p>
                </div>

                {/* Negative */}
                <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-md flex flex-col justify-center items-center">
                  <p className="text-xl md:text-2xl text-white font-bold mb-3">Negative</p>
                  <p className="text-3xl md:text-4xl font-bold text-orange-300">
                    😕
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-orange-300 mt-2">
                    {negativePercent}%
                  </p>
                </div>

                {/* Very Negative */}
                <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-md flex flex-col justify-center items-center">
                  <p className="text-xl md:text-2xl text-white font-bold mb-3">
                    Very Negative
                  </p>
                  <p className="text-3xl md:text-4xl font-bold text-red-400">
                    😡
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-red-400 mt-2">
                    {veryNegativePercent}%
                  </p>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SummaryOverview;