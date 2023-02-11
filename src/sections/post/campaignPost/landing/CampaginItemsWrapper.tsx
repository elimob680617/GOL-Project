import { FC, PropsWithChildren } from 'react';
import { FormattedMessage } from 'react-intl';

import { Stack, Typography, styled } from '@mui/material';

import CustomLink from 'src/components/CustomLink';

import CampaginPostMessages from '../campaginPost.messages';

const ShowNoreStyle = styled(Typography)(({ theme }) => ({
  cursor: 'pointer',
}));

const CampaginItemsWrapper: FC<
  PropsWithChildren<{ title: string; path?: string; linkCallBack?: () => void; spacing?: number }>
> = ({ path, title, children, linkCallBack, spacing = 3 }) => (
  <Stack spacing={3}>
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="h6" color="text.primary">
        {title}
      </Typography>
      {!!path && (
        <CustomLink path={path}>
          <Typography variant="button" color="primary.main">
            <FormattedMessage {...CampaginPostMessages.showAll} />
          </Typography>
        </CustomLink>
      )}
      {!!linkCallBack && (
        <ShowNoreStyle onClick={() => linkCallBack()} variant="button" color="primary.main">
          <FormattedMessage {...CampaginPostMessages.showAll} />
        </ShowNoreStyle>
      )}
    </Stack>
    <Stack spacing={spacing}>{children}</Stack>
  </Stack>
);

export default CampaginItemsWrapper;
