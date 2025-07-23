export const getDefaultCategories = (type) => {
  const names = (() => {
    switch (type) {
      case "bar": return ["A", "B", "C", "D"];
      case "line": return ["W", "X", "Y", "Z"];
      case "pie": return ["Red", "Blue", "Green", "Yellow"];
      case "donut": return ["Apple", "Banana", "Cherry", "Date"];
      case "area": return ["Q1", "Q2", "Q3", "Q4"];
      default: return [];
    }
  })();
  return names.map(name => ({ name, color: "#1976d2" })); // default color
};


