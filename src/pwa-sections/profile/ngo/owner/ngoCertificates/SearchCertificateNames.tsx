import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { useCreateCertificateNameMutation } from 'src/_graphql/profile/certificates/mutations/createCertificateName.generated';
import { useLazySearchCertificateNamesQuery } from 'src/_graphql/profile/certificates/queries/searchCertificateNames.generated';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import UserCertificates from 'src/pwa-sections/profile/UserCertificatesPwa.messages';
import { useSelector } from 'src/store';
import { userCertificateSelector } from 'src/store/slices/profile/userCertificates-slice';
import { CertificateName } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

interface CertificateNameProps {
  onChange: (value: CertificateName) => void;
}

function SearchCertificateNames(props: CertificateNameProps) {
  const { onChange } = props;
  const [searchCertificate, { data: searchCertificateData, isFetching }] = useLazySearchCertificateNamesQuery();
  const [createCertificateName] = useCreateCertificateNameMutation();
  const navigate = useNavigate();
  const [isTyping, setIsTyping] = useState(false);
  const userCertificate = useSelector(userCertificateSelector);
  const { formatMessage } = useIntl();
  // useEffect for Refreshing
  useEffect(() => {
    if (!userCertificate) navigate(-1);
  }, [userCertificate, navigate]);

  const handleChangeInputSearch = (val: string) => {
    // is typing status
    if (val) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
    // Query
    if (val.length > 2)
      debounceFn(() =>
        searchCertificate({
          filter: {
            dto: {
              title: val,
            },
          },
        }),
      );
  };

  // send certificateName to server
  const handleChange = async (value: CertificateName & { inputValue: string }) => {
    if (value.inputValue) {
      const resData: any = await createCertificateName({
        filter: {
          dto: {
            title: value.inputValue,
          },
        },
      });
      if (resData?.data?.createCertificateName?.isSuccess) {
        const newData = resData?.data?.createCertificateName?.listDto?.items?.[0];
        onChange({ id: newData?.id, title: newData?.title });
      }
    } else {
      onChange(value);
    }
  };

  return (
    <Stack spacing={2} sx={{ bgcolor: '#fff', py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...UserCertificates.certificateName} />
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <AutoCompleteAddable
          autoFocus
          loading={isFetching}
          onInputChange={(ev, val) => handleChangeInputSearch(val)}
          onChange={(ev, val) => handleChange(val)}
          options={searchCertificateData?.searchCertificateNames?.listDto?.items || []}
          placeholder={formatMessage(UserCertificates.certificateName)}
        />
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            {!isTyping && (
              <Typography color="text.secondary" variant="body2">
                <FormattedMessage {...UserCertificates.startType} />
              </Typography>
            )}
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}

export default SearchCertificateNames;
