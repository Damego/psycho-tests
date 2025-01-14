import { Stack } from "@mui/material";
import { Link } from "@remix-run/react";

export default function Footer() {
  return (
    <Stack
      height={60}
      width={"auto"}
      sx={{
        marginTop: "auto",
        bgcolor: "#303044",
        color: "#FFFFFF",
        zIndex: 2,
        justifyContent: "center",
        alignItems: "flex-end",
      }}
    >
    </Stack>
  );
}
