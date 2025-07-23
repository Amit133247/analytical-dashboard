
import { BarChart, ShowChart, PieChart, DonutLarge, Timeline } from "@mui/icons-material";

export const chartTypes = [
  { type: "bar", label: "Bar Chart", icon: <BarChart /> },
  { type: "line", label: "Line Chart", icon: <ShowChart /> },
  { type: "pie", label: "Pie Chart", icon: <PieChart /> },
  { type: "donut", label: "Donut Chart", icon: <DonutLarge /> },
  { type: "area", label: "Area Chart", icon: <Timeline /> },
];