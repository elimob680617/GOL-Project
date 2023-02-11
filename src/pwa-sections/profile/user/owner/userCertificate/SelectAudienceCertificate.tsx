import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Divider, FormControl, FormControlLabel, Stack, Typography, useTheme } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import UserCertificates from 'src/pwa-sections/profile/UserCertificatesPwa.messages';
import { useSelector } from 'src/store';
import { userCertificateSelector } from 'src/store/slices/profile/userCertificates-slice';
import { AudienceEnum } from 'src/types/serverTypes';

interface AudienceProps {
  onChange: (value: AudienceEnum) => void;
  audience: AudienceEnum;
}

export default function SelectAudienceCertificate(props: AudienceProps) {
  const { onChange, audience } = props;
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const userCertificate = useSelector(userCertificateSelector);
  const theme = useTheme();

  // useEffect for Refreshing
  useEffect(() => {
    if (!userCertificate) navigate(-1);
  }, [userCertificate, navigate]);

  function changeAudienceHandler(e: { target: { value: any } }) {
    onChange(e.target.value);
  }
  return (
    <Stack spacing={2} sx={{ pt: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'space-between', px: 2 }}>
        <Typography variant="subtitle1" color="text.primary">
          <FormattedMessage {...UserCertificates.privacy} />
        </Typography>
      </Stack>
      <Divider />
      <Stack>
        <FormControl sx={{ mb: 2 }}>
          <RadioGroup
            onChange={changeAudienceHandler}
            value={audience}
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
          >
            <FormControlLabel
              value={AudienceEnum.Public}
              control={<Radio />}
              label={formatMessage(UserCertificates.public)}
              sx={{ ml: 1, mt: 1 }}
            />
            <FormControlLabel
              value={AudienceEnum.Private}
              control={<Radio />}
              label={formatMessage(UserCertificates.private)}
              sx={{ ml: 1, mt: 1 }}
            />
            <FormControlLabel
              value={AudienceEnum.OnlyMe}
              control={<Radio />}
              label={formatMessage(UserCertificates.onlyMe)}
              sx={{ ml: 1, mt: 1 }}
            />
            <FormControlLabel
              value={AudienceEnum.SpecificFollowes}
              control={<Radio />}
              label={formatMessage(UserCertificates.specificFollowers)}
              sx={{ ml: 1, mt: 1 }}
            />
            <Typography variant="caption" color={theme.palette.text.secondary} sx={{ ml: 6, mb: 1 }}>
              <FormattedMessage {...UserCertificates.selectSpecificFollowers} />
            </Typography>

            <FormControlLabel
              value={AudienceEnum.ExceptFollowes}
              control={<Radio />}
              label={formatMessage(UserCertificates.allFollowersExcept)}
              sx={{ ml: 1, mt: 1 }}
            />
            <Typography variant="caption" color={theme.palette.text.secondary} sx={{ ml: 6, mb: 1 }}>
              <FormattedMessage {...UserCertificates.selectFollowers} />
            </Typography>
          </RadioGroup>
        </FormControl>
      </Stack>
    </Stack>
  );
}
