import React from "react";
import { Pagination, Stack } from "@mui/material";

function CustomPagination({ currentPage, lastPage, onPageChange }) {
  if (lastPage <= 1) return null;

  return (
    <Stack spacing={2} alignItems="center" mt={2}>
      <Pagination
        count={lastPage}
        page={currentPage}
        onChange={(e, value) => onPageChange(value)}
        color="primary"
      />
    </Stack>
  );
}

export default CustomPagination;
