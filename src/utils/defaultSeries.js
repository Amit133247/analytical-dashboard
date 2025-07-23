export const getDefaultSeries = (type, categories) => {
  switch (type) {
    case "bar":
      return [{ name: "Bar Series", data: Array(categories.length).fill(10) }];
    case "line":
      return [{ name: "Line Series", data: Array(categories.length).fill(5) }];
    case "pie":
      return categories.map(() => 20);
    case "donut":
      return categories.map(() => 15);
    case "area":
      return [{ name: "Area Series", data: Array(categories.length).fill(12) }];
    default:
      return [];
  }
};