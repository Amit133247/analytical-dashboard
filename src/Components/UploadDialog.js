import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import fileImage from "../assets/images/photo.png"
import UploadIllustration from "../assets/images/uploading.png";
import { parseExcelFile } from "../utils/parseExcelFile";
import { useChartContext } from "../store/ChartProvider";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UploadDialog = ({ chartType, setChartType }) => {
  const [files, setFiles] = useState([]);
const {setCharts} = useChartContext();
  const handleClose = () => setChartType(false);

  // Handle file selection from input
  const handleFileSelect = (event) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };
    const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };
 

  // Handle file input change
  

  // Handle file drop
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  // Prevent browser from opening file on drop
  const handleDragOver = (event) => {
    event.preventDefault();
  };

 const handleSave = async () => {
    if (!files.length) return;
    try {
      const parsed = await parseExcelFile(files[0]);
       const { labels, values } = parsed;
      setCharts(prev =>
      prev.map(chart => {
        // update categories and values for each chart
        return {
          ...chart,
          categories: labels.map((label, idx) => ({
            name: label,
            value: values[idx], // 👈 attach numeric value
            color: chart.categories[idx]?.color || "#1976d2", // keep color if exists
          })),
        };
      })
    );
      setChartType(null);
    } catch (err) {
      console.error(err);
    }
}

  return (
    <Dialog open={!!chartType} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#d97706" }}>
        ---UPLOAD FILES---
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Drag and Drop Zone */}
        <Box
          sx={{
            border: "2px dashed #ccc",
            borderRadius: "8px",
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            transition: "0.2s",
            "&:hover": { borderColor: "#1976d2" },
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
         <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {/* Replace CloudUploadIcon with custom image */}
      <img
        src={UploadIllustration}
        alt="Upload Illustration"
        style={{ width: 100, height: "auto" }} // adjust size
      />
    </Box>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Drag & Drop
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your files here OR click to browse
          </Typography>
          <Typography
            variant="caption"
            color="primary"
            sx={{ display: "block", fontWeight:'500', mt: 1 }}
          >
             Only Excel (.xls, .xlsx) and CSV (.csv) files (max size: 15 MB).
          </Typography>

          {/* Hidden file input */}
          <VisuallyHiddenInput
            id="fileInput"
            type="file"
            accept=".xls,.xlsx,.csv"
            onChange={handleFileSelect}
          />
        </Box>

        {/* File List Preview */}
       {files.length > 0 && (
  <Box sx={{ mt: 2, display: "flex", alignItems:'center', justifyContent:'center'}}>
    {files.map((file, index) => (
      <Card
        key={index}
        sx={{
          width: 90,
          textAlign: "center",
          p: 1,
          position: "relative",
          borderRadius: 1,
          boxShadow: 3,
           overflow: "visible !important" ,
        }}
      >
        {/* Delete button */}
       <IconButton
  size="small"
  sx={{
    position: "absolute",
    top: -10,
    right: -10,
    bgcolor: "error.main",
    color: "white",
    width: 24, // fixed size
    height: 24,
    "&:hover": { bgcolor: "error.dark" },
  }}
  onClick={() => handleRemoveFile(index)}
>
  <CloseIcon sx={{ fontSize: 16 }} /> 
</IconButton>

        {/* File preview */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            mb: 1,
            bgcolor:"#F3E6DB",
          }}
        >
          <img
            src={
                fileImage
            }
            alt={file.name}
            style={{  width:"50px", height:'40px',  borderRadius: 4 }}
          />
         <Typography mt={0.5} variant="body2">
  {file.name.split(".").pop().toUpperCase()}
</Typography>
        </Box>

       
        <Typography variant="body2" color="text.secondary">
          {(file.size / (1024 * 1024)).toFixed(2)} MB
        </Typography>
      </Card>
    ))}
  </Box>
)}

        {/* Save Button */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#1976d2",
              
               boxShadow: `
                8px 8px 16px #e0e2f1,
                -8px -8px 16px #ffffff
              `,
                                // display: "flex",
                                // alignItems: "center",
                                // justifyContent: "center",
                                textTransform: "none",
                                transition: "box-shadow 0.2s, background 0.2s",
                                '&:hover': {
                                    boxShadow: `
                  4px 4px 8px #8d99f5ff,
                  -4px -4px 8px #faddddff
                `,
                                    bgcolor: "#6881fdff",
                                },
              px: 4,
            }}
            onClick={handleSave}
            disabled={files.length === 0}
          >
           Draw charts
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
