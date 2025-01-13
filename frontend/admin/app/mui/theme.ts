import { createTheme, colors } from "@mui/material";

declare module '@mui/material/styles' {
  interface PaletteColor {
    card?: string;
    gray?: string;
  }

  interface SimplePaletteColorOptions {
    card?: string;
    gray?: string;
  }
}

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#496CC6",
      dark: "#303044",
      light: "#638EFF",
      contrastText: "#FFFFFF",
      card: "#FFFFFF",
      gray: "#6C6C6C",
    },
    secondary: {
      main: "#638EFF",
    },
    error: {
      main: colors.red.A400,
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'sans-serif',
    ].join(','),
  }
});

export default theme;
