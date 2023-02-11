import { Box, Dialog, Typography } from '@mui/material';

import isMobile from 'src/utils/is-mobile';

const TermAndConditions = () => {
  return (
    <Dialog open fullScreen={isMobile}>
      <Box sx={{ maxWidth: 448 }}>
        <Typography color="grey.900" variant="body2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula commodoLorem ipsum dolor sit amet,
          consectetur adipiscing elit. Vehicula commodoLorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula
          commodoLorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula commodoLorem ipsum dolor sit amet,
          consectetur adipiscing elit. Vehicula commodoLorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula
          commodoLorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula commodoLorem ipsum dolor sit amet,
          consectetur adicommodoLorem ipsum dolor sit amet, consectetur adipem ipsum dolor sit amet, consectetur
          adipiscing elit. Vehicula commodoLorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula
          commodoLorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula iscing elit. em ipsum dolor sit amet,
          consectetur adipiscing elit. Vehicula commodoLorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula
          commodoLorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula sit amet, consectetur adipiscing
          elit. Vehiculapsum dolor sit amet, consectetur adipiscing elit. Vehicula commodoLorem ipsum dolor sit amet,
          consectetur adipiscing elit. Vehicula commodoLorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula
          commodoLorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicem ipsum dolor sit amet, consectetur
          adipiscing elit. Vehicula commodoLorem ipsum dolor sit amelor sit amet, consectetur adipiscing elit. Vehicem
          ipsum dolor sit amet, consectetur adipiscing elit. Vehicula commodoLorem ipsum dolor sit amelor sit amet,
          consectetur adipiscing elit. Vehicem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula commodoLorem
          ipsum dolor sit amet, consectetur adipiscing elit. Vehicula commodoLorem ipsum dolor sit amet, consectetur
          adipiscing elit. Vehicula ula commodo.
        </Typography>
      </Box>
    </Dialog>
  );
};

export default TermAndConditions;
