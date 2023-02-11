import { FormattedMessage } from 'react-intl';

import { Stack, Typography } from '@mui/material';

import HelpMessages from './HelpPwa.messages';

export default function HelpFooter() {
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      sx={{ pl: 5, py: 3, gap: 8, bgcolor: 'background.neutral' }}
    >
      <Stack spacing={3}>
        <Typography variant="subtitle2" color="text.primary">
          <FormattedMessage {...HelpMessages.gol} />
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <FormattedMessage {...HelpMessages.language} />
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <FormattedMessage {...HelpMessages.about} />
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <FormattedMessage {...HelpMessages.privacyPolicy} />
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <FormattedMessage {...HelpMessages.legal} />
        </Typography>
      </Stack>
      <Stack spacing={3}>
        <Typography variant="subtitle2" color="text.primary">
          <FormattedMessage {...HelpMessages.company} />
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <FormattedMessage {...HelpMessages.termsOfServices} />
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <FormattedMessage {...HelpMessages.cookies} />
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <FormattedMessage {...HelpMessages.whitepaper} />
        </Typography>
        <Typography variant="caption" color="text.secondary">
          <FormattedMessage {...HelpMessages.contact} />
        </Typography>
      </Stack>
    </Stack>
  );
}
