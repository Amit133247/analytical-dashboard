import React from "react";
import { useDrop } from "react-dnd";
import { Box, Divider, Stack, Tooltip, Typography } from "@mui/material";
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import { chartDataMap } from "../helpers/chartDataMap";
import { getDefaultSeries } from "../utils/defaultSeries";
import Chart from "react-apexcharts";
import { Popover, IconButton, } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PaletteIcon from '@mui/icons-material/Palette';
import GoogleCustomLoginButton from "./CustomGoogleLogin";



const DropArea = ({ onDrop, charts, setCharts }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "CHART",
        drop: (item) => onDrop(item.type),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const [chartSizes, setChartSizes] = React.useState({}); // { [index]: { width, height } }
    const [activeResizeIdx, setActiveResizeIdx] = React.useState(null);
    const resizingRef = React.useRef({ chartIdx: null, startX: 0, startY: 0, startWidth: 0, startHeight: 0 });
    const [popoverAnchorEl, setPopoverAnchorEl] = React.useState(null);
    const [selectedChartIdx, setSelectedChartIdx] = React.useState(null);
    const [dropAreaBgColor, setDropAreaBgColor] = React.useState("#fafafa");

    const handleChartMouseMove = (e) => {
        const { chartIdx, startX, startY, startWidth, startHeight } = resizingRef.current;
        if (chartIdx === null) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const newWidth = Math.max(300, startWidth + dx);
        const newHeight = Math.max(200, startHeight + dy);
        setChartSizes((prev) => ({
            ...prev,
            [chartIdx]: { width: newWidth, height: newHeight }
        }));
    };

    const handleChartMouseUp = () => {
        resizingRef.current = { chartIdx: null, startX: 0, startY: 0, startWidth: 0, startHeight: 0 };
        document.body.style.cursor = "";
        window.removeEventListener("mousemove", handleChartMouseMove);
        window.removeEventListener("mouseup", handleChartMouseUp);
    };

    const handleChartResizeMouseDown = (idx, e) => {
        e.stopPropagation();
        const size = chartSizes[idx] || { width: 600, height: 300 };
        resizingRef.current = {
            chartIdx: idx,
            startX: e.clientX,
            startY: e.clientY,
            startWidth: size.width,
            startHeight: size.height,
        };
        document.body.style.cursor = "nwse-resize";
        window.addEventListener("mousemove", handleChartMouseMove);
        window.addEventListener("mouseup", handleChartMouseUp);
    };

    const handleChartDoubleClick = (idx, e) => {
        e.stopPropagation();
        setActiveResizeIdx(idx);
        setSelectedChartIdx(idx);
        setPopoverAnchorEl(e.currentTarget);
    };

    // Drag state
    const draggingRef = React.useRef({ chartIdx: null, startX: 0, startY: 0, origX: 0, origY: 0 });

    const handleChartDragMouseDown = (idx, e) => {
        e.stopPropagation();
        draggingRef.current = {
            chartIdx: idx,
            startX: e.clientX,
            startY: e.clientY,
            origX: charts[idx].x,
            origY: charts[idx].y,
        };
        document.body.style.cursor = "move";
        window.addEventListener("mousemove", handleChartDragMouseMove);
        window.addEventListener("mouseup", handleChartDragMouseUp);
    };

    const handleChartDragMouseMove = (e) => {
        const { chartIdx, startX, startY, origX, origY } = draggingRef.current;
        if (chartIdx === null) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        setCharts(prev => prev.map((chart, idx) =>
            idx === chartIdx ? { ...chart, x: origX + dx, y: origY + dy } : chart
        ));
    };

    const handleChartDragMouseUp = () => {
        draggingRef.current = { chartIdx: null, startX: 0, startY: 0, origX: 0, origY: 0 };
        document.body.style.cursor = "";
        window.removeEventListener("mousemove", handleChartDragMouseMove);
        window.removeEventListener("mouseup", handleChartDragMouseUp);
    };

    // Deactivate resize when clicking outside the active chart
    const handleDropAreaClick = (e) => {
        // If click is not on a resize handle or chart, deactivate
        if (e.target.closest('.chart-container') === null) {
            setActiveResizeIdx(null);
        }
    };
    const handleDeleteChart = () => {
        if (selectedChartIdx !== null) {
            setCharts(prev => prev.filter((_, idx) => idx !== selectedChartIdx));
            setSelectedChartIdx(null);
            setPopoverAnchorEl(null);
        }
    };
    const handleBackgroundColorChange = (index, color) => {
        setCharts(prev =>
            prev.map((chart, i) =>
                i === index ? { ...chart, backgroundColor: color } : chart
            )
        );
    };


    return (
        <>
            <Box
                ref={drop}
                sx={{
                    position: "relative",
                    flex: 1,
                    height: "calc(100vh - 32px)",
                    boxSizing: "border-box",
                    py: 2,
                    px: 2,
                    bgcolor: isOver ? "#f0f0f0" : "#fafafa",

                }}
            >
                <Stack direction='row' alignItems='center' justifyContent='space-between' >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Drop charts here
                    </Typography>
                    <GoogleCustomLoginButton/>
                  

                </Stack>
                <Box
                    ref={drop}
                    sx={{
                        position: "relative",
                        flex: 1,
                        height: "100%",
                        overflowY: "auto",
                        boxSizing: "border-box",

                        bgcolor: isOver ? "#f0f0f0" : "#fafafa",
                        border: "2px dashed #ccc",
                    }}
                    onClick={handleDropAreaClick}
                >
                    {charts.map((chart, index) => {
                        let options = {};
                        const categoryNames = chart.categories.map(cat => cat.name);
                        if (["bar", "line", "area"].includes(chart.type)) {
                            options = { ...chartDataMap[chart.type].options, xaxis: { categories: categoryNames } };
                        } else {
                            options = { ...chartDataMap[chart.type].options, labels: categoryNames };
                        }
                        if (["pie", "donut"].includes(chart.type)) {
                            options.colors = chart.categories.map(cat => cat.color);
                        }
                        const series = getDefaultSeries(chart.type, chart.categories);
                        const size = chartSizes[index] || { width: 600, height: 300 };

                        return (
                            <Box
                                key={index}
                                className="chart-container"
                                mb={0}
                                sx={{
                                    zIndex: activeResizeIdx === index ? 10 : index,
                                    position: "absolute",
                                    left: chart.x,
                                    top: chart.y,
                                    width: size.width,
                                    height: size.height,
                                    transition: "width 0.1s, height 0.1s",
                                    minWidth: 300,
                                    minHeight: 200,
                                    maxWidth: "100%",
                                    borderRadius: "8px",
                                    p: 2,
                                    boxShadow: `
                    8px 8px 16px #e0e0e0,
                    -8px -8px 16px #ffffff,
                    inset 2px 2px 6px #bebebe,
                    inset -2px -2px 6px #ffffff
                  `,
                                    bgcolor: chart.backgroundColor || "#f5f5f5",
                                    "&:hover": {
                                        boxShadow: `
                      4px 4px 8px #e0e0e0,
                      -4px -4px 8px #ffffff,
                      inset 1px 1px 3px #bebebe,
                      inset -1px -1px 3px #ffffff
                    `,
                                        bgcolor: chart.backgroundColor || "#f0f0f0",
                                    },
                                    cursor: "move",
                                    userSelect: "none",
                                    border: activeResizeIdx === index ? "2px solid #1976d2" : "2px solid transparent",
                                }}
                                onDoubleClick={(e) => handleChartDoubleClick(index, e)}
                                onMouseDown={(e) => handleChartDragMouseDown(index, e)}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        position: "absolute",
                                        top: -18,
                                        left: 8,
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: "8px",
                                        fontWeight: "bold",
                                        fontSize: "0.75rem",
                                        color: "#fff",
                                        background: "linear-gradient(135deg, #007FFF 0%, #00B8D4 100%)",
                                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                                        letterSpacing: 0.5,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {chart?.name?.toUpperCase()   || `${chart?.type?.toUpperCase()} Chart`}
                                </Typography>

                                <Chart
                                    type={chart.type}
                                    series={series}
                                    options={options}
                                    height={size.height - 30}
                                    width={size.width - 30}
                                />
                                {activeResizeIdx === index && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: 8,
                                            right: 8,
                                            width: 24,
                                            height: 24,
                                            cursor: "nwse-resize",
                                            bgcolor: "#1976d2",
                                            borderRadius: "4px",
                                            zIndex: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: 2,
                                        }}
                                        onMouseDown={(e) => handleChartResizeMouseDown(index, e)}
                                    >
                                        <AspectRatioIcon sx={{ color: "#fff", fontSize: 20 }} />
                                    </Box>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            </Box>
          <Popover
  open={Boolean(popoverAnchorEl)}
  anchorEl={popoverAnchorEl}
  onClose={() => setPopoverAnchorEl(null)}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
  transformOrigin={{ vertical: "top", horizontal: "center" }}
  PaperProps={{
    sx: {
      py: .8,
      px: 1,
      borderRadius: 1,
      backgroundColor: "#fff",
      boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
    },
  }}
>
  <Stack direction="row" alignItems="center" spacing={1.5}>
    {/* Color Picker Button */}
    <Tooltip title="Set Chart Background">
      <IconButton
        size="small"
        sx={{
             padding: '3px',
          bgcolor: charts[selectedChartIdx]?.backgroundColor || "#f0f0f0",
          border: "1px solid #ccc",
          transition: "all 0.3s",
          "&:hover": {
            transform: "scale(1.1)",
            bgcolor: charts[selectedChartIdx]?.backgroundColor || "#e0e0e0",
          },
        }}
        onClick={() => {
          const input = document.getElementById("chart-bg-color-picker");
          if (input) input.click();
        }}
      >
        <PaletteIcon sx={{ color: "#444", fontSize:'15px' }} />
        <input
          id="chart-bg-color-picker"
          type="color"
          style={{ display: "none" }}
          value={charts[selectedChartIdx]?.backgroundColor || "#f0f0f3"}
          onChange={(e) => {
            const color = e.target.value;
            handleBackgroundColorChange(selectedChartIdx, color);
          }}
        />
      </IconButton>
    </Tooltip>

    {/* Delete Button */}
    <Tooltip title="Delete Chart">
      <IconButton
        size="small"
        sx={{
            padding: '3px',
          bgcolor: "#ffe5e5",
          border: "1px solid #f44336",
          transition: "all 0.3s",
          "&:hover": {
            bgcolor: "#ffcdd2",
            transform: "scale(1.1)",
          },
        }}
        onClick={handleDeleteChart}
      >
        <DeleteIcon sx={{ color: "#d32f2f", fontSize:'15px'}} />
      </IconButton>
    </Tooltip>
  </Stack>
</Popover>
        </>
    );
};


export default DropArea;