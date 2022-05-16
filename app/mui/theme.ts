import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  typography: {
    fontFamily: [
      "Roobert",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  palette: {
    primary: {
      main: "#12B296",
    },
    error: {
      main: "#DA4919",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Roobert';
          font-display: swap;
          src: local('Roobert'), local('Roobert-Regular'), url('/fonts/Roobert-Regular.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Roobert';
          font-display: swap;
          font-weight: 500;
          src: local('Roobert'), local('Roobert-Medium'), url('/fonts/Roobert-Medium.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Roobert';
          font-display: swap;
          font-weight: bold;
          src: local('Roobert'), local('Roobert-Bold'), url('/fonts/Roobert-Bold.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Agrandir Bold';
          src: local('Agrandir'), local('Agrandir-Bold'), url('/fonts/Agrandir-Bold.woff2') format('woff2');
          font-display: swap;
          font-weight: 600;
        }
      `,
    },
    /*
    MuiTextField: {
      defaultProps: {
        variant: "filled"
      },
    },
    */
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: "#fff",
          boxShadow: "none",
          fontWeight: "bold",
          textTransform: "initial",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#fff",
        },
      },
    },
  },
});

export default theme;
