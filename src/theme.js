import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  spacing: (factor) => `${0.25 * factor}rem`,
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
        },
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: 4,
          fontSize: '0.8rem',
        },
        head: {
          fontSize: '1rem',
        }
      }
    },
  }
});

export default theme;