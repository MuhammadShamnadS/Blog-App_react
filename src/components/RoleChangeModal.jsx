import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
  Typography,
  Box,
} from "@mui/material";

const RoleChangeModal = ({ open, onClose }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) return;

    setProgress(0);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          onClose();
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(timer);
  }, [open, onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          backdropFilter: "blur(10px)",
        },
      }}
      BackdropProps={{
        sx: { backdropFilter: "blur(6px)" },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        Role Updated!
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Your role permissions have been updated by the admin.
        </Typography>

        <Box sx={{ width: "100%", mt: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 5,
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                transition: "width 0.3s ease-in-out",
              },
            }}
          />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Redirecting... {progress}%
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RoleChangeModal;
