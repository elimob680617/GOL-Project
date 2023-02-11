import { Theme } from '@mui/material/styles';

//
// ----------------------------------------------------------------------

const ICON_SMALL = { width: 20, height: 20 };
const ICON_LARGE = { width: 28, height: 28 };

export default function Rating(theme: Theme) {
  return {
    MuiRating: {
      defaultProps: {
        emptyIcon: <img src="/icons/star-shape-linear/24/Outline.svg" width={24} height={24} alt="" />,
        icon: <img src="/icons/star-shape-solid/24/Outline.svg" width={24} height={24} alt="" />,
      },

      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            opacity: 0.48,
          },
        },
        iconEmpty: { color: theme.palette.grey[500_48] },
        icon: { color: theme.palette.secondary.main, margin: 8 },
        sizeSmall: { '& svg': { ...ICON_SMALL } },
        sizeLarge: { '& svg': { ...ICON_LARGE } },
      },
    },
  };
}
