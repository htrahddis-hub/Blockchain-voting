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

export default function GenderChart({ candidate }) {
  const genderData = [{ name: "Male" }, { name: "Female" }];
  candidate.forEach((element) => {
    genderData[0][element.header] = element.maleVoters;
    genderData[1][element.header] = element.femaleVoters;
  });

  //  console.log(ageData);
  return (
    <BarChart width={600} height={500} data={genderData}>
      <XAxis
        dataKey="name"
        label={{ value: "Gender", position: "insideBottom", offset: -2 }}
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
