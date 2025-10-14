import { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";

function SuccessCard({ message }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Snackbar open={open} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert severity="success" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default SuccessCard;
