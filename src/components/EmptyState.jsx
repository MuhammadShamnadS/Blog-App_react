
import React from "react";
import { Box, Typography } from "@mui/material";

const EmptyState = ({ message = "No data found", image = "/noitem.png", width = 300, height = 200 }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        {message}
      </Typography>
      <Box
        component="img"
        src={image}
        alt="No data"
        sx={{
          width: width,
          height: height,
          objectFit: "contain",
        }}
      />
    </Box>
  );
};

export default EmptyState;
