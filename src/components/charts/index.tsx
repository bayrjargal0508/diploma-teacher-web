import AvgScoreChart from "./bar-chart";
import GroupSkillRadarChart from "./radar-chart";
import AverageScoreGauge from "./gauge-chart";

const DashboardCharts = () => {
  const classData = [
    { name: "8А бүлэг", avg: 90, attendance: 70 },
    { name: "8Б бүлэг", avg: 100, attendance: 90 },
    { name: "8В бүлэг", avg: 95, attendance: 60 },
    { name: "8Г бүлэг", avg: 80, attendance: 40 },
    { name: "8Д бүлэг", avg: 100, attendance: 85 },
  ];

  const radarDataSets = {
    class1: [
      { subject: "Шалгалт", group1: 110, group2: 130 },
      { subject: "Даалгавар", group1: 98, group2: 115 },
      { subject: "Ирц", group1: 120, group2: 100 },
      { subject: "Оролцоо", group1: 85, group2: 95 },
      { subject: "Юм олж бичих", group1: 90, group2: 105 },
    ],
    class2: [
      { subject: "Шалгалт", group1: 130, group2: 120 },
      { subject: "Даалгавар", group1: 105, group2: 115 },
      { subject: "Ирц", group1: 110, group2: 125 },
      { subject: "Оролцоо", group1: 95, group2: 90 },
      { subject: "Юм олж бичих", group1: 100, group2: 110 },
    ],
  };

  const avgPercent = 0.885;

  return (
    <div className="grid grid-cols-3 gap-2.5 w-full items-center justify-between">
      <AvgScoreChart data={classData} />
      <GroupSkillRadarChart dataSets={radarDataSets} />
      <AverageScoreGauge percent={avgPercent} />
    </div>
  );
};

export default DashboardCharts;
