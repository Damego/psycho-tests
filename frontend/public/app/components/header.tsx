import { AppBar, Box, Container } from "@mui/material";
import IconLogo from "~/assets/logo";
import IconBookmark from "~/assets/bookmark";
import { Link } from "@remix-run/react";
import UserIcon from "~/assets/user";

export default function Header() {
  return (
    <Box sx={{ mb: 2, zIndex: 2 }}>
      <AppBar position="static" sx={{ bgcolor: "#303044" }}>
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 54,
          }}
        >
          <Link to={"/"}>
            <IconLogo />
          </Link>

          <Box display={"flex"} gap={2}>
            <Link to={"/me/bookmarks"}>
            <IconBookmark />
            </Link>
            <Link to={"/me"}>
              <Box
                sx={{
                  height: 33,
                  width: 33,
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  boxShadow: "0px 0px 7px #638EFF",
                }}
              >
                <UserIcon />
              </Box>
            </Link>
          </Box>
        </Container>
      </AppBar>
    </Box>
  );
}
