import React, { useCallback, useState } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ResultPie({ candidate }) {
  const candidateData = candidate.map((x) => {
    return { name: x.header, value: x.voteCount };
  });
  return (
    <PieChart width={600} height={600}>
      <Legend verticalAlign="top" />
      <Pie
        data={candidateData}
        outerRadius={160}
        fill="#8884d8"
        label
        dataKey="value"
      >
        {candidateData.map((entry, index) => {
          return (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          );
        })}
      </Pie>
    </PieChart>
  );
}
