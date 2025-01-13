import { Box, Stack, Typography, Container, colors } from "@mui/material";
import { Link } from "@remix-run/react";
import React from "react";
import {
  Quiz as QuizIcon,
  People as PeopleIcon,
} from "@mui/icons-material";

interface IRoute {
  name: string;
  href: string;
  locale: string;
  icon: React.ReactNode;
}

const routes: IRoute[] = [
  {
    name: "tests",
    href: "/tests",
    locale: "Тесты",
    icon: <QuizIcon />,
  },
  {
    name: "users",
    href: "/users/list",
    locale: "Пользователи",
    icon: <PeopleIcon />,
  },
];

const Menu = ({ currentRoute }: { currentRoute?: string }) => {
  return (
    <Container fixed>
      <Stack spacing={2}>
        {routes.map((route) => (
          <Box
            sx={{
              backgroundColor:
                currentRoute && currentRoute === route.name
                  ? colors.grey[200]
                  : undefined,
              borderRadius:
                currentRoute && currentRoute === route.name ? "6px" : undefined,
              color:
                currentRoute && currentRoute === route.name
                  ? "primary.main"
                  : colors.grey[700],
            }}
            key={route.name}
          >
            <Link
              to={{ pathname: route.href }}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "6px",
                }}
              >
                {route.icon}
                <Typography
                  fontWeight={500}
                  fontSize={"large"}
                  marginLeft={"10px"}
                >
                  {route.locale}
                </Typography>
              </div>
            </Link>
          </Box>
        ))}
      </Stack>
    </Container>
  );
};

export default Menu;
