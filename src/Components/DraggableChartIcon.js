import React from "react";
import { useDrag,  } from "react-dnd";

import { Box,  } from "@mui/material";

const DraggableChartIcon = ({ type, icon, color }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CHART",
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

 return (
  <Box
    ref={drag}
    sx={{
      width: 48,
      height: 48,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "16px",
      bgcolor: "#f5f5f5",
      cursor: "move",
      opacity: isDragging ? 0.5 : 1,
      boxShadow: `
        6px 6px 12px #d1d9e6,
        -6px -6px 12px #ffffff
      `,
      transition: "all 0.3s ease",
      m: 1,
      "&:hover": {
        boxShadow: `
          inset 6px 6px 12px #d1d9e6,
          inset -6px -6px 12px #ffffff
        `,
        transform: "scale(1.05)",
      },
    }}
  >
    {React.cloneElement(icon, {
      sx: {
        color: color || "#1976d2",
        fontSize: 24,
      },
    })}
  </Box>
);
};

export default DraggableChartIcon;
