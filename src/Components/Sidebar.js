import React, { useState } from "react";
import { Box, Typography, Stack, IconButton, styled } from "@mui/material";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { chartTypes } from "../helpers/chartTypes";
import DraggableChartIcon from "./DraggableChartIcon";
import CloseIcon from '@mui/icons-material/Close';
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadDialog from "./UploadDialog";


const Sidebar = ({ charts, onCategoryChange, onChartNameChange, width }) => {
    const [editingChartIdx, setEditingChartIdx] = useState(null);
    const [tempChartName, setTempChartName] = useState("");
    const [chartType, setChartType] = useState(null);
    return (
        <Box
            sx={{
                width: width,
                height: "100vh",
                overflowY: "auto",
                boxSizing: "border-box",
                px: 2,
                borderLeft: "1px solid #ddd",
                bgcolor: "#fbc02d",
                transition: "width 0.1s",
            }}
        >
            <Accordion defaultExpanded sx={{ mb: 1, boxShadow: "none", bgcolor: "transparent" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, py: 0 }}>
                    <Typography color="#525c61ff" fontWeight={600} variant="body1" sx={{ my: '0px' }}>Chart Library</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, py: 0 }}>
                    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                        {chartTypes.map((chart, idx) => (
                            <DraggableChartIcon
                                key={chart.type}
                                type={chart.type}
                                icon={chart.icon}
                                color={["#1976d2", "#43a047", "#e53935", "#fbc02d", "#8e24aa"][idx]}
                            />
                        ))}
                    </Stack>
                </AccordionDetails>
            </Accordion>
            {charts.some(chart => chart.categories.length > 0) && (
                <>
                    <Typography color="#525c61ff" fontWeight={600} variant="body1" sx={{ mb: 1 }}>
                        Chart Categories
                    </Typography>
                </>
            )}

            <Stack direction="row" spacing={1} sx={{ mt: 3, mb: 1, flexWrap: "wrap" }}>
                {charts.map((chart, index) => {
                    const chartTypeObj = chartTypes.find(c => c.type === chart.type);
                    const colorPalette = ["#1976d2", "#43a047", "#e53935", "#fbc02d", "#8e24aa"];
                    const typeIdx = chartTypes.findIndex(c => c.type === chart.type);
                    const color = colorPalette[typeIdx % colorPalette.length];
                    return (
                        <Box
                            key={index}
                            sx={{
                                width: 40,
                                height: 40,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "16px",
                                boxShadow: "8px 8px 16px #e0e0e0, -8px -8px 16px #ffffff",
                                bgcolor: color,
                                m: 1,
                                transition: "box-shadow 0.2s",
                            }}
                        >
                            {React.cloneElement(chartTypeObj.icon, { sx: { color: "#fff", fontSize: 24 } })}
                        </Box>
                    );
                })}
            </Stack>

            {charts.map((chart, index) => (
                <Accordion key={index} sx={{
                    mb: 2, boxShadow: "none", bgcolor: "transparent", "&.Mui-expanded": {
                        margin: 0, // Keep margin 0 even when expanded
                    }, "&::before": {
                        background: "none !important", // Override the default background line
                    },
                }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            bgcolor: "#f6f7fb",
                            borderRadius: "10px",
                            transition: "background-color 0.3s",

                            "&:focus-within": {
                                boxShadow: `
                      4px 4px 8px #e0e0e0,
                      -4px -4px 8px #ffffff,
                      inset 1px 1px 3px #bebebe,
                      inset -1px -1px 3px #ffffff
                    `, // light cyan-like highlight on focus
                                bgcolor: "#f5f5f5",
                            },
                            boxShadow: `
      4px 4px 12px #e0e0e0,
      -4px -4px 12px #ffffff
    `,
                            "&.Mui-expanded": {
                                minHeight: 48,
                            },
                            minHeight: 48,
                            "& .MuiAccordionSummary-content": {
                                alignItems: "center",
                                my: 1,
                                justifyContent: "space-between",
                            },

                        }}
                    >
                        {editingChartIdx === index ? (
                            <TextField
                                value={tempChartName}
                                autoFocus
                                size="small"
                                onChange={(e) => setTempChartName(e.target.value)}
                                onBlur={() => {
                                    onChartNameChange(index, tempChartName);
                                    setEditingChartIdx(null);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        onChartNameChange(index, tempChartName);
                                        setEditingChartIdx(null);
                                    }
                                }}
                                sx={{
                                    color: "#525c61ff",
                                    width: "100%",
                                    input: {
                                        fontWeight: "bold",
                                        fontSize: "0.9rem",
                                        p: 0.5,
                                    },
                                    "& fieldset": { border: "none" },
                                }}
                            />
                        ) : (
                            <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
                                <Typography color="#525c61ff" variant="subtitle2" sx={{ fontWeight: "bold", userSelect: "none" }}>
                                    {(chart.name || chart.type).toUpperCase()}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingChartIdx(index);
                                        setTempChartName(chart.name || chart.type); // Load current name into temp
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        )}
                    </AccordionSummary>

                    <AccordionDetails sx={{ bgcolor: "#fff", borderRadius: "0 0 10px 10px", p: 1 }}>
                        <Button
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                            fullWidth
                            onClick={() => setChartType(chart.type)}
                            sx={{
                                bgcolor: "#f6f7fb",
                                color: "#1976d2",
                                fontSize: 16,
                                boxShadow: `
                8px 8px 16px #e0e2f1,
                -8px -8px 16px #ffffff
              `,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textTransform: "none",
                                transition: "box-shadow 0.2s, background 0.2s",
                                '&:hover': {
                                    boxShadow: `
                  4px 4px 8px #e0e2f1,
                  -4px -4px 8px #ffffff
                `,
                                    bgcolor: "#f0f1f6",
                                },
                            }}
                        >
                            Upload files

                        </Button>
                        {chart.categories.map((cat, catIdx) => (
                            <span
                                key={catIdx}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    margin: "15px 0px",
                                    gap: "10px"
                                }}
                            >
                                <TextField
                                    value={cat.name}
                                    onChange={e => onCategoryChange(index, catIdx, e.target.value, cat.color)}
                                    placeholder="Category"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    sx={{
                                        mr: 1,
                                        color: '#525c61ff',
                                        borderRadius: "5px",
                                        boxShadow: `
                    8px 8px 16px #e0e0e0,
                    -8px -8px 16px #ffffff,
                    inset 2px 2px 6px #bebebe,
                    inset -2px -2px 6px #ffffff
                  `,
                                        bgcolor: "#f5f5f5",
                                        input: {
                                            padding: "7px 10px",
                                            borderRadius: "5px",
                                            fontSize: '13px',
                                        },
                                        "& fieldset": {
                                            border: "none",
                                        },
                                        "&:hover": {
                                            boxShadow: `
                      4px 4px 8px #e0e0e0,
                      -4px -4px 8px #ffffff,
                      inset 1px 1px 3px #bebebe,
                      inset -1px -1px 3px #ffffff
                    `,
                                            bgcolor: "#f0f0f0",
                                        },
                                    }}
                                />

                                {["pie", "donut"].includes(chart.type) && (() => {
                                    let colorInputRef = null;
                                    return (
                                        <>
                                            <Box
                                                component="button"
                                                type="button"
                                                onClick={() => colorInputRef && colorInputRef.click()}
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                    minWidth: 30,
                                                    minHeight: 30,
                                                    borderRadius: "50%",
                                                    border: "none",
                                                    outline: "none",
                                                    background: cat.color,
                                                    boxShadow: `
                          8px 8px 24px #bebebe,
                          -8px -8px 24px #ffffff
                        `,
                                                    cursor: "pointer",
                                                    p: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    transition: "box-shadow 0.2s, background 0.2s",
                                                    "&:hover": {
                                                        boxShadow: `
                            inset 8px 8px 24px #bebebe,
                            inset -8px -8px 24px #ffffff
                          `,
                                                        filter: "brightness(1.05)",
                                                    },
                                                }}
                                                aria-label="Pick color"
                                            />
                                            <input
                                                ref={el => colorInputRef = el}
                                                type="color"
                                                value={cat.color}
                                                style={{ display: "none" }}
                                                onChange={e => onCategoryChange(index, catIdx, cat.name, e.target.value)}
                                            />
                                        </>
                                    );
                                })()}


                                <Box
                                    onClick={() => onCategoryChange(index, catIdx, null, null, "delete")}
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "50%",
                                        backgroundColor: "#f5f5f5",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        flexShrink: 0, // ⬅️ prevents shrinking in flex layouts
                                        boxShadow: `
      6px 6px 12px #d1d9e6,
      -6px -6px 12px #ffffff
    `,
                                        transition: "box-shadow 0.2s ease, transform 0.2s ease",
                                        "&:hover": {
                                            boxShadow: `
        inset 6px 6px 12px #d1d9e6,
        inset -6px -6px 12px #ffffff
      `,
                                            transform: "scale(1.05)",
                                        },
                                    }}
                                >
                                    <CloseIcon
                                        sx={{
                                            fontSize: 18,
                                            color: "#e53935",
                                        }}
                                    />
                                </Box>
                            </span>
                        ))}

                        <Button
                            variant="contained"
                            startIcon={<AddIcon sx={{ fontSize: 22 }} />}
                            onClick={() => onCategoryChange(index, chart.categories.length, "", "#1976d2")}
                            sx={{
                                mt: 1,
                                px: 3,
                                minWidth: 0,
                                minHeight: 40,
                                height: 44,
                                borderRadius: "8px",
                                bgcolor: "#f6f7fb",
                                color: "#1976d2",
                                fontWeight: "bold",
                                fontSize: 16,
                                boxShadow: `
                8px 8px 16px #e0e2f1,
                -8px -8px 16px #ffffff
              `,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textTransform: "none",
                                transition: "box-shadow 0.2s, background 0.2s",
                                '&:hover': {
                                    boxShadow: `
                  4px 4px 8px #e0e2f1,
                  -4px -4px 8px #ffffff
                `,
                                    bgcolor: "#f0f1f6",
                                },
                            }}
                        >
                            Add Category
                        </Button>
                    </AccordionDetails>
                </Accordion>
            ))}

            <UploadDialog chartType={chartType} setChartType={setChartType} />
        </Box>
    );
}

export default Sidebar;
