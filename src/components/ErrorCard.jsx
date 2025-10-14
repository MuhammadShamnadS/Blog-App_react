import { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";

function ErrorCard({ message }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Snackbar open={open} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert severity="error" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default ErrorCard;
