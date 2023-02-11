import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Stack, Typography, styled } from '@mui/material';

import HomeMessages from './home.messages';

const TextStyle = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '15px',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  marginRight: theme.spacing(2),
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const Helpers: FC = () => {
  const navigate = useNavigate();
  return (
    <Stack flexWrap="wrap" direction="row">
      <TextStyle variant="caption">
        <FormattedMessage {...HomeMessages.HelpersLanguages} />
      </TextStyle>
      <TextStyle variant="caption">
        <FormattedMessage {...HomeMessages.HelpersAbout} />
      </TextStyle>
      <TextStyle variant="caption" onClick={() => navigate('help/help-center')}>
        <FormattedMessage {...HomeMessages.HelpersHelpCenter} />
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
};

export default Helpers;
