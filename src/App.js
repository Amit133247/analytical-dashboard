import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Box, } from "@mui/material";

import DropArea from "./Components/DropArea";
import Sidebar from "./Components/Sidebar";
import { getDefaultCategories } from "./utils/defaultCategories";
import { useChartContext } from "./store/ChartProvider";


const MIN_SIDEBAR_WIDTH = 180;
const MAX_SIDEBAR_WIDTH = 500;

const App = () => {
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const {setCharts, charts} = useChartContext();
  // Mouse event handlers for resizing
  const handleMouseDown = (e) => {
    setIsResizing(true);
    document.body.style.cursor = "col-resize";
  };
  const onChartNameChange = (chartIdx, newName) => {
  setCharts(prev =>
    prev.map((chart, idx) =>
      idx === chartIdx ? { ...chart, name: newName } : chart
    )
  );
};

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    // Sidebar is on the right, so width = window width - mouse X
    const newWidth = Math.min(
      Math.max(window.innerWidth - e.clientX, MIN_SIDEBAR_WIDTH),
      MAX_SIDEBAR_WIDTH
    );
    setSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.body.style.cursor = "";
  };

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleDrop = (type) => {
    setCharts(prev => [
      ...prev,
      {
        type,
        categories: getDefaultCategories(type),
        x: 40 + prev.length * 40, // initial x
        y: 40 + prev.length * 40, // initial y
        
      }
    ]);
  };

  const handleCategoryChange = (chartIdx, catIdx, name, color, action = "update") => {
  setCharts(prev => prev.map((chart, idx) => {
    if (idx !== chartIdx) return chart;

    let newCategories = [...chart.categories];

    if (action === "delete") {
      newCategories.splice(catIdx, 1);
    } else if (catIdx === newCategories.length) {
      newCategories.push({ name, color }); // add
    } else {
      newCategories[catIdx] = { name, color }; // update
    }

    return { ...chart, categories: newCategories };
  }));
};

  return (
    <DndProvider backend={HTML5Backend}>
      <Box display="flex" maxHeight="100vh">
        <DropArea
          onDrop={handleDrop}
          charts={charts}
          setCharts={setCharts}
        />
        {/* Resizer divider */}
        <Box
          sx={{
            width: 6,
            cursor: "col-resize",
            bgcolor: "#eee",
            zIndex: 10,
            '&:hover': { bgcolor: "#ccc" },
            userSelect: "none",
          }}
          onMouseDown={handleMouseDown}
        />
        <Sidebar
          charts={charts}
          onCategoryChange={handleCategoryChange}
          width={sidebarWidth}
          onChartNameChange ={onChartNameChange}
        />
      </Box>
    </DndProvider>
  );
};

export default App;
