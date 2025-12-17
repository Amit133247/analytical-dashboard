// src/context/ChartContext.js
import React, { createContext, useContext, useState } from "react";

const ChartContext = createContext();

export const ChartProvider = ({ children }) => {
 const [charts, setCharts] = useState([
  ]);


  return (
    <ChartContext.Provider value={{ charts, setCharts }}>
      {children}
    </ChartContext.Provider>
  );
};

export const useChartContext = () => {
  const ctx = useContext(ChartContext);
  if (!ctx) {
    throw new Error("useChartContext must be used inside ChartProvider");
  }
  return ctx;
};
