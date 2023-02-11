import { FC } from 'react';

import { Box, Button, Divider, Stack, Typography, useTheme } from '@mui/material';

import { CloseCircle } from 'iconsax-react';

import { StateType } from './ConnectionContent';

const WarningDialog: FC<StateType> = ({ icon, onClose, actionFn, warningText, buttonText, actionType, itemId }) => {
  const theme = useTheme();
  return (
    <>
      <Stack spacing={2} sx={{ minHeight: 194, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              {warningText}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={1} px={2} sx={{ alignItems: 'flex-start' }}>
          <Button
            onClick={() => actionFn && actionFn(actionType!, itemId)}
            variant="text"
            size="large"
            startIcon={icon}
            sx={{
              height: 32,
              justifyContent: 'stretch',
              color: theme.palette.error.main,
            }}
          >
            {buttonText}
          </Button>
          <Button
            onClick={() =>
              onClose &&
              onClose({
                warningText: '',
                buttonText: '',
                show: false,
              })
            }
            variant="text"
            size="large"
            startIcon={<CloseCircle />}
            sx={{
              justifyContent: 'stretch',
              height: 32,
              color: theme.palette.text.primary,
            }}
          >
            Discard
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default WarningDialog;
