import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Stack, Typography, styled } from '@mui/material';

import HomeMessages from 'src/sections/home/home.messages';

const TextStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '15px',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  marginRight: theme.spacing(2),
}));

const Helpers: FC = () => (
  <Stack flexWrap="wrap" direction="row">
    <TextStyle variant="caption">
      <FormattedMessage {...HomeMessages.HelpersLanguages} />
    </TextStyle>
    <TextStyle variant="caption">
      <FormattedMessage {...HomeMessages.HelpersAbout} />
    </TextStyle>
    <TextStyle variant="caption">
      <FormattedMessage {...HomeMessages.helpCenter} />
    </TextStyle>
    <TextStyle variant="caption">
      <FormattedMessage {...HomeMessages.HelpersPrivacy} />
    </TextStyle>
    <TextStyle variant="caption">
      <FormattedMessage {...HomeMessages.HelpersLegal} />
    </TextStyle>
    <TextStyle variant="caption">
      <FormattedMessage {...HomeMessages.HelpersTerms} />
    </TextStyle>
    <TextStyle variant="caption">
      <FormattedMessage {...HomeMessages.HelpersCookies} />
    </TextStyle>
    <TextStyle variant="caption">
      <FormattedMessage {...HomeMessages.HelpersWhitepaper} />
    </TextStyle>
    <TextStyle variant="caption">
      <FormattedMessage {...HomeMessages.HelpersContact} />
    </TextStyle>
  </Stack>
);

export default Helpers;
