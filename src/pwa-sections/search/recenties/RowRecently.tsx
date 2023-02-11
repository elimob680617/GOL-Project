import { FC, createRef } from 'react';

import { IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import useIsOverflow from 'src/hooks/useIsOverflow';
import AvatarChecker from 'src/sections/connections/listContent/AvatarChecker';
import { FilterByEnum } from 'src/types/serverTypes';

const RowRecently: FC<{ varient: FilterByEnum; avatar: string; name: string }> = ({ varient, avatar, name }) => {
  const fullnameRef = createRef<any>();
  const fullnameIsOverflow = useIsOverflow(fullnameRef);

  return (
    <Stack direction="row" alignItems="center">
      <Stack direction="row" alignItems="center" spacing={2}>
        <AvatarChecker avatarUrl={avatar} fullName={name} userType={varient} />
        <Tooltip title={fullnameIsOverflow ? name : ''} enterTouchDelay={0}>
          <Typography ref={fullnameRef} sx={{ width: '100%' }} variant="subtitle1" color="surface.onSurface" noWrap>
            {name}
          </Typography>
        </Tooltip>
      </Stack>
      <IconButton>
        <Icon size={16} name="Close" />
      </IconButton>
    </Stack>
  );
};

export default RowRecently;
