import { CssBaseline } from "@mui/material";
import React from "react";

export function MuiDocument({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CssBaseline />
      {children}
    </>
  );
}
