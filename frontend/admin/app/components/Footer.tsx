import { Stack } from "@mui/material";
import { Link } from "@remix-run/react";

const USER_GUIDE_DOCUMENT_URL =
  "https://docs.google.com/document/d/1GRykfRQ_wfa8k5mSMG-b7-owebhRSvglml_4xD6CNro/edit?usp=sharing";

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
      <Link
        to={USER_GUIDE_DOCUMENT_URL}
        target="_blank"
        rel={"noreferrer"}
        style={{ textDecoration: "none", color: "inherit", marginRight: 20 }}
      >
        Руководство администратора
      </Link>
    </Stack>
  );
}
