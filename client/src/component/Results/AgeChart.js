import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
/*const data = [
  {
    name: "18-30",
    uv: 4,
    pv: 6,
    amt: 3,
  },
  {
    name: "31-44",
    uv: 5,
    pv: 6,
    amt: 4,
  },
  {
    name: "45-60",
    uv: 3,
    pv: 6,
    amt: 4,
  },
  {
    name: "60+",
    uv: 5,
    pv: 8,
    amt: 0,
  },
];
const names = ["uv", "pv", "amt"];*/

export default function AgeChart({ candidate }) {
  const ageData = [
    { name: "18-30" },
    { name: "31-44" },
    { name: "45-60" },
    { name: "60+" },
  ];
  candidate.forEach((element) => {
    const candidateVoterRanges = [0, 0, 0, 0];
    //console.log(element);
    element.voterAges.forEach((x) => {
      if (x >= 18 && x <= 30) candidateVoterRanges[0]++;
      else if (x >= 31 && x <= 44) candidateVoterRanges[1]++;
      else if (x >= 45 && x <= 60) candidateVoterRanges[2]++;
      else candidateVoterRanges[3]++;
    });
    ageData.forEach((x, index) => {
      x[element.header] = candidateVoterRanges[index];
    });
  });

  console.log(ageData);
  return (
    <BarChart width={600} height={500} data={ageData}>
      <XAxis
        dataKey="name"
        label={{ value: "Age Range", position: "insideBottom", offset: -2 }}
      />
      <YAxis
        tickCount={11}
        allowDecimals={false}
        label={{ value: "No. of Voters", angle: -90, position: "insideLeft" }}
      />
      <Tooltip></Tooltip>

      {candidate.map((x, index) => {
        return (
          <Bar
            dataKey={x.header}
            fill={COLORS[index % COLORS.length]}
            minPointSize={2}
          />
        );
      })}
      <Legend verticalAlign="top" />
    </BarChart>
  );
}
