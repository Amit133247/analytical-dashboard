export const chartDataMap = {
  bar: {
    series: [{ name: "Bar Series", data: [10, 20, 30, 40] }],
    options: { chart: { id: "bar" }, xaxis: { categories: ["A", "B", "C", "D"] } },
  },
  line: {
    series: [{ name: "Line Series", data: [5, 15, 25, 35] }],
    options: { chart: { id: "line" }, xaxis: { categories: ["W", "X", "Y", "Z"] } },
  },
  pie: {
    series: [44, 55, 13, 43],
    options: { chart: { id: "pie" }, labels: ["Red", "Blue", "Green", "Yellow"] },
  },
  donut: {
    series: [21, 23, 19, 14],
    options: { chart: { id: "donut" }, labels: ["Apple", "Banana", "Cherry", "Date"] },
  },
  area: {
    series: [{ name: "Area Series", data: [12, 32, 22, 17] }],
    options: { chart: { id: "area" }, xaxis: { categories: ["Q1", "Q2", "Q3", "Q4"] } },
  },
};



