export const getDefaultSeries = (type, categories) => {
  switch (type) {
    case "bar":
      return [{ name: "Bar Series", data: categories.map((elem) => elem?.value ?? 10) }];
    case "line":
      return [{ name: "Line Series", data: categories.map((elem) => elem?.value ?? 5)  }];
    case "pie":
      return categories.map((elem) => elem?.value ?? 10) ;
    case "donut":
      return categories.map((elem) => elem?.value ?? 10) ;
    case "area":
      return [{ name: "Area Series", data: categories.map((elem) => elem?.value ?? 12)  }];
    default:
      return [];
  }
};