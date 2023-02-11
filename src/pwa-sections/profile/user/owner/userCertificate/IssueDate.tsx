import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Divider, Stack, Typography } from '@mui/material';

import DatePicker from 'src/components/DatePicker';
import UserCertificates from 'src/pwa-sections/profile/UserCertificatesPwa.messages';
import { useSelector } from 'src/store';
import { userCertificateSelector } from 'src/store/slices/profile/userCertificates-slice';
import { Scalars } from 'src/types/serverTypes';

// type of issueDate props;
interface IssueDateProps {
  onChange: (value: Scalars['DateTime']) => void;
  issueDate: string;
  expirationDate: string;
}

// functions !
function IssueDate(props: IssueDateProps) {
  const { onChange, issueDate, expirationDate } = props;
  const userCertificate = useSelector(userCertificateSelector);
  const navigate = useNavigate();

  // useEffect for Refreshing
  useEffect(() => {
    if (!userCertificate) navigate(-1);
  }, [userCertificate, navigate]);

  const handleChangeDatePicker = (value: Scalars['DateTime']) => {
    onChange(value);
  };

  return (
    <>
      <Stack sx={{ marginBottom: 2, pt: 3, px: 2 }} direction="row" alignItems="center" spacing={2}>
        <Typography variant="subtitle1">
          <FormattedMessage {...UserCertificates.issueDate} />
        </Typography>
      </Stack>
      <Divider />
      <Box sx={{ p: 3 }}>
        <DatePicker
          maxDate={expirationDate ? new Date(expirationDate) : undefined}
          value={!issueDate ? undefined : new Date(issueDate)}
          views={['month', 'year']}
          onChange={(date) => handleChangeDatePicker(date)}
        />
      </Box>
    </>
  );
}

export default IssueDate;
